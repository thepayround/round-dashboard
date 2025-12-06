import { AlertCircle, MapPin } from 'lucide-react'

import type { StepComponentProps } from '../../config/types'
import { useAddressStepController } from '../../hooks/useAddressStepController'
import type { EnhancedAddressInfo } from '../../types/onboarding'

import { CountrySelect } from '@/shared/ui/CountrySelect'
import { DetailCard, InfoList } from '@/shared/ui/DetailCard'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'

interface AddressStepProps extends StepComponentProps<EnhancedAddressInfo> {
  errors?: Record<string, string>
  readOnly?: boolean
}


export const AddressStep = ({
  data,
  onChange,
  errors = {},
  isPrePopulated = false,
  readOnly = false,
}: AddressStepProps) => {
  const { billingAddress, handleAddressChange, handleSelectChange } = useAddressStepController({
    data,
    onChange,
  })


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1 text-center">
        <h2 className="text-base font-medium text-foreground">Address Information</h2>
        <p className="text-sm text-muted-foreground">
          {isPrePopulated
            ? 'Review and complete your billing address details'
            : 'Provide your business billing address for invoicing and tax purposes'}
        </p>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto">
        <DetailCard
          title="Billing Address"
          icon={<MapPin className="h-4 w-4" />}
        >
          <InfoList>
            {/* Address Name */}
            <div className="space-y-2">
              <Label htmlFor="address-name">Address Name</Label>
              <Input
                id="address-name"
                value={billingAddress.name}
                onChange={(e) => handleAddressChange('name', e.target.value)}
                placeholder="Main Office, Headquarters, etc."
                disabled={readOnly}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'address-name-error' : undefined}
              />
              {errors.name && (
                <div id="address-name-error" className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Street Address and Unit # - Same row */}
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3 space-y-2">
                <Label htmlFor="street-address">Street Address</Label>
                <Input
                  id="street-address"
                  value={billingAddress.addressLine1}
                  onChange={(e) => handleAddressChange('addressLine1', e.target.value)}
                  placeholder="123 Main Street, Suite 100"
                  disabled={readOnly}
                  aria-invalid={!!errors.addressLine1}
                  aria-describedby={errors.addressLine1 ? 'street-address-error' : undefined}
                />
                {errors.addressLine1 && (
                  <div id="street-address-error" className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.addressLine1}</span>
                  </div>
                )}
              </div>

              <div className="col-span-1 space-y-2">
                <Label htmlFor="unit-number">Unit #</Label>
                <Input
                  id="unit-number"
                  value={billingAddress.number}
                  onChange={(e) => handleAddressChange('number', e.target.value)}
                  placeholder="12A"
                  disabled={readOnly}
                  aria-invalid={!!errors.number}
                  aria-describedby={errors.number ? 'unit-number-error' : undefined}
                />
                {errors.number && (
                  <div id="unit-number-error" className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.number}</span>
                  </div>
                )}
              </div>
            </div>

            {/* City and Country - Same row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={billingAddress.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  placeholder="San Francisco"
                  disabled={readOnly}
                  aria-invalid={!!errors.city}
                  aria-describedby={errors.city ? 'city-error' : undefined}
                />
                {errors.city && (
                  <div id="city-error" className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.city}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <CountrySelect
                  id="country"
                  value={billingAddress.country}
                  onChange={(value) => handleSelectChange('country', value ?? '')}
                  placeholder="Select country"
                  disabled={readOnly}
                  searchable={true}
                  clearable={true}
                />
                {errors.country && (
                  <div id="country-error" className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.country}</span>
                  </div>
                )}
              </div>
            </div>

            {/* State and ZIP - Same row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State / Province</Label>
                <Input
                  id="state"
                  value={billingAddress.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  placeholder="California"
                  disabled={readOnly}
                  aria-invalid={!!errors.state}
                  aria-describedby={errors.state ? 'state-error' : undefined}
                />
                {errors.state && (
                  <div id="state-error" className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.state}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip-code">ZIP / Postal Code</Label>
                <Input
                  id="zip-code"
                  value={billingAddress.zipCode}
                  onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                  placeholder="94102"
                  disabled={readOnly}
                  aria-invalid={!!errors.zipCode}
                  aria-describedby={errors.zipCode ? 'zip-code-error' : undefined}
                />
                {errors.zipCode && (
                  <div id="zip-code-error" className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.zipCode}</span>
                  </div>
                )}
              </div>
            </div>
          </InfoList>
        </DetailCard>
      </div>
    </div>
  )
}
