import { ChevronDown, Search, AlertCircle, X, Check } from 'lucide-react'
import React from 'react'
import { createPortal } from 'react-dom'

import { dropdownStyles, getOptionClasses } from '../dropdown-styles.config'

import { usePhoneInputController } from './usePhoneInputController'

import type { CountryPhoneInfo } from '@/shared/services/api/phoneValidation.service'
import { PlainButton } from '@/shared/ui/Button'
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner'
import { cn } from '@/shared/utils/cn'

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
  const {
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
  } = usePhoneInputController({
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
  })
  const dropdownPortal = isDropdownOpen ? createPortal(
    <>
      {/* Backdrop overlay */}
      <div
        className={`${dropdownStyles.backdrop.base} ${dropdownStyles.backdrop.zIndex}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            closeDropdown()
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            closeDropdown()
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
          {required && <span className="text-primary ml-1" aria-label="required">*</span>}
        </label>
      )}

      {/* Phone Input Container */}
      <div className={cn(
        "relative flex w-full rounded-lg overflow-hidden transition-all duration-300",
        // Match auth-input height exactly
        "h-10",
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
              return <LoadingSpinner size="sm" color="secondary" />
            }
            if (selectedCountry) {
              return (
                <>
                  <span
                    className={`fi fi-${selectedCountry.countryCode.toLowerCase()} fis flex-shrink-0`}
                    style={{ fontSize: '1.25rem', lineHeight: '1' }}
                    role="img"
                    aria-label={selectedCountry.countryName}
                  />
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
            onFocus={handleInputFocus}
            onBlur={handlePhoneBlur}
            placeholder={placeholderText}
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
      <span
        className={`fi fi-${country.countryCode.toLowerCase()} fis flex-shrink-0`}
        style={{ fontSize: '1.25rem' }}
        role="img"
        aria-label={country.countryName}
      />
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




