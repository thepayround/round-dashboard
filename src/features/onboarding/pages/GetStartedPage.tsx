import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react'
import React from 'react'

import { TabNavigation } from '../components/TabNavigation'
import { getStepConfig } from '../config/stepsConfig'
import { useGetStartedController } from '../hooks/useGetStartedController'

import { DashboardLayout } from '@/shared/layout/DashboardLayout'
import { ActionButton } from '@/shared/ui/ActionButton'
import { Button } from '@/shared/ui/Button'

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
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border border-[#14BDEA]/30 border-t-[#14BDEA] rounded-full animate-spin" />
            <span className="ml-3 text-white/60">Loading {stepConfig.title.toLowerCase()} data...</span>
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
            <h1 className="text-lg font-medium text-white mb-4">
              Welcome to <span className="text-primary">Round</span>
            </h1>
            <p className="text-gray-500 leading-snug mb-3">Let&apos;s set up your account in just a few steps</p>
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
              className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-6"
            >
              <div className="flex items-center space-x-2 text-[#D417C8]">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{apiError}</span>
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
            <div className="bg-[#171719] rounded-lg border border-[#1e1f22] p-8">
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
              <Button onClick={handleBack} variant="ghost" icon={ArrowLeft} iconPosition="left" size="sm">
                Back
              </Button>
            ) : (
              <div />
            )}

            <ActionButton
              label={getButtonText()}
              onClick={handleNext}
              disabled={!isStepValid(currentStep) || isCompleting}
              variant={isLastStep() ? 'success' : 'primary'}
              icon={isLastStep() ? CheckCircle : ArrowRight}
              loading={isCompleting}
              animated={false}
              actionType="navigation"
              size="sm"
            />
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
