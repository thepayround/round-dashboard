import { cva, type VariantProps } from 'class-variance-authority'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import React from 'react'

import { cn } from '@/shared/utils/cn'

const textareaVariants = cva(
  'w-full rounded-lg border bg-white/5 text-white placeholder-white/50 transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed resize-none',
  {
    variants: {
      size: {
        sm: 'min-h-[80px] px-3 py-2 text-sm',
        md: 'min-h-[100px] px-4 py-3 text-base',
        lg: 'min-h-[120px] px-5 py-4 text-lg',
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
            className="block text-sm font-normal text-white/80 mb-2"
          >
            {label}
            {required && <span className="text-[#D417C8] ml-1">*</span>}
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
              id={`${textareaId}-helper`}
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

Textarea.displayName = 'Textarea'
