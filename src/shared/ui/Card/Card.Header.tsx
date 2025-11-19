import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import type { ActionMenuItem } from '../../widgets/ActionMenu/ActionMenu'
import { ActionMenu } from '../../widgets/ActionMenu/ActionMenu'
import { Badge, type BadgeVariant } from '../Badge'

interface CardHeaderProps {
  icon?: LucideIcon
  title?: string
  status?: {
    label: string
    variant: BadgeVariant
  }
  badges?: Array<{
    label: string
    variant: BadgeVariant
  }>
  actions?: ActionMenuItem[]
  children?: ReactNode
  className?: string
  iconColor?: string
  iconBg?: string
}

export const CardHeader = ({
  icon: Icon,
  title,
  status,
  badges = [],
  actions,
  children,
  className = '',
  iconColor = 'text-blue-400',
  iconBg = 'from-blue-500/20 to-cyan-500/20'
}: CardHeaderProps) => (
    <div className={`flex items-start justify-between mb-4 ${className}`}>
      <div className="flex items-center space-x-3 flex-1">
        {Icon && (
          <div className={`p-3 rounded-lg bg--to-br ${iconBg} group-hover:opacity-80 transition-all`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        )}
        
        <div className="flex items-center space-x-2 flex-wrap">
          {title && (
            <h3 className="text-xl font-normal tracking-tight text-white">{title}</h3>
          )}

          {status && (
            <Badge variant={status.variant} size="md">
              {status.label}
            </Badge>
          )}

          {badges.map((badge, index) => (
            <Badge key={index} variant={badge.variant} size="md">
              {badge.label}
            </Badge>
          ))}
        </div>
      </div>

      {children}

      {actions && actions.length > 0 && (
        <ActionMenu items={actions} />
      )}
    </div>
  )
