import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, AlertCircle, X, Check } from 'lucide-react'
import { phoneValidationService, type CountryPhoneInfo } from '@/shared/services/api/phoneValidation.service'
import { phoneValidator } from '@/shared/utils/phoneValidation'
import { cn } from '@/shared/utils/cn'

interface PhoneInputProps {
  value?: string
  onChange: (phoneNumber: string) => void
  onValidationChange?: (isValid: boolean, error?: string) => void
  onBlur?: (phoneNumber: string, country: CountryPhoneInfo | null) => void // Updated to pass phone number and country
  label?: string
  placeholder?: string
  disabled?: boolean
  error?: string
  required?: boolean
  className?: string
  defaultCountry?: string // ISO country code (e.g., 'US', 'GR')
  showValidation?: boolean
  id?: string
  name?: string
  validateOnBlur?: boolean // New prop to control when to validate
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value = '',
  onChange,
  onValidationChange,
  onBlur,
  label,
  placeholder,
  disabled = false,
  error,
  required = false,
  className,
  defaultCountry = 'US',
  showValidation = true,
  validateOnBlur = true,
  id,
  name
}) => {
  const [countries, setCountries] = useState<CountryPhoneInfo[]>([])
  const [selectedCountry, setSelectedCountry] = useState<CountryPhoneInfo | null>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [validationError, setValidationError] = useState<string>()
  const [isLoading, setIsLoading] = useState(true)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const [_isValidating, setIsValidating] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [debounceTimeoutId, setDebounceTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const phoneInputRef = useRef<HTMLInputElement>(null)

  // Load countries on mount
  useEffect(() => {
    const loadCountries = async () => {
      try {
        setIsLoading(true)
        const allCountries = await phoneValidationService.getCountries()

        setCountries(allCountries)

        // Set default country
        const defaultCountryInfo = allCountries.find((c: CountryPhoneInfo) => c.countryCode === defaultCountry) ?? allCountries[0]
        if (defaultCountryInfo && !selectedCountry) {
          setSelectedCountry(defaultCountryInfo)
        }
      } catch (error) {
        console.error('Failed to load countries:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCountries()
  }, [defaultCountry, selectedCountry]) // Add missing dependencies

  // Set default country when countries are loaded
  useEffect(() => {
    if (countries.length > 0 && !selectedCountry) {
      const defaultCountryInfo = countries.find((c: CountryPhoneInfo) => c.countryCode === defaultCountry) ?? countries[0]
      if (defaultCountryInfo) {
        setSelectedCountry(defaultCountryInfo)
      }
    }
  }, [countries, defaultCountry, selectedCountry])

  // Parse initial value only once on mount when value is provided
  useEffect(() => {
    const parseInitialValue = async () => {
      if (value && countries.length > 0 && !phoneNumber) {
        try {
          const parsed = await phoneValidator.parseInternational(value)
          if (parsed.isValid && parsed.country) {
            setSelectedCountry(parsed.country)
            setPhoneNumber(parsed.localNumber ?? value)
          }
        } catch (error) {
          console.error('Failed to parse initial phone value:', error)
        }
      }
    }

    parseInitialValue()
  }, [countries, value, phoneNumber]) // Only depend on countries loading and initial value

  // Reset validation state when external error prop changes
  useEffect(() => {
    if (error !== undefined) {
      setValidationError(undefined) // Clear internal validation when external error is provided
    }
  }, [error])

  // Debounced validation function
  const debouncedValidatePhoneNumber = useCallback(async (phoneNum: string, country: CountryPhoneInfo) => {
    if (!validateOnBlur || !phoneNum || !country) {
      return { isValid: true, error: undefined }
    }

    // Clear any existing timeout
    if (debounceTimeoutId) {
      clearTimeout(debounceTimeoutId)
    }

    // Set new timeout for debounced validation
    const timeoutId = setTimeout(async () => {
      setIsValidating(true)
      try {
        const validation = await phoneValidator.validate(phoneNum, country)
        setValidationError(validation.isValid ? undefined : validation.error)
        onValidationChange?.(validation.isValid, validation.error)
      } catch (error) {
        console.error('Phone validation failed:', error)
        const errorMsg = 'Unable to validate phone number'
        setValidationError(errorMsg)
        onValidationChange?.(false, errorMsg)
      } finally {
        setIsValidating(false)
      }
    }, 500) // 500ms debounce delay

    setDebounceTimeoutId(timeoutId)
  }, [validateOnBlur, onValidationChange, debounceTimeoutId])

  // Immediate validation function (for blur events)
  const validatePhoneNumberImmediate = async (phoneNum: string, country: CountryPhoneInfo) => {
    if (!validateOnBlur || !phoneNum || !country) {
      return { isValid: true, error: undefined }
    }

    setIsValidating(true)
    try {
      const validation = await phoneValidator.validate(phoneNum, country)
      setValidationError(validation.isValid ? undefined : validation.error)
      onValidationChange?.(validation.isValid, validation.error)
      return { isValid: validation.isValid, error: validation.error }
    } catch (error) {
      console.error('Phone validation failed:', error)
      const errorMsg = 'Unable to validate phone number'
      setValidationError(errorMsg)
      onValidationChange?.(false, errorMsg)
      return { isValid: false, error: errorMsg }
    } finally {
      setIsValidating(false)
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => () => {
      if (debounceTimeoutId) {
        clearTimeout(debounceTimeoutId)
      }
    }, [debounceTimeoutId])


  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!searchTerm) return countries

    const term = searchTerm.toLowerCase()
    return countries.filter(
      country =>
        country.countryName.toLowerCase().includes(term) ||
        country.phoneCode.includes(term) ||
        country.countryCode.toLowerCase().includes(term)
    )
  }, [countries, searchTerm])

  // Calculate dropdown position (same as ApiDropdown)
  const calculatePosition = () => {
    if (!triggerRef.current) return

    const rect = triggerRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const dropdownHeight = 360 // Increased for phone input
    
    let top = rect.bottom + 8
    const {left} = rect
    const {width} = rect

    if (rect.bottom + dropdownHeight > viewportHeight) {
      top = rect.top - dropdownHeight - 8
    }

    if (top < 8) {
      top = 8
    }
    
    if (left + width > window.innerWidth) {
      const adjustedLeft = window.innerWidth - width - 8
      setDropdownPosition({ top, left: Math.max(8, adjustedLeft), width })
    } else {
      setDropdownPosition({ top, left, width })
    }
  }

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current && 
        !triggerRef.current.contains(event.target as Node) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
        setSearchTerm('')
        setHighlightedIndex(-1)
      }
    }

    const handleScroll = () => {
      if (isDropdownOpen) {
        calculatePosition()
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('resize', calculatePosition)
      window.addEventListener('scroll', handleScroll, true)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('resize', calculatePosition)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [isDropdownOpen])

  // Calculate position when opening
  useEffect(() => {
    if (isDropdownOpen) {
      calculatePosition()
    }
  }, [isDropdownOpen])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isDropdownOpen])

  const handleCountrySelect = useCallback((country: CountryPhoneInfo) => {
    setSelectedCountry(country)
    setIsDropdownOpen(false)
    setSearchTerm('')
    setHighlightedIndex(-1)
    
    // Focus the phone input after country selection
    setTimeout(() => {
      phoneInputRef.current?.focus()
    }, 100)
  }, [])

  // Handle keyboard navigation (same as ApiDropdown)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isDropdownOpen) return

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
          setIsDropdownOpen(false)
          setSearchTerm('')
          setHighlightedIndex(-1)
          break
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDropdownOpen, highlightedIndex, filteredCountries, handleCountrySelect])

  const handleToggle = () => {
    if (disabled) return
    if (!isDropdownOpen) {
      calculatePosition()
    }
    setIsDropdownOpen(!isDropdownOpen)
    if (!isDropdownOpen) {
      setSearchTerm('')
      setHighlightedIndex(-1)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setPhoneNumber(inputValue)

    // Pass raw input to parent - backend will handle all formatting and parsing
    onChange(inputValue)

    // Clear any existing validation errors when user types (same as other fields)
    setValidationError(undefined)

    // Only provide validation feedback if validation is enabled
    if (!validateOnBlur && showValidation) {
      const hasContent = phoneValidator.hasMinimumContent(inputValue)
      const validationResult = {
        isValid: hasContent,
        error: hasContent ? undefined : 'Phone number is too short'
      }
      onValidationChange?.(validationResult.isValid, validationResult.error)
      
      if (validationResult.error) {
        setValidationError(validationResult.error)
      }
    } else if (validateOnBlur && selectedCountry && inputValue.trim()) {
      // Use debounced validation for real-time feedback while typing
      debouncedValidatePhoneNumber(inputValue, selectedCountry)
    }
  }

  const handlePhoneBlur = async () => {
    setIsFocused(false)
    
    // Always call parent's onBlur callback
    if (onBlur) {
      // Pass raw phone number and country - backend will handle parsing
      onBlur(phoneNumber, selectedCountry)
    }

    // ALWAYS validate on blur if showValidation is enabled (same as other fields)
    // This ensures immediate "required" error display when field is focused then blurred
    if (showValidation && !error) {
      // Handle required validation
      if (required && !phoneNumber.trim()) {
        setValidationError('Phone number is required')
        onValidationChange?.(false, 'Phone number is required')
        return
      }
      
      // Do basic client-side validation immediately (just like other fields)
      const hasContent = phoneValidator.hasMinimumContent(phoneNumber)
      const basicValidation = {
        isValid: hasContent,
        error: hasContent ? undefined : 'Phone number is too short'
      }
      
      if (!basicValidation.isValid) {
        setValidationError(basicValidation.error)
        onValidationChange?.(false, basicValidation.error)
        return
      }

      // If basic validation passes and backend validation is enabled, validate with API immediately
      if (validateOnBlur && selectedCountry && phoneNumber.trim()) {
        // Cancel any pending debounced validation and validate immediately on blur
        if (debounceTimeoutId) {
          clearTimeout(debounceTimeoutId)
          setDebounceTimeoutId(null)
        }
        await validatePhoneNumberImmediate(phoneNumber, selectedCountry)
      } else {
        // Clear any existing errors if basic validation passes
        setValidationError(undefined)
        onValidationChange?.(true, undefined)
      }
    }
  }

  const getPlaceholder = () => {
    if (placeholder) return placeholder
    if (selectedCountry) {
      // Simple placeholder - no complex logic needed
      return `Enter ${selectedCountry.countryName} phone number`
    }
    return 'Enter phone number'
  }

  const hasError = Boolean(error ?? (showValidation && validationError))
  const displayError = error ?? (showValidation && validationError ? validationError : undefined)

  // Country dropdown portal (same styling as ApiDropdown)
  const dropdownPortal = isDropdownOpen ? createPortal(
    <AnimatePresence>
      {/* Backdrop overlay */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] bg-black/5 backdrop-blur-[1px]"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            setIsDropdownOpen(false)
            setSearchTerm('')
            setHighlightedIndex(-1)
          }
        }}
      />
      
      {/* Dropdown content */}
      <motion.div
        key="dropdown"
        ref={dropdownRef}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="fixed z-[9999] will-change-transform"
        style={{
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: `${dropdownPosition.width}px`,
          zIndex: 9999,
          minWidth: '280px',
        }}
      >
        <div className="
          bg-white/[0.04] backdrop-blur-[32px] border border-white/10 
          rounded-lg shadow-2xl overflow-hidden
          max-h-80 flex flex-col
          bg-gradient-to-br from-white/[0.08] to-white/[0.02]
          ring-1 ring-white/5
        ">
          {/* Search input */}
          <div className="p-2.5 md:p-3 lg:p-2.5 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search countries..."
                className="
                  w-full pl-9 md:pl-10 lg:pl-9 pr-8 md:pr-10 lg:pr-8 py-1.5 md:py-2 lg:py-1.5 
                  bg-white/10 border border-white/20 rounded-lg
                  text-white/95 placeholder-white/60 text-xs md:text-sm lg:text-xs
                  focus:bg-white/15 focus:border-[#14BDEA]/50 focus:outline-none
                  transition-all duration-200
                "
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 md:right-3 lg:right-2.5 top-1/2 transform -translate-y-1/2 p-0.5 md:p-1 lg:p-0.5 hover:bg-white/10 rounded-lg transition-colors duration-200"
                  type="button"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3 text-white/60 hover:text-white/90" />
                </button>
              )}
            </div>
          </div>

          {/* Countries list */}
          <div id="phone-countries-listbox" className="flex-1 overflow-y-auto" onScroll={(e) => e.stopPropagation()}>
            {filteredCountries.length === 0 ? (
              <div className="p-3 md:p-4 lg:p-3 text-center text-white/60 text-xs md:text-sm lg:text-xs">
                No countries found
              </div>
            ) : (
              <div className="p-1.5 md:p-2 lg:p-1.5 space-y-0.5 md:space-y-1 lg:space-y-0.5">
                {filteredCountries.map((country, index) => (
                  <CountryOption
                    key={country.countryCode}
                    country={country}
                    isSelected={selectedCountry?.countryCode === country.countryCode}
                    isHighlighted={index === highlightedIndex}
                    onClick={() => handleCountrySelect(country)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  ) : null

  return (
    <div className={className}>
      {/* Label */}
      {label && (
        <label htmlFor={id} className="auth-label">
          {label}
        </label>
      )}

      {/* Phone Input Container */}
      <div className={cn(
        "relative flex w-full rounded-lg transition-all duration-300 overflow-hidden",
        // Match auth-input responsive height exactly
        "h-[42px] md:h-9",
        // Use consistent auth-input styling
        "bg-white/[0.06] backdrop-blur-[24px] border",
        (() => {
          // Exactly match auth-input CSS cascade: .auth-input:focus then .auth-input-error:focus
          if ((isFocused || isDropdownOpen) && hasError) {
            // Red border + red shadow + blue outline (error focus inherits auth-input:focus-visible outline)
            return "border-[#ef4444] bg-[rgba(255,255,255,0.18)] shadow-[0_0_0_3px_rgba(239,68,68,0.25)] transform -translate-y-px outline outline-2 outline-[rgba(20,189,234,0.4)] outline-offset-2"
          }
          if (isFocused || isDropdownOpen) {
            // Normal blue focus state with outline (3-layer effect: border + shadow + outline)
            return "border-[rgba(20,189,234,0.5)] bg-[rgba(255,255,255,0.18)] shadow-[0_0_0_3px_rgba(20,189,234,0.15),0_4px_16px_rgba(20,189,234,0.2)] transform -translate-y-px outline outline-2 outline-[rgba(20,189,234,0.4)] outline-offset-2"
          }
          if (hasError) {
            // Error state without focus
            return "border-[#ef4444] bg-[rgba(239,68,68,0.12)]"
          }
          return "border-white/10"
        })(),
        disabled && "opacity-50 cursor-not-allowed"
      )}>
        {/* Country Selector */}
        <div
          ref={triggerRef}
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleToggle()
            }
          }}
          style={{ display: 'flex', alignItems: 'center' }}
          className={cn(
            'relative gap-2 h-full min-w-[120px] border-r cursor-pointer transition-all duration-150',
            // Match auth-input responsive padding exactly  
            'px-3 md:px-4',
            // Match auth-input text styling exactly
            'text-white/95 text-xs md:text-xs font-normal outline-none',
            '[text-shadow:0_1px_1px_rgba(0,0,0,0.2)]',
            // Use consistent border color from auth-input
            'border-white/10',
            // Match auth-input CSS cascade exactly
            (() => {
              if (isDropdownOpen && hasError) {
                // Red shadow + blue outline (matching container)
                return 'bg-[rgba(255,255,255,0.18)] shadow-[0_0_0_3px_rgba(239,68,68,0.25)] transform -translate-y-px outline outline-2 outline-[rgba(20,189,234,0.4)] outline-offset-2'
              }
              if (isDropdownOpen) {
                // Normal blue focus state with outline
                return 'bg-[rgba(255,255,255,0.18)] shadow-[0_0_0_3px_rgba(20,189,234,0.15),0_4px_16px_rgba(20,189,234,0.2)] transform -translate-y-px outline outline-2 outline-[rgba(20,189,234,0.4)] outline-offset-2'
              }
              if (hasError) {
                // Error state without focus
                return 'bg-[rgba(239,68,68,0.12)]'
              }
              return 'bg-transparent hover:bg-white/[0.08]'
            })(),
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          role="combobox"
          aria-expanded={isDropdownOpen}
          aria-haspopup="listbox"
          aria-controls="phone-countries-listbox"
          tabIndex={disabled ? -1 : 0}
        >
          {(() => {
            if (isLoading) {
              return <div className="w-4 h-4 border-2 border-[#14BDEA]/30 border-t-[#14BDEA] rounded-full animate-spin" />
            }
            if (selectedCountry) {
              return (
                <>
                  <span 
                    className="text-sm flex-shrink-0 flex items-center" 
                    style={{ lineHeight: '1' }}
                    role="img" 
                    aria-label={selectedCountry.countryName}
                  >
                    {selectedCountry.flag}
                  </span>
                  <span 
                    className="text-xs md:text-xs text-white/95 truncate flex items-center"
                    style={{ lineHeight: '1' }}
                  >
                    +{selectedCountry.phoneCode}
                  </span>
                </>
              )
            }
            return (
              <span 
                className="text-xs md:text-xs text-white/60 flex items-center"
                style={{ lineHeight: '1' }}
              >
                Select
              </span>
            )
          })()}
          <ChevronDown 
            className={cn(
              'w-3 h-3 text-gray-400 transition-transform duration-200 flex-shrink-0 flex items-center',
              isDropdownOpen && 'rotate-180'
            )}
            style={{ lineHeight: '1' }}
          />
        </div>

        {/* Phone Number Input */}
        <div className="flex-1 relative flex items-center h-full">
          <input
            ref={phoneInputRef}
            type="tel"
            id={id}
            name={name}
            value={phoneNumber}
            onChange={handlePhoneChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false)
              handlePhoneBlur()
            }}
            placeholder={getPlaceholder()}
            disabled={disabled}
            className={cn(
              'w-full bg-transparent focus:outline-none',
              // Match auth-input responsive padding exactly
              'pl-3 pr-3 md:pl-4 md:pr-4',
              // Match auth-input text color and size exactly
              isFocused ? 'text-white' : 'text-white/95',
              'text-xs md:text-xs font-normal', // Match auth-input font size/weight
              'transition-all duration-150', // Match auth-input transition
              '[text-shadow:0_1px_1px_rgba(0,0,0,0.2)]', // Match auth-input text shadow
              // Match auth-input placeholder styling exactly
              'placeholder:text-white/60 placeholder:font-normal',
              // Autofill/autocomplete styling fixes (same as FormInput)
              '[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_rgba(255,255,255,0.12)_inset!important]',
              '[&:-webkit-autofill]:[-webkit-text-fill-color:rgba(255,255,255,0.95)!important]',
              '[&:-webkit-autofill]:[background-color:transparent!important]',
              '[&:-webkit-autofill]:[background-image:none!important]',
              '[&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s!important]',
              // Hover state
              '[&:-webkit-autofill:hover]:[-webkit-box-shadow:0_0_0_1000px_rgba(255,255,255,0.12)_inset!important]',
              '[&:-webkit-autofill:hover]:[-webkit-text-fill-color:rgba(255,255,255,0.95)!important]',
              '[&:-webkit-autofill:hover]:[background-color:transparent!important]',
              '[&:-webkit-autofill:hover]:[background-image:none!important]',
              '[&:-webkit-autofill:hover]:[transition:background-color_5000s_ease-in-out_0s!important]',
              // Focus state
              '[&:-webkit-autofill:focus]:[-webkit-box-shadow:0_0_0_1000px_rgba(255,255,255,0.18)_inset!important]',
              '[&:-webkit-autofill:focus]:[-webkit-text-fill-color:rgba(255,255,255,1)!important]',
              '[&:-webkit-autofill:focus]:[background-color:transparent!important]',
              '[&:-webkit-autofill:focus]:[transition:background-color_5000s_ease-in-out_0s!important]',
              // Active state
              '[&:-webkit-autofill:active]:[-webkit-box-shadow:0_0_0_1000px_rgba(255,255,255,0.12)_inset!important]',
              '[&:-webkit-autofill:active]:[-webkit-text-fill-color:rgba(255,255,255,0.95)!important]',
              '[&:-webkit-autofill:active]:[background-color:transparent!important]',
              '[&:-webkit-autofill:active]:[background-image:none!important]',
              '[&:-webkit-autofill:active]:[transition:background-color_5000s_ease-in-out_0s!important]',
              // Internal autofill selected
              '[&:-internal-autofill-selected]:[background-color:rgba(255,255,255,0.12)!important]',
              '[&:-internal-autofill-selected]:[background-image:none!important]',
              '[&:-internal-autofill-selected]:[color:rgba(255,255,255,0.95)!important]',
              '[&:-internal-autofill-selected]:[-webkit-text-fill-color:rgba(255,255,255,0.95)!important]',
              '[&:-internal-autofill-selected]:[-webkit-box-shadow:0_0_0_1000px_rgba(255,255,255,0.12)_inset!important]',
              disabled && 'cursor-not-allowed opacity-50'
            )}
            autoComplete="tel"
          />
        </div>
      </div>

      {/* Error Message - Only show if showValidation is true */}
      {showValidation && hasError && displayError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{displayError}</span>
        </motion.div>
      )}

      {/* Portal-rendered dropdown */}
      {dropdownPortal}
    </div>
  )
}

// Country Option Component (matches ApiDropdown pattern)
interface CountryOptionProps {
  country: CountryPhoneInfo
  isSelected: boolean
  isHighlighted: boolean
  onClick: () => void
}

const CountryOption: React.FC<CountryOptionProps> = ({ 
  country, 
  isSelected, 
  isHighlighted, 
  onClick 
}) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.02 }}
    onClick={onClick}
    className={cn(
      'px-2.5 md:px-3 lg:px-2.5 py-2 md:py-2.5 lg:py-2 rounded-lg cursor-pointer',
      'flex items-center justify-between transition-all duration-200',
      isHighlighted 
        ? 'bg-[#14BDEA]/20 border border-[#14BDEA]/30' 
        : 'hover:bg-white/10 border border-transparent',
      isSelected 
        ? 'bg-[#D417C8]/20 border-[#D417C8]/30' 
        : ''
    )}
    role="option"
    aria-selected={isSelected}
  >
    <div className="flex items-center space-x-2.5 md:space-x-3 lg:space-x-2.5 flex-1 min-w-0">
      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#14BDEA]/20 to-[#7767DA]/20 border border-white/20 flex items-center justify-center flex-shrink-0">
        <span className="text-sm" role="img" aria-label={country.countryName}>
          {country.flag}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white/95 font-medium truncate text-xs md:text-sm lg:text-xs">
          {country.countryName}
        </div>
        <div className="text-white/60 text-xs truncate">
          +{country.phoneCode}
        </div>
      </div>
    </div>
    
    {isSelected && (
      <Check className="w-4 h-4 text-[#D417C8] flex-shrink-0" />
    )}
  </motion.div>
)