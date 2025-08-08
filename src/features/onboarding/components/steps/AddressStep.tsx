import { motion } from 'framer-motion'
import { MapPin, Building, Hash, Info } from 'lucide-react'
import { useState } from 'react'
import { FormInput } from '@/shared/components/ui/FormInput'
import { ApiDropdown, countryDropdownConfig } from '@/shared/components/ui/ApiDropdown'
import type { AddressInfo } from '../../types/onboarding'

interface AddressStepProps {
  data: AddressInfo
  onChange: (data: AddressInfo) => void
  errors?: Record<string, string>
  isPrePopulated?: boolean
}

const addressTypeOptions = [
  { value: 'billing', label: 'Billing Address' },
  { value: 'shipping', label: 'Shipping Address' },
  { value: 'business', label: 'Business Address' },
]

export const AddressStep = ({
  data,
  onChange,
  errors = {},
  isPrePopulated = false,
}: AddressStepProps) => {
  const [addressTypeOpen, setAddressTypeOpen] = useState(false)

  const handleInputChange =
    (field: keyof AddressInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...data,
        [field]: e.target.value,
      })
    }

  const handleSelectChange = (field: keyof AddressInfo, value: string) => {
    onChange({
      ...data,
      [field]: value,
    })
  }

  const Dropdown = ({
    value,
    options,
    placeholder,
    onSelect,
    isOpen,
    setIsOpen,
    error,
  }: {
    value: string
    options: Array<{ value: string; label: string }>
    placeholder: string
    onSelect: (value: string) => void
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    error?: string
  }) => (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`auth-input flex items-center justify-between ${error ? 'auth-input-error' : ''}`}
      >
        <span className={value ? 'text-white' : 'text-gray-400'}>
          {value ? options.find(opt => opt.value === value)?.label : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 text-gray-400"
        >
          ▼
        </motion.div>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-dropdown max-h-60 overflow-y-auto"
        >
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onSelect(option.value)
                setIsOpen(false)
              }}
              className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
            >
              {option.label}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  )

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
          className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#32A1E4]/20 to-[#7767DA]/20 backdrop-blur-sm border border-white/20 flex items-center justify-center"
        >
          <MapPin className="w-8 h-8 text-[#32A1E4]" />
        </motion.div>

        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Address Information</h2>
          <p className="text-gray-400 text-lg">
            {isPrePopulated
              ? 'Review and complete your address details'
              : 'Add your business or billing address'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-lg mx-auto space-y-8">
        {/* Address Type and Name Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="block text-sm font-medium text-gray-300">Address Type</span>
            <Dropdown
              value={data.addressType}
              options={addressTypeOptions}
              placeholder="Select address type"
              onSelect={value =>
                handleSelectChange('addressType', value as 'billing' | 'shipping' | 'business')
              }
              isOpen={addressTypeOpen}
              setIsOpen={setAddressTypeOpen}
              error={errors.addressType}
            />
            {errors.addressType && (
              <p className="mt-1 text-sm text-red-400">{errors.addressType}</p>
            )}
          </div>

          <FormInput
            label="Address Name"
            value={data.name}
            onChange={handleInputChange('name')}
            placeholder="Main Office, Headquarters, etc."
            leftIcon={Building}
            error={errors.name}
          />
        </div>

        {/* Street Address Section */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-3">
              <FormInput
                label="Street Address"
                value={data.addressLine1}
                onChange={handleInputChange('addressLine1')}
                placeholder="123 Main Street, Suite 100"
                leftIcon={MapPin}
                error={errors.addressLine1}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <label htmlFor="unit-number" className="block text-sm font-medium text-gray-300">Unit #</label>
                <div className="group relative">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-white/10 z-50">
                    Building/unit number
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900/95" />
                  </div>
                </div>
              </div>
              <div className="input-container">
                <Hash className="input-icon-left auth-icon-primary" />
                <input
                  id="unit-number"
                  type="text"
                  value={data.number}
                  onChange={handleInputChange('number')}
                  placeholder="123A"
                  className={`auth-input input-with-icon-left ${errors.number ? 'auth-input-error' : ''}`}
                />
              </div>
              {errors.number && <p className="mt-1 text-sm text-red-400">{errors.number}</p>}
            </div>
          </div>
        </div>

        {/* Location Details Section */}
        <div className="space-y-6">
          <FormInput
            label="City"
            value={data.city}
            onChange={handleInputChange('city')}
            placeholder="San Francisco"
            error={errors.city}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="State / Province"
              value={data.state}
              onChange={handleInputChange('state')}
              placeholder="California"
              error={errors.state}
            />

            <FormInput
              label="ZIP / Postal Code"
              value={data.zipCode}
              onChange={handleInputChange('zipCode')}
              placeholder="94102"
              error={errors.zipCode}
            />
          </div>

          <div className="space-y-2">
            <span className="block text-sm font-medium text-gray-300">Country</span>
            <ApiDropdown
              config={countryDropdownConfig}
              value={data.country}
              onSelect={value => handleSelectChange('country', value)}
              onClear={() => handleSelectChange('country', '')}
              error={!!errors.country}
              allowClear
            />
            {errors.country && <p className="mt-1 text-sm text-red-400">{errors.country}</p>}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
