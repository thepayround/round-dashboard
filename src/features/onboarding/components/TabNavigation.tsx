import type { OnboardingStep } from '../types/onboarding'

import { Stepper } from '@/shared/components/Stepper'
import type { Step } from '@/shared/components/Stepper'

interface TabNavigationProps {
  currentStep: OnboardingStep
  completedSteps: OnboardingStep[]
  availableSteps: OnboardingStep[]
  onStepClick: (step: OnboardingStep) => void
}

interface StepConfig {
  id: OnboardingStep
  label: string
}

const allStepConfigs: StepConfig[] = [
  { id: 'organization', label: 'Organization' },
  { id: 'address', label: 'Address' },
  { id: 'team', label: 'Team' },
  { id: 'products', label: 'Products' },
  { id: 'billing', label: 'Billing' },
]

export const TabNavigation = ({
  currentStep,
  completedSteps,
  availableSteps,
  onStepClick,
}: TabNavigationProps) => {
  // Filter steps to only show available ones, with renumbered sequence
  const steps: Step[] = allStepConfigs
    .filter(stepConfig => availableSteps.includes(stepConfig.id))
    .map((stepConfig, index) => ({
      id: stepConfig.id,
      label: stepConfig.label,
      number: index + 1, // Renumber steps sequentially
    }))

  return (
    <nav
      className="w-full max-w-4xl mx-auto"
      role="navigation"
      aria-label="Onboarding Progress"
    >
      <Stepper
        steps={steps}
        currentStepId={currentStep}
        completedStepIds={completedSteps}
        onStepClick={(stepId) => onStepClick(stepId as OnboardingStep)}
        canClickStep={() => true} // Allow navigation to any step
      />
    </nav>
  )
}
