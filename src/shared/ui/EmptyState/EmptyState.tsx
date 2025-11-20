import type { LucideIcon } from 'lucide-react'

import { Button } from '../Button'
import type { ButtonProps } from '../Button/Button'

import { cn } from '@/shared/utils/cn'

export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: ButtonProps['variant']
  }
  className?: string
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <div className={cn('text-center py-8', className)}>
      {Icon && <Icon className="w-10 h-10 text-white/60 mx-auto mb-2" />}
      <h3 className="text-sm font-medium text-white mb-1.5">{title}</h3>
      {description && (
        <p className="text-xs text-white/60 max-w-md mx-auto mb-4">
          {description}
        </p>
      )}
      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant || 'primary'}
          size="md"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
