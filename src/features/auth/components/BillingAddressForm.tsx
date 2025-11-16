import { motion } from 'framer-motion'
import { MapPin, Building, AlertCircle, Truck } from 'lucide-react'

import { useBillingAddressFormController } from '../hooks/useBillingAddressFormController'

import type { BillingAddress } from '@/shared/types/business'
import { Input, Toggle } from '@/shared/ui'
import { ApiDropdown, countryDropdownConfig } from '@/shared/ui/ApiDropdown'
import type { ValidationError } from '@/shared/utils/validation'


/**
 * Enhanced AddressForm component with optional shipping address functionality
 *
 * Usage Examples:
 *
 * // Billing address only (backward compatible)
 * <BillingAddressForm
 *   billingAddress={billingAddress}
 *   onBillingAddressChange={setBillingAddress}
 *   onValidationChange={setIsValid}
 *   errors={errors}
 *   onErrorsChange={setErrors}
 * />
 *
 * // Billing + Shipping with "Same as billing" functionality
 * <AddressForm
 *   billingAddress={billingAddress}
 *   shippingAddress={shippingAddress}
 *   onBillingAddressChange={setBillingAddress}
 *   onShippingAddressChange={setShippingAddress}
 *   onValidationChange={setIsValid}
 *   errors={errors}
 *   onErrorsChange={setErrors}
 *   showShipping={true}
 * />
 */

interface AddressFormProps {
  billingAddress?: BillingAddress
  shippingAddress?: BillingAddress
  onBillingAddressChange: (billingAddress: BillingAddress) => void
  onShippingAddressChange?: (shippingAddress: BillingAddress) => void
  onValidationChange: (isValid: boolean) => void
  errors: ValidationError[]
  onErrorsChange: (errors: ValidationError[]) => void
  isOptional?: boolean
  showShipping?: boolean
}

// Keep backward compatibility
interface BillingAddressFormProps {
  billingAddress?: BillingAddress
  onBillingAddressChange: (billingAddress: BillingAddress) => void
  onValidationChange: (isValid: boolean) => void
  errors: ValidationError[]
  onErrorsChange: (errors: ValidationError[]) => void
  isOptional?: boolean
}

// Enhanced AddressForm component with shipping functionality
export const AddressForm = ({
  billingAddress,
  shippingAddress,
  onBillingAddressChange,
  onShippingAddressChange,
  onValidationChange,
  errors,
  onErrorsChange,
  isOptional = false,
  showShipping = false,
}: AddressFormProps) => {
  const {
    currentBillingAddress,
    currentShippingAddress,
    sameAsBilling,
    handleAddressChange,
    handleFieldBlur,
    hasBillingErrors,
    getBillingError,
    handleSameAsBillingToggle,
    showShipping: resolvedShowShipping,
  } = useBillingAddressFormController({
    billingAddress,
    shippingAddress,
    onBillingAddressChange,
    onShippingAddressChange,
    onValidationChange,
    errors,
    onErrorsChange,
    isOptional,
    showShipping,
  })

  const showShippingEnabled = resolvedShowShipping
  const handleInputBlur = (field: keyof BillingAddress, value: string) => {
    handleFieldBlur(field, value)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/4 border border-white/12 rounded-lg p-6 space-y-8"
    >
      {/* Billing Address Section */}
      <div className="space-y-6">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-normal tracking-tight text-white mb-2"
          >
            Billing Address
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/85"
          >
            {isOptional
              ? 'You can add this information later in your account settings'
              : 'This information will be used for billing and invoicing'}
          </motion.p>
        </div>

        {/* Billing Address Fields */}
        <div className="space-y-6">
          {/* Street Address */}
          <Input
            id="billing-street"
            label={`Street Address${!isOptional ? ' *' : ''}`}
            leftIcon={MapPin}
            type="text"
            value={currentBillingAddress.street}
            onChange={e => handleAddressChange('billing', 'street', e.target.value)}
            onBlur={e => handleInputBlur('street', e.target.value)}
            placeholder="123 Main Street"
            error={hasBillingErrors('street') ? getBillingError('street') : undefined}
            required={!isOptional}
          />

          {/* Street Address 2 */}
          <Input
            id="billing-street2"
            label="Street Address 2"
            leftIcon={Building}
            type="text"
            value={currentBillingAddress.street2 ?? ''}
            onChange={e => handleAddressChange('billing', 'street2', e.target.value)}
            placeholder="Apartment, suite, etc."
          />

          {/* City & State Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="billing-city"
              label={`City${!isOptional ? ' *' : ''}`}
              leftIcon={Building}
              type="text"
              value={currentBillingAddress.city}
              onChange={e => handleAddressChange('billing', 'city', e.target.value)}
              onBlur={e => handleInputBlur('city', e.target.value)}
              placeholder="New York"
              error={hasBillingErrors('city') ? getBillingError('city') : undefined}
              required={!isOptional}
            />

            <Input
              id="billing-state"
              label={`State/Province${!isOptional ? ' *' : ''}`}
              leftIcon={MapPin}
              type="text"
              value={currentBillingAddress.state}
              onChange={e => handleAddressChange('billing', 'state', e.target.value)}
              onBlur={e => handleInputBlur('state', e.target.value)}
              placeholder="NY"
              error={hasBillingErrors('state') ? getBillingError('state') : undefined}
              required={!isOptional}
            />
          </div>

          {/* ZIP Code & Country Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="billing-zipCode"
              label={`ZIP/Postal Code${!isOptional ? ' *' : ''}`}
              leftIcon={MapPin}
              type="text"
              value={currentBillingAddress.zipCode}
              onChange={e => handleAddressChange('billing', 'zipCode', e.target.value)}
              onBlur={e => handleInputBlur('zipCode', e.target.value)}
              placeholder="10001"
              error={hasBillingErrors('zipCode') ? getBillingError('zipCode') : undefined}
              required={!isOptional}
            />

            <div>
              <span className="block text-sm font-normal text-white/90 mb-2 tracking-tight">
                Country {!isOptional && '*'}
              </span>
              <ApiDropdown
                config={countryDropdownConfig}
                value={currentBillingAddress.country}
                onSelect={value => handleAddressChange('billing', 'country', value)}
                onClear={() => handleAddressChange('billing', 'country', '')}
                error={hasBillingErrors('country')}
                allowClear={isOptional}
              />
              {hasBillingErrors('country') && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center space-x-2 text-auth-error font-medium text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{getBillingError('country')}</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Address Section */}
    {showShippingEnabled && (
        <div className="space-y-6">
          {/* Header with Toggle */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-normal tracking-tight text-white flex items-center space-x-2">
              <Truck className="w-5 h-5 text-[#00BCD4]" />
              <span>Shipping Address</span>
            </h3>

            <Toggle
              label="Same as billing"
              checked={sameAsBilling}
              onChange={(e) => handleSameAsBillingToggle(e.target.checked)}
              size="lg"
              color="cyan"
              aria-label="Use Billing as Shipping Address"
            />
          </div>

          {/* Shipping Address Fields or Same as Billing Message */}
          {sameAsBilling ? (
            <div className="p-4 bg-[#00BCD4]/10 border border-[#00BCD4]/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#00BCD4]/20 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-[#00BCD4]" />
                </div>
                <div>
                  <p className="text-white text-sm font-normal">Shipping address will be same as billing address</p>
                  <p className="text-white/85 text-xs">Turn off the toggle above to enter a different shipping address</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Shipping Street Address */}
              <Input
                id="shipping-street"
                label={`Street Address${!isOptional ? ' *' : ''}`}
                leftIcon={MapPin}
                type="text"
                value={currentShippingAddress.street}
                onChange={e => handleAddressChange('shipping', 'street', e.target.value)}
                placeholder="123 Main Street"
                required={!isOptional}
              />

              {/* Shipping Street Address 2 */}
              <Input
                id="shipping-street2"
                label="Street Address 2"
                leftIcon={Building}
                type="text"
                value={currentShippingAddress.street2 ?? ''}
                onChange={e => handleAddressChange('shipping', 'street2', e.target.value)}
                placeholder="Apartment, suite, etc."
              />

              {/* Shipping City & State Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="shipping-city"
                  label={`City${!isOptional ? ' *' : ''}`}
                  leftIcon={Building}
                  type="text"
                  value={currentShippingAddress.city}
                  onChange={e => handleAddressChange('shipping', 'city', e.target.value)}
                  placeholder="New York"
                  required={!isOptional}
                />

                <Input
                  id="shipping-state"
                  label={`State/Province${!isOptional ? ' *' : ''}`}
                  leftIcon={MapPin}
                  type="text"
                  value={currentShippingAddress.state}
                  onChange={e => handleAddressChange('shipping', 'state', e.target.value)}
                  placeholder="NY"
                  required={!isOptional}
                />
              </div>

              {/* Shipping ZIP Code & Country Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="shipping-zipCode"
                  label={`ZIP/Postal Code${!isOptional ? ' *' : ''}`}
                  leftIcon={MapPin}
                  type="text"
                  value={currentShippingAddress.zipCode}
                  onChange={e => handleAddressChange('shipping', 'zipCode', e.target.value)}
                  placeholder="10001"
                  required={!isOptional}
                />

                <div>
                  <span className="block text-sm font-normal text-white/90 mb-2 tracking-tight">
                    Country {!isOptional && '*'}
                  </span>
                  <ApiDropdown
                    config={countryDropdownConfig}
                    value={currentShippingAddress.country}
                    onSelect={value => handleAddressChange('shipping', 'country', value)}
                    onClear={() => handleAddressChange('shipping', 'country', '')}
                    allowClear={isOptional}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

// Backward compatible BillingAddressForm
export const BillingAddressForm = ({
  billingAddress,
  onBillingAddressChange,
  onValidationChange,
  errors,
  onErrorsChange,
  isOptional = false,
}: BillingAddressFormProps) => (
    <AddressForm
      billingAddress={billingAddress}
      onBillingAddressChange={onBillingAddressChange}
      onValidationChange={onValidationChange}
      errors={errors}
      onErrorsChange={onErrorsChange}
      isOptional={isOptional}
      showShipping={false}
    />
  )





