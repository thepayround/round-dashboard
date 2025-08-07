import { motion } from 'framer-motion'
import { Building, ChevronDown, DollarSign, ExternalLink, AlignLeft } from 'lucide-react'
import { useState } from 'react'
import { ApiDropdown, countryDropdownConfig } from '@/shared/components/ui/ApiDropdown'
import type { OrganizationInfo } from '../../types/onboarding'

interface OrganizationStepProps {
  data: OrganizationInfo
  onChange: (data: OrganizationInfo) => void
  errors?: Record<string, string>
  isPrePopulated?: boolean
}

const industryOptions = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'retail', label: 'Retail' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'other', label: 'Other' },
]

const companySizeOptions = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' },
]



export const OrganizationStep = ({
  data,
  onChange,
  errors = {},
  isPrePopulated = false,
}: OrganizationStepProps) => {
  const [industryOpen, setIndustryOpen] = useState(false)
  const [companySizeOpen, setCompanySizeOpen] = useState(false)

  const handleInputChange =
    (field: keyof OrganizationInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...data,
        [field]: e.target.value,
      })
    }

  const handleSelectChange = (field: keyof OrganizationInfo, value: string) => {
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
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
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
          <Building className="w-8 h-8 text-[#32A1E4]" />
        </motion.div>

        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Organization</h2>
          <p className="text-gray-400 text-lg">
            {isPrePopulated
              ? 'Review and complete your company profile'
              : 'Complete your company profile'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-lg mx-auto space-y-6">
        {/* Company Name */}
        <div>
          <label htmlFor="companyName" className="auth-label">
            Company Name
          </label>
          <div className="input-container">
            <Building className="input-icon-left auth-icon-primary" />
            <input
              id="companyName"
              type="text"
              value={data.companyName}
              onChange={handleInputChange('companyName')}
              placeholder="Acme Corporation"
              className={`auth-input input-with-icon-left ${errors.companyName ? 'auth-input-error' : ''}`}
            />
          </div>
          {errors.companyName && <p className="mt-1 text-sm text-red-400">{errors.companyName}</p>}
        </div>

        {/* Country */}
        <div>
          <span className="block text-sm font-medium text-gray-300 mb-2">
            Country <span className="text-red-400">*</span>
          </span>
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

        {/* Industry */}
        <div>
          <span className="block text-sm font-medium text-gray-300 mb-2">Industry</span>
          <Dropdown
            value={data.industry}
            options={industryOptions}
            placeholder="Select your industry"
            onSelect={value => handleSelectChange('industry', value)}
            isOpen={industryOpen}
            setIsOpen={setIndustryOpen}
            error={errors.industry}
          />
          {errors.industry && <p className="mt-1 text-sm text-red-400">{errors.industry}</p>}
        </div>

        {/* Company Size */}
        <div>
          <span className="block text-sm font-medium text-gray-300 mb-2">Company Size</span>
          <Dropdown
            value={data.companySize}
            options={companySizeOptions}
            placeholder="Select company size"
            onSelect={value => handleSelectChange('companySize', value)}
            isOpen={companySizeOpen}
            setIsOpen={setCompanySizeOpen}
            error={errors.companySize}
          />
          {errors.companySize && <p className="mt-1 text-sm text-red-400">{errors.companySize}</p>}
        </div>

        {/* Website */}
        <div>
          <label htmlFor="website" className="auth-label">
            Website <span className="text-gray-500">(optional)</span>
          </label>
          <div className="input-container">
            <ExternalLink className="input-icon-left auth-icon-primary" />
            <input
              id="website"
              type="url"
              value={data.website}
              onChange={handleInputChange('website')}
              placeholder="https://www.example.com"
              className={`auth-input input-with-icon-left ${errors.website ? 'auth-input-error' : ''}`}
            />
          </div>
          {errors.website && <p className="mt-1 text-sm text-red-400">{errors.website}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="auth-label">
            Description <span className="text-gray-500">(optional)</span>
          </label>
          <div className="input-container">
            <AlignLeft className="input-icon-left auth-icon-primary" style={{top: '1rem'}} />
            <textarea
              id="description"
              value={data.description ?? ''}
              onChange={e => onChange({ ...data, description: e.target.value })}
              placeholder="Brief description of your company..."
              rows={3}
              className={`auth-input textarea input-with-icon-left resize-none ${errors.description ? 'auth-input-error' : ''}`}
            />
          </div>
          {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
        </div>

        {/* Revenue */}
        <div>
          <label htmlFor="revenue" className="auth-label">
            Annual Revenue <span className="text-gray-500">(optional)</span>
          </label>
          <div className="input-container">
            <DollarSign className="input-icon-left auth-icon-primary" />
            <input
              id="revenue"
              type="number"
              value={data.revenue ?? ''}
              onChange={handleInputChange('revenue')}
              placeholder="1000000"
              className={`auth-input input-with-icon-left ${errors.revenue ? 'auth-input-error' : ''}`}
            />
          </div>
          {errors.revenue && <p className="mt-1 text-sm text-red-400">{errors.revenue}</p>}
        </div>
      </div>

    </motion.div>
  )
}
