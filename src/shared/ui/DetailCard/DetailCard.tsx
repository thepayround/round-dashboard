import { Edit } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/shared/ui/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/shadcn/card'
import { cn } from '@/shared/utils/cn'

interface DetailCardProps {
  title: string
  children: React.ReactNode
  onEdit?: () => void
  editLabel?: string
  className?: string
  headerClassName?: string
  contentClassName?: string
  /** Optional icon to display next to the title */
  icon?: React.ReactNode
  /** Optional badge/status to display in header */
  badge?: React.ReactNode
  /** Optional actions to display in header (besides edit) */
  actions?: React.ReactNode
}

/**
 * DetailCard - A consistent card component for displaying detail sections
 *
 * Features:
 * - Proper shadcn Card structure
 * - Optional edit button with focus states
 * - Consistent spacing and typography
 * - Accessible with proper ARIA labels
 */
export const DetailCard = React.forwardRef<HTMLDivElement, DetailCardProps>(
  (
    {
      title,
      children,
      onEdit,
      editLabel,
      className,
      headerClassName,
      contentClassName,
      icon,
      badge,
      actions,
    },
    ref
  ) => {
    return (
      <Card ref={ref} className={cn('overflow-hidden', className)}>
        <CardHeader className={cn('pb-4', headerClassName)}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              {icon && (
                <span className="text-muted-foreground shrink-0">{icon}</span>
              )}
              <CardTitle className="text-sm font-medium tracking-normal truncate">
                {title}
              </CardTitle>
              {badge}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {actions}
              {onEdit && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onEdit}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  aria-label={editLabel || `Edit ${title.toLowerCase()}`}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className={cn('pt-0', contentClassName)}>
          {children}
        </CardContent>
      </Card>
    )
  }
)
DetailCard.displayName = 'DetailCard'

interface InfoItemProps {
  label: string
  children: React.ReactNode
  /** Display value in monospace font */
  mono?: boolean
  /** Optional icon to display before the value */
  icon?: React.ReactNode
  /** Make the entire row clickable */
  onClick?: () => void
  /** Custom class for the container */
  className?: string
}

/**
 * InfoItem - A consistent label-value pair for detail cards
 *
 * Features:
 * - Proper semantic structure
 * - Responsive layout (stacks on mobile if needed)
 * - Support for icons and custom formatting
 * - Accessible focus states for interactive items
 */
export const InfoItem = React.forwardRef<HTMLDivElement, InfoItemProps>(
  ({ label, children, mono, icon, onClick, className }, ref) => {
    const content = (
      <>
        <dt className="text-sm text-muted-foreground">{label}</dt>
        <dd
          className={cn(
            'text-sm text-foreground text-right flex items-center justify-end gap-1.5',
            mono && 'font-mono text-xs'
          )}
        >
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </dd>
      </>
    )

    if (onClick) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={onClick}
          className={cn(
            'w-full flex items-center justify-between py-3 -mx-1 px-1 rounded-md',
            'transition-colors hover:bg-muted/50',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card',
            className
          )}
        >
          {content}
        </button>
      )
    }

    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-between py-3', className)}
      >
        {content}
      </div>
    )
  }
)
InfoItem.displayName = 'InfoItem'

interface InfoListProps {
  children: React.ReactNode
  className?: string
  /** Use dividers between items */
  divided?: boolean
}

/**
 * InfoList - A semantic list container for InfoItems
 *
 * Uses proper <dl> semantic markup for accessibility
 */
export const InfoList = React.forwardRef<HTMLDListElement, InfoListProps>(
  ({ children, className, divided = true }, ref) => {
    return (
      <dl
        ref={ref}
        className={cn(
          divided && '[&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-border',
          className
        )}
      >
        {children}
      </dl>
    )
  }
)
InfoList.displayName = 'InfoList'

interface StatusBadgeProps {
  status: 'enabled' | 'disabled' | 'active' | 'inactive' | 'pending' | 'error'
  label?: string
  className?: string
}

/**
 * StatusBadge - Consistent status indicator badge
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  className,
}) => {
  const statusConfig = {
    enabled: {
      className: 'bg-success/10 text-success border-success/20',
      defaultLabel: 'Enabled',
    },
    disabled: {
      className: 'bg-muted text-muted-foreground border-border',
      defaultLabel: 'Disabled',
    },
    active: {
      className: 'bg-success/10 text-success border-success/20',
      defaultLabel: 'Active',
    },
    inactive: {
      className: 'bg-muted text-muted-foreground border-border',
      defaultLabel: 'Inactive',
    },
    pending: {
      className: 'bg-warning/10 text-warning border-warning/20',
      defaultLabel: 'Pending',
    },
    error: {
      className: 'bg-destructive/10 text-destructive border-destructive/20',
      defaultLabel: 'Error',
    },
  }

  const config = statusConfig[status]

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border',
        config.className,
        className
      )}
    >
      {label || config.defaultLabel}
    </span>
  )
}

interface MetricCardProps {
  value: number | string
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  className?: string
}

/**
 * MetricCard - Display a metric/statistic with optional click action
 */
export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ value, label, icon, onClick, className }, ref) => {
    const content = (
      <>
        {icon && (
          <div className="text-muted-foreground mb-2">{icon}</div>
        )}
        <div className="text-2xl font-medium tabular-nums">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </>
    )

    const baseClasses = cn(
      'text-center p-4 rounded-lg bg-muted/30 border border-border/50',
      className
    )

    if (onClick) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={onClick}
          className={cn(
            baseClasses,
            'w-full transition-colors hover:bg-muted/50',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card'
          )}
        >
          {content}
        </button>
      )
    }

    return (
      <div ref={ref} className={baseClasses}>
        {content}
      </div>
    )
  }
)
MetricCard.displayName = 'MetricCard'

export { type DetailCardProps, type InfoItemProps, type InfoListProps, type StatusBadgeProps, type MetricCardProps }
