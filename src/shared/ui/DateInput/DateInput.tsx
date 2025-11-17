/**
 * DateInput Component
 *
 * A specialized input component for date selection with calendar icon
 * and proper validation. Uses native date picker for MVP.
 *
 * @example
 * ```tsx
 * <DateInput
 *   label="Start Date"
 *   value={startDate}
 *   onChange={setStartDate}
 *   min={new Date()}
 * />
 * ```
 */
import { Calendar } from 'lucide-react'
import React from 'react'

import { Input, type InputProps } from '../Input'

export interface DateInputProps extends Omit<InputProps, 'value' | 'onChange' | 'type' | 'min' | 'max'> {
  /** Current date value (Date object or ISO string) */
  value?: Date | string | null
  /** Callback when date changes */
  onChange?: (date: Date | undefined) => void
  /** Minimum allowed date */
  min?: Date | string
  /** Maximum allowed date */
  max?: Date | string
  /** Show calendar icon (default: true) */
  showCalendarIcon?: boolean
}

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      value,
      onChange,
      min,
      max,
      showCalendarIcon = true,
      placeholder = 'Select date',
      ...inputProps
    },
    ref
  ) => {
    // Convert Date to YYYY-MM-DD format
    const toDateString = (date: Date | string | null | undefined): string => {
      if (!date) return ''
      const d = date instanceof Date ? date : new Date(date)
      if (isNaN(d.getTime())) return ''
      return d.toISOString().split('T')[0]
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const dateValue = e.target.value
      if (dateValue === '') {
        onChange?.(undefined)
      } else {
        const date = new Date(dateValue + 'T00:00:00')
        if (!isNaN(date.getTime())) {
          onChange?.(date)
        }
      }
    }

    return (
      <Input
        {...inputProps}
        ref={ref}
        type="date"
        value={toDateString(value)}
        onChange={handleChange}
        min={toDateString(min)}
        max={toDateString(max)}
        leftIcon={showCalendarIcon ? Calendar : undefined}
        placeholder={placeholder}
      />
    )
  }
)

DateInput.displayName = 'DateInput'
