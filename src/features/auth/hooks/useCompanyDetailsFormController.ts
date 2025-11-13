import { useCallback, useEffect } from 'react'

import type { CompanyInfo } from '@/shared/types/business'
import { validateCompanyField, validateCompanyInfo } from '@/shared/utils/companyValidation'
import type { ValidationError } from '@/shared/utils/validation'
import { getFieldError, hasFieldError } from '@/shared/utils/validation'

interface UseCompanyDetailsFormControllerProps {
  companyInfo: CompanyInfo
  onCompanyInfoChange: (companyInfo: CompanyInfo) => void
  onValidationChange: (isValid: boolean) => void
  errors: ValidationError[]
  onErrorsChange: (errors: ValidationError[]) => void
}

export const useCompanyDetailsFormController = ({
  companyInfo,
  onCompanyInfoChange,
  onValidationChange,
  errors,
  onErrorsChange,
}: UseCompanyDetailsFormControllerProps) => {
  const handleInputChange = useCallback(
    (field: keyof CompanyInfo, value: string | number) => {
      const updatedCompanyInfo = { ...companyInfo, [field]: value }
      onCompanyInfoChange(updatedCompanyInfo)

      if (hasFieldError(errors, field)) {
        onErrorsChange(errors.filter(error => error.field !== field))
      }

      const validation = validateCompanyInfo(updatedCompanyInfo)
      onValidationChange(validation.isValid)
    },
    [companyInfo, errors, onCompanyInfoChange, onErrorsChange, onValidationChange]
  )

  const handleInputBlur = useCallback(
    (field: keyof CompanyInfo, value: string) => {
      const fieldValidation = validateCompanyField(field, value)
      if (!fieldValidation.isValid) {
        onErrorsChange([
          ...errors.filter(error => error.field !== field),
          ...fieldValidation.errors,
        ])
      }
    },
    [errors, onErrorsChange]
  )

  const handleSelectChange = useCallback(
    (field: keyof CompanyInfo, value: string) => {
      handleInputChange(field, value)

      const updatedCompanyInfo = { ...companyInfo, [field]: value }
      const validation = validateCompanyInfo(updatedCompanyInfo)
      onValidationChange(validation.isValid)
    },
    [companyInfo, handleInputChange, onValidationChange]
  )

  useEffect(() => {
    const validation = validateCompanyInfo(companyInfo)
    onValidationChange(validation.isValid)
  }, [companyInfo, onValidationChange])

  const hasCompanyError = useCallback(
    (field: keyof CompanyInfo) => hasFieldError(errors, field),
    [errors]
  )

  const getCompanyError = useCallback(
    (field: keyof CompanyInfo) => getFieldError(errors, field)?.message,
    [errors]
  )

  return {
    handleInputChange,
    handleInputBlur,
    handleSelectChange,
    hasCompanyError,
    getCompanyError,
  }
}

