/**
 * Validation utilities for form inputs
 * Provides comprehensive validation schemas and error handling
 */

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

// Email validation regex (RFC 5322 compliant, no consecutive dots)
// This is a known safe regex pattern for email validation
/* eslint-disable security/detect-unsafe-regex */
const EMAIL_REGEX =
  /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
/* eslint-enable security/detect-unsafe-regex */


// Password requirements
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/

/**
 * Validates email address
 */
export const validateEmail = (email: string): ValidationResult => {
  const errors: ValidationError[] = []

  if (!email.trim()) {
    errors.push({
      field: 'email',
      message: 'Email address is required',
      code: 'REQUIRED',
    })
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push({
      field: 'email',
      message: 'Please enter a valid email address',
      code: 'INVALID_FORMAT',
    })
  } else if (email.length > 254) {
    errors.push({
      field: 'email',
      message: 'Email address is too long',
      code: 'MAX_LENGTH',
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validates password strength
 */
export const validatePassword = (password: string): ValidationResult => {
  const errors: ValidationError[] = []

  if (!password) {
    errors.push({
      field: 'password',
      message: 'Password is required',
      code: 'REQUIRED',
    })
  } else {
    if (password.length < PASSWORD_MIN_LENGTH) {
      errors.push({
        field: 'password',
        message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`,
        code: 'MIN_LENGTH',
      })
    }

    if (!PASSWORD_REGEX.test(password)) {
      errors.push({
        field: 'password',
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        code: 'WEAK_PASSWORD',
      })
    }

    if (password.length > 128) {
      errors.push({
        field: 'password',
        message: 'Password is too long',
        code: 'MAX_LENGTH',
      })
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validates first name
 */
export const validateFirstName = (firstName: string): ValidationResult => {
  const errors: ValidationError[] = []

  if (!firstName.trim()) {
    errors.push({
      field: 'firstName',
      message: 'First name is required',
      code: 'REQUIRED',
    })
  } else if (firstName.trim().length < 2) {
    errors.push({
      field: 'firstName',
      message: 'First name must be at least 2 characters long',
      code: 'MIN_LENGTH',
    })
  } else if (firstName.trim().length > 50) {
    errors.push({
      field: 'firstName',
      message: 'First name is too long',
      code: 'MAX_LENGTH',
    })
  } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(firstName.trim())) {
    errors.push({
      field: 'firstName',
      message: 'First name can only contain letters, spaces, hyphens, and apostrophes',
      code: 'INVALID_FORMAT',
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validates last name
 */
export const validateLastName = (lastName: string): ValidationResult => {
  const errors: ValidationError[] = []

  if (!lastName.trim()) {
    errors.push({
      field: 'lastName',
      message: 'Last name is required',
      code: 'REQUIRED',
    })
  } else if (lastName.trim().length < 2) {
    errors.push({
      field: 'lastName',
      message: 'Last name must be at least 2 characters long',
      code: 'MIN_LENGTH',
    })
  } else if (lastName.trim().length > 50) {
    errors.push({
      field: 'lastName',
      message: 'Last name is too long',
      code: 'MAX_LENGTH',
    })
  } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(lastName.trim())) {
    errors.push({
      field: 'lastName',
      message: 'Last name can only contain letters, spaces, hyphens, and apostrophes',
      code: 'INVALID_FORMAT',
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Basic phone validation - only checks if field has content
 * Real validation is done by backend API
 * @deprecated Use backend validation instead of client-side validation
 */
export const validatePhone = (phone: string): ValidationResult => {
  const errors: ValidationError[] = []

  if (!phone.trim()) {
    errors.push({
      field: 'phone',
      message: 'Phone number is required',
      code: 'REQUIRED',
    })
  }
  // No other validation - backend is single source of truth

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Login form validation schema
 */
export const validateLoginForm = (formData: {
  email: string
  password: string
}): ValidationResult => {
  const errors: ValidationError[] = []

  const emailValidation = validateEmail(formData.email)
  const passwordValidation = validatePassword(formData.password)

  errors.push(...emailValidation.errors)
  errors.push(...passwordValidation.errors)

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Registration form validation schema
 */
export const validateRegistrationForm = (formData: {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
}): ValidationResult => {
  const errors: ValidationError[] = []

  const firstNameValidation = validateFirstName(formData.firstName)
  const lastNameValidation = validateLastName(formData.lastName)
  const emailValidation = validateEmail(formData.email)
  const phoneValidation = validatePhone(formData.phone)
  const passwordValidation = validatePassword(formData.password)

  errors.push(...firstNameValidation.errors)
  errors.push(...lastNameValidation.errors)
  errors.push(...emailValidation.errors)
  errors.push(...phoneValidation.errors)
  errors.push(...passwordValidation.errors)

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Get validation error for a specific field
 */
export const getFieldError = (
  errors: ValidationError[],
  fieldName: string
): ValidationError | undefined => errors.find(error => error.field === fieldName)

/**
 * Check if field has error
 */
export const hasFieldError = (errors: ValidationError[], fieldName: string): boolean =>
  errors.some(error => error.field === fieldName)

/**
 * Validate single field based on field name
 */
export const validateField = (fieldName: string, value: string): ValidationResult => {
  switch (fieldName) {
    case 'email':
      return validateEmail(value)
    case 'password':
      return validatePassword(value)
    case 'firstName':
      return validateFirstName(value)
    case 'lastName':
      return validateLastName(value)
    case 'phone':
      return validatePhone(value)
    default:
      return { isValid: true, errors: [] }
  }
}
