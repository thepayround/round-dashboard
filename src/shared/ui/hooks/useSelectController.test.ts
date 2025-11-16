/**
 * Tests for useSelectController
 *
 * Tests cover:
 * - ID generation and management
 * - Error state handling
 * - Help text management
 * - ARIA attributes
 */
import { renderHook } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { useSelectController } from './useSelectController'

describe('useSelectController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initialization', () => {
    it('should use provided id when given', () => {
      const { result } = renderHook(() =>
        useSelectController({ id: 'custom-select-id' })
      )

      expect(result.current.selectId).toBe('custom-select-id')
    })

    it('should generate unique id when not provided', () => {
      const { result: result1 } = renderHook(() => useSelectController({}))
      const { result: result2 } = renderHook(() => useSelectController({}))

      expect(result1.current.selectId).toBeDefined()
      expect(result2.current.selectId).toBeDefined()
      expect(result1.current.selectId).not.toBe(result2.current.selectId)
      expect(result1.current.selectId).toMatch(/^select-/)
      expect(result2.current.selectId).toMatch(/^select-/)
    })

    it('should initialize with hasError false when no error provided', () => {
      const { result } = renderHook(() => useSelectController({}))

      expect(result.current.hasError).toBe(false)
    })

    it('should initialize with hasError true when error provided', () => {
      const { result } = renderHook(() =>
        useSelectController({ error: 'Selection required' })
      )

      expect(result.current.hasError).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should generate errorId based on selectId', () => {
      const { result } = renderHook(() =>
        useSelectController({
          id: 'test-select',
          error: 'Invalid selection',
        })
      )

      expect(result.current.errorId).toBe('test-select-error')
    })

    it('should set hasError to true when error is non-empty string', () => {
      const { result } = renderHook(() =>
        useSelectController({ error: 'Error message' })
      )

      expect(result.current.hasError).toBe(true)
    })

    it('should set hasError to false when error is empty string', () => {
      const { result } = renderHook(() =>
        useSelectController({ error: '' })
      )

      expect(result.current.hasError).toBe(false)
    })

    it('should set hasError to false when error is undefined', () => {
      const { result } = renderHook(() =>
        useSelectController({ error: undefined })
      )

      expect(result.current.hasError).toBe(false)
    })

    it('should update hasError when error prop changes', () => {
      const { result, rerender } = renderHook(
        ({ error }: { error?: string }) => useSelectController({ error }),
        { initialProps: {} }
      )

      expect(result.current.hasError).toBe(false)

      rerender({ error: 'Now has error' })
      expect(result.current.hasError).toBe(true)

      rerender({ error: '' })
      expect(result.current.hasError).toBe(false)
    })
  })

  describe('Help Text Handling', () => {
    it('should generate helpTextId based on selectId', () => {
      const { result } = renderHook(() =>
        useSelectController({
          id: 'test-select',
          helpText: 'Choose an option',
        })
      )

      expect(result.current.helpTextId).toBe('test-select-help')
    })

    it('should not generate helpTextId without helpText', () => {
      const { result } = renderHook(() =>
        useSelectController({ id: 'test-select' })
      )

      // ID should only be generated when helpText is provided
      expect(result.current.helpTextId).toBeUndefined()
    })
  })

  describe('ARIA Attributes', () => {
    it('should include aria-invalid when hasError is true', () => {
      const { result } = renderHook(() =>
        useSelectController({ error: 'Error' })
      )

      expect(result.current.ariaProps['aria-invalid']).toBe(true)
    })

    it('should not include aria-invalid when hasError is false', () => {
      const { result } = renderHook(() => useSelectController({}))

      expect(result.current.ariaProps['aria-invalid']).toBeUndefined()
    })

    it('should include aria-describedby with errorId when error exists', () => {
      const { result } = renderHook(() =>
        useSelectController({
          id: 'test-select',
          error: 'Error message',
        })
      )

      expect(result.current.ariaProps['aria-describedby']).toContain('test-select-error')
    })

    it('should include aria-describedby with helpTextId when helpText exists', () => {
      const { result } = renderHook(() =>
        useSelectController({
          id: 'test-select',
          helpText: 'Help message',
        })
      )

      expect(result.current.ariaProps['aria-describedby']).toContain('test-select-help')
    })

    it('should include both errorId and helpTextId in aria-describedby when both exist', () => {
      const { result } = renderHook(() =>
        useSelectController({
          id: 'test-select',
          error: 'Error',
          helpText: 'Help',
        })
      )

      const ariaDescribedBy = result.current.ariaProps['aria-describedby']
      expect(ariaDescribedBy).toContain('test-select-error')
      expect(ariaDescribedBy).toContain('test-select-help')
    })

    it('should not include aria-describedby when neither error nor helpText exist', () => {
      const { result } = renderHook(() =>
        useSelectController({ id: 'test-select' })
      )

      expect(result.current.ariaProps['aria-describedby']).toBeUndefined()
    })
  })

  describe('Prop Updates', () => {
    it('should update ariaProps when error changes', () => {
      const { result, rerender } = renderHook(
        ({ error }: { error?: string }) =>
          useSelectController({ id: 'test', error }),
        { initialProps: {} }
      )

      expect(result.current.ariaProps['aria-invalid']).toBeUndefined()

      rerender({ error: 'New error' })

      expect(result.current.ariaProps['aria-invalid']).toBe(true)
      expect(result.current.ariaProps['aria-describedby']).toContain('test-error')
    })

    it('should update ariaProps when helpText changes', () => {
      const { result, rerender } = renderHook(
        ({ helpText }: { helpText?: string }) =>
          useSelectController({ id: 'test', helpText }),
        { initialProps: {} }
      )

      expect(result.current.ariaProps['aria-describedby']).toBeUndefined()

      rerender({ helpText: 'New help text' })

      expect(result.current.ariaProps['aria-describedby']).toContain('test-help')
    })

    it('should maintain selectId across re-renders', () => {
      const { result, rerender } = renderHook(() =>
        useSelectController({ id: 'stable-id' })
      )

      const originalId = result.current.selectId

      rerender()

      expect(result.current.selectId).toBe(originalId)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty string error as no error', () => {
      const { result } = renderHook(() =>
        useSelectController({ error: '' })
      )

      expect(result.current.hasError).toBe(false)
      expect(result.current.ariaProps['aria-invalid']).toBeUndefined()
    })

    it('should handle whitespace-only error as valid error', () => {
      const { result } = renderHook(() =>
        useSelectController({ error: '   ' })
      )

      // Whitespace string is truthy, so it's an error
      expect(result.current.hasError).toBe(true)
      expect(result.current.ariaProps['aria-invalid']).toBe(true)
    })

    it('should handle null error gracefully', () => {
      const { result } = renderHook(() =>
        useSelectController({ error: null as unknown as string })
      )

      expect(result.current.hasError).toBe(false)
    })

    it('should generate different IDs for multiple instances', () => {
      const hooks = Array.from({ length: 5 }, () =>
        renderHook(() => useSelectController({}))
      )

      const ids = hooks.map((h) => h.result.current.selectId)
      const uniqueIds = new Set(ids)

      expect(uniqueIds.size).toBe(5) // All IDs should be unique
    })
  })

  describe('ID Format', () => {
    it('should use custom ID exactly as provided', () => {
      const customIds = [
        'my-select',
        'select_123',
        'formField.select',
        'UPPERCASE_SELECT',
      ]

      customIds.forEach((customId) => {
        const { result } = renderHook(() =>
          useSelectController({ id: customId })
        )
        expect(result.current.selectId).toBe(customId)
      })
    })

    it('should generate IDs with consistent prefix', () => {
      const { result } = renderHook(() => useSelectController({}))

      // React's useId generates IDs like ':r8:' which become 'select-r8' after removing colons
      expect(result.current.selectId).toMatch(/^select-[a-z0-9]+$/)
    })
  })
})
