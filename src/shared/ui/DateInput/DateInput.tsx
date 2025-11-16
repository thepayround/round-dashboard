/**
 * DateInput Component
 *
 * A date input component with calendar icon and proper formatting.
 * Supports min/max dates and validation.
 *
 * @example
 * ```tsx
 * <DateInput
 *   label="Start Date"
 *   value={startDate}
 *   onChange={setStartDate}
 *   min="2024-01-01"
 *   max="2025-12-31"
 * />
 * ```
 */
import { Calendar } from 'lucide-react'
import React from 'react'

import { Input } from '../Input'

import { cn } from '@/shared/utils/cn'

export interface DateInputProps {
  /** Current value (YYYY-MM-DD format) */
  value?: string
  /** Change handler */
  onChange?: (value: string) => void
  /** Label text */
  label?: string
  /** Minimum date (YYYY-MM-DD) */
  min?: string
  /** Maximum date (YYYY-MM-DD) */
  max?: string
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

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      value,
      onChange,
      label,
      min,
      max,
      placeholder = 'MM/DD/YYYY',
      error,
      helperText,
      required,
      disabled,
      containerClassName,
      id,
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value)
    }

    return (
      <div className={cn(containerClassName)}>
        <Input
          ref={ref}
          id={id}
          type="date"
          value={value}
          onChange={handleChange}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          leftIcon={Calendar}
        />
      </div>
    )
  }
)

DateInput.displayName = 'DateInput'

