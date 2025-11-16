import { motion } from 'framer-motion'
import { Building, Hash, CreditCard, AlertCircle } from 'lucide-react'

import { useCompanyDetailsFormController } from '../hooks/useCompanyDetailsFormController'

import type { CompanyInfo, Currency } from '@/shared/types/business'
import { Input } from '@/shared/ui'
import { ApiDropdown, currencyDropdownConfig } from '@/shared/ui/ApiDropdown'
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
      <Input
        id="companyName"
        label="Company Name *"
        leftIcon={Building}
        type="text"
        value={companyInfo.companyName}
        onChange={e => handleInputChange('companyName', e.target.value)}
        onBlur={e => handleInputBlur('companyName', e.target.value)}
        placeholder="Acme Corporation"
        error={hasCompanyError('companyName') ? getCompanyError('companyName') : undefined}
        required
      />

      {/* Registration Number & Tax ID Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Registration Number */}
        <Input
          id="registrationNumber"
          label="Registration Number *"
          leftIcon={Hash}
          type="text"
          value={companyInfo.registrationNumber}
          onChange={e => handleInputChange('registrationNumber', e.target.value)}
          onBlur={e => handleInputBlur('registrationNumber', e.target.value)}
          placeholder="12345678"
          error={hasCompanyError('registrationNumber') ? getCompanyError('registrationNumber') : undefined}
          required
        />

        {/* Tax ID */}
        <Input
          id="taxId"
          label="Tax ID"
          leftIcon={CreditCard}
          type="text"
          value={companyInfo.taxId}
          onChange={e => handleInputChange('taxId', e.target.value)}
          onBlur={e => handleInputBlur('taxId', e.target.value)}
          placeholder="XX-XXXXXXX"
          error={hasCompanyError('taxId') ? getCompanyError('taxId') : undefined}
        />
      </div>

      {/* Currency */}
      <div>
        <label htmlFor="currency" className="block text-sm font-normal text-white/90 mb-2 tracking-tight">
          Currency *
        </label>
        <ApiDropdown
          config={currencyDropdownConfig}
          value={companyInfo.currency ?? ''}
          onSelect={value => {
            handleSelectChange('currency', value as Currency)
            // Clear any existing currency error when selection is made
            if (hasCompanyError('currency')) {
              onErrorsChange(errors.filter(error => error.field !== 'currency'))
            }
          }}
          onClear={() => handleSelectChange('currency', '')}
          error={hasCompanyError('currency')}
          allowClear
        />
        {hasCompanyError('currency') && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 flex items-center space-x-2 text-auth-error font-medium text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{getCompanyError('currency')}</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}





