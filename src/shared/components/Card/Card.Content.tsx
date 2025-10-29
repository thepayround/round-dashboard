import type { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface CardContentProps {
  children?: ReactNode
  title?: string
  description?: string
  value?: string | number
  subtitle?: string
  trend?: {
    value: string
    direction: 'up' | 'down' | 'neutral'
    label?: string
  }
  layout?: 'default' | 'centered' | 'split' | 'stats'
  className?: string
}

const getTrendColor = (direction: 'up' | 'down' | 'neutral') => {
  switch (direction) {
    case 'up': return 'text-[#42E695]'
    case 'down': return 'text-[#FFC107]'
    default: return 'text-gray-400'
  }
}

export const CardContent = ({
  children,
  title,
  description,
  value,
  subtitle,
  trend,
  layout = 'default',
  className = ''
}: CardContentProps) => {
  const TrendIcon = trend?.direction === 'up' ? TrendingUp : TrendingDown

  if (children) {
    return <div className={`relative ${className}`}>{children}</div>
  }

  if (layout === 'centered') {
    return (
      <div className={`text-center ${className}`}>
        {title && (
          <h3 className="text-xl font-normal tracking-tight text-white mb-2">{title}</h3>
        )}
        {description && (
          <p className="text-gray-400 text-sm">{description}</p>
        )}
        {value && (
          <div className="text-2xl font-normal tracking-tight text-white mt-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
        )}
      </div>
    )
  }

  if (layout === 'stats') {
    return (
      <div className={className}>
        {title && (
          <p className="auth-text-muted text-sm font-normal tracking-tight mb-1">
            {title}
          </p>
        )}
        {value && (
          <p className="auth-text text-2xl font-medium tracking-tight mb-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        )}
        {trend && (
          <div className={`flex items-center space-x-1 text-sm font-normal tracking-tight ${getTrendColor(trend.direction)}`}>
            <TrendIcon className="w-4 h-4" />
            <span>{trend.value}</span>
            {trend.label && <span className="text-gray-400">{trend.label}</span>}
          </div>
        )}
        {subtitle && (
          <p className="text-gray-400 text-xs mt-1">{subtitle}</p>
        )}
      </div>
    )
  }

  if (layout === 'split') {
    return (
      <div className={`flex items-center justify-between ${className}`}>
        <div className="flex-1">
          {title && (
            <h3 className="text-lg font-medium tracking-tight text-white mb-1">{title}</h3>
          )}
          {description && (
            <p className="text-gray-400 text-sm">{description}</p>
          )}
        </div>
        {value && (
          <div className="text-right">
            <div className="text-2xl font-medium tracking-tight text-white">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            {subtitle && (
              <div className="text-xs text-gray-400">{subtitle}</div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={className}>
      {title && (
        <h3 className="text-lg font-medium tracking-tight text-white mb-2">{title}</h3>
      )}
      {description && (
        <p className="text-gray-400 text-sm mb-2">{description}</p>
      )}
      {value && (
        <div className="text-xl font-medium tracking-tight text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
      )}
      {subtitle && (
        <p className="text-gray-400 text-xs mt-1">{subtitle}</p>
      )}
    </div>
  )
}