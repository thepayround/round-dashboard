/**
 * Shared Form Validation Utilities
 * Centralized validation functions used across the application
 */

export interface ValidationResult {
  valid: boolean
  message?: string
}

export const validators = {
  /**
   * Validate email format
   */
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * Validate email with detailed error message
   */
  emailWithMessage: (email: string): ValidationResult => {
    if (!email) {
      return { valid: false, message: 'Email is required' }
    }
    if (!validators.email(email)) {
      return { valid: false, message: 'Please enter a valid email address' }
    }
    return { valid: true }
  },

  /**
   * Validate password strength (matches backend requirements)
   */
  password: (password: string): ValidationResult => {
    if (!password) {
      return { valid: false, message: 'Password is required' }
    }
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters' }
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: "Passwords must have at least one uppercase ('A'-'Z')" }
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: "Passwords must have at least one lowercase ('a'-'z')" }
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'Passwords must have at least one digit (0-9)' }
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return { valid: false, message: 'Passwords must have at least one special character (!@#$%^&*)' }
    }
    return { valid: true }
  },

  /**
   * Basic password validation (less strict)
   */
  passwordBasic: (password: string): ValidationResult => {
    if (!password) {
      return { valid: false, message: 'Password is required' }
    }
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters' }
    }
    return { valid: true }
  },

  /**
   * Validate required field
   */
  required: (value: string, fieldName = 'This field'): ValidationResult => {
    if (!value || value.trim().length === 0) {
      return { valid: false, message: `${fieldName} is required` }
    }
    return { valid: true }
  },

  /**
   * Simple required check (boolean)
   */
  isRequired: (value: string): boolean => value.trim().length > 0,

  /**
   * Validate phone number format
   */
  phone: (phone: string): boolean => {
    // Remove spaces and special characters for validation
    const cleanPhone = phone.replace(/[\s\-()]/g, '')
    // International format validation (E.164)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    return phoneRegex.test(cleanPhone)
  },

  /**
   * Validate phone with detailed error message
   */
  phoneWithMessage: (phone: string): ValidationResult => {
    if (!phone) {
      return { valid: false, message: 'Phone number is required' }
    }
    if (!validators.phone(phone)) {
      return { valid: false, message: 'Please enter a valid phone number' }
    }
    return { valid: true }
  },

  /**
   * Validate minimum length
   */
  minLength: (value: string, min: number, fieldName = 'This field'): ValidationResult => {
    if (value.length < min) {
      return { valid: false, message: `${fieldName} must be at least ${min} characters` }
    }
    return { valid: true }
  },

  /**
   * Validate maximum length
   */
  maxLength: (value: string, max: number, fieldName = 'This field'): ValidationResult => {
    if (value.length > max) {
      return { valid: false, message: `${fieldName} must not exceed ${max} characters` }
    }
    return { valid: true }
  },

  /**
   * Validate URL format
   */
  url: (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  /**
   * Validate number
   */
  number: (value: string): boolean => !isNaN(Number(value)) && value.trim() !== '',

  /**
   * Validate positive number
   */
  positiveNumber: (value: string): ValidationResult => {
    if (!validators.number(value)) {
      return { valid: false, message: 'Please enter a valid number' }
    }
    if (Number(value) <= 0) {
      return { valid: false, message: 'Value must be greater than 0' }
    }
    return { valid: true }
  },

  /**
   * Validate matching fields (e.g., password confirmation)
   */
  matches: (value: string, compareValue: string, fieldName = 'Value'): ValidationResult => {
    if (value !== compareValue) {
      return { valid: false, message: `${fieldName} does not match` }
    }
    return { valid: true }
  },
}
