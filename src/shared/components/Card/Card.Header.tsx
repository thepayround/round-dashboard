import type { LucideIcon } from 'lucide-react'
import type { ActionMenuItem } from '../ActionMenu/ActionMenu';
import { ActionMenu } from '../ActionMenu/ActionMenu'
import type { ReactNode } from 'react'

interface CardHeaderProps {
  icon?: LucideIcon
  title?: string
  status?: {
    label: string
    variant: 'active' | 'inactive' | 'archived' | 'success' | 'warning' | 'danger'
  }
  badges?: Array<{
    label: string
    variant: 'primary' | 'secondary' | 'success' | 'warning' | 'info'
  }>
  actions?: ActionMenuItem[]
  children?: ReactNode
  className?: string
  iconColor?: string
  iconBg?: string
}

const statusVariants = {
  active: 'text-green-400 bg-green-500/10 border-green-500/20',
  inactive: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  archived: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
  success: 'text-green-400 bg-green-500/10 border-green-500/20',
  warning: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  danger: 'text-red-400 bg-red-500/10 border-red-500/20'
}

const badgeVariants = {
  primary: 'text-[#D417C8] bg-[#D417C8]/10 border-[#D417C8]/20',
  secondary: 'text-[#14BDEA] bg-[#14BDEA]/10 border-[#14BDEA]/20',
  success: 'text-green-400 bg-green-500/10 border-green-500/20',
  warning: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  info: 'text-[#7767DA] bg-[#7767DA]/10 border-[#7767DA]/20'
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
            <span className={`px-2 py-1 rounded-full text-xs font-normal tracking-tight border ${statusVariants[status.variant]}`}>
              {status.label}
            </span>
          )}
          
          {badges.map((badge, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded-full text-xs font-normal tracking-tight border ${badgeVariants[badge.variant]}`}
            >
              {badge.label}
            </span>
          ))}
        </div>
      </div>

      {children}

      {actions && actions.length > 0 && (
        <ActionMenu items={actions} />
      )}
    </div>
  )