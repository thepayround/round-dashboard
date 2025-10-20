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
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#737373]" />
      
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`
          w-full h-[42px] md:h-9 pl-10 pr-16 md:pr-20 px-3 py-1.5
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
          <button
            onClick={handleClear}
            className="
              flex items-center justify-center w-7 h-7 md:w-6 md:h-6 rounded-lg
              bg-[#1d1d20] border border-[#25262a]
              text-[#a3a3a3] hover:text-white hover:bg-[#212124]
              hover:border-[#2c2d31]
              active:bg-[#1d1d20] active:scale-95
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[#14BDEA]
            "
            type="button"
            disabled={disabled}
            title="Clear search"
          >
            <X className="w-3.5 h-3.5 md:w-3 md:h-3" />
          </button>
        )}
      </div>
    </div>
  )
}