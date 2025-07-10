import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { OnboardingStep } from '../types/onboarding'

interface TabNavigationProps {
  currentStep: OnboardingStep
  completedSteps: OnboardingStep[]
  onStepClick: (step: OnboardingStep) => void
}

interface StepConfig {
  id: OnboardingStep
  label: string
  number: number
}

const steps: StepConfig[] = [
  { id: 'userInfo', label: 'User Information', number: 1 },
  { id: 'organization', label: 'Organization', number: 2 },
  { id: 'businessSettings', label: 'Business Settings', number: 3 },
  { id: 'products', label: 'Products', number: 4 },
  { id: 'billing', label: 'Billing', number: 5 },
  { id: 'team', label: 'Team', number: 6 },
]

export const TabNavigation = ({ currentStep, completedSteps, onStepClick }: TabNavigationProps) => {
  const isStepCompleted = (stepId: OnboardingStep) => completedSteps.includes(stepId)
  const isStepActive = (stepId: OnboardingStep) => currentStep === stepId
  const getCurrentStepIndex = () => steps.findIndex(step => step.id === currentStep)
  const getStepIndex = (stepId: OnboardingStep) => steps.findIndex(step => step.id === stepId)

  const canClickStep = (stepId: OnboardingStep) => {
    const stepIndex = getStepIndex(stepId)
    const currentIndex = getCurrentStepIndex()
    return stepIndex <= currentIndex || isStepCompleted(stepId)
  }

  const getProgress = () => {
    const currentIndex = getCurrentStepIndex()
    return ((currentIndex + 1) / steps.length) * 100
  }

  const getStepCircleClasses = (stepId: OnboardingStep): string => {
    if (isStepActive(stepId)) {
      return 'bg-gradient-to-r from-[#D417C8] to-[#14BDEA] border-white shadow-lg shadow-[#D417C8]/30'
    }
    if (isStepCompleted(stepId)) {
      return 'bg-gradient-to-r from-[#42E695] to-[#3BB2B8] border-white'
    }
    if (canClickStep(stepId)) {
      return 'bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/50'
    }
    return 'bg-white/5 border-white/20 cursor-not-allowed'
  }

  const getStepTextClasses = (stepId: OnboardingStep): string => {
    if (isStepActive(stepId)) {
      return 'text-white font-bold'
    }
    if (isStepCompleted(stepId)) {
      return 'text-[#42E695] font-semibold'
    }
    if (canClickStep(stepId)) {
      return 'text-gray-300 hover:text-white'
    }
    return 'text-gray-500 cursor-not-allowed'
  }

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getProgress()}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-[#D417C8] via-[#7767DA] to-[#14BDEA] rounded-full"
          />
        </div>

        {/* Step Indicators */}
        <div className="absolute top-0 left-0 w-full flex justify-between transform -translate-y-1/2">
          {steps.map(step => (
            <button
              key={step.id}
              onClick={() => canClickStep(step.id) && onStepClick(step.id)}
              disabled={!canClickStep(step.id)}
              className={`
                relative w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10
                ${getStepCircleClasses(step.id)}
              `}
            >
              {isStepCompleted(step.id) ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <span
                  className={`text-sm font-medium ${
                    isStepActive(step.id) || canClickStep(step.id) ? 'text-white' : 'text-gray-500'
                  }`}
                >
                  {step.number}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Labels */}
      <div className="flex justify-between">
        {steps.map(step => (
          <button
            key={step.id}
            onClick={() => canClickStep(step.id) && onStepClick(step.id)}
            disabled={!canClickStep(step.id)}
            className={`
              text-center transition-all duration-300
              ${canClickStep(step.id) ? 'hover:scale-105' : 'cursor-not-allowed'}
            `}
          >
            <div
              className={`
              text-sm font-medium transition-colors duration-300
              ${getStepTextClasses(step.id)}
            `}
            >
              {step.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
