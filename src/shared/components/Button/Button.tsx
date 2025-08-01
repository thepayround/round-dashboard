import { forwardRef } from 'react'
import type { HTMLMotionProps } from 'framer-motion';
import { motion } from 'framer-motion'
import type { LucideIcon} from 'lucide-react';
import { Loader2 } from 'lucide-react'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  loading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}

const variants = {
  primary: 'bg-gradient-to-r from-[#D417C8] to-[#7767DA] border-2 border-[#D417C8]/30 text-white font-bold hover:from-[#BD2CD0] hover:to-[#6B5CE8] hover:border-[#BD2CD0]/40 shadow-lg',
  secondary: 'bg-white/10 border-2 border-white/20 text-white font-semibold hover:bg-white/20 hover:border-white/30',
  ghost: 'bg-transparent border-2 border-transparent text-gray-300 hover:text-white hover:bg-white/10',
  danger: 'bg-gradient-to-r from-red-500 to-pink-500 border-2 border-red-500/30 text-white font-bold hover:from-red-600 hover:to-pink-600 hover:border-red-500/40 shadow-lg',
  success: 'bg-gradient-to-r from-green-500 to-emerald-500 border-2 border-green-500/30 text-white font-bold hover:from-green-600 hover:to-emerald-600 hover:border-green-500/40 shadow-lg'
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}, ref) => {
  const baseClasses = `
    rounded-xl transition-all duration-200 flex items-center justify-center gap-2
    focus:outline-none focus:ring-2 focus:ring-[#D417C8]/50 focus:ring-offset-2 focus:ring-offset-gray-900
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
  `

  const variantClasses = variants[variant]
  const sizeClasses = sizes[size]
  const widthClasses = fullWidth ? 'w-full' : ''

  const isDisabled = disabled ?? loading

  return (
    <motion.button
      ref={ref}
      whileHover={!isDisabled ? { scale: 1.05, y: -2 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${className}`}
      disabled={isDisabled}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
        </>
      )}
    </motion.button>
  )
})

Button.displayName = 'Button'
