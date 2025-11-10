/**
 * usePhoneFormatting Hook
 * 
 * Handles phone number formatting and country info fetching at the page level.
 * This prevents multiple API calls from individual components.
 */

import { useState, useEffect, useMemo } from 'react'

import { phoneValidationService } from '@/shared/services/api/phoneValidation.service'
import type { CountryInfo } from '@/shared/ui/PhoneDisplay'

interface PhoneFormattingResult {
  formattedNumber: string
  countryInfo: CountryInfo | null
  isLoading: boolean
  error: string | null
}

export const usePhoneFormatting = (phoneNumber: string | null | undefined): PhoneFormattingResult => {
  const [result, setResult] = useState<PhoneFormattingResult>({
    formattedNumber: phoneNumber ?? '',
    countryInfo: null,
    isLoading: false,
    error: null
  })

  // Memoize the trimmed phone number to prevent unnecessary re-renders
  const trimmedPhone = useMemo(() => phoneNumber?.trim() ?? '', [phoneNumber])

  useEffect(() => {
    if (!trimmedPhone) {
      setResult({
        formattedNumber: '',
        countryInfo: null,
        isLoading: false,
        error: null
      })
      return
    }

    formatPhoneNumber(trimmedPhone)
  }, [trimmedPhone])

  const formatPhoneNumber = async (phone: string) => {
    setResult(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Make both API calls in parallel for efficiency
      const [formatted, parseResult] = await Promise.all([
        phoneValidationService.formatPhoneNumber(phone),
        phoneValidationService.parseInternationalNumber({ phoneNumber: phone })
      ])

      const formattingResult: PhoneFormattingResult = {
        formattedNumber: formatted,
        countryInfo: parseResult.countryInfo ? {
          countryCode: parseResult.countryInfo.countryCode,
          countryName: parseResult.countryInfo.countryName,
          phoneCode: parseResult.countryInfo.phoneCode,
          flag: parseResult.countryInfo.flag
        } : null,
        isLoading: false,
        error: null
      }

      setResult(formattingResult)

    } catch (err) {
      console.error('Failed to format phone number:', err)
      const errorResult: PhoneFormattingResult = {
        formattedNumber: phone, // Fallback to original
        countryInfo: null,
        isLoading: false,
        error: 'Unable to format phone number'
      }
      setResult(errorResult)
    }
  }

  return result
}

