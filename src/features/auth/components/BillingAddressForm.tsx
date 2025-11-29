import { motion } from 'framer-motion'
import { MapPin, Building, Truck } from 'lucide-react'

import { useBillingAddressFormController } from '../hooks/useBillingAddressFormController'

import { useCountries } from '@/shared/hooks/api/useCountryCurrency'
import type { BillingAddress } from '@/shared/types/business'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/shadcn/select'
import { Switch } from '@/shared/ui/shadcn/switch'
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

  const { data: countries, isLoading: countriesLoading } = useCountries()

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
          <div className="space-y-2">
            <Label htmlFor="billing-street">
              Street Address{!isOptional && <span className="text-destructive"> *</span>}
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="billing-street"
                type="text"
                value={currentBillingAddress.street}
                onChange={e => handleAddressChange('billing', 'street', e.target.value)}
                onBlur={e => handleInputBlur('street', e.target.value)}
                placeholder="123 Main Street"
                className="pl-10"
                required={!isOptional}
              />
            </div>
            {hasBillingErrors('street') && (
              <p className="text-sm text-destructive">{getBillingError('street')}</p>
            )}
          </div>

          {/* Street Address 2 */}
          <div className="space-y-2">
            <Label htmlFor="billing-street2">Street Address 2</Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="billing-street2"
                type="text"
                value={currentBillingAddress.street2 ?? ''}
                onChange={e => handleAddressChange('billing', 'street2', e.target.value)}
                placeholder="Apartment, suite, etc."
                className="pl-10"
              />
            </div>
          </div>

          {/* City & State Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billing-city">
                City{!isOptional && <span className="text-destructive"> *</span>}
              </Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="billing-city"
                  type="text"
                  value={currentBillingAddress.city}
                  onChange={e => handleAddressChange('billing', 'city', e.target.value)}
                  onBlur={e => handleInputBlur('city', e.target.value)}
                  placeholder="New York"
                  className="pl-10"
                  required={!isOptional}
                />
              </div>
              {hasBillingErrors('city') && (
                <p className="text-sm text-destructive">{getBillingError('city')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing-state">
                State/Province{!isOptional && <span className="text-destructive"> *</span>}
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="billing-state"
                  type="text"
                  value={currentBillingAddress.state}
                  onChange={e => handleAddressChange('billing', 'state', e.target.value)}
                  onBlur={e => handleInputBlur('state', e.target.value)}
                  placeholder="NY"
                  className="pl-10"
                  required={!isOptional}
                />
              </div>
              {hasBillingErrors('state') && (
                <p className="text-sm text-destructive">{getBillingError('state')}</p>
              )}
            </div>
          </div>

          {/* ZIP Code & Country Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billing-zipCode">
                ZIP/Postal Code{!isOptional && <span className="text-destructive"> *</span>}
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="billing-zipCode"
                  type="text"
                  value={currentBillingAddress.zipCode}
                  onChange={e => handleAddressChange('billing', 'zipCode', e.target.value)}
                  onBlur={e => handleInputBlur('zipCode', e.target.value)}
                  placeholder="10001"
                  className="pl-10"
                  required={!isOptional}
                />
              </div>
              {hasBillingErrors('zipCode') && (
                <p className="text-sm text-destructive">{getBillingError('zipCode')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing-country">
                Country{!isOptional && <span className="text-destructive"> *</span>}
              </Label>
              <Select
                value={currentBillingAddress.country}
                onValueChange={value => handleAddressChange('billing', 'country', value)}
                disabled={countriesLoading}
              >
                <SelectTrigger id="billing-country">
                  <SelectValue placeholder={countriesLoading ? 'Loading countries...' : 'Select country'} />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country.countryCodeAlpha2} value={country.countryCodeAlpha2}>
                      {country.countryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasBillingErrors('country') && (
                <p className="text-sm text-destructive">{getBillingError('country')}</p>
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
              <Truck className="w-5 h-5 text-secondary" />
              <span>Shipping Address</span>
            </h3>

            <div className="flex items-center space-x-2">
              <Label htmlFor="same-as-billing" className="text-sm">
                Same as billing
              </Label>
              <Switch
                id="same-as-billing"
                checked={sameAsBilling}
                onCheckedChange={handleSameAsBillingToggle}
                aria-label="Use Billing as Shipping Address"
              />
            </div>
          </div>

          {/* Shipping Address Fields or Same as Billing Message */}
          {sameAsBilling ? (
            <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-secondary" />
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
              <div className="space-y-2">
                <Label htmlFor="shipping-street">
                  Street Address{!isOptional && <span className="text-destructive"> *</span>}
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="shipping-street"
                    type="text"
                    value={currentShippingAddress.street}
                    onChange={e => handleAddressChange('shipping', 'street', e.target.value)}
                    placeholder="123 Main Street"
                    className="pl-10"
                    required={!isOptional}
                  />
                </div>
              </div>

              {/* Shipping Street Address 2 */}
              <div className="space-y-2">
                <Label htmlFor="shipping-street2">Street Address 2</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="shipping-street2"
                    type="text"
                    value={currentShippingAddress.street2 ?? ''}
                    onChange={e => handleAddressChange('shipping', 'street2', e.target.value)}
                    placeholder="Apartment, suite, etc."
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Shipping City & State Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shipping-city">
                    City{!isOptional && <span className="text-destructive"> *</span>}
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="shipping-city"
                      type="text"
                      value={currentShippingAddress.city}
                      onChange={e => handleAddressChange('shipping', 'city', e.target.value)}
                      placeholder="New York"
                      className="pl-10"
                      required={!isOptional}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping-state">
                    State/Province{!isOptional && <span className="text-destructive"> *</span>}
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="shipping-state"
                      type="text"
                      value={currentShippingAddress.state}
                      onChange={e => handleAddressChange('shipping', 'state', e.target.value)}
                      placeholder="NY"
                      className="pl-10"
                      required={!isOptional}
                    />
                  </div>
                </div>
              </div>

              {/* Shipping ZIP Code & Country Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shipping-zipCode">
                    ZIP/Postal Code{!isOptional && <span className="text-destructive"> *</span>}
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="shipping-zipCode"
                      type="text"
                      value={currentShippingAddress.zipCode}
                      onChange={e => handleAddressChange('shipping', 'zipCode', e.target.value)}
                      placeholder="10001"
                      className="pl-10"
                      required={!isOptional}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping-country">
                    Country{!isOptional && <span className="text-destructive"> *</span>}
                  </Label>
                  <Select
                    value={currentShippingAddress.country}
                    onValueChange={value => handleAddressChange('shipping', 'country', value)}
                    disabled={countriesLoading}
                  >
                    <SelectTrigger id="shipping-country">
                      <SelectValue placeholder={countriesLoading ? 'Loading countries...' : 'Select country'} />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={country.countryCodeAlpha2} value={country.countryCodeAlpha2}>
                          {country.countryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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





