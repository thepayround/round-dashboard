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

  const canClickStep = (_stepId: OnboardingStep) =>
    // During onboarding flow, allow navigation to any step
    // This provides flexibility to go back and edit any step
     true
  

  const getProgress = () => {
    const currentIndex = getCurrentStepIndex()
    return ((currentIndex + 1) / steps.length) * 100
  }

  const getStepCircleClasses = (stepId: OnboardingStep): string => {
    if (isStepActive(stepId)) {
      return 'bg-gradient-to-r from-[#D417C8] to-[#14BDEA] shadow-lg shadow-[#D417C8]/30'
    }
    if (isStepCompleted(stepId)) {
      return 'bg-gradient-to-r from-[#42E695] to-[#3BB2B8]'
    }
    // All other steps are clickable and interactive
    return 'bg-gray-700 border-gray-500 hover:bg-gray-600 hover:border-gray-400 cursor-pointer'
  }

  const getStepTextClasses = (stepId: OnboardingStep): string => {
    if (isStepActive(stepId)) {
      return 'text-white font-medium tracking-tight'
    }
    if (isStepCompleted(stepId)) {
      return 'text-[#42E695] font-normal tracking-tight'
    }
    // All other steps are clickable and interactive
    return 'text-gray-300 hover:text-white cursor-pointer'
  }

  return (
    <nav 
      className="w-full max-w-4xl mx-auto" 
      role="navigation" 
      aria-label="Onboarding Progress"
    >
      {/* Progress Section */}
      <div className="relative mb-3 md:mb-5 lg:mb-4">
        {/* Background Progress Bar */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 md:h-1 lg:h-0.5 bg-white/10 rounded-full transform -translate-y-1/2 mx-3 md:mx-6 lg:mx-8" />
        
        {/* Active Progress Bar */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 md:h-1 lg:h-0.5 transform -translate-y-1/2 mx-3 md:mx-6 lg:mx-8 overflow-hidden rounded-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getProgress()}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-gradient-to-r from-[#D417C8] via-[#7767DA] to-[#14BDEA] rounded-full shadow-sm"
          />
        </div>

        {/* Step Indicators Container */}
        <div className="relative flex px-3 md:px-6 lg:px-8 py-2 md:py-2.5 lg:py-2">
          {steps.map((step, _index) => (
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
                  w-8 h-8 md:w-10 md:h-10 lg:w-9 lg:h-9
                  rounded-full
                  flex items-center justify-center 
                  transition-all duration-300 ease-out
                  transform hover:scale-110 focus:scale-110 active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-[#D417C8]/60 focus:ring-offset-1 focus:ring-offset-transparent
                  ${getStepCircleClasses(step.id)}
                `}
              >
                {isStepCompleted(step.id) ? (
                  <Check className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-3.5 lg:h-3.5 text-white" />
                ) : (
                  <span className={`text-xs md:text-sm lg:text-xs font-normal tracking-tight tracking-tight ${
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
      <div className="flex px-3 md:px-6 lg:px-8 gap-1 md:gap-2 lg:gap-1.5">
        {steps.map((step, _index) => (
          <div 
            key={`label-container-${step.id}`} 
            className="flex-1 flex justify-center min-w-0"
          >
            <button
              onClick={() => canClickStep(step.id) && onStepClick(step.id)}
              disabled={!canClickStep(step.id)}
              className={`
                text-center transition-all duration-300 ease-out touch-target
                p-1 md:p-2 lg:p-1.5 rounded-md max-w-full 
                min-h-[2rem] md:min-h-[2.5rem] lg:min-h-[2.25rem]
                flex items-center justify-center
                ${canClickStep(step.id) 
                  ? 'hover:bg-white/5 hover:scale-105 focus:bg-white/8 focus:scale-105 focus:outline-none focus:ring-1 focus:ring-[#D417C8]/40 active:scale-95' 
                  : 'cursor-not-allowed opacity-75'
                }
              `}
              tabIndex={canClickStep(step.id) ? 0 : -1}
            >
              <div className={`
                text-xs md:text-sm lg:text-xs
                font-normal tracking-tight leading-tight text-center
                transition-colors duration-300 
                px-1 md:px-1.5 lg:px-1
                ${getStepTextClasses(step.id)}
              `}>
                {/* Mobile screens: Show abbreviated */}
                <span className="md:hidden block">
                  {step.label.split(' ')[0].substring(0, 4)}
                  {step.label.split(' ').length > 1 && '...'}
                </span>
                {/* Tablet and up: Show full label */}
                <span className="hidden md:inline break-words hyphens-auto">
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
