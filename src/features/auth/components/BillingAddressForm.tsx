import { motion } from 'framer-motion'
import { MapPin, Building, AlertCircle, Truck } from 'lucide-react'

import { useBillingAddressFormController } from '../hooks/useBillingAddressFormController'

import type { BillingAddress } from '@/shared/types/business'
import { Input } from '@/shared/ui'
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
          <div>
            <label htmlFor="billing-street" className="block text-sm font-normal text-white/90 mb-2 tracking-tight">
              Street Address {!isOptional && '*'}
            </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-auth-icon-primary z-10" />
                <Input
                  id="billing-street"
                  type="text"
                  value={currentBillingAddress.street}
                  onChange={e => handleAddressChange('billing', 'street', e.target.value)}
                  onBlur={e => handleInputBlur('street', e.target.value)}
                  placeholder="123 Main Street"
                  className="pl-9"
                  variant={hasBillingErrors('street') ? 'error' : 'default'}
                  required={!isOptional}
                  aria-describedby={hasBillingErrors('street') ? 'billing-street-error' : undefined}
                />
              </div>
            {hasBillingErrors('street') && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center space-x-2 text-auth-error font-medium text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{getBillingError('street')}</span>
              </motion.div>
            )}
          </div>

          {/* Street Address 2 */}
          <div>
            <label htmlFor="billing-street2" className="block text-sm font-normal text-white/90 mb-2 tracking-tight">
              Street Address 2
            </label>
             <div className="relative">
               <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-auth-icon-primary z-10" />
               <Input
                 id="billing-street2"
                 type="text"
                 value={currentBillingAddress.street2 ?? ''}
                 onChange={e => handleAddressChange('billing', 'street2', e.target.value)}
                 placeholder="Apartment, suite, etc."
                 className="pl-9"
               />
             </div>
          </div>

          {/* City & State Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="billing-city" className="block text-sm font-normal text-white/90 mb-2 tracking-tight">
                City {!isOptional && '*'}
              </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-auth-icon-primary z-10" />
                  <Input
                    id="billing-city"
                    type="text"
                    value={currentBillingAddress.city}
                    onChange={e => handleAddressChange('billing', 'city', e.target.value)}
                    onBlur={e => handleInputBlur('city', e.target.value)}
                    placeholder="New York"
                    className="pl-9"
                    variant={hasBillingErrors('city') ? 'error' : 'default'}
                    required={!isOptional}
                    aria-describedby={hasBillingErrors('city') ? 'billing-city-error' : undefined}
                  />
                </div>
              {hasBillingErrors('city') && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center space-x-2 text-auth-error font-medium text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{getBillingError('city')}</span>
                </motion.div>
              )}
            </div>

            <div>
              <label htmlFor="billing-state" className="block text-sm font-normal text-white/90 mb-2 tracking-tight">
                State/Province {!isOptional && '*'}
              </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-auth-icon-primary z-10" />
                  <Input
                    id="billing-state"
                    type="text"
                    value={currentBillingAddress.state}
                    onChange={e => handleAddressChange('billing', 'state', e.target.value)}
                    onBlur={e => handleInputBlur('state', e.target.value)}
                    placeholder="NY"
                    className="pl-9"
                    variant={hasBillingErrors('state') ? 'error' : 'default'}
                    required={!isOptional}
                    aria-describedby={hasBillingErrors('state') ? 'billing-state-error' : undefined}
                  />
                </div>
              {hasBillingErrors('state') && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center space-x-2 text-auth-error font-medium text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{getBillingError('state')}</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* ZIP Code & Country Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="billing-zipCode" className="block text-sm font-normal text-white/90 mb-2 tracking-tight">
                ZIP/Postal Code {!isOptional && '*'}
              </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-auth-icon-primary z-10" />
                  <Input
                    id="billing-zipCode"
                    type="text"
                    value={currentBillingAddress.zipCode}
                    onChange={e => handleAddressChange('billing', 'zipCode', e.target.value)}
                    onBlur={e => handleInputBlur('zipCode', e.target.value)}
                    placeholder="10001"
                    className="pl-9"
                    variant={hasBillingErrors('zipCode') ? 'error' : 'default'}
                    required={!isOptional}
                    aria-describedby={hasBillingErrors('zipCode') ? 'billing-zip-error' : undefined}
                  />
                </div>
              {hasBillingErrors('zipCode') && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center space-x-2 text-auth-error font-medium text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{getBillingError('zipCode')}</span>
                </motion.div>
              )}
            </div>

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

            <label className="flex items-center space-x-3 cursor-pointer">
              <span className="text-sm text-white/85">Same as billing</span>
              <div className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  checked={sameAsBilling}
                  onChange={(e) => handleSameAsBillingToggle(e.target.checked)}
                  className="sr-only peer"
                  aria-label="Use Billing as Shipping Address"
                />
                <div className="relative w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00BCD4]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00BCD4]" />
              </div>
            </label>
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
              <div>
                <label htmlFor="shipping-street" className="block text-sm font-normal text-white/90 mb-2 tracking-tight">
                  Street Address {!isOptional && '*'}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-auth-icon-primary z-10" />
                  <Input
                    id="shipping-street"
                    type="text"
                    value={currentShippingAddress.street}
                    onChange={e => handleAddressChange('shipping', 'street', e.target.value)}
                    placeholder="123 Main Street"
                    className="pl-9"
                    required={!isOptional}
                  />
                </div>
              </div>

              {/* Shipping Street Address 2 */}
              <div>
                <label htmlFor="shipping-street2" className="block text-sm font-normal text-white/90 mb-2 tracking-tight">
                  Street Address 2
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-auth-icon-primary z-10" />
                  <Input
                    id="shipping-street2"
                    type="text"
                    value={currentShippingAddress.street2 ?? ''}
                    onChange={e => handleAddressChange('shipping', 'street2', e.target.value)}
                    placeholder="Apartment, suite, etc."
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Shipping City & State Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="shipping-city" className="block text-sm font-normal text-white/90 mb-2 tracking-tight">
                    City {!isOptional && '*'}
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-auth-icon-primary z-10" />
                    <Input
                      id="shipping-city"
                      type="text"
                      value={currentShippingAddress.city}
                      onChange={e => handleAddressChange('shipping', 'city', e.target.value)}
                      placeholder="New York"
                      className="pl-9"
                      required={!isOptional}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="shipping-state" className="block text-sm font-normal text-white/90 mb-2 tracking-tight">
                    State/Province {!isOptional && '*'}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-auth-icon-primary z-10" />
                    <Input
                      id="shipping-state"
                      type="text"
                      value={currentShippingAddress.state}
                      onChange={e => handleAddressChange('shipping', 'state', e.target.value)}
                      placeholder="NY"
                      className="pl-9"
                      required={!isOptional}
                    />
                  </div>
                </div>
              </div>

              {/* Shipping ZIP Code & Country Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="shipping-zipCode" className="block text-sm font-normal text-white/90 mb-2 tracking-tight">
                    ZIP/Postal Code {!isOptional && '*'}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-auth-icon-primary z-10" />
                    <Input
                      id="shipping-zipCode"
                      type="text"
                      value={currentShippingAddress.zipCode}
                      onChange={e => handleAddressChange('shipping', 'zipCode', e.target.value)}
                      placeholder="10001"
                      className="pl-9"
                      required={!isOptional}
                    />
                  </div>
                </div>

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





