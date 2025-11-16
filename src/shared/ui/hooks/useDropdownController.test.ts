/**
 * useDropdownController Tests
 *
 * Comprehensive test coverage for the dropdown controller hook
 */
import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

import { useDropdownController } from './useDropdownController'

type DropdownOption = {
  value: string
  label: string
  searchText?: string
  description?: string
}

const mockOptions: DropdownOption[] = [
  { value: '1', label: 'Option 1', description: 'First option' },
  { value: '2', label: 'Option 2', description: 'Second option' },
  { value: '3', label: 'Option 3', searchText: 'third alternative' },
  { value: '4', label: 'Test Option', description: 'For testing' },
]

describe('useDropdownController', () => {
  let mockOnSelect: ReturnType<typeof vi.fn>
  let mockOnClear: ReturnType<typeof vi.fn>
  let mockOnMultiSelectChange: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockOnSelect = vi.fn()
    mockOnClear = vi.fn()
    mockOnMultiSelectChange = vi.fn()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  describe('Initialization', () => {
    it('should initialize with closed state', () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          onSelect: mockOnSelect,
        })
      )

      expect(result.current.isOpen).toBe(false)
      expect(result.current.searchTerm).toBe('')
      expect(result.current.highlightedIndex).toBe(-1)
    })

    it('should initialize with no selected option when value is undefined', () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          onSelect: mockOnSelect,
        })
      )

      expect(result.current.selectedOption).toBeNull()
      expect(result.current.selectedOptions).toEqual([])
    })

    it('should initialize with selected option when value is provided', () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          value: '2',
          onSelect: mockOnSelect,
        })
      )

      expect(result.current.selectedOption).toEqual(mockOptions[1])
      expect(result.current.selectedOptions).toEqual([mockOptions[1]])
    })

    it('should initialize with multiple selected options in multi-select mode', () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          selectedValues: ['1', '3'],
          multiSelect: true,
          onSelect: mockOnSelect,
          onMultiSelectChange: mockOnMultiSelectChange,
        })
      )

      expect(result.current.selectedOptions).toEqual([mockOptions[0], mockOptions[2]])
    })

    it('should generate listboxId from auto-generated ID when id not provided', () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          onSelect: mockOnSelect,
        })
      )

      // React's useId generates IDs like ':rd:' which become 'rd-listbox' after processing
      expect(result.current.listboxId).toMatch(/^[a-z0-9:-]+-listbox$/)
    })

    it('should use custom ID when provided', () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          id: 'custom-dropdown',
          onSelect: mockOnSelect,
        })
      )

      expect(result.current.listboxId).toBe('custom-dropdown-listbox')
    })
  })

  describe('Dropdown Open/Close', () => {
    it('should toggle dropdown open state', () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          onSelect: mockOnSelect,
        })
      )

      expect(result.current.isOpen).toBe(false)

      act(() => {
        result.current.toggleDropdown()
      })

      expect(result.current.isOpen).toBe(true)

      act(() => {
        result.current.toggleDropdown()
      })

      expect(result.current.isOpen).toBe(false)
    })

    it('should close dropdown and reset search term', () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          onSelect: mockOnSelect,
        })
      )

      act(() => {
        result.current.toggleDropdown()
        result.current.setSearchTerm('test')
      })

      expect(result.current.isOpen).toBe(true)
      expect(result.current.searchTerm).toBe('test')

      act(() => {
        result.current.closeDropdown()
      })

      expect(result.current.isOpen).toBe(false)
      expect(result.current.searchTerm).toBe('')
      expect(result.current.highlightedIndex).toBe(-1)
    })

    it('should not open dropdown when disabled', () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          disabled: true,
          onSelect: mockOnSelect,
        })
      )

      act(() => {
        result.current.toggleDropdown()
      })

      expect(result.current.isOpen).toBe(false)
    })
  })

  describe('Search and Filtering', () => {
    it('should filter options based on search term', async () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          onSelect: mockOnSelect,
        })
      )

      expect(result.current.filteredOptions).toEqual(mockOptions)

      act(() => {
        result.current.setSearchTerm('Option 1')
      })

      // Wait for debounce (150ms)
      await act(async () => {
        vi.advanceTimersByTime(150)
      })

      await waitFor(() => {
        expect(result.current.filteredOptions).toEqual([mockOptions[0]])
      })
    })

    it('should search in label, description, and searchText fields', async () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          onSelect: mockOnSelect,
        })
      )

      act(() => {
        result.current.setSearchTerm('alternative')
      })

      await act(async () => {
        vi.advanceTimersByTime(150)
      })

      await waitFor(() => {
        expect(result.current.filteredOptions).toEqual([mockOptions[2]])
      })
    })

    it('should return all options when search term is empty', async () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          onSelect: mockOnSelect,
        })
      )

      act(() => {
        result.current.setSearchTerm('test')
      })

      await act(async () => {
        vi.advanceTimersByTime(150)
      })

      act(() => {
        result.current.setSearchTerm('')
      })

      await act(async () => {
        vi.advanceTimersByTime(150)
      })

      await waitFor(() => {
        expect(result.current.filteredOptions).toEqual(mockOptions)
      })
    })

    it('should debounce search input', async () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          onSelect: mockOnSelect,
        })
      )

      act(() => {
        result.current.setSearchTerm('Op')
      })

      // Not debounced yet
      expect(result.current.filteredOptions).toEqual(mockOptions)

      act(() => {
        result.current.setSearchTerm('Option 1')
      })

      // Still not debounced
      expect(result.current.filteredOptions).toEqual(mockOptions)

      await act(async () => {
        vi.advanceTimersByTime(150)
      })

      // Now it should filter (search for "Option 1" should only return first option)
      expect(result.current.filteredOptions).toEqual([mockOptions[0]])
    })
  })

  describe('Option Selection', () => {
    it('should select option in single-select mode', () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          onSelect: mockOnSelect,
        })
      )

      act(() => {
        result.current.toggleDropdown()
        result.current.handleOptionSelect(mockOptions[1])
      })

      expect(mockOnSelect).toHaveBeenCalledWith('2')
      expect(result.current.isOpen).toBe(false)
    })

    it('should toggle option selection in multi-select mode', () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          selectedValues: ['1'],
          multiSelect: true,
          onSelect: mockOnSelect,
          onMultiSelectChange: mockOnMultiSelectChange,
        })
      )

      act(() => {
        result.current.toggleDropdown()
        result.current.handleOptionSelect(mockOptions[1])
      })

      expect(mockOnMultiSelectChange).toHaveBeenCalledWith(['1', '2'])
      expect(result.current.isOpen).toBe(true) // Should stay open in multi-select
    })

    it('should deselect option when already selected in multi-select mode', () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          selectedValues: ['1', '2'],
          multiSelect: true,
          onSelect: mockOnSelect,
          onMultiSelectChange: mockOnMultiSelectChange,
        })
      )

      act(() => {
        result.current.toggleDropdown()
        result.current.handleOptionSelect(mockOptions[1])
      })

      expect(mockOnMultiSelectChange).toHaveBeenCalledWith(['1'])
    })
  })

  describe('Clear Selection', () => {
    it('should call onClear when allowClear is true and onClear is provided', () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          value: '1',
          allowClear: true,
          onSelect: mockOnSelect,
          onClear: mockOnClear,
        })
      )

      act(() => {
        result.current.handleClearSelection()
      })

      expect(mockOnClear).toHaveBeenCalled()
      expect(result.current.isOpen).toBe(false)
    })

    it('should call onSelect with empty string when allowClear is true but onClear not provided', () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          value: '1',
          allowClear: true,
          onSelect: mockOnSelect,
        })
      )

      act(() => {
        result.current.handleClearSelection()
      })

      expect(mockOnSelect).toHaveBeenCalledWith('')
    })

    it('should clear all selections in multi-select mode', () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          selectedValues: ['1', '2'],
          multiSelect: true,
          onSelect: mockOnSelect,
          onMultiSelectChange: mockOnMultiSelectChange,
        })
      )

      act(() => {
        result.current.handleClearSelection()
      })

      expect(mockOnMultiSelectChange).toHaveBeenCalledWith([])
    })
  })

  describe('Keyboard Navigation', () => {
    it('should handle ArrowDown on trigger to open dropdown', () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          onSelect: mockOnSelect,
        })
      )

      const event = {
        key: 'ArrowDown',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent

      act(() => {
        result.current.handleTriggerKeyDown(event)
      })

      expect(event.preventDefault).toHaveBeenCalled()
      expect(result.current.isOpen).toBe(true)
    })

    it('should handle Enter on trigger to toggle dropdown', () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          onSelect: mockOnSelect,
        })
      )

      const event = {
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent

      act(() => {
        result.current.handleTriggerKeyDown(event)
      })

      expect(result.current.isOpen).toBe(true)

      act(() => {
        result.current.handleTriggerKeyDown(event)
      })

      expect(result.current.isOpen).toBe(false)
    })

    it('should handle Space on trigger to toggle dropdown', () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          onSelect: mockOnSelect,
        })
      )

      const event = {
        key: ' ',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent

      act(() => {
        result.current.handleTriggerKeyDown(event)
      })

      expect(result.current.isOpen).toBe(true)
    })

    it('should handle Escape on trigger to close dropdown', () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          onSelect: mockOnSelect,
        })
      )

      act(() => {
        result.current.toggleDropdown()
      })

      const event = {
        key: 'Escape',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent

      act(() => {
        result.current.handleTriggerKeyDown(event)
      })

      expect(result.current.isOpen).toBe(false)
    })

    it('should not respond to keyboard when disabled', () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          disabled: true,
          onSelect: mockOnSelect,
        })
      )

      const event = {
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent

      act(() => {
        result.current.handleTriggerKeyDown(event)
      })

      expect(result.current.isOpen).toBe(false)
    })

    it('should navigate through options with arrow keys in list', () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          onSelect: mockOnSelect,
        })
      )

      act(() => {
        result.current.toggleDropdown()
      })

      // Initial highlighted index should be 0
      waitFor(() => {
        expect(result.current.highlightedIndex).toBe(0)
      })

      const downEvent = {
        key: 'ArrowDown',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent

      act(() => {
        result.current.handleListKeyDown(downEvent)
      })

      expect(result.current.highlightedIndex).toBe(1)

      const upEvent = {
        key: 'ArrowUp',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent

      act(() => {
        result.current.handleListKeyDown(upEvent)
      })

      expect(result.current.highlightedIndex).toBe(0)
    })

    it('should wrap around when navigating past last option', async () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          onSelect: mockOnSelect,
        })
      )

      act(() => {
        result.current.toggleDropdown()
      })

      // Wait for auto-highlight effect to complete
      await waitFor(() => {
        expect(result.current.highlightedIndex).toBe(0)
      })

      act(() => {
        result.current.setHighlightedIndex(mockOptions.length - 1)
      })

      const event = {
        key: 'ArrowDown',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent

      act(() => {
        result.current.handleListKeyDown(event)
      })

      expect(result.current.highlightedIndex).toBe(0)
    })

    it('should wrap around when navigating before first option', () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          onSelect: mockOnSelect,
        })
      )

      act(() => {
        result.current.toggleDropdown()
        result.current.setHighlightedIndex(0)
      })

      const event = {
        key: 'ArrowUp',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent

      act(() => {
        result.current.handleListKeyDown(event)
      })

      expect(result.current.highlightedIndex).toBe(mockOptions.length - 1)
    })

    it('should select highlighted option when Enter is pressed in list', async () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          onSelect: mockOnSelect,
        })
      )

      act(() => {
        result.current.toggleDropdown()
      })

      await waitFor(() => {
        expect(result.current.highlightedIndex).toBe(0)
      })

      const event = {
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent

      act(() => {
        result.current.handleListKeyDown(event)
      })

      expect(mockOnSelect).toHaveBeenCalledWith('1')
    })
  })

  describe('Active Descendant', () => {
    it('should generate activeDescendantId when option is highlighted', async () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          id: 'test-dropdown',
          onSelect: mockOnSelect,
        })
      )

      act(() => {
        result.current.toggleDropdown()
      })

      // Wait for auto-highlight effect to complete
      await waitFor(() => {
        expect(result.current.highlightedIndex).toBe(0)
      })

      act(() => {
        result.current.setHighlightedIndex(1)
      })

      expect(result.current.activeDescendantId).toBe('test-dropdown-option-1')
    })

    it('should return undefined activeDescendantId when no option is highlighted', () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          onSelect: mockOnSelect,
        })
      )

      expect(result.current.activeDescendantId).toBeUndefined()
    })
  })

  describe('Refs', () => {
    it('should provide refs for trigger, dropdown, and search input', () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          onSelect: mockOnSelect,
        })
      )

      expect(result.current.triggerRef).toBeDefined()
      expect(result.current.dropdownRef).toBeDefined()
      expect(result.current.searchInputRef).toBeDefined()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty options array', () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: [],
          onSelect: mockOnSelect,
        })
      )

      expect(result.current.filteredOptions).toEqual([])
      expect(result.current.selectedOption).toBeNull()
    })

    it('should handle search with no results', async () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          onSelect: mockOnSelect,
        })
      )

      act(() => {
        result.current.setSearchTerm('nonexistent')
      })

      await act(async () => {
        vi.advanceTimersByTime(150)
      })

      await waitFor(() => {
        expect(result.current.filteredOptions).toEqual([])
      })
    })

    it('should handle value that does not match any option', () => {
      const { result } = renderHook(() =>
        useDropdownController({
          options: mockOptions,
          value: 'nonexistent',
          onSelect: mockOnSelect,
        })
      )

      expect(result.current.selectedOption).toBeNull()
    })
  })
})
