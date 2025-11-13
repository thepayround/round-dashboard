import { useCallback, useEffect, useMemo, useState } from 'react'

import type { BillingAddress } from '@/shared/types/business'
import {
  validateBillingAddress,
  validateBillingAddressField,
} from '@/shared/utils/companyValidation'
import type { ValidationError } from '@/shared/utils/validation'
import { getFieldError, hasFieldError } from '@/shared/utils/validation'

const createEmptyAddress = (): BillingAddress => ({
  street: '',
  street2: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
})

interface UseBillingAddressFormControllerProps {
  billingAddress?: BillingAddress
  shippingAddress?: BillingAddress
  onBillingAddressChange: (address: BillingAddress) => void
  onShippingAddressChange?: (address: BillingAddress) => void
  onValidationChange: (isValid: boolean) => void
  errors: ValidationError[]
  onErrorsChange: (errors: ValidationError[]) => void
  isOptional?: boolean
  showShipping?: boolean
}

export const useBillingAddressFormController = ({
  billingAddress,
  shippingAddress,
  onBillingAddressChange,
  onShippingAddressChange,
  onValidationChange,
  errors,
  onErrorsChange,
  isOptional = false,
  showShipping = false,
}: UseBillingAddressFormControllerProps) => {
  const [sameAsBilling, setSameAsBilling] = useState(true)

  const billingValue = useMemo(() => ({ ...createEmptyAddress(), ...billingAddress }), [billingAddress])
  const shippingValue = useMemo(() => ({ ...createEmptyAddress(), ...shippingAddress }), [shippingAddress])

  const normalizeErrors = useCallback(
    (field: keyof BillingAddress, nextErrors: ValidationError[] = []) => {
      const filtered = errors.filter(error => error.field !== field)
      onErrorsChange([...filtered, ...nextErrors])
    },
    [errors, onErrorsChange]
  )

  const evaluateValidation = useCallback(
    (address: BillingAddress) => {
      if (!isOptional) {
        const validation = validateBillingAddress(address)
        onValidationChange(validation.isValid)
        return
      }

      const hasAnyValue = Object.values(address).some(value => (value ?? '').toString().trim().length > 0)
      if (!hasAnyValue) {
        onValidationChange(true)
        return
      }

      const validation = validateBillingAddress(address)
      onValidationChange(validation.isValid)
    },
    [isOptional, onValidationChange]
  )

  useEffect(() => {
    evaluateValidation(billingValue)
  }, [billingValue, evaluateValidation])

  const handleAddressChange = useCallback(
    (addressType: 'billing' | 'shipping', field: keyof BillingAddress, value: string) => {
      if (addressType === 'billing') {
        const updatedAddress = { ...billingValue, [field]: value }
        onBillingAddressChange(updatedAddress)

        if (sameAsBilling && onShippingAddressChange) {
          onShippingAddressChange(updatedAddress)
        }

        if (hasFieldError(errors, field)) {
          normalizeErrors(field)
        }

        evaluateValidation(updatedAddress)
        return
      }

      if (addressType === 'shipping' && onShippingAddressChange) {
        const updatedAddress = { ...shippingValue, [field]: value }
        onShippingAddressChange(updatedAddress)
      }
    },
    [
      billingValue,
      shippingValue,
      sameAsBilling,
      onBillingAddressChange,
      onShippingAddressChange,
      errors,
      normalizeErrors,
      evaluateValidation,
    ]
  )

  const handleFieldBlur = useCallback(
    (field: keyof BillingAddress, value?: string) => {
      const fieldValue = value ?? billingValue[field] ?? ''
      const validation = validateBillingAddressField(field, fieldValue)

      if (!validation.isValid) {
        normalizeErrors(field, validation.errors)
      }
    },
    [billingValue, normalizeErrors]
  )

  const handleSameAsBillingToggle = useCallback(
    (checked: boolean) => {
      setSameAsBilling(checked)
      if (checked && onShippingAddressChange) {
        onShippingAddressChange(billingValue)
      }
    },
    [billingValue, onShippingAddressChange]
  )

  const fieldHasError = useCallback((field: keyof BillingAddress) => hasFieldError(errors, field), [errors])
  const fieldErrorMessage = useCallback(
    (field: keyof BillingAddress) => getFieldError(errors, field)?.message,
    [errors]
  )

  return {
    currentBillingAddress: billingValue,
    currentShippingAddress: shippingValue,
    sameAsBilling,
    showShipping: showShipping && Boolean(onShippingAddressChange),
    isOptional,
    handleAddressChange,
    handleFieldBlur,
    handleSameAsBillingToggle,
    hasBillingErrors: fieldHasError,
    getBillingError: fieldErrorMessage,
  }
}
