import { cn } from '@/shared/utils/cn'

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type SpinnerColor = 'primary' | 'secondary' | 'white' | 'inherit'

export interface LoadingSpinnerProps {
  size?: SpinnerSize
  color?: SpinnerColor
  label?: string
  className?: string
}

const sizeStyles = {
  xs: 'h-3 w-3 border',
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-2',
  xl: 'h-12 w-12 border-4',
}

const colorStyles = {
  primary: 'border-primary border-t-transparent',
  secondary: 'border-secondary border-t-transparent',
  white: 'border-white border-t-transparent',
  inherit: 'border-current border-t-transparent',
}

export const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  label,
  className,
}: LoadingSpinnerProps) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'rounded-full animate-spin',
          sizeStyles[size],
          colorStyles[color]
        )}
        role="status"
        aria-label={label || 'Loading'}
      />
      {label && <span className="text-sm">{label}</span>}
    </div>
  )
}
