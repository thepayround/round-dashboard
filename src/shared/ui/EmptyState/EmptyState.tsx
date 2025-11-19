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
    <div className={cn('text-center py-12', className)}>
      {Icon && <Icon className="w-12 h-12 text-white/30 mx-auto mb-4" />}
      <h3 className="text-base font-medium text-white mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-white/60 max-w-md mx-auto mb-6">
          {description}
        </p>
      )}
      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant || 'primary'}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
