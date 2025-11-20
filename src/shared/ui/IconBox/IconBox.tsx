import type { LucideIcon } from 'lucide-react'

import { cn } from '@/shared/utils/cn'

export type IconBoxSize = 'sm' | 'md' | 'lg'
export type IconBoxColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'cyan'

export interface IconBoxProps {
  icon: LucideIcon
  size?: IconBoxSize
  color?: IconBoxColor
  className?: string
}

const sizeStyles = {
  sm: { box: 'w-8 h-8', icon: 'w-4 h-4' },
  md: { box: 'w-10 h-10', icon: 'w-5 h-5' },
  lg: { box: 'w-12 h-12', icon: 'w-6 h-6' },
}

const colorStyles = {
  primary: 'bg-primary/20 text-primary',
  secondary: 'bg-secondary/20 text-secondary',
  success: 'bg-[#42E695]/20 text-[#42E695]',
  warning: 'bg-orange-500/20 text-orange-400',
  error: 'bg-red-500/20 text-red-400',
  info: 'bg-secondary/20 text-secondary',
  cyan: 'bg-[#00BCD4]/20 text-[#00BCD4]',
}

export const IconBox = ({
  icon: Icon,
  size = 'md',
  color = 'primary',
  className,
}: IconBoxProps) => {
  return (
    <div
      className={cn(
        'rounded-lg flex items-center justify-center',
        sizeStyles[size].box,
        colorStyles[color],
        className
      )}
    >
      <Icon className={sizeStyles[size].icon} />
    </div>
  )
}
