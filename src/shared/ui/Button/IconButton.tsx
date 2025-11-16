import type { LucideIcon } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Icon component to display */
  icon: LucideIcon
  /** Visual style variant */
  variant?: 'default' | 'danger' | 'ghost'
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  /** Loading state - shows spinner and disables button */
  loading?: boolean
  /** Accessible label for screen readers */
  'aria-label': string
}

const variants = {
  default: 'text-white/50 border border-transparent hover:bg-white/5',
  danger: 'text-white/50 border border-transparent hover:bg-red-500/10',
  ghost: 'text-white/50 border border-transparent hover:bg-white/5'
}

const sizes = {
  sm: 'p-2 w-11 h-11 lg:w-9 lg:h-9',
  md: 'p-2.5 w-11 h-11 lg:w-9 lg:h-9',
  lg: 'p-2.5 w-12 h-12 lg:w-9 lg:h-9'
}

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-4 h-4',
  lg: 'w-4 h-4'
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon: Icon,
      variant = 'default',
      size = 'md',
      loading = false,
      className = '',
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled ?? loading

    return (
      <button
        ref={ref}
        type={type}
        className={`
          inline-flex items-center justify-center
          rounded-lg
          transition-all duration-200
          outline-none focus-visible:ring-2 focus-visible:ring-[#14bdea] focus-visible:ring-offset-2 focus-visible:ring-offset-black
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading && <span className="sr-only" aria-live="polite">Loading...</span>}
        {loading ? (
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
        ) : (
          <Icon className={iconSizes[size]} />
        )}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'
