import { motion } from 'framer-motion'
import { Building, Hash, CreditCard, AlertCircle } from 'lucide-react'
import { useEffect } from 'react'

import type { CompanyInfo, Currency } from '@/shared/types/business'
import type { ValidationError } from '@/shared/utils/validation'
import { validateCompanyField, validateCompanyInfo } from '@/shared/utils/companyValidation'
import { getFieldError, hasFieldError } from '@/shared/utils/validation'
import { ApiDropdown, currencyDropdownConfig } from '@/shared/components/ui/ApiDropdown'

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
  const handleInputChange = (field: keyof CompanyInfo, value: string | number) => {
    const updatedCompanyInfo = { ...companyInfo, [field]: value }
    onCompanyInfoChange(updatedCompanyInfo)

    // Clear field error when user starts typing
    if (hasFieldError(errors, field)) {
      onErrorsChange(errors.filter(error => error.field !== field))
    }

    // Validate entire form to update parent component
    const validation = validateCompanyInfo(updatedCompanyInfo)
    onValidationChange(validation.isValid)
  }

  const handleInputBlur = (field: keyof CompanyInfo, value: string) => {
    // Only validate string fields on blur
    if (typeof value === 'string') {
      const fieldValidation = validateCompanyField(field, value)
      if (!fieldValidation.isValid) {
        onErrorsChange([
          ...errors.filter(error => error.field !== field),
          ...fieldValidation.errors,
        ])
      }
    }
  }

  const handleSelectChange = (field: keyof CompanyInfo, value: string) => {
    handleInputChange(field, value)
    
    // Trigger validation immediately for select fields
    const updatedCompanyInfo = { ...companyInfo, [field]: value }
    const validation = validateCompanyInfo(updatedCompanyInfo)
    onValidationChange(validation.isValid)
  }

  // Run initial validation when component mounts or companyInfo changes
  useEffect(() => {
    const validation = validateCompanyInfo(companyInfo)
    onValidationChange(validation.isValid)
  }, [companyInfo, onValidationChange])

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
          className="text-2xl font-bold auth-text mb-2"
        >
          Company Information
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="auth-text-muted"
        >
          Tell us about your company for billing and compliance
        </motion.p>
      </div>

      {/* Company Name */}
      <div>
        <label htmlFor="companyName" className="auth-label">
          Company Name *
        </label>
        <div className="input-container">
          <Building className="input-icon-left auth-icon-primary" />
          <input
            id="companyName"
            type="text"
            value={companyInfo.companyName}
            onChange={e => handleInputChange('companyName', e.target.value)}
            onBlur={e => handleInputBlur('companyName', e.target.value)}
            placeholder="Acme Corporation"
            className={`auth-input input-with-icon-left ${
              hasFieldError(errors, 'companyName') ? 'auth-input-error' : ''
            }`}
            required
          />
        </div>
        {hasFieldError(errors, 'companyName') && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{getFieldError(errors, 'companyName')?.message}</span>
          </motion.div>
        )}
      </div>

      {/* Registration Number & Tax ID Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Registration Number */}
        <div>
          <label htmlFor="registrationNumber" className="auth-label">
            Registration Number *
          </label>
          <div className="input-container">
            <Hash className="input-icon-left auth-icon-primary" />
            <input
              id="registrationNumber"
              type="text"
              value={companyInfo.registrationNumber}
              onChange={e => handleInputChange('registrationNumber', e.target.value)}
              onBlur={e => handleInputBlur('registrationNumber', e.target.value)}
              placeholder="12345678"
              className={`auth-input input-with-icon-left ${
                hasFieldError(errors, 'registrationNumber') ? 'auth-input-error' : ''
              }`}
              required
            />
          </div>
          {hasFieldError(errors, 'registrationNumber') && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{getFieldError(errors, 'registrationNumber')?.message}</span>
            </motion.div>
          )}
        </div>

        {/* Tax ID */}
        <div>
          <label htmlFor="taxId" className="auth-label">
            Tax ID
          </label>
          <div className="input-container">
            <CreditCard className="input-icon-left auth-icon-primary" />
            <input
              id="taxId"
              type="text"
              value={companyInfo.taxId}
              onChange={e => handleInputChange('taxId', e.target.value)}
              onBlur={e => handleInputBlur('taxId', e.target.value)}
              placeholder="XX-XXXXXXX"
              className={`auth-input input-with-icon-left ${
                hasFieldError(errors, 'taxId') ? 'auth-input-error' : ''
              }`}
            />
          </div>
          {hasFieldError(errors, 'taxId') && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{getFieldError(errors, 'taxId')?.message}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Currency */}
      <div>
        <label htmlFor="currency" className="auth-label">
          Currency *
        </label>
        <ApiDropdown
          config={currencyDropdownConfig}
          value={companyInfo.currency ?? ''}
          onSelect={value => {
            handleSelectChange('currency', value as Currency)
            // Clear any existing currency error when selection is made
            if (hasFieldError(errors, 'currency')) {
              onErrorsChange(errors.filter(error => error.field !== 'currency'))
            }
          }}
          onClear={() => handleSelectChange('currency', '')}
          error={hasFieldError(errors, 'currency')}
          allowClear
        />
        {hasFieldError(errors, 'currency') && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{getFieldError(errors, 'currency')?.message}</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

