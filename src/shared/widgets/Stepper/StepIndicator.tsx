import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

import { cn } from '@/shared/utils/cn'

export interface StepIndicatorProps {
  number: number
  isActive: boolean
  isCompleted: boolean
  isClickable: boolean
  onClick?: () => void
  label: string
}

export const StepIndicator = ({
  number,
  isActive,
  isCompleted,
  isClickable,
  onClick,
  label,
}: StepIndicatorProps) => {
  const getCircleStyles = () => {
    if (isActive) {
      return 'bg-primary text-primary-foreground border-primary'
    }
    if (isCompleted) {
      return 'bg-primary text-primary-foreground border-primary'
    }
    // Future steps (clickable or not)
    return 'bg-muted text-muted-foreground border-border'
  }

  const getLabelStyles = () => {
    if (isActive) {
      return 'text-foreground'
    }
    if (isCompleted) {
      return 'text-foreground'
    }
    return 'text-muted-foreground'
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Circular Indicator */}
      <motion.button
        type="button"
        onClick={isClickable ? onClick : undefined}
        disabled={!isClickable}
        className={cn(
          'h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all duration-200',
          getCircleStyles(),
          isClickable && 'cursor-pointer hover:scale-105',
          !isClickable && 'cursor-default'
        )}
        whileHover={isClickable ? { scale: 1.05 } : undefined}
        whileTap={isClickable ? { scale: 0.95 } : undefined}
        aria-label={`Step ${number}: ${label}${isCompleted ? ' (completed)' : ''}${isActive ? ' (current)' : ''}`}
        aria-current={isActive ? 'step' : undefined}
      >
        {isCompleted ? (
          <Check className="w-5 h-5" strokeWidth={2.5} />
        ) : (
          <span className="text-sm font-medium">{number}</span>
        )}
      </motion.button>

      {/* Label */}
      <button
        type="button"
        onClick={isClickable ? onClick : undefined}
        disabled={!isClickable}
        className={cn(
          'text-sm text-center px-3 py-1 rounded-md transition-colors',
          getLabelStyles(),
          isClickable && 'cursor-pointer hover:text-foreground',
          !isClickable && 'cursor-default'
        )}
      >
        {label}
      </button>
    </div>
  )
}
