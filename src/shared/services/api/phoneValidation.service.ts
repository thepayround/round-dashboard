import { httpClient } from './base/client'

// Backend-driven DTOs (no frontend validation logic)
export interface PhoneValidationRequest {
  phoneNumber: string
  countryCode: string
}

export interface PhoneValidationResponse {
  isValid: boolean
  error?: string
  countryInfo?: CountryPhoneInfo
}

export interface PhoneParseRequest {
  phoneNumber: string
}

export interface PhoneParseResponse {
  isValid: boolean
  error?: string
  countryCode?: string
  localNumber?: string
  countryInfo?: CountryPhoneInfo
}


export interface CountryPhoneInfo {
  countryCode: string
  countryName: string
  phoneCode: string
  flag: string
  phoneFormat: string
  phoneMinLength: number
  phoneMaxLength: number
}

class PhoneValidationApiService {
  private countriesCache: CountryPhoneInfo[] | null = null
  private cacheExpiry: number | null = null
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

  /**
   * Validates a phone number using backend validation
   */
  async validatePhoneNumber(request: PhoneValidationRequest): Promise<PhoneValidationResponse> {
    const response = await httpClient.getClient().post('/api/PhoneValidation/validate', request)
    return response.data
  }

  /**
   * Parses and validates an international phone number
   */
  async parseInternationalNumber(request: PhoneParseRequest): Promise<PhoneParseResponse> {
    const response = await httpClient.getClient().post('/api/PhoneValidation/parse', request)
    return response.data
  }


  /**
   * Gets all countries with phone validation data (cached)
   */
  async getCountries(): Promise<CountryPhoneInfo[]> {
    // Check cache first
    if (this.countriesCache && this.cacheExpiry && Date.now() < this.cacheExpiry) {
      return this.countriesCache
    }

    try {
      const response = await httpClient.getClient().get('/api/PhoneValidation/countries')
      const countries = response.data
      
      // Cache the result
      this.countriesCache = countries
      this.cacheExpiry = Date.now() + this.CACHE_DURATION
      
      return countries
    } catch (error) {
      console.error('Failed to fetch countries for phone validation:', error)
      
      // Return cached data if available, even if expired
      if (this.countriesCache) {
        return this.countriesCache
      }
      
      throw error
    }
  }


  /**
   * Gets a country by country code
   */
  async getCountryByCode(countryCode: string): Promise<CountryPhoneInfo | null> {
    try {
      const countries = await this.getCountries()
      return countries.find(c => c.countryCode.toLowerCase() === countryCode.toLowerCase()) ?? null
    } catch (error) {
      console.error('Failed to get country by code:', error)
      return null
    }
  }

  /**
   * Gets a country by phone code
   */
  async getCountryByPhoneCode(phoneCode: string): Promise<CountryPhoneInfo | null> {
    try {
      const countries = await this.getCountries()
      return countries.find(c => c.phoneCode === phoneCode) ?? null
    } catch (error) {
      console.error('Failed to get country by phone code:', error)
      return null
    }
  }

  /**
   * Clear cache (useful for testing or manual refresh)
   */
  clearCache(): void {
    this.countriesCache = null
    this.cacheExpiry = null
  }
}

export const phoneValidationService = new PhoneValidationApiService()