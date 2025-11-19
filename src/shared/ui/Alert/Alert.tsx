import type { LucideIcon } from 'lucide-react'
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react'

import { cn } from '@/shared/utils/cn'

export type AlertVariant = 'info' | 'success' | 'warning' | 'error' | 'danger'

export interface AlertProps {
  variant?: AlertVariant
  title?: string
  description: string
  icon?: LucideIcon
  className?: string
}

const variantConfig = {
  info: {
    container: 'bg-blue-500/10 border-blue-500/30',
    title: 'text-blue-400',
    icon: Info,
  },
  success: {
    container: 'bg-green-500/10 border-green-500/30',
    title: 'text-green-400',
    icon: CheckCircle,
  },
  warning: {
    container: 'bg-orange-500/10 border-orange-500/30',
    title: 'text-orange-400',
    icon: AlertTriangle,
  },
  error: {
    container: 'bg-red-500/10 border-red-500/30',
    title: 'text-red-400',
    icon: XCircle,
  },
  danger: {
    container: 'bg-red-500/10 border-red-500/30',
    title: 'text-primary',
    icon: AlertTriangle,
  },
}

export const Alert = ({
  variant = 'info',
  title,
  description,
  icon,
  className,
}: AlertProps) => {
  const config = variantConfig[variant]
  const Icon = icon || config.icon

  return (
    <div
      className={cn(
        'rounded-xl p-4 border',
        config.container,
        className
      )}
      role="alert"
    >
      {title && (
        <h3
          className={cn(
            'text-sm font-normal tracking-tight mb-2 flex items-center gap-2',
            config.title
          )}
        >
          <Icon className="w-4 h-4" />
          {title}
        </h3>
      )}
      <p className="text-sm text-white/80">{description}</p>
    </div>
  )
}
