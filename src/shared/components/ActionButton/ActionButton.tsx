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
    sm: 'px-3 py-2 text-xs space-x-1.5 h-11 md:h-9 font-medium', // 44px mobile -> 36px desktop
    md: 'px-4 py-2.5 text-sm space-x-2 h-11 md:h-9 font-medium', // 44px mobile -> 36px desktop
    lg: 'px-5 py-3 text-sm space-x-2.5 h-11 md:h-9 font-semibold' // 44px mobile -> 36px desktop
  }

  const iconSizes = {
    sm: 'w-3.5 h-3.5', // 14px - balanced for 36px buttons
    md: 'w-4 h-4', // 16px - balanced for 40px buttons  
    lg: 'w-4 h-4'  // 16px - consistent small icons for premium feel
  }

  const variants = {
    primary: `
      bg-gradient-to-r from-[#D417C8]/60 to-[#14BDEA]/60 backdrop-blur-md
      text-white
      shadow-md shadow-black/10
      hover:shadow-[0_0_12px_rgba(212,23,200,0.25)]
      hover:from-[#D417C8]/70 hover:to-[#14BDEA]/70
      transition-all duration-200 ease-out
    `,
    secondary: `
      bg-white/4 backdrop-blur-md
      text-gray-200 hover:text-white
      shadow-md shadow-black/10
      border border-white/8 hover:border-white/15
      hover:bg-white/8
      transition-all duration-200 ease-out
    `,
    ghost: `
      bg-transparent
      border border-white/10 hover:border-white/20
      text-gray-300 hover:text-white
      hover:bg-white/5
      transition-all duration-200 ease-out
    `,
    success: `
      bg-gradient-to-r from-emerald-600/80 to-green-600/80
      text-white
      shadow-md shadow-emerald-500/10
      hover:shadow-[0_0_12px_rgba(34,197,94,0.25)]
      hover:from-emerald-600/90 hover:to-green-600/90
      transition-all duration-200 ease-out
    `
  }

  const baseClasses = `
    rounded-lg inline-flex items-center justify-center
    focus:outline-none
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
      
      {loading ? (
        <>
          <div className="relative">
            <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
          </div>
          <span className="relative z-10 text-xs">Loading...</span>
        </>
      ) : (
        <>
          <span className="relative z-10 drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">{label}</span>
          <DefaultIcon className={`${iconSizes[size]} relative z-10 drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]`} />
        </>
      )}
    </ButtonComponent>
  )
}

export { ActionButton }
