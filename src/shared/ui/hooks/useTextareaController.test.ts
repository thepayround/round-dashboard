/**
 * useTextareaController Tests
 *
 * Test coverage for the textarea controller hook
 */
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useTextareaController } from './useTextareaController'

describe('useTextareaController', () => {
  describe('Initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useTextareaController({}))

      expect(result.current.hasError).toBe(false)
      expect(result.current.isFocused).toBe(false)
      expect(result.current.isHovered).toBe(false)
      expect(result.current.errorId).toBeUndefined()
      expect(result.current.helpTextId).toBeUndefined()
    })

    it('should generate textareaId when id not provided', () => {
      const { result } = renderHook(() => useTextareaController({}))

      expect(result.current.textareaId).toMatch(/^textarea-[a-z0-9]+$/)
    })

    it('should use custom id when provided', () => {
      const customId = 'custom-textarea'
      const { result } = renderHook(() =>
        useTextareaController({ id: customId })
      )

      expect(result.current.textareaId).toBe(customId)
    })
  })

  describe('Error Handling', () => {
    it('should set hasError to true when error exists', () => {
      const { result } = renderHook(() =>
        useTextareaController({ error: 'Error message' })
      )

      expect(result.current.hasError).toBe(true)
    })

    it('should generate errorId when error exists', () => {
      const { result } = renderHook(() =>
        useTextareaController({
          id: 'test-textarea',
          error: 'Error message',
        })
      )

      expect(result.current.errorId).toBe('test-textarea-error')
    })

    it('should not generate errorId when no error', () => {
      const { result } = renderHook(() =>
        useTextareaController({ id: 'test-textarea' })
      )

      expect(result.current.errorId).toBeUndefined()
    })
  })

  describe('Help Text Handling', () => {
    it('should generate helpTextId when helpText exists', () => {
      const { result } = renderHook(() =>
        useTextareaController({
          id: 'test-textarea',
          helpText: 'Help text',
        })
      )

      expect(result.current.helpTextId).toBe('test-textarea-help')
    })

    it('should not generate helpTextId when no helpText', () => {
      const { result } = renderHook(() =>
        useTextareaController({ id: 'test-textarea' })
      )

      expect(result.current.helpTextId).toBeUndefined()
    })
  })

  describe('Focus State Management', () => {
    it('should set isFocused to true on focus', () => {
      const { result } = renderHook(() => useTextareaController({}))

      expect(result.current.isFocused).toBe(false)

      act(() => {
        result.current.handleFocus({} as React.FocusEvent<HTMLTextAreaElement>)
      })

      expect(result.current.isFocused).toBe(true)
    })

    it('should set isFocused to false on blur', () => {
      const { result } = renderHook(() => useTextareaController({}))

      act(() => {
        result.current.handleFocus({} as React.FocusEvent<HTMLTextAreaElement>)
      })

      expect(result.current.isFocused).toBe(true)

      act(() => {
        result.current.handleBlur({} as React.FocusEvent<HTMLTextAreaElement>)
      })

      expect(result.current.isFocused).toBe(false)
    })

    it('should call custom onFocus handler', () => {
      const mockOnFocus = vi.fn()
      const { result } = renderHook(() =>
        useTextareaController({ onFocus: mockOnFocus })
      )

      const event = {} as React.FocusEvent<HTMLTextAreaElement>

      act(() => {
        result.current.handleFocus(event)
      })

      expect(mockOnFocus).toHaveBeenCalledWith(event)
    })

    it('should call custom onBlur handler', () => {
      const mockOnBlur = vi.fn()
      const { result } = renderHook(() =>
        useTextareaController({ onBlur: mockOnBlur })
      )

      const event = {} as React.FocusEvent<HTMLTextAreaElement>

      act(() => {
        result.current.handleBlur(event)
      })

      expect(mockOnBlur).toHaveBeenCalledWith(event)
    })
  })

  describe('Hover State Management', () => {
    it('should set isHovered to true on mouse enter', () => {
      const { result } = renderHook(() => useTextareaController({}))

      expect(result.current.isHovered).toBe(false)

      act(() => {
        result.current.handleMouseEnter()
      })

      expect(result.current.isHovered).toBe(true)
    })

    it('should set isHovered to false on mouse leave', () => {
      const { result } = renderHook(() => useTextareaController({}))

      act(() => {
        result.current.handleMouseEnter()
      })

      expect(result.current.isHovered).toBe(true)

      act(() => {
        result.current.handleMouseLeave()
      })

      expect(result.current.isHovered).toBe(false)
    })
  })

  describe('ARIA Attributes', () => {
    it('should include aria-invalid when hasError is true', () => {
      const { result } = renderHook(() =>
        useTextareaController({ error: 'Error' })
      )

      expect(result.current.ariaProps['aria-invalid']).toBe(true)
    })

    it('should not include aria-invalid when hasError is false', () => {
      const { result } = renderHook(() => useTextareaController({}))

      expect(result.current.ariaProps['aria-invalid']).toBeUndefined()
    })

    it('should include aria-describedby with errorId when error exists', () => {
      const { result } = renderHook(() =>
        useTextareaController({
          id: 'test-textarea',
          error: 'Error message',
        })
      )

      const ariaDescribedBy = result.current.ariaProps['aria-describedby']
      expect(ariaDescribedBy).toContain('test-textarea-error')
    })

    it('should include aria-describedby with helpTextId when helpText exists', () => {
      const { result } = renderHook(() =>
        useTextareaController({
          id: 'test-textarea',
          helpText: 'Help text',
        })
      )

      const ariaDescribedBy = result.current.ariaProps['aria-describedby']
      expect(ariaDescribedBy).toContain('test-textarea-help')
    })

    it('should include both errorId and helpTextId in aria-describedby when both exist', () => {
      const { result } = renderHook(() =>
        useTextareaController({
          id: 'test-textarea',
          error: 'Error',
          helpText: 'Help',
        })
      )

      const ariaDescribedBy = result.current.ariaProps['aria-describedby']
      expect(ariaDescribedBy).toContain('test-textarea-error')
      expect(ariaDescribedBy).toContain('test-textarea-help')
    })

    it('should not include aria-describedby when no error or helpText', () => {
      const { result } = renderHook(() => useTextareaController({}))

      expect(result.current.ariaProps['aria-describedby']).toBeUndefined()
    })
  })
})
