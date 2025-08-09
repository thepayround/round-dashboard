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
  variant?: 'primary' | 'secondary' | 'ghost'
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
    sm: 'px-4 py-2.5 text-sm gap-2',
    md: 'px-6 py-3 text-base gap-2.5',
    lg: 'px-8 py-4 text-lg gap-3'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6'
  }

  const variants = {
    primary: 'bg-gradient-to-r from-[#D417C8] to-[#7767DA] border border-[#D417C8]/40 text-white font-bold hover:from-[#BD2CD0] hover:to-[#6B5CE8] hover:border-[#BD2CD0]/50 shadow-lg hover:shadow-[#D417C8]/30 shadow-[#D417C8]/20',
    secondary: 'bg-gradient-to-r from-white/15 to-white/5 border border-white/25 text-white font-semibold hover:from-white/25 hover:to-white/10 hover:border-white/35 backdrop-blur-xl shadow-lg shadow-black/20',
    ghost: 'bg-transparent border border-transparent text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-white/15 hover:to-white/5 backdrop-blur-xl hover:border-white/20'
  }

  const baseClasses = `
    rounded-xl transition-all duration-300 flex items-center justify-center
    focus:outline-none focus:ring-2 focus:ring-[#D417C8]/60 focus:ring-offset-1 focus:ring-offset-transparent
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    font-medium relative isolate overflow-hidden
    ${variants[variant]}
    ${sizeClasses[size]} 
    ${className}
  `.trim()

  const ButtonComponent = animated ? motion.button : 'button'
  const motionProps = animated ? {
    whileHover: disabled ? {} : { scale: 1.02, y: -1 },
    whileTap: disabled ? {} : { scale: 0.98 },
    transition: { type: "spring" as const, stiffness: 400, damping: 10 }
  } : {}

  return (
    <ButtonComponent
      onClick={disabled ? undefined : onClick}
      className={baseClasses}
      disabled={disabled}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...motionProps}
    >
      {/* Icon container with subtle background for better visual hierarchy */}
      <div className={`flex items-center justify-center rounded-lg ${variant === 'primary' ? 'bg-white/10' : 'bg-current/10'} p-1`}>
        <Icon className={iconSizes[size]} />
      </div>
      <span className="font-semibold">{label}</span>
      
      {/* Subtle shine effect for primary variant */}
      {variant === 'primary' && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-pulse" />
        </div>
      )}
    </ButtonComponent>
  )
}

export { CreateButton }
