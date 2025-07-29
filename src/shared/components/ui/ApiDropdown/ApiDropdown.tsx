import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
      <div className="auth-input input-with-icon-left flex items-center justify-between opacity-50 cursor-not-allowed">
        <div className="input-icon-left auth-icon-primary">
          {config.icon}
        </div>
        <span className="text-white/60">{config.errorText}</span>
        <button 
          onClick={() => refetch()}
          className="text-[#14BDEA] hover:text-[#14BDEA]/80 text-sm font-medium"
          type="button"
        >
          Retry
        </button>
      </div>
    )
  }

  // Create portal element
  const dropdownPortal = isOpen ? createPortal(
    <AnimatePresence>
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] bg-black/5 backdrop-blur-[1px]"
        onMouseDown={(e) => {
          // Only close on actual clicks, not on scroll or other events
          if (e.target === e.currentTarget) {
            setIsOpen(false)
            setSearchTerm('')
            setHighlightedIndex(-1)
          }
        }}
      />
      
      {/* Dropdown content */}
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="fixed z-[9999] will-change-transform"
        style={{
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: `${dropdownPosition.width}px`,
          zIndex: 9999,
          minWidth: '280px',
        }}
      >
        <div className="
          bg-white/[0.04] backdrop-blur-[32px] border border-white/10 
          rounded-2xl shadow-2xl overflow-hidden
          max-h-80 flex flex-col
          bg-gradient-to-br from-white/[0.08] to-white/[0.02]
          ring-1 ring-white/5
        ">
          {/* Search input */}
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={config.searchPlaceholder}
                className="
                  w-full pl-10 pr-10 py-2 
                  bg-white/10 border border-white/20 rounded-xl
                  text-white/95 placeholder-white/60
                  focus:bg-white/15 focus:border-[#14BDEA]/50 focus:outline-none
                  transition-all duration-200
                "
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition-colors duration-200"
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
                className="
                  mt-2 w-full px-3 py-2 text-sm
                  bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg
                  text-white/70 hover:text-white/90
                  transition-all duration-200
                  flex items-center justify-center space-x-2
                "
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
              <div className="p-4 text-center text-white/60">
                {config.noResultsText}
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {filteredOptions.map((option, index) => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => handleSelect(option.value)}
                    className={`
                      px-3 py-2.5 rounded-lg cursor-pointer
                      flex items-center justify-between
                      transition-all duration-200
                      ${index === highlightedIndex 
                        ? 'bg-[#14BDEA]/20 border border-[#14BDEA]/30' 
                        : 'hover:bg-white/10 border border-transparent'
                      }
                      ${option.value === value 
                        ? 'bg-[#D417C8]/20 border-[#D417C8]/30' 
                        : ''
                      }
                    `}
                    role="option"
                    aria-selected={option.value === value}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {option.icon && (
                        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                          {option.icon}
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-white/95 font-medium truncate">
                          {option.label}
                        </div>
                        {option.description && (
                          <div className="text-white/60 text-sm truncate">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {option.value === value && (
                      <Check className="w-4 h-4 text-[#D417C8] flex-shrink-0" />
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  ) : null

  return (
    <div className={`relative ${className}`}>
      {/* Dropdown trigger */}
      <div
        ref={triggerRef}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleToggle()
          }
        }}
        className={`
          relative w-full h-12 pl-12 pr-4 rounded-xl backdrop-blur-xl border transition-all duration-200
          bg-white/5 border-white/10 text-white cursor-pointer flex items-center justify-between
          ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 hover:border-white/20'}
          ${isOpen ? 'bg-white/10 border-white/30 outline-none ring-2 ring-[#D417C8]/30' : ''}
        `}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="dropdown-options"
        tabIndex={disabled ? -1 : 0}
      >
        {/* Left icon - show selected option icon if available, otherwise config icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400">
          {selectedOption?.icon ?? config.icon}
        </div>

        {/* Display value or placeholder */}
        <div className="flex-1 h-12 text-left truncate flex items-center">
          {selectedOption ? (
            <span className="text-white font-medium leading-none">{selectedOption.label}</span>
          ) : (
            <span className="text-gray-400 font-medium leading-none">{config.placeholder}</span>
          )}
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-2">
          {isLoading && (
            <div className="w-4 h-4 border-2 border-[#14BDEA]/30 border-t-[#14BDEA] rounded-full animate-spin" />
          )}
          
          {allowClear && selectedOption && !isLoading && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors duration-200"
              type="button"
              aria-label="Clear selection"
            >
              <X className="w-4 h-4 text-white/60 hover:text-white/90" />
            </button>
          )}
          
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
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