import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Search, X, Check } from 'lucide-react'

export interface ApiDropdownOption {
  value: string
  label: string
  searchText?: string
  icon?: React.ReactNode
  description?: string
}

export interface ApiDropdownConfig<TData = Record<string, unknown>> {
  // API Configuration
  useHook: () => {
    data: TData[]
    isLoading: boolean
    isError: boolean
    refetch: () => void | Promise<void>
  }
  
  // Data transformation
  mapToOptions: (data: TData[]) => ApiDropdownOption[]
  
  // UI Configuration
  icon: React.ReactNode
  placeholder: string
  searchPlaceholder: string
  noResultsText: string
  errorText: string
}

interface ApiDropdownProps<T = unknown> {
  config: ApiDropdownConfig<T>
  value?: string
  onSelect: (value: string) => void
  onClear?: () => void
  disabled?: boolean
  error?: boolean
  allowClear?: boolean
  className?: string
}

export const ApiDropdown = <T = unknown>({
  config,
  value,
  onSelect,
  onClear,
  disabled = false,
  error = false,
  allowClear = false,
  className = '',
}: ApiDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Use the provided hook to fetch data
  const { data, isLoading, isError, refetch } = config.useHook()

  // Transform data to options using the provided mapper
  const options = useMemo(() => {
    if (!data) return []
    return config.mapToOptions(data)
  }, [data, config])

  const selectedOption = options.find(option => option.value === value)

  // Filter options based on search term
  const filteredOptions = options.filter(option => {
    const searchText = option.searchText ?? option.label
    return searchText.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Retry on error
  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        refetch()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isError, refetch])

  // Calculate dropdown position
  const calculatePosition = () => {
    if (!triggerRef.current) return

    const rect = triggerRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const dropdownHeight = 320 // max-h-80 = 320px
    
    // Calculate position relative to viewport, not document
    let top = rect.bottom + 8 // 8px gap below trigger
    const {left} = rect
    const {width} = rect

    // If dropdown would go below viewport, position it above
    if (rect.bottom + dropdownHeight > viewportHeight) {
      top = rect.top - dropdownHeight - 8
    }

    // Ensure dropdown stays within viewport bounds
    if (top < 8) {
      top = 8 // minimum 8px from top
    }
    
    if (left + width > window.innerWidth) {
      // If dropdown would go beyond right edge, align it to the right
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
        setIsOpen(false)
        setSearchTerm('')
        setHighlightedIndex(-1)
      }
    }

    const handleScroll = () => {
      if (isOpen) {
        calculatePosition()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('resize', calculatePosition)
      window.addEventListener('scroll', handleScroll, true)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('resize', calculatePosition)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [isOpen])

  // Calculate position when opening
  useEffect(() => {
    if (isOpen) {
      calculatePosition()
    }
  }, [isOpen])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  const handleSelect = useCallback((selectedValue: string) => {
    onSelect(selectedValue)
    setIsOpen(false)
    setSearchTerm('')
    setHighlightedIndex(-1)
  }, [onSelect])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          event.preventDefault()
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          )
          break
        case 'Enter':
          event.preventDefault()
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex].value)
          }
          break
        case 'Escape':
          setIsOpen(false)
          setSearchTerm('')
          setHighlightedIndex(-1)
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, highlightedIndex, filteredOptions, handleSelect])

  const handleToggle = () => {
    if (disabled) return
    if (!isOpen) {
      calculatePosition()
    }
    setIsOpen(!isOpen)
    if (!isOpen) {
      setSearchTerm('')
      setHighlightedIndex(-1)
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClear?.()
    setIsOpen(false)
    setSearchTerm('')
    setHighlightedIndex(-1)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setHighlightedIndex(-1)
  }

  // Error state
  if (isError) {
    return (
      <div className="relative w-full h-[42px] md:h-9 pl-9 pr-3 rounded-lg border transition-all duration-300 bg-white/[0.12] border-white/20 text-white cursor-pointer flex items-center justify-between font-light text-xs outline-none opacity-50 cursor-not-allowed">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 flex items-center justify-center">
          <div className="w-4 h-4 flex items-center justify-center">
            {config.icon}
          </div>
        </div>
        <span className="text-white/60">{config.errorText}</span>
        <button 
          onClick={() => refetch()}
          className="text-[#14BDEA] hover:text-[#14BDEA]/80 text-xs font-medium"
          type="button"
        >
          Retry
        </button>
      </div>
    )
  }

  // Create portal element
  const dropdownPortal = isOpen ? createPortal(
    <div
      ref={dropdownRef}
      className="fixed z-[9999]"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
        minWidth: '280px',
      }}
    >
      <div className="bg-[#1a1d23] border border-white/20 rounded-lg shadow-2xl overflow-hidden max-h-80 flex flex-col ring-1 ring-white/10">
        {/* Search input */}
        <div className="p-2.5 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={config.searchPlaceholder}
                className="w-full pl-9 pr-8 py-1.5 bg-[#171719] border border-[#333333] rounded-lg text-white/95 placeholder-[#737373] text-xs focus:border-[#14bdea] focus:outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 p-0.5 hover:bg-white/10 rounded-lg"
                  type="button"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3 text-white/60 hover:text-white/90" />
                </button>
              )}
            </div>
            
            {/* Clear selection button */}
            {selectedOption && allowClear && (
              <button
                onClick={() => {
                  onClear?.()
                  setIsOpen(false)
                  setSearchTerm('')
                  setHighlightedIndex(-1)
                }}
                className="mt-1.5 w-full px-2.5 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white/70 hover:text-white/90 flex items-center justify-center space-x-1.5"
                type="button"
              >
                <X className="w-4 h-4" />
                <span>Clear selection</span>
              </button>
            )}
          </div>

          {/* Options list */}
          <div className="flex-1 overflow-y-auto" onScroll={(e) => e.stopPropagation()}>
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-white/60 text-xs">
                {config.noResultsText}
              </div>
            ) : (
              <div className="p-1.5 space-y-0.5">
                {filteredOptions.map((option, index) => (
                  <div
                    key={option.value || `option-${index}`}
                    role="option"
                    aria-selected={value === option.value}
                    tabIndex={0}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleSelect(option.value)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        e.stopPropagation()
                        handleSelect(option.value)
                      }
                    }}
                    className={`
                      px-2.5 py-2 rounded-lg cursor-pointer
                      flex items-center justify-between
                      ${index === highlightedIndex 
                        ? 'bg-[#14BDEA]/20 border border-[#14BDEA]/30' 
                        : 'hover:bg-white/10 border border-transparent'
                      }
                      ${option.value === value 
                        ? 'bg-[#14bdea]/20 border-[#14bdea]/30' 
                        : ''
                      }
                    `}
                  >
                    <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                      {option.icon && (
                        <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                          {option.icon}
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-white/95 font-light truncate text-xs">
                          {option.label}
                        </div>
                        {option.description && (
                          <div className="text-white/60 text-xs truncate">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {option.value === value && (
                      <Check className="w-4 h-4 text-[#14bdea] flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>,
    document.body
  ) : null

  return (
    <div className={`relative ${className}`}>
      {/* Dropdown trigger */}
      <div
        ref={triggerRef}
        onClick={disabled ? undefined : handleToggle}
        onKeyDown={disabled ? undefined : (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleToggle()
          }
        }}
        className={`
          relative w-full h-[42px] md:h-9 pl-9 pr-3 rounded-lg border transition-all duration-300
          bg-[#171719] border-[#333333] text-white flex items-center justify-between
          font-light text-xs outline-none
          [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]
          ${error ? 'border-[#ef4444]' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
          ${isOpen && !error ? 'border-[#14bdea] outline-none ring-0 shadow-[0_0_0_3px_rgba(20,189,234,0.15)] transform -translate-y-px' : ''}
          ${isOpen && error ? 'shadow-[0_0_0_3px_rgba(239,68,68,0.25)] transform -translate-y-px' : ''}
        `}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="dropdown-options"
        tabIndex={disabled ? -1 : 0}
      >
        {/* Left icon - show selected option icon if available, otherwise config icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 flex items-center justify-center">
          {selectedOption?.icon ?? (
            <div className="w-4 h-4 flex items-center justify-center">
              {config.icon}
            </div>
          )}
        </div>

        {/* Display value or placeholder */}
        <div className="flex-1 text-left truncate flex items-center">
          {/* Show loading state if data is loading and we have a value but no selectedOption */}
          {(() => {
            if (isLoading && value && !selectedOption) {
              return <span className="text-white/60 font-normal leading-none">Loading {value}...</span>
            }
            if (selectedOption) {
              return <span className="text-white/95 font-medium leading-none">{selectedOption.label}</span>
            }
            return <span className="text-white/60 font-normal leading-none">{config.placeholder}</span>
          })()}
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-1.5">
          {isLoading && (
            <div className="w-4 h-4 border-2 border-[#14BDEA]/30 border-t-[#14BDEA] rounded-full animate-spin" />
          )}
          
          {allowClear && selectedOption && !isLoading && (
            <button
              onClick={handleClear}
              className="p-0.5 hover:bg-white/10 rounded-lg transition-colors duration-200"
              type="button"
              aria-label="Clear selection"
            >
              <X className="w-4 h-4 text-white/60 hover:text-white/90" />
            </button>
          )}
          
          <ChevronDown 
            className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </div>

      {/* Portal-rendered dropdown */}
      {dropdownPortal}
    </div>
  )
}