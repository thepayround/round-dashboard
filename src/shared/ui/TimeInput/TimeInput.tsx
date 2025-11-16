/**
 * TimeInput Component
 *
 * A time input component with clock icon and proper formatting.
 * Supports 12/24 hour format based on browser locale.
 *
 * @example
 * ```tsx
 * <TimeInput
 *   label="Meeting Time"
 *   value={time}
 *   onChange={setTime}
 * />
 * ```
 */
import { Clock } from 'lucide-react'
import React from 'react'

import { Input } from '../Input'

import { cn } from '@/shared/utils/cn'

export interface TimeInputProps {
  /** Current value (HH:MM format) */
  value?: string
  /** Change handler */
  onChange?: (value: string) => void
  /** Label text */
  label?: string
  /** Minimum time (HH:MM) */
  min?: string
  /** Maximum time (HH:MM) */
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

export const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  (
    {
      value,
      onChange,
      label,
      min,
      max,
      placeholder = 'HH:MM',
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
          type="time"
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
          leftIcon={Clock}
        />
      </div>
    )
  }
)

TimeInput.displayName = 'TimeInput'

