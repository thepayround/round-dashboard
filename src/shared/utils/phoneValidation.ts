/**
 * Simplified Phone Validation - Backend as Single Source of Truth
 * 
 * This module provides only essential phone validation:
 * 1. Content check for form enablement (no validation logic)
 * 2. Backend validation (authoritative)
 */

import { phoneValidationService, type CountryPhoneInfo } from '@/shared/services/api/phoneValidation.service'

export interface PhoneValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Simple phone validator that defers to backend
 */
export class PhoneValidator {
  private cache = new Map<string, { result: PhoneValidationResult; timestamp: number }>()
  private readonly CACHE_TIMEOUT = 5 * 60 * 1000 // 5 minutes

  /**
   * Check if phone has minimum content for form enablement
   * NO VALIDATION LOGIC - just content presence
   */
  hasMinimumContent(phoneNumber: string): boolean {
    // Just check if there's meaningful content - backend handles the rest
    return phoneNumber.trim().length >= 6 // Minimum characters to enable form
  }

  /**
   * Validate phone number using backend API (single source of truth)
   */
  async validate(phoneNumber: string, country: CountryPhoneInfo): Promise<PhoneValidationResult> {
    if (!phoneNumber?.trim()) {
      return {
        isValid: false,
        error: 'Phone number is required'
      }
    }

    if (!country) {
      return {
        isValid: false,
        error: 'Country information is required'
      }
    }

    // Check cache first
    const cacheKey = `${phoneNumber}-${country.countryCode}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TIMEOUT) {
      return cached.result
    }

    try {
      const response = await phoneValidationService.validatePhoneNumber({
        phoneNumber: phoneNumber.trim(),
        countryCode: country.countryCode
      })

      const result: PhoneValidationResult = {
        isValid: response.isValid,
        error: response.error
      }

      // Cache the result
      this.cache.set(cacheKey, { result, timestamp: Date.now() })
      
      return result
    } catch (error) {
      console.error('Phone validation API error:', error)
      
      return {
        isValid: false,
        error: 'Unable to validate phone number. Please try again.'
      }
    }
  }

  /**
   * Parse international phone number using backend API
   */
  async parseInternational(phoneNumber: string): Promise<{
    isValid: boolean
    country?: CountryPhoneInfo
    localNumber?: string
    error?: string
  }> {
    if (!phoneNumber?.trim()) {
      return { isValid: false, error: 'Phone number is required' }
    }

    try {
      const response = await phoneValidationService.parseInternationalNumber({
        phoneNumber: phoneNumber.trim()
      })

      return {
        isValid: response.isValid,
        country: response.countryInfo ?? undefined,
        localNumber: response.localNumber ?? undefined,
        error: response.error
      }
    } catch (error) {
      console.error('Phone parsing error:', error)
      return {
        isValid: false,
        error: 'Unable to parse phone number. Please try again.'
      }
    }
  }

  /**
   * Get country display name for UI
   */
  getCountryDisplayName(country: CountryPhoneInfo): string {
    if (!country) return ''
    return `${country.flag} ${country.countryName} (+${country.phoneCode})`
  }

  /**
   * Clear validation cache
   */
  clearCache(): void {
    this.cache.clear()
  }
}

// Export singleton instance
export const phoneValidator = new PhoneValidator()

// Legacy exports for backward compatibility - all deprecated
export class PhoneNumberValidator {
  /** @deprecated Use phoneValidator.validate() instead */
  static async validate(phoneNumber: string, country: CountryPhoneInfo): Promise<PhoneValidationResult> {
    return phoneValidator.validate(phoneNumber, country)
  }

  /** @deprecated Use phoneValidator.parseInternational() instead */
  static async parseInternational(phoneNumber: string) {
    const result = await phoneValidator.parseInternational(phoneNumber)
    return {
      country: result.country ?? null,
      number: result.localNumber ?? phoneNumber,
      isValid: result.isValid,
      error: result.error
    }
  }

  /** @deprecated Use phoneValidator.getCountryDisplayName() instead */
  static getCountryDisplayName(country: CountryPhoneInfo): string {
    return phoneValidator.getCountryDisplayName(country)
  }

  /** @deprecated Use phoneValidator.hasMinimumContent() instead */
  static validateBasic(phoneNumber: string): PhoneValidationResult {
    return {
      isValid: phoneValidator.hasMinimumContent(phoneNumber)
    }
  }
}