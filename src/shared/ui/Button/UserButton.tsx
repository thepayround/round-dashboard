import { ChevronUp } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'

import { PlainButton } from './PlainButton'

import { cn } from '@/shared/utils/cn'

interface UserButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string
  subtitle?: string | null
  avatar: ReactNode
  collapsed?: boolean
  isExpanded?: boolean
}

export const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  (
    {
      name,
      subtitle,
      avatar,
      collapsed = false,
      isExpanded = false,
      className,
      ...props
    },
    ref
  ) => {
    const showArrow = !collapsed

    return (
      <PlainButton
        unstyled
        ref={ref}
        className={cn(
          'flex items-center rounded-lg transition-colors duration-200 w-full h-11 text-white/60 hover:text-white',
          collapsed ? 'justify-center px-0' : 'justify-start gap-4',
          className
        )}
        {...props}
      >
        <span className={cn('flex-shrink-0', collapsed ? '' : 'mr-3')}>{avatar}</span>

        {!collapsed && (
          <span className="flex-1 text-left overflow-hidden">
            <span className="block font-medium text-sm text-white truncate leading-tight">{name}</span>
            {subtitle && (
              <span className="block text-xs text-white/60 truncate leading-tight">{subtitle}</span>
            )}
          </span>
        )}

        {showArrow && (
          <ChevronUp
            className={cn(
              'w-4 h-4 text-white/60 transition-transform duration-200 flex-shrink-0',
              isExpanded ? 'rotate-0' : 'rotate-180'
            )}
            aria-hidden="true"
          />
        )}
      </PlainButton>
    )
  }
)

UserButton.displayName = 'UserButton'
