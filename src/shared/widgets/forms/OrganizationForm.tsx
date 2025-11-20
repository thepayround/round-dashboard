import { motion } from 'framer-motion'
import { Building, ExternalLink } from 'lucide-react'
import { useCallback } from 'react'

import { useCurrency } from '@/shared/hooks/useCurrency'
import { Input, Textarea, UiDropdown } from '@/shared/ui'
import { ApiDropdown, countryDropdownConfig, industryDropdownConfig, companySizeDropdownConfig, organizationTypeDropdownConfig } from '@/shared/ui/ApiDropdown'

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
  const { getCurrencySymbol, isLoading: currencyLoading } = useCurrency()

  // Get currency symbol
  const currencySymbol = getCurrencySymbol(data.currency || 'USD')

  // Handle input changes
  const handleInputChange = useCallback((field: keyof OrganizationFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange({
      ...data,
      [field]: e.target.value,
    })
  }, [data, onChange])

  const handleSelectChange = useCallback((field: keyof OrganizationFormData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    })
  }, [data, onChange])

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
            className="w-16 h-16 mx-auto rounded-lg bg-gradient-to-br from-[#32A1E4]/20 to-accent/20 backdrop-blur-sm border border-white/20 flex items-center justify-center"
          >
            <Building className="w-8 h-8 text-[#32A1E4]" />
          </motion.div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">{headerTitle}</h2>
            <p className="text-gray-400 text-sm">{headerSubtitle}</p>
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
          <div className="flex items-center gap-4 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#32A1E4]/20 to-accent/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Building className="w-4 h-4 text-[#32A1E4]" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Company Identity</h3>
              <p className="text-xs text-gray-400">Basic company information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Name */}
            <Input
              id="companyName"
              type="text"
              label="Company Name"
              leftIcon={Building}
              value={data.companyName}
              onChange={handleInputChange('companyName')}
              placeholder="Acme Corporation"
              error={errors.companyName}
              required
            />

            {/* Website */}
            <Input
              id="website"
              type="url"
              label="Website"
              leftIcon={ExternalLink}
              value={data.website}
              onChange={handleInputChange('website')}
              placeholder="https://www.example.com"
              error={errors.website}
            />

            {/* Description - Full Width */}
            <div className="md:col-span-2">
              <Textarea
                id="description"
                label="Description"
                value={data.description}
                onChange={handleInputChange('description')}
                placeholder="Brief description of your company..."
                rows={3}
                error={errors.description}
              />
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
          <div className="flex items-center gap-4 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary/20 to-accent/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Building className="w-4 h-4 text-secondary" />
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

        {/* Financial Information Section */}
        {showFinancialSettings && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: showHeader ? 0.5 : 0.3 }}
            className="bg-white/4 backdrop-blur-xl border border-white/12 rounded-lg p-6"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-accent">{currencySymbol}</span>
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
                <UiDropdown
                  id="currency"
                  value={data.currency}
                  onSelect={(value: string) => handleSelectChange('currency', value)}
                  options={[
                    { value: 'USD', label: 'USD - US Dollar' },
                    { value: 'EUR', label: 'EUR - Euro' },
                    { value: 'GBP', label: 'GBP - British Pound' },
                    { value: 'CAD', label: 'CAD - Canadian Dollar' },
                    { value: 'AUD', label: 'AUD - Australian Dollar' },
                    { value: 'JPY', label: 'JPY - Japanese Yen' },
                  ]}
                  icon={
                    currencyLoading ? (
                      <div className="w-3 h-3 border border-secondary/30 border-t-secondary rounded-full animate-spin" />
                    ) : (
                      <span className="text-sm font-semibold text-secondary">{currencySymbol}</span>
                    )
                  }
                />
              </div>

              {/* Revenue */}
              <div>
                <label htmlFor="revenue" className="auth-label">
                  Annual Revenue
                  <span className="text-gray-500 ml-2">({data.currency})</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center z-10">
                    {currencyLoading ? (
                      <div className="w-3 h-3 border border-secondary/30 border-t-secondary rounded-full animate-spin" />
                    ) : (
                      <span className="text-sm font-semibold text-secondary">
                        {currencySymbol}
                      </span>
                    )}
                  </div>
                  <Input
                    id="revenue"
                    type="number"
                    value={data.revenue}
                    onChange={handleInputChange('revenue')}
                    placeholder="1000000"
                    error={errors.revenue}
                    className="pl-12"
                  />
                </div>
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
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-[#32A1E4]/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">π</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Regional Settings</h3>
                <p className="text-xs text-gray-400">Time zone and fiscal year settings</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Time Zone */}
              <UiDropdown
                id="timeZone"
                label="Time Zone"
                value={data.timeZone}
                onSelect={(value: string) => handleSelectChange('timeZone', value)}
                options={[
                  { value: 'UTC', label: 'UTC - Coordinated Universal Time' },
                  { value: 'America/New_York', label: 'EST - Eastern Standard Time' },
                  { value: 'America/Chicago', label: 'CST - Central Standard Time' },
                  { value: 'America/Denver', label: 'MST - Mountain Standard Time' },
                  { value: 'America/Los_Angeles', label: 'PST - Pacific Standard Time' },
                  { value: 'Europe/London', label: 'GMT - Greenwich Mean Time' },
                  { value: 'Europe/Paris', label: 'CET - Central European Time' },
                  { value: 'Asia/Tokyo', label: 'JST - Japan Standard Time' },
                ]}
              />

              {/* Fiscal Year Start */}
              <UiDropdown
                id="fiscalYearStart"
                label="Fiscal Year Start"
                value={data.fiscalYearStart}
                onSelect={(value: string) => handleSelectChange('fiscalYearStart', value)}
                options={[
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
                ]}
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

