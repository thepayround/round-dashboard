import { motion } from 'framer-motion'
import { forwardRef } from 'react'

import type { ButtonProps } from './Button.types'

import { cn } from '@/shared/utils/cn'

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const baseClasses =
      'inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary: 'bg-gradient-primary text-white hover:shadow-lg transform hover:scale-105',
      secondary: 'bg-gradient-secondary text-white hover:shadow-lg transform hover:scale-105',
      glass: 'glass-card glass-card-hover text-white',
      outline: 'border-2 border-glass-border bg-transparent text-white hover:bg-glass-hover',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-xs rounded-lg h-8',
      md: 'px-4 py-2 text-sm rounded-lg h-10',
      lg: 'px-6 py-3 text-base rounded-lg h-12',
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: variant === 'outline' ? 1.02 : 1.05 }}
        whileTap={{ scale: 0.98 }}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        disabled={isLoading}
        // eslint-disable-next-line react/jsx-props-no-spreading, @typescript-eslint/no-explicit-any
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
