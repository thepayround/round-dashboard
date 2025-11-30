/**
 * useComboboxController Hook
 *
 * Separates business logic from UI (Composition Pattern)
 * Follows ui-ux-shadcn standards for controller hooks
 *
 * Features:
 * - Search with debounce
 * - Keyboard navigation
 * - Portal positioning
 * - Accessibility IDs
 * - Click outside detection
 */

import { useState, useRef, useEffect, useCallback, useMemo, useId } from 'react'

import type { ComboboxOption, ComboboxPosition } from './types'

interface UseComboboxControllerOptions<T = string> {
  options: ComboboxOption<T>[]
  value?: T
  searchable?: boolean
  disabled?: boolean
  onSearch?: (searchTerm: string) => void | Promise<void>
  searchDebounceMs?: number
}

export function useComboboxController<T = string>({
  options,
  value,
  searchable = true,
  disabled = false,
  onSearch,
  searchDebounceMs = 300,
}: UseComboboxControllerOptions<T>) {
  // State
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [dropdownPosition, setDropdownPosition] = useState<ComboboxPosition>({
    top: 0,
    left: 0,
    width: 0,
  })
  const [isSearching, setIsSearching] = useState(false)

  // Refs
  const triggerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // IDs for accessibility
  const generatedId = useId()
  const triggerId = `combobox-trigger-${generatedId}`
  const contentId = `combobox-content-${generatedId}`
  const listboxId = `combobox-listbox-${generatedId}`

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options

    const lowerSearch = searchTerm.toLowerCase()
    return options.filter((option) => {
      const searchableText = option.searchText || option.label
      return searchableText.toLowerCase().includes(lowerSearch)
    })
  }, [options, searchTerm])

  // Selected option
  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  )

  // Debounced search
  useEffect(() => {
    if (!searchable || !onSearch) return

    const handler = setTimeout(async () => {
      if (searchTerm) {
        setIsSearching(true)
        try {
          await onSearch(searchTerm)
        } finally {
          setIsSearching(false)
        }
      }
    }, searchDebounceMs)

    return () => clearTimeout(handler)
  }, [searchTerm, searchable, onSearch, searchDebounceMs])

  // Calculate dropdown position
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !isOpen) return

    const rect = triggerRef.current.getBoundingClientRect()
    setDropdownPosition({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
      width: rect.width,
    })
  }, [isOpen])

  // Update position on mount, resize, scroll
  useEffect(() => {
    if (!isOpen) return

    updatePosition()

    const handleResize = () => updatePosition()
    const handleScroll = () => updatePosition()

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, true)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [isOpen, updatePosition])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 0)
    }
  }, [isOpen, searchable])

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Reset highlighted index when filtered options change
  useEffect(() => {
    setHighlightedIndex(-1)
  }, [filteredOptions])

  // Handlers
  const toggleDropdown = useCallback(() => {
    if (disabled) return
    setIsOpen((prev) => !prev)
  }, [disabled])

  const closeDropdown = useCallback(() => {
    setIsOpen(false)
    setSearchTerm('')
    setHighlightedIndex(-1)
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchTerm('')
  }, [])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!isOpen) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          setIsOpen(true)
        }
        return
      }

      switch (event.key) {
        case 'Escape':
          event.preventDefault()
          closeDropdown()
          triggerRef.current?.focus()
          break

        case 'ArrowDown':
          event.preventDefault()
          setHighlightedIndex((prev) => {
            const next = prev + 1
            return next < filteredOptions.length ? next : prev
          })
          break

        case 'ArrowUp':
          event.preventDefault()
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1))
          break

        case 'Home':
          event.preventDefault()
          setHighlightedIndex(0)
          break

        case 'End':
          event.preventDefault()
          setHighlightedIndex(filteredOptions.length - 1)
          break

        case 'Tab':
          closeDropdown()
          break

        default:
          break
      }
    },
    [isOpen, filteredOptions.length, closeDropdown]
  )

  return {
    // State
    isOpen,
    searchTerm,
    highlightedIndex,
    dropdownPosition,
    isSearching,
    filteredOptions,
    selectedOption,

    // Refs
    triggerRef,
    dropdownRef,
    searchInputRef,

    // IDs
    triggerId,
    contentId,
    listboxId,

    // Handlers
    toggleDropdown,
    closeDropdown,
    handleSearchChange,
    clearSearch,
    handleKeyDown,
    setHighlightedIndex,
  }
}
