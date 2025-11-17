/**
 * NumberInput Component
 *
 * A specialized input component for numeric values with formatting,
 * validation, and optional increment/decrement controls.
 *
 * @example
 * ```tsx
 * <NumberInput
 *   label="Price"
 *   value={price}
 *   onChange={setPrice}
 *   min={0}
 *   precision={2}
 *   formatThousands
 *   showControls
 * />
 * ```
 */
import { Minus, Plus } from 'lucide-react'
import React, { useState, useEffect, useCallback } from 'react'

import { IconButton } from '../Button'
import { Input, type InputProps } from '../Input'

export interface NumberInputProps extends Omit<InputProps, 'value' | 'onChange' | 'type'> {
  /** Current numeric value */
  value?: number
  /** Callback when value changes */
  onChange?: (value: number | undefined) => void
  /** Minimum allowed value */
  min?: number
  /** Maximum allowed value */
  max?: number
  /** Increment/decrement step (default: 1) */
  step?: number
  /** Number of decimal places (default: 0) */
  precision?: number
  /** Show increment/decrement buttons (default: false) */
  showControls?: boolean
  /** Allow negative numbers (default: true) */
  allowNegative?: boolean
  /** Format with thousands separators (default: false) */
  formatThousands?: boolean
  /** Show clear button when input has value (default: false) */
  showClearButton?: boolean
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value,
      onChange,
      min,
      max,
      step = 1,
      precision = 0,
      showControls = false,
      allowNegative = true,
      formatThousands = false,
      showClearButton = false,
      disabled,
      className,
      ...inputProps
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState('')

    // Format number for display
    const formatNumber = useCallback((num: number): string => {
      const formatted = num.toFixed(precision)
      if (formatThousands) {
        const [int, dec] = formatted.split('.')
        // eslint-disable-next-line security/detect-unsafe-regex
        const withCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        return dec !== undefined ? `${withCommas}.${dec}` : withCommas
      }
      return formatted
    }, [precision, formatThousands])

    // Parse display value to number
    const parseNumber = (str: string): number | undefined => {
      if (str === '' || str === '-') return undefined
      const cleaned = str.replace(/,/g, '')
      const parsed = parseFloat(cleaned)
      return isNaN(parsed) ? undefined : parsed
    }

    // Clamp value to min/max bounds
    const clampValue = (num: number): number => {
      let clamped = num
      if (min !== undefined) clamped = Math.max(min, clamped)
      if (max !== undefined) clamped = Math.min(max, clamped)
      if (!allowNegative && clamped < 0) clamped = 0
      // Round to precision
      const multiplier = Math.pow(10, precision)
      return Math.round(clamped * multiplier) / multiplier
    }

    // Update display when value changes
    useEffect(() => {
      if (value !== undefined) {
        setDisplayValue(formatNumber(value))
      } else {
        setDisplayValue('')
      }
    }, [value, formatNumber])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value

      // Allow typing negative sign
      if (newValue === '-' && allowNegative) {
        setDisplayValue('-')
        return
      }

      // Allow empty string
      if (newValue === '') {
        setDisplayValue('')
        onChange?.(undefined)
        return
      }

      // Only allow valid number characters
      const validChars = /^-?[\d,]*\.?\d*$/
      if (!validChars.test(newValue)) {
        return
      }

      setDisplayValue(newValue)

      const parsed = parseNumber(newValue)
      if (parsed !== undefined) {
        const clamped = clampValue(parsed)
        onChange?.(clamped)
      }
    }

    const handleBlur = () => {
      // Format on blur
      if (value !== undefined) {
        setDisplayValue(formatNumber(value))
      }
    }

    const increment = () => {
      const current = value ?? 0
      const newValue = clampValue(current + step)
      onChange?.(newValue)
    }

    const decrement = () => {
      const current = value ?? 0
      const newValue = clampValue(current - step)
      onChange?.(newValue)
    }

    const handleClear = () => {
      onChange?.(undefined)
    }

    const canIncrement = max === undefined || (value ?? 0) < max
    const canDecrement = min === undefined || (value ?? 0) > min

    return (
      <div className="relative">
        <Input
          {...inputProps}
          ref={ref}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          className={className}
        />

        {/* Controls Container */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {/* Clear Button */}
          {showClearButton && value !== undefined && !disabled && (
            <IconButton
              icon={Minus}
              size="sm"
              variant="ghost"
              onClick={handleClear}
              aria-label="Clear value"
              className="w-6 h-6 lg:w-5 lg:h-5 p-0"
              tabIndex={-1}
            />
          )}

          {/* Increment/Decrement Controls */}
          {showControls && (
            <>
              <IconButton
                icon={Minus}
                size="sm"
                variant="ghost"
                onClick={decrement}
                disabled={disabled || !canDecrement}
                aria-label="Decrease value"
                className="w-6 h-6 lg:w-5 lg:h-5 p-0"
                tabIndex={-1}
              />
              <IconButton
                icon={Plus}
                size="sm"
                variant="ghost"
                onClick={increment}
                disabled={disabled || !canIncrement}
                aria-label="Increase value"
                className="w-6 h-6 lg:w-5 lg:h-5 p-0"
                tabIndex={-1}
              />
            </>
          )}
        </div>
      </div>
    )
  }
)

NumberInput.displayName = 'NumberInput'
