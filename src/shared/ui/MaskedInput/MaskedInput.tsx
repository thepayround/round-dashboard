/**
 * MaskedInput Component
 *
 * An input component with automatic formatting/masking for common patterns
 * like phone numbers, credit cards, SSN, etc.
 *
 * @example
 * ```tsx
 * <MaskedInput
 *   label="Phone Number"
 *   mask="phone"
 *   value={phone}
 *   onChange={setPhone}
 * />
 * ```
 */
import type { LucideIcon } from 'lucide-react'
import { CreditCard, Phone, Hash } from 'lucide-react'
import React, { useCallback } from 'react'

import { Input } from '../Input'

export type MaskType = 'phone' | 'creditCard' | 'ssn' | 'zipCode' | 'custom'

export interface MaskedInputProps {
  /** Mask type or custom mask pattern */
  mask: MaskType | string
  /** Current value (unmasked) */
  value?: string
  /** Change handler (receives unmasked value) */
  onChange?: (value: string) => void
  /** Label text */
  label?: string
  /** Placeholder text */
  placeholder?: string
  /** Error message */
  error?: string
  /** Helper text */
  helperText?: string
  /** Required field */
  required?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Container class name */
  containerClassName?: string
  /** Input ID */
  id?: string
}

// Mask patterns
const masks = {
  phone: '(###) ###-####',
  creditCard: '#### #### #### ####',
  ssn: '###-##-####',
  zipCode: '#####',
}

// Icons for common masks
const maskIcons: Record<string, LucideIcon> = {
  phone: Phone,
  creditCard: CreditCard,
  ssn: Hash,
  zipCode: Hash,
}

/**
 * Apply mask to value
 */
function applyMask(value: string, mask: string): string {
  if (!value) return ''
  
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '')
  
  let masked = ''
  let digitIndex = 0
  
  for (let i = 0; i < mask.length && digitIndex < digits.length; i++) {
    if (mask[i] === '#') {
      masked += digits[digitIndex]
      digitIndex++
    } else {
      masked += mask[i]
    }
  }
  
  return masked
}

/**
 * Remove mask from value (get raw digits)
 */
function removeMask(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Get placeholder from mask pattern
 */
function getPlaceholderFromMask(mask: string): string {
  return mask.replace(/#/g, '0')
}

export const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  (
    {
      mask,
      value = '',
      onChange,
      label,
      placeholder,
      error,
      helperText,
      required,
      disabled,
      containerClassName,
      id,
    },
    ref
  ) => {
    // Get mask pattern
    const maskPattern = typeof mask === 'string' && mask in masks
      ? masks[mask as keyof typeof masks]
      : typeof mask === 'string'
      ? mask
      : ''

    // Get icon for predefined masks
    const Icon = typeof mask === 'string' && mask in maskIcons ? maskIcons[mask] : undefined

    // Get placeholder
    const effectivePlaceholder = placeholder || (maskPattern ? getPlaceholderFromMask(maskPattern) : '')

    // Apply mask to current value
    const maskedValue = value ? applyMask(value, maskPattern) : ''

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      
      // Remove mask to get raw value
      const unmasked = removeMask(inputValue)
      
      // Call onChange with unmasked value
      onChange?.(unmasked)
    }, [onChange])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow: backspace, delete, tab, escape, enter
      if (
        [8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        ((e.keyCode === 65 || e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 88) && (e.ctrlKey || e.metaKey))
      ) {
        return
      }
      
      // Ensure that it's a number
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault()
      }
    }

    return (
      <Input
        ref={ref}
        id={id}
        type="tel" // Use tel type to get numeric keyboard on mobile
        value={maskedValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        label={label}
        placeholder={effectivePlaceholder}
        error={error}
        helperText={helperText}
        required={required}
        disabled={disabled}
        leftIcon={Icon}
        containerClassName={containerClassName}
        autoComplete="off"
      />
    )
  }
)

MaskedInput.displayName = 'MaskedInput'

