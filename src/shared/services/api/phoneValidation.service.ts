/**
 * Phone Validation API Service - Direct Backend Communication
 * 
 * Simple API client that leverages backend caching and validation logic.
 * No frontend caching - backend handles all optimization.
 */

import { httpClient } from './base/client'

// API Response types
export interface PhoneValidationResponse {
  isValid: boolean
  error?: string
}

export interface PhoneParseResponse {
  isValid: boolean
  countryInfo?: CountryPhoneInfo
  localNumber?: string
  error?: string
}

export interface CountryPhoneInfo {
  countryCode: string
  countryName: string
  phoneCode: string
  flag: string
}

// API Request types
export interface PhoneValidationRequest {
  phoneNumber: string
  countryCode: string
}

export interface PhoneParseRequest {
  phoneNumber: string
}

/**
 * Phone validation service - direct API communication
 */
export class PhoneValidationService {
  /**
   * Validate phone number against country rules
   */
  async validatePhoneNumber(request: PhoneValidationRequest): Promise<PhoneValidationResponse> {
    const response = await httpClient.getClient().post('/phone-validation/validate', request)
    return response.data
  }

  /**
   * Parse international phone number to extract country and local number
   */
  async parseInternationalNumber(request: PhoneParseRequest): Promise<PhoneParseResponse> {
    const response = await httpClient.getClient().post('/phone-validation/parse', request)
    return response.data
  }

  /**
   * Format phone number for display using backend endpoint
   */
  async formatPhoneNumber(phoneNumber: string): Promise<string> {
    const params = new URLSearchParams({ phoneNumber })
    const response = await httpClient.getClient().get(`/phone-validation/format?${params.toString()}`)
    return response.data
  }

  /**
   * Get list of supported countries
   */
  async getSupportedCountries(): Promise<CountryPhoneInfo[]> {
    const response = await httpClient.getClient().get('/phone-validation/countries')
    return response.data
  }

  /**
   * Get list of supported countries (alias for getSupportedCountries)
   */
  async getCountries(): Promise<CountryPhoneInfo[]> {
    return this.getSupportedCountries()
  }

  /**
   * Get country information by country code
   */
  async getCountryByCode(countryCode: string): Promise<CountryPhoneInfo | null> {
    try {
      const response = await httpClient.getClient().get(`/phone-validation/countries/${countryCode}`)
      return response.data
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } }
        if (axiosError.response?.status === 404) {
          return null
        }
      }
      throw error
    }
  }

  /**
   * Check if phone number has minimum content
   */
  async hasMinimumContent(phoneNumber: string): Promise<boolean> {
    const params = new URLSearchParams({ phoneNumber })
    const response = await httpClient.getClient().get(`/phone-validation/has-minimum-content?${params.toString()}`)
    return response.data
  }
}

export const phoneValidationService = new PhoneValidationService()