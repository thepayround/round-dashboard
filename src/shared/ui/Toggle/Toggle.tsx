import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'

import { cn } from '@/shared/utils/cn'

const toggleContainerVariants = cva(
  'inline-flex items-center rounded-full transition-all peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2 peer-focus:ring-offset-bg peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
  {
    variants: {
      size: {
        sm: 'w-9 h-5',
        lg: 'w-11 h-6',
      },
      color: {
        cyan: 'bg-input peer-checked:bg-primary',
        green: 'bg-input peer-checked:bg-success',
        blue: 'bg-input peer-checked:bg-primary',
        primary: 'bg-input peer-checked:bg-primary',
      },
    },
    defaultVariants: {
      size: 'lg',
      color: 'primary',
    },
  }
)

const toggleButtonVariants = cva(
  "absolute top-[2px] left-[2px] bg-white rounded-full transition-all peer-checked:border-white",
  {
    variants: {
      size: {
        sm: 'h-4 w-4 border border-gray-300 peer-checked:translate-x-3',
        lg: 'h-5 w-5 peer-checked:translate-x-full',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
)

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Label text */
  label?: string
  /** Description text shown below the label */
  description?: string
  /** Size variant */
  size?: 'sm' | 'lg'
  /** Color variant */
  color?: 'cyan' | 'green' | 'blue' | 'primary'
  /** Checked state */
  checked?: boolean
  /** Callback when toggle state changes */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  /** Container class name */
  containerClassName?: string
  /** Label class name */
  labelClassName?: string
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      label,
      description,
      size = 'lg',
      color = 'cyan',
      checked,
      onChange,
      disabled,
      className,
      containerClassName,
      labelClassName,
      id,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`
    const hasTextContent = Boolean(label && label.trim().length > 0) || Boolean(description)

    return (
      <div className={cn('flex items-center', containerClassName)}>
        <label
          htmlFor={toggleId}
          className={cn(
            'flex items-center cursor-pointer min-h-[44px] lg:min-h-0',
            hasTextContent && 'space-x-3',
            disabled && 'opacity-50 cursor-not-allowed',
            labelClassName
          )}
        >
          {hasTextContent && (
            <div className="flex flex-col">
              {label && label.trim().length > 0 && (
                <span className="text-sm text-fg">{label}</span>
              )}
              {description && <span className="text-xs text-fg-muted">{description}</span>}
            </div>
          )}
          <div className="relative inline-flex items-center min-w-[44px] min-h-[44px] justify-center lg:min-w-0 lg:min-h-0">
            <input
              ref={ref}
              id={toggleId}
              type="checkbox"
              checked={checked}
              onChange={onChange}
              disabled={disabled}
              className={cn('sr-only peer', className)}
              aria-label={ariaLabel ?? (label && label.trim().length > 0 ? label : description)}
              {...props}
            />
            <div
              aria-hidden="true"
              className={cn(
                'pointer-events-none',
                toggleContainerVariants({ size, color })
              )}
            />
            <div
              aria-hidden="true"
              className={cn(
                'pointer-events-none z-10',
                toggleButtonVariants({ size })
              )}
            />
          </div>
        </label>
      </div>
    )
  }
)

Toggle.displayName = 'Toggle'

export type { VariantProps }
