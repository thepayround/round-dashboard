import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react'
import { cn } from '@/shared/utils/cn'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string
  description?: string
  error?: string
  prefix?: ReactNode
  suffix?: ReactNode
  state?: 'default' | 'error' | 'success' | 'warning'
  'data-testid'?: string
}

/**
 * Dev-SaaS Minimal Input Component
 * 
 * Influenced by: Cursor clean fields
 * 
 * Features:
 * - Clean, rounded inputs with subtle borders
 * - Focus states with shadow-focus
 * - Error/success/warning states
 * - Prefix/suffix support
 * - Labels always visible (not placeholders as labels)
 * - Accessible with ARIA
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    label,
    description,
    error,
    prefix,
    suffix,
    state = 'default',
    id,
    required,
    type,
    placeholder,
    disabled,
    readOnly,
    value,
    defaultValue,
    onChange,
    onBlur,
    onFocus,
    name,
    autoComplete,
    maxLength,
    minLength,
    pattern,
    min,
    max,
    step,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'data-testid': dataTestId,
  }, ref) => {
    const inputId = id ?? `input-${Math.random().toString(36).substr(2, 9)}`
    const hasError = error ?? state === 'error'
    
    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-[12px] text-fg-muted font-medium mb-1"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        
        {/* Input Container */}
        <div className={cn(
          "flex items-center gap-2 rounded-xl border bg-bg-raised px-3 py-2.5",
          "transition-all duration-base",
          hasError 
            ? "border-destructive focus-within:shadow-focus focus-within:border-ring" 
            : "border-border focus-within:shadow-focus focus-within:border-transparent",
          className
        )}>
          {/* Prefix */}
          {prefix && (
            <span className="flex-shrink-0 text-fg-muted">
              {prefix}
            </span>
          )}
          
          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            type={type}
            name={name}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            autoComplete={autoComplete}
            maxLength={maxLength}
            minLength={minLength}
            pattern={pattern}
            min={min}
            max={max}
            step={step}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            className={cn(
              "w-full bg-transparent outline-none text-[14px] text-fg placeholder:text-fg-muted",
              "disabled:opacity-60 disabled:cursor-not-allowed"
            )}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={(() => {
              if (error) return `${inputId}-error`;
              if (description) return `${inputId}-description`;
              return undefined;
            })()}
            data-testid={dataTestId}
          />
          
          {/* Suffix */}
          {suffix && (
            <span className="flex-shrink-0 text-fg-muted">
              {suffix}
            </span>
          )}
        </div>
        
        {/* Description */}
        {description && !error && (
          <p 
            id={`${inputId}-description`}
            className="mt-1 text-[12px] text-fg-muted"
          >
            {description}
          </p>
        )}
        
        {/* Error */}
        {error && (
          <p 
            id={`${inputId}-error`}
            className="mt-1 text-[12px] text-destructive flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'


