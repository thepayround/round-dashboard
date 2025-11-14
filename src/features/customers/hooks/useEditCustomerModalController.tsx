import { useCallback, useEffect, useState } from 'react'

import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { customerService } from '@/shared/services/api/customer.service'
import type {
  CustomerResponse,
  CustomerUpdateRequest,
  CustomerAddressCreateRequest,
} from '@/shared/services/api/customer.service'
import type { CountryPhoneInfo } from '@/shared/services/api/phoneValidation.service'

interface UseEditCustomerModalControllerProps {
  customer: CustomerResponse
  onCustomerUpdated: (updatedCustomer: CustomerResponse) => void
  onClose: () => void
}

export const useEditCustomerModalController = ({
  customer,
  onCustomerUpdated,
  onClose,
}: UseEditCustomerModalControllerProps) => {
  const { showSuccess, showError } = useGlobalToast()

  const [formData, setFormData] = useState<CustomerUpdateRequest>(() => ({
    type: customer.type,
    email: customer.email,
    firstName: customer.firstName,
    lastName: customer.lastName,
    company: customer.company ?? '',
    phoneNumber: customer.phoneNumber ?? '',
    countryPhoneCode: '',
    taxNumber: customer.taxNumber ?? '',
    locale: customer.locale ?? 'en',
    timezone: customer.timezone ?? '',
    currency: customer.currency,
    portalAccess: customer.portalAccess,
    autoCollection: customer.autoCollection,
    tags: customer.tags,
    customFields: customer.customFields,
  }))

  const [billingAddress, setBillingAddress] = useState<CustomerAddressCreateRequest>({
    type: 'billing',
    isPrimary: true,
    line1: customer.billingAddress?.line1 ?? '',
    line2: customer.billingAddress?.line2 ?? '',
    city: customer.billingAddress?.city ?? '',
    state: customer.billingAddress?.state ?? '',
    country: customer.billingAddress?.country ?? '',
    zipCode: customer.billingAddress?.zipCode ?? '',
  })

  const [shippingAddress, setShippingAddress] = useState<CustomerAddressCreateRequest>({
    type: 'shipping',
    isPrimary: false,
    line1: customer.shippingAddress?.line1 ?? '',
    line2: customer.shippingAddress?.line2 ?? '',
    city: customer.shippingAddress?.city ?? '',
    state: customer.shippingAddress?.state ?? '',
    country: customer.shippingAddress?.country ?? '',
    zipCode: customer.shippingAddress?.zipCode ?? '',
  })

  const [newTag, setNewTag] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setFormData({
      type: customer.type,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      company: customer.company ?? '',
      phoneNumber: customer.phoneNumber ?? '',
      countryPhoneCode: '',
      taxNumber: customer.taxNumber ?? '',
      locale: customer.locale ?? 'en',
      timezone: customer.timezone ?? '',
      currency: customer.currency,
      portalAccess: customer.portalAccess,
      autoCollection: customer.autoCollection,
      tags: customer.tags,
      customFields: customer.customFields,
    })

    setBillingAddress({
      type: 'billing',
      isPrimary: true,
      line1: customer.billingAddress?.line1 ?? '',
      line2: customer.billingAddress?.line2 ?? '',
      city: customer.billingAddress?.city ?? '',
      state: customer.billingAddress?.state ?? '',
      country: customer.billingAddress?.country ?? '',
      zipCode: customer.billingAddress?.zipCode ?? '',
    })

    setShippingAddress({
      type: 'shipping',
      isPrimary: false,
      line1: customer.shippingAddress?.line1 ?? '',
      line2: customer.shippingAddress?.line2 ?? '',
      city: customer.shippingAddress?.city ?? '',
      state: customer.shippingAddress?.state ?? '',
      country: customer.shippingAddress?.country ?? '',
      zipCode: customer.shippingAddress?.zipCode ?? '',
    })

    setNewTag('')
  }, [customer])

  const handleInputChange = useCallback((field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  const handleAddTag = useCallback(() => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }))
      setNewTag('')
    }
  }, [formData.tags, newTag])

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove),
    }))
  }, [])

  const handleAddressChange = useCallback(
    (addressType: 'billing' | 'shipping', field: string, value: string) => {
      const setter = addressType === 'billing' ? setBillingAddress : setShippingAddress
      setter(prev => ({
        ...prev,
        [field]: value,
      }))
    },
    []
  )

  const handleCopyBillingToShipping = useCallback(() => {
    setShippingAddress({
      ...billingAddress,
      type: 'shipping',
      isPrimary: false,
    })
  }, [billingAddress])

  const handleTagInputChange = useCallback((value: string) => {
    setNewTag(value)
  }, [])

  const handlePhoneChange = useCallback((phoneNumber: string) => {
    setFormData(prev => ({
      ...prev,
      phoneNumber,
    }))
  }, [])

  const handlePhoneBlur = useCallback((phoneNumber: string, countryInfo: CountryPhoneInfo | null) => {
    if (countryInfo?.phoneCode) {
      setFormData(prev => ({
        ...prev,
        countryPhoneCode: countryInfo.phoneCode,
      }))
    }

    if (!phoneNumber?.trim()) {
      return
    }
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSaving(true)

      try {
        const hasAddressData = (address: CustomerAddressCreateRequest) =>
          Boolean(address.line1.trim() || address.city.trim() || address.country.trim())

        const updatePayload: CustomerUpdateRequest = {
          ...formData,
          type: customer.type,
          tags: formData.tags ?? [],
          customFields: formData.customFields ?? {},
        }

        if (hasAddressData(billingAddress)) {
          updatePayload.billingAddress = billingAddress
        }

        if (hasAddressData(shippingAddress)) {
          updatePayload.shippingAddress = shippingAddress
        }

        const updatedCustomer = await customerService.update(customer.id, updatePayload)
        showSuccess('Customer updated successfully')
        onCustomerUpdated(updatedCustomer)
        onClose()
      } catch (error) {
        if (error instanceof Error) {
          showError(`Failed to update customer: ${error.message}`)
        } else {
          showError('Failed to update customer: Unknown error')
        }
      } finally {
        setIsSaving(false)
      }
    },
    [
      billingAddress,
      customer.id,
      customer.type,
      formData,
      onClose,
      onCustomerUpdated,
      setIsSaving,
      shippingAddress,
      showError,
      showSuccess,
    ]
  )

  return {
    formData,
    billingAddress,
    shippingAddress,
    newTag,
    isSaving,
    handleInputChange,
    handleAddTag,
    handleRemoveTag,
    handleTagInputChange,
    handlePhoneChange,
    handlePhoneBlur,
    handleAddressChange,
    handleCopyBillingToShipping,
    handleSubmit,
  }
}
