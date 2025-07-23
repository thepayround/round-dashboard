import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { DashboardLayout } from '@/shared/components/DashboardLayout'
import { mockApi } from '@/shared/services/mockApi'
import { useAuth } from '@/shared/hooks/useAuth'
import { useOrganization } from '@/shared/hooks/api/useOrganization'
import { organizationService } from '@/shared/services/api/organization.service'
import { authService } from '@/shared/services/api/auth.service'
import type { User } from '@/shared/types/auth'
import { TabNavigation } from '../components/TabNavigation'
import { UserInfoStep } from '../components/steps/UserInfoStep'
import { OrganizationStep } from '../components/steps/OrganizationStep'
import { BusinessSettingsStep } from '../components/steps/BusinessSettingsStep'
import { AddressStep } from '../components/steps/AddressStep'
import { ProductsStep } from '../components/steps/ProductsStep'
import { BillingStep } from '../components/steps/BillingStep'
import { TeamStep } from '../components/steps/TeamStep'

import type {
  OnboardingData,
  OnboardingStep,
  UserInfo,
  OrganizationInfo,
  BusinessSettings,
  AddressInfo,
  ProductInfo,
  BillingSettings,
  TeamSettings,
} from '../types/onboarding'

const allSteps: OnboardingStep[] = [
  'userInfo',
  'organization',
  'businessSettings',
  'products',
  'billing',
  'team',
]

export const GetStartedPage = () => {
  const navigate = useNavigate()
  const { state, setUser } = useAuth()
  const { token, user } = state
  const { getCurrentUserOrganization } = useOrganization()

  const [currentStep, setCurrentStep] = useState<OnboardingStep>('userInfo')
  const [completedSteps, setCompletedSteps] = useState<OnboardingStep[]>([])
  const [availableSteps, setAvailableSteps] = useState<OnboardingStep[]>(allSteps)
  const [isCompleting, setIsCompleting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [isLoadingData, setIsLoadingData] = useState(false)
  const loadingRef = useRef(false)

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
      description: '',
      timeZone: '',
      revenue: '',
    },
    businessSettings: {
      currency: 'USD',
      timezone: 'UTC',
      fiscalYearStart: 'January',
    },
    address: {
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      addressType: 'billing',
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

  // Load data with EXACTLY TWO API CALLS - simplified and clear
  const loadOnboardingData = useCallback(async () => {
    // Prevent multiple simultaneous calls ONLY (allow calls every time page is visited)
    if (loadingRef.current || isLoadingData) {
      // Skipping loadOnboardingData - already loading
      return
    }

    // Making exactly two API calls every time page is visited
    loadingRef.current = true
    setIsLoadingData(true)
    setApiError('')

    try {
      const updatedData = { ...onboardingData }
      const newCompletedSteps: OnboardingStep[] = []
      const stepsToShow: OnboardingStep[] = []

      // *** API CALL 1: Get user data + round account ***
      // API CALL 1: Getting user data + round account
      let currentUser = null

      try {
        const userResponse = await authService.getCurrentUser()
        if (userResponse.success && userResponse.data) {
          currentUser = userResponse.data
          // API CALL 1 SUCCESS - User + round account data received via /identities/me

          // Prefill user info
          updatedData.userInfo = {
            firstName: currentUser.firstName || '',
            lastName: currentUser.lastName || '',
            email: currentUser.email || '',
            phone: currentUser.phone || '',
          }

          // Mark user info as completed if we have the required data
          if (
            currentUser.firstName &&
            currentUser.lastName &&
            currentUser.email &&
            currentUser.phone
          ) {
            newCompletedSteps.push('userInfo')
          }
        } else {
          // API CALL 1 FAILED - No user data received
        }
      } catch (userError) {
        console.error('❌ API CALL 1 ERROR:', userError)
        setApiError('Failed to load user data')
      }

      // *** API CALL 2: Get organization + address data (business users only) ***
      if (currentUser?.accountType === 'business') {
        // API CALL 2: Getting organization + address data

        try {
          const orgResponse = await getCurrentUserOrganization()

          if (orgResponse.success && orgResponse.data) {
            const org = orgResponse.data
            // API CALL 2 SUCCESS - Organization + address data received

            // Prefill organization step
            updatedData.organization = {
              companyName: org.name ?? '',
              industry: org.category ?? '',
              companySize: org.size ?? '',
              website: org.website ?? '',
              description: org.description ?? '',
              timeZone: org.timeZone ?? '',
              revenue: org.revenue?.toString() ?? '',
            }

            // Mark organization as completed if we have required data
            if (org.name && org.category && org.size) {
              newCompletedSteps.push('organization')
            }

            // Prefill address from organization response (addresses come WITH organization)
            if (org.address?.addressLine1) {
              updatedData.address = {
                name: org.address.name || 'Organization Address',
                street: org.address.addressLine1,
                city: org.address.city || '',
                state: org.address.state || '',
                zipCode: org.address.zipCode || '',
                country: org.address.country || '',
                addressType: 'billing' as const,
              }
              newCompletedSteps.push('address')
            }

            // Prefill business settings
            if (org.currency) {
              updatedData.businessSettings = {
                currency: org.currency,
                timezone: org.timeZone ?? 'UTC',
                fiscalYearStart: 'January',
              }
              newCompletedSteps.push('businessSettings')
            }
          } else {
            // API CALL 2 FAILED - No organization data received
          }
        } catch (orgError) {
          console.error('❌ API CALL 2 ERROR:', orgError)
          setApiError('Failed to load organization data')
        }
      }

      // Determine which steps to show
      if (!newCompletedSteps.includes('userInfo')) stepsToShow.push('userInfo')
      if (currentUser?.accountType === 'business') {
        if (!newCompletedSteps.includes('organization')) stepsToShow.push('organization')
        if (!newCompletedSteps.includes('businessSettings')) stepsToShow.push('businessSettings')
        if (!newCompletedSteps.includes('address')) stepsToShow.push('address')
      }

      // Always show optional steps
      stepsToShow.push('products', 'billing', 'team')

      // Update state
      setOnboardingData(updatedData)
      setAvailableSteps(stepsToShow)
      setCompletedSteps(newCompletedSteps)

      // Set current step to first uncompleted step
      const nextStep = stepsToShow.find(step => !newCompletedSteps.includes(step)) ?? stepsToShow[0]
      if (nextStep) {
        setCurrentStep(nextStep)
      }

      // DATA LOADING COMPLETE - Both API calls finished
    } catch (error) {
      console.error('CRITICAL ERROR in loadOnboardingData:', error)
      setApiError('Failed to load onboarding data')
    } finally {
      loadingRef.current = false
      setIsLoadingData(false)
    }
  }, [getCurrentUserOrganization, isLoadingData, onboardingData])

  useEffect(() => {
    if (!user) return
    loadOnboardingData()
  }, [user, loadOnboardingData])

  const getCurrentStepIndex = () => availableSteps.indexOf(currentStep)
  const isLastStep = () => getCurrentStepIndex() === availableSteps.length - 1

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

  const updateAddress = (address: AddressInfo) => {
    setOnboardingData(prev => ({ ...prev, address }))
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

      case 'address': {
        const { address } = onboardingData
        return (
          address.name.trim() !== '' &&
          address.street.trim() !== '' &&
          address.city.trim() !== '' &&
          address.state.trim() !== '' &&
          address.zipCode.trim() !== '' &&
          address.country !== ''
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

  const handleNext = async () => {
    const currentIndex = getCurrentStepIndex()

    // Save organization data to backend when leaving organization step
    if (currentStep === 'organization' && isStepValid(currentStep)) {
      if (onboardingData.organization.companyName.trim()) {
        setIsCompleting(true) // Show loading state

        try {
          const orgData = {
            name: onboardingData.organization.companyName,
            description:
              onboardingData.organization.description ??
              `${onboardingData.organization.industry} company with ${onboardingData.organization.companySize} employees`,
            website: onboardingData.organization.website ?? '',
            size: onboardingData.organization.companySize ?? '',
            revenue: onboardingData.organization.revenue
              ? parseFloat(onboardingData.organization.revenue)
              : 0,
            category: onboardingData.organization.industry ?? '',
            type: 'corporation',
            registrationNumber: `REG-${Date.now()}`, // Generate a temporary registration number
            currency: onboardingData.businessSettings.currency ?? 'USD',
            timeZone:
              onboardingData.organization.timeZone ??
              onboardingData.businessSettings.timezone ??
              'UTC',
            country: onboardingData.address?.country ?? 'US', // Get from address if available
            userId: user?.id ?? '',
          }

          // Saving organization data on next

          // Check if user already has an organization using single API call
          let orgResponse
          if (user?.accountType === 'business') {
            // Check if user already has an organization using single API call
            // CLEAN WORKFLOW: Use getCurrentUserOrganization method
            try {
              let existingOrg = null

              // Use the clean workflow method
              const currentOrgResponse = await getCurrentUserOrganization()
              if (currentOrgResponse.success && currentOrgResponse.data) {
                existingOrg = currentOrgResponse.data
                // Found existing organization
              }

              if (existingOrg) {
                // Update existing organization
                // Updating existing organization
                orgResponse = await organizationService.update(existingOrg.organizationId, orgData)
              } else {
                // Create new organization
                // No organization found, creating new organization
                orgResponse = await organizationService.create(orgData)
              }
            } catch (fetchError) {
              // If fetch fails, try to create new organization
              // Failed to fetch existing organizations, creating new one
              orgResponse = await organizationService.create(orgData)
            }
          } else {
            // Create new organization for non-business users
            orgResponse = await organizationService.create(orgData)
          }

          if (!orgResponse.success) {
            console.error('Failed to save organization:', orgResponse)
            setApiError('Failed to save organization data')
            setIsCompleting(false)
            return
          }

          // Organization saved successfully on next
        } catch (error) {
          console.error('Error saving organization:', error)
          setApiError('Failed to save organization data')
          setIsCompleting(false)
          return
        }

        setIsCompleting(false)
      }
    }

    // Address data is included in organization response - no separate API calls needed
    // Address handling: Addresses come with organization data, no separate API calls needed

    // Mark current step as completed if valid
    if (isStepValid(currentStep) && !completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep])
    }

    if (isLastStep()) {
      handleComplete()
    } else {
      const nextStep = availableSteps[currentIndex + 1]
      setCurrentStep(nextStep)
    }
  }

  const handleBack = () => {
    if (!isFirstStep()) {
      const currentIndex = getCurrentStepIndex()
      const prevStep = availableSteps[currentIndex - 1]
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
      // Organization data is already saved when user clicked "Next" from organization step
      // Just save remaining onboarding data to mock API (for now)
      const response = await mockApi.saveOnboardingData(token, onboardingData)

      if (response.success && response.data) {
        // Update user data in context
        setUser(response.data as User)

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
        // Only render if the step is in availableSteps (when user data is missing)
        return availableSteps.includes('userInfo') ? (
          <UserInfoStep
            data={onboardingData.userInfo}
            onChange={updateUserInfo}
            isPrePopulated={completedSteps.includes('userInfo')}
          />
        ) : null
      case 'organization':
        // Only render if the step is in availableSteps (when organization data is missing)
        return availableSteps.includes('organization') ? (
          <OrganizationStep
            data={onboardingData.organization}
            onChange={updateOrganization}
            isPrePopulated={!!onboardingData.organization.companyName}
          />
        ) : null
      case 'businessSettings':
        // Only render if the step is in availableSteps (when business settings data is missing)
        return availableSteps.includes('businessSettings') ? (
          <BusinessSettingsStep
            data={onboardingData.businessSettings}
            onChange={updateBusinessSettings}
          />
        ) : null
      case 'address':
        return (
          <AddressStep
            data={onboardingData.address}
            onChange={updateAddress}
            isPrePopulated={completedSteps.includes('address')}
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
            <p className="text-xl text-gray-400 mb-3">
              Let&apos;s set up your account in just a few steps
            </p>
            {completedSteps.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#42E695]/10 to-[#3BB2B8]/10 border border-[#42E695]/20"
              >
                <span className="text-[#42E695] text-sm font-medium">
                  ✓ {completedSteps.length} of {availableSteps.length} steps completed automatically
                  {completedSteps.length !== availableSteps.length &&
                    ` • ${availableSteps.length - completedSteps.length} steps remaining`}
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Tab Navigation */}
          <div className="mb-12">
            <TabNavigation
              currentStep={currentStep}
              completedSteps={completedSteps}
              availableSteps={availableSteps}
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
