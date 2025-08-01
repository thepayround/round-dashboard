import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react';
import { Plus } from 'lucide-react'

interface CreateButtonProps {
  /** The text to display after the icon (e.g., "Customer", "Plan", "Product") */
  label: string
  /** Click handler function */
  onClick: () => void
  /** Optional custom icon - defaults to Plus */
  icon?: LucideIcon
  /** Button size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Button variant */
  variant?: 'primary' | 'secondary'
  /** Whether button is disabled */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
  /** Whether to show motion animations */
  animated?: boolean
}

const CreateButton = ({
  label,
  onClick,
  icon: Icon = Plus,
  size = 'md',
  variant = 'primary',
  disabled = false,
  className = '',
  animated = true
}: CreateButtonProps) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6'
  }

  const baseClasses = `
    btn-${variant} 
    ${sizeClasses[size]} 
    flex items-center space-x-2 
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''} 
    ${className}
  `.trim()

  const ButtonComponent = animated ? motion.button : 'button'
  const motionProps = animated ? {
    whileHover: disabled ? {} : { scale: 1.05 },
    whileTap: disabled ? {} : { scale: 0.95 }
  } : {}

  return (
    <ButtonComponent
      onClick={disabled ? undefined : onClick}
      className={baseClasses}
      disabled={disabled}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...motionProps}
    >
      <Icon className={iconSizes[size]} />
      <span>{label}</span>
    </ButtonComponent>
  )
}

export { CreateButton }
