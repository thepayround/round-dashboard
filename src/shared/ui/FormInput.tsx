/**
 * FormInput Component
 *
 * A comprehensive form input component using Tailwind CSS for consistent styling.
 * Replaces the legacy variant system with a single Tailwind-based implementation.
 *
 * @example
 * // Basic usage
 * <FormInput
 *   label="Email Address"
 *   leftIcon={Mail}
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   error={errors.email}
 *   required
 * />
 *
 * @example
 * // With help text
 * <FormInput
 *   label="First Name"
 *   leftIcon={User}
 *   value={firstName}
 *   onChange={(e) => setFirstName(e.target.value)}
 *   helpText="Enter your legal first name"
 *   size="lg"
 * />
 *
 * @example
 * // With isLoading state
 * <FormInput
 *   label="Company Name"
 *   leftIcon={Building}
 *   value={company}
 *   onChange={(e) => setCompany(e.target.value)}
 *   isLoading={isFetching}
 *   isLoadingText="Loading..."
 * />
 *
 * @accessibility
 * - Automatically links errors/help text with `aria-describedby`
 * - Sets `aria-invalid` when error is present
 * - Sets `aria-busy` during loading
 * - Supports keyboard navigation for clickable icons
 * - Required fields show visual indicator (*)
 */
import type { LucideIcon } from 'lucide-react'
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react'
import type { FocusEventHandler, InputHTMLAttributes } from 'react';
import { forwardRef } from 'react'

import { PlainButton } from '@/shared/ui/Button'
import { useFormInputController } from '@/shared/ui/hooks/useFormInputController'
import { cn } from '@/shared/utils/cn'

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string | React.ReactNode
  error?: string
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  onRightIconClick?: () => void
  helpText?: string
  size?: 'sm' | 'md' | 'lg'
  containerClassName?: string
  isLoading?: boolean
  isLoadingText?: string
  passwordToggle?: boolean
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      onRightIconClick,
      helpText,
      size = 'md',
      className,
      containerClassName = '',
      id,
      type = 'text',
      placeholder,
      value,
      onChange,
      onBlur,
      onFocus,
      disabled,
      required,
      name,
      autoComplete,
      isLoading = false,
      isLoadingText,
      passwordToggle,
      ...restProps
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading
    const normalizedOnFocus = onFocus as FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined
    const normalizedOnBlur = onBlur as FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined
    const shouldEnablePasswordToggle = (passwordToggle ?? type === 'password') && !RightIcon

    const {
      inputId,
      errorId,
      helpTextId,
      hasError,
      resolvedType,
      shouldShowPasswordToggle,
      rightIconAriaLabel,
      handleFocus,
      handleBlur,
      handleMouseEnter,
      handleMouseLeave,
      handleRightIconClick,
    } = useFormInputController({
      id,
      type,
      error,
      helpText,
      onFocus: normalizedOnFocus,
      onBlur: normalizedOnBlur,
      onRightIconClick,
      enablePasswordToggle: shouldEnablePasswordToggle,
    })

    const sizeClasses = {
      sm: 'h-9 px-4 text-xs',
      md: 'h-9 px-4 text-xs',
      lg: 'h-9 px-4 text-xs',
    }

    // Autofill style fixes for browser compatibility
    const autofillClasses = [
      // Base autofill state - using auth-bg color (#171719)
      '[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_#171719_inset!important]',
      '[&:-webkit-autofill]:[-webkit-text-fill-color:rgba(255,255,255,0.95)!important]',
      '[&:-webkit-autofill]:[background-color:#171719!important]',
      '[&:-webkit-autofill]:[background-image:none!important]',
      '[&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s!important]',
      // Hover state
      '[&:-webkit-autofill:hover]:[-webkit-box-shadow:0_0_0_1000px_#171719_inset!important]',
      '[&:-webkit-autofill:hover]:[-webkit-text-fill-color:rgba(255,255,255,0.95)!important]',
      '[&:-webkit-autofill:hover]:[background-color:#171719!important]',
      '[&:-webkit-autofill:hover]:[background-image:none!important]',
      '[&:-webkit-autofill:hover]:[transition:background-color_5000s_ease-in-out_0s!important]',
      // Focus state
      '[&:-webkit-autofill:focus]:[-webkit-box-shadow:0_0_0_1000px_#171719_inset!important]',
      '[&:-webkit-autofill:focus]:[-webkit-text-fill-color:rgba(255,255,255,1)!important]',
      '[&:-webkit-autofill:focus]:[background-color:#171719!important]',
      '[&:-webkit-autofill:focus]:[transition:background-color_5000s_ease-in-out_0s!important]',
      // Active state
      '[&:-webkit-autofill:active]:[-webkit-box-shadow:0_0_0_1000px_#171719_inset!important]',
      '[&:-webkit-autofill:active]:[-webkit-text-fill-color:rgba(255,255,255,0.95)!important]',
      '[&:-webkit-autofill:active]:[background-color:#171719!important]',
      '[&:-webkit-autofill:active]:[background-image:none!important]',
      '[&:-webkit-autofill:active]:[transition:background-color_5000s_ease-in-out_0s!important]',
      // Internal autofill selected
      '[&:-internal-autofill-selected]:[background-color:#171719!important]',
      '[&:-internal-autofill-selected]:[background-image:none!important]',
      '[&:-internal-autofill-selected]:[color:rgba(255,255,255,0.95)!important]',
      '[&:-internal-autofill-selected]:[-webkit-text-fill-color:rgba(255,255,255,0.95)!important]',
      '[&:-internal-autofill-selected]:[-webkit-box-shadow:0_0_0_1000px_#171719_inset!important]',
    ]

    const inputClasses = cn(
      // Base styles
      'w-full rounded-md border transition-all duration-200',
      'bg-auth-bg border-auth-border text-white placeholder:text-auth-placeholder',
      'font-light tracking-tight appearance-none outline-none',
      // Focus & hover states
      'hover:border-auth-border-hover',
      'focus:border-auth-primary focus:bg-auth-bg',
      // Mobile-specific improvements
      'text-xs leading-normal',
      // Autofill fixes
      ...autofillClasses,
      // Size variants
      sizeClasses[size],
      // Icon padding
      LeftIcon && 'pl-9',
      RightIcon && 'pr-9',
      // Error state
      hasError && 'border-auth-error focus:border-auth-error bg-auth-error-bg',
      // Disabled state
      isDisabled && 'opacity-50 cursor-not-allowed',
      // Custom className
      className
    )

    return (
      <div className={cn('space-y-1.5', containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-normal text-white/90 mb-1.5 tracking-tight">
            {label}
            {required && <span className="text-auth-magenta ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          { isLoading && (
            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-auth-icon-primary animate-spin z-10" />
          )}

          {!isLoading && LeftIcon && (
            <LeftIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-auth-icon-primary z-10" />
          )}

          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            placeholder={ isLoading && isLoadingText ? isLoadingText : placeholder}
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            disabled={isDisabled}
            required={required}
            name={name}
            autoComplete={autoComplete}
            className={inputClasses}
            aria-invalid={hasError}
            aria-describedby={cn(errorId, helpTextId)}
            aria-busy={isLoading}
            {...restProps}
          />

          { isLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-auth-icon animate-spin z-10" />}

          {!isLoading && RightIcon && (
            <RightIcon
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-auth-icon z-10',
                'transition-colors duration-200',
                onRightIconClick && 'cursor-pointer hover:text-white/90'
              )}
              onClick={handleRightIconClick}
              {...(onRightIconClick && { role: 'button', tabIndex: 0 })}
            />
          )}

          {!isLoading && shouldShowPasswordToggle && (
            <PlainButton
              type="button"
              onClick={handleRightIconClick}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-auth-icon hover:text-white/90 transition-colors z-10"
              aria-label={rightIconAriaLabel}
            >
              {resolvedType === 'password' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </PlainButton>
          )}
        </div>

        {error && (
          <p id={errorId} className="text-xs text-auth-error font-medium flex items-center space-x-1.5 mt-1.5" role="alert" aria-live="polite" aria-atomic="true">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </p>
        )}

        {helpText && !error && (
          <p id={helpTextId} className="text-xs text-white/60 mt-1.5">
            {helpText}
          </p>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'
