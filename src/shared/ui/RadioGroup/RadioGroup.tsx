import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import React from 'react'

import { cn } from '@/shared/utils/cn'

export interface RadioOption {
  value: string
  label: string
  description?: string
  icon?: React.ElementType
  disabled?: boolean
}

export interface RadioGroupProps {
  /** Radio options */
  options: RadioOption[]
  /** Current value */
  value?: string
  /** Callback when value changes */
  onValueChange: (value: string) => void
  /** Label for the group */
  label?: string
  /** Error message */
  error?: string
  /** Layout direction */
  orientation?: 'horizontal' | 'vertical'
  /** Required field */
  required?: boolean
  /** Container class name */
  className?: string
}

/**
 * RadioGroup Component
 * 
 * A reusable radio group component with glassmorphism styling and full accessibility support.
 * Built on Radix UI primitives for robust keyboard navigation and screen reader support.
 * 
 * @example
 * ```tsx
 * <RadioGroup
 *   label="Payment Method"
 *   options={[
 *     { value: 'card', label: 'Credit Card', icon: CreditCard },
 *     { value: 'bank', label: 'Bank Transfer', icon: Building, description: 'Takes 2-3 days' }
 *   ]}
 *   value={paymentMethod}
 *   onValueChange={setPaymentMethod}
 *   required
 * />
 * ```
 * 
 * @accessibility
 * - Full ARIA support (role="radiogroup", aria-required, aria-invalid)
 * - Keyboard navigation (Arrow keys, Space, Tab)
 * - Screen reader friendly with proper labels and descriptions
 * - Focus visible indicators for keyboard users
 * - Error announcements with aria-describedby
 */
export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onValueChange,
  label,
  error,
  orientation = 'vertical',
  required,
  className,
}) => {
  const generatedErrorId = React.useId()
  const generatedLabelId = React.useId()
  const errorId = error ? `radio-error-${generatedErrorId}` : undefined
  const labelId = label ? `radio-label-${generatedLabelId}` : undefined

  return (
    <div className={className}>
      {label && (
        <label
          id={labelId}
          className="block text-sm font-normal tracking-tight text-fg-muted mb-4"
        >
          {label}
          {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
        </label>
      )}

      <RadioGroupPrimitive.Root
        value={value}
        onValueChange={onValueChange}
        orientation={orientation}
        aria-labelledby={labelId}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={cn(
          orientation === 'horizontal' ? 'flex space-x-3' : 'space-y-4'
        )}
        role="radiogroup"
      >
        {options.map((option) => {
          const isSelected = value === option.value
          const optionDescId = option.description ? `radio-desc-${option.value}` : undefined

          const Icon = option.icon

          return (
            <div
              key={option.value}
              className={cn(
                'flex items-center p-4 min-h-[44px] rounded-xl border transition-all duration-200 cursor-pointer',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-border-hover hover:bg-bg-hover',
                option.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
              )}
              onClick={() => !option.disabled && onValueChange(option.value)}
              role="presentation"
            >
              <RadioGroupPrimitive.Item
                value={option.value}
                id={option.value}
                disabled={option.disabled}
                aria-describedby={optionDescId}
                className="flex-shrink-0 h-5 w-5 rounded-full border border-border bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-all data-[state=checked]:border-primary data-[state=checked]:text-primary"
              >
                <RadioGroupPrimitive.Indicator className="flex items-center justify-center w-full h-full">
                  <span className="block w-2.5 h-2.5 rounded-full bg-current" />
                </RadioGroupPrimitive.Indicator>
              </RadioGroupPrimitive.Item>

              <label
                htmlFor={option.value}
                className="ml-3 flex-1 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  {Icon && (
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isSelected ? "text-primary" : "text-fg-muted"
                      )}
                      aria-hidden="true"
                    />
                  )}
                  <div>
                    <div className={cn("font-medium tracking-tight transition-colors", isSelected ? "text-fg" : "text-fg")}>{option.label}</div>
                    {option.description && (
                      <div
                        id={optionDescId}
                        className="text-sm text-fg-muted mt-0.5"
                      >
                        {option.description}
                      </div>
                    )}
                  </div>
                </div>
              </label>
            </div>
          )
        })}
      </RadioGroupPrimitive.Root>

      {error && (
        <p
          id={errorId}
          className="mt-2 text-sm text-destructive"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  )
}

