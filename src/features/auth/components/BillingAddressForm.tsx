import { motion } from 'framer-motion'
import { MapPin, Building, AlertCircle } from 'lucide-react'

import type { BillingAddress } from '@/shared/types/business'
import type { ValidationError } from '@/shared/utils/validation'
import { SUPPORTED_COUNTRIES } from '@/shared/types/business'
import {
  validateBillingAddress,
  validateBillingAddressField,
} from '@/shared/utils/companyValidation'
import { getFieldError, hasFieldError } from '@/shared/utils/validation'

interface BillingAddressFormProps {
  billingAddress?: BillingAddress
  onBillingAddressChange: (billingAddress: BillingAddress) => void
  onValidationChange: (isValid: boolean) => void
  errors: ValidationError[]
  onErrorsChange: (errors: ValidationError[]) => void
  isOptional?: boolean
}

export const BillingAddressForm = ({
  billingAddress,
  onBillingAddressChange,
  onValidationChange,
  errors,
  onErrorsChange,
  isOptional = false,
}: BillingAddressFormProps) => {
  // Initialize with empty address if none provided
  const currentAddress: BillingAddress = billingAddress ?? {
    street: '',
    street2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  }

  const handleInputChange = (field: keyof BillingAddress, value: string) => {
    const updatedAddress = { ...currentAddress, [field]: value }
    onBillingAddressChange(updatedAddress)

    // Clear field error when user starts typing
    if (hasFieldError(errors, field)) {
      onErrorsChange(errors.filter(error => error.field !== field))
    }

    // Validate entire form to update parent component
    if (!isOptional) {
      const validation = validateBillingAddress(updatedAddress)
      onValidationChange(validation.isValid)
    } else {
      // For optional form, consider it valid if all fields are empty or if filled fields are valid
      const hasAnyValue = Object.values(updatedAddress).some(val => val?.trim())
      if (hasAnyValue) {
        const validation = validateBillingAddress(updatedAddress)
        onValidationChange(validation.isValid)
      } else {
        onValidationChange(true) // Empty optional form is valid
      }
    }
  }

  const handleInputBlur = (field: keyof BillingAddress, value: string) => {
    // Only validate if not optional or if the form has some data
    const hasAnyValue = Object.values(currentAddress).some(val => val?.trim())

    if (!isOptional || hasAnyValue) {
      const fieldValidation = validateBillingAddressField(field, value)
      if (!fieldValidation.isValid) {
        onErrorsChange([
          ...errors.filter(error => error.field !== field),
          ...fieldValidation.errors,
        ])
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold auth-text mb-2"
        >
          Billing Address
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="auth-text-muted"
        >
          {isOptional
            ? 'You can add this information later in your account settings'
            : 'This information will be used for billing and invoicing'}
        </motion.p>
      </div>

      {/* Street Address */}
      <div>
        <label htmlFor="street" className="auth-label">
          Street Address {!isOptional && '*'}
        </label>
        <div className="input-container">
          <MapPin className="input-icon-left auth-icon-primary" />
          <input
            id="street"
            type="text"
            value={currentAddress.street}
            onChange={e => handleInputChange('street', e.target.value)}
            onBlur={e => handleInputBlur('street', e.target.value)}
            placeholder="123 Main Street"
            className={`auth-input input-with-icon-left ${
              hasFieldError(errors, 'street') ? 'auth-input-error' : ''
            }`}
            required={!isOptional}
          />
        </div>
        {hasFieldError(errors, 'street') && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{getFieldError(errors, 'street')?.message}</span>
          </motion.div>
        )}
      </div>

      {/* Street Address 2 */}
      <div>
        <label htmlFor="street2" className="auth-label">
          Street Address 2
        </label>
        <div className="input-container">
          <Building className="input-icon-left auth-icon-primary" />
          <input
            id="street2"
            type="text"
            value={currentAddress.street2 ?? ''}
            onChange={e => handleInputChange('street2', e.target.value)}
            placeholder="Apartment, suite, etc."
            className="auth-input input-with-icon-left"
          />
        </div>
      </div>

      {/* City & State Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* City */}
        <div>
          <label htmlFor="city" className="auth-label">
            City {!isOptional && '*'}
          </label>
          <div className="input-container">
            <Building className="input-icon-left auth-icon-primary" />
            <input
              id="city"
              type="text"
              value={currentAddress.city}
              onChange={e => handleInputChange('city', e.target.value)}
              onBlur={e => handleInputBlur('city', e.target.value)}
              placeholder="New York"
              className={`auth-input input-with-icon-left ${
                hasFieldError(errors, 'city') ? 'auth-input-error' : ''
              }`}
              required={!isOptional}
            />
          </div>
          {hasFieldError(errors, 'city') && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{getFieldError(errors, 'city')?.message}</span>
            </motion.div>
          )}
        </div>

        {/* State */}
        <div>
          <label htmlFor="state" className="auth-label">
            State/Province {!isOptional && '*'}
          </label>
          <div className="input-container">
            <MapPin className="input-icon-left auth-icon-primary" />
            <input
              id="state"
              type="text"
              value={currentAddress.state}
              onChange={e => handleInputChange('state', e.target.value)}
              onBlur={e => handleInputBlur('state', e.target.value)}
              placeholder="NY"
              className={`auth-input input-with-icon-left ${
                hasFieldError(errors, 'state') ? 'auth-input-error' : ''
              }`}
              required={!isOptional}
            />
          </div>
          {hasFieldError(errors, 'state') && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{getFieldError(errors, 'state')?.message}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* ZIP Code & Country Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ZIP Code */}
        <div>
          <label htmlFor="zipCode" className="auth-label">
            ZIP/Postal Code {!isOptional && '*'}
          </label>
          <div className="input-container">
            <MapPin className="input-icon-left auth-icon-primary" />
            <input
              id="zipCode"
              type="text"
              value={currentAddress.zipCode}
              onChange={e => handleInputChange('zipCode', e.target.value)}
              onBlur={e => handleInputBlur('zipCode', e.target.value)}
              placeholder="10001"
              className={`auth-input input-with-icon-left ${
                hasFieldError(errors, 'zipCode') ? 'auth-input-error' : ''
              }`}
              required={!isOptional}
            />
          </div>
          {hasFieldError(errors, 'zipCode') && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{getFieldError(errors, 'zipCode')?.message}</span>
            </motion.div>
          )}
        </div>

        {/* Country */}
        <div>
          <label htmlFor="country" className="auth-label">
            Country {!isOptional && '*'}
          </label>
          <div className="input-container">
            <Building className="input-icon-left auth-icon-primary" />
            <select
              id="country"
              value={currentAddress.country}
              onChange={e => handleInputChange('country', e.target.value)}
              onBlur={e => handleInputBlur('country', e.target.value)}
              className={`auth-input input-with-icon-left ${
                hasFieldError(errors, 'country') ? 'auth-input-error' : ''
              }`}
              required={!isOptional}
            >
              <option value="">Select country</option>
              {SUPPORTED_COUNTRIES.map(country => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          {hasFieldError(errors, 'country') && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{getFieldError(errors, 'country')?.message}</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
