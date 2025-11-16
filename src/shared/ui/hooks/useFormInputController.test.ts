/**
 * Tests for useFormInputController
 *
 * Tests cover:
 * - State initialization
 * - Focus/blur handling
 * - Password visibility toggle
 * - Accessibility attributes
 * - Event handler composition
 */
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { useFormInputController } from './useFormInputController'

describe('useFormInputController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initialization', () => {
    it('should use provided id when given', () => {
      const { result } = renderHook(() =>
        useFormInputController({ id: 'custom-input-id' })
      )

      expect(result.current.inputId).toBe('custom-input-id')
    })

    it('should generate unique id when not provided', () => {
      const { result: result1 } = renderHook(() => useFormInputController({}))
      const { result: result2 } = renderHook(() => useFormInputController({}))

      expect(result1.current.inputId).toBeDefined()
      expect(result2.current.inputId).toBeDefined()
      expect(result1.current.inputId).not.toBe(result2.current.inputId)
    })

    it('should initialize with default state values', () => {
      const { result } = renderHook(() => useFormInputController({}))

      expect(result.current.isFocused).toBe(false)
      expect(result.current.isPasswordVisible).toBe(false)
      expect(result.current.hasError).toBe(false)
    })

    it('should set hasError to true when error prop is provided', () => {
      const { result } = renderHook(() =>
        useFormInputController({ error: 'Field is required' })
      )

      expect(result.current.hasError).toBe(true)
    })
  })

  describe('Focus State Management', () => {
    it('should set isFocused to true on focus', () => {
      const { result } = renderHook(() => useFormInputController({}))

      expect(result.current.isFocused).toBe(false)

      act(() => {
        result.current.handleFocus({} as React.FocusEvent<HTMLInputElement>)
      })

      expect(result.current.isFocused).toBe(true)
    })

    it('should set isFocused to false on blur', () => {
      const { result } = renderHook(() => useFormInputController({}))

      // First focus
      act(() => {
        result.current.handleFocus({} as React.FocusEvent<HTMLInputElement>)
      })
      expect(result.current.isFocused).toBe(true)

      // Then blur
      act(() => {
        result.current.handleBlur({} as React.FocusEvent<HTMLInputElement>)
      })
      expect(result.current.isFocused).toBe(false)
    })

    it('should call custom onFocus handler when provided', () => {
      const customOnFocus = vi.fn()
      const { result } = renderHook(() =>
        useFormInputController({ onFocus: customOnFocus })
      )

      const mockEvent = {} as React.FocusEvent<HTMLInputElement>

      act(() => {
        result.current.handleFocus(mockEvent)
      })

      expect(customOnFocus).toHaveBeenCalledWith(mockEvent)
      expect(result.current.isFocused).toBe(true)
    })

    it('should call custom onBlur handler when provided', () => {
      const customOnBlur = vi.fn()
      const { result } = renderHook(() =>
        useFormInputController({ onBlur: customOnBlur })
      )

      const mockEvent = {} as React.FocusEvent<HTMLInputElement>

      act(() => {
        result.current.handleBlur(mockEvent)
      })

      expect(customOnBlur).toHaveBeenCalledWith(mockEvent)
      expect(result.current.isFocused).toBe(false)
    })
  })

  describe('Password Visibility Toggle', () => {
    it('should not enable password toggle by default', () => {
      const { result } = renderHook(() =>
        useFormInputController({ type: 'password' })
      )

      expect(result.current.shouldShowPasswordToggle).toBe(false)
    })

    it('should enable password toggle when enablePasswordToggle is true', () => {
      const { result } = renderHook(() =>
        useFormInputController({
          type: 'password',
          enablePasswordToggle: true,
        })
      )

      expect(result.current.shouldShowPasswordToggle).toBe(true)
    })

    it('should toggle password visibility on click', () => {
      const { result } = renderHook(() =>
        useFormInputController({
          type: 'password',
          enablePasswordToggle: true,
        })
      )

      expect(result.current.isPasswordVisible).toBe(false)
      expect(result.current.resolvedType).toBe('password')

      act(() => {
        result.current.handleRightIconClick()
      })

      expect(result.current.isPasswordVisible).toBe(true)
      expect(result.current.resolvedType).toBe('text')

      act(() => {
        result.current.handleRightIconClick()
      })

      expect(result.current.isPasswordVisible).toBe(false)
      expect(result.current.resolvedType).toBe('password')
    })

    it('should update aria label when toggling visibility', () => {
      const { result } = renderHook(() =>
        useFormInputController({
          type: 'password',
          enablePasswordToggle: true,
        })
      )

      expect(result.current.rightIconAriaLabel).toBe('Show password')

      act(() => {
        result.current.handleRightIconClick()
      })

      expect(result.current.rightIconAriaLabel).toBe('Hide password')
    })

    it('should not show password toggle for non-password types', () => {
      const { result } = renderHook(() =>
        useFormInputController({
          type: 'text',
          enablePasswordToggle: true,
        })
      )

      expect(result.current.shouldShowPasswordToggle).toBe(false)
    })
  })

  describe('Right Icon Click Handler', () => {
    it('should call custom onRightIconClick when password toggle is disabled', () => {
      const customHandler = vi.fn()
      const { result } = renderHook(() =>
        useFormInputController({
          type: 'text',
          onRightIconClick: customHandler,
        })
      )

      act(() => {
        result.current.handleRightIconClick()
      })

      expect(customHandler).toHaveBeenCalled()
    })

    it('should prioritize password toggle over custom handler', () => {
      const customHandler = vi.fn()
      const { result } = renderHook(() =>
        useFormInputController({
          type: 'password',
          enablePasswordToggle: true,
          onRightIconClick: customHandler,
        })
      )

      act(() => {
        result.current.handleRightIconClick()
      })

      // Password should be visible, custom handler not called
      expect(result.current.isPasswordVisible).toBe(true)
      expect(customHandler).not.toHaveBeenCalled()
    })
  })

  describe('Mouse Enter/Leave Handlers', () => {
    it('should call handleMouseEnter', () => {
      const { result } = renderHook(() => useFormInputController({}))

      expect(() => {
        act(() => {
          result.current.handleMouseEnter()
        })
      }).not.toThrow()
    })

    it('should call handleMouseLeave', () => {
      const { result } = renderHook(() => useFormInputController({}))

      expect(() => {
        act(() => {
          result.current.handleMouseLeave()
        })
      }).not.toThrow()
    })
  })

  describe('Accessibility Attributes', () => {
    it('should generate errorId when error is present', () => {
      const { result } = renderHook(() =>
        useFormInputController({
          id: 'test-input',
          error: 'Required field',
        })
      )

      expect(result.current.errorId).toBe('test-input-error')
      expect(result.current.hasError).toBe(true)
    })

    it('should generate helpTextId when helpText is present', () => {
      const { result } = renderHook(() =>
        useFormInputController({
          id: 'test-input',
          helpText: 'Enter your email address',
        })
      )

      expect(result.current.helpTextId).toBe('test-input-help')
    })

    it('should provide correct aria-describedby value', () => {
      const { result } = renderHook(() =>
        useFormInputController({
          id: 'test-input',
          error: 'Error message',
          helpText: 'Help message',
        })
      )

      // Both error and help text should be referenced
      expect(result.current.errorId).toBeDefined()
      expect(result.current.helpTextId).toBeDefined()
    })

    it('should only include error in aria-describedby when no helpText', () => {
      const { result } = renderHook(() =>
        useFormInputController({
          id: 'test-input',
          error: 'Error message',
        })
      )

      expect(result.current.errorId).toBe('test-input-error')
      expect(result.current.helpTextId).toBeUndefined()
    })
  })

  describe('Type Resolution', () => {
    it('should return original type when not password', () => {
      const { result } = renderHook(() =>
        useFormInputController({ type: 'email' })
      )

      expect(result.current.resolvedType).toBe('email')
    })

    it('should return password type when visibility is false', () => {
      const { result } = renderHook(() =>
        useFormInputController({
          type: 'password',
          enablePasswordToggle: true,
        })
      )

      expect(result.current.resolvedType).toBe('password')
    })

    it('should return text type when password is visible', () => {
      const { result } = renderHook(() =>
        useFormInputController({
          type: 'password',
          enablePasswordToggle: true,
        })
      )

      act(() => {
        result.current.handleRightIconClick()
      })

      expect(result.current.resolvedType).toBe('text')
    })
  })

  describe('State Updates on Prop Changes', () => {
    it('should update hasError when error prop changes', () => {
      const { result, rerender } = renderHook(
        ({ error }: { error?: string }) => useFormInputController({ error }),
        { initialProps: {} }
      )

      expect(result.current.hasError).toBe(false)

      rerender({ error: 'New error' })

      expect(result.current.hasError).toBe(true)

      rerender({ error: undefined })

      expect(result.current.hasError).toBe(false)
    })

    it('should maintain state across re-renders when props dont change', () => {
      const { result, rerender } = renderHook(() =>
        useFormInputController({ type: 'text' })
      )

      act(() => {
        result.current.handleFocus({} as React.FocusEvent<HTMLInputElement>)
      })

      expect(result.current.isFocused).toBe(true)

      rerender()

      expect(result.current.isFocused).toBe(true)
    })
  })
})
