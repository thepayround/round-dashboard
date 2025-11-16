/**
 * Autocomplete Component
 *
 * An input component with dropdown suggestions as user types.
 * Supports keyboard navigation and custom rendering.
 *
 * @example
 * ```tsx
 * <Autocomplete
 *   label="Country"
 *   value={country}
 *   onChange={setCountry}
 *   suggestions={['United States', 'Canada', 'Mexico']}
 * />
 * ```
 */
import { Search, Check } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'

import { Input } from '../Input'

import { cn } from '@/shared/utils/cn'

export interface AutocompleteSuggestion {
  value: string
  label: string
  description?: string
}

export interface AutocompleteProps {
  /** Current value */
  value?: string
  /** Change handler */
  onChange?: (value: string) => void
  /** Selection handler (when user selects from suggestions) */
  onSelect?: (value: string) => void
  /** Suggestions (array of strings or objects) */
  suggestions: string[] | AutocompleteSuggestion[]
  /** Label text */
  label?: string
  /** Placeholder text */
  placeholder?: string
  /** Error message */
  error?: string
  /** Helper text */
  helperText?: string
  /** Required field */
  required?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Show search icon */
  showSearchIcon?: boolean
  /** Maximum suggestions to show */
  maxSuggestions?: number
  /** Container class name */
  containerClassName?: string
  /** Input ID */
  id?: string
}

export const Autocomplete = React.forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      value = '',
      onChange,
      onSelect,
      suggestions = [],
      label,
      placeholder = 'Start typing...',
      error,
      helperText,
      required,
      disabled,
      showSearchIcon = true,
      maxSuggestions = 5,
      containerClassName,
      id,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const containerRef = useRef<HTMLDivElement>(null)

    // Normalize suggestions to objects
    const normalizedSuggestions: AutocompleteSuggestion[] = suggestions.map((s) =>
      typeof s === 'string' ? { value: s, label: s } : s
    )

    // Filter suggestions based on input
    const filteredSuggestions = normalizedSuggestions
      .filter((s) => s.label.toLowerCase().includes(value.toLowerCase()))
      .slice(0, maxSuggestions)

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      onChange?.(newValue)
      setIsOpen(true)
      setHighlightedIndex(-1)
    }

    const handleSelect = (suggestion: AutocompleteSuggestion) => {
      onChange?.(suggestion.value)
      onSelect?.(suggestion.value)
      setIsOpen(false)
      setHighlightedIndex(-1)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || filteredSuggestions.length === 0) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setHighlightedIndex((prev) =>
            prev < filteredSuggestions.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredSuggestions.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (highlightedIndex >= 0) {
            handleSelect(filteredSuggestions[highlightedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          setIsOpen(false)
          setHighlightedIndex(-1)
          break
      }
    }

    const handleOptionKeyDown = (
      e: React.KeyboardEvent<HTMLDivElement>,
      suggestion: AutocompleteSuggestion,
      index: number
    ) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleSelect(suggestion)
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        )
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        )
      }

      if (e.key === 'Escape') {
        e.preventDefault()
        setIsOpen(false)
        setHighlightedIndex(-1)
      }

      if (e.key === 'Tab') {
        setHighlightedIndex(index)
      }
    }

    return (
      <div ref={containerRef} className={cn('relative', containerClassName)}>
        <Input
          ref={ref}
          id={id}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => value && setIsOpen(true)}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          required={required}
          disabled={disabled}
          leftIcon={showSearchIcon ? Search : undefined}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={`${id}-listbox`}
        />

        {/* Suggestions dropdown */}
        {isOpen && filteredSuggestions.length > 0 && (
          <div
            id={`${id}-listbox`}
            role="listbox"
            className="absolute z-50 w-full mt-1 bg-[#171719] border border-[#333333] rounded-lg shadow-2xl max-h-60 overflow-y-auto"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={suggestion.value}
                role="option"
                aria-selected={index === highlightedIndex}
                tabIndex={0}
                onClick={() => handleSelect(suggestion)}
                onMouseEnter={() => setHighlightedIndex(index)}
                onKeyDown={(e) => handleOptionKeyDown(e, suggestion, index)}
                onFocus={() => setHighlightedIndex(index)}
                className={cn(
                  'px-4 py-3 cursor-pointer transition-colors',
                  index === highlightedIndex
                    ? 'bg-[#14BDEA]/10 border-l-2 border-[#14BDEA]'
                    : 'hover:bg-white/5'
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white font-normal">{suggestion.label}</p>
                    {suggestion.description && (
                      <p className="text-xs text-white/60">{suggestion.description}</p>
                    )}
                  </div>
                  {value === suggestion.value && (
                    <Check className="w-4 h-4 text-[#14BDEA]" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)

Autocomplete.displayName = 'Autocomplete'

