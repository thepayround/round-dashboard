/**
 * UiDropdown Component
 *
 * A fully accessible dropdown component for static client-side data.
 * For API-driven data, use ApiDropdown instead.
 */
import { ChevronDown, Search, X, Check } from 'lucide-react'
import { createPortal } from 'react-dom'

import { IconButton } from '../Button'
import { dropdownStyles, getOptionClasses } from '../dropdown-styles.config'

import { useDropdownController } from '@/shared/ui/hooks/useDropdownController'

export interface UiDropdownOption {
  value: string
  label: string
  searchText?: string
  icon?: React.ReactNode
  description?: string
}

interface UiDropdownProps {
  options: UiDropdownOption[]
  value?: string | null
  onSelect: (value: string) => void
  onClear?: () => void
  placeholder?: string
  searchPlaceholder?: string
  noResultsText?: string
  disabled?: boolean
  error?: boolean
  allowClear?: boolean
  allowSearch?: boolean
  className?: string
  icon?: React.ReactNode
  loading?: boolean
  label?: string
  id?: string
}

export const UiDropdown = ({
  options,
  value,
  onSelect,
  onClear,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search options...',
  noResultsText = 'No options found',
  disabled = false,
  error = false,
  allowClear = false,
  allowSearch = true,
  className = '',
  icon,
  loading = false,
  label,
  id,
}: UiDropdownProps) => {
  const {
    isOpen,
    searchTerm,
    setSearchTerm,
    filteredOptions,
    highlightedIndex,
    setHighlightedIndex,
    triggerRef,
    dropdownRef,
    searchInputRef,
    dropdownPosition,
    listboxId,
    activeDescendantId,
    toggleDropdown,
    handleOptionSelect,
    handleClearSelection,
    handleTriggerKeyDown,
    handleListKeyDown,
    selectedOption,
  } = useDropdownController<UiDropdownOption>({
    options,
    value: value ?? null,
    onSelect,
    onClear,
    allowClear,
    disabled,
    loading,
    allowSearch,
    id,
  })

  const triggerId = id ?? 'ui-dropdown-trigger'

  const dropdownPortal = isOpen
    ? createPortal(
        <div
          ref={dropdownRef}
          className="dropdown-portal"
          style={{
            position: 'absolute',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            zIndex: 60,
          }}
        >
          <div className="bg-[#0F1017] border border-white/10 rounded-xl shadow-2xl max-h-80 overflow-hidden flex flex-col">
            {allowSearch && (
              <div className="p-3 border-b border-white/5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#14BDEA]"
                    aria-label={searchPlaceholder}
                    disabled={disabled}
                  />
                </div>
              </div>
            )}

            <div
              className="max-h-64 overflow-y-auto"
              role="listbox"
              id={listboxId}
              aria-activedescendant={activeDescendantId}
              tabIndex={-1}
              onKeyDown={handleListKeyDown}
            >
              {loading ? (
                <div className="p-6 flex flex-col items-center text-center space-y-3">
                  <div className="w-6 h-6 border border-[#14BDEA]/30 border-t-[#14BDEA] rounded-full animate-spin" />
                  <p className="text-white/60 text-sm">Loading options...</p>
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-white/60 text-sm">{noResultsText}</div>
              ) : (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    id={`${listboxId}-option-${index}`}
                    role="option"
                    aria-selected={option.value === value}
                    tabIndex={0}
                    className={getOptionClasses(index === highlightedIndex, option.value === value)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => handleOptionSelect(option)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleOptionSelect(option)
                      }
                    }}
                  >
                    <div className={`flex items-center ${dropdownStyles.option.spacing} flex-1 min-w-0`}>
                      {option.icon && (
                        <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                          {option.icon}
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className={dropdownStyles.option.label}>{option.label}</div>
                        {option.description && (
                          <div className={dropdownStyles.option.description}>{option.description}</div>
                        )}
                      </div>
                    </div>

                    {option.value === value && <Check className={dropdownStyles.option.checkIcon} />}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>,
        document.body
      )
    : null

  return (
    <div className={`relative ${className}`}>
      <div
        ref={triggerRef}
        id={triggerId}
        onClick={() => {
          if (!disabled) {
            toggleDropdown()
          }
        }}
        onKeyDown={disabled ? undefined : handleTriggerKeyDown}
        className={`
          relative w-full h-9 pl-9 pr-3 rounded-lg border transition-all duration-300
          bg-[#171719] border-[#333333] text-white flex items-center justify-between
          font-light text-xs outline-none
          ${error ? 'border-[#ef4444]' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
          ${isOpen && !error ? 'border-[#14bdea] shadow-[0_0_0_3px_rgba(20,189,234,0.15)] transform -translate-y-px' : ''}
          ${isOpen && error ? 'shadow-[0_0_0_3px_rgba(239,68,68,0.25)] transform -translate-y-px' : ''}
        `}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-activedescendant={activeDescendantId}
        aria-label={label || placeholder}
        aria-disabled={disabled}
        aria-invalid={error}
        aria-busy={loading}
        tabIndex={disabled ? -1 : 0}
      >
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 flex items-center justify-center">
          {selectedOption?.icon ?? icon ?? <ChevronDown className="w-4 h-4" />}
        </div>

        <div className="flex-1 text-left truncate flex items-center">
          {(() => {
            if (loading && value && !selectedOption) {
              return <span className="text-white/60 font-normal leading-none">Loading {value}...</span>
            }
            if (selectedOption) {
              return <span className="text-white/95 font-medium leading-none">{selectedOption.label}</span>
            }
            return <span className="text-white/60 font-normal leading-none">{placeholder}</span>
          })()}
        </div>

        <div className="flex items-center space-x-1.5">
          {loading && <div className="w-4 h-4 border border-[#14BDEA]/30 border-t-[#14BDEA] rounded-full animate-spin" />}

          {allowClear && selectedOption && !loading && (
            <IconButton
              onClick={(event) => {
                event.stopPropagation()
                handleClearSelection()
              }}
              icon={X}
              variant="ghost"
              size="sm"
              aria-label="Clear selection"
              className="w-5 h-5 p-0"
            />
          )}

          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {dropdownPortal}
    </div>
  )
}

