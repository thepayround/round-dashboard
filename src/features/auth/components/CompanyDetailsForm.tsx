import { AlertCircle } from 'lucide-react'

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
    <div className="flex flex-col gap-6">
      {/* Company Name */}
      <div className="grid gap-2">
        <Label htmlFor="companyName">
          Company Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="companyName"
          type="text"
          value={companyInfo.companyName}
          onChange={e => handleInputChange('companyName', e.target.value)}
          onBlur={e => handleInputBlur('companyName', e.target.value)}
          placeholder="Acme Corporation"
          required
          aria-invalid={hasCompanyError('companyName')}
          aria-describedby={hasCompanyError('companyName') ? 'companyName-error' : undefined}
        />
        {hasCompanyError('companyName') && (
          <p id="companyName-error" className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {getCompanyError('companyName')}
          </p>
        )}
      </div>

      {/* Registration Number & Tax ID Row */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Registration Number */}
        <div className="grid gap-2">
          <Label htmlFor="registrationNumber">
            Registration Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="registrationNumber"
            type="text"
            value={companyInfo.registrationNumber}
            onChange={e => handleInputChange('registrationNumber', e.target.value)}
            onBlur={e => handleInputBlur('registrationNumber', e.target.value)}
            placeholder="12345678"
            required
            aria-invalid={hasCompanyError('registrationNumber')}
            aria-describedby={hasCompanyError('registrationNumber') ? 'registrationNumber-error' : undefined}
          />
          {hasCompanyError('registrationNumber') && (
            <p id="registrationNumber-error" className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {getCompanyError('registrationNumber')}
            </p>
          )}
        </div>

        {/* Tax ID */}
        <div className="grid gap-2">
          <Label htmlFor="taxId">Tax ID</Label>
          <Input
            id="taxId"
            type="text"
            value={companyInfo.taxId}
            onChange={e => handleInputChange('taxId', e.target.value)}
            onBlur={e => handleInputBlur('taxId', e.target.value)}
            placeholder="XX-XXXXXXX"
            aria-invalid={hasCompanyError('taxId')}
            aria-describedby={hasCompanyError('taxId') ? 'taxId-error' : undefined}
          />
          {hasCompanyError('taxId') && (
            <p id="taxId-error" className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {getCompanyError('taxId')}
            </p>
          )}
        </div>
      </div>

      {/* Currency */}
      <div className="grid gap-2">
        <Label htmlFor="currency">
          Currency <span className="text-destructive">*</span>
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
          <p id="currency-error" className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {getCompanyError('currency')}
          </p>
        )}
      </div>
    </div>
  )
}
