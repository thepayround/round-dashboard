import { AlertCircle, Truck } from 'lucide-react'

import { useBillingAddressFormController } from '../hooks/useBillingAddressFormController'

import type { BillingAddress } from '@/shared/types/business'
import { CountrySelect } from '@/shared/ui/CountrySelect'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
import { Switch } from '@/shared/ui/shadcn/switch'
import type { ValidationError } from '@/shared/utils/validation'

/**
 * Enhanced AddressForm component with optional shipping address functionality
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
    <div className="flex flex-col gap-6">
      {/* Street Address */}
      <div className="grid gap-2">
        <Label htmlFor="billing-street">
          Street Address{!isOptional && <span className="text-destructive"> *</span>}
        </Label>
        <Input
          id="billing-street"
          type="text"
          value={currentBillingAddress.street}
          onChange={e => handleAddressChange('billing', 'street', e.target.value)}
          onBlur={e => handleInputBlur('street', e.target.value)}
          placeholder="123 Main Street"
          required={!isOptional}
          aria-invalid={hasBillingErrors('street')}
          aria-describedby={hasBillingErrors('street') ? 'billing-street-error' : undefined}
        />
        <div className="min-h-5">
          {hasBillingErrors('street') && (
            <p id="billing-street-error" className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {getBillingError('street')}
            </p>
          )}
        </div>
      </div>

      {/* Street Address 2 */}
      <div className="grid gap-2">
        <Label htmlFor="billing-street2">Street Address 2</Label>
        <Input
          id="billing-street2"
          type="text"
          value={currentBillingAddress.street2 ?? ''}
          onChange={e => handleAddressChange('billing', 'street2', e.target.value)}
          placeholder="Apartment, suite, etc."
        />
      </div>

      {/* City & State Row */}
      <div className="grid md:grid-cols-2 gap-4 items-start">
        <div className="grid gap-2">
          <Label htmlFor="billing-city">
            City{!isOptional && <span className="text-destructive"> *</span>}
          </Label>
          <Input
            id="billing-city"
            type="text"
            value={currentBillingAddress.city}
            onChange={e => handleAddressChange('billing', 'city', e.target.value)}
            onBlur={e => handleInputBlur('city', e.target.value)}
            placeholder="New York"
            required={!isOptional}
            aria-invalid={hasBillingErrors('city')}
            aria-describedby={hasBillingErrors('city') ? 'billing-city-error' : undefined}
          />
          <div className="min-h-5">
            {hasBillingErrors('city') && (
              <p id="billing-city-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {getBillingError('city')}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="billing-state">State/Province</Label>
          <Input
            id="billing-state"
            type="text"
            value={currentBillingAddress.state}
            onChange={e => handleAddressChange('billing', 'state', e.target.value)}
            onBlur={e => handleInputBlur('state', e.target.value)}
            placeholder="NY"
            aria-invalid={hasBillingErrors('state')}
            aria-describedby={hasBillingErrors('state') ? 'billing-state-error' : undefined}
          />
          <div className="min-h-5">
            {hasBillingErrors('state') && (
              <p id="billing-state-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {getBillingError('state')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ZIP Code & Country Row */}
      <div className="grid md:grid-cols-2 gap-4 items-start">
        <div className="grid gap-2">
          <Label htmlFor="billing-zipCode">
            ZIP/Postal Code{!isOptional && <span className="text-destructive"> *</span>}
          </Label>
          <Input
            id="billing-zipCode"
            type="text"
            value={currentBillingAddress.zipCode}
            onChange={e => handleAddressChange('billing', 'zipCode', e.target.value)}
            onBlur={e => handleInputBlur('zipCode', e.target.value)}
            placeholder="10001"
            required={!isOptional}
            aria-invalid={hasBillingErrors('zipCode')}
            aria-describedby={hasBillingErrors('zipCode') ? 'billing-zipCode-error' : undefined}
          />
          <div className="min-h-5">
            {hasBillingErrors('zipCode') && (
              <p id="billing-zipCode-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {getBillingError('zipCode')}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="billing-country">
            Country{!isOptional && <span className="text-destructive"> *</span>}
          </Label>
          <CountrySelect
            id="billing-country"
            value={currentBillingAddress.country}
            onChange={value => handleAddressChange('billing', 'country', value || '')}
            placeholder="Select country"
            required={!isOptional}
            clearable={true}
            searchable={true}
          />
          <div className="min-h-5">
            {hasBillingErrors('country') && (
              <p id="billing-country-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {getBillingError('country')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Shipping Address Section */}
      {showShippingEnabled && (
        <div className="flex flex-col gap-6 pt-4 border-t">
          {/* Header with Toggle */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Shipping Address
            </h3>

            <div className="flex items-center gap-2">
              <Label htmlFor="same-as-billing" className="text-sm text-muted-foreground">
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
            <div className="p-3 bg-muted/50 border rounded-lg">
              <p className="text-sm text-muted-foreground">
                Shipping address will be same as billing address
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Shipping Street Address */}
              <div className="grid gap-2">
                <Label htmlFor="shipping-street">
                  Street Address{!isOptional && <span className="text-destructive"> *</span>}
                </Label>
                <Input
                  id="shipping-street"
                  type="text"
                  value={currentShippingAddress.street}
                  onChange={e => handleAddressChange('shipping', 'street', e.target.value)}
                  placeholder="123 Main Street"
                  required={!isOptional}
                />
              </div>

              {/* Shipping Street Address 2 */}
              <div className="grid gap-2">
                <Label htmlFor="shipping-street2">Street Address 2</Label>
                <Input
                  id="shipping-street2"
                  type="text"
                  value={currentShippingAddress.street2 ?? ''}
                  onChange={e => handleAddressChange('shipping', 'street2', e.target.value)}
                  placeholder="Apartment, suite, etc."
                />
              </div>

              {/* Shipping City & State Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="shipping-city">
                    City{!isOptional && <span className="text-destructive"> *</span>}
                  </Label>
                  <Input
                    id="shipping-city"
                    type="text"
                    value={currentShippingAddress.city}
                    onChange={e => handleAddressChange('shipping', 'city', e.target.value)}
                    placeholder="New York"
                    required={!isOptional}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="shipping-state">State/Province</Label>
                  <Input
                    id="shipping-state"
                    type="text"
                    value={currentShippingAddress.state}
                    onChange={e => handleAddressChange('shipping', 'state', e.target.value)}
                    placeholder="NY"
                  />
                </div>
              </div>

              {/* Shipping ZIP Code & Country Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="shipping-zipCode">
                    ZIP/Postal Code{!isOptional && <span className="text-destructive"> *</span>}
                  </Label>
                  <Input
                    id="shipping-zipCode"
                    type="text"
                    value={currentShippingAddress.zipCode}
                    onChange={e => handleAddressChange('shipping', 'zipCode', e.target.value)}
                    placeholder="10001"
                    required={!isOptional}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="shipping-country">
                    Country{!isOptional && <span className="text-destructive"> *</span>}
                  </Label>
                  <CountrySelect
                    id="shipping-country"
                    value={currentShippingAddress.country}
                    onChange={value => handleAddressChange('shipping', 'country', value || '')}
                    placeholder="Select country"
                    required={!isOptional}
                    clearable={true}
                    searchable={true}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
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
