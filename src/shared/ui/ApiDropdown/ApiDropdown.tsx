/**
 * ApiDropdown Component
 *
 * A fully accessible dropdown component for API-driven data with loading and error states.
 * For static client-side data, use UiDropdown instead.
 */
import { ChevronDown, Search, X, Check } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'

import { Button, IconButton } from '../Button'
// Import shared dropdown styles to ensure visual consistency
import { dropdownStyles, getOptionClasses } from '../dropdown-styles.config'

import { useDropdownController } from '@/shared/ui/hooks/useDropdownController'
import { cn } from '@/shared/utils/cn'

export interface ApiDropdownOption {
  value: string
  label: string
  searchText?: string
  icon?: React.ReactNode
  description?: string
}

export interface ApiDropdownConfig<TData = Record<string, unknown>> {
  useHook: () => {
    data: TData[]
    isLoading: boolean
    isError: boolean
    refetch: () => void | Promise<void>
  }
  mapToOptions: (data: TData[]) => ApiDropdownOption[]
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
  id?: string
  label?: string
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
  id,
  label,
}: ApiDropdownProps<T>) => {
  const { data, isLoading, isError, refetch } = config.useHook()

  const options = useMemo(() => {
    if (!data) {
      return []
    }
    return config.mapToOptions(data)
  }, [config, data])

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
  } = useDropdownController<ApiDropdownOption>({
    options,
    value,
    onSelect,
    onClear,
    allowClear,
    disabled,
    isLoading: isLoading,
    allowSearch: true,
    id,
  })

  const triggerId = id ?? 'api-dropdown-trigger'

  useEffect(() => {
    if (!isError) {
      return
    }

    const timer = setTimeout(() => {
      refetch()
    }, 2000)

    return () => clearTimeout(timer)
  }, [isError, refetch])

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
            zIndex: 9999,
          }}
        >
          <div className={`${dropdownStyles.container.base} ${dropdownStyles.container.maxHeight}`}>
            <div className={dropdownStyles.search.container}>
              <div className="relative">
                <Search className={dropdownStyles.search.icon} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={config.searchPlaceholder}
                  className={dropdownStyles.search.input}
                  aria-label={config.searchPlaceholder}
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

            <div
              className={dropdownStyles.list.container}
              role="listbox"
              id={listboxId}
              aria-activedescendant={activeDescendantId}
              tabIndex={-1}
              onKeyDown={handleListKeyDown}
            >
              {isError ? (
                <div className="p-4 flex flex-col items-center text-center space-y-4">
                  <p className="text-destructive text-sm">{config.errorText}</p>
                  <Button size="md" variant="secondary" onClick={() => refetch()}>
                    Retry
                  </Button>
                </div>
              ) : isLoading ? (
                <div className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="w-6 h-6 border border-secondary/30 border-t-secondary rounded-full animate-spin" />
                  <p className="text-fg-muted text-xs">Loading options...</p>
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className={dropdownStyles.list.empty}>{config.noResultsText}</div>
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
                          <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-fg-muted">
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
          'relative w-full h-10 rounded-lg border bg-input border-border text-fg flex items-center justify-between font-normal text-sm outline-none transition-all duration-200 hover:border-border-hover focus:border-ring focus:ring-1 focus:ring-ring/20',
          'pl-9 pr-4', // Always has icon padding in ApiDropdown as config.icon is required
          error && 'border-destructive focus:border-destructive',
          disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
          isOpen && !error && 'border-ring ring-1 ring-ring/20',
          isOpen && error && 'border-destructive'
        )}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-activedescendant={activeDescendantId}
        aria-label={label || config.placeholder}
        aria-disabled={disabled}
        aria-invalid={error}
        aria-busy={isLoading}
        tabIndex={disabled ? -1 : 0}
      >
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-fg-muted flex items-center justify-center">
          {selectedOption?.icon ?? <div className="w-4 h-4 flex items-center justify-center">{config.icon}</div>}
        </div>

        <div className="flex-1 text-left truncate flex items-center">
          {(() => {
            if (isLoading && value && !selectedOption) {
              return <span className="text-fg-muted font-normal leading-none">Loading {value}...</span>
            }
            if (selectedOption) {
              return <span className="text-fg font-medium leading-none">{selectedOption.label}</span>
            }
            return <span className="text-fg-subtle font-normal leading-none">{config.placeholder}</span>
          })()}
        </div>

        <div className="flex items-center space-x-1.5">
          {isLoading && <div className="w-4 h-4 border border-secondary/30 border-t-secondary rounded-full animate-spin" />}

          {allowClear && selectedOption && !isLoading && (
            <IconButton
              onClick={(event) => {
                event.stopPropagation()
                handleClearSelection()
              }}
              icon={X}
              variant="ghost"
              size="sm"
              aria-label="Clear selection"
              className="w-5 h-5 p-0 text-fg-muted hover:text-fg"
            />
          )}

          <ChevronDown className={`w-4 h-4 text-fg-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {dropdownPortal}
    </div>
  )
}

