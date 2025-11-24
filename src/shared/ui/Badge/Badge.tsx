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
  success: 'bg-[#059669]/15 text-[#059669] border-[#059669]/25',
  warning: 'bg-[#D97706]/15 text-[#D97706] border-[#D97706]/25',
  error: 'bg-[#DC2626]/15 text-[#DC2626] border-[#DC2626]/25',
  info: 'bg-[#2563EB]/15 text-[#2563EB] border-[#2563EB]/25',
  neutral: 'bg-white/10 text-white/80 border-white/20',
  primary: 'bg-primary/15 text-primary border-primary/25',
}

const sizeStyles = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-2.5 py-1 text-xs',
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
        'inline-flex items-center gap-1.5 rounded-lg font-normal tracking-tight border',
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
