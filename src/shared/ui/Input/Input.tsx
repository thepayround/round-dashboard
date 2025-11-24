import { cva, type VariantProps } from 'class-variance-authority'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Copy, Check } from 'lucide-react'
import React, { useState } from 'react'

import { PlainButton } from '../Button'

import { cn } from '@/shared/utils/cn'

const inputVariants = cva(
  [
    // Base styles - Premium design
    'w-full h-10 px-3 bg-input border border-border rounded-lg text-fg placeholder:text-fg-subtle font-normal text-sm transition-all duration-200 hover:border-border-hover focus:border-ring focus:ring-1 focus:ring-ring/20 focus:bg-input-focus outline-none appearance-none disabled:opacity-50 disabled:cursor-not-allowed',
    // Autofill styles - match input background
    '[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_#0f0f0f_inset!important]',
    '[&:-webkit-autofill]:[-webkit-text-fill-color:rgba(255,255,255,0.95)!important]',
    '[&:-webkit-autofill]:[background-color:#0f0f0f!important]',
    '[&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s!important]',
    // Autofill hover state
    '[&:-webkit-autofill:hover]:[-webkit-box-shadow:0_0_0_1000px_#0f0f0f_inset!important]',
    '[&:-webkit-autofill:hover]:[-webkit-text-fill-color:rgba(255,255,255,0.95)!important]',
    // Autofill focus state
    '[&:-webkit-autofill:focus]:[-webkit-box-shadow:0_0_0_1000px_#0f0f0f_inset!important]',
    '[&:-webkit-autofill:focus]:[-webkit-text-fill-color:rgba(255,255,255,1)!important]',
    // Internal autofill selected
    '[&:-internal-autofill-selected]:[background-color:#0f0f0f!important]',
    '[&:-internal-autofill-selected]:[color:rgba(255,255,255,0.95)!important]',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'h-10 px-3 text-xs', // Standard 40px
        md: 'h-10 px-3 text-sm', // Standard 40px
        lg: 'h-10 px-4 text-base', // Standard 40px
      },
      variant: {
        default: '',
        error: 'border-destructive focus:border-destructive focus:ring-destructive/20',
        success: 'border-success focus:border-success focus:ring-success/20',
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
  /** Show character count (requires maxLength prop) */
  showCharacterCount?: boolean
  /** Show copy button for read-only inputs */
  showCopyButton?: boolean
  /** Callback when copy is successful */
  onCopy?: () => void
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
      showCharacterCount,
      showCopyButton,
      onCopy,
      id,
      value,
      maxLength,
      readOnly,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const hasError = Boolean(error)
    const effectiveVariant = hasError ? 'error' : variant
    const [copied, setCopied] = useState(false)

    const currentLength = typeof value === 'string' ? value.length : String(value || '').length
    const shouldShowCharacterCount = showCharacterCount && maxLength
    const shouldShowCopyButton = showCopyButton && readOnly && value

    const handleCopy = async () => {
      if (!value) return
      try {
        await navigator.clipboard.writeText(String(value))
        setCopied(true)
        onCopy?.()
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }

    return (
      <div className={containerClassName}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-normal text-fg mb-1.5 tracking-tight"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {LeftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
              <LeftIcon className="w-4 h-4 text-fg-muted" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            value={value}
            maxLength={maxLength}
            readOnly={readOnly}
            className={cn(
              inputVariants({
                size,
                variant: effectiveVariant,
              }),
              LeftIcon && 'pl-9',
              (RightIcon || shouldShowCopyButton) && 'pr-9',
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

          {shouldShowCopyButton && (
            <PlainButton
              type="button"
              onClick={handleCopy}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center cursor-pointer transition-colors duration-200 hover:text-fg text-fg-muted"
              aria-label="Copy to clipboard"
              unstyled
            >
              {copied ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </PlainButton>
          )}

          {RightIcon && !shouldShowCopyButton && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center cursor-pointer transition-colors duration-200 hover:text-fg">
              <RightIcon className="w-4 h-4 text-fg-muted" />
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
              className="mt-1.5 flex items-center space-x-1.5 text-destructive font-medium text-xs"
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
              id={`${inputId}-helper`}
              className="mt-1.5 text-xs text-fg-muted"
            >
              {helperText}
            </p>
          )}
        </AnimatePresence>

        {shouldShowCharacterCount && (
          <p className="mt-1 text-xs text-fg-muted text-right">
            {currentLength} / {maxLength}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

