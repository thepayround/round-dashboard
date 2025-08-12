import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon} from 'lucide-react';
import { AlertCircle } from 'lucide-react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  icon?: LucideIcon
  variant?: 'default' | 'search' | 'floating'
  inputType?: 'input' | 'textarea' | 'select'
  rows?: number
  options?: { value: string; label: string }[]
  containerClassName?: string
  iconPosition?: 'left' | 'right'
}

export const FormInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  FormInputProps
>(({
  label,
  error,
  hint,
  icon: Icon,
  variant: _variant = 'default',
  inputType = 'input',
  rows = 3,
  options = [],
  containerClassName = '',
  iconPosition = 'left',
  className = '',
  ...props
}, ref) => {
  const baseInputClasses = `
    w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-400 
    focus:outline-none focus:border-[#D417C8]/50 focus:bg-white/10 transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  const iconInputClasses = `
    ${Icon && iconPosition === 'left' ? 'pl-12' : 'pl-4'} 
    ${Icon && iconPosition === 'right' ? 'pr-12' : 'pr-4'}
  `

  const errorClasses = error ? 'border-red-500/50 focus:border-red-500/70' : ''

  const renderInput = () => {
    const baseProps = {
      ...props,
      className: `${baseInputClasses} ${iconInputClasses} ${errorClasses} ${className}`,
    }

    switch (inputType) {
      case 'textarea':
        // eslint-disable-next-line react/jsx-props-no-spreading
        return <textarea rows={rows} {...baseProps} ref={ref as React.ForwardedRef<HTMLTextAreaElement>} />
      case 'select':
        return (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <select {...baseProps} ref={ref as React.ForwardedRef<HTMLSelectElement>}>
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                {option.label}
              </option>
            ))}
          </select>
        )
      default:
        // eslint-disable-next-line react/jsx-props-no-spreading
        return <input {...baseProps} ref={ref as React.ForwardedRef<HTMLInputElement>} />
    }
  }

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        )}

        {/* Input Field */}
        {renderInput()}

        {/* Right Icon */}
        {Icon && iconPosition === 'right' && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        )}

        {/* Error Icon */}
        {error && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-red-400"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Hint Text */}
      {hint && !error && (
        <p className="text-sm text-gray-500">{hint}</p>
      )}
    </div>
  )
})

FormInput.displayName = 'FormInput'
