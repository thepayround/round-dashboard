import { useState, useCallback } from 'react'

import type { CountryPhoneInfo } from '@/shared/services/api/phoneValidation.service'
import { phoneValidationService } from '@/shared/services/api/phoneValidation.service'
import { phoneValidator } from '@/shared/utils/phoneValidation'

interface PhoneValidationResult {
  phoneData: {
    phone: string
    countryPhoneCode: string
  }
  phoneError: string
  isValidating: boolean
  handlePhoneChange: (phoneNumber: string) => void
  handlePhoneBlur: (phoneNumber: string, countryInfo: CountryPhoneInfo | null) => Promise<boolean>
  validatePhone: () => boolean
  resetPhone: () => void
  setPhoneError: (error: string) => void
}

export const usePhoneValidation = (defaultCountry: string = 'US'): PhoneValidationResult => {
  const [phoneData, setPhoneData] = useState({
    phone: '',
    countryPhoneCode: '',
  })
  const [phoneError, setPhoneError] = useState('')
  const [isValidating, setIsValidating] = useState(false)

  const handlePhoneChange = useCallback((phoneNumber: string) => {
    setPhoneData(prev => ({ ...prev, phone: phoneNumber }))
    setPhoneError('')
  }, [])

  const handlePhoneBlur = useCallback(async (
    phoneNumber: string, 
    countryInfo: CountryPhoneInfo | null
  ): Promise<boolean> => {
    // Store the country phone code for backend submission
    if (countryInfo?.phoneCode) {
      setPhoneData(prev => ({ ...prev, countryPhoneCode: countryInfo.phoneCode }))
    }

    // If field is empty and required, show required error immediately
    if (!phoneNumber?.trim()) {
      setPhoneError('Phone number is required')
      return false
    }

    // Check minimum content first
    if (!phoneValidator.hasMinimumContent(phoneNumber)) {
      setPhoneError('Please enter a valid phone number')
      return false
    }

    // Async API validation
    setIsValidating(true)
    try {
      const countryCode = countryInfo?.countryCode ?? defaultCountry

      const result = await phoneValidationService.validatePhoneNumber({
        phoneNumber: phoneNumber.trim(),
        countryCode
      })
      
      if (!result.isValid && result.error) {
        setPhoneError(result.error ?? 'Phone number is invalid')
        return false
      }
      
      setPhoneError('')
      return true
    } catch (error) {
      console.error('Phone validation failed:', error)
      // Don't show error for network issues - allow form submission
      setPhoneError('')
      return true
    } finally {
      setIsValidating(false)
    }
  }, [defaultCountry])

  const validatePhone = useCallback(() => {
    if (!phoneData.phone.trim()) {
      setPhoneError('Phone number is required')
      return false
    }
    if (!phoneValidator.hasMinimumContent(phoneData.phone)) {
      setPhoneError('Please enter a valid phone number')
      return false
    }
    return !phoneError
  }, [phoneData.phone, phoneError])

  const resetPhone = useCallback(() => {
    setPhoneData({ phone: '', countryPhoneCode: '' })
    setPhoneError('')
  }, [])

  return {
    phoneData,
    phoneError,
    isValidating,
    handlePhoneChange,
    handlePhoneBlur,
    validatePhone,
    resetPhone,
    setPhoneError,
  }
}
