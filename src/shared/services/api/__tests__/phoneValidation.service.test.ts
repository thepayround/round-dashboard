import { phoneValidationService } from '@/shared/services/api/phoneValidation.service'
import { httpClient } from '@/shared/services/api/base/client'

// Mock the HTTP client
jest.mock('@/shared/services/api/base/client', () => ({
  httpClient: {
    getClient: jest.fn(() => ({
      post: jest.fn(),
      get: jest.fn(),
    }))
  }
}))

const mockHttpClient = httpClient.getClient() as jest.Mocked<ReturnType<typeof httpClient.getClient>>

describe('PhoneValidationService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('validatePhoneNumber', () => {
    it('should call API with correct parameters', async () => {
      const mockResponse = { data: { isValid: true } }
      mockHttpClient.post.mockResolvedValue(mockResponse)

      const request = { phoneNumber: '1234567890', countryCode: 'US' }
      const result = await phoneValidationService.validatePhoneNumber(request)

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/phone-validation/validate',
        request
      )
      expect(result).toEqual({ isValid: true })
    })

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('Network error')
      mockHttpClient.post.mockRejectedValue(mockError)

      const request = { phoneNumber: '1234567890', countryCode: 'US' }
      
      await expect(phoneValidationService.validatePhoneNumber(request))
        .rejects.toThrow('Network error')
    })
  })

  describe('parseInternationalNumber', () => {
    it('should call API with correct parameters', async () => {
      const mockResponse = { 
        data: { 
          isValid: true, 
          localNumber: '5551234567',
          countryInfo: {
            countryCode: 'US',
            countryName: 'United States',
            phoneCode: '1',
            flag: '🇺🇸'
          }
        } 
      }
      mockHttpClient.post.mockResolvedValue(mockResponse)

      const request = { phoneNumber: '+15551234567' }
      const result = await phoneValidationService.parseInternationalNumber(request)

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/phone-validation/parse',
        request
      )
      expect(result).toEqual({ 
        isValid: true, 
        localNumber: '5551234567',
        countryInfo: {
          countryCode: 'US',
          countryName: 'United States',
          phoneCode: '1',
          flag: '🇺🇸'
        }
      })
    })
  })

  describe('formatPhoneNumber', () => {
    it('should call API with correct parameters', async () => {
      const mockResponse = { data: '+1 (555) 123-4567' }
      mockHttpClient.get.mockResolvedValue(mockResponse)

      const result = await phoneValidationService.formatPhoneNumber('+15551234567')

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/phone-validation/format?phoneNumber=%2B15551234567'
      )
      expect(result).toBe('+1 (555) 123-4567')
    })
  })

  describe('getSupportedCountries', () => {
    const mockCountries = [
      {
        countryCode: 'US',
        countryName: 'United States',
        phoneCode: '1',
        flag: '🇺🇸'
      },
      {
        countryCode: 'GB',
        countryName: 'United Kingdom',
        phoneCode: '44',
        flag: '��'
      }
    ]

    it('should fetch countries from API', async () => {
      const mockResponse = { data: mockCountries }
      mockHttpClient.get.mockResolvedValue(mockResponse)

      const result = await phoneValidationService.getSupportedCountries()

      expect(mockHttpClient.get).toHaveBeenCalledWith('/phone-validation/countries')
      expect(result).toEqual(mockCountries)
    })
  })

  describe('getCountryByCode', () => {
    it('should return country for valid code', async () => {
      const mockCountry = {
        countryCode: 'US',
        countryName: 'United States',
        phoneCode: '1',
        flag: '🇺🇸'
      }
      const mockResponse = { data: mockCountry }
      mockHttpClient.get.mockResolvedValue(mockResponse)

      const result = await phoneValidationService.getCountryByCode('US')

      expect(mockHttpClient.get).toHaveBeenCalledWith('/phone-validation/countries/US')
      expect(result).toEqual(mockCountry)
    })

    it('should return null for 404 error', async () => {
      const error = { response: { status: 404 } }
      mockHttpClient.get.mockRejectedValue(error)

      const result = await phoneValidationService.getCountryByCode('XX')

      expect(result).toBeNull()
    })
  })

  describe('hasMinimumContent', () => {
    it('should call API for valid input', async () => {
      const mockResponse = { data: true }
      mockHttpClient.get.mockResolvedValue(mockResponse)

      const result = await phoneValidationService.hasMinimumContent('1234567')

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/phone-validation/has-minimum-content?phoneNumber=1234567'
      )
      expect(result).toBe(true)
    })

    it('should handle API errors', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('API error'))

      await expect(phoneValidationService.hasMinimumContent('1234567'))
        .rejects.toThrow('API error')
    })
  })
})
