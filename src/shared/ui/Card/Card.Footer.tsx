import type { LucideIcon} from 'lucide-react';
import type { ReactNode } from 'react'

interface CardFooterProps {
  children?: ReactNode
  metadata?: Array<{
    icon: LucideIcon
    label: string
    value: string
  }>
  actions?: ReactNode
  className?: string
  layout?: 'default' | 'split' | 'centered'
}

export const CardFooter = ({
  children,
  metadata = [],
  actions,
  className = '',
  layout = 'default'
}: CardFooterProps) => {
  if (children) {
    return (
      <div className={`pt-3 border-t border-white/5 ${className}`}>
        {children}
      </div>
    )
  }

  if (layout === 'centered') {
    return (
      <div className={`pt-3 border-t border-white/5 text-center ${className}`}>
        {metadata.length > 0 && (
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
            {metadata.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="flex items-center space-x-1">
                  <Icon className="w-3 h-3" />
                  <span>{item.label}: {item.value}</span>
                </div>
              )
            })}
          </div>
        )}
        {actions && (
          <div className="mt-2">{actions}</div>
        )}
      </div>
    )
  }

  if (layout === 'split') {
    return (
      <div className={`pt-3 border-t border-white/5 flex items-center justify-between ${className}`}>
        {metadata.length > 0 && (
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            {metadata.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="flex items-center space-x-1">
                  <Icon className="w-3 h-3" />
                  <span>{item.value}</span>
                </div>
              )
            })}
          </div>
        )}
        {actions && <div>{actions}</div>}
      </div>
    )
  }

  return (
    <div className={`pt-3 border-t border-white/5 ${className}`}>
      {metadata.length > 0 && (
        <div className="flex items-center space-x-2 text-xs text-gray-400 mb-2">
          {metadata.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="flex items-center space-x-1">
                <Icon className="w-3 h-3" />
                <span>{item.label}: {item.value}</span>
              </div>
            )
          })}
        </div>
      )}
      {actions && <div>{actions}</div>}
    </div>
  )
}