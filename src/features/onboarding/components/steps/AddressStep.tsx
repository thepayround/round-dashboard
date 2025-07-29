import { motion } from 'framer-motion'
import { MapPin, Building } from 'lucide-react'
import { useState } from 'react'
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

  const isFormValid = () =>
    data.name.trim() !== '' &&
    data.street.trim() !== '' &&
    data.city.trim() !== '' &&
    data.state.trim() !== '' &&
    data.zipCode.trim() !== '' &&
    data.country !== ''

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
        className={`
          w-full h-12 px-4 rounded-xl backdrop-blur-xl border transition-all duration-200 text-left flex items-center justify-between
          bg-white/5 border-white/10 text-white
          hover:bg-white/10 hover:border-white/20
          focus:bg-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-[#D417C8]/30
          ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}
        `}
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
          {isPrePopulated && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-[#42E695]/20 to-[#3BB2B8]/20 border border-[#42E695]/30"
            >
              <span className="text-[#42E695] text-sm font-medium">
                ✓ Address loaded from your account
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Address Name and Type Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Address Name */}
          <div>
            <label htmlFor="addressName" className="block text-sm font-medium text-gray-300 mb-2">
              Address Name
            </label>
            <div className="relative">
              <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="addressName"
                type="text"
                value={data.name}
                onChange={handleInputChange('name')}
                placeholder="Main Office, Headquarters, etc."
                className={`
                  w-full h-12 pl-12 pr-4 rounded-xl backdrop-blur-xl border transition-all duration-200
                  bg-white/5 border-white/10 text-white placeholder-gray-400
                  focus:bg-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-[#D417C8]/30
                  ${errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}
                `}
              />
            </div>
            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
          </div>

          {/* Address Type */}
          <div>
            <span className="block text-sm font-medium text-gray-300 mb-2">Address Type</span>
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
        </div>

        {/* Street Address */}
        <div>
          <label htmlFor="street" className="block text-sm font-medium text-gray-300 mb-2">
            Street Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="street"
              type="text"
              value={data.street}
              onChange={handleInputChange('street')}
              placeholder="123 Main Street, Suite 100"
              className={`
                w-full h-12 pl-12 pr-4 rounded-xl backdrop-blur-xl border transition-all duration-200
                bg-white/5 border-white/10 text-white placeholder-gray-400
                focus:bg-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-[#D417C8]/30
                ${errors.street ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}
              `}
            />
          </div>
          {errors.street && <p className="mt-1 text-sm text-red-400">{errors.street}</p>}
        </div>

        {/* City and State Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
              City
            </label>
            <input
              id="city"
              type="text"
              value={data.city}
              onChange={handleInputChange('city')}
              placeholder="San Francisco"
              className={`
                w-full h-12 px-4 rounded-xl backdrop-blur-xl border transition-all duration-200
                bg-white/5 border-white/10 text-white placeholder-gray-400
                focus:bg-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-[#D417C8]/30
                ${errors.city ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}
              `}
            />
            {errors.city && <p className="mt-1 text-sm text-red-400">{errors.city}</p>}
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-2">
              State/Province
            </label>
            <input
              id="state"
              type="text"
              value={data.state}
              onChange={handleInputChange('state')}
              placeholder="California"
              className={`
                w-full h-12 px-4 rounded-xl backdrop-blur-xl border transition-all duration-200
                bg-white/5 border-white/10 text-white placeholder-gray-400
                focus:bg-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-[#D417C8]/30
                ${errors.state ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}
              `}
            />
            {errors.state && <p className="mt-1 text-sm text-red-400">{errors.state}</p>}
          </div>
        </div>

        {/* ZIP Code and Country Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ZIP Code */}
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-300 mb-2">
              ZIP/Postal Code
            </label>
            <input
              id="zipCode"
              type="text"
              value={data.zipCode}
              onChange={handleInputChange('zipCode')}
              placeholder="94102"
              className={`
                w-full h-12 px-4 rounded-xl backdrop-blur-xl border transition-all duration-200
                bg-white/5 border-white/10 text-white placeholder-gray-400
                focus:bg-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-[#D417C8]/30
                ${errors.zipCode ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}
              `}
            />
            {errors.zipCode && <p className="mt-1 text-sm text-red-400">{errors.zipCode}</p>}
          </div>

          {/* Country */}
          <div>
            <span className="block text-sm font-medium text-gray-300 mb-2">Country</span>
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

      {/* Form Validation Status */}
      {isFormValid() && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-gradient-to-r from-[#42E695]/10 to-[#3BB2B8]/10 border border-[#42E695]/20"
        >
          <p className="text-[#42E695] text-sm font-medium text-center">
            ✓ Address information completed successfully
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
