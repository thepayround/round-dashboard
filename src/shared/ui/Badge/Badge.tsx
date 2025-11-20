import { X } from 'lucide-react'

import { IconButton } from '../Button/IconButton'

import { cn } from '@/shared/utils/cn'

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary'
export type BadgeSize = 'sm' | 'md' | 'lg'

export interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  removable?: boolean
  onRemove?: () => void
  className?: string
}

const variantStyles = {
  success: 'bg-success/20 text-success border-success/30',
  warning: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  error: 'bg-red-500/20 text-red-400 border-red-500/30',
  info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  neutral: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  primary: 'bg-primary/20 text-primary border-primary/30',
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  removable = false,
  onRemove,
  className,
}: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-normal tracking-tight border',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      <span>{children}</span>
      {removable && onRemove && (
        <IconButton
          icon={X}
          onClick={onRemove}
          variant="ghost"
          size="sm"
          aria-label={`Remove ${children}`}
          className="w-3 h-3 p-0 hover:opacity-70 transition-opacity"
        />
      )}
    </span>
  )
}
