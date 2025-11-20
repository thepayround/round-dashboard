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
          className="block text-sm font-normal tracking-tight text-white/80 mb-3"
        >
          {label}
          {required && <span className="text-primary ml-1" aria-label="required">*</span>}
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
          orientation === 'horizontal' ? 'flex space-x-3' : 'space-y-3'
        )}
        role="radiogroup"
      >
        {options.map((option) => {
          const isSelected = value === option.value
          const optionDescId = option.description ? `radio-desc-${option.value}` : undefined

          return (
            <div
              key={option.value}
              className={cn(
                'flex items-center p-4 min-h-[44px] rounded-lg border transition-all duration-200 cursor-pointer',
                isSelected
                  ? 'border-[#14BDEA] bg-[#14BDEA]/10'
                  : 'border-white/10 hover:border-white/20',
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
                className="flex-shrink-0 h-5 w-5 rounded-full border border-white/40 bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14BDEA] focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-all"
              >
                <RadioGroupPrimitive.Indicator className="flex items-center justify-center w-full h-full">
                  <span className="block w-3 h-3 rounded-full bg-[#14BDEA]" />
                </RadioGroupPrimitive.Indicator>
              </RadioGroupPrimitive.Item>

              <label
                htmlFor={option.value}
                className="ml-3 flex-1 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  {option.icon && (
                    <option.icon 
                      className="h-5 w-5 text-[#14BDEA]" 
                      aria-hidden="true"
                    />
                  )}
                  <div>
                    <div className="text-white font-medium tracking-tight">{option.label}</div>
                    {option.description && (
                      <div 
                        id={optionDescId}
                        className="text-sm text-white/60 mt-0.5"
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
          className="mt-2 text-sm text-primary"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  )
}

