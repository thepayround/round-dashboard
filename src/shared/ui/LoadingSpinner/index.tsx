import { cn } from '@/shared/utils/cn'

// Re-export Skeleton for compatibility
export { Skeleton } from '../shadcn/skeleton'

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  /** @deprecated No longer used - spinner inherits color from parent via border-current */
  color?: string
  /** If true, renders without centering wrapper (for inline use in buttons) */
  inline?: boolean
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
}

export const LoadingSpinner = ({ size = 'md', className, color: _color, inline = false }: LoadingSpinnerProps) => {
  const spinner = (
    <output aria-live="polite" aria-label="Loading" className="contents">
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-current border-t-transparent',
          sizeClasses[size],
          className
        )}
      >
        <span className="sr-only">Loading...</span>
      </div>
    </output>
  )

  if (inline) {
    return spinner
  }

  return <div className="flex items-center justify-center">{spinner}</div>
}
