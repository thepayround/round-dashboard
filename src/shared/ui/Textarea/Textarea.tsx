import { cva, type VariantProps } from 'class-variance-authority'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import React from 'react'

import { cn } from '@/shared/utils/cn'

const textareaVariants = cva(
  'w-full rounded-md border bg-auth-bg text-white placeholder:text-auth-placeholder font-light text-sm tracking-tight transition-all duration-200 hover:border-auth-border-hover focus:border-auth-primary focus:bg-auth-bg outline-none appearance-none disabled:opacity-50 disabled:cursor-not-allowed resize-none',
  {
    variants: {
      size: {
        sm: 'min-h-[60px] px-4 py-2',
        md: 'min-h-[80px] px-4 py-2',
        lg: 'min-h-[100px] px-4 py-2',
      },
      variant: {
        default: 'border-auth-border',
        error: 'border-auth-error bg-auth-error-bg focus:border-auth-error',
        success: 'border-success bg-success/5 focus:border-success',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
)

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof textareaVariants> {
  /** Label text displayed above textarea */
  label?: string | React.ReactNode
  /** Error message to display below textarea */
  error?: string
  /** Helper text displayed below textarea */
  helperText?: string
  /** Whether field is required (shows * indicator) */
  required?: boolean
  /** Additional container class name */
  containerClassName?: string
  /** Number of visible text rows */
  rows?: number
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      size,
      variant,
      label,
      error,
      helperText,
      required,
      containerClassName,
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
    const hasError = Boolean(error)
    const effectiveVariant = hasError ? 'error' : variant

    return (
      <div className={containerClassName}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-normal text-white/90 mb-1.5 tracking-tight"
          >
            {label}
            {required && <span className="text-primary ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            textareaVariants({
              size,
              variant: effectiveVariant,
            }),
            className
          )}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${textareaId}-error`
              : helperText
              ? `${textareaId}-helper`
              : undefined
          }
          {...props}
        />

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              id={`${textareaId}-error`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-1.5 flex items-center space-x-1.5 text-auth-error font-medium text-xs"
              role="alert"
              aria-live="polite"
              aria-atomic="true"
            >
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {!error && helperText && (
            <p
              id={`${textareaId}-helper`}
              className="mt-1.5 text-xs text-white/60"
            >
              {helperText}
            </p>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
