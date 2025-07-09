/**
 * Custom hook for managing multi-step form state and navigation
 */

import { useState, useCallback } from 'react'

export interface FormStep {
  id: string
  title: string
  description?: string
  isCompleted: boolean
  isOptional?: boolean
}

export interface UseMultiStepFormProps {
  initialSteps: FormStep[]
  onComplete?: (data: unknown) => void
  onStepChange?: (currentStep: number, stepData: unknown) => void
}

export interface UseMultiStepFormReturn {
  // State
  currentStep: number
  steps: FormStep[]
  canGoNext: boolean
  canGoPrevious: boolean
  isFirstStep: boolean
  isLastStep: boolean

  // Actions
  goToNext: () => void
  goToPrevious: () => void
  goToStep: (stepIndex: number) => void
  completeCurrentStep: () => void
  updateStepCompletion: (stepIndex: number, isCompleted: boolean) => void

  // Utilities
  getStepProgress: () => number
  getCompletedSteps: () => number
  getTotalSteps: () => number
}

export const useMultiStepForm = ({
  initialSteps,
  onComplete,
  onStepChange,
}: UseMultiStepFormProps): UseMultiStepFormReturn => {
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<FormStep[]>(initialSteps)

  // Derived state
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1
  const canGoPrevious = currentStep > 0
  const canGoNext =
    currentStep < steps.length - 1 &&
    (steps[currentStep]?.isCompleted || steps[currentStep]?.isOptional === true)

  // Go to next step
  const goToNext = useCallback(() => {
    if (canGoNext) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      onStepChange?.(nextStep, steps[nextStep])
    }
  }, [canGoNext, currentStep, onStepChange, steps])

  // Go to previous step
  const goToPrevious = useCallback(() => {
    if (canGoPrevious) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      onStepChange?.(prevStep, steps[prevStep])
    }
  }, [canGoPrevious, currentStep, onStepChange, steps])

  // Go to specific step
  const goToStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex >= 0 && stepIndex < steps.length) {
        setCurrentStep(stepIndex)
        onStepChange?.(stepIndex, steps[stepIndex])
      }
    },
    [onStepChange, steps]
  )

  // Complete current step
  const completeCurrentStep = useCallback(() => {
    setSteps(prevSteps => {
      const newSteps = [...prevSteps]
      newSteps[currentStep] = { ...newSteps[currentStep], isCompleted: true }
      return newSteps
    })

    // If this is the last step, trigger completion
    if (isLastStep) {
      onComplete?.(steps)
    }
  }, [currentStep, isLastStep, onComplete, steps])

  // Update step completion status
  const updateStepCompletion = useCallback((stepIndex: number, isCompleted: boolean) => {
    setSteps(prevSteps => {
      const newSteps = [...prevSteps]
      if (newSteps[stepIndex]) {
        newSteps[stepIndex] = { ...newSteps[stepIndex], isCompleted }
      }
      return newSteps
    })
  }, [])

  // Get progress percentage
  const getStepProgress = useCallback(() => {
    const completedSteps = steps.filter(step => step.isCompleted).length
    return Math.round((completedSteps / steps.length) * 100)
  }, [steps])

  // Get number of completed steps
  const getCompletedSteps = useCallback(
    () => steps.filter(step => step.isCompleted).length,
    [steps]
  )

  // Get total number of steps
  const getTotalSteps = useCallback(() => steps.length, [steps])

  return {
    // State
    currentStep,
    steps,
    canGoNext,
    canGoPrevious,
    isFirstStep,
    isLastStep,

    // Actions
    goToNext,
    goToPrevious,
    goToStep,
    completeCurrentStep,
    updateStepCompletion,

    // Utilities
    getStepProgress,
    getCompletedSteps,
    getTotalSteps,
  }
}
