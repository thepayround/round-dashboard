import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { forwardRef } from 'react'
import type { FocusEventHandler } from 'react'

import { PlainButton } from '@/shared/ui/Button'
import { useFormInputController } from '@/shared/ui/hooks/useFormInputController'

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  onRightIconClick?: () => void
  inputType?: 'input' | 'textarea'
  rows?: number
  containerClassName?: string
  passwordToggle?: boolean
}

export const AuthInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  AuthInputProps
>((
  {
    label,
    error,
    hint,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    onRightIconClick,
    inputType = 'input',
    rows = 3,
    containerClassName = '',
    className = '',
    id,
    passwordToggle,
    type = 'text',
    ...inputProps
  },
  ref
) => {
  const { onFocus, onBlur, ...restInputProps } = inputProps
  const normalizedOnFocus = onFocus as FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined
  const normalizedOnBlur = onBlur as FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined
  const shouldEnablePasswordToggle = (passwordToggle ?? type === 'password') && inputType !== 'textarea' && !RightIcon

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
    helpText: hint,
    onFocus: normalizedOnFocus,
    onBlur: normalizedOnBlur,
    onRightIconClick,
    enablePasswordToggle: shouldEnablePasswordToggle,
  })

  const baseInputClasses = `
    w-full h-9 px-3 py-1.5
    bg-[#171719] border border-[#333333] rounded-lg
    text-white placeholder-[#737373] text-xs font-light
    focus:outline-none focus:border-[#14bdea]
    transition-all duration-150 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed
    [-webkit-box-shadow:0_0_0_1000px_#171719_inset!important]
    [-webkit-text-fill-color:rgba(255,255,255,0.95)!important]
    [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_#171719_inset!important]
    [&:-webkit-autofill]:[-webkit-text-fill-color:rgba(255,255,255,0.95)!important]
    [&:-webkit-autofill:hover]:[-webkit-box-shadow:0_0_0_1000px_#171719_inset!important]
    [&:-webkit-autofill:focus]:[-webkit-box-shadow:0_0_0_1000px_#171719_inset!important]
    [&:-internal-autofill-selected]:[background-color:#171719!important]
  `

  const textareaClasses = `
    w-full min-h-14 px-3 py-2 resize-none
    bg-[#171719] border border-[#333333] rounded-lg
    text-white placeholder-[#737373] text-xs font-normal
    focus:outline-none focus:border-[#14bdea]
    transition-all duration-150 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  const iconInputClasses = `
    ${LeftIcon ? 'pl-10' : 'pl-3'}
    ${(RightIcon || shouldShowPasswordToggle) ? 'pr-10' : 'pr-3'}
  `

  const errorClasses = error ? 'border-red-400/50 focus:border-red-400/70' : ''
  const focusClasses = isFocused ? 'ring-1 ring-[#14bdea]/40' : ''

  const renderInput = () => {
    const inputClasses = inputType === 'textarea' ? textareaClasses : baseInputClasses
    const baseProps = {
      ...restInputProps,
      id: inputId,
      className: `${inputClasses} ${iconInputClasses} ${errorClasses} ${focusClasses} ${className}`,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      'aria-invalid': hasError,
      'aria-describedby': errorId,
    }

    if (inputType === 'textarea') {
      return (
        <textarea
          rows={rows}
          {...baseProps}
          ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
        />
      )
    }

    return (
      <input
        type={resolvedType}
        {...baseProps}
        ref={ref as React.ForwardedRef<HTMLInputElement>}
      />
    )
  }

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-normal text-white/90 tracking-tight">
          {label}
          {restInputProps.required && <span className="text-primary ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {LeftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <LeftIcon className="w-4 h-4 text-secondary" />
          </div>
        )}

        {renderInput()}

        {RightIcon && (
          <PlainButton
            type="button"
            onClick={handleRightIconClick}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 text-white/70 hover:text-white transition-colors duration-200"
            tabIndex={-1}
            unstyled
          >
            <RightIcon className="w-4 h-4" />
          </PlainButton>
        )}

        {!RightIcon && shouldShowPasswordToggle && (
          <PlainButton
            type="button"
            onClick={handleRightIconClick}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 text-white/70 hover:text-white transition-colors duration-200"
            tabIndex={-1}
            aria-label={rightIconAriaLabel}
            unstyled
          >
            {resolvedType === 'password' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </PlainButton>
        )}

        {error && !RightIcon && !shouldShowPasswordToggle && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
            <AlertCircle className="w-4 h-4 text-primary" />
          </div>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-primary"
          id={errorId}
        >
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </motion.div>
      )}

      {hint && !error && (
        <p className="text-sm text-white/60" id={helpTextId}>
          {hint}
        </p>
      )}
    </div>
  )
})

AuthInput.displayName = 'AuthInput'
