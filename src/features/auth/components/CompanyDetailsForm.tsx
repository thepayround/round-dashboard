import { motion } from 'framer-motion'
import { Building, Hash, CreditCard } from 'lucide-react'

import { useCompanyDetailsFormController } from '../hooks/useCompanyDetailsFormController'

import { useCurrency } from '@/shared/hooks/useCurrency'
import type { CompanyInfo, Currency } from '@/shared/types/business'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/shadcn/select'
import type { ValidationError } from '@/shared/utils/validation'


interface CompanyDetailsFormProps {
  companyInfo: CompanyInfo
  onCompanyInfoChange: (companyInfo: CompanyInfo) => void
  onValidationChange: (isValid: boolean) => void
  errors: ValidationError[]
  onErrorsChange: (errors: ValidationError[]) => void
}

export const CompanyDetailsForm = ({
  companyInfo,
  onCompanyInfoChange,
  onValidationChange,
  errors,
  onErrorsChange,
}: CompanyDetailsFormProps) => {
  const {
    handleInputChange,
    handleInputBlur,
    handleSelectChange,
    hasCompanyError,
    getCompanyError,
  } = useCompanyDetailsFormController({
    companyInfo,
    onCompanyInfoChange,
    onValidationChange,
    errors,
    onErrorsChange,
  })

  const { currencies, isLoading: isCurrenciesLoading } = useCurrency()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-normal tracking-tight text-white mb-2"
        >
          Company Information
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white/85"
        >
          Tell us about your company for billing and compliance
        </motion.p>
      </div>

      {/* Company Name */}
      <div className="space-y-2">
        <Label htmlFor="companyName" className="text-sm font-normal text-white/90 tracking-tight">
          Company Name<span className="text-destructive"> *</span>
        </Label>
        <div className="relative">
          <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="companyName"
            type="text"
            value={companyInfo.companyName}
            onChange={e => handleInputChange('companyName', e.target.value)}
            onBlur={e => handleInputBlur('companyName', e.target.value)}
            placeholder="Acme Corporation"
            className="pl-10"
            required
            aria-invalid={hasCompanyError('companyName')}
            aria-describedby={hasCompanyError('companyName') ? 'companyName-error' : undefined}
          />
        </div>
        {hasCompanyError('companyName') && (
          <p id="companyName-error" className="text-sm text-destructive">
            {getCompanyError('companyName')}
          </p>
        )}
      </div>

      {/* Registration Number & Tax ID Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Registration Number */}
        <div className="space-y-2">
          <Label htmlFor="registrationNumber" className="text-sm font-normal text-white/90 tracking-tight">
            Registration Number<span className="text-destructive"> *</span>
          </Label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="registrationNumber"
              type="text"
              value={companyInfo.registrationNumber}
              onChange={e => handleInputChange('registrationNumber', e.target.value)}
              onBlur={e => handleInputBlur('registrationNumber', e.target.value)}
              placeholder="12345678"
              className="pl-10"
              required
              aria-invalid={hasCompanyError('registrationNumber')}
              aria-describedby={hasCompanyError('registrationNumber') ? 'registrationNumber-error' : undefined}
            />
          </div>
          {hasCompanyError('registrationNumber') && (
            <p id="registrationNumber-error" className="text-sm text-destructive">
              {getCompanyError('registrationNumber')}
            </p>
          )}
        </div>

        {/* Tax ID */}
        <div className="space-y-2">
          <Label htmlFor="taxId" className="text-sm font-normal text-white/90 tracking-tight">
            Tax ID
          </Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="taxId"
              type="text"
              value={companyInfo.taxId}
              onChange={e => handleInputChange('taxId', e.target.value)}
              onBlur={e => handleInputBlur('taxId', e.target.value)}
              placeholder="XX-XXXXXXX"
              className="pl-10"
              aria-invalid={hasCompanyError('taxId')}
              aria-describedby={hasCompanyError('taxId') ? 'taxId-error' : undefined}
            />
          </div>
          {hasCompanyError('taxId') && (
            <p id="taxId-error" className="text-sm text-destructive">
              {getCompanyError('taxId')}
            </p>
          )}
        </div>
      </div>

      {/* Currency */}
      <div className="space-y-2">
        <Label htmlFor="currency" className="text-sm font-normal text-white/90 tracking-tight">
          Currency<span className="text-destructive"> *</span>
        </Label>
        <Select
          value={companyInfo.currency ?? ''}
          onValueChange={value => {
            handleSelectChange('currency', value as Currency)
            // Clear any existing currency error when selection is made
            if (hasCompanyError('currency')) {
              onErrorsChange(errors.filter(error => error.field !== 'currency'))
            }
          }}
          disabled={isCurrenciesLoading}
        >
          <SelectTrigger
            id="currency"
            className="w-full"
            aria-invalid={hasCompanyError('currency')}
            aria-describedby={hasCompanyError('currency') ? 'currency-error' : undefined}
          >
            <SelectValue placeholder={isCurrenciesLoading ? 'Loading currencies...' : 'Select currency'} />
          </SelectTrigger>
          <SelectContent>
            {currencies.map(currency => (
              <SelectItem key={currency.code} value={currency.code}>
                {currency.code} - {currency.name} ({currency.symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasCompanyError('currency') && (
          <p id="currency-error" className="text-sm text-destructive">
            {getCompanyError('currency')}
          </p>
        )}
      </div>
    </motion.div>
  )
}





