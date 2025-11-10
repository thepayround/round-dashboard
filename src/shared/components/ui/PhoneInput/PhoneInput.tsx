import { ChevronDown, Search, AlertCircle, X, Check } from 'lucide-react'
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'

import { dropdownStyles, getOptionClasses } from '../dropdown-styles.config'

import { PlainButton } from '@/shared/components/Button'
// Import shared dropdown styles to ensure visual consistency with ApiDropdown/UiDropdown
// When dropdown styles change in dropdown-styles.config.ts, they automatically apply here
import { phoneValidationService, type CountryPhoneInfo } from '@/shared/services/api/phoneValidation.service'
import { cn } from '@/shared/utils/cn'
import { phoneValidator } from '@/shared/utils/phoneValidation'

interface PhoneInputProps {
  /** Current phone number value */
  value?: string
  /** Callback when phone number changes */
  onChange: (phoneNumber: string) => void
  /** Callback when validation state changes */
  onValidationChange?: (isValid: boolean, error?: string) => void
  /** Callback when input loses focus - receives raw phone number and selected country */
  onBlur?: (phoneNumber: string, country: CountryPhoneInfo | null) => void
  /** Label text for the input */
  label?: string
  /** Placeholder text */
  placeholder?: string
  /** Disabled state */
  disabled?: boolean
  /** External error message (takes precedence over internal validation) */
  error?: string
  /** Required field indicator */
  required?: boolean
  /** Container class name */
  className?: string
  /** Default country code (e.g., 'US', 'GR') */
  defaultCountry?: string
  /** Show validation errors */
  showValidation?: boolean
  /** HTML id attribute */
  id?: string
  /** HTML name attribute */
  name?: string
  /** Enable backend validation on blur (requires API call) */
  validateOnBlur?: boolean
}

/**
 * PhoneInput Component
 * 
 * An international phone number input with country selection dropdown.
 * Features country search, smart validation, and full accessibility support.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <PhoneInput
 *   label="Phone Number"
 *   value={phone}
 *   onChange={setPhone}
 *   defaultCountry="US"
 * />
 * 
 * // With validation
 * <PhoneInput
 *   label="Contact Number"
 *   value={phone}
 *   onChange={setPhone}
 *   onValidationChange={(isValid, error) => {
 *     console.log('Valid:', isValid, 'Error:', error)
 *   }}
 *   validateOnBlur={true}
 *   required
 *   error={backendError}
 * />
 * 
 * // Without auto-validation (manual backend validation)
 * <PhoneInput
 *   value={phone}
 *   onChange={setPhone}
 *   onBlur={(number, country) => {
 *     // Validate on backend
 *   }}
 *   validateOnBlur={false}
 *   showValidation={false}
 *   error={serverError}
 * />
 * ```
 * 
 * @accessibility
 * - Full ARIA support (combobox pattern, aria-required, aria-invalid)
 * - Keyboard navigation (Arrow keys, Enter, Escape, Tab)
 * - Screen reader friendly with proper labels and descriptions
 * - Focus visible indicators for keyboard users
 * - Error announcements with role="alert" and aria-live
 * - Country flags with descriptive aria-labels
 */
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

  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const phoneInputRef = useRef<HTMLInputElement>(null)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Generate unique IDs for ARIA relationships - must be called unconditionally
  const generatedLabelId = React.useId()
  const generatedErrorId = React.useId()
  const generatedInputId = React.useId()
  
  const labelId = `phone-label-${generatedLabelId}`
  const errorId = `phone-error-${generatedErrorId}`
  const inputId = id || `phone-input-${generatedInputId}`

  // Load countries on mount and set default country
  useEffect(() => {
    const loadCountries = async () => {
      try {
        setIsLoading(true)
        const allCountries = await phoneValidationService.getCountries()

        setCountries(allCountries)

        // Set default country only if not already set
        if (!selectedCountry) {
          const defaultCountryInfo = allCountries.find((c: CountryPhoneInfo) => c.countryCode === defaultCountry) ?? allCountries[0]
          if (defaultCountryInfo) {
            setSelectedCountry(defaultCountryInfo)
          }
        }
      } catch (error) {
        console.error('Failed to load countries:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCountries()
  }, [defaultCountry, selectedCountry]) // Add selectedCountry to dependencies

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
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
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

    debounceTimeoutRef.current = timeoutId
  }, [validateOnBlur, onValidationChange])

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
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }, [])


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
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current)
          debounceTimeoutRef.current = null
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
    <>
      {/* Backdrop overlay */}
      <div
        className={`${dropdownStyles.backdrop.base} ${dropdownStyles.backdrop.zIndex}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsDropdownOpen(false)
            setSearchTerm('')
            setHighlightedIndex(-1)
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setIsDropdownOpen(false)
            setSearchTerm('')
            setHighlightedIndex(-1)
          }
        }}
        role="button"
        tabIndex={-1}
        aria-label="Close dropdown"
      />
      
      {/* Dropdown content */}
      <div
        ref={dropdownRef}
        className={dropdownStyles.container.positioning}
        style={{
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: `${dropdownPosition.width}px`,
          zIndex: 9999,
          minWidth: '280px',
        }}
      >
        <div className={`${dropdownStyles.container.base} ${dropdownStyles.container.maxHeight}`}>
          {/* Search input */}
          <div className={dropdownStyles.search.container}>
            <div className="relative">
              <Search className={dropdownStyles.search.icon} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search countries..."
                className={dropdownStyles.search.input}
              />
              {searchTerm && (
                <PlainButton
                  onClick={() => setSearchTerm('')}
                  className={dropdownStyles.search.clearButton}
                  type="button"
                  aria-label="Clear search"
                  unstyled
                >
                  <X className={dropdownStyles.search.clearIcon} />
                </PlainButton>
              )}
            </div>
          </div>

          {/* Countries list */}
          <div id="phone-countries-listbox" className={dropdownStyles.list.container} onScroll={(e) => e.stopPropagation()}>
            {filteredCountries.length === 0 ? (
              <div className={dropdownStyles.list.empty}>
                No countries found
              </div>
            ) : (
              <div className={`${dropdownStyles.list.padding} ${dropdownStyles.list.spacing}`}>
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
      </div>
    </>,
    document.body
  ) : null

  return (
    <div className={className}>
      {/* Label */}
      {label && (
        <label 
          id={labelId}
          htmlFor={inputId} 
          className="auth-label"
        >
          {label}
          {required && <span className="text-[#D417C8] ml-1" aria-label="required">*</span>}
        </label>
      )}

      {/* Phone Input Container */}
      <div className={cn(
        "relative flex w-full rounded-lg overflow-hidden transition-all duration-300",
        // Match auth-input height exactly
        "h-9",
        // Match auth-input background and border exactly
        "bg-[#171719] border transition-[border-color] duration-200",
        (() => {
          // Match auth-input CSS: simple border color change on focus
          if ((isFocused || isDropdownOpen) && hasError) {
            // Red border on error focus
            return "border-[#ef4444]"
          }
          if (isFocused || isDropdownOpen) {
            // Blue border on focus (matches auth-input:focus)
            return "border-[#14bdea]"
          }
          if (hasError) {
            // Error state without focus
            return "border-[#ef4444] bg-[rgba(239,68,68,0.12)]"
          }
          return "border-[#333333]"
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
            'relative gap-2 h-full min-w-[120px] border-r cursor-pointer',
            // Match auth-input consistent padding (12px)
            'px-3',
            // Match auth-input text styling exactly
            'text-white/95 text-xs font-light outline-none',
            // Match auth-input border color
            'border-[#333333]',
            // Simple background states without animations
            (() => {
              if (hasError) {
                // Error state
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
              return <div className="w-4 h-4 border border-[#14BDEA]/30 border-t-[#14BDEA] rounded-full animate-spin" />
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
            id={inputId}
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
            required={required}
            aria-labelledby={label ? labelId : undefined}
            aria-label={!label ? 'Phone number' : undefined}
            aria-required={required}
            aria-invalid={hasError}
            aria-describedby={hasError && displayError ? errorId : undefined}
            className={cn(
              'w-full bg-transparent focus:outline-none',
              // Match auth-input consistent padding (12px)
              'px-3',
              // Match auth-input text color and size exactly
              isFocused ? 'text-white' : 'text-white/95',
              'text-xs font-light', // Match auth-input font size/weight
              // Match auth-input placeholder styling exactly
              'placeholder:text-white/60 placeholder:font-light',
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
        <p
          id={errorId}
          className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="w-4 h-4" aria-hidden="true" />
          <span>{displayError}</span>
        </p>
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
  <div
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onClick()
      }
    }}
    className={getOptionClasses(isHighlighted, isSelected)}
    role="option"
    aria-selected={isSelected}
    tabIndex={0}
  >
    <div className={`flex items-center ${dropdownStyles.option.spacing} flex-1 min-w-0`}>
      <span className="text-sm flex-shrink-0" role="img" aria-label={country.countryName}>
        {country.flag}
      </span>
      <div className="flex-1 min-w-0">
        <div className={`${dropdownStyles.option.label} truncate`}>
          {country.countryName}
        </div>
        <div className={`${dropdownStyles.option.description} truncate`}>
          +{country.phoneCode}
        </div>
      </div>
    </div>
    
    {isSelected && (
      <Check className={dropdownStyles.option.checkIcon} />
    )}
  </div>
)
