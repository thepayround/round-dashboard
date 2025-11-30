import { AlertCircle, ChevronDown, Search, X, Check } from 'lucide-react'
import React from 'react'
import { createPortal } from 'react-dom'

import { usePhoneInputController } from './usePhoneInputController'

import type { CountryPhoneInfo } from '@/shared/services/api/phoneValidation.service'
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner'
import { inputStyles } from '@/shared/ui/shadcn/input-styles'
import { Label } from '@/shared/ui/shadcn/label'
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
        className="fixed inset-0 z-40"
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
        className="fixed z-50"
        style={{
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: `${dropdownPosition.width}px`,
          minWidth: '280px',
        }}
      >
        <div className="rounded-md border border-input bg-popover shadow-lg max-h-[300px] overflow-hidden">
          {/* Search input */}
          <div className="border-b border-input p-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search countries..."
                className={cn(
                  inputStyles,
                  'h-8 pl-8 pr-8'
                )}
                aria-label="Search options"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-accent rounded p-0.5"
                  type="button"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Countries list */}
          <div
            id="phone-countries-listbox"
            className={cn(
              "overflow-y-auto max-h-60",
              "[&::-webkit-scrollbar]:w-1.5",
              "[&::-webkit-scrollbar-track]:bg-transparent",
              "[&::-webkit-scrollbar-thumb]:bg-muted-foreground/20",
              "[&::-webkit-scrollbar-thumb]:rounded-full",
              "[&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/40"
            )}
            onScroll={(e) => e.stopPropagation()}
            role="listbox"
            aria-label="Countries"
          >
            {filteredCountries.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No countries found
              </div>
            ) : (
              <div className="py-1">
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
    <div className={cn("space-y-2", className)}>
      {/* Label */}
      {label && (
        <Label
          id={labelId}
          htmlFor={inputId}
        >
          {label}
        </Label>
      )}

      {/* Phone Input Container */}
      <div className={cn(
        "relative flex w-full rounded-md overflow-clip",
        // Height: 36px (same as shadcn Input)
        "h-9",
        // Shadcn background and border (matches inputStyles)
        "bg-transparent dark:bg-input/30 border border-input shadow-xs",
        // Transition
        "transition-[color,box-shadow]",
        // Shadcn focus pattern (applied when input or dropdown is focused)
        (isFocused || isDropdownOpen) && "border-ring ring-ring/50 ring-[3px]",
        // Error state
        hasError && "border-destructive",
        disabled && "opacity-50 cursor-not-allowed"
      )}>
        {/* Country Selector */}
        <div className="relative flex items-center h-full min-w-[120px] border-r border-input">
          <button
            type="button"
            ref={triggerRef}
            onClick={handleToggle}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleToggle()
              }
            }}
            className={cn(
              'flex items-center gap-2 h-full w-full px-3 pr-8',
              'text-sm text-foreground outline-none',
              'hover:bg-accent/50 transition-colors',
              disabled && 'cursor-not-allowed'
            )}
            role="combobox"
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
            aria-controls="phone-countries-listbox"
            tabIndex={disabled ? -1 : 0}
            disabled={disabled}
          >
            {(() => {
              if (isLoading) {
                return <LoadingSpinner size="sm" color="secondary" />
              }
              if (selectedCountry) {
                return (
                  <>
                    <span
                      className={cn(
                        `fi fi-${selectedCountry.countryCode.toLowerCase()} fis`,
                        'flex-shrink-0 overflow-hidden rounded-sm text-xl leading-none'
                      )}
                      role="img"
                      aria-label={selectedCountry.countryName}
                    />
                    <span className="truncate">
                      +{selectedCountry.phoneCode}
                    </span>
                  </>
                )
              }
              return (
                <span className="text-muted-foreground">
                  Select
                </span>
              )
            })()}
            <ChevronDown
              className={cn(
                'w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ml-auto',
                isDropdownOpen && 'rotate-180'
              )}
            />
          </button>

          {/* Clear country button */}
          {selectedCountry && !disabled && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleCountrySelect(null as any)
              }}
              className="absolute right-1 hover:bg-accent rounded p-0.5 transition-colors"
              type="button"
              aria-label="Clear country"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
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
              'w-full h-full bg-transparent px-3 pr-10',
              'text-sm text-foreground placeholder:text-muted-foreground',
              'focus:outline-none',
              disabled && 'cursor-not-allowed'
            )}
            autoComplete="tel"
          />
          {/* Clear Button */}
          {phoneNumber && !disabled && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onChange('')
              }}
              className="absolute right-3 hover:bg-accent rounded p-0.5 transition-colors"
              type="button"
              aria-label="Clear phone number"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Error Message - Matches shadcn error state pattern */}
      {showValidation && hasError && displayError && (
        <div
          id={errorId}
          className="flex items-center gap-2 text-sm text-destructive"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="h-4 w-4" />
          <span>{displayError}</span>
        </div>
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
    className={cn(
      'relative flex items-center gap-2 px-3 py-2 cursor-pointer text-sm',
      'transition-colors select-none',
      'hover:bg-accent hover:text-accent-foreground',
      isHighlighted && 'bg-accent text-accent-foreground',
      isSelected && 'font-medium'
    )}
    role="option"
    aria-selected={isSelected}
    tabIndex={0}
  >
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <span
        className={cn(
          `fi fi-${country.countryCode.toLowerCase()} fis`,
          'flex-shrink-0 overflow-hidden rounded-sm text-xl'
        )}
        role="img"
        aria-label={country.countryName}
      />
      <div className="flex-1 min-w-0">
        <div className="truncate">
          {country.countryName}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          +{country.phoneCode}
        </div>
      </div>
    </div>

    {isSelected && (
      <Check className="h-4 w-4 flex-shrink-0 text-primary" />
    )}
  </div>
)
