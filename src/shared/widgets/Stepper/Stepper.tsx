import { motion } from 'framer-motion'

import { StepIndicator } from './StepIndicator'

export interface Step {
  id: string
  label: string
  number: number
}

export interface StepperProps {
  steps: Step[]
  currentStepId: string
  completedStepIds: string[]
  onStepClick: (stepId: string) => void
  canClickStep?: (stepId: string) => boolean
}

export const Stepper = ({
  steps,
  currentStepId,
  completedStepIds,
  onStepClick,
  canClickStep = () => true,
}: StepperProps) => {
  const currentIndex = steps.findIndex(step => step.id === currentStepId)
  const progress = ((currentIndex + 1) / steps.length) * 100

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative mb-8">
        {/* Background Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10" style={{ marginLeft: '20px', marginRight: '20px' }} />

        {/* Active Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 overflow-hidden" style={{ marginLeft: '20px', marginRight: '20px' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-[#D417C8] shadow-sm shadow-[#D417C8]/50"
          />
        </div>

        {/* Step Indicators */}
        <div className="relative flex justify-between items-start">
          {steps.map((step) => {
            const isActive = step.id === currentStepId
            const isCompleted = completedStepIds.includes(step.id)
            const isClickable = canClickStep(step.id)

            return (
              <div key={step.id} className="flex-1 flex flex-col items-center">
                <StepIndicator
                  number={step.number}
                  label={step.label}
                  isActive={isActive}
                  isCompleted={isCompleted}
                  isClickable={isClickable}
                  onClick={() => isClickable && onStepClick(step.id)}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
