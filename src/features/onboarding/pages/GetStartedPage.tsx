import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, AlertCircle, ArrowRight, CheckCircle, Loader2 } from 'lucide-react'
import React from 'react'

import { TabNavigation } from '../components/TabNavigation'
import { getStepConfig } from '../config/stepsConfig'
import { useGetStartedController } from '../hooks/useGetStartedController'

import { DashboardLayout } from '@/shared/layout/DashboardLayout'
import { Button } from '@/shared/ui/shadcn/button'

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
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
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
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-lg font-medium text-foreground mb-4">
              Welcome to <span className="text-primary">Round</span>
            </h1>
            <p className="text-muted-foreground leading-snug mb-4">Let&apos;s set up your account in just a few steps</p>
          </motion.div>

          <div className="mb-12">
            <TabNavigation
              currentStep={currentStep}
              completedSteps={completedSteps}
              availableSteps={availableSteps}
              onStepClick={handleStepClick}
            />
          </div>

          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 mb-6"
            >
              <div className="flex items-center space-x-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{apiError}</span>
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
            <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderCurrentStep()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
            {!isFirstStep() ? (
              <Button onClick={handleBack} variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            ) : (
              <div />
            )}

            <Button
              onClick={handleNext}
              disabled={!isStepValid(currentStep) || isCompleting}
              variant="default"
              className="gap-2"
            >
              {isCompleting && <Loader2 className="h-4 w-4 animate-spin" />}
              {getButtonText()}
              {!isCompleting && (isLastStep() ? <CheckCircle className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />)}
            </Button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
