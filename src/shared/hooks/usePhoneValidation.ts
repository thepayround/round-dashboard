/**
 * Simple phone validation hook - backend as single source of truth
 */

import { useState, useEffect } from 'react'
import { phoneValidationService, type CountryPhoneInfo } from '@/shared/services/api/phoneValidation.service'
import { phoneValidator, type PhoneValidationResult } from '@/shared/utils/phoneValidation'

export function usePhoneValidation() {
  const [countries, setCountries] = useState<CountryPhoneInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true)
        const countriesData = await phoneValidationService.getCountries()
        setCountries(countriesData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load countries')
        setCountries([])
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  const getCountryByCode = async (countryCode: string): Promise<CountryPhoneInfo | null> => {
    try {
      return await phoneValidationService.getCountryByCode(countryCode)
    } catch (err) {
      console.error('Error fetching country by code:', err)
      return null
    }
  }

  /**
   * Content check for form enablement (no validation logic)
   */
  const hasMinimumContent = (phoneNumber: string): boolean => phoneValidator.hasMinimumContent(phoneNumber)

  /**
   * Backend validation (single source of truth)
   */
  const validate = async (phoneNumber: string, country: CountryPhoneInfo): Promise<PhoneValidationResult> => phoneValidator.validate(phoneNumber, country)

  /**
   * Parse international phone number
   */
  const parseInternational = async (phoneNumber: string) => phoneValidator.parseInternational(phoneNumber)

  /**
   * Get country display name
   */
  const getCountryDisplayName = (country: CountryPhoneInfo) => phoneValidator.getCountryDisplayName(country)

  /**
   * Clear validation cache
   */
  const clearCache = () => {
    phoneValidator.clearCache()
  }

  return {
    // Data
    countries,
    loading,
    error,
    
    // Country operations
    getCountryByCode,
    getCountryDisplayName,
    
    // Validation methods (simplified)
    hasMinimumContent, // For form enablement only
    validate, // Backend validation (single source of truth)
    
    // Utility methods
    parseInternational,
    clearCache,
    
    // Legacy methods (deprecated)
    /** @deprecated Use validate instead */
    validatePhoneNumber: validate,
    /** @deprecated Use hasMinimumContent instead */
    canEnableForm: hasMinimumContent,
  }
}