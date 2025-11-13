import { useCallback, useMemo } from 'react'

import type { AddressInfo, EnhancedAddressInfo } from '../types/onboarding'

interface UseAddressStepControllerParams {
  data: EnhancedAddressInfo
  onChange: (data: EnhancedAddressInfo) => void
}

interface UseAddressStepControllerReturn {
  billingAddress: AddressInfo
  handleAddressChange: (field: keyof AddressInfo, value: string) => void
  handleSelectChange: (field: keyof AddressInfo, value: string) => void
}

const defaultBillingAddress: AddressInfo = {
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
}

export const useAddressStepController = ({
  data,
  onChange,
}: UseAddressStepControllerParams): UseAddressStepControllerReturn => {
  const billingAddress = useMemo<AddressInfo>(
    () => ({
      ...defaultBillingAddress,
      ...data.billingAddress,
      addressType: 'billing',
    }),
    [data.billingAddress]
  )

  const handleAddressChange = useCallback(
    (field: keyof AddressInfo, value: string) => {
      const updatedBilling = { ...billingAddress, [field]: value, addressType: 'billing' as const }
      onChange({
        ...data,
        billingAddress: updatedBilling,
      })
    },
    [billingAddress, data, onChange]
  )

  const handleSelectChange = useCallback(
    (field: keyof AddressInfo, value: string) => {
      handleAddressChange(field, value)
    },
    [handleAddressChange]
  )

  return {
    billingAddress,
    handleAddressChange,
    handleSelectChange,
  }
}
