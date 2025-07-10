import { motion } from 'framer-motion'
import { Settings, ChevronDown, DollarSign, Clock, Calendar } from 'lucide-react'
import { useState } from 'react'
import type { BusinessSettings } from '../../types/onboarding'

interface BusinessSettingsStepProps {
  data: BusinessSettings
  onChange: (data: BusinessSettings) => void
  errors?: Record<string, string>
}

const currencyOptions = [
  { value: 'USD', label: 'US Dollar (USD)', symbol: '$' },
  { value: 'EUR', label: 'Euro (EUR)', symbol: '€' },
  { value: 'GBP', label: 'British Pound (GBP)', symbol: '£' },
  { value: 'CAD', label: 'Canadian Dollar (CAD)', symbol: 'C$' },
  { value: 'AUD', label: 'Australian Dollar (AUD)', symbol: 'A$' },
  { value: 'JPY', label: 'Japanese Yen (JPY)', symbol: '¥' },
]

const timezoneOptions = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (EST/EDT)' },
  { value: 'America/Chicago', label: 'Central Time (CST/CDT)' },
  { value: 'America/Denver', label: 'Mountain Time (MST/MDT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PST/PDT)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
]

const fiscalYearOptions = [
  { value: 'January', label: 'January' },
  { value: 'February', label: 'February' },
  { value: 'March', label: 'March' },
  { value: 'April', label: 'April' },
  { value: 'May', label: 'May' },
  { value: 'June', label: 'June' },
  { value: 'July', label: 'July' },
  { value: 'August', label: 'August' },
  { value: 'September', label: 'September' },
  { value: 'October', label: 'October' },
  { value: 'November', label: 'November' },
  { value: 'December', label: 'December' },
]

export const BusinessSettingsStep = ({
  data,
  onChange,
  errors = {},
}: BusinessSettingsStepProps) => {
  const [currencyOpen, setCurrencyOpen] = useState(false)
  const [timezoneOpen, setTimezoneOpen] = useState(false)
  const [fiscalYearOpen, setFiscalYearOpen] = useState(false)

  const handleSelectChange = (field: keyof BusinessSettings, value: string) => {
    onChange({
      ...data,
      [field]: value,
    })
  }

  const isFormValid = () =>
    data.currency !== '' && data.timezone !== '' && data.fiscalYearStart !== ''

  const Dropdown = ({
    value,
    options,
    placeholder,
    onSelect,
    isOpen,
    setIsOpen,
    error,
    icon: Icon,
  }: {
    value: string
    options: Array<{ value: string; label: string; symbol?: string }>
    placeholder: string
    onSelect: (value: string) => void
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    error?: string
    icon: React.ComponentType<{ className?: string }>
  }) => (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full h-12 pl-12 pr-4 rounded-xl backdrop-blur-xl border transition-all duration-200 text-left flex items-center justify-between
          bg-white/5 border-white/10 text-white
          hover:bg-white/10 hover:border-white/20
          focus:bg-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-[#D417C8]/30
          ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}
        `}
      >
        <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <span className={value ? 'text-white' : 'text-gray-400'}>
          {value ? options.find(opt => opt.value === value)?.label : placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto"
        >
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onSelect(option.value)
                setIsOpen(false)
              }}
              className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl flex items-center justify-between"
            >
              <span>{option.label}</span>
              {option.symbol && <span className="text-gray-400 text-sm">{option.symbol}</span>}
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
          className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#7767DA]/20 to-[#BD2CD0]/20 backdrop-blur-sm border border-white/20 flex items-center justify-center"
        >
          <Settings className="w-8 h-8 text-[#7767DA]" />
        </motion.div>

        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Business Settings</h2>
          <p className="text-gray-400 text-lg">Configure your business preferences</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Currency */}
        <div>
          <span className="block text-sm font-medium text-gray-300 mb-2">Currency</span>
          <Dropdown
            value={data.currency}
            options={currencyOptions}
            placeholder="Select your currency"
            onSelect={value => handleSelectChange('currency', value)}
            isOpen={currencyOpen}
            setIsOpen={setCurrencyOpen}
            error={errors.currency}
            icon={DollarSign}
          />
          {errors.currency && <p className="mt-1 text-sm text-red-400">{errors.currency}</p>}
        </div>

        {/* Timezone */}
        <div>
          <span className="block text-sm font-medium text-gray-300 mb-2">Timezone</span>
          <Dropdown
            value={data.timezone}
            options={timezoneOptions}
            placeholder="Select your timezone"
            onSelect={value => handleSelectChange('timezone', value)}
            isOpen={timezoneOpen}
            setIsOpen={setTimezoneOpen}
            error={errors.timezone}
            icon={Clock}
          />
          {errors.timezone && <p className="mt-1 text-sm text-red-400">{errors.timezone}</p>}
        </div>

        {/* Fiscal Year Start */}
        <div>
          <span className="block text-sm font-medium text-gray-300 mb-2">Fiscal Year Start</span>
          <Dropdown
            value={data.fiscalYearStart}
            options={fiscalYearOptions}
            placeholder="Select fiscal year start month"
            onSelect={value => handleSelectChange('fiscalYearStart', value)}
            isOpen={fiscalYearOpen}
            setIsOpen={setFiscalYearOpen}
            error={errors.fiscalYearStart}
            icon={Calendar}
          />
          {errors.fiscalYearStart && (
            <p className="mt-1 text-sm text-red-400">{errors.fiscalYearStart}</p>
          )}
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
            ✓ Business settings configured successfully
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
