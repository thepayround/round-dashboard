import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { Building, ExternalLink, AlignLeft, Hash, CreditCard } from 'lucide-react'
import { ApiDropdown, countryDropdownConfig, industryDropdownConfig, companySizeDropdownConfig, organizationTypeDropdownConfig, currencyDropdownConfig } from '@/shared/components/ui/ApiDropdown'
import { useCurrencies } from '@/shared/hooks/api/useCountryCurrency'

export interface OrganizationFormData {
  companyName: string
  industry: string
  companySize: string
  organizationType: string
  website: string
  description: string
  revenue: string
  country: string
  currency: string
  timeZone: string
  fiscalYearStart: string
  registrationNumber: string
  taxId: string
}

interface OrganizationFormProps {
  data: OrganizationFormData
  onChange: (data: OrganizationFormData) => void
  errors?: Record<string, string>
  showHeader?: boolean
  headerTitle?: string
  headerSubtitle?: string
  showFinancialSettings?: boolean
  showRegionalSettings?: boolean
  className?: string
}

export const OrganizationForm = ({
  data,
  onChange,
  errors = {},
  showHeader = true,
  headerTitle = 'Organization',
  headerSubtitle = 'Complete your company profile',
  showFinancialSettings = true,
  showRegionalSettings = true,
  className = ''
}: OrganizationFormProps) => {
  const { data: currencies, isLoading: currenciesLoading } = useCurrencies()
  
  // Handle input changes
  const handleInputChange = useCallback((field: keyof OrganizationFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange({
      ...data,
      [field]: e.target.value,
    })
  }, [data, onChange])

  const handleSelectChange = useCallback((field: keyof OrganizationFormData, value: string) => {
    const newData = {
      ...data,
      [field]: value,
    }
    onChange(newData)
  }, [data, onChange])
  
  // Get current currency symbol from backend - NO fallbacks, backend is source of truth
  const currentCurrency = currencies?.find(currency => currency.currencyCodeAlpha === data.currency)
  const currencySymbol = currentCurrency?.currencySymbol
  
  // If we have a saved currency but currencies are still loading, show loading state
  if (data.currency && currenciesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-[#14BDEA]/30 border-t-[#14BDEA] rounded-full animate-spin" />
        <span className="ml-3 text-white/60">Loading currency data for {data.currency}...</span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`space-y-6 ${className}`}
    >
      {/* Header */}
      {showHeader && (
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 mx-auto rounded-lg bg-gradient-to-br from-[#32A1E4]/20 to-[#7767DA]/20 backdrop-blur-sm border border-white/20 flex items-center justify-center"
          >
            <Building className="w-8 h-8 text-[#32A1E4]" />
          </motion.div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{headerTitle}</h2>
            <p className="text-gray-400 text-lg">{headerSubtitle}</p>
          </div>
        </div>
      )}

      {/* Form Sections */}
      <div className="space-y-6">
        
        {/* Company Identity Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: showHeader ? 0.3 : 0.1 }}
          className="bg-white/4 backdrop-blur-xl border border-white/12 rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#32A1E4]/20 to-[#7767DA]/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Building className="w-4 h-4 text-[#32A1E4]" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Company Identity</h3>
              <p className="text-xs text-gray-400">Basic company information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="auth-label">
                Company Name <span className="text-red-400">*</span>
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

            {/* Website */}
            <div>
              <label htmlFor="website" className="auth-label">
                Website
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

            {/* Description - Full Width */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="auth-label">
                Description
              </label>
              <div className="input-container">
                <AlignLeft className="input-icon-left textarea-icon auth-icon-primary" />
                <textarea
                  id="description"
                  value={data.description}
                  onChange={handleInputChange('description')}
                  placeholder="Brief description of your company..."
                  rows={3}
                  className={`auth-input textarea input-with-icon-left resize-none ${errors.description ? 'auth-input-error' : ''}`}
                />
              </div>
              {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
            </div>
          </div>
        </motion.div>

        {/* Business Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: showHeader ? 0.4 : 0.2 }}
          className="bg-white/4 backdrop-blur-xl border border-white/12 rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#14BDEA]/20 to-[#7767DA]/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Building className="w-4 h-4 text-[#14BDEA]" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Business Details</h3>
              <p className="text-xs text-gray-400">Industry and company classification</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Organization Type */}
            <div>
              <span className="block text-sm font-medium text-gray-300 mb-2">
                Organization Type <span className="text-red-400">*</span>
              </span>
              <ApiDropdown
                config={organizationTypeDropdownConfig}
                value={data.organizationType}
                onSelect={value => handleSelectChange('organizationType', value)}
                onClear={() => handleSelectChange('organizationType', '')}
                error={!!errors.organizationType}
                allowClear
              />
              {errors.organizationType && <p className="mt-1 text-sm text-red-400">{errors.organizationType}</p>}
            </div>
          </div>
        </motion.div>

        {/* Business Compliance Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: showHeader ? 0.45 : 0.25 }}
          className="bg-white/4 backdrop-blur-xl border border-white/12 rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#14BDEA]/20 to-[#32A1E4]/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Hash className="w-4 h-4 text-[#14BDEA]" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Business Compliance</h3>
              <p className="text-xs text-gray-400">Registration and compliance information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Registration Number */}
            <div>
              <label htmlFor="registrationNumber" className="auth-label">
                Registration Number <span className="text-red-400">*</span>
              </label>
              <div className="input-container">
                <Hash className="input-icon-left auth-icon-primary" />
                <input
                  id="registrationNumber"
                  type="text"
                  value={data.registrationNumber}
                  onChange={handleInputChange('registrationNumber')}
                  placeholder="12345678"
                  className={`auth-input input-with-icon-left ${errors.registrationNumber ? 'auth-input-error' : ''}`}
                />
              </div>
              {errors.registrationNumber && <p className="mt-1 text-sm text-red-400">{errors.registrationNumber}</p>}
            </div>

            {/* Tax ID */}
            <div>
              <label htmlFor="taxId" className="auth-label">
                Tax ID <span className="text-gray-500">(optional)</span>
              </label>
              <div className="input-container">
                <CreditCard className="input-icon-left auth-icon-primary" />
                <input
                  id="taxId"
                  type="text"
                  value={data.taxId}
                  onChange={handleInputChange('taxId')}
                  placeholder="XX-XXXXXXX"
                  className={`auth-input input-with-icon-left ${errors.taxId ? 'auth-input-error' : ''}`}
                />
              </div>
              {errors.taxId && <p className="mt-1 text-sm text-red-400">{errors.taxId}</p>}
            </div>
          </div>
        </motion.div>

        {/* Financial Information Section */}
        {showFinancialSettings && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: showHeader ? 0.5 : 0.3 }}
            className="bg-white/4 backdrop-blur-xl border border-white/12 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7767DA]/20 to-[#D417C8]/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-[#7767DA]">{currencySymbol}</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Financial Information</h3>
                <p className="text-xs text-gray-400">Revenue and currency settings</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Currency */}
              <div>
                <label htmlFor="currency" className="auth-label">
                  Currency <span className="text-red-400">*</span>
                </label>
                <ApiDropdown
                  config={currencyDropdownConfig}
                  value={data.currency}
                  onSelect={value => handleSelectChange('currency', value)}
                  onClear={() => handleSelectChange('currency', '')}
                  error={!!errors.currency}
                  allowClear
                />
                {errors.currency && <p className="mt-1 text-sm text-red-400">{errors.currency}</p>}
              </div>

              {/* Revenue */}
              <div>
                <label htmlFor="revenue" className="auth-label">
                  Annual Revenue <span className="text-gray-500">(optional)</span>
                  <span className="text-gray-500 ml-2">({data.currency || 'USD'})</span>
                </label>
                <div className="input-container">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                    <span className="text-sm font-semibold text-[#14BDEA]">
                      {currencySymbol}
                    </span>
                  </div>
                  <input
                    id="revenue"
                    type="number"
                    value={data.revenue}
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
        )}

        {/* Regional Settings Section */}
        {showRegionalSettings && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: showHeader ? 0.6 : 0.4 }}
            className="bg-white/4 backdrop-blur-xl border border-white/12 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D417C8]/20 to-[#32A1E4]/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-[#D417C8]">🌍</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Regional Settings</h3>
                <p className="text-xs text-gray-400">Time zone and fiscal year settings</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Time Zone */}
              <div>
                <label htmlFor="timeZone" className="auth-label">
                  Time Zone
                </label>
                <select
                  id="timeZone"
                  value={data.timeZone}
                  onChange={e => handleSelectChange('timeZone', e.target.value)}
                  className="auth-input"
                >
                  <option value="UTC">UTC - Coordinated Universal Time</option>
                  <option value="America/New_York">EST - Eastern Standard Time</option>
                  <option value="America/Chicago">CST - Central Standard Time</option>
                  <option value="America/Denver">MST - Mountain Standard Time</option>
                  <option value="America/Los_Angeles">PST - Pacific Standard Time</option>
                  <option value="Europe/London">GMT - Greenwich Mean Time</option>
                  <option value="Europe/Paris">CET - Central European Time</option>
                  <option value="Asia/Tokyo">JST - Japan Standard Time</option>
                </select>
              </div>

              {/* Fiscal Year Start */}
              <div>
                <label htmlFor="fiscalYearStart" className="auth-label">
                  Fiscal Year Start
                </label>
                <select
                  id="fiscalYearStart"
                  value={data.fiscalYearStart}
                  onChange={e => handleSelectChange('fiscalYearStart', e.target.value)}
                  className="auth-input"
                >
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
