import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { DashboardLayout } from '@/shared/components/DashboardLayout'
import { mockApi } from '@/shared/services/mockApi'
import { useAuthState, useAuthActions } from '@/shared/hooks/useAuth'
import { TabNavigation } from '../components/TabNavigation'
import { UserInfoStep } from '../components/steps/UserInfoStep'
import { OrganizationStep } from '../components/steps/OrganizationStep'
import { BusinessSettingsStep } from '../components/steps/BusinessSettingsStep'
import { ProductsStep } from '../components/steps/ProductsStep'
import { BillingStep } from '../components/steps/BillingStep'
import { TeamStep } from '../components/steps/TeamStep'

import type {
  OnboardingData,
  OnboardingStep,
  UserInfo,
  OrganizationInfo,
  BusinessSettings,
  ProductInfo,
  BillingSettings,
  TeamSettings,
} from '../types/onboarding'

const steps: OnboardingStep[] = [
  'userInfo',
  'organization',
  'businessSettings',
  'products',
  'billing',
  'team',
]

export const GetStartedPage = () => {
  const navigate = useNavigate()
  const { token } = useAuthState()
  const { setUser } = useAuthActions()

  const [currentStep, setCurrentStep] = useState<OnboardingStep>('userInfo')
  const [completedSteps, setCompletedSteps] = useState<OnboardingStep[]>([])
  const [isCompleting, setIsCompleting] = useState(false)
  const [apiError, setApiError] = useState('')

  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    userInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    organization: {
      companyName: '',
      industry: '',
      companySize: '',
      website: '',
    },
    businessSettings: {
      currency: 'USD',
      timezone: 'UTC',
      fiscalYearStart: 'January',
    },
    products: {
      hasProducts: false,
      products: [],
    },
    billing: {
      isConnected: false,
      provider: '',
    },
    team: {
      invitations: [],
    },
  })

  const getCurrentStepIndex = () => steps.indexOf(currentStep)
  const isLastStep = () => getCurrentStepIndex() === steps.length - 1

  const getNextButtonClasses = (): string => {
    if (!isStepValid(currentStep) || isCompleting) {
      return 'bg-white/5 text-gray-500 cursor-not-allowed'
    }
    return 'bg-gradient-to-r from-[#D417C8] to-[#14BDEA] text-white hover:shadow-lg hover:shadow-[#D417C8]/30 transform hover:scale-105'
  }

  const getButtonText = (): string => {
    if (isCompleting) return 'Completing Setup...'
    if (isLastStep()) return 'Complete Setup'
    return 'Next'
  }

  const getButtonIcon = () => {
    if (isCompleting) {
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
        />
      )
    }
    if (isLastStep()) {
      return <CheckCircle className="w-5 h-5" />
    }
    return <ArrowRight className="w-5 h-5" />
  }
  const isFirstStep = () => getCurrentStepIndex() === 0

  const updateUserInfo = (userInfo: UserInfo) => {
    setOnboardingData(prev => ({ ...prev, userInfo }))
  }

  const updateOrganization = (organization: OrganizationInfo) => {
    setOnboardingData(prev => ({ ...prev, organization }))
  }

  const updateBusinessSettings = (businessSettings: BusinessSettings) => {
    setOnboardingData(prev => ({ ...prev, businessSettings }))
  }

  const updateProducts = (products: ProductInfo) => {
    setOnboardingData(prev => ({ ...prev, products }))
  }

  const updateBilling = (billing: BillingSettings) => {
    setOnboardingData(prev => ({ ...prev, billing }))
  }

  const updateTeam = (team: TeamSettings) => {
    setOnboardingData(prev => ({ ...prev, team }))
  }

  const isStepValid = (step: OnboardingStep): boolean => {
    switch (step) {
      case 'userInfo': {
        const { userInfo } = onboardingData
        return (
          userInfo.firstName.trim() !== '' &&
          userInfo.lastName.trim() !== '' &&
          userInfo.email.trim() !== '' &&
          userInfo.phone.trim() !== ''
        )
      }

      case 'organization': {
        const { organization } = onboardingData
        return (
          organization.companyName.trim() !== '' &&
          organization.industry !== '' &&
          organization.companySize !== ''
        )
      }

      case 'businessSettings': {
        const { businessSettings } = onboardingData
        return (
          businessSettings.currency !== '' &&
          businessSettings.timezone !== '' &&
          businessSettings.fiscalYearStart !== ''
        )
      }

      case 'products':
        return true // Products step is optional

      case 'billing':
        return true // Billing step is optional

      case 'team':
        return true // Team step is optional

      default:
        return false
    }
  }

  const handleNext = () => {
    const currentIndex = getCurrentStepIndex()

    // Mark current step as completed if valid
    if (isStepValid(currentStep) && !completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep])
    }

    if (isLastStep()) {
      handleComplete()
    } else {
      const nextStep = steps[currentIndex + 1]
      setCurrentStep(nextStep)
    }
  }

  const handleBack = () => {
    if (!isFirstStep()) {
      const currentIndex = getCurrentStepIndex()
      const prevStep = steps[currentIndex - 1]
      setCurrentStep(prevStep)
    }
  }

  const handleStepClick = (step: OnboardingStep) => {
    setCurrentStep(step)
  }

  const handleComplete = async () => {
    if (!token) {
      setApiError('No authentication token found')
      return
    }

    setIsCompleting(true)
    setApiError('')

    // Mark final step as completed
    if (isStepValid(currentStep) && !completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep])
    }

    try {
      // Save onboarding data to mock API
      const response = await mockApi.saveOnboardingData(token, onboardingData)

      if (response.success && response.data) {
        // Update user data in context
        setUser(response.data)

        // Navigate to dashboard
        navigate('/dashboard')
      } else {
        setApiError(response.error ?? 'Failed to save onboarding data')
        setIsCompleting(false)
      }
    } catch (error) {
      console.error('Onboarding completion error:', error)
      setApiError('An unexpected error occurred. Please try again.')
      setIsCompleting(false)
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'userInfo':
        return <UserInfoStep data={onboardingData.userInfo} onChange={updateUserInfo} />
      case 'organization':
        return <OrganizationStep data={onboardingData.organization} onChange={updateOrganization} />
      case 'businessSettings':
        return (
          <BusinessSettingsStep
            data={onboardingData.businessSettings}
            onChange={updateBusinessSettings}
          />
        )
      case 'products':
        return <ProductsStep data={onboardingData.products} onChange={updateProducts} />
      case 'billing':
        return <BillingStep data={onboardingData.billing} onChange={updateBilling} />
      case 'team':
        return <TeamStep data={onboardingData.team} onChange={updateTeam} />
      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-[#D417C8] via-[#7767DA] to-[#14BDEA] bg-clip-text text-transparent">
                Round
              </span>
            </h1>
            <p className="text-xl text-gray-400">
              Let&apos;s set up your account in just a few steps
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <div className="mb-12">
            <TabNavigation
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={handleStepClick}
            />
          </div>

          {/* API Error Message */}
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-6"
            >
              <div className="flex items-center space-x-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{apiError}</span>
              </div>
            </motion.div>
          )}

          {/* Step Content */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
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

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <button
              onClick={handleBack}
              disabled={isFirstStep()}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
                ${
                  isFirstStep()
                    ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20'
                }
              `}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepValid(currentStep) || isCompleting}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
                ${getNextButtonClasses()}
              `}
            >
              <span>{getButtonText()}</span>
              {getButtonIcon()}
            </button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
