import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'

import { cn } from '@/shared/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-normal transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-white/10 text-white border border-white/20',
        primary: 'bg-primary/20 text-primary border border-primary/30',
        secondary: 'bg-secondary/20 text-secondary border border-secondary/30',
        success: 'bg-green-500/20 text-green-400 border border-green-500/30',
        warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
        danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
        info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-0.5',
        lg: 'text-base px-3 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Icon to display before text */
  icon?: React.ElementType
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, icon: Icon, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {Icon && <Icon className="mr-1 h-3 w-3" />}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

