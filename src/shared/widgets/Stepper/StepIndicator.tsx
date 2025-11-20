import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

import { RoundButton } from '../../ui/Button'

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
  const circleConfig = (() => {
    if (isActive) {
      return {
        variant: 'primary' as const,
        glow: true,
        className: '!text-white hover:scale-110 active:scale-95',
      }
    }
    if (isCompleted) {
      return {
        variant: 'success' as const,
        glow: false,
        className: '!text-white hover:scale-105',
      }
    }
    if (isClickable) {
      return {
        variant: 'ghost' as const,
        glow: false,
        className: '!text-white hover:scale-105',
      }
    }
    return {
      variant: 'outline' as const,
      glow: false,
      className: '!text-white/60 cursor-default',
    }
  })()

  const labelClasses = (() => {
    if (isActive || isCompleted) {
      return '!text-white font-medium'
    }
    if (isClickable) {
      return '!text-white/70 hover:!text-white'
    }
    return '!text-white/60 cursor-default'
  })()

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Circular Indicator Button */}
      <RoundButton
        onClick={onClick}
        disabled={!isClickable}
        className={`transition-all duration-300 ease-out focus-visible:ring-primary/60 focus-visible:ring-offset-[#000000] ${circleConfig.className}`}
        variant={circleConfig.variant}
        glow={circleConfig.glow}
        size="md"
        shape="circle"
        aria-label={`Step ${number}: ${label}${isCompleted ? ' (completed)' : ''}${isActive ? ' (current)' : ''}`}
        aria-current={isActive ? 'step' : undefined}
      >
        <motion.div
          initial={false}
          animate={{
            scale: isActive ? 1.05 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {isCompleted ? (
            <Check className="w-5 h-5" strokeWidth={3} />
          ) : (
            <span className="text-sm font-medium">
              {number}
            </span>
          )}
        </motion.div>
      </RoundButton>

      {/* Label */}
      <RoundButton
        onClick={onClick}
        disabled={!isClickable}
        className={`
          text-xs font-normal text-center max-w-[120px]
          ${labelClasses}
        `}
        shape="pill"
        size="sm"
        variant={isActive || isCompleted ? 'secondary' : 'ghost'}
      >
        {label}
      </RoundButton>
    </div>
  )
}
