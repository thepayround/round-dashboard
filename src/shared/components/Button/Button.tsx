import type { LucideIcon } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  /** Button size */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Optional icon (Lucide icon component) */
  icon?: LucideIcon
  /** Icon position relative to text */
  iconPosition?: 'left' | 'right'
  /** Loading state - shows spinner and disables button */
  loading?: boolean
  /** Makes button full width */
  fullWidth?: boolean
  /** Button content */
  children: React.ReactNode
}

const variants = {
  primary: 'bg-[#D417C8] text-white border border-[#D417C8] hover:bg-[#E02DD8]',
  secondary: 'bg-transparent text-white border border-white/20 hover:bg-white/5',
  ghost: 'bg-transparent text-white/80 border border-transparent hover:bg-white/5',
  danger: 'bg-transparent text-white border border-red-500/30 hover:bg-red-500/10'
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs h-8',
  md: 'px-4 py-1.5 text-sm h-9',
  lg: 'px-4 py-1.5 text-sm h-9',
  xl: 'px-5 py-2 text-base h-10'
}

const iconSizes = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-4 h-4',
  xl: 'w-5 h-5'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
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
    },
    ref
  ) => {
    const isDisabled = disabled ?? loading

    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center gap-2
          rounded-lg font-normal tracking-tight
          transition-all duration-200
          outline-none
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className={`${iconSizes[size]} animate-spin`} />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {Icon && iconPosition === 'left' && <Icon className={iconSizes[size]} />}
            <span>{children}</span>
            {Icon && iconPosition === 'right' && <Icon className={iconSizes[size]} />}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
