import { cva, type VariantProps } from 'class-variance-authority'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import React from 'react'

import { cn } from '@/shared/utils/cn'

const inputVariants = cva(
  'w-full rounded-lg border bg-white/5 text-white placeholder-white/50 transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-11 px-4 text-base',
        lg: 'h-12 px-5 text-lg',
      },
      variant: {
        default: 'border-white/20 focus:border-primary focus:ring-primary/50',
        error: 'border-red-500 focus:border-red-500 focus:ring-red-500/50',
        success: 'border-green-500 focus:border-green-500 focus:ring-green-500/50',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /** Label text displayed above input */
  label?: string
  /** Error message to display below input */
  error?: string
  /** Helper text displayed below input */
  helperText?: string
  /** Icon component to display on the left */
  leftIcon?: React.ElementType
  /** Icon component to display on the right */
  rightIcon?: React.ElementType
  /** Whether field is required (shows * indicator) */
  required?: boolean
  /** Additional container class name */
  containerClassName?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size,
      variant,
      label,
      error,
      helperText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      required,
      containerClassName,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const hasError = Boolean(error)
    const effectiveVariant = hasError ? 'error' : variant

    return (
      <div className={containerClassName}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-normal text-white/80 mb-2"
          >
            {label}
            {required && <span className="text-[#D417C8] ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {LeftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none">
              <LeftIcon className="h-5 w-5" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              inputVariants({
                size,
                variant: effectiveVariant,
              }),
              LeftIcon && 'pl-12',
              RightIcon && 'pr-12',
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            {...props}
          />

          {RightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none">
              <RightIcon className="h-5 w-5" />
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              id={`${inputId}-error`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 flex items-center space-x-2 text-[#D417C8] text-sm"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {!error && helperText && (
            <p
              id={`${inputId}-helper`}
              className="mt-2 text-sm text-white/60"
            >
              {helperText}
            </p>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

Input.displayName = 'Input'

