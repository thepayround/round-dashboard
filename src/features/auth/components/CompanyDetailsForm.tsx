import { motion } from 'framer-motion'
import { Building, Hash, CreditCard, Globe, Users, AlertCircle } from 'lucide-react'

import type { CompanyInfo, Currency, BusinessType, Industry } from '@/shared/types/business'
import type { ValidationError } from '@/shared/utils/validation'
import {
  INDUSTRY_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  EMPLOYEE_COUNT_OPTIONS,
  SUPPORTED_COUNTRIES,
} from '@/shared/types/business'
import { validateCompanyField, validateCompanyInfo } from '@/shared/utils/companyValidation'
import { getFieldError, hasFieldError } from '@/shared/utils/validation'

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
  }

  // Get currency options from supported countries
  const currencyOptions = Array.from(
    new Set(SUPPORTED_COUNTRIES.map(country => country.currency))
  ).map(currency => ({
    value: currency,
    label: currency,
    symbol: getCurrencySymbol(currency),
  }))

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
            Tax ID (Optional)
          </label>
          <div className="input-container">
            <CreditCard className="input-icon-left auth-icon-primary" />
            <input
              id="taxId"
              type="text"
              value={companyInfo.taxId ?? ''}
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

      {/* Currency & Business Type Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Currency */}
        <div>
          <label htmlFor="currency" className="auth-label">
            Currency *
          </label>
          <div className="input-container">
            <CreditCard className="input-icon-left auth-icon-primary" />
            <select
              id="currency"
              value={companyInfo.currency}
              onChange={e => handleSelectChange('currency', e.target.value as Currency)}
              className={`auth-input input-with-icon-left ${
                hasFieldError(errors, 'currency') ? 'auth-input-error' : ''
              }`}
              required
            >
              <option value="">Select currency</option>
              {currencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.symbol} {option.label}
                </option>
              ))}
            </select>
          </div>
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

        {/* Business Type */}
        <div>
          <label htmlFor="businessType" className="auth-label">
            Business Type *
          </label>
          <div className="input-container">
            <Building className="input-icon-left auth-icon-primary" />
            <select
              id="businessType"
              value={companyInfo.businessType}
              onChange={e => handleSelectChange('businessType', e.target.value as BusinessType)}
              className={`auth-input input-with-icon-left ${
                hasFieldError(errors, 'businessType') ? 'auth-input-error' : ''
              }`}
              required
            >
              <option value="">Select business type</option>
              {BUSINESS_TYPE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {hasFieldError(errors, 'businessType') && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{getFieldError(errors, 'businessType')?.message}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Industry & Employee Count Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Industry */}
        <div>
          <label htmlFor="industry" className="auth-label">
            Industry (Optional)
          </label>
          <div className="input-container">
            <Building className="input-icon-left auth-icon-primary" />
            <select
              id="industry"
              value={companyInfo.industry ?? ''}
              onChange={e => handleSelectChange('industry', e.target.value as Industry)}
              className="auth-input input-with-icon-left"
            >
              <option value="">Select industry</option>
              {INDUSTRY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Employee Count */}
        <div>
          <label htmlFor="employeeCount" className="auth-label">
            Company Size (Optional)
          </label>
          <div className="input-container">
            <Users className="input-icon-left auth-icon-primary" />
            <select
              id="employeeCount"
              value={companyInfo.employeeCount ?? ''}
              onChange={e => handleInputChange('employeeCount', e.target.value)}
              className="auth-input input-with-icon-left"
            >
              <option value="">Select company size</option>
              {EMPLOYEE_COUNT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Website */}
      <div>
        <label htmlFor="website" className="auth-label">
          Website (Optional)
        </label>
        <div className="input-container">
          <Globe className="input-icon-left auth-icon-primary" />
          <input
            id="website"
            type="url"
            value={companyInfo.website ?? ''}
            onChange={e => handleInputChange('website', e.target.value)}
            onBlur={e => handleInputBlur('website', e.target.value)}
            placeholder="https://www.company.com"
            className={`auth-input input-with-icon-left ${
              hasFieldError(errors, 'website') ? 'auth-input-error' : ''
            }`}
          />
        </div>
        {hasFieldError(errors, 'website') && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{getFieldError(errors, 'website')?.message}</span>
          </motion.div>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="auth-label">
          Company Description (Optional)
        </label>
        <div className="input-container">
          <textarea
            id="description"
            value={companyInfo.description ?? ''}
            onChange={e => handleInputChange('description', e.target.value)}
            placeholder="Brief description of your company..."
            rows={3}
            className="auth-input resize-none"
            maxLength={500}
          />
        </div>
        <div className="mt-1 text-right text-sm text-gray-400">
          {(companyInfo.description ?? '').length}/500
        </div>
      </div>
    </motion.div>
  )
}

// Helper function to get currency symbol
function getCurrencySymbol(currency: Currency): string {
  const symbols: Record<Currency, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
    JPY: '¥',
  }
  return symbols[currency] || currency
}
