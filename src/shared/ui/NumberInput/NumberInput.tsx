/**
 * NumberInput Component
 *
 * An enhanced number input with increment/decrement buttons, min/max constraints,
 * and keyboard support (Arrow Up/Down).
 *
 * @example
 * ```tsx
 * <NumberInput
 *   label="Quantity"
 *   value={quantity}
 *   onChange={setQuantity}
 *   min={1}
 *   max={100}
 *   step={1}
 * />
 * ```
 */
import { Plus, Minus } from 'lucide-react'
import React, { useCallback } from 'react'

import { IconButton } from '../Button'
import { Input } from '../Input'

import { cn } from '@/shared/utils/cn'

export interface NumberInputProps {
  /** Current value */
  value?: number | string
  /** Change handler */
  onChange?: (value: number) => void
  /** Label text */
  label?: string
  /** Minimum value */
  min?: number
  /** Maximum value */
  max?: number
  /** Step increment */
  step?: number
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
  /** Show increment/decrement buttons */
  showButtons?: boolean
  /** Input ID */
  id?: string
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value = '',
      onChange,
      label,
      min,
      max,
      step = 1,
      placeholder,
      error,
      helperText,
      required,
      disabled,
      containerClassName,
      showButtons = true,
      id,
    },
    ref
  ) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value

    const handleIncrement = useCallback(() => {
      if (disabled) return
      let newValue = numericValue + step
      if (max !== undefined) newValue = Math.min(newValue, max)
      if (min !== undefined) newValue = Math.max(newValue, min)
      onChange?.(newValue)
    }, [numericValue, step, max, min, onChange, disabled])

    const handleDecrement = useCallback(() => {
      if (disabled) return
      let newValue = numericValue - step
      if (min !== undefined) newValue = Math.max(newValue, min)
      if (max !== undefined) newValue = Math.min(newValue, max)
      onChange?.(newValue)
    }, [numericValue, step, min, max, onChange, disabled])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      if (inputValue === '') {
        onChange?.(0)
        return
      }

      let newValue = parseFloat(inputValue)
      if (isNaN(newValue)) return

      if (min !== undefined) newValue = Math.max(newValue, min)
      if (max !== undefined) newValue = Math.min(newValue, max)

      onChange?.(newValue)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        handleIncrement()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        handleDecrement()
      }
    }

    return (
      <div className={cn(containerClassName)}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-normal text-white/90 mb-2 tracking-tight"
          >
            {label}
            {required && <span className="text-[#D417C8] ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <Input
            ref={ref}
            id={id}
            type="number"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            error={error}
            helperText={helperText}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            className={cn(showButtons && 'pr-20')}
          />

          {showButtons && (
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
              <IconButton
                icon={Minus}
                onClick={handleDecrement}
                disabled={disabled || (min !== undefined && numericValue <= min)}
                aria-label="Decrease value"
                size="sm"
                variant="ghost"
                className="h-9 w-9 border border-white/10 hover:border-white/20"
              />
              <IconButton
                icon={Plus}
                onClick={handleIncrement}
                disabled={disabled || (max !== undefined && numericValue >= max)}
                aria-label="Increase value"
                size="sm"
                variant="ghost"
                className="h-9 w-9 border border-white/10 hover:border-white/20"
              />
            </div>
          )}
        </div>
      </div>
    )
  }
)

NumberInput.displayName = 'NumberInput'

