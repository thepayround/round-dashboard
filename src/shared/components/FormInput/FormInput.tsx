import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon} from 'lucide-react';
import { AlertCircle } from 'lucide-react'
import { UiDropdown, type UiDropdownOption } from '../ui/UiDropdown'

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, 'onSelect'> {
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
  onSelect?: (value: string) => void
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
  onSelect,
  id,
  ...props
}, ref) => {
  const baseInputClasses = `
    w-full px-3 py-1.5
    bg-[#0a0a0a] border border-[#333333] rounded-lg
    text-white placeholder-[#737373] text-xs
    focus:outline-none focus:border-[#D417C8] focus:bg-[#000000] transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    h-[42px] md:h-9
  `

  const iconInputClasses = `
    ${Icon && iconPosition === 'left' ? 'pl-10' : 'pl-3'}
    ${Icon && iconPosition === 'right' ? 'pr-10' : 'pr-3'}
  `

  const errorClasses = error ? 'border-red-500 focus:border-red-500' : ''

  const renderInput = () => {
    const baseProps = {
      ...props,
      id,
      className: `${baseInputClasses} ${iconInputClasses} ${errorClasses} ${className}`,
    }

    switch (inputType) {
      case 'textarea':
        // eslint-disable-next-line react/jsx-props-no-spreading
        return <textarea rows={rows} {...baseProps} ref={ref as React.ForwardedRef<HTMLTextAreaElement>} />
      case 'select':
        return (
          <UiDropdown
            options={options.map((option): UiDropdownOption => ({
              value: option.value,
              label: option.label
            }))}
            value={props.value as string}
            onSelect={onSelect ?? ((value) => {
              // Create a proper synthetic event with name and value
              const event = {
                target: {
                  name: props.name,
                  value,
                  type: 'select'
                }
              } as unknown as React.ChangeEvent<HTMLSelectElement>
              props.onChange?.(event)
            })}
            placeholder={props.placeholder ?? 'Select an option'}
            disabled={props.disabled}
            error={!!error}
            icon={Icon ? <Icon className="w-4 h-4" /> : undefined}
            allowClear
          />
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
        <label htmlFor={id} className="block text-sm font-medium text-[#a3a3a3]">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <Icon className="w-4 h-4 text-[#737373]" />
          </div>
        )}

        {/* Input Field */}
        {renderInput()}

        {/* Right Icon */}
        {Icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
            <Icon className="w-4 h-4 text-[#737373]" />
          </div>
        )}

        {/* Error Icon */}
        {error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
            <AlertCircle className="w-4 h-4 text-red-400" />
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
        <p className="text-sm text-[#737373]">{hint}</p>
      )}
    </div>
  )
})

FormInput.displayName = 'FormInput'
