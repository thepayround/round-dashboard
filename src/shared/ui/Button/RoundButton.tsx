import type { ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'

import { PlainButton } from './PlainButton'

import { cn } from '@/shared/utils/cn'


type RoundButtonVariant = 'primary' | 'secondary' | 'success' | 'ghost' | 'outline' | 'danger'
type RoundButtonSize = 'sm' | 'md' | 'lg'
type RoundButtonShape = 'circle' | 'pill'

export interface RoundButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: RoundButtonVariant
  size?: RoundButtonSize
  shape?: RoundButtonShape
  /** Adds a soft glow for primary states (e.g. active step) */
  glow?: boolean
}

const baseClasses =
  'inline-flex items-center justify-center rounded-full border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed'

const circleSizes: Record<RoundButtonSize, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base'
}

const pillSizes: Record<RoundButtonSize, string> = {
  sm: 'px-3 py-1 text-xs h-auto min-h-0',
  md: 'px-4 py-1.5 text-sm h-auto min-h-0',
  lg: 'px-5 py-2 text-base h-auto min-h-0'
}

const variantClasses: Record<RoundButtonVariant, string> = {
  primary: 'bg-gradient-to-br from-primary to-[#7767DA] border-transparent text-white shadow-lg shadow-primary/20',
  secondary: 'bg-[#1e1f22] border-white/20 text-white/80 hover:border-white/40',
  success: 'bg-[#42E695] border-[#42E695] text-black font-medium',
  ghost: 'bg-[#1a1b1f] border-white/10 text-white/70 hover:border-white/30 hover:text-white',
  outline: 'bg-transparent border-white/30 text-white/70 hover:border-white/60 hover:text-white',
  danger: 'bg-[#2a0d16] border-[#f87171]/40 text-[#f87171] hover:border-[#f87171]/70'
}

export const RoundButton = forwardRef<HTMLButtonElement, RoundButtonProps>(
  ({ variant = 'ghost', size = 'md', shape = 'circle', glow = false, className = '', ...props }, ref) => {
    return (
      <PlainButton
        ref={ref}
        className={cn(
          baseClasses,
          shape === 'circle' ? circleSizes[size] : pillSizes[size],
          variantClasses[variant],
          glow && 'shadow-[0_0_25px_rgba(212,23,200,0.3)]',
          className
        )}
        {...props}
      />
    )
  }
)

RoundButton.displayName = 'RoundButton'

