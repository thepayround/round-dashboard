/**
 * Tests for cn utility function
 *
 * The cn function combines clsx and tailwind-merge for className handling
 */

import { describe, it, expect } from 'vitest'

import { cn } from './cn'

describe('cn utility function', () => {
  it('should combine multiple class names', () => {
    const result = cn('class1', 'class2', 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('should handle conditional classes', () => {
    const condition = true
    const result = cn('base-class', condition && 'conditional-class')
    expect(result).toBe('base-class conditional-class')
  })

  it('should filter out false conditions', () => {
    const condition = false
    const result = cn('base-class', condition && 'conditional-class')
    expect(result).toBe('base-class')
  })

  it('should handle undefined and null values', () => {
    const result = cn('base-class', undefined, null, 'valid-class')
    expect(result).toBe('base-class valid-class')
  })

  it('should handle arrays of classes', () => {
    const result = cn(['class1', 'class2'], 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('should handle objects with boolean values', () => {
    const result = cn({
      active: true,
      inactive: false,
      visible: true,
    })
    expect(result).toBe('active visible')
  })

  it('should combine conflicting Tailwind classes (clsx behavior)', () => {
    // clsx combines all classes without merging conflicts
    const result = cn('px-2 px-4', 'py-1 py-2')
    expect(result).toBe('px-2 px-4 py-1 py-2')
  })

  it('should handle complex combinations', () => {
    const isActive = true
    const isDisabled = false
    const size = 'large'

    const result = cn(
      'base-component',
      isActive && 'active',
      isDisabled && 'disabled',
      `size-${size}`,
      {
        'has-focus': true,
        'has-error': false,
      }
    )

    expect(result).toBe('base-component active size-large has-focus')
  })

  it('should handle empty inputs', () => {
    expect(cn()).toBe('')
    expect(cn('')).toBe('')
    expect(cn(null)).toBe('')
    expect(cn(undefined)).toBe('')
  })

  it('should handle Tailwind responsive and state variants', () => {
    const result = cn('text-sm md:text-lg', 'hover:bg-blue-500', 'focus:ring-2 focus:ring-blue-300')
    expect(result).toBe('text-sm md:text-lg hover:bg-blue-500 focus:ring-2 focus:ring-blue-300')
  })
})
