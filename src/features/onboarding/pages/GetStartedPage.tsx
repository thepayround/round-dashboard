import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { DashboardLayout } from '@/shared/components/DashboardLayout'
import { ErrorToast } from '@/shared/components/ErrorToast'
import { parseBackendError } from '@/shared/utils/errorHandling'
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
  const { getCurrentOrganization } = useOrganization()

  // Show error toast function
  const showErrorToast = (error: unknown) => {
    const parsedError = parseBackendError(error)
    setErrorToast({
      isVisible: true,
      message: parsedError.message,
      details: parsedError.details,
    })
  }

  // Hide error toast function
  const hideErrorToast = () => {
    setErrorToast({
      isVisible: false,
      message: '',
      details: undefined,
    })
  }

  const [currentStep, setCurrentStep] = useState<OnboardingStep>('userInfo')
  const [completedSteps, setCompletedSteps] = useState<OnboardingStep[]>([])
  const [availableSteps, setAvailableSteps] = useState<OnboardingStep[]>(allSteps)
  const [isCompleting, setIsCompleting] = useState(false)
  const [apiError, setApiError] = useState('')
  const loadingRef = useRef(false)
  
  // Error toast state
  const [errorToast, setErrorToast] = useState<{
    isVisible: boolean
    message: string
    details?: Record<string, string>
  }>({
    isVisible: false,
    message: '',
    details: undefined,
  })

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
      country: '',
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
    // Prevent multiple simultaneous calls using ref (avoids state dependency)
    if (loadingRef.current) {
      return
    }

    loadingRef.current = true
    setApiError('')

    try {
      // Initialize with current state to avoid losing data
      setOnboardingData(currentData => {
        const updatedData = { ...currentData }

        // Set default user info if not already set
        if (!updatedData.userInfo.firstName) {
          updatedData.userInfo = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
          }
        }

        return updatedData
      })

      let currentUser = null

      try {
        const userResponse = await authService.getCurrentUser()
        if (userResponse.success && userResponse.data) {
          currentUser = userResponse.data

          // Update user info with actual data
          setOnboardingData(currentData => ({
            ...currentData,
            userInfo: {
              firstName: currentUser!.firstName || '',
              lastName: currentUser!.lastName || '',
              email: currentUser!.email || '',
              phone: currentUser!.phone || '',
            }
          }))

          // Mark user info as completed if we have the required data
          if (
            currentUser.firstName &&
            currentUser.lastName &&
            currentUser.email &&
            currentUser.phone
          ) {
            setCompletedSteps(prev => [...prev, 'userInfo'])
          }
        }
      } catch (userError) {
        setApiError('Failed to load user data')
      }

      if (currentUser) {
        try {
          const orgResponse = await getCurrentOrganization()

          if (orgResponse.success && orgResponse.data) {
            const org = orgResponse.data

            // Update organization data
            setOnboardingData(currentData => ({
              ...currentData,
              organization: {
                companyName: org.name ?? '',
                industry: org.category ?? '',
                companySize: org.size ?? '',
                website: org.website ?? '',
                description: org.description ?? '',
                timeZone: org.timeZone ?? '',
                revenue: org.revenue?.toString() ?? '',
                country: org.country ?? '',
              }
            }))

            // Mark organization as completed if we have required data
            if (org.name && org.category && org.size && org.country) {
              setCompletedSteps(prev => [...prev, 'organization'])
            }

            // Update address from organization response (addresses come WITH organization)
            if (org.address?.addressLine1) {
              const { address } = { address: org.address }
              setOnboardingData(currentData => ({
                ...currentData,
                address: {
                  name: address.name || 'Organization Address',
                  street: address.addressLine1,
                  city: address.city || '',
                  state: address.state || '',
                  zipCode: address.zipCode || '',
                  country: address.country || '',
                  addressType: 'billing' as const,
                }
              }))
              setCompletedSteps(prev => [...prev, 'address'])
            }

            // Update business settings
            if (org.currency) {
              setOnboardingData(currentData => ({
                ...currentData,
                businessSettings: {
                  currency: org.currency ?? 'USD',
                  timezone: org.timeZone ?? 'UTC',
                  fiscalYearStart: 'January',
                }
              }))
              setCompletedSteps(prev => [...prev, 'businessSettings'])
            }
          }
        } catch (orgError) {
          showErrorToast(orgError)
          setApiError('Failed to load organization data')
        }
      }

      // Update available steps based on user authentication
      if (currentUser) {
        setAvailableSteps(allSteps) // Show all steps for authenticated users
      } else {
        setAvailableSteps(['userInfo']) // Only show user info if not authenticated
      }

    } catch (error) {
      console.error('CRITICAL ERROR in loadOnboardingData:', error)
      setApiError('Failed to load onboarding data')
    } finally {
      loadingRef.current = false
    }
  }, [getCurrentOrganization])

  // Initialize data when user is available (proper useEffect usage for side effects)
  useEffect(() => {
    if (user && !loadingRef.current) {
      loadOnboardingData()
    }
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
        if (!userInfo) return false
        return (
          userInfo.firstName?.trim() !== '' &&
          userInfo.lastName?.trim() !== '' &&
          userInfo.email?.trim() !== '' &&
          userInfo.phone?.trim() !== ''
        )
      }

      case 'organization': {
        const { organization } = onboardingData
        if (!organization) return false
        return (
          organization.companyName?.trim() !== '' &&
          organization.industry !== '' &&
          organization.companySize !== '' &&
          organization.country !== ''
        )
      }

      case 'businessSettings': {
        const { businessSettings } = onboardingData
        if (!businessSettings) return false
        return (
          businessSettings.currency !== '' &&
          businessSettings.timezone !== '' &&
          businessSettings.fiscalYearStart !== ''
        )
      }

      case 'address': {
        const { address } = onboardingData
        if (!address) return false
        return (
          address.name?.trim() !== '' &&
          address.street?.trim() !== '' &&
          address.city?.trim() !== '' &&
          address.state?.trim() !== '' &&
          address.zipCode?.trim() !== '' &&
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
          // Base organization data
          const baseOrgData = {
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
            country: onboardingData.organization.country ?? 'US', // Get from organization form
          }

          // For create operations, include userId
          const createOrgData = {
            ...baseOrgData,
            userId: user?.id ?? '',
          }

          // For update operations, exclude userId (backend validation might reject it)
          const updateOrgData = baseOrgData


          // Check if user already has an organization using single API call
          let orgResponse
          if (user?.accountType === 'business') {
            try {
              let existingOrg = null

              // Use the clean workflow method
              const currentOrgResponse = await getCurrentOrganization()
              if (currentOrgResponse.success && currentOrgResponse.data) {
                existingOrg = currentOrgResponse.data
              }

              if (existingOrg) {
                orgResponse = await organizationService.update(
                  existingOrg.organizationId,
                  updateOrgData
                )
              } else {
                orgResponse = await organizationService.create(createOrgData)
              }
            } catch (fetchError) {
              orgResponse = await organizationService.create(createOrgData)
            }
          } else {
            // Create new organization for non-business users
            orgResponse = await organizationService.create(createOrgData)
          }

          if (!orgResponse.success) {
            console.error('Failed to save organization:', orgResponse)
            showErrorToast(orgResponse.error ?? 'Failed to save organization data')
            setIsCompleting(false)
            return
          }

        } catch (error) {
          console.error('Error saving organization:', error)
          showErrorToast(error)
          setIsCompleting(false)
          return
        }

        setIsCompleting(false)
      }
    }


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
      showErrorToast(error)
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
      
      {/* Error Toast */}
      <ErrorToast
        isVisible={errorToast.isVisible}
        message={errorToast.message}
        details={errorToast.details}
        onClose={hideErrorToast}
      />
    </DashboardLayout>
  )
}
