import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, AlertCircle, ArrowRight, CheckCircle, Loader2 } from 'lucide-react'

import { getStepConfig } from '../config/stepsConfig'
import { useGetStartedController } from '../hooks/useGetStartedController'
import type { OnboardingStep } from '../types/onboarding'

import { DashboardLayout } from '@/shared/layout/DashboardLayout'
import { Button } from '@/shared/ui/shadcn/button'
import { cn } from '@/shared/utils/cn'

const STEP_ORDER: { id: OnboardingStep; label: string }[] = [
  { id: 'organization', label: 'Organization' },
  { id: 'address', label: 'Address' },
  { id: 'team', label: 'Team' },
  { id: 'products', label: 'Products' },
  { id: 'billing', label: 'Billing' },
]

export const GetStartedPage = () => {
  const {
    currentStep,
    completedSteps,
    availableSteps,
    isCompleting,
    apiError,
    onboardingData,
    isLoadingData,
    handleNext,
    handleBack,
    handleStepClick,
    isFirstStep,
    isLastStep,
    isStepValid,
    getButtonText,
    updateOrganization,
    updateBusinessSettings,
    updateAddress,
    updateProducts,
    updateBilling,
    updateTeam,
    showSuccess,
    showError,
  } = useGetStartedController()

  // Filter to only show available steps
  const visibleSteps = STEP_ORDER.filter(step => availableSteps.includes(step.id))
  const currentStepIndex = visibleSteps.findIndex(s => s.id === currentStep)

  const renderCurrentStep = () => {
    const stepConfig = getStepConfig(currentStep)
    if (!stepConfig) {
      return null
    }

    // Show loading state for steps that require data fetching
    if (stepConfig.requiresDataFetch && isLoadingData) {
      const shouldShowLoading =
        (currentStep === 'organization' && !onboardingData.organization.companyName) ||
        (currentStep === 'address' && !onboardingData.address.billingAddress.name)

      if (shouldShowLoading) {
        return (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Loading {stepConfig.title.toLowerCase()} data...</p>
          </div>
        )
      }
    }

    const StepComponent = stepConfig.component

    // Render step with appropriate props based on step ID
    switch (currentStep) {
      case 'organization':
        return (
          <StepComponent
            data={onboardingData.organization}
            onChange={updateOrganization}
            isPrePopulated={!!onboardingData.organization.companyName}
            businessSettings={onboardingData.businessSettings}
            onBusinessSettingsChange={updateBusinessSettings}
          />
        )
      case 'address':
        return (
          <StepComponent
            data={onboardingData.address}
            onChange={updateAddress}
            isPrePopulated={completedSteps.includes('address')}
          />
        )
      case 'products':
        return <StepComponent data={onboardingData.products} onChange={updateProducts} />
      case 'billing':
        return <StepComponent data={onboardingData.billing} onChange={updateBilling} />
      case 'team':
        return (
          <StepComponent
            data={onboardingData.team}
            onChange={updateTeam}
            showSuccess={showSuccess}
            showError={showError}
          />
        )
      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header with centered content */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-2xl font-medium text-foreground mb-2">
            Welcome to Round
          </h1>
          <p className="text-sm text-muted-foreground">
            Let&apos;s set up your account in just a few steps
          </p>
        </div>

        {/* Modern Stepper with Circles */}
        <div className="mb-12">
          {/* Step Indicators */}
          <div className="relative">
            <div className="flex items-center justify-between">
              {visibleSteps.map((step, index) => {
                const isActive = step.id === currentStep
                const isCompleted = completedSteps.includes(step.id)
                const isPast = index < currentStepIndex
                const isClickable = isCompleted || isPast || isActive

                return (
                  <div key={step.id} className="flex flex-col items-center flex-1">
                    {/* Connecting Line (except for first item) */}
                    {index > 0 && (
                      <div className="absolute left-0 right-0 top-5 -z-10" style={{
                        left: `${(index - 1) * (100 / (visibleSteps.length - 1))}%`,
                        width: `${100 / (visibleSteps.length - 1)}%`
                      }}>
                        <div className={cn(
                          'h-0.5 transition-colors duration-300',
                          isPast || isCompleted ? 'bg-primary' : 'bg-muted'
                        )} />
                      </div>
                    )}

                    {/* Circle */}
                    <button
                      type="button"
                      onClick={() => isClickable && handleStepClick(step.id)}
                      disabled={!isClickable}
                      className={cn(
                        'relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        isActive && 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110',
                        (isCompleted || isPast) && !isActive && 'bg-primary text-primary-foreground',
                        !isActive && !isCompleted && !isPast && 'bg-muted text-muted-foreground',
                        isClickable && 'hover:scale-105 cursor-pointer',
                        !isClickable && 'cursor-not-allowed opacity-60'
                      )}
                    >
                      {isCompleted && !isActive ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </button>

                    {/* Label */}
                    <div className="mt-3 text-center">
                      <p className={cn(
                        'text-xs font-medium transition-colors duration-300',
                        isActive && 'text-foreground',
                        (isCompleted || isPast) && !isActive && 'text-muted-foreground',
                        !isActive && !isCompleted && !isPast && 'text-muted-foreground/60'
                      )}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-lg bg-destructive/10 border border-destructive/20"
          >
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="text-sm">{apiError}</span>
            </div>
          </motion.div>
        )}

        {/* Step Content with consistent centered layout */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8 border-t border-border">
          {!isFirstStep() ? (
            <Button
              type="button"
              onClick={handleBack}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          ) : (
            <div />
          )}

          <Button
            type="button"
            onClick={handleNext}
            disabled={!isStepValid(currentStep) || isCompleting}
            variant="default"
            size="lg"
            className="gap-2 min-w-[140px]"
          >
            {isCompleting && <Loader2 className="h-4 w-4 animate-spin" />}
            {getButtonText()}
            {!isCompleting && (
              isLastStep() ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
