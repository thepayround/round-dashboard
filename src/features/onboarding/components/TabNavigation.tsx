import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { OnboardingStep } from '../types/onboarding'

interface TabNavigationProps {
  currentStep: OnboardingStep
  completedSteps: OnboardingStep[]
  availableSteps: OnboardingStep[]
  onStepClick: (step: OnboardingStep) => void
}

interface StepConfig {
  id: OnboardingStep
  label: string
  number: number
}

const allStepConfigs: StepConfig[] = [
  { id: 'organization', label: 'Organization', number: 1 },
  { id: 'businessSettings', label: 'Business Settings', number: 2 },
  { id: 'address', label: 'Address Information', number: 3 },
  { id: 'team', label: 'Team', number: 4 },
  { id: 'products', label: 'Products', number: 5 },
  { id: 'billing', label: 'Billing', number: 6 },
]

export const TabNavigation = ({
  currentStep,
  completedSteps,
  availableSteps,
  onStepClick,
}: TabNavigationProps) => {
  // Filter steps to only show available ones, with renumbered sequence
  const steps = allStepConfigs
    .filter(stepConfig => availableSteps.includes(stepConfig.id))
    .map((stepConfig, index) => ({
      ...stepConfig,
      number: index + 1, // Renumber steps sequentially
    }))

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
      return 'bg-gray-700 border-gray-500 hover:bg-gray-600 hover:border-gray-400'
    }
    return 'bg-gray-800 border-gray-600 cursor-not-allowed'
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
    <nav 
      className="w-full max-w-4xl mx-auto" 
      role="navigation" 
      aria-label="Onboarding Progress"
    >
      {/* Progress Section */}
      <div className="relative mb-4 sm:mb-6 lg:mb-8">
        {/* Background Progress Bar */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 sm:h-1 lg:h-1.5 bg-white/10 rounded-full transform -translate-y-1/2 mx-3 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16" />
        
        {/* Active Progress Bar */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 sm:h-1 lg:h-1.5 transform -translate-y-1/2 mx-3 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16 overflow-hidden rounded-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getProgress()}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-gradient-to-r from-[#D417C8] via-[#7767DA] to-[#14BDEA] rounded-full shadow-sm"
          />
        </div>

        {/* Step Indicators Container */}
        <div className="relative flex px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-2 sm:py-3 lg:py-4">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className="flex-1 flex justify-center"
            >
              <button
                onClick={() => canClickStep(step.id) && onStepClick(step.id)}
                disabled={!canClickStep(step.id)}
                aria-current={isStepActive(step.id) ? 'step' : undefined}
                aria-label={`Step ${step.number}: ${step.label}${isStepCompleted(step.id) ? ' (completed)' : ''}${isStepActive(step.id) ? ' (current)' : ''}`}
                className={`
                  relative flex-shrink-0 touch-target
                  w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
                  rounded-full border-2 sm:border-3 
                  flex items-center justify-center 
                  transition-all duration-300 ease-out
                  transform hover:scale-110 focus:scale-110 active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-[#D417C8]/60 focus:ring-offset-1 focus:ring-offset-transparent
                  ${getStepCircleClasses(step.id)}
                `}
              >
                {isStepCompleted(step.id) ? (
                  <Check className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
                ) : (
                  <span className={`text-sm xs:text-base sm:text-lg font-bold ${
                    isStepActive(step.id) || canClickStep(step.id) ? 'text-white' : 'text-gray-500'
                  }`}>
                    {step.number}
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Step Labels - Perfectly aligned with numbers above */}
      <div className="flex px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 gap-1 xs:gap-2 sm:gap-4">
        {steps.map((step, index) => (
          <div 
            key={`label-container-${step.id}`} 
            className="flex-1 flex justify-center min-w-0"
          >
            <button
              onClick={() => canClickStep(step.id) && onStepClick(step.id)}
              disabled={!canClickStep(step.id)}
              className={`
                text-center transition-all duration-300 ease-out touch-target
                p-1 xs:p-2 sm:p-3 rounded-md max-w-full 
                min-h-[2.5rem] xs:min-h-[3rem] sm:min-h-[3.5rem]
                flex items-center justify-center
                ${canClickStep(step.id) 
                  ? 'hover:bg-white/5 hover:scale-105 focus:bg-white/8 focus:scale-105 focus:outline-none focus:ring-1 focus:ring-[#D417C8]/40 active:scale-95' 
                  : 'cursor-not-allowed opacity-75'
                }
              `}
              tabIndex={canClickStep(step.id) ? 0 : -1}
            >
              <div className={`
                text-xs xs:text-sm sm:text-base
                font-medium leading-tight text-center
                transition-colors duration-300 
                px-1 xs:px-2
                ${getStepTextClasses(step.id)}
              `}>
                {/* Extra small screens: Show initials */}
                <span className="xs:hidden block">
                  {step.label.split(' ').map(word => word[0]).join('').slice(0, 3)}
                </span>
                {/* Small screens: Show abbreviated */}
                <span className="hidden xs:block sm:hidden">
                  {step.label.split(' ')[0].substring(0, 6)}
                  {step.label.split(' ').length > 1 && '...'}
                </span>
                {/* Medium and up: Show full label */}
                <span className="hidden sm:inline break-words hyphens-auto">
                  {step.label}
                </span>
              </div>
            </button>
          </div>
        ))}
      </div>
    </nav>
  )
}
