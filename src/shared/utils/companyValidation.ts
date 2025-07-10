/**
 * Company validation utilities for B2B registration
 */

import type { CompanyInfo, BillingAddress, Currency, BusinessType } from '@/shared/types/business'
import type { ValidationError, ValidationResult } from './validation'

// Company name validation
export const validateCompanyName = (companyName: string): ValidationResult => {
  const errors: ValidationError[] = []

  if (!companyName.trim()) {
    errors.push({
      field: 'companyName',
      message: 'Company name is required',
      code: 'REQUIRED',
    })
  } else if (companyName.length < 2) {
    errors.push({
      field: 'companyName',
      message: 'Company name must be at least 2 characters long',
      code: 'MIN_LENGTH',
    })
  } else if (companyName.length > 100) {
    errors.push({
      field: 'companyName',
      message: 'Company name cannot exceed 100 characters',
      code: 'MAX_LENGTH',
    })
  } else if (!/^[a-zA-Z0-9\s\-&.,()]+$/.test(companyName)) {
    errors.push({
      field: 'companyName',
      message: 'Company name contains invalid characters',
      code: 'INVALID_FORMAT',
    })
  }

  return { isValid: errors.length === 0, errors }
}

// Registration number validation
export const validateRegistrationNumber = (registrationNumber: string): ValidationResult => {
  const errors: ValidationError[] = []

  if (!registrationNumber.trim()) {
    errors.push({
      field: 'registrationNumber',
      message: 'Registration number is required',
      code: 'REQUIRED',
    })
  } else if (registrationNumber.length < 3) {
    errors.push({
      field: 'registrationNumber',
      message: 'Registration number must be at least 3 characters long',
      code: 'MIN_LENGTH',
    })
  } else if (registrationNumber.length > 50) {
    errors.push({
      field: 'registrationNumber',
      message: 'Registration number cannot exceed 50 characters',
      code: 'MAX_LENGTH',
    })
  } else if (!/^[a-zA-Z0-9\-\s]+$/.test(registrationNumber)) {
    errors.push({
      field: 'registrationNumber',
      message: 'Registration number contains invalid characters',
      code: 'INVALID_FORMAT',
    })
  }

  return { isValid: errors.length === 0, errors }
}

// Tax ID validation
export const validateTaxId = (taxId: string): ValidationResult => {
  const errors: ValidationError[] = []

  // Tax ID is optional, so only validate if provided
  if (taxId.trim()) {
    if (taxId.length < 5) {
      errors.push({
        field: 'taxId',
        message: 'Tax ID must be at least 5 characters long',
        code: 'MIN_LENGTH',
      })
    } else if (taxId.length > 20) {
      errors.push({
        field: 'taxId',
        message: 'Tax ID cannot exceed 20 characters',
        code: 'MAX_LENGTH',
      })
    } else if (!/^[a-zA-Z0-9\-\s]+$/.test(taxId)) {
      errors.push({
        field: 'taxId',
        message: 'Tax ID contains invalid characters',
        code: 'INVALID_FORMAT',
      })
    }
  }

  return { isValid: errors.length === 0, errors }
}

// Website validation
export const validateWebsite = (website: string): ValidationResult => {
  const errors: ValidationError[] = []

  // Website is optional, so only validate if provided
  if (website.trim()) {
    const websiteRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/

    if (!websiteRegex.test(website)) {
      errors.push({
        field: 'website',
        message: 'Please enter a valid website URL',
        code: 'INVALID_FORMAT',
      })
    } else if (website.length > 200) {
      errors.push({
        field: 'website',
        message: 'Website URL cannot exceed 200 characters',
        code: 'MAX_LENGTH',
      })
    }
  }

  return { isValid: errors.length === 0, errors }
}

// Currency validation
export const validateCurrency = (currency: Currency): ValidationResult => {
  const errors: ValidationError[] = []
  const validCurrencies: Currency[] = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY']

  if (!currency) {
    errors.push({
      field: 'currency',
      message: 'Currency is required',
      code: 'REQUIRED',
    })
  } else if (!validCurrencies.includes(currency)) {
    errors.push({
      field: 'currency',
      message: 'Invalid currency selected',
      code: 'INVALID_VALUE',
    })
  }

  return { isValid: errors.length === 0, errors }
}

// Business type validation
export const validateBusinessType = (businessType: BusinessType): ValidationResult => {
  const errors: ValidationError[] = []
  const validBusinessTypes: BusinessType[] = [
    'corporation',
    'llc',
    'partnership',
    'sole_proprietorship',
    'nonprofit',
  ]

  if (!businessType) {
    errors.push({
      field: 'businessType',
      message: 'Business type is required',
      code: 'REQUIRED',
    })
  } else if (!validBusinessTypes.includes(businessType)) {
    errors.push({
      field: 'businessType',
      message: 'Invalid business type selected',
      code: 'INVALID_VALUE',
    })
  }

  return { isValid: errors.length === 0, errors }
}

// Company info validation
export const validateCompanyInfo = (companyInfo: CompanyInfo): ValidationResult => {
  const errors: ValidationError[] = []

  // Validate all required fields
  const companyNameValidation = validateCompanyName(companyInfo.companyName)
  const registrationNumberValidation = validateRegistrationNumber(companyInfo.registrationNumber)
  const currencyValidation = validateCurrency(companyInfo.currency)

  errors.push(...companyNameValidation.errors)
  errors.push(...registrationNumberValidation.errors)
  errors.push(...currencyValidation.errors)

  // Validate optional fields if provided
  if (companyInfo.taxId) {
    const taxIdValidation = validateTaxId(companyInfo.taxId)
    errors.push(...taxIdValidation.errors)
  }

  return { isValid: errors.length === 0, errors }
}

// Billing address validation
export const validateBillingAddress = (billingAddress: BillingAddress): ValidationResult => {
  const errors: ValidationError[] = []

  // Street address validation
  if (!billingAddress.street.trim()) {
    errors.push({
      field: 'street',
      message: 'Street address is required',
      code: 'REQUIRED',
    })
  } else if (billingAddress.street.length > 100) {
    errors.push({
      field: 'street',
      message: 'Street address cannot exceed 100 characters',
      code: 'MAX_LENGTH',
    })
  }

  // City validation
  if (!billingAddress.city.trim()) {
    errors.push({
      field: 'city',
      message: 'City is required',
      code: 'REQUIRED',
    })
  } else if (billingAddress.city.length > 50) {
    errors.push({
      field: 'city',
      message: 'City cannot exceed 50 characters',
      code: 'MAX_LENGTH',
    })
  }

  // State validation
  if (!billingAddress.state.trim()) {
    errors.push({
      field: 'state',
      message: 'State/Province is required',
      code: 'REQUIRED',
    })
  } else if (billingAddress.state.length > 50) {
    errors.push({
      field: 'state',
      message: 'State/Province cannot exceed 50 characters',
      code: 'MAX_LENGTH',
    })
  }

  // Zip code validation
  if (!billingAddress.zipCode.trim()) {
    errors.push({
      field: 'zipCode',
      message: 'ZIP/Postal code is required',
      code: 'REQUIRED',
    })
  } else if (billingAddress.zipCode.length > 20) {
    errors.push({
      field: 'zipCode',
      message: 'ZIP/Postal code cannot exceed 20 characters',
      code: 'MAX_LENGTH',
    })
  }

  // Country validation
  if (!billingAddress.country.trim()) {
    errors.push({
      field: 'country',
      message: 'Country is required',
      code: 'REQUIRED',
    })
  } else if (billingAddress.country.length > 50) {
    errors.push({
      field: 'country',
      message: 'Country cannot exceed 50 characters',
      code: 'MAX_LENGTH',
    })
  }

  return { isValid: errors.length === 0, errors }
}

// Helper function to validate company field by name
export const validateCompanyField = (fieldName: string, value: string): ValidationResult => {
  switch (fieldName) {
    case 'companyName':
      return validateCompanyName(value)
    case 'registrationNumber':
      return validateRegistrationNumber(value)
    case 'taxId':
      return validateTaxId(value)
    case 'website':
      return validateWebsite(value)
    default:
      return { isValid: true, errors: [] }
  }
}

// Helper function to validate billing address field by name
export const validateBillingAddressField = (fieldName: string, value: string): ValidationResult => {
  switch (fieldName) {
    case 'street':
      if (!value.trim()) {
        return {
          isValid: false,
          errors: [{ field: 'street', message: 'Street address is required', code: 'REQUIRED' }],
        }
      }
      break
    case 'city':
      if (!value.trim()) {
        return {
          isValid: false,
          errors: [{ field: 'city', message: 'City is required', code: 'REQUIRED' }],
        }
      }
      break
    case 'state':
      if (!value.trim()) {
        return {
          isValid: false,
          errors: [{ field: 'state', message: 'State/Province is required', code: 'REQUIRED' }],
        }
      }
      break
    case 'zipCode':
      if (!value.trim()) {
        return {
          isValid: false,
          errors: [{ field: 'zipCode', message: 'ZIP/Postal code is required', code: 'REQUIRED' }],
        }
      }
      break
    case 'country':
      if (!value.trim()) {
        return {
          isValid: false,
          errors: [{ field: 'country', message: 'Country is required', code: 'REQUIRED' }],
        }
      }
      break
  }

  return { isValid: true, errors: [] }
}
