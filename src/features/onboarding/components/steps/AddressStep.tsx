import { motion } from 'framer-motion'
import { AlertCircle, MapPin, Building, Hash, Info } from 'lucide-react'

import type { StepComponentProps } from '../../config/types'
import { useAddressStepController } from '../../hooks/useAddressStepController'
import type { EnhancedAddressInfo } from '../../types/onboarding'

import { CountrySelect } from '@/shared/ui/CountrySelect'
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 mx-auto rounded-lg bg-secondary/20 border border-white/20 flex items-center justify-center"
        >
          <MapPin className="w-8 h-8 text-secondary" />
        </motion.div>

        <div>
          <h2 className="text-lg font-medium tracking-tight text-white mb-2">Address Information</h2>
          <p className="text-gray-400 text-sm">
            {isPrePopulated
              ? 'Review and complete your billing address details'
              : 'Provide your business billing address for invoicing and tax purposes'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-[520px] mx-auto space-y-6">
        {/* Address Name */}
        <div className="space-y-2">
          <Label htmlFor="address-name">Address Name</Label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="address-name"
              value={billingAddress.name}
              onChange={(e) => handleAddressChange('name', e.target.value)}
              placeholder="Main Office, Headquarters, etc."
              className="pl-10"
              disabled={readOnly}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'address-name-error' : undefined}
            />
          </div>
          {errors.name && (
            <div id="address-name-error" className="mt-1 flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.name}</span>
            </div>
          )}
        </div>

        {/* Street Address */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-3">
            <div className="space-y-2">
              <Label htmlFor="street-address">Street Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="street-address"
                  value={billingAddress.addressLine1}
                  onChange={(e) => handleAddressChange('addressLine1', e.target.value)}
                  placeholder="123 Main Street, Suite 100"
                  className="pl-10"
                  disabled={readOnly}
                  aria-invalid={!!errors.addressLine1}
                  aria-describedby={errors.addressLine1 ? 'street-address-error' : undefined}
                />
              </div>
              {errors.addressLine1 && (
                <div id="street-address-error" className="mt-1 flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.addressLine1}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="space-y-2">
              <Label htmlFor="unit-number" className="flex items-center space-x-2">
                <span>Unit #</span>
                <div className="group relative">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900/95 text-white text-xs rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-border z-50">
                    Building/unit number
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border border-transparent border-t-gray-900/95" />
                  </div>
                </div>
              </Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="unit-number"
                  value={billingAddress.number}
                  onChange={(e) => handleAddressChange('number', e.target.value)}
                  placeholder="123A"
                  className="pl-10"
                  disabled={readOnly}
                  aria-invalid={!!errors.number}
                  aria-describedby={errors.number ? 'unit-number-error' : undefined}
                />
              </div>
              {errors.number && (
                <div id="unit-number-error" className="mt-1 flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.number}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="space-y-4">
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
              <div id="city-error" className="mt-1 flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.city}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div id="state-error" className="mt-1 flex items-center gap-2 text-sm text-destructive">
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
                <div id="zip-code-error" className="mt-1 flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.zipCode}</span>
                </div>
              )}
            </div>
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
              <div id="country-error" className="mt-1 flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.country}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
