import React from 'react'
import { Search, X, Loader2 } from 'lucide-react'

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
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`
          auth-input pl-10 pr-20 w-full
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        autoComplete="off"
        spellCheck="false"
        data-testid="search-input"
      />
      
      {/* Search Actions */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
        {isSearching && (
          <div className="flex items-center justify-center w-6 h-6">
            <Loader2 className="w-4 h-4 text-[#14BDEA] animate-spin" />
          </div>
        )}
        
        {value && onClear && !isSearching && (
          <button
            onClick={handleClear}
            className="
              flex items-center justify-center w-6 h-6 rounded-full
              bg-gray-600/80 hover:bg-gray-500/80 active:bg-gray-400/80
              text-gray-300 hover:text-white
              transition-all duration-200 ease-in-out
              hover:scale-105 active:scale-95
              backdrop-blur-sm
              touch-target
            "
            type="button"
            disabled={disabled}
            title="Clear search"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  )
}