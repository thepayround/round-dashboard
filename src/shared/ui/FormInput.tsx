/**
 * FormInput Component
 * 
 * A comprehensive form input component with two variants:
 * - `auth`: Uses global CSS classes for auth pages (default)
 * - `default`: Uses Tailwind utilities for general forms
 * 
 * @example
 * // Auth variant (auth pages, onboarding)
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
 * // Default variant (settings, modals)
 * <FormInput
 *   variant="default"
 *   label="First Name"
 *   leftIcon={User}
 *   value={firstName}
 *   onChange={(e) => setFirstName(e.target.value)}
 *   helpText="Enter your legal first name"
 *   size="lg"
 * />
 * 
 * @example
 * // With loading state
 * <FormInput
 *   label="Company Name"
 *   leftIcon={Building}
 *   value={company}
 *   onChange={(e) => setCompany(e.target.value)}
 *   loading={isFetching}
 *   loadingText="Loading..."
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
  variant?: 'default' | 'auth'
  size?: 'sm' | 'md' | 'lg'
  containerClassName?: string
  loading?: boolean
  loadingText?: string
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
      variant = 'auth', // Changed default to 'auth' for better consistency
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
      loading = false,
      loadingText,
      passwordToggle,
      ...restProps
    },
    ref
  ) => {
    const isDisabled = disabled || loading
    const normalizedOnFocus = onFocus as FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined
    const normalizedOnBlur = onBlur as FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined
    const shouldEnablePasswordToggle = (passwordToggle ?? type === 'password') && !RightIcon

    const {
      inputId,
      errorId,
      helpTextId,
      hasError,
      isFocused,
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
      sm: 'h-9 px-3 text-xs',
      md: 'h-9 px-3 text-xs', 
      lg: 'h-9 px-3 text-xs'
    }

    const getInputClasses = () => {
      if (variant === 'auth') {
        return cn(
          'auth-input',
          LeftIcon && 'input-with-icon-left',
          RightIcon && 'input-with-icon-right',
          hasError && 'auth-input-error',
          className
        )
      }

      // For default variant, use working autofill fixes from auth-input CSS
      const autofillClasses = [
        // Base autofill state
        '[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_rgba(255,255,255,0.12)_inset!important]',
        '[&:-webkit-autofill]:[-webkit-text-fill-color:rgba(255,255,255,0.95)!important]',
        '[&:-webkit-autofill]:[background-color:transparent!important]',
        '[&:-webkit-autofill]:[background-image:none!important]',
        '[&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s!important]',
        // Hover state
        '[&:-webkit-autofill:hover]:[-webkit-box-shadow:0_0_0_1000px_rgba(255,255,255,0.12)_inset!important]',
        '[&:-webkit-autofill:hover]:[-webkit-text-fill-color:rgba(255,255,255,0.95)!important]',
        '[&:-webkit-autofill:hover]:[background-color:transparent!important]',
        '[&:-webkit-autofill:hover]:[background-image:none!important]',
        '[&:-webkit-autofill:hover]:[transition:background-color_5000s_ease-in-out_0s!important]',
        // Focus state
        '[&:-webkit-autofill:focus]:[-webkit-box-shadow:0_0_0_1000px_rgba(255,255,255,0.18)_inset!important]',
        '[&:-webkit-autofill:focus]:[-webkit-text-fill-color:rgba(255,255,255,1)!important]',
        '[&:-webkit-autofill:focus]:[background-color:transparent!important]',
        '[&:-webkit-autofill:focus]:[transition:background-color_5000s_ease-in-out_0s!important]',
        // Active state
        '[&:-webkit-autofill:active]:[-webkit-box-shadow:0_0_0_1000px_rgba(255,255,255,0.12)_inset!important]',
        '[&:-webkit-autofill:active]:[-webkit-text-fill-color:rgba(255,255,255,0.95)!important]',
        '[&:-webkit-autofill:active]:[background-color:transparent!important]',
        '[&:-webkit-autofill:active]:[background-image:none!important]',
        '[&:-webkit-autofill:active]:[transition:background-color_5000s_ease-in-out_0s!important]',
        // Internal autofill selected
        '[&:-internal-autofill-selected]:[background-color:rgba(255,255,255,0.12)!important]',
        '[&:-internal-autofill-selected]:[background-image:none!important]',
        '[&:-internal-autofill-selected]:[color:rgba(255,255,255,0.95)!important]',
        '[&:-internal-autofill-selected]:[-webkit-text-fill-color:rgba(255,255,255,0.95)!important]',
        '[&:-internal-autofill-selected]:[-webkit-box-shadow:0_0_0_1000px_rgba(255,255,255,0.12)_inset!important]',
      ]

      return cn(
        'w-full rounded-lg sm:rounded-lg border transition-all duration-200',
        'bg-[#171719] border-[#333333] text-white placeholder-[#737373]',
        'focus:border-[#14bdea] focus:outline-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]',
        // Mobile-specific improvements
        'text-base sm:text-sm md:text-base', // Prevent iOS zoom on focus
        'leading-normal sm:leading-relaxed',
        ...autofillClasses,
        sizeClasses[size],
        LeftIcon && 'pl-10',
        RightIcon && 'pr-10',
        hasError && 'border-red-400 focus:border-red-400',
        isDisabled && 'opacity-50 cursor-not-allowed',
        isFocused && 'ring-1 ring-[#14bdea]/40',
        className
      )
    }

    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <label 
            htmlFor={inputId} 
            className={variant === 'auth' ? 'auth-label' : 'block text-sm font-normal text-white/90 tracking-tight'}
          >
            {label}
            {required && <span className="text-[#D417C8] ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {loading && variant === 'default' && (
            <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary animate-spin z-10" />
          )}
          
          {!loading && LeftIcon && (
            <LeftIcon 
              className={variant === 'auth' 
                ? 'input-icon-left auth-icon-primary' 
                : 'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400'
              } 
            />
          )}
          
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            placeholder={loading && loadingText ? loadingText : placeholder}
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
            className={getInputClasses()}
            aria-invalid={hasError}
            aria-describedby={cn(
              errorId,
              helpTextId
            )}
            aria-busy={loading}
            {...restProps} // eslint-disable-line react/jsx-props-no-spreading
          />
          
          {loading && variant === 'auth' && (
            <Loader2 className="input-icon-right auth-icon animate-spin" />
          )}
          
          {!loading && RightIcon && (
            <RightIcon 
              className={variant === 'auth' 
                ? 'input-icon-right auth-icon' 
                : cn(
                    'absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400',
                    onRightIconClick && 'cursor-pointer'
                  )
              }
              onClick={handleRightIconClick}
              {...(onRightIconClick && { role: 'button', tabIndex: 0 })}
            />
          )}

          {!loading && shouldShowPasswordToggle && (
            <PlainButton
              type="button"
              onClick={handleRightIconClick}
              className={variant === 'auth'
                ? 'input-icon-right auth-icon'
                : 'absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors'}
              aria-label={rightIconAriaLabel}
            >
              {resolvedType === 'password' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </PlainButton>
          )}
        </div>
        
        {error && (
          <p 
            id={errorId}
            className={variant === 'auth' 
              ? 'text-sm auth-validation-error flex items-center space-x-2' 
              : 'text-sm text-[#D417C8] flex items-center space-x-1'
            }
            role="alert"
            aria-live="polite"
          >
            {variant !== 'auth' && <AlertCircle className="w-3.5 h-3.5" />}
            <span>{error}</span>
          </p>
        )}
        
        {helpText && !error && (
          <p 
            id={helpTextId}
            className="text-xs text-gray-500 dark:text-polar-500 leading-snug"
          >
            {helpText}
          </p>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'
