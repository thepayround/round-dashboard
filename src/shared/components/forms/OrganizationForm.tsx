import { motion } from 'framer-motion'
import { Building, ExternalLink, AlignLeft, Hash, CreditCard } from 'lucide-react'
import { useCallback } from 'react'

import { ApiDropdown, countryDropdownConfig, industryDropdownConfig, companySizeDropdownConfig, organizationTypeDropdownConfig, currencyDropdownConfig, fiscalYearDropdownConfig, timezoneDropdownConfig } from '@/shared/components/ui/ApiDropdown'
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
  readOnly?: boolean
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
  className = '',
  readOnly = false
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
        <div className="w-8 h-8 border border-[#14BDEA]/30 border-t-[#14BDEA] rounded-full animate-spin" />
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
            className="w-16 h-16 mx-auto rounded-lg bg-accent/[#32A1E4]/20 border border-white/10 flex items-center justify-center"
          >
            <Building className="w-8 h-8 text-[#32A1E4]" />
          </motion.div>

          <div>
            <h2 className="text-xl font-normal tracking-tight text-white mb-2">{headerTitle}</h2>
            <p className="text-gray-400 text-sm">{headerSubtitle}</p>
          </div>
        </div>
      )}

      {/* Form Sections - Polar.sh style */}
      <div className="flex flex-col divide-y divide-white/10">
        
        {/* Company Identity Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: showHeader ? 0.3 : 0.1 }}
          className="relative flex flex-col gap-8 p-8"
        >
          <div className="flex w-full flex-col gap-y-6">
            <div className="flex flex-col gap-y-2">
              <h2 className="text-lg font-medium">Company Identity</h2>
              <p className="text-gray-500 dark:text-polar-500 leading-snug">Basic company information</p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-y-6">
            {/* Company Name & Website Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="companyName" className="auth-label">
                  Company Name <span className="text-[#D417C8]">*</span>
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
                    readOnly={readOnly}
                    disabled={readOnly}
                  />
                </div>
                {errors.companyName && <p className="mt-1 text-sm text-[#D417C8]">{errors.companyName}</p>}
              </div>

              <div className="space-y-2">
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
                    readOnly={readOnly}
                    disabled={readOnly}
                  />
                </div>
                {errors.website && <p className="mt-1 text-sm text-[#D417C8]">{errors.website}</p>}
              </div>
            </div>

            {/* Description - Full Width */}
            <div className="space-y-2">
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
                  readOnly={readOnly}
                  disabled={readOnly}
                />
              </div>
              {errors.description && <p className="mt-1 text-sm text-[#D417C8]">{errors.description}</p>}
            </div>
          </div>
        </motion.div>

        {/* Business Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: showHeader ? 0.4 : 0.2 }}
          className="relative flex flex-col gap-8 p-8"
        >
          <div className="flex w-full flex-col gap-y-6">
            <div className="flex flex-col gap-y-2">
              <h2 className="text-lg font-medium">Business Details</h2>
              <p className="text-gray-500 dark:text-polar-500 leading-snug">Industry and company classification</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Country */}
            <div className="space-y-2">
              <label htmlFor="country" className="auth-label">
                Country <span className="text-[#D417C8]">*</span>
              </label>
              <ApiDropdown
                id="country"
                config={countryDropdownConfig}
                value={data.country}
                onSelect={value => handleSelectChange('country', value)}
                onClear={() => handleSelectChange('country', '')}
                error={!!errors.country}
                allowClear
                disabled={readOnly}
              />
              {errors.country && <p className="mt-1 text-sm text-[#D417C8]">{errors.country}</p>}
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <label htmlFor="industry" className="auth-label">
                Industry <span className="text-[#D417C8]">*</span>
              </label>
              <ApiDropdown
                id="industry"
                config={industryDropdownConfig}
                value={data.industry}
                onSelect={value => handleSelectChange('industry', value)}
                onClear={() => handleSelectChange('industry', '')}
                error={!!errors.industry}
                allowClear
                disabled={readOnly}
              />
              {errors.industry && <p className="mt-1 text-sm text-[#D417C8]">{errors.industry}</p>}
            </div>

            {/* Company Size */}
            <div className="space-y-2">
              <label htmlFor="companySize" className="auth-label">
                Company Size <span className="text-[#D417C8]">*</span>
              </label>
              <ApiDropdown
                id="companySize"
                config={companySizeDropdownConfig}
                value={data.companySize}
                onSelect={value => handleSelectChange('companySize', value)}
                onClear={() => handleSelectChange('companySize', '')}
                error={!!errors.companySize}
                allowClear
                disabled={readOnly}
              />
              {errors.companySize && <p className="mt-1 text-sm text-[#D417C8]">{errors.companySize}</p>}
            </div>

            {/* Organization Type */}
            <div className="space-y-2">
              <label htmlFor="organizationType" className="auth-label">
                Organization Type <span className="text-[#D417C8]">*</span>
              </label>
              <ApiDropdown
                id="organizationType"
                config={organizationTypeDropdownConfig}
                value={data.organizationType}
                onSelect={value => handleSelectChange('organizationType', value)}
                onClear={() => handleSelectChange('organizationType', '')}
                error={!!errors.organizationType}
                allowClear
                disabled={readOnly}
              />
              {errors.organizationType && <p className="mt-1 text-sm text-[#D417C8]">{errors.organizationType}</p>}
            </div>
          </div>
        </motion.div>

        {/* Business Compliance Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: showHeader ? 0.45 : 0.25 }}
          className="relative flex flex-col gap-8 p-8"
        >
          <div className="flex w-full flex-col gap-y-6">
            <div className="flex flex-col gap-y-2">
              <h2 className="text-lg font-medium">Business Compliance</h2>
              <p className="text-gray-500 dark:text-polar-500 leading-snug">Registration and compliance information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Registration Number */}
            <div className="space-y-2">
              <label htmlFor="registrationNumber" className="auth-label">
                Registration Number <span className="text-[#D417C8]">*</span>
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
                  readOnly={readOnly}
                  disabled={readOnly}
                />
              </div>
              {errors.registrationNumber && <p className="mt-1 text-sm text-[#D417C8]">{errors.registrationNumber}</p>}
            </div>

            {/* Tax ID */}
            <div className="space-y-2">
              <label htmlFor="taxId" className="auth-label">
                Tax ID <span className="text-[#D417C8]">*</span>
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
                  readOnly={readOnly}
                  disabled={readOnly}
                />
              </div>
              {errors.taxId && <p className="mt-1 text-sm text-[#D417C8]">{errors.taxId}</p>}
            </div>
          </div>
        </motion.div>

        {/* Financial Information Section */}
        {showFinancialSettings && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: showHeader ? 0.5 : 0.3 }}
            className="relative flex flex-col gap-8 p-8"
          >
            <div className="flex w-full flex-col gap-y-6">
              <div className="flex flex-col gap-y-2">
                <h2 className="text-lg font-medium">Financial Information</h2>
                <p className="text-gray-500 dark:text-polar-500 leading-snug">Revenue and currency settings</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Currency */}
              <div className="space-y-2">
                <label htmlFor="currency" className="auth-label">
                  Currency <span className="text-[#D417C8]">*</span>
                </label>
                <ApiDropdown
                  config={currencyDropdownConfig}
                  value={data.currency}
                  onSelect={value => handleSelectChange('currency', value)}
                  onClear={() => handleSelectChange('currency', '')}
                  error={!!errors.currency}
                  allowClear
                  disabled={readOnly}
                />
                {errors.currency && <p className="mt-1 text-sm text-[#D417C8]">{errors.currency}</p>}
              </div>

              {/* Revenue */}
              <div className="space-y-2">
                <label htmlFor="revenue" className="auth-label">
                  Annual Revenue <span className="text-gray-500">(optional)</span>
                  <span className="text-gray-500 ml-2">({data.currency || 'USD'})</span>
                </label>
                <div className="input-container">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                    <span className="text-sm font-normal tracking-tight tracking-tight text-[#14BDEA]">
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
                    readOnly={readOnly}
                    disabled={readOnly}
                  />
                </div>
                {errors.revenue && <p className="mt-1 text-sm text-[#D417C8]">{errors.revenue}</p>}
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
            className="relative flex flex-col gap-8 p-8"
          >
            <div className="flex w-full flex-col gap-y-6">
              <div className="flex flex-col gap-y-2">
                <h2 className="text-lg font-medium">Regional Settings</h2>
                <p className="text-gray-500 dark:text-polar-500 leading-snug">Time zone and fiscal year settings</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Time Zone */}
              <div className="space-y-2">
                <label htmlFor="timeZone" className="auth-label">
                  Time Zone
                </label>
                <ApiDropdown
                  config={timezoneDropdownConfig}
                  value={data.timeZone}
                  onSelect={(value) => handleSelectChange('timeZone', value)}
                  error={!!errors.timeZone}
                  allowClear
                  disabled={readOnly}
                />
                {errors.timeZone && (
                  <p className="text-[#D417C8] text-xs mt-1">{errors.timeZone}</p>
                )}
              </div>

              {/* Fiscal Year Start */}
              <div className="space-y-2">
                <label htmlFor="fiscalYearStart" className="auth-label">
                  Fiscal Year Start
                </label>
                <ApiDropdown
                  config={fiscalYearDropdownConfig}
                  value={data.fiscalYearStart}
                  onSelect={value => handleSelectChange('fiscalYearStart', value)}
                  allowClear
                  disabled={readOnly}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
