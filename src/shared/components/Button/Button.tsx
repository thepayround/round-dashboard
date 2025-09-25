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
  primary: 'bg-gradient-to-r from-[#D417C8] to-[#14BDEA] text-white font-medium shadow-btn-premium hover:shadow-btn-hover transition-all duration-150',
  secondary: 'bg-glass-bg-light border border-glass-border-light text-white font-medium hover:bg-glass-hover hover:border-glass-hover-border backdrop-blur-xl shadow-glass-sm',
  ghost: 'bg-transparent border border-transparent text-gray-300 hover:text-white hover:bg-glass-bg backdrop-blur-xl hover:border-glass-border',
  danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:from-red-600 hover:to-pink-600 shadow-glass-sm hover:shadow-glass-md transition-all duration-150',
  success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:from-green-600 hover:to-emerald-600 shadow-glass-sm hover:shadow-glass-md transition-all duration-150',
  create: 'bg-gradient-to-r from-[#D417C8] to-[#14BDEA] text-white font-medium shadow-btn-premium hover:shadow-btn-hover transition-all duration-150 relative overflow-hidden'
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs h-11 md:h-9',     // 44px mobile -> 36px desktop
  md: 'px-4 py-1.5 text-xs h-11 md:h-9',     // 44px mobile -> 36px desktop
  lg: 'px-5 py-1.5 text-xs h-11 md:h-9',     // 44px mobile -> 36px desktop
  xl: 'px-6 py-1.5 text-sm h-11 md:h-9'      // 44px mobile -> 36px desktop
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
    rounded-lg transition-all duration-150 flex items-center justify-center gap-1
    focus:outline-none focus:ring-1 focus:ring-[#D417C8]/30 focus:ring-offset-1 focus:ring-offset-transparent
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    relative isolate font-medium
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
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/4 to-transparent transform -skew-x-12 animate-pulse" />
        </div>
      )}
    </motion.button>
  )
})

Button.displayName = 'Button'
