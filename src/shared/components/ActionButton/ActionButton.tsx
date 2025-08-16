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
    sm: 'px-4 py-2 text-sm space-x-2 h-12 font-medium', // 48px - standard button height
    md: 'px-6 py-3 text-base space-x-2.5 h-12 font-semibold', // 48px - same height, more padding
    lg: 'px-8 py-4 text-lg space-x-3 h-16 font-bold' // 64px - prominent actions
  }

  const iconSizes = {
    sm: 'w-4 h-4', // 16px - balanced for 40px buttons
    md: 'w-5 h-5', // 20px - balanced for 48px buttons  
    lg: 'w-6 h-6'  // 24px - balanced for 56px buttons
  }

  const variants = {
    primary: 'bg-gradient-to-r from-[#D417C8] to-[#14BDEA] text-white font-semibold hover:shadow-xl hover:shadow-[#D417C8]/40 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-[#7767DA]/20',
    secondary: 'bg-gradient-to-r from-white/20 to-white/8 border border-white/30 text-white font-semibold hover:from-white/30 hover:to-white/15 hover:border-white/40 backdrop-blur-xl shadow-xl shadow-black/30 hover:shadow-2xl hover:shadow-black/40',
    ghost: 'bg-transparent border border-white/20 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-white/20 hover:to-white/8 backdrop-blur-xl hover:border-white/30 hover:shadow-lg hover:shadow-black/20',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 border border-green-500/50 text-white font-semibold hover:from-green-600 hover:to-emerald-600 hover:border-green-500/60 shadow-xl hover:shadow-green-500/40 shadow-green-500/25'
  }

  const baseClasses = `
    rounded-lg inline-flex items-center justify-center
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
