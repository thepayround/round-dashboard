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
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-normal text-white/80 mb-3">
          {label}
          {required && <span className="text-[#D417C8] ml-1">*</span>}
        </label>
      )}

      <RadioGroupPrimitive.Root
        value={value}
        onValueChange={onValueChange}
        orientation={orientation}
        className={cn(
          orientation === 'horizontal' ? 'flex space-x-3' : 'space-y-3'
        )}
      >
        {options.map((option) => (
          <div
            key={option.value}
            className={cn(
              'flex items-center p-4 rounded-xl border transition-all cursor-pointer',
              value === option.value
                ? 'border-primary bg-primary/10'
                : 'border-white/20 hover:border-white/40',
              option.disabled ? 'opacity-50 cursor-not-allowed' : ''
            )}
          >
            <RadioGroupPrimitive.Item
              value={option.value}
              id={option.value}
              disabled={option.disabled}
              className="flex-shrink-0 h-5 w-5 rounded-full border border-white/40 bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <RadioGroupPrimitive.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-3 after:h-3 after:rounded-full after:bg-primary" />
            </RadioGroupPrimitive.Item>

            <label
              htmlFor={option.value}
              className="ml-3 flex-1 cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                {option.icon && <option.icon className="h-5 w-5 text-primary" />}
                <div>
                  <div className="text-white font-medium">{option.label}</div>
                  {option.description && (
                    <div className="text-sm text-white/60">{option.description}</div>
                  )}
                </div>
              </div>
            </label>
          </div>
        ))}
      </RadioGroupPrimitive.Root>

      {error && (
        <p className="mt-2 text-sm text-[#D417C8]">{error}</p>
      )}
    </div>
  )
}

