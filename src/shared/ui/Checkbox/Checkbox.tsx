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
        <div className="flex items-center justify-center min-w-[44px] min-h-[44px] lg:min-w-0 lg:min-h-0">
          <CheckboxPrimitive.Root
            ref={ref}
            id={checkboxId}
            checked={checked}
            onCheckedChange={onCheckedChange}
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded border transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
              'disabled:cursor-not-allowed disabled:opacity-50',
              checked
                ? 'bg-primary border-primary text-primary-contrast'
                : 'bg-input border-border hover:border-border-hover hover:bg-bg-hover',
              error ? 'border-destructive' : '',
              className
            )}
            {...props}
          >
            <CheckboxPrimitive.Indicator className="text-current">
              {checked === 'indeterminate' && <Minus className="h-3.5 w-3.5" />}
              {checked === true && <Check className="h-3.5 w-3.5" />}
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>
        </div>

        {label && (
          <label
            htmlFor={checkboxId}
            className="ml-3 text-sm font-medium text-fg cursor-pointer select-none min-h-[44px] lg:min-h-0 flex items-center"
          >
            {label}
          </label>
        )}
      </div>

      {helperText && !error && (
        <p className="mt-2 text-sm text-fg-muted">{helperText}</p>
      )}

      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </div>
  )
})

Checkbox.displayName = 'Checkbox'

