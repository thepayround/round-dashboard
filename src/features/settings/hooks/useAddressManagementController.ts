import { useCallback, useEffect, useMemo, useState } from 'react'

import type { EnhancedAddressInfo } from '@/features/onboarding/types/onboarding'
import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { useOrganization } from '@/shared/hooks/api/useOrganization'
import { organizationService } from '@/shared/services/api/organization.service'
import type { CreateAddressData, UpdateAddressData } from '@/shared/types/api'

const createEmptyAddress = () => ({
  name: '',
  street: '',
  addressLine1: '',
  addressLine2: '',
  number: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  addressType: 'billing',
  isPrimary: true,
})

const defaultAddressState: EnhancedAddressInfo = {
  billingAddress: createEmptyAddress(),
  shippingAddress: {
    ...createEmptyAddress(),
    addressType: 'shipping',
    isPrimary: false,
  },
  sameAsBilling: true,
}

export const useAddressManagementController = () => {
  const { getCurrentOrganization } = useOrganization()
  const { showSuccess, showError } = useGlobalToast()

  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const [addressFormData, setAddressFormData] = useState<EnhancedAddressInfo>(defaultAddressState)
  const [initialFormData, setInitialFormData] = useState<EnhancedAddressInfo>(defaultAddressState)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [apiError, setApiError] = useState('')

  const loadAddresses = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await getCurrentOrganization()
      if (response.success && response.data) {
        const organization = response.data
        setOrganizationId(organization.organizationId)

        if (organization.address) {
          const billing = organization.address
          const mapped: EnhancedAddressInfo = {
            billingAddress: {
              name: billing.name ?? '',
              street: billing.addressLine1 ?? '',
              addressLine1: billing.addressLine1 ?? '',
              addressLine2: billing.addressLine2 ?? '',
              number: billing.number ?? '',
              city: billing.city ?? '',
              state: billing.state ?? '',
              zipCode: billing.zipCode ?? '',
              country: billing.country ?? '',
              addressType: billing.addressType ?? 'billing',
              isPrimary: billing.isPrimary ?? true,
            },
            shippingAddress: defaultAddressState.shippingAddress,
            sameAsBilling: true,
          }
          setAddressFormData(mapped)
          setInitialFormData(mapped)
        } else {
          setAddressFormData(defaultAddressState)
          setInitialFormData(defaultAddressState)
        }
      }
    } catch (error) {
      showError('Failed to load organization data')
    } finally {
      setIsLoading(false)
    }
  }, [getCurrentOrganization, showError])

  useEffect(() => {
    loadAddresses()
  }, [loadAddresses])

  const handleStartEdit = useCallback(() => {
    setIsEditing(true)
    setApiError('')
  }, [])

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false)
    setApiError('')
    setAddressFormData(initialFormData)
  }, [initialFormData])

  const isFormValid = useMemo(() => {
    const billing = addressFormData.billingAddress
    return (
      billing.name.trim() !== '' &&
      billing.addressLine1.trim() !== '' &&
      billing.number.trim() !== '' &&
      billing.city.trim() !== '' &&
      billing.state.trim() !== '' &&
      billing.zipCode.trim() !== '' &&
      billing.country.trim() !== ''
    )
  }, [addressFormData])

  const buildCreatePayload = useCallback(
    (): CreateAddressData => {
      const billing = addressFormData.billingAddress
      return {
        name: billing.name,
        addressLine1: billing.addressLine1,
        addressLine2: billing.addressLine2 ?? '',
        number: billing.number ?? '',
        city: billing.city,
        state: billing.state,
        zipCode: billing.zipCode,
        country: billing.country,
        addressType: 'billing',
        isPrimary: true,
      }
    },
    [addressFormData]
  )

  const buildUpdatePayload = useCallback((): UpdateAddressData => {
    const billing = addressFormData.billingAddress
    return {
      name: billing.name,
      addressLine1: billing.addressLine1,
      addressLine2: billing.addressLine2 ?? '',
      number: billing.number ?? '',
      city: billing.city,
      state: billing.state,
      zipCode: billing.zipCode,
      country: billing.country,
      addressType: 'billing',
      isPrimary: true,
    }
  }, [addressFormData])

  const handleSave = useCallback(async () => {
    if (!organizationId) {
      setApiError('Organization not found')
      return
    }

    if (!isFormValid) {
      setApiError('Please complete all required fields')
      return
    }

    try {
      setIsSaving(true)
      setApiError('')

      const hasExistingAddress = Boolean(initialFormData.billingAddress.addressLine1?.trim())

      if (hasExistingAddress) {
        const updatePayload = buildUpdatePayload()
        const response = await organizationService.updateOrganizationAddress(organizationId, updatePayload)
        if (!response.success) {
          throw new Error(response.error ?? 'Failed to update billing address')
        }
      } else {
        const createPayload = buildCreatePayload()
        const response = await organizationService.createOrganizationAddress(organizationId, createPayload)
        if (!response.success) {
          throw new Error(response.error ?? 'Failed to create billing address')
        }
      }

      showSuccess('Billing address saved successfully')
      setInitialFormData(addressFormData)
      setIsEditing(false)
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to save billing address')
    } finally {
      setIsSaving(false)
    }
  }, [addressFormData, buildCreatePayload, buildUpdatePayload, initialFormData, isFormValid, organizationId, showSuccess])

  const buttonLabel = isSaving ? 'Saving...' : 'Save Address'

  return {
    addressFormData,
    setAddressFormData,
    isLoading,
    isSaving,
    isEditing,
    apiError,
    buttonLabel,
    isFormValid,
    handleStartEdit,
    handleCancelEdit,
    handleSave,
  }
}
