import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import React from 'react'

import { UiDropdown, type UiDropdownOption } from '@/shared/ui'
import { cn } from '@/shared/utils/cn'

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'onChange'> {
  /** Label text displayed above select */
  label?: string
  /** Error message to display below select */
  error?: string
  /** Helper text displayed below select */
  helperText?: string
  /** Whether field is required (shows * indicator) */
  required?: boolean
  /** Additional container class name */
  containerClassName?: string
  /** Children (option elements) */
  children: React.ReactNode
  /** Called when selection changes (value string) */
  onChange?: (event: { target: { value: string } }) => void
  /** Optional size for styling */
  size?: 'sm' | 'md' | 'lg'
}

export const Select = ({
  label,
  error,
  helperText,
  required,
  containerClassName,
  id,
  children,
  value,
  onChange,
  className,
  disabled,
  name,
  size = 'md',
}: SelectProps) => {
  const options: UiDropdownOption[] = React.Children.toArray(children)
    .filter((child): child is React.ReactElement<{ value: string; children: React.ReactNode }> => {
      return React.isValidElement(child) && child.props?.value !== undefined
    })
    .map((child) => ({
      value: String(child.props.value),
      label: typeof child.props.children === 'string' ? child.props.children : String(child.props.value),
    }))

  const handleSelect = (val: string) => {
    if (onChange) {
      onChange({ target: { value: val } })
    }
  }

  const sizeClass =
    size === 'sm' ? 'h-8' : size === 'lg' ? 'h-12' : 'h-10' // Standard 40px

  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-fg mb-1.5">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <UiDropdown
        options={options}
        value={value ? String(value) : ''}
        onSelect={(val) => handleSelect(val)}
        placeholder="Select an option"
        disabled={disabled}
        error={!!error}
        allowSearch={false}
        className={cn('w-full', sizeClass, className)}
        name={name}
        id={id}
      />

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-destructive mt-2"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </motion.div>
      )}

      {helperText && !error && (
        <p className="text-sm text-fg-muted mt-2">
          {helperText}
        </p>
      )}
    </div>
  )
}
