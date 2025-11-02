import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import React from 'react'

import { cn } from '@/shared/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-normal transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:opacity-90 focus-visible:ring-primary',
        secondary: 'bg-secondary text-white hover:opacity-90 focus-visible:ring-secondary',
        outline: 'border border-white/20 text-white hover:bg-white/10 focus-visible:ring-white/50',
        ghost: 'text-white/70 hover:text-white hover:bg-white/10',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500',
        success: 'bg-green-500 text-white hover:bg-green-600 focus-visible:ring-green-500',
      },
      size: {
        xs: 'h-7 px-2 text-xs',
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-12 px-8 text-lg',
        xl: 'h-14 px-10 text-xl',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Icon to display before label */
  leftIcon?: React.ElementType
  /** Icon to display after label */
  rightIcon?: React.ElementType
  /** Loading state - shows spinner and disables interaction */
  isLoading?: boolean
  /** Loading text to show when isLoading is true */
  loadingText?: string
  /** Children content */
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      isLoading,
      loadingText,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && LeftIcon && <LeftIcon className="mr-2 h-4 w-4" />}
        {isLoading ? loadingText || children : children}
        {!isLoading && RightIcon && <RightIcon className="ml-2 h-4 w-4" />}
      </button>
    )
  }
)

Button.displayName = 'Button'
