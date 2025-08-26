/**
 * Streamlined Phone Validation - Backend as Single Source of Truth
 * 
 * This module provides minimal phone validation that relies entirely on backend:
 * 1. Simple content check for UI enablement
 * 2. Direct backend API calls without frontend caching (backend handles caching)
 * 3. Clean error handling without retry complexity
 */

import { phoneValidationService, type CountryPhoneInfo } from '@/shared/services/api/phoneValidation.service'

// Simple validation constants
const MIN_CONTENT_LENGTH = 6

export interface PhoneValidationResult {
  isValid: boolean
  error?: string
}

export interface PhoneParseResult {
  isValid: boolean
  country?: CountryPhoneInfo
  localNumber?: string
  error?: string
}

/**
 * Simplified phone validator - backend does the heavy lifting
 */
export class PhoneValidator {
  /**
   * Check if phone has minimum content for UI enablement
   * Fast, client-side only validation for UX
   */
  hasMinimumContent(phoneNumber: string): boolean {
    if (!phoneNumber?.trim()) return false
    
    // Remove all non-digit characters and check length
    const digits = phoneNumber.replace(/\D/g, '')
    return digits.length >= MIN_CONTENT_LENGTH
  }

  /**
   * Validate phone number using backend API (no frontend caching)
   * Backend handles caching, retry logic, and all validation business logic
   */
  async validate(phoneNumber: string, country: CountryPhoneInfo): Promise<PhoneValidationResult> {
    // Quick client-side validation for immediate feedback
    if (!phoneNumber?.trim()) {
      return { isValid: false, error: 'Phone number is required' }
    }

    if (!country?.countryCode) {
      return { isValid: false, error: 'Country information is required' }
    }

    try {
      const response = await phoneValidationService.validatePhoneNumber({
        phoneNumber: phoneNumber.trim(),
        countryCode: country.countryCode
      })

      return {
        isValid: response.isValid,
        error: response.error
      }
    } catch (error) {
      console.error('Phone validation failed:', error)
      return {
        isValid: false,
        error: 'Unable to validate phone number. Please try again.'
      }
    }
  }

  /**
   * Parse international phone number using backend API
   * Backend handles all parsing logic and caching
   */
  async parseInternational(phoneNumber: string): Promise<PhoneParseResult> {
    if (!phoneNumber?.trim()) {
      return { isValid: false, error: 'Phone number is required' }
    }

    try {
      const response = await phoneValidationService.parseInternationalNumber({
        phoneNumber: phoneNumber.trim()
      })

      return {
        isValid: response.isValid,
        country: response.countryInfo,
        localNumber: response.localNumber,
        error: response.error
      }
    } catch (error) {
      console.error('Phone parsing failed:', error)
      return {
        isValid: false,
        error: 'Unable to parse phone number. Please try again.'
      }
    }
  }

  /**
   * Get formatted country display name
   */
  getCountryDisplayName(country: CountryPhoneInfo): string {
    if (!country) return ''
    return `${country.flag} ${country.countryName} (+${country.phoneCode})`
  }
}

// Export singleton instance
export const phoneValidator = new PhoneValidator()