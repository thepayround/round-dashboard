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
import { cn } from '@/shared/utils/cn'

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
  name?: string
}

const DROPDOWN_PORTAL_Z_INDEX = 9999

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
  name,
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
    closeDropdown,
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

  const dropdownBaseId = id ?? listboxId.replace(/-listbox$/, '')
  const triggerId = dropdownBaseId
  const searchInputId = `${dropdownBaseId}-search`

  const dropdownPortal = isOpen
    ? createPortal(
        <>
          <div
            className={`${dropdownStyles.backdrop.base} ${dropdownStyles.backdrop.zIndex}`}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                event.stopPropagation()
                closeDropdown()
              }
            }}
            role="presentation"
          />
          <div
            ref={dropdownRef}
            className={dropdownStyles.container.positioning}
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              zIndex: DROPDOWN_PORTAL_Z_INDEX,
            }}
          >
            <div className={`${dropdownStyles.container.base} ${dropdownStyles.container.maxHeight}`}>
              {allowSearch && (
                <div className={dropdownStyles.search.container}>
                  <div className="relative">
                    <Search className={dropdownStyles.search.icon} />
                    <input
                      ref={searchInputRef}
                      id={searchInputId}
                      name={name ?? searchInputId}
                      type="text"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder={searchPlaceholder}
                      className={dropdownStyles.search.input}
                      aria-label={searchPlaceholder}
                      disabled={disabled}
                    />
                    {searchTerm && (
                      <IconButton
                        onClick={() => setSearchTerm('')}
                        variant="ghost"
                        size="sm"
                        icon={X}
                        aria-label="Clear search"
                        className={dropdownStyles.search.clearButton}
                      />
                    )}
                  </div>
                </div>
              )}

              <div
                className={dropdownStyles.list.container}
                role="listbox"
                id={listboxId}
                aria-activedescendant={activeDescendantId}
                tabIndex={-1}
                onKeyDown={handleListKeyDown}
              >
                {loading ? (
                  <div className="p-6 flex flex-col items-center text-center space-y-3 text-xs">
                    <div className="w-6 h-6 border border-secondary/30 border-t-secondary rounded-full animate-spin" />
                    <p className="text-white/60">Loading options...</p>
                  </div>
                ) : filteredOptions.length === 0 ? (
                  <div className={dropdownStyles.list.empty}>{noResultsText}</div>
                ) : (
                  <div className={`${dropdownStyles.list.padding} ${dropdownStyles.list.spacing}`}>
                    {filteredOptions.map((option, index) => (
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
                            <span className="flex-shrink-0 text-white/70 flex items-center justify-center">
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
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>,
        document.body
      )
    : null

  const hasLeadingIcon = Boolean(selectedOption?.icon || icon)

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
        className={cn(
          'relative w-full h-11 lg:h-9 rounded-lg border bg-auth-bg border-auth-border text-white flex items-center justify-between font-light text-xs outline-none transition-[border-color,background-color] duration-150 ease-out hover:border-auth-border-hover focus:border-auth-primary focus-visible:ring-2 focus-visible:ring-[#14bdea]/25 focus-visible:ring-offset-0',
          hasLeadingIcon ? 'pl-9 pr-3' : 'px-3',
          error && 'border-[#ef4444]',
          disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
          isOpen && !error && 'border-[#14bdea]',
          isOpen && error && 'border-[#ef4444]'
        )}
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
        <div className="flex-1 text-left truncate flex items-center gap-2 min-w-0">
          {hasLeadingIcon && (
            <span className="flex-shrink-0 text-white/70 flex items-center justify-center">
              {selectedOption?.icon ?? icon}
            </span>
          )}
          {(() => {
            if (loading && value && !selectedOption) {
              return (
                <span className="text-white/60 font-normal leading-none truncate">
                  Loading {value}...
                </span>
              )
            }
            if (selectedOption) {
              return (
                <span className="text-white/95 font-medium leading-none truncate">
                  {selectedOption.label}
                </span>
              )
            }
            return (
              <span className="text-white/60 font-normal leading-none truncate">
                {placeholder}
              </span>
            )
          })()}
        </div>

        <div className="flex items-center space-x-1.5">
          {loading && <div className="w-4 h-4 border border-secondary/30 border-t-secondary rounded-full animate-spin" />}

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
