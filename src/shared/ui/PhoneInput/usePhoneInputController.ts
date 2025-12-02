import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  phoneValidationService,
  type CountryPhoneInfo,
} from '@/shared/services/api/phoneValidation.service'
import { phoneValidator } from '@/shared/utils/phoneValidation'

interface UsePhoneInputControllerOptions {
  value: string
  defaultCountry: string
  validateOnBlur: boolean
  showValidation: boolean
  placeholder?: string
  disabled: boolean
  error?: string
  id?: string
  onChange: (value: string) => void
  onValidationChange?: (isValid: boolean, error?: string) => void
  onBlur?: (value: string, country: CountryPhoneInfo | null) => void
}

export const usePhoneInputController = ({
  value,
  defaultCountry,
  validateOnBlur,
  showValidation,
  placeholder,
  disabled,
  error,
  id,
  onChange,
  onValidationChange,
  onBlur,
}: UsePhoneInputControllerOptions) => {
  const [countries, setCountries] = useState<CountryPhoneInfo[]>([])
  const [selectedCountry, setSelectedCountry] = useState<CountryPhoneInfo | null>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [validationError, setValidationError] = useState<string>()
  const [isLoading, setIsLoading] = useState(true)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const [isFocused, setIsFocused] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const phoneInputRef = useRef<HTMLInputElement>(null)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const generatedLabelId = useId()
  const generatedErrorId = useId()
  const generatedInputId = useId()

  const labelId = `phone-label-${generatedLabelId}`
  const errorId = `phone-error-${generatedErrorId}`
  const inputId = id || `phone-input-${generatedInputId}`

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setIsLoading(true)
        const allCountries = await phoneValidationService.getCountries()
        setCountries(allCountries)

        if (!selectedCountry) {
          const defaultCountryInfo =
            allCountries.find(country => country.countryCode === defaultCountry) ?? allCountries[0]
          if (defaultCountryInfo) {
            setSelectedCountry(defaultCountryInfo)
          }
        }
      } catch (err) {
        console.error('Failed to load countries:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadCountries()
  }, [defaultCountry, selectedCountry])

  useEffect(() => {
    const parseInitialValue = async () => {
      if (value && countries.length > 0 && !phoneNumber) {
        try {
          const parsed = await phoneValidator.parseInternational(value)
          if (parsed.isValid && parsed.country) {
            setSelectedCountry(parsed.country)
            setPhoneNumber(parsed.localNumber ?? value)
          }
        } catch (err) {
          console.error('Failed to parse initial phone value:', err)
        }
      }
    }

    parseInitialValue()
  }, [countries, phoneNumber, value])

  useEffect(() => {
    if (error !== undefined) {
      setValidationError(undefined)
    }
  }, [error])

  const debouncedValidatePhoneNumber = useCallback(
    async (phoneNum: string, country: CountryPhoneInfo) => {
      if (!validateOnBlur || !phoneNum || !country) {
        return { isValid: true, error: undefined }
      }

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }

      const timeoutId = setTimeout(async () => {
        try {
          const validation = await phoneValidator.validate(phoneNum, country)
          setValidationError(validation.isValid ? undefined : validation.error)
          onValidationChange?.(validation.isValid, validation.error)
        } catch (err) {
          console.error('Phone validation failed:', err)
          const errorMsg = 'Unable to validate phone number'
          setValidationError(errorMsg)
          onValidationChange?.(false, errorMsg)
        }
      }, 400)

      debounceTimeoutRef.current = timeoutId

      return () => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current)
        }
      }
    },
    [onValidationChange, validateOnBlur]
  )

  const validatePhoneNumberImmediate = useCallback(
    async (phoneNum: string, country: CountryPhoneInfo) => {
      if (!validateOnBlur || !country || !phoneNum) {
        return { isValid: true, error: undefined }
      }

      try {
        const validation = await phoneValidator.validate(phoneNum, country)
        setValidationError(validation.isValid ? undefined : validation.error)
        onValidationChange?.(validation.isValid, validation.error)
        return validation
      } catch (err) {
        console.error('Phone validation failed:', err)
        const errorMsg = 'Unable to validate phone number'
        setValidationError(errorMsg)
        onValidationChange?.(false, errorMsg)
        return { isValid: false, error: errorMsg }
      }
    },
    [onValidationChange, validateOnBlur]
  )

  const filteredCountries = useMemo(() => {
    const term = searchTerm.toLowerCase()
    if (!term) {
      return countries
    }

    return countries.filter(
      country =>
        country.countryName.toLowerCase().includes(term) ||
        country.countryCode.toLowerCase().includes(term) ||
        country.phoneCode.includes(term)
    )
  }, [countries, searchTerm])

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false)
    setSearchTerm('')
    setHighlightedIndex(-1)
  }, [])

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return

    const rect = triggerRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const dropdownHeight = 360

    const enoughSpaceBelow = rect.bottom + dropdownHeight <= viewportHeight
    const top = enoughSpaceBelow ? rect.bottom + 4 : rect.top - dropdownHeight - 4
    const width = rect.width
    const left = rect.left

    const adjustedLeft = Math.max(8, Math.min(left, window.innerWidth - width - 8))

    setDropdownPosition({
      top,
      left: adjustedLeft,
      width,
    })
  }, [])

  useEffect(() => {
    if (!isDropdownOpen) {
      return
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        closeDropdown()
      }
    }

    const handleScroll = () => {
      calculatePosition()
    }

    window.addEventListener('resize', calculatePosition)
    window.addEventListener('scroll', handleScroll, true)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('resize', calculatePosition)
      window.removeEventListener('scroll', handleScroll, true)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [calculatePosition, closeDropdown, isDropdownOpen])

  const handleCountrySelect = useCallback(
    (country: CountryPhoneInfo | null) => {
      setSelectedCountry(country)
      setIsDropdownOpen(false)
      setSearchTerm('')
      setHighlightedIndex(-1)

      if (phoneNumber.trim()) {
        setTimeout(() => {
          phoneInputRef.current?.focus()
        }, 10)
      }
    },
    [phoneNumber]
  )

  useEffect(() => {
    if (!isDropdownOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setHighlightedIndex(prev =>
            prev < filteredCountries.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          event.preventDefault()
          setHighlightedIndex(prev =>
            prev > 0 ? prev - 1 : filteredCountries.length - 1
          )
          break
        case 'Enter':
          event.preventDefault()
          if (highlightedIndex >= 0 && filteredCountries[highlightedIndex]) {
            handleCountrySelect(filteredCountries[highlightedIndex])
          }
          break
        case 'Escape':
          closeDropdown()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [closeDropdown, filteredCountries, handleCountrySelect, highlightedIndex, isDropdownOpen])

  const handleToggle = useCallback(() => {
    if (disabled) return
    if (!isDropdownOpen) {
      calculatePosition()
      setSearchTerm('')
      setHighlightedIndex(-1)
    }
    setIsDropdownOpen(prev => !prev)
  }, [calculatePosition, disabled, isDropdownOpen])

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      setPhoneNumber(inputValue)
      onChange(inputValue)
      setValidationError(undefined)

      if (!validateOnBlur && showValidation) {
        const hasContent = phoneValidator.hasMinimumContent(inputValue)
        const validationResult = {
          isValid: hasContent,
          error: hasContent ? undefined : 'Phone number is too short',
        }
        onValidationChange?.(validationResult.isValid, validationResult.error)

        if (validationResult.error) {
          setValidationError(validationResult.error)
        }
      } else if (validateOnBlur && selectedCountry && inputValue.trim()) {
        debouncedValidatePhoneNumber(inputValue, selectedCountry)
      }
    },
    [
      debouncedValidatePhoneNumber,
      onChange,
      onValidationChange,
      selectedCountry,
      showValidation,
      validateOnBlur,
    ]
  )

  const handlePhoneBlur = useCallback(async () => {
    setIsFocused(false)

    if (onBlur) {
      onBlur(phoneNumber, selectedCountry)
    }

    if (validateOnBlur && selectedCountry) {
      const validationResult = await validatePhoneNumberImmediate(phoneNumber.trim(), selectedCountry)
      if (!validationResult.isValid) {
        setValidationError(validationResult.error)
      }
    } else if (showValidation) {
      const hasContent = phoneValidator.hasMinimumContent(phoneNumber)
      const basicValidation = {
        isValid: hasContent,
        error: hasContent ? undefined : 'Phone number is too short',
      }
      setValidationError(basicValidation.error)
      onValidationChange?.(basicValidation.isValid, basicValidation.error)
    }
  }, [
    onBlur,
    onValidationChange,
    phoneNumber,
    selectedCountry,
    showValidation,
    validateOnBlur,
    validatePhoneNumberImmediate,
  ])

  const placeholderText = useMemo(() => {
    if (placeholder) return placeholder
    if (selectedCountry) {
      return `Enter ${selectedCountry.countryName} phone number`
    }
    return 'Enter phone number'
  }, [placeholder, selectedCountry])

  const hasError = Boolean(error ?? (showValidation && validationError))
  const displayError = error ?? (showValidation && validationError ? validationError : undefined)

  const handleInputFocus = useCallback(() => setIsFocused(true), [])

  return {
    labelId,
    errorId,
    inputId,
    selectedCountry,
    phoneNumber,
    isDropdownOpen,
    searchTerm,
    setSearchTerm,
    highlightedIndex,
    dropdownPosition,
    isLoading,
    isFocused,
    filteredCountries,
    triggerRef,
    dropdownRef,
    searchInputRef,
    phoneInputRef,
    handleToggle,
    handleCountrySelect,
    handlePhoneChange,
    handlePhoneBlur,
    closeDropdown,
    placeholderText,
    hasError,
    displayError,
    handleInputFocus,
  }
}
