import { forwardRef } from 'react'
import type { HTMLMotionProps } from 'framer-motion';
import { motion } from 'framer-motion'
import type { LucideIcon} from 'lucide-react';
import { Loader2 } from 'lucide-react'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'create'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  loading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
  /** Enhanced styling for action buttons with better visual hierarchy */
  enhanced?: boolean
}

const variants = {
  primary: 'bg-gradient-to-r from-[#D417C8] to-[#14BDEA] text-white font-medium hover:shadow-lg hover:shadow-[#D417C8]/30 transition-all duration-200 transform hover:scale-105',
  secondary: 'bg-gradient-to-r from-white/15 to-white/5 border border-white/25 text-white font-semibold hover:from-white/25 hover:to-white/10 hover:border-white/35 backdrop-blur-xl shadow-lg shadow-black/20',
  ghost: 'bg-transparent border border-transparent text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-white/15 hover:to-white/5 backdrop-blur-xl hover:border-white/20',
  danger: 'bg-gradient-to-r from-red-500 to-pink-500 border border-red-500/40 text-white font-medium hover:from-red-600 hover:to-pink-600 hover:border-red-500/50 shadow-lg hover:shadow-red-500/30 shadow-red-500/20 transition-all duration-200 transform hover:scale-105',
  success: 'bg-gradient-to-r from-green-500 to-emerald-500 border border-green-500/40 text-white font-medium hover:from-green-600 hover:to-emerald-600 hover:border-green-500/50 shadow-lg hover:shadow-green-500/30 shadow-green-500/20 transition-all duration-200 transform hover:scale-105',
  create: 'bg-gradient-to-r from-[#D417C8] to-[#14BDEA] text-white font-medium hover:shadow-lg hover:shadow-[#D417C8]/30 transition-all duration-200 transform hover:scale-105 relative overflow-hidden'
}

const sizes = {
  sm: 'px-4 py-2.5 text-sm min-h-[40px]',  // Improved touch targets
  md: 'px-6 py-3 text-base min-h-[44px]',
  lg: 'px-8 py-4 text-lg min-h-[48px]',
  xl: 'px-10 py-5 text-xl min-h-[56px]'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  enhanced = false,
  children,
  className = '',
  disabled,
  ...props
}, ref) => {
  const baseClasses = `
    rounded-xl transition-all duration-300 flex items-center justify-center gap-2
    focus:outline-none focus:ring-2 focus:ring-[#D417C8]/60 focus:ring-offset-1 focus:ring-offset-transparent
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    relative isolate
  `

  const variantClasses = variants[variant]
  const sizeClasses = sizes[size]
  const widthClasses = fullWidth ? 'w-full' : ''

  const isDisabled = disabled ?? loading

  const motionProps = enhanced ? {
    whileHover: !isDisabled ? { scale: 1.02, y: -1 } : {},
    whileTap: !isDisabled ? { scale: 0.98 } : {},
    transition: { type: "spring" as const, stiffness: 400, damping: 10 }
  } : {
    whileHover: !isDisabled ? { scale: 1.05, y: -2 } : {},
    whileTap: !isDisabled ? { scale: 0.95 } : {}
  }

  return (
    <motion.button
      ref={ref}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...motionProps}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${className}`}
      disabled={isDisabled}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            enhanced ? (
              <div className={`flex items-center justify-center rounded-lg ${variant === 'primary' || variant === 'create' ? 'bg-white/10' : 'bg-current/10'} p-1`}>
                <Icon className="w-5 h-5" />
              </div>
            ) : (
              <Icon className="w-5 h-5" />
            )
          )}
          <span className={enhanced ? 'font-semibold' : ''}>{children}</span>
          {Icon && iconPosition === 'right' && (
            enhanced ? (
              <div className={`flex items-center justify-center rounded-lg ${variant === 'primary' || variant === 'create' ? 'bg-white/10' : 'bg-current/10'} p-1`}>
                <Icon className="w-5 h-5" />
              </div>
            ) : (
              <Icon className="w-5 h-5" />
            )
          )}
        </>
      )}
      
      {/* Enhanced shine effects for create and primary variants */}
      {enhanced && (variant === 'primary' || variant === 'create') && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-pulse" />
        </div>
      )}
    </motion.button>
  )
})

Button.displayName = 'Button'
