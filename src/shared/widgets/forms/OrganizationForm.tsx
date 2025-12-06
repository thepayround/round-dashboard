import { motion } from 'framer-motion'
import { Building, ExternalLink, Loader2 } from 'lucide-react'
import { useCallback, useMemo } from 'react'

import { useCurrencies } from '@/shared/hooks/api'
import { useCompanySizes } from '@/shared/hooks/api/useCompanySize'
import { useIndustries } from '@/shared/hooks/api/useIndustry'
import { useOrganizationTypes } from '@/shared/hooks/api/useOrganizationType'
import { useTimezones } from '@/shared/hooks/api/useUserSettingsOptions'
import { Combobox } from '@/shared/ui/Combobox'
import type { ComboboxOption } from '@/shared/ui/Combobox/types'
import { CountrySelect } from '@/shared/ui/CountrySelect'
import { CurrencySelect } from '@/shared/ui/CurrencySelect'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
import { Textarea } from '@/shared/ui/shadcn/textarea'

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
  // Fetch options from API
  const { data: currencies, isLoading: currenciesLoading } = useCurrencies()
  const { data: industries, isLoading: industriesLoading } = useIndustries()
  const { data: companySizes, isLoading: companySizesLoading } = useCompanySizes()
  const { data: organizationTypes, isLoading: organizationTypesLoading } = useOrganizationTypes()
  const { data: timezones, isLoading: timezonesLoading } = useTimezones()

  // Get currency symbol
  const currencySymbol = currencies.find(c => c.currencyCodeAlpha === (data.currency || 'USD'))?.currencySymbol || '$'

  // Transform to ComboboxOption format
  const industryOptions: ComboboxOption<string>[] = useMemo(() =>
    industries.map(ind => ({ value: ind.code, label: ind.name })), [industries])

  const companySizeOptions: ComboboxOption<string>[] = useMemo(() =>
    companySizes.map(size => ({ value: size.code, label: size.name })), [companySizes])

  const organizationTypeOptions: ComboboxOption<string>[] = useMemo(() =>
    organizationTypes.map(type => ({ value: type.code, label: type.name })), [organizationTypes])

  const timezoneOptions: ComboboxOption<string>[] = useMemo(() =>
    timezones.map(tz => ({ value: tz.value, label: tz.label })), [timezones])

  const fiscalYearOptions: ComboboxOption<string>[] = useMemo(() => [
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
  ], [])

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
            className="w-16 h-16 mx-auto rounded-lg bg-gradient-to-br from-secondary/20 to-accent/20 backdrop-blur-sm border border-secondary/20 flex items-center justify-center"
          >
            <Building className="w-8 h-8 text-secondary" />
          </motion.div>

          <div>
            <h2 className="text-lg font-medium text-foreground mb-2">{headerTitle}</h2>
            <p className="text-muted-foreground text-sm">{headerSubtitle}</p>
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
          className="bg-card border border-border rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Building className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">Company Identity</h3>
              <p className="text-xs text-muted-foreground">Basic company information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName">
                Company Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary" />
                <Input
                  id="companyName"
                  type="text"
                  value={data.companyName}
                  onChange={handleInputChange('companyName')}
                  placeholder="Acme Corporation"
                  className={`pl-10 ${errors.companyName ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.companyName && (
                <p className="text-sm text-destructive">{errors.companyName}</p>
              )}
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website">
                Website
              </Label>
              <div className="relative">
                <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary" />
                <Input
                  id="website"
                  type="url"
                  value={data.website}
                  onChange={handleInputChange('website')}
                  placeholder="https://www.example.com"
                  className={`pl-10 ${errors.website ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.website && (
                <p className="text-sm text-destructive">{errors.website}</p>
              )}
            </div>

            {/* Description - Full Width */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">
                Description
              </Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={handleInputChange('description')}
                placeholder="Brief description of your company..."
                rows={3}
                className={errors.description ? 'border-destructive' : ''}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Business Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: showHeader ? 0.4 : 0.2 }}
          className="bg-card border border-border rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Building className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">Business Details</h3>
              <p className="text-xs text-muted-foreground">Industry and company classification</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country">
                Country <span className="text-destructive">*</span>
              </Label>
              <CountrySelect
                id="country"
                value={data.country}
                onChange={(value) => handleSelectChange('country', value ?? '')}
                placeholder="Select country"
                error={errors.country}
                searchable={true}
                clearable={true}
              />
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <Label htmlFor="industry">
                Industry <span className="text-destructive">*</span>
              </Label>
              <Combobox
                id="industry"
                options={industryOptions}
                value={data.industry}
                onChange={(value) => handleSelectChange('industry', value ?? '')}
                placeholder="Select industry"
                error={errors.industry}
                disabled={industriesLoading}
                isLoading={industriesLoading}
                searchable={true}
                clearable={true}
              />
            </div>

            {/* Company Size */}
            <div className="space-y-2">
              <Label htmlFor="companySize">
                Company Size <span className="text-destructive">*</span>
              </Label>
              <Combobox
                id="companySize"
                options={companySizeOptions}
                value={data.companySize}
                onChange={(value) => handleSelectChange('companySize', value ?? '')}
                placeholder="Select company size"
                error={errors.companySize}
                disabled={companySizesLoading}
                isLoading={companySizesLoading}
                searchable={true}
                clearable={true}
              />
            </div>

            {/* Organization Type */}
            <div className="space-y-2">
              <Label htmlFor="organizationType">
                Organization Type <span className="text-destructive">*</span>
              </Label>
              <Combobox
                id="organizationType"
                options={organizationTypeOptions}
                value={data.organizationType}
                onChange={(value) => handleSelectChange('organizationType', value ?? '')}
                placeholder="Select organization type"
                error={errors.organizationType}
                disabled={organizationTypesLoading}
                isLoading={organizationTypesLoading}
                searchable={true}
                clearable={true}
              />
            </div>

            {/* Registration Number */}
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">
                Registration Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="registrationNumber"
                type="text"
                value={data.registrationNumber}
                onChange={handleInputChange('registrationNumber')}
                placeholder="12345678"
                className={errors.registrationNumber ? 'border-destructive' : ''}
              />
              {errors.registrationNumber && (
                <p className="text-sm text-destructive">{errors.registrationNumber}</p>
              )}
            </div>

            {/* Tax ID */}
            <div className="space-y-2">
              <Label htmlFor="taxId">
                Tax ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="taxId"
                type="text"
                value={data.taxId}
                onChange={handleInputChange('taxId')}
                placeholder="XX-XXXXXXX"
                className={errors.taxId ? 'border-destructive' : ''}
              />
              {errors.taxId && (
                <p className="text-sm text-destructive">{errors.taxId}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Financial Information Section */}
        {showFinancialSettings && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: showHeader ? 0.5 : 0.3 }}
            className="bg-card border border-border rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <span className="text-sm font-medium text-accent">{currencySymbol}</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground">Financial Information</h3>
                <p className="text-xs text-muted-foreground">Revenue and currency settings</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Currency */}
              <div className="space-y-2">
                <Label htmlFor="currency">
                  Currency <span className="text-destructive">*</span>
                </Label>
                <CurrencySelect
                  id="currency"
                  value={data.currency}
                  onChange={(value) => handleSelectChange('currency', value ?? '')}
                  placeholder="Select currency"
                  searchable={true}
                  clearable={true}
                />
              </div>

              {/* Revenue */}
              <div className="space-y-2">
                <Label htmlFor="revenue">
                  Annual Revenue <span className="text-muted-foreground">({data.currency || 'USD'})</span>
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center z-10">
                    {currenciesLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                    ) : (
                      <span className="text-sm font-medium text-secondary">
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
                    className={`pl-10 ${errors.revenue ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.revenue && (
                  <p className="text-sm text-destructive">{errors.revenue}</p>
                )}
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
            className="bg-card border border-border rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">🌍</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground">Regional Settings</h3>
                <p className="text-xs text-muted-foreground">Time zone and fiscal year settings</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Time Zone */}
              <div className="space-y-2">
                <Label htmlFor="timeZone">
                  Time Zone
                </Label>
                <Combobox
                  id="timeZone"
                  options={timezoneOptions}
                  value={data.timeZone}
                  onChange={(value) => handleSelectChange('timeZone', value ?? '')}
                  placeholder="Select time zone"
                  disabled={timezonesLoading}
                  isLoading={timezonesLoading}
                  searchable={true}
                  clearable={true}
                />
              </div>

              {/* Fiscal Year Start */}
              <div className="space-y-2">
                <Label htmlFor="fiscalYearStart">
                  Fiscal Year Start
                </Label>
                <Combobox
                  id="fiscalYearStart"
                  options={fiscalYearOptions}
                  value={data.fiscalYearStart}
                  onChange={(value) => handleSelectChange('fiscalYearStart', value ?? '')}
                  placeholder="Select fiscal year start"
                  searchable={true}
                  clearable={true}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
