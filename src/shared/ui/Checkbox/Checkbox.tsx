import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import React from 'react'

import { cn } from '@/shared/utils/cn'

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'checked'> {
  /** Label text */
  label?: string
  /** Helper text */
  helperText?: string
  /** Error message */
  error?: string
  /** Checked state */
  checked?: boolean | 'indeterminate'
  /** Callback when checked state changes */
  onCheckedChange?: (checked: boolean) => void
  /** Container class name */
  containerClassName?: string
}

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ label, helperText, error, className, containerClassName, id, checked, onCheckedChange, ...props }, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={containerClassName}>
      <div className="flex items-center">
        <CheckboxPrimitive.Root
          ref={ref}
          id={checkboxId}
          checked={checked}
          onCheckedChange={onCheckedChange}
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded border transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black',
            'disabled:cursor-not-allowed disabled:opacity-50',
            checked
              ? 'bg-primary border-primary'
              : 'bg-transparent border-white/20 hover:border-white/40',
            error ? 'border-red-500' : '',
            className
          )}
          {...props}
        >
          <CheckboxPrimitive.Indicator className="text-white">
            {checked === 'indeterminate' && <Minus className="h-3 w-3" />}
            {checked === true && <Check className="h-3 w-3" />}
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        {label && (
          <label
            htmlFor={checkboxId}
            className="ml-3 text-sm font-normal text-white cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>

      {helperText && !error && (
        <p className="mt-2 text-sm text-white/60">{helperText}</p>
      )}

      {error && (
        <p className="mt-2 text-sm text-[#D417C8]">{error}</p>
      )}
    </div>
  )
})

Checkbox.displayName = 'Checkbox'

