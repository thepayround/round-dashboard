import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { AlertCircle } from 'lucide-react'
import { forwardRef } from 'react'

import { PlainButton } from '@/shared/ui/Button'

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
}

export const AuthInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  AuthInputProps
>(({
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
  ...props
}, ref) => {
  // Unified input height at 36px to align with button sizing
  const baseInputClasses = `
    w-full h-9 px-3 py-1.5
    bg-[#171719] border border-[#333333] rounded-lg
    text-white placeholder-[#737373] text-xs font-light
    focus:outline-none focus:border-[#14bdea]
    transition-all duration-150 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed
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
    ${RightIcon ? 'pr-10' : 'pr-3'}
  `

  const errorClasses = error ? 'border-red-400/50 focus:border-red-400/70' : ''

  const renderInput = () => {
    const inputClasses = inputType === 'textarea' ? textareaClasses : baseInputClasses
    const baseProps = {
      ...props,
      id,
      className: `${inputClasses} ${iconInputClasses} ${errorClasses} ${className}`,
    }

    if (inputType === 'textarea') {
      return (
        <textarea
          rows={rows}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...baseProps}
          ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
        />
      )
    }

    return (
      <input
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...baseProps}
        ref={ref as React.ForwardedRef<HTMLInputElement>}
      />
    )
  }

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {/* Label */}
      {label && (
        <label htmlFor={id} className="block text-sm font-normal text-white/90 tracking-tight">
          {label}
          {props.required && <span className="text-[#D417C8] ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {LeftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <LeftIcon className="w-4 h-4 text-[#14BDEA]" />
          </div>
        )}

        {/* Input Field */}
        {renderInput()}

        {/* Right Icon */}
        {RightIcon && (
          <PlainButton
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 text-white/70 hover:text-white transition-colors duration-200"
            tabIndex={-1}
            unstyled
          >
            <RightIcon className="w-4 h-4" />
          </PlainButton>
        )}

        {/* Error Icon */}
        {error && !RightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
            <AlertCircle className="w-4 h-4 text-[#D417C8]" />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-[#D417C8]"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Hint Text */}
      {hint && !error && (
        <p className="text-sm text-white/60">{hint}</p>
      )}
    </div>
  )
})

AuthInput.displayName = 'AuthInput'

