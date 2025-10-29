import { motion } from 'framer-motion'
import { MapPin, Building, Hash, Info } from 'lucide-react'
import { FormInput } from '@/shared/components/ui/FormInput'
import { ApiDropdown, countryDropdownConfig } from '@/shared/components/ui/ApiDropdown'
import type { AddressInfo, EnhancedAddressInfo } from '../../types/onboarding'

interface AddressStepProps {
  data: EnhancedAddressInfo
  onChange: (data: EnhancedAddressInfo) => void
  errors?: Record<string, string>
  isPrePopulated?: boolean
  readOnly?: boolean
}


export const AddressStep = ({
  data,
  onChange,
  errors = {},
  isPrePopulated = false,
  readOnly = false,
}: AddressStepProps) => {
  // Initialize billing address if not provided
  const billingAddress: AddressInfo = data.billingAddress ?? {
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

  const handleAddressChange = (field: keyof AddressInfo, value: string) => {
    const updatedBilling = { ...billingAddress, [field]: value, addressType: 'billing' }
    const updatedData: EnhancedAddressInfo = {
      ...data,
      billingAddress: updatedBilling,
    }

    onChange(updatedData)
  }

  const handleSelectChange = (field: keyof AddressInfo, value: string) => {
    handleAddressChange(field, value)
  }


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
          <MapPin className="w-8 h-8 text-[#32A1E4]" />
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
        <FormInput
          label="Address Name"
          value={billingAddress.name}
          onChange={(e) => handleAddressChange('name', e.target.value)}
          placeholder="Main Office, Headquarters, etc."
          leftIcon={Building}
          error={errors.name}
          disabled={readOnly}
        />

        {/* Street Address */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-3">
            <FormInput
              label="Street Address"
              value={billingAddress.addressLine1}
              onChange={(e) => handleAddressChange('addressLine1', e.target.value)}
              placeholder="123 Main Street, Suite 100"
              leftIcon={MapPin}
              error={errors.addressLine1}
              disabled={readOnly}
            />
          </div>

          <div>
            <FormInput
              label={
                <div className="flex items-center space-x-2">
                  <span>Unit #</span>
                  <div className="group relative">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900/95 text-white text-xs rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-white/10 z-50">
                      Building/unit number
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900/95" />
                    </div>
                  </div>
                </div>
              }
              value={billingAddress.number}
              onChange={(e) => handleAddressChange('number', e.target.value)}
              placeholder="123A"
              leftIcon={Hash}
              error={errors.number}
              disabled={readOnly}
            />
          </div>
        </div>

        {/* Location Details */}
        <div className="space-y-4">
          <FormInput
            label="City"
            value={billingAddress.city}
            onChange={(e) => handleAddressChange('city', e.target.value)}
            placeholder="San Francisco"
            error={errors.city}
            disabled={readOnly}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="State / Province"
              value={billingAddress.state}
              onChange={(e) => handleAddressChange('state', e.target.value)}
              placeholder="California"
              error={errors.state}
              disabled={readOnly}
            />

            <FormInput
              label="ZIP / Postal Code"
              value={billingAddress.zipCode}
              onChange={(e) => handleAddressChange('zipCode', e.target.value)}
              placeholder="94102"
              error={errors.zipCode}
              disabled={readOnly}
            />
          </div>

          <div className="space-y-2">
            <span className="auth-label">Country</span>
            <ApiDropdown
              config={countryDropdownConfig}
              value={billingAddress.country}
              onSelect={value => handleSelectChange('country', value)}
              onClear={() => handleSelectChange('country', '')}
              error={!!errors.country}
              allowClear={!readOnly}
              disabled={readOnly}
            />
            {errors.country && <p className="mt-1 text-sm text-red-400">{errors.country}</p>}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
