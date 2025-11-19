import type { LucideIcon } from 'lucide-react'

import { cn } from '@/shared/utils/cn'

export interface SectionHeaderProps {
  icon?: LucideIcon
  title: string
  subtitle?: string
  iconColor?: string
  className?: string
}

export const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  iconColor = 'text-primary',
  className,
}: SectionHeaderProps) => {
  return (
    <div className={cn('space-y-1', className)}>
      <h3 className="text-lg font-medium tracking-tight text-white flex items-center space-x-2">
        {Icon && <Icon className={cn('w-5 h-5', iconColor)} />}
        <span>{title}</span>
      </h3>
      {subtitle && (
        <p className="text-sm text-white/60">{subtitle}</p>
      )}
    </div>
  )
}
