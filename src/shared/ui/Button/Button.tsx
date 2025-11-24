import type { LucideIcon } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link'
  /** Button size */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Optional icon (Lucide icon component) */
  icon?: LucideIcon
  /** Icon position relative to text */
  iconPosition?: 'left' | 'right'
  /** Loading state - shows spinner and disables button */
  isLoading?: boolean
  /** Makes button full width */
  fullWidth?: boolean
  /** Button content */
  children: React.ReactNode
}

const variants = {
  primary: 'bg-primary text-primary-contrast hover:bg-primary-hover shadow-sm hover:shadow-md border border-transparent',
  secondary: 'bg-bg-raised text-fg border border-border hover:bg-bg-hover hover:border-border-hover shadow-sm',
  ghost: 'bg-transparent text-fg-muted border border-transparent hover:bg-bg-hover hover:text-fg',
  danger: 'bg-transparent text-destructive border border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50',
  link: 'bg-transparent text-primary border border-transparent hover:underline p-0 h-auto'
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs h-8',
  md: 'px-4 py-2 text-sm h-10', // Standard 40px
  lg: 'px-6 py-2.5 text-base h-12',
  xl: 'px-8 py-3 text-lg h-14'
}

const iconSizes = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      isLoading = false,
      fullWidth = false,
      children,
      className = '',
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled ?? isLoading

    return (
      <button
        ref={ref}
        type={type}
        className={`
          inline-flex items-center justify-center gap-1.5
          rounded-lg font-normal tracking-tight
          transition-all duration-200
          outline-none focus-visible:ring-1 focus-visible:ring-[#14bdea] focus-visible:ring-offset-1 focus-visible:ring-offset-black
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        disabled={isDisabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && <span className="sr-only" aria-live="polite">Loading...</span>}
        {isLoading && Icon && iconPosition === 'left' && (
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
        )}
        {!isLoading && Icon && iconPosition === 'left' && (
          <Icon className={iconSizes[size]} />
        )}
        {children}
        {isLoading && Icon && iconPosition === 'right' && (
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
        )}
        {!isLoading && Icon && iconPosition === 'right' && (
          <Icon className={iconSizes[size]} />
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
