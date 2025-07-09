/**
 * Tests for validation utilities
 *
 * Tests all validation functions and schemas
 */

import { describe, it, expect } from 'vitest'

import {
  validateEmail,
  validatePassword,
  validateFirstName,
  validateLastName,
  validatePhone,
  validateLoginForm,
  validateRegistrationForm,
  getFieldError,
  hasFieldError,
  validateField,
} from './validation'

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com',
      ]

      validEmails.forEach(email => {
        const result = validateEmail(email)
        expect(result.isValid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })
    })

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com',
        'user..name@example.com',
        'user name@example.com',
      ]

      invalidEmails.forEach(email => {
        const result = validateEmail(email)
        expect(result.isValid).toBe(false)
        expect(result.errors).toHaveLength(1)
        expect(result.errors[0].code).toBe('INVALID_FORMAT')
      })
    })

    it('should reject empty email', () => {
      const result = validateEmail('')
      expect(result.isValid).toBe(false)
      expect(result.errors[0].code).toBe('REQUIRED')
    })

    it('should reject email that is too long', () => {
      const longEmail = `${'a'.repeat(250)}@example.com`
      const result = validateEmail(longEmail)
      expect(result.isValid).toBe(false)
      expect(result.errors[0].code).toBe('MAX_LENGTH')
    })
  })

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const strongPasswords = ['StrongP@ss1', 'MySecure123!', 'Complex#Pass9', 'Valid$Password1']

      strongPasswords.forEach(password => {
        const result = validatePassword(password)
        expect(result.isValid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })
    })

    it('should reject weak passwords', () => {
      const weakPasswords = [
        'weak',
        'password',
        'Password',
        'Password1',
        'password1!',
        'PASSWORD1!',
      ]

      weakPasswords.forEach(password => {
        const result = validatePassword(password)
        expect(result.isValid).toBe(false)
        expect(result.errors.length).toBeGreaterThan(0)
      })
    })

    it('should reject empty password', () => {
      const result = validatePassword('')
      expect(result.isValid).toBe(false)
      expect(result.errors[0].code).toBe('REQUIRED')
    })

    it('should reject password that is too short', () => {
      const result = validatePassword('Short1!')
      expect(result.isValid).toBe(false)
      expect(result.errors[0].code).toBe('MIN_LENGTH')
    })

    it('should reject password that is too long', () => {
      const longPassword = `${'A'.repeat(130)}1!`
      const result = validatePassword(longPassword)
      expect(result.isValid).toBe(false)
      expect(result.errors.some(e => e.code === 'MAX_LENGTH')).toBe(true)
    })
  })

  describe('validateFirstName', () => {
    it('should validate correct first names', () => {
      const validNames = ['John', 'Mary-Jane', "O'Connor", 'José', 'Anna Maria']

      validNames.forEach(name => {
        const result = validateFirstName(name)
        expect(result.isValid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })
    })

    it('should reject invalid first names', () => {
      const invalidNames = ['', 'A', 'John123', 'J@hn', 'John@domain.com']

      invalidNames.forEach(name => {
        const result = validateFirstName(name)
        expect(result.isValid).toBe(false)
        expect(result.errors.length).toBeGreaterThan(0)
      })
    })

    it('should reject first name that is too long', () => {
      const longName = 'A'.repeat(60)
      const result = validateFirstName(longName)
      expect(result.isValid).toBe(false)
      expect(result.errors[0].code).toBe('MAX_LENGTH')
    })
  })

  describe('validateLastName', () => {
    it('should validate correct last names', () => {
      const validNames = ['Smith', 'Johnson-Brown', "O'Neil", 'García', 'Van Der Berg']

      validNames.forEach(name => {
        const result = validateLastName(name)
        expect(result.isValid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })
    })

    it('should reject invalid last names', () => {
      const invalidNames = ['', 'A', 'Smith123', 'Sm1th', 'Smith@domain.com']

      invalidNames.forEach(name => {
        const result = validateLastName(name)
        expect(result.isValid).toBe(false)
        expect(result.errors.length).toBeGreaterThan(0)
      })
    })
  })

  describe('validatePhone', () => {
    it('should validate correct phone numbers', () => {
      const validPhones = [
        '+1234567890',
        '(555) 123-4567',
        '555-123-4567',
        '+30 698 123 4567',
        '1234567890',
      ]

      validPhones.forEach(phone => {
        const result = validatePhone(phone)
        expect(result.isValid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })
    })

    it('should reject invalid phone numbers', () => {
      const invalidPhones = ['', '123', 'abc-def-ghij', '555-CALL-NOW']

      invalidPhones.forEach(phone => {
        const result = validatePhone(phone)
        expect(result.isValid).toBe(false)
        expect(result.errors.length).toBeGreaterThan(0)
      })
    })
  })

  describe('validateLoginForm', () => {
    it('should validate correct login form data', () => {
      const validFormData = {
        email: 'user@example.com',
        password: 'StrongP@ss1',
      }

      const result = validateLoginForm(validFormData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject invalid login form data', () => {
      const invalidFormData = {
        email: 'invalid-email',
        password: 'weak',
      }

      const result = validateLoginForm(invalidFormData)
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('validateRegistrationForm', () => {
    it('should validate correct registration form data', () => {
      const validFormData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        password: 'StrongP@ss1',
      }

      const result = validateRegistrationForm(validFormData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject invalid registration form data', () => {
      const invalidFormData = {
        firstName: '',
        lastName: 'A',
        email: 'invalid-email',
        phone: '123',
        password: 'weak',
      }

      const result = validateRegistrationForm(invalidFormData)
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('getFieldError', () => {
    it('should return error for specific field', () => {
      const errors = [
        { field: 'email', message: 'Invalid email', code: 'INVALID_FORMAT' },
        { field: 'password', message: 'Weak password', code: 'WEAK_PASSWORD' },
      ]

      const emailError = getFieldError(errors, 'email')
      expect(emailError).toBeDefined()
      expect(emailError?.field).toBe('email')

      const nonExistentError = getFieldError(errors, 'firstName')
      expect(nonExistentError).toBeUndefined()
    })
  })

  describe('hasFieldError', () => {
    it('should check if field has error', () => {
      const errors = [{ field: 'email', message: 'Invalid email', code: 'INVALID_FORMAT' }]

      expect(hasFieldError(errors, 'email')).toBe(true)
      expect(hasFieldError(errors, 'password')).toBe(false)
    })
  })

  describe('validateField', () => {
    it('should validate email field', () => {
      const result = validateField('email', 'test@example.com')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should validate password field', () => {
      const result = validateField('password', 'StrongP@ss1')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should validate firstName field', () => {
      const result = validateField('firstName', 'John')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should validate lastName field', () => {
      const result = validateField('lastName', 'Doe')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should validate phone field', () => {
      const result = validateField('phone', '+1234567890')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should return valid for unknown field', () => {
      const result = validateField('unknown', 'value')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })
})
