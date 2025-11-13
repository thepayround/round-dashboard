import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'

type DropdownOption = {
  value: string
  label: string
  searchText?: string
  description?: string
}

interface UseDropdownControllerProps<Option extends DropdownOption> {
  options: Option[]
  value?: string | null
  selectedValues?: string[]
  onSelect: (value: string) => void
  onClear?: () => void
  onMultiSelectChange?: (values: string[]) => void
  allowClear?: boolean
  disabled?: boolean
  loading?: boolean
  allowSearch?: boolean
  multiSelect?: boolean
  id?: string
}

interface UseDropdownControllerReturn<Option extends DropdownOption> {
  isOpen: boolean
  searchTerm: string
  setSearchTerm: (value: string) => void
  filteredOptions: Option[]
  highlightedIndex: number
  setHighlightedIndex: (index: number) => void
  selectedOption: Option | null
  selectedOptions: Option[]
  triggerRef: React.RefObject<HTMLDivElement>
  dropdownRef: React.RefObject<HTMLDivElement>
  searchInputRef: React.RefObject<HTMLInputElement>
  dropdownPosition: { top: number; left: number; width: number }
  listboxId: string
  activeDescendantId?: string
  toggleDropdown: () => void
  closeDropdown: () => void
  handleOptionSelect: (option: Option) => void
  handleClearSelection: () => void
  handleTriggerKeyDown: (event: React.KeyboardEvent) => void
  handleListKeyDown: (event: React.KeyboardEvent) => void
}

const DEFAULT_POSITION = { top: 0, left: 0, width: 0 }

const createSearchString = (option: DropdownOption) =>
  `${option.label} ${option.description ?? ''} ${option.searchText ?? ''}`.toLowerCase()

export const useDropdownController = <Option extends DropdownOption>({
  options,
  value,
  selectedValues,
  onSelect,
  onClear,
  onMultiSelectChange,
  allowClear = false,
  disabled = false,
  loading: _loading = false,
  allowSearch = true,
  multiSelect = false,
  id,
}: UseDropdownControllerProps<Option>): UseDropdownControllerReturn<Option> => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [dropdownPosition, setDropdownPosition] = useState(DEFAULT_POSITION)

  const triggerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const autoId = useId()
  const dropdownId = id ?? autoId
  const listboxId = `${dropdownId}-listbox`

  const selectedOption = useMemo(
    () => (value ? options.find(option => option.value === value) ?? null : null),
    [options, value]
  )

  const selectedOptions = useMemo(() => {
    if (multiSelect && selectedValues?.length) {
      const valueSet = new Set(selectedValues)
      return options.filter(option => valueSet.has(option.value))
    }
    return selectedOption ? [selectedOption] : []
  }, [multiSelect, options, selectedOption, selectedValues])

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedSearch(searchTerm.trim().toLowerCase())
    }, 150)

    return () => window.clearTimeout(handler)
  }, [searchTerm])

  const filteredOptions = useMemo(() => {
    if (!debouncedSearch) {
      return options
    }
    return options.filter(option => createSearchString(option).includes(debouncedSearch))
  }, [options, debouncedSearch])

  const updateDropdownPosition = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) {
      return
    }
    const rect = trigger.getBoundingClientRect()
    setDropdownPosition({
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX,
      width: rect.width,
    })
  }, [])

  const closeDropdown = useCallback(() => {
    setIsOpen(false)
    setSearchTerm('')
    setHighlightedIndex(-1)
  }, [])

  const openDropdown = useCallback(() => {
    if (disabled) {
      return
    }
    updateDropdownPosition()
    setIsOpen(true)
  }, [disabled, updateDropdownPosition])

  const toggleDropdown = useCallback(() => {
    if (isOpen) {
      closeDropdown()
    } else {
      openDropdown()
    }
  }, [closeDropdown, isOpen, openDropdown])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        closeDropdown()
      }
    }

    const handleWindowEvents = () => {
      updateDropdownPosition()
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('resize', handleWindowEvents)
    window.addEventListener('scroll', handleWindowEvents, true)

    if (allowSearch) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 0)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('resize', handleWindowEvents)
      window.removeEventListener('scroll', handleWindowEvents, true)
    }
  }, [allowSearch, closeDropdown, isOpen, updateDropdownPosition])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const selectedIndex = filteredOptions.findIndex(option => option.value === value)
    if (selectedIndex >= 0) {
      setHighlightedIndex(selectedIndex)
    } else if (filteredOptions.length > 0) {
      setHighlightedIndex(0)
    } else {
      setHighlightedIndex(-1)
    }
  }, [filteredOptions, isOpen, value])

  const handleOptionSelect = useCallback(
    (option: Option) => {
      if (multiSelect && selectedValues && onMultiSelectChange) {
        const valueSet = new Set(selectedValues)
        if (valueSet.has(option.value)) {
          valueSet.delete(option.value)
        } else {
          valueSet.add(option.value)
        }
        onMultiSelectChange(Array.from(valueSet))
      } else {
        onSelect(option.value)
        closeDropdown()
      }
    },
    [closeDropdown, multiSelect, onMultiSelectChange, onSelect, selectedValues]
  )

  const handleClearSelection = useCallback(() => {
    if (multiSelect && onMultiSelectChange) {
      onMultiSelectChange([])
    } else if (allowClear) {
      if (onClear) {
        onClear()
      } else {
        onSelect('')
      }
    }
    closeDropdown()
  }, [allowClear, closeDropdown, multiSelect, onClear, onMultiSelectChange, onSelect])

  const handleHighlightMove = useCallback(
    (direction: 1 | -1) => {
      if (!filteredOptions.length) {
        return
      }
      setHighlightedIndex(prev => {
        const nextIndex = prev + direction
        if (nextIndex < 0) {
          return filteredOptions.length - 1
        }
        if (nextIndex >= filteredOptions.length) {
          return 0
        }
        return nextIndex
      })
    },
    [filteredOptions.length]
  )

  const handleTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) {
        return
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        if (!isOpen) {
          openDropdown()
        } else {
          handleHighlightMove(event.key === 'ArrowDown' ? 1 : -1)
        }
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        toggleDropdown()
      } else if (event.key === 'Escape') {
        closeDropdown()
      }
    },
    [closeDropdown, disabled, handleHighlightMove, isOpen, openDropdown, toggleDropdown]
  )

  const handleListKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!isOpen) {
        return
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        handleHighlightMove(1)
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        handleHighlightMove(-1)
      } else if (event.key === 'Enter') {
        event.preventDefault()
        if (filteredOptions[highlightedIndex]) {
          handleOptionSelect(filteredOptions[highlightedIndex])
        }
      } else if (event.key === 'Escape') {
        event.preventDefault()
        closeDropdown()
      }
    },
    [closeDropdown, filteredOptions, handleHighlightMove, handleOptionSelect, highlightedIndex, isOpen]
  )

  const activeDescendantId =
    highlightedIndex >= 0 ? `${dropdownId}-option-${highlightedIndex}` : undefined

  return {
    isOpen,
    searchTerm,
    setSearchTerm,
    filteredOptions,
    highlightedIndex,
    setHighlightedIndex,
    selectedOption,
    selectedOptions,
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
  }
}

