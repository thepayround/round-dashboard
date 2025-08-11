import { motion } from 'framer-motion'
import { Building, DollarSign, ExternalLink, AlignLeft } from 'lucide-react'
import { ApiDropdown, countryDropdownConfig, industryDropdownConfig, companySizeDropdownConfig } from '@/shared/components/ui/ApiDropdown'
import { useCurrency } from '@/shared/hooks/useCurrency'
import type { OrganizationInfo, BusinessSettings } from '../../types/onboarding'

interface OrganizationStepProps {
  data: OrganizationInfo
  onChange: (data: OrganizationInfo) => void
  errors?: Record<string, string>
  isPrePopulated?: boolean
  businessSettings?: BusinessSettings
}





export const OrganizationStep = ({
  data,
  onChange,
  errors = {},
  isPrePopulated = false,
  businessSettings,
}: OrganizationStepProps) => {
  const { getCurrencySymbol, isLoading: currencyLoading } = useCurrency()

  // Get currency symbol based on business settings
  const currencySymbol = businessSettings?.currency 
    ? getCurrencySymbol(businessSettings.currency) 
    : '$'

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
          <span className="block text-sm font-medium text-gray-300 mb-2">
            Industry <span className="text-red-400">*</span>
          </span>
          <ApiDropdown
            config={industryDropdownConfig}
            value={data.industry}
            onSelect={value => handleSelectChange('industry', value)}
            onClear={() => handleSelectChange('industry', '')}
            error={!!errors.industry}
            allowClear
          />
          {errors.industry && <p className="mt-1 text-sm text-red-400">{errors.industry}</p>}
        </div>

        {/* Company Size */}
        <div>
          <span className="block text-sm font-medium text-gray-300 mb-2">
            Company Size <span className="text-red-400">*</span>
          </span>
          <ApiDropdown
            config={companySizeDropdownConfig}
            value={data.companySize}
            onSelect={value => handleSelectChange('companySize', value)}
            onClear={() => handleSelectChange('companySize', '')}
            error={!!errors.companySize}
            allowClear
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
            {businessSettings?.currency && (
              <span className="text-gray-500 ml-2">
                ({businessSettings.currency})
              </span>
            )}
          </label>
          <div className="input-container">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center">
              {currencyLoading ? (
                <div className="w-3 h-3 border border-[#14BDEA]/30 border-t-[#14BDEA] rounded-full animate-spin" />
              ) : (
                <span className="text-sm font-semibold text-[#14BDEA]">
                  {currencySymbol}
                </span>
              )}
            </div>
            <input
              id="revenue"
              type="number"
              value={data.revenue ?? ''}
              onChange={handleInputChange('revenue')}
              placeholder="1000000"
              className={`auth-input input-with-icon-left ${errors.revenue ? 'auth-input-error' : ''}`}
              style={{ paddingLeft: '3rem' }}
            />
          </div>
          {errors.revenue && <p className="mt-1 text-sm text-red-400">{errors.revenue}</p>}
        </div>
      </div>

    </motion.div>
  )
}
