import { useState, useCallback } from 'react'

export interface ValidationResult {
  valid: boolean
  message?: string
}

type Validator = (value: string) => ValidationResult
type Validators<T> = {
  [K in keyof T]?: Validator
}

interface UseFormOptions {
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

export const useForm = <T extends Record<string, string>>(
  initialValues: T,
  validators: Validators<T>,
  options: UseFormOptions = {}
) => {
  const { validateOnChange = false, validateOnBlur = true } = options

  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const validateField = useCallback((field: keyof T, value: string): boolean => {
    const validator = validators[field]
    if (!validator) return true

    const result = validator(value)
    setErrors(prev => ({
      ...prev,
      [field]: result.valid ? '' : result.message ?? ''
    }))
    return result.valid
  }, [validators])

  const handleChange = useCallback((field: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target
    setValues(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    setErrors(prev => ({ ...prev, [field]: '' }))
    
    // Re-validate if field was touched and validateOnChange is enabled
    if (validateOnChange && touched[field]) {
      validateField(field, value)
    }
  }, [touched, validateField, validateOnChange])

  const handleBlur = useCallback((field: keyof T) => () => {
    setTouched(prev => ({ ...prev, [field]: true }))
    
    // Validate on blur if enabled
    if (validateOnBlur) {
      validateField(field, values[field])
    }
  }, [values, validateField, validateOnBlur])

  const validateAll = useCallback((): boolean => {
    let isValid = true
    const newErrors: Partial<Record<keyof T, string>> = {}

    Object.keys(validators).forEach((key) => {
      const field = key as keyof T
      const validator = validators[field]
      if (validator) {
        const result = validator(values[field])
        if (!result.valid) {
          newErrors[field] = result.message ?? ''
          isValid = false
        }
      }
    })

    setErrors(newErrors)
    setTouched(
      Object.keys(validators).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    )
    return isValid
  }, [validators, values])

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  const setFieldValue = useCallback((field: keyof T, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }))
  }, [])

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }))
  }, [])

  const clearFieldError = useCallback((field: keyof T) => {
    setErrors(prev => ({ ...prev, [field]: '' }))
  }, [])

  const isFieldValid = useCallback((field: keyof T): boolean => !errors[field] && values[field] !== undefined && values[field] !== '', [errors, values])

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateField,
    validateAll,
    resetForm,
    setFieldValue,
    setFieldError,
    clearFieldError,
    isFieldValid,
  }
}
