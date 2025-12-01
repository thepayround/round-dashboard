/**
 * SimpleSelect Component
 *
 * Simple dropdown for fixed option lists. Shares visual styling with Combobox.
 * Use this for small, static option lists (no search needed).
 *
 * Features:
 * ✅ Consistent styling with Combobox
 * ✅ Keyboard navigation (Arrow keys, Enter, Escape)
 * ✅ ARIA support
 * ✅ Portal rendering
 * ✅ Icon support
 * ✅ Height: h-9 (36px) - shadcn standard
 *
 * @example
 * <SimpleSelect
 *   options={[
 *     { value: '7d', label: 'Last 7 days' },
 *     { value: '30d', label: 'Last 30 days' },
 *   ]}
 *   value={selectedRange}
 *   onChange={setSelectedRange}
 *   label="Date range"
 * />
 */

import { Check, ChevronDown } from 'lucide-react'
import * as React from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/shared/utils/cn'

export interface SimpleSelectOption<T = string> {
  value: T
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

export interface SimpleSelectProps<T = string> {
  /** List of options */
  options: SimpleSelectOption<T>[]
  /** Selected value */
  value?: T
  /** Change handler */
  onChange: (value: T) => void
  /** Label text */
  label?: string
  /** Placeholder text */
  placeholder?: string
  /** Disabled state */
  disabled?: boolean
  /** Additional class names for trigger */
  className?: string
  /** HTML id */
  id?: string
}

export const SimpleSelect = <T extends string = string>({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select...',
  disabled = false,
  className,
  id,
}: SimpleSelectProps<T>) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0, width: 0 })

  const triggerRef = React.useRef<HTMLDivElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const triggerId = React.useId()
  const listboxId = `${triggerId}-listbox`
  const inputId = id || triggerId

  const selectedOption = React.useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  )

  // Update dropdown position
  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return

    const rect = triggerRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const spaceBelow = viewportHeight - rect.bottom
    const dropdownHeight = Math.min(options.length * 40, 300) + 8

    const showAbove = spaceBelow < dropdownHeight && rect.top > dropdownHeight

    setDropdownPosition({
      top: showAbove ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    })
  }, [options.length])

  // Toggle dropdown
  const toggleDropdown = React.useCallback(() => {
    if (disabled) return
    setIsOpen((prev) => {
      if (!prev) {
        updatePosition()
        // Set initial highlighted index to selected option
        const selectedIdx = options.findIndex((opt) => opt.value === value)
        setHighlightedIndex(selectedIdx >= 0 ? selectedIdx : 0)
      }
      return !prev
    })
  }, [disabled, updatePosition, options, value])

  const closeDropdown = React.useCallback(() => {
    setIsOpen(false)
    setHighlightedIndex(-1)
  }, [])

  // Handle selection
  const handleSelect = React.useCallback(
    (option: SimpleSelectOption<T>) => {
      if (option.disabled) return
      onChange(option.value)
      closeDropdown()
      triggerRef.current?.focus()
    },
    [onChange, closeDropdown]
  )

  // Keyboard navigation
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault()
          if (isOpen && highlightedIndex >= 0) {
            const option = options[highlightedIndex]
            if (option && !option.disabled) handleSelect(option)
          } else {
            toggleDropdown()
          }
          break
        case 'Escape':
          if (isOpen) {
            e.preventDefault()
            closeDropdown()
            triggerRef.current?.focus()
          }
          break
        case 'ArrowDown':
          e.preventDefault()
          if (!isOpen) {
            toggleDropdown()
          } else {
            setHighlightedIndex((prev) => {
              let next = prev + 1
              while (next < options.length && options[next]?.disabled) next++
              return next < options.length ? next : prev
            })
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          if (!isOpen) {
            toggleDropdown()
          } else {
            setHighlightedIndex((prev) => {
              let next = prev - 1
              while (next >= 0 && options[next]?.disabled) next--
              return next >= 0 ? next : prev
            })
          }
          break
        case 'Home':
          if (isOpen) {
            e.preventDefault()
            const firstEnabled = options.findIndex((opt) => !opt.disabled)
            setHighlightedIndex(firstEnabled >= 0 ? firstEnabled : 0)
          }
          break
        case 'End':
          if (isOpen) {
            e.preventDefault()
            const lastEnabled = options.reduce(
              (acc, opt, idx) => (!opt.disabled ? idx : acc),
              -1
            )
            setHighlightedIndex(lastEnabled >= 0 ? lastEnabled : options.length - 1)
          }
          break
      }
    },
    [disabled, isOpen, highlightedIndex, options, handleSelect, toggleDropdown, closeDropdown]
  )

  // Update position on scroll/resize
  React.useEffect(() => {
    if (!isOpen) return

    const handleUpdate = () => updatePosition()
    window.addEventListener('scroll', handleUpdate, true)
    window.addEventListener('resize', handleUpdate)

    return () => {
      window.removeEventListener('scroll', handleUpdate, true)
      window.removeEventListener('resize', handleUpdate)
    }
  }, [isOpen, updatePosition])

  // Portal content
  const portal = isOpen
    ? createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={closeDropdown}
            aria-hidden="true"
          />

          {/* Dropdown */}
          <div
            ref={dropdownRef}
            className="fixed z-50 rounded-md border border-input bg-card shadow-lg"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              minWidth: '160px',
            }}
          >
            <div
              className={cn(
                'overflow-y-auto py-1',
                '[&::-webkit-scrollbar]:w-1.5',
                '[&::-webkit-scrollbar-track]:bg-transparent',
                '[&::-webkit-scrollbar-thumb]:bg-muted-foreground/20',
                '[&::-webkit-scrollbar-thumb]:rounded-full',
                '[&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/40'
              )}
              style={{ maxHeight: '300px' }}
              role="listbox"
              id={listboxId}
              aria-label={label || 'Options'}
            >
              {options.map((option, index) => (
                <div
                  key={String(option.value)}
                  className={cn(
                    'relative flex items-center gap-2 px-3 py-2 cursor-pointer text-sm',
                    'transition-colors select-none outline-none',
                    'hover:bg-accent hover:text-accent-foreground',
                    highlightedIndex === index && 'bg-accent text-accent-foreground',
                    option.value === value && 'font-medium',
                    option.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
                  )}
                  onClick={() => handleSelect(option)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleSelect(option)
                    }
                  }}
                  onMouseEnter={() => !option.disabled && setHighlightedIndex(index)}
                  role="option"
                  aria-selected={option.value === value}
                  aria-disabled={option.disabled}
                  tabIndex={option.disabled ? -1 : 0}
                >
                  {option.icon && (
                    <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                      {option.icon}
                    </span>
                  )}

                  <span className="flex-1 truncate">{option.label}</span>

                  {option.value === value && (
                    <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </>,
        document.body
      )
    : null

  const triggerElement = (
    <div
      ref={triggerRef}
      id={inputId}
      onClick={toggleDropdown}
      onKeyDown={handleKeyDown}
      className={cn(
        'h-9 w-full px-3 rounded-md border border-input shadow-xs',
        'bg-transparent dark:bg-input/30',
        'flex items-center justify-between gap-2',
        'cursor-pointer transition-[color,box-shadow]',
        'focus:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        isOpen && 'border-ring ring-ring/50 ring-[3px]',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      role="combobox"
      aria-expanded={isOpen}
      aria-controls={listboxId}
      aria-haspopup="listbox"
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      {/* Selected Value or Placeholder */}
      <div className="flex-1 text-sm truncate flex items-center gap-2">
        {selectedOption ? (
          <>
            {selectedOption.icon && <span className="flex-shrink-0">{selectedOption.icon}</span>}
            <span>{selectedOption.label}</span>
          </>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
      </div>

      {/* Chevron */}
      <ChevronDown
        className={cn(
          'h-4 w-4 text-muted-foreground transition-transform duration-200',
          isOpen && 'rotate-180'
        )}
      />
    </div>
  )

  // If no label, render trigger directly
  if (!label) {
    return (
      <>
        {triggerElement}
        {portal}
      </>
    )
  }

  // With label, render with wrapper
  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium mb-2">
        {label}
      </label>
      {triggerElement}
      {portal}
    </div>
  )
}

SimpleSelect.displayName = 'SimpleSelect'
