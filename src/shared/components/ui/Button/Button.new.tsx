import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'prefix'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'link'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  trailingIcon?: React.ReactNode
  'data-testid'?: string
}

/**
 * Dev-SaaS Minimal Button Component
 * 
 * Influenced by: Polar • Supabase • Cursor
 * 
 * Features:
 * - Clean, minimal design with no gradients
 * - Accent color (Supabase green) for primary actions
 * - Subtle elevation with shadows
 * - Keyboard accessible with focus rings
 * - Loading states with spinner
 * - Icon support (leading/trailing)
 * 
 * Variants:
 * - primary: accent background, white text
 * - secondary: subtle surface, 1px border
 * - ghost: transparent, hover raise
 * - destructive: red background
 * - link: text-only with underline on hover
 * 
 * Sizes:
 * - sm: 32px height
 * - md: 40px height (default)
 * - lg: 48px height
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    icon,
    trailingIcon,
    children,
    type,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    form,
    name,
    value,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'data-testid': dataTestId,
  }, ref) => {
    const base = "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-[background,box-shadow,transform] duration-fast ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
    
    const sizes = {
      sm: "h-8 px-3 text-[13px]",
      md: "h-10 px-4 text-[14px]",
      lg: "h-12 px-5 text-[15px]",
    }
    
    const variants = {
      primary: "bg-primary text-white shadow-card hover:shadow-hover hover:brightness-110 active:translate-y-[1px]",
      secondary: "bg-secondary text-white shadow-card hover:shadow-hover hover:brightness-110 active:translate-y-[1px]",
      ghost: "text-fg hover:bg-elev-1 active:bg-elev-2",
      destructive: "bg-destructive text-white hover:brightness-105 active:translate-y-[1px] shadow-card",
      link: "text-primary underline-offset-4 hover:underline px-0 h-auto",
    }

    const isDisabled = disabled ?? loading

    return (
      <button
        ref={ref}
        type={type}
        name={name}
        value={value}
        form={form}
        className={cn(base, sizes[size], variants[variant], className)}
        disabled={isDisabled}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        data-testid={dataTestId}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!loading && icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
        {!loading && trailingIcon && <span className="flex-shrink-0">{trailingIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'

