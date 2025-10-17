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
  primary: 'bg-[#D417C8] text-white font-medium hover:bg-[#BD2CD0] transition-all duration-150',
  secondary: 'bg-transparent border border-[#25262a] text-white font-medium hover:bg-[#1d1d20] hover:border-[#2c2d31] transition-all duration-150',
  ghost: 'bg-transparent border border-transparent text-[#a3a3a3] hover:text-white hover:bg-[#1d1d20] transition-all duration-150',
  danger: 'bg-red-600 text-white font-medium hover:bg-red-700 transition-all duration-150',
  success: 'bg-[#42E695] text-black font-medium hover:bg-[#3BD88B] transition-all duration-150',
  create: 'bg-[#D417C8] text-white font-medium hover:bg-[#BD2CD0] transition-all duration-150'
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
    focus:outline-none focus:ring-2 focus:ring-[#D417C8] focus:ring-offset-2 focus:ring-offset-[#000000]
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
              <div className={`flex items-center justify-center rounded-lg ${variant === 'primary' || variant === 'create' ? 'bg-white/15' : 'bg-white/5'} p-1`}>
                <Icon className="w-5 h-5" />
              </div>
            ) : (
              <Icon className="w-5 h-5" />
            )
          )}
          <span className={enhanced ? 'font-semibold' : ''}>{children}</span>
          {Icon && iconPosition === 'right' && (
            enhanced ? (
              <div className={`flex items-center justify-center rounded-lg ${variant === 'primary' || variant === 'create' ? 'bg-white/15' : 'bg-white/5'} p-1`}>
                <Icon className="w-5 h-5" />
              </div>
            ) : (
              <Icon className="w-5 h-5" />
            )
          )}
        </>
      )}
    </motion.button>
  )
})

Button.displayName = 'Button'
