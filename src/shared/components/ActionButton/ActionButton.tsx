import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react';
import { Plus, ArrowRight, LogIn, UserPlus } from 'lucide-react'

interface ActionButtonProps {
  /** The text to display after the icon (e.g., "Customer", "Plan", "Product", "Sign In", "Next") */
  label: string
  /** Click handler function */
  onClick: () => void
  /** Optional custom icon - defaults to Plus for create actions */
  icon?: LucideIcon
  /** Button size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'success'
  /** Button type for specific actions */
  actionType?: 'create' | 'auth' | 'navigation' | 'general'
  /** Whether button is disabled */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
  /** Whether to show motion animations */
  animated?: boolean
  /** Loading state */
  loading?: boolean
}

const ActionButton = ({
  label,
  onClick,
  icon: Icon,
  size = 'md',
  variant = 'primary',
  actionType = 'create',
  disabled = false,
  className = '',
  animated = true,
  loading = false
}: ActionButtonProps) => {
  // Set default icon based on action type if no icon provided
  const getDefaultIcon = () => {
    if (Icon) return Icon
    switch (actionType) {
      case 'create': return Plus
      case 'auth': return label.toLowerCase().includes('sign up') || label.toLowerCase().includes('register') ? UserPlus : LogIn
      case 'navigation': return ArrowRight
      default: return Plus
    }
  }
  
  const DefaultIcon = getDefaultIcon()
  const sizeClasses = {
    sm: 'px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base space-x-2 min-h-[48px] sm:min-h-[44px] touch-target',
    md: 'px-6 sm:px-7 py-3 sm:py-3.5 text-base sm:text-lg space-x-2 min-h-[52px] sm:min-h-[48px] touch-target',
    lg: 'px-8 sm:px-9 py-4 sm:py-4.5 text-lg sm:text-xl space-x-2 min-h-[56px] sm:min-h-[52px] touch-target'
  }

  const iconSizes = {
    sm: 'w-4 h-4 sm:w-3.5 sm:h-3.5',
    md: 'w-5 h-5 sm:w-4 sm:h-4', 
    lg: 'w-6 h-6 sm:w-5 sm:h-5'
  }

  const variants = {
    primary: 'bg-gradient-to-r from-[#D417C8] to-[#14BDEA] text-white font-medium hover:shadow-lg hover:shadow-[#D417C8]/30 transition-all duration-200 transform hover:scale-105',
    secondary: 'bg-gradient-to-r from-white/15 to-white/5 border border-white/25 text-white font-semibold hover:from-white/25 hover:to-white/10 hover:border-white/35 backdrop-blur-xl shadow-lg shadow-black/20',
    ghost: 'bg-transparent border border-transparent text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-white/15 hover:to-white/5 backdrop-blur-xl hover:border-white/20',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 border border-green-500/40 text-white font-medium hover:from-green-600 hover:to-emerald-600 hover:border-green-500/50 shadow-lg hover:shadow-green-500/30 shadow-green-500/20'
  }

  const baseClasses = `
    rounded-xl sm:rounded-2xl inline-flex items-center justify-center
    focus:outline-none focus:ring-2 focus:ring-[#D417C8]/60 focus:ring-offset-1 focus:ring-offset-transparent
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    relative isolate overflow-hidden
    transition-all duration-200 ease-out
    ${variants[variant]}
    ${sizeClasses[size]} 
    ${className}
    ${(disabled || loading) ? 'cursor-not-allowed opacity-50' : ''}
  `.trim()

  const ButtonComponent = animated ? motion.button : 'button'
  const motionProps = animated ? {
    whileHover: disabled || loading ? {} : { scale: 1.02, y: -1 },
    whileTap: disabled || loading ? {} : { scale: 0.98 },
    transition: { type: "spring" as const, stiffness: 400, damping: 10 }
  } : {}

  return (
    <ButtonComponent
      onClick={disabled || loading ? undefined : onClick}
      className={baseClasses}
      disabled={disabled || loading}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...motionProps}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          <DefaultIcon className={iconSizes[size]} />
          <span>{label}</span>
        </>
      )}
    </ButtonComponent>
  )
}

export { ActionButton }
