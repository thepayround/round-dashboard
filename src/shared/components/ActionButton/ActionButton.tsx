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
    primary: `
      bg-gradient-to-r from-[#D417C8]/70 to-[#14BDEA]/70 backdrop-blur-md
      text-white font-semibold
      shadow-lg shadow-black/20
      hover:shadow-[0_0_20px_rgba(212,23,200,0.4),0_0_15px_rgba(20,189,234,0.3)]
      hover:from-[#D417C8] hover:to-[#14BDEA]
      transition-all duration-300 ease-out
      relative overflow-hidden
    `,
    secondary: `
      bg-gradient-to-r from-gray-700/80 to-gray-800/80 backdrop-blur-md
      text-white font-semibold
      shadow-lg shadow-black/20
      hover:shadow-[0_0_20px_rgba(107,114,128,0.5),0_0_15px_rgba(148,163,184,0.3)]
      hover:from-gray-600/90 hover:to-gray-700/90
      transition-all duration-300 ease-out
      relative overflow-hidden
    `,
    ghost: `
      bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md
      border border-white/20 
      text-gray-300 hover:text-white
      hover:bg-gradient-to-r hover:from-white/15 hover:to-white/8
      hover:border-white/30
      hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]
      transition-all duration-300 ease-out
    `,
    success: `
      bg-gradient-to-r from-green-600 to-emerald-600
      border border-green-500/30 
      text-white font-semibold
      shadow-[0_0_25px_rgba(34,197,94,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]
      hover:shadow-[0_0_35px_rgba(34,197,94,0.6),inset_0_1px_0_rgba(255,255,255,0.3)]
      hover:from-green-500 hover:to-emerald-500
      hover:border-green-400/50
      transition-all duration-300 ease-out
    `
  }

  const baseClasses = `
    rounded-lg inline-flex items-center justify-center
    focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:ring-offset-2 focus:ring-offset-transparent
    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none
    disabled:hover:bg-gradient-to-r disabled:hover:from-white/8 disabled:hover:to-white/4
    relative isolate overflow-hidden
    group
    ${variants[variant]}
    ${sizeClasses[size]} 
    ${className}
  `.trim()

  const ButtonComponent = animated ? motion.button : 'button'
  const motionProps = animated ? {
    whileHover: disabled || loading ? {} : { 
      y: -1,
      transition: { type: "spring" as const, stiffness: 300, damping: 20 }
    },
    whileTap: disabled || loading ? {} : { 
      y: 0,
      transition: { type: "spring" as const, stiffness: 400, damping: 25 }
    },
    initial: { y: 0 },
    transition: { type: "spring" as const, stiffness: 300, damping: 20 }
  } : {}

  return (
    <ButtonComponent
      onClick={disabled || loading ? undefined : onClick}
      className={baseClasses}
      disabled={disabled || loading}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...motionProps}
    >
      {/* Luxury shine effect overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
      </div>
      
      {loading ? (
        <>
          <div className="relative">
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <div className="absolute inset-0 w-5 h-5 border-2 border-transparent border-t-pink-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
          </div>
          <span className="relative z-10">Loading...</span>
        </>
      ) : (
        <>
          <DefaultIcon className={`${iconSizes[size]} relative z-10 drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]`} />
          <span className="relative z-10 drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">{label}</span>
        </>
      )}
    </ButtonComponent>
  )
}

export { ActionButton }
