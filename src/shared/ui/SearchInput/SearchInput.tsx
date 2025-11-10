import { Search, X, Loader2 } from 'lucide-react'
import React from 'react'

import { IconButton } from '@/shared/ui/Button'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  placeholder?: string
  isSearching?: boolean
  className?: string
  disabled?: boolean
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
  placeholder = 'Search...',
  isSearching = false,
  className = '',
  disabled = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleClear = () => {
    onClear?.()
  }

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#737373]" />
      
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`
          w-full h-9 pl-10 pr-16 md:pr-20 px-3 py-1.5
          bg-[#171719] border border-[#333333] rounded-lg
          text-white placeholder-[#737373] text-xs font-light
          focus:outline-none focus:border-[#14bdea]
          transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        autoComplete="off"
        spellCheck="false"
        data-testid="search-input"
      />
      
      {/* Search Actions */}
      <div className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
        {isSearching && (
          <div className="flex items-center justify-center w-7 h-7 md:w-6 md:h-6">
            <Loader2 className="w-4 h-4 text-[#14BDEA] animate-spin" />
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
            className="w-9 h-9 border border-white/10 hover:border-white/20 focus:ring-2 focus:ring-[#14BDEA]"
          />
        )}
      </div>
    </div>
  )
}

