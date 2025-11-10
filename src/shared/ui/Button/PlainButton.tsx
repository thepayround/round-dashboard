import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/shared/utils/cn'

export interface PlainButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Removes default styling so consumers can control everything */
  unstyled?: boolean
}

export const PlainButton = forwardRef<HTMLButtonElement, PlainButtonProps>(
  ({ className = '', unstyled = false, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        unstyled
          ? ''
          : 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  )
)

PlainButton.displayName = 'PlainButton'

