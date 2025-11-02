import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import React from 'react'

import { cn } from '@/shared/utils/cn'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label text */
  label?: string
  /** Error message */
  error?: string
  /** Helper text */
  helperText?: string
  /** Required field indicator */
  required?: boolean
  /** Show character count */
  showCount?: boolean
  /** Maximum characters */
  maxLength?: number
  /** Container class name */
  containerClassName?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      required,
      showCount,
      maxLength,
      className,
      containerClassName,
      id,
      value,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
    const currentLength = String(value || '').length
    const hasError = Boolean(error)

    return (
      <div className={containerClassName}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-normal text-white/80 mb-2"
          >
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          maxLength={maxLength}
          className={cn(
            'w-full rounded-lg border bg-white/5 text-white placeholder-white/50 px-4 py-3',
            'transition-all duration-200 focus:outline-none focus:ring-2 resize-none',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            hasError
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
              : 'border-white/20 focus:border-primary focus:ring-primary/50',
            className
          )}
          aria-invalid={hasError}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : helperText
              ? `${textareaId}-helper`
              : undefined
          }
          {...props}
        />

        <div className="mt-2 flex items-center justify-between">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  id={`${textareaId}-error`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center space-x-2 text-red-400 text-sm"
                  role="alert"
                  aria-live="polite"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {!error && helperText && (
                <p id={`${textareaId}-helper`} className="text-sm text-white/60">
                  {helperText}
                </p>
              )}
            </AnimatePresence>
          </div>

          {showCount && maxLength && (
            <span className="text-sm text-white/60 ml-4 flex-shrink-0">
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

