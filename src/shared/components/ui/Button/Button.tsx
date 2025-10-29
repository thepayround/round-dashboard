import { motion } from 'framer-motion'
import { forwardRef } from 'react'

import type { ButtonProps, ButtonVariant, ButtonSize } from './Button.types'

import { cn } from '@/shared/utils/cn'

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, type = 'button', ...props }, ref) => {
    const baseClasses =
      'inline-flex items-center justify-center font-normal tracking-tight transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-primary text-white hover:shadow-hover hover:brightness-105 active:translate-y-[1px]',
      secondary: 'bg-secondary text-white hover:shadow-hover hover:brightness-105 active:translate-y-[1px]',
      glass: 'glass-card glass-card-hover text-white',
      outline: 'border-2 border-glass-border bg-transparent text-white hover:bg-glass-hover',
    }

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-xs rounded-lg h-[42px] md:h-9',     // 42px mobile -> 36px desktop
      md: 'px-4 py-2 text-sm rounded-lg h-[42px] md:h-9',       // 42px mobile -> 36px desktop
      lg: 'px-6 py-3 text-base rounded-lg h-[42px] md:h-9',     // 42px mobile -> 36px desktop
    }

    return (
      <motion.button
        ref={ref}
        type={type}
        whileHover={{ scale: variant === 'outline' ? 1.02 : 1.05 }}
        whileTap={{ scale: 0.98 }}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        disabled={isLoading}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(props as any)}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
