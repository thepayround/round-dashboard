import { useCallback, useEffect, useState } from 'react'

import { useGlobalToast } from '@/shared/contexts/ToastContext'
import type { CustomerCreateRequest } from '@/shared/services/api/customer.service'
import { customerService } from '@/shared/services/api/customer.service'
import type { CountryPhoneInfo } from '@/shared/services/api/phoneValidation.service'
import { phoneValidationService } from '@/shared/services/api/phoneValidation.service'
import { CustomerType } from '@/shared/types/customer.types'
import { phoneValidator } from '@/shared/utils/phoneValidation'
import type { ValidationError } from '@/shared/utils/validation'

const initialFormData: CustomerCreateRequest = {
  type: CustomerType.Individual,
  email: '',
  firstName: '',
  lastName: '',
  company: '',
  phoneNumber: '',
  countryPhoneCode: '',
  taxNumber: '',
  locale: 'en',
  timezone: '',
  currency: '',
  portalAccess: true,
  autoCollection: true,
  tags: [],
  customFields: {},
  billingAddress: {
    line1: '',
    line2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
  shippingAddress: {
    line1: '',
    line2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
}

interface UseAddCustomerModalControllerProps {
  onClose: () => void
  onCustomerAdded: () => void
  isOpen?: boolean
}

export const useAddCustomerModalController = ({
  onClose,
  onCustomerAdded,
  isOpen = false,
}: UseAddCustomerModalControllerProps) => {
  const { showSuccess, showError } = useGlobalToast()

  const [formData, setFormData] = useState<CustomerCreateRequest>(initialFormData)

  // Check for duplicate customer data when modal opens
  useEffect(() => {
    if (isOpen) {
      const duplicateDataStr = sessionStorage.getItem('duplicateCustomerData')
      if (duplicateDataStr) {
        try {
          const duplicateData = JSON.parse(duplicateDataStr)
          // Map the customer response to create request format
          setFormData({
            type: duplicateData.isBusinessCustomer ? CustomerType.Business : CustomerType.Individual,
            email: duplicateData.email ?? '',
            firstName: duplicateData.firstName ?? '',
            lastName: duplicateData.lastName ?? '',
            company: duplicateData.company ?? '',
            phoneNumber: duplicateData.phoneNumber ?? '',
            countryPhoneCode: duplicateData.countryPhoneCode ?? '',
            taxNumber: duplicateData.taxNumber ?? '',
            locale: duplicateData.locale ?? 'en',
            timezone: duplicateData.timezone ?? '',
            currency: duplicateData.currency ?? '',
            portalAccess: duplicateData.portalAccess ?? true,
            autoCollection: duplicateData.autoCollection ?? true,
            tags: duplicateData.tags ?? [],
            customFields: duplicateData.customFields ?? {},
            billingAddress: duplicateData.billingAddress ?? initialFormData.billingAddress,
            shippingAddress: duplicateData.shippingAddress ?? initialFormData.shippingAddress,
          })
          // Clear the session storage after loading
          sessionStorage.removeItem('duplicateCustomerData')
        } catch (e) {
          console.error('Failed to parse duplicate customer data:', e)
          sessionStorage.removeItem('duplicateCustomerData')
        }
      }
    }
  }, [isOpen])
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [loading, setLoading] = useState(false)
  const [currentTag, setCurrentTag] = useState('')
  const [sameAsBilling, setSameAsBilling] = useState(true)

  const hasFieldError = useCallback((field: string) => errors.some(error => error.field === field), [errors])

  const getFieldError = useCallback(
    (field: string) => errors.find(error => error.field === field)?.message ?? '',
    [errors]
  )

  const clearFieldError = useCallback((field: string) => {
    if (hasFieldError(field)) {
      setErrors(prev => prev.filter(error => error.field !== field))
    }
  }, [hasFieldError])

  const isFormValid = useCallback(() => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      return false
    }

    if (formData.type === CustomerType.Business && !formData.company?.trim()) {
      return false
    }

    if (formData.phoneNumber?.trim() && !phoneValidator.hasMinimumContent(formData.phoneNumber)) {
      return false
    }

    const nonPhoneErrors = errors.filter(error => error.field !== 'phoneNumber')
    return nonPhoneErrors.length === 0
  }, [errors, formData])

  const handleInputChange = useCallback(
    (field: string, value: string | boolean | number) => {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }))
      clearFieldError(field)
    },
    [clearFieldError]
  )

  const handleAddressChange = useCallback(
    (addressType: 'billingAddress' | 'shippingAddress', field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        [addressType]: {
          ...prev[addressType],
          [field]: value,
        },
      }))

      if (addressType === 'billingAddress' && sameAsBilling) {
        setFormData(prev => ({
          ...prev,
          shippingAddress: {
            line1: field === 'line1' ? value : prev.billingAddress?.line1 ?? '',
            line2: field === 'line2' ? value : prev.billingAddress?.line2 ?? '',
            city: field === 'city' ? value : prev.billingAddress?.city ?? '',
            state: field === 'state' ? value : prev.billingAddress?.state ?? '',
            country: field === 'country' ? value : prev.billingAddress?.country ?? '',
            zipCode: field === 'zipCode' ? value : prev.billingAddress?.zipCode ?? '',
          },
        }))
      }
    },
    [sameAsBilling]
  )

  const handleCustomerTypeChange = useCallback((type: CustomerType) => {
    setFormData(prev => ({
      ...prev,
      type,
    }))
  }, [])

  const handleAddTag = useCallback(() => {
    if (currentTag.trim() && !(formData.tags ?? []).includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags ?? []), currentTag.trim()],
      }))
      setCurrentTag('')
    }
  }, [currentTag, formData.tags])

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags ?? []).filter(tag => tag !== tagToRemove),
    }))
  }, [])

  const handleTagInputChange = useCallback((value: string) => {
    setCurrentTag(value)
  }, [])

  const handlePhoneChange = useCallback((phoneNumber: string) => {
    setFormData(prev => ({ ...prev, phoneNumber }))
    clearFieldError('phoneNumber')
  }, [clearFieldError])

  const handlePhoneBlur = useCallback(
    async (phoneNumber: string, countryInfo: CountryPhoneInfo | null) => {
      if (countryInfo?.phoneCode) {
        setFormData(prev => ({ ...prev, countryPhoneCode: countryInfo.phoneCode }))
      }

      if (!phoneNumber?.trim()) {
        return
      }

      try {
        const countryCode = countryInfo?.countryCode ?? 'GR'
        const result = await phoneValidationService.validatePhoneNumber({
          phoneNumber: phoneNumber.trim(),
          countryCode,
        })

        if (!result.isValid && result.error) {
          setErrors(prev => [
            ...prev.filter(error => error.field !== 'phoneNumber'),
            { field: 'phoneNumber', message: result.error ?? 'Phone number is invalid', code: 'INVALID_PHONE' },
          ])
        }
      } catch (validationError) {
        console.error('Phone validation failed:', validationError)
      }
    },
    []
  )

  const resetForm = useCallback(() => {
    setFormData(initialFormData)
    setErrors([])
    setCurrentTag('')
    setSameAsBilling(true)
  }, [])

  const handleSameAsBillingChange = useCallback((checked: boolean) => {
    setSameAsBilling(checked)

    if (checked) {
      setFormData(prev => {
        const fallbackAddress =
          prev.billingAddress ??
          initialFormData.billingAddress ?? {
            line1: '',
            line2: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
          }

        return {
          ...prev,
          shippingAddress: {
            line1: fallbackAddress?.line1 ?? '',
            line2: fallbackAddress?.line2 ?? '',
            city: fallbackAddress?.city ?? '',
            state: fallbackAddress?.state ?? '',
            zipCode: fallbackAddress?.zipCode ?? '',
            country: fallbackAddress?.country ?? '',
          },
        }
      })
    }
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)

      if (!isFormValid()) {
        showError('Please fill in all required fields correctly')
        setLoading(false)
        return
      }

      if (errors.length > 0) {
        showError('Please fix the validation errors before submitting')
        setLoading(false)
        return
      }

      try {
        const cleanCustomerData: CustomerCreateRequest = {
          type: formData.type,
          email: formData.email.trim(),
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          company: formData.company?.trim() ?? undefined,
          phoneNumber: formData.phoneNumber?.trim() ?? undefined,
          countryPhoneCode: formData.countryPhoneCode ?? undefined,
          taxNumber: formData.taxNumber?.trim() ?? undefined,
          locale: formData.locale ?? 'en',
          timezone: formData.timezone ?? 'UTC',
          currency: formData.currency ?? 'USD',
          portalAccess: formData.portalAccess,
          autoCollection: formData.autoCollection,
          tags: formData.tags && formData.tags.length > 0 ? formData.tags : [],
          customFields: formData.customFields ?? {},
        }

        if (
          formData.billingAddress?.line1?.trim() &&
          formData.billingAddress.city?.trim() &&
          formData.billingAddress.country?.trim() &&
          formData.billingAddress.zipCode?.trim()
        ) {
          cleanCustomerData.billingAddress = {
            type: 'billing',
            isPrimary: true,
            name: 'Billing Address',
            line1: formData.billingAddress.line1.trim(),
            line2: formData.billingAddress.line2?.trim() ?? undefined,
            number: '1',
            city: formData.billingAddress.city.trim(),
            state: formData.billingAddress.state?.trim() ?? undefined,
            country: formData.billingAddress.country.trim(),
            zipCode: formData.billingAddress.zipCode.trim(),
          }

          if (sameAsBilling) {
            cleanCustomerData.shippingAddress = {
              ...cleanCustomerData.billingAddress,
              type: 'shipping',
              isPrimary: false,
              name: 'Shipping Address',
            }
          }
        }

        if (
          !sameAsBilling &&
          formData.shippingAddress?.line1?.trim() &&
          formData.shippingAddress.city?.trim() &&
          formData.shippingAddress.country?.trim() &&
          formData.shippingAddress.zipCode?.trim()
        ) {
          cleanCustomerData.shippingAddress = {
            type: 'shipping',
            isPrimary: false,
            name: 'Shipping Address',
            line1: formData.shippingAddress.line1.trim(),
            line2: formData.shippingAddress.line2?.trim() ?? undefined,
            number: '1',
            city: formData.shippingAddress.city.trim(),
            state: formData.shippingAddress.state?.trim() ?? undefined,
            country: formData.shippingAddress.country.trim(),
            zipCode: formData.shippingAddress.zipCode.trim(),
          }
        }

        await customerService.create(cleanCustomerData)
        showSuccess('Customer created successfully')
        onCustomerAdded()
        onClose()
        resetForm()
      } catch (submissionError) {
        if (submissionError instanceof Error) {
          showError(`Failed to create customer: ${submissionError.message}`)
        } else if (submissionError && typeof submissionError === 'object' && 'response' in submissionError) {
          const apiError = submissionError as { response?: { data?: { message?: string } } }
          if (apiError.response?.data?.message) {
            showError(`Failed to create customer: ${apiError.response.data.message}`)
          } else {
            showError('Failed to create customer: API Error')
          }
        } else {
          showError('Failed to create customer: Unknown error')
        }
      } finally {
        setLoading(false)
      }
    },
    [errors, formData, isFormValid, sameAsBilling, onCustomerAdded, onClose, resetForm, showError, showSuccess]
  )

  return {
    formData,
    errors,
    loading,
    currentTag,
    sameAsBilling,
    hasFieldError,
    getFieldError,
    handleCustomerTypeChange,
    handleInputChange,
    handleAddressChange,
    handleAddTag,
    handleRemoveTag,
    handleTagInputChange,
    handlePhoneChange,
    handlePhoneBlur,
    handleSameAsBillingChange,
    handleSubmit,
    isFormValid,
  }
}
