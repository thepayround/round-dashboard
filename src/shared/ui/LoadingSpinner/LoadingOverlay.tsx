import { LoadingSpinner, type SpinnerSize } from './LoadingSpinner'

import { cn } from '@/shared/utils/cn'


export interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  spinnerSize?: SpinnerSize
  label?: string
  className?: string
}

export const LoadingOverlay = ({
  isLoading,
  children,
  spinnerSize = 'md',
  label = 'Loading...',
  className,
}: LoadingOverlayProps) => {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-sm z-10">
          <LoadingSpinner size={spinnerSize} color="white" label={label} />
        </div>
      )}
    </div>
  )
}
