import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  onRightIconClick?: () => void
  helpText?: string
  variant?: 'default' | 'auth'
  size?: 'sm' | 'md' | 'lg'
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
      ...restProps
    },
    ref
  ) => {
    const inputId = id ?? `input-${Math.random().toString(36).substr(2, 9)}`

    const sizeClasses = {
      sm: 'h-11 px-3 text-sm',
      md: 'h-11 px-3 text-sm', 
      lg: 'h-11 px-3 text-sm'
    }

    const getInputClasses = () => {
      if (variant === 'auth') {
        return cn(
          'auth-input',
          LeftIcon && 'input-with-icon-left',
          RightIcon && 'input-with-icon-right',
          error && 'auth-input-error',
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
        'w-full rounded-lg sm:rounded-lg backdrop-blur-xl border transition-all duration-200',
        'bg-white/5 border-white/10 text-white placeholder-gray-400',
        'hover:bg-white/8 hover:border-white/15',
        'focus:bg-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-[#D417C8]/30',
        // Mobile-specific improvements
        'text-base sm:text-sm md:text-base', // Prevent iOS zoom on focus
        'leading-normal sm:leading-relaxed',
        ...autofillClasses,
        sizeClasses[size],
        LeftIcon && 'pl-10',
        RightIcon && 'pr-10',
        error && 'border-red-400 focus:border-red-400 focus:ring-red-400/30',
        className
      )
    }

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className={variant === 'auth' ? 'auth-label' : 'block text-sm font-medium text-gray-300'}>
            {label}
          </label>
        )}
        
        <div className="relative">
          {LeftIcon && (
            <LeftIcon className={variant === 'auth' ? 'input-icon-left auth-icon-primary' : 'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400'} />
          )}
          
          <input
            ref={ref}
            id={inputId}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={disabled}
            required={required}
            name={name}
            autoComplete={autoComplete}
            className={getInputClasses()}
            {...restProps} // eslint-disable-line react/jsx-props-no-spreading
          />
          
          {RightIcon && (
            <RightIcon 
              className={variant === 'auth' ? 'input-icon-right auth-icon' : 'absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer'}
              onClick={onRightIconClick}
            />
          )}
        </div>
        
        {error && (
          <p className={variant === 'auth' ? 'text-sm auth-validation-error flex items-center space-x-2' : 'text-sm text-red-400'}>
            {error}
          </p>
        )}
        
        {helpText && !error && (
          <p className="text-sm text-gray-500">{helpText}</p>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'