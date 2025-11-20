import { Search, X, Loader2 } from 'lucide-react'
import React, { useId, useRef, useCallback } from 'react'

import { Input } from '@/shared/ui'
import { IconButton } from '@/shared/ui/Button'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  /** Debounced search callback (optional) - called after user stops typing */
  onSearch?: (value: string) => void
  /** Debounce delay in ms (default: 300) */
  debounceMs?: number
  placeholder?: string
  isSearching?: boolean
  className?: string
  disabled?: boolean
  /** Auto-focus input after clearing (default: true) */
  autoFocusOnClear?: boolean
  id?: string
  name?: string
}

/**
 * Focus-stable search input component
 * 
 * Uses pure controlled input pattern to prevent focus loss during re-renders.
 * Avoids React.memo, complex state management, and other patterns that can
 * interfere with focus stability.
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  onSearch,
  debounceMs = 300,
  placeholder = 'Search...',
  isSearching = false,
  className = '',
  disabled = false,
  autoFocusOnClear = true,
  id,
  name,
}) => {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const inputName = name ?? inputId
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)

    // Debounced search callback
    if (onSearch) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      debounceTimerRef.current = setTimeout(() => {
        onSearch(newValue)
      }, debounceMs)
    }
  }

  const handleClear = useCallback(() => {
    onClear?.()
    
    // Auto-focus input after clearing
    if (autoFocusOnClear && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }, [onClear, autoFocusOnClear])

  return (
    <div className={`relative ${className}`}>
      <Input
        ref={inputRef}
        id={inputId}
        name={inputName}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        leftIcon={Search}
        className="pl-10 pr-16 md:pr-20 h-9 text-xs font-light"
        autoComplete="off"
        spellCheck="false"
        data-testid="search-input"
      />
      
      {/* Search Actions */}
      <div className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
        {isSearching && (
          <div className="flex items-center justify-center w-7 h-7 md:w-6 md:h-6">
            <Loader2 className="w-4 h-4 text-secondary animate-spin" />
          </div>
        )}
        
        {value && onClear && !isSearching && (
          <IconButton
            onClick={handleClear}
            icon={X}
            variant="ghost"
            size="sm"
            type="button"
            disabled={disabled}
            aria-label="Clear search"
            className="w-9 h-9 border border-white/10 hover:border-white/20 focus:ring-2 focus:ring-secondary"
          />
        )}
      </div>
    </div>
  )
}
