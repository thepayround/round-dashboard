/**
 * Combobox Component
 *
 * Advanced dropdown with search, clear, loading states, and API data support
 * Follows ui-ux-shadcn standards for composition, accessibility, and styling
 *
 * Features:
 * ✅ Search with debounce
 * ✅ Clear button
 * ✅ Loading states
 * ✅ Error handling
 * ✅ Keyboard navigation (Arrow keys, Enter, Escape, Home, End)
 * ✅ Full ARIA support (WCAG AA/AAA)
 * ✅ Portal rendering
 * ✅ Icon support
 * ✅ Description support
 * ✅ Disabled options
 * ✅ Custom search text
 * ✅ Height: h-9 (36px) - shadcn standard
 *
 * @example
 * <Combobox
 *   options={countries}
 *   value={selectedCountry}
 *   onChange={setCountry}
 *   label="Country"
 *   placeholder="Select country..."
 *   clearable
 *   searchable
 * />
 */

import { AlertCircle, Check, ChevronDown, LoaderCircle, Search, X } from 'lucide-react'
import * as React from 'react'
import { createPortal } from 'react-dom'

import type { ComboboxOption } from './types'
import { useComboboxController } from './useComboboxController'

import { LoadingSpinner } from '@/shared/ui/LoadingSpinner'
import { Button } from '@/shared/ui/shadcn/button'
import { Input } from '@/shared/ui/shadcn/input'
import { cn } from '@/shared/utils/cn'

export interface ComboboxProps<T = string> {
  /** List of options */
  options: ComboboxOption<T>[]
  /** Selected value */
  value?: T
  /** Change handler */
  onChange: (value: T | undefined) => void
  /** Optional search handler for async/server-side search */
  onSearch?: (searchTerm: string) => void | Promise<void>
  /** Clear handler */
  onClear?: () => void
  /** Label text */
  label?: string
  /** Placeholder text */
  placeholder?: string
  /** Error message */
  error?: string
  /** Disabled state */
  disabled?: boolean
  /** Required field indicator */
  required?: boolean
  /** Show clear button */
  clearable?: boolean
  /** Enable search */
  searchable?: boolean
  /** Loading state */
  isLoading?: boolean
  /** Search debounce in milliseconds */
  searchDebounceMs?: number
  /** Max height for dropdown */
  maxHeight?: string
  /** Additional class names */
  className?: string
  /** HTML id */
  id?: string
}

export const Combobox = React.forwardRef(<T = string,>(
  {
    options,
    value,
    onChange,
    onSearch,
    onClear,
    label,
    placeholder = 'Select option...',
    error,
    disabled = false,
    required = false,
    clearable = true,
    searchable = true,
    isLoading = false,
    searchDebounceMs = 300,
    maxHeight = '300px',
    className,
    id,
  }: ComboboxProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const controller = useComboboxController({
    options,
    value,
    searchable,
    disabled,
    onSearch,
    searchDebounceMs,
  })

  const {
    isOpen,
    searchTerm,
    highlightedIndex,
    dropdownPosition,
    isSearching,
    filteredOptions,
    selectedOption,
    triggerRef,
    dropdownRef,
    searchInputRef,
    triggerId,
    listboxId,
    toggleDropdown,
    closeDropdown,
    handleSearchChange,
    clearSearch,
    handleKeyDown,
    setHighlightedIndex,
  } = controller

  const inputId = id || triggerId
  const errorId = `${inputId}-error`
  const hasError = !!error

  // Handle option selection
  const handleSelect = React.useCallback(
    (option: ComboboxOption<T>) => {
      if (option.disabled) return
      onChange(option.value)
      closeDropdown()
    },
    [onChange, closeDropdown]
  )

  // Handle clear
  const handleClear = React.useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      onChange(undefined)
      if (onClear) onClear()
    },
    [onChange, onClear]
  )

  // Portal content - Use z-[9999] to ensure dropdowns appear above all overlays including sheets
  const portal = isOpen
    ? createPortal(
        <>
          {/* Dropdown - z-[9999] and pointer-events-auto to work inside Radix dialogs/sheets */}
          <div
            ref={dropdownRef}
            className="fixed z-[9999] pointer-events-auto rounded-md border border-input bg-card shadow-lg"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              minWidth: '200px',
            }}
          >
            {/* Search Input */}
            {searchable && (
              <div className="border-b border-border p-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && highlightedIndex >= 0) {
                        e.preventDefault()
                        const option = filteredOptions[highlightedIndex]
                        if (option) handleSelect(option)
                      } else {
                        handleKeyDown(e)
                      }
                    }}
                    placeholder="Search..."
                    className="h-8 pl-8 pr-8"
                    aria-label="Search options"
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-accent rounded p-0.5"
                      type="button"
                      aria-label="Clear search"
                    >
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Options List */}
            <div
              className={cn(
                "overflow-y-auto py-1 overscroll-contain",
                // Modern thin scrollbar (custom webkit styles)
                "[&::-webkit-scrollbar]:w-1.5",
                "[&::-webkit-scrollbar-track]:bg-transparent",
                "[&::-webkit-scrollbar-thumb]:bg-muted-foreground/20",
                "[&::-webkit-scrollbar-thumb]:rounded-full",
                "[&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/40"
              )}
              style={{ maxHeight }}
              role="listbox"
              id={listboxId}
              aria-label={label || 'Options'}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {isSearching || isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner size="sm" />
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {searchTerm ? 'No results found' : 'No options available'}
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <div
                    key={`${option.value}-${index}`}
                    className={cn(
                      'relative flex items-center gap-2 px-3 py-2 cursor-pointer text-sm',
                      'transition-colors select-none',
                      'hover:bg-accent hover:text-accent-foreground',
                      highlightedIndex === index && 'bg-accent text-accent-foreground',
                      option.value === value && 'font-medium',
                      option.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
                    )}
                    onClick={() => handleSelect(option)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleSelect(option)
                      }
                    }}
                    onMouseEnter={() => !option.disabled && setHighlightedIndex(index)}
                    role="option"
                    aria-selected={option.value === value}
                    aria-disabled={option.disabled}
                    tabIndex={option.disabled ? -1 : 0}
                  >
                    {option.icon && (
                      <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                        {option.icon}
                      </span>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="truncate">{option.label}</div>
                      {option.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {option.description}
                        </div>
                      )}
                    </div>

                    {option.value === value && (
                      <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>,
        document.body
      )
    : null

  const triggerElement = (
    <div
      ref={triggerRef}
      id={inputId}
      onClick={toggleDropdown}
      onKeyDown={handleKeyDown}
      className={cn(
        'h-9 w-full px-3 rounded-md border border-input shadow-xs',
        'bg-transparent dark:bg-input/30',
        'flex items-center justify-between gap-2',
        'cursor-pointer transition-[color,box-shadow]',
        'focus:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        isOpen && 'border-ring ring-ring/50 ring-[3px]',
        hasError && 'border-destructive',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      role="combobox"
      aria-expanded={isOpen}
      aria-controls={listboxId}
      aria-haspopup="listbox"
      aria-invalid={hasError}
      aria-describedby={hasError ? errorId : undefined}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      {/* Selected Value or Placeholder */}
      <div className="flex-1 text-sm truncate flex items-center gap-2">
        {isLoading && !isOpen ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground">Loading...</span>
          </>
        ) : selectedOption ? (
          <>
            {selectedOption.icon && <span className="flex-shrink-0">{selectedOption.icon}</span>}
            <span>{selectedOption.label}</span>
          </>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {clearable && selectedOption && !disabled && !isLoading && (
          <Button
            onClick={handleClear}
            variant="ghost"
            size="sm"
            className="h-auto w-auto p-1 hover:bg-accent"
            type="button"
            aria-label="Clear selection"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}

        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </div>
    </div>
  )

  // If no label or error, render trigger directly without wrapper
  if (!label && !hasError) {
    return (
      <>
        {triggerElement}
        {portal}
      </>
    )
  }

  // With label or error, render with wrapper
  return (
    <div ref={ref} className="w-full">
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium mb-2">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      {triggerElement}

      {/* Error Message */}
      {hasError && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
          {error}
        </p>
      )}

      {/* Portal */}
      {portal}
    </div>
  )
}) as (<T = string>(
  props: ComboboxProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement) & { displayName?: string }

Combobox.displayName = 'Combobox'

export { type ComboboxOption }
