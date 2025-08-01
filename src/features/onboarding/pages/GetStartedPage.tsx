import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react'
import { DashboardLayout } from '@/shared/components/DashboardLayout'
import { TabNavigation } from '../components/TabNavigation'
import { useAuth } from '@/shared/hooks/useAuth'
import { useOrganization } from '@/shared/hooks/api/useOrganization'
import { organizationService } from '@/shared/services/api/organization.service'
import { authService } from '@/shared/services/api/auth.service'
import { addressService } from '@/shared/services/api/address.service'

// Simple error parser utility
const parseBackendError = (error: unknown) => {
  if (error instanceof Error) {
    return { message: error.message, details: error }
  }
  if (typeof error === 'string') {
    return { message: error, details: error }
  }
  return { message: 'An unknown error occurred', details: error }
}

// Import proper types
import type { 
  OnboardingData, 
  OnboardingStep, 
  UserInfo, 
  OrganizationInfo, 
  BusinessSettings, 
  AddressInfo, 
  ProductInfo, 
  BillingSettings, 
  TeamSettings 
} from '../types/onboarding'
import type { 
  OrganizationResponse, 
  OrganizationRequest, 
  CreateAddressData, 
  UpdateAddressData 
} from '@/shared/types/api'

// Import Step Components
import { UserInfoStep } from '../components/steps/UserInfoStep'
import { OrganizationStep } from '../components/steps/OrganizationStep'
import { BusinessSettingsStep } from '../components/steps/BusinessSettingsStep'
import { AddressStep } from '../components/steps/AddressStep'
import { ProductsStep } from '../components/steps/ProductsStep'
import { BillingStep } from '../components/steps/BillingStep'
import { TeamStep } from '../components/steps/TeamStep'

interface ErrorToast {
  show: boolean
  message: string
  isVisible: boolean
  details?: unknown
}

// Constants
const allSteps: OnboardingStep[] = ['organization', 'businessSettings', 'address', 'products', 'billing', 'team']

const defaultOnboardingData: OnboardingData = {
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
    addressLine1: '',
    addressLine2: '',
    number: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    addressType: 'billing',
    isPrimary: true,
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
}

export const GetStartedPage = () => {
  const navigate = useNavigate()
  const { state, setUser: _setUser } = useAuth()
  const { token: _token, user } = state
  const { getCurrentOrganization } = useOrganization()

  // State
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('organization')
  const [completedSteps, setCompletedSteps] = useState<OnboardingStep[]>([])
  const [availableSteps, setAvailableSteps] = useState<OnboardingStep[]>(allSteps)
  const [isCompleting, setIsCompleting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [cachedOrgData, setCachedOrgData] = useState<OrganizationResponse | null>(null)
  const [errorToast, setErrorToast] = useState<ErrorToast>({
    show: false,
    isVisible: false,
    message: '',
    details: undefined
  })
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(defaultOnboardingData)
  
  // Refs
  const loadingRef = useRef(false)

  // Error handling
  const showErrorToast = useCallback((error: unknown) => {
    const parsedError = parseBackendError(error)
    setErrorToast({
      show: true,
      isVisible: true,
      message: parsedError.message || 'An error occurred',
      details: parsedError.details
    })
  }, [])

  const hideErrorToast = useCallback(() => {
    setErrorToast({
      show: false,
      isVisible: false,
      message: '',
      details: undefined
    })
  }, [])

  // Step validation
  const isStepValid = useCallback((step: OnboardingStep): boolean => {
    switch (step) {
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
          address.addressLine1?.trim() !== '' &&
          address.number?.trim() !== '' &&
          address.city?.trim() !== '' &&
          address.state?.trim() !== '' &&
          address.zipCode?.trim() !== '' &&
          address.country !== ''
        )
      }

      case 'products':
      case 'billing':
      case 'team':
        return true // Optional steps

      default:
        return false
    }
  }, [onboardingData])

  // Step navigation
  const getCurrentStepIndex = useCallback(() => availableSteps.indexOf(currentStep), [availableSteps, currentStep])

  const isFirstStep = useCallback(() => getCurrentStepIndex() === 0, [getCurrentStepIndex])
  const isLastStep = useCallback(() => getCurrentStepIndex() === availableSteps.length - 1, [getCurrentStepIndex, availableSteps])

  // Data update functions
  const updateUserInfo = useCallback((userInfo: UserInfo) => {
    setOnboardingData(prev => ({ ...prev, userInfo }))
  }, [])

  const updateOrganization = useCallback((organization: OrganizationInfo) => {
    setOnboardingData(prev => ({ ...prev, organization }))
  }, [])

  const updateBusinessSettings = useCallback((businessSettings: BusinessSettings) => {
    setOnboardingData(prev => ({ ...prev, businessSettings }))
  }, [])

  const updateAddress = useCallback((address: AddressInfo) => {
    setOnboardingData(prev => ({ ...prev, address }))
  }, [])

  const updateProducts = useCallback((products: ProductInfo) => {
    setOnboardingData(prev => ({ ...prev, products }))
  }, [])

  const updateBilling = useCallback((billing: BillingSettings) => {
    setOnboardingData(prev => ({ ...prev, billing }))
  }, [])

  const updateTeam = useCallback((team: TeamSettings) => {
    setOnboardingData(prev => ({ ...prev, team }))
  }, [])

  // Load organization and user data
  const loadOnboardingData = useCallback(async () => {
    if (loadingRef.current) return
    loadingRef.current = true
    setApiError('')

    try {
      // Load user data
      try {
        const userResponse = await authService.getCurrentUser()
        if (userResponse.success && userResponse.data) {
          const currentUser = userResponse.data
          updateUserInfo({
            firstName: currentUser.firstName || '',
            lastName: currentUser.lastName || '',
            email: currentUser.email || '',
            phone: currentUser.phone || '',
          })

          if (currentUser.firstName && currentUser.lastName && currentUser.email && currentUser.phone) {
            setCompletedSteps(prev => [...prev, 'userInfo'])
          }
        }
      } catch (userError) {
        setApiError('Failed to load user data')
      }

      // Load organization data
      if (user) {
        try {
          const orgResponse = await getCurrentOrganization()
          if (orgResponse.success && orgResponse.data) {
            const org = orgResponse.data
            setCachedOrgData(org)

            const orgData: OrganizationInfo = {
              companyName: org.name ?? '',
              industry: org.category ?? '',
              companySize: org.size ?? '',
              website: org.website ?? '',
              description: org.description ?? '',
              timeZone: org.timeZone ?? '',
              revenue: org.revenue?.toString() ?? '',
              country: org.country ?? '',
            }
            
            updateOrganization(orgData)
            
            if (org.name && org.category && org.size && org.country) {
              setCompletedSteps(prev => [...prev, 'organization'])
            }

            // Update address from organization
            if (org.address) {
              updateAddress({
                name: org.address.name,
                street: org.address.addressLine1 ?? '',
                addressLine1: org.address.addressLine1,
                addressLine2: org.address.addressLine2 ?? '',
                number: org.address.number ?? '',
                city: org.address.city,
                state: org.address.state ?? '',
                zipCode: org.address.zipCode,
                country: org.address.country,
                addressType: 'billing',
                isPrimary: true
              })
              setCompletedSteps(prev => [...prev, 'address'])
            }

            // Update business settings
            if (org.currency) {
              updateBusinessSettings({
                currency: org.currency ?? 'USD',
                timezone: org.timeZone ?? 'UTC',
                fiscalYearStart: org.fiscalYearStart ?? 'January',
              })
              setCompletedSteps(prev => [...prev, 'businessSettings'])
            }
          }
        } catch (orgError) {
          showErrorToast(orgError)
          setApiError('Failed to load organization data')
        }
      }

      if (user) {
        setAvailableSteps(allSteps)
      } else {
        setAvailableSteps(['userInfo'])
      }

    } catch (error) {
      console.error('CRITICAL ERROR in loadOnboardingData:', error)
      setApiError('Failed to load onboarding data')
    } finally {
      loadingRef.current = false
    }
  }, [getCurrentOrganization, user, updateUserInfo, updateOrganization, updateAddress, updateBusinessSettings, showErrorToast])

  // Initialize data when user is available
  useEffect(() => {
    if (user && !loadingRef.current) {
      loadOnboardingData()
    }
  }, [user, loadOnboardingData])

  // Navigation handlers
  const handleNext = useCallback(async () => {
    try {
      const currentStepValid = isStepValid(currentStep)
      
      if (!currentStepValid) {
        showErrorToast(new Error('Please fill in all required fields'))
        return
      }

      // Mark current step as completed
      setCompletedSteps(prev => {
        if (!prev.includes(currentStep)) {
          return [...prev, currentStep]
        }
        return prev
      })

      // Save data based on current step
      if (isStepValid(currentStep)) {
        setIsCompleting(true)
        try {
          // Save organization data when leaving organization or businessSettings step
          if (currentStep === 'organization' || currentStep === 'businessSettings') {
            const baseOrgData: OrganizationRequest = {
              name: onboardingData.organization.companyName ?? 'Untitled Company',
              description: onboardingData.organization.description ?? 
                `${onboardingData.organization.industry} company`,
              website: onboardingData.organization.website ?? '',
              size: onboardingData.organization.companySize ?? '',
              revenue: onboardingData.organization.revenue 
                ? parseFloat(onboardingData.organization.revenue) 
                : 0,
              category: onboardingData.organization.industry ?? '',
              type: 'corporation',
              registrationNumber: cachedOrgData?.registrationNumber ?? `REG-${Date.now()}`,
              currency: onboardingData.businessSettings.currency ?? 'USD',
              timeZone: onboardingData.businessSettings.timezone ?? 'UTC',
              country: onboardingData.organization.country ?? 'US',
              userId: state.user?.id ?? '',
              fiscalYearStart: onboardingData.businessSettings.fiscalYearStart ?? 'January'
            }

            let result = null
            if (cachedOrgData) {
              // Update existing organization
              result = await organizationService.update(cachedOrgData.organizationId, baseOrgData)
            } else {
              // Create new organization
              result = await organizationService.create(baseOrgData)
              // Cache the created organization for future updates
              if (result?.success && result.data) {
                setCachedOrgData(result.data)
              }
            }

            if (!result?.success) {
              throw new Error('Failed to save organization')
            }
          }

          // Save address data when leaving address step
          if (currentStep === 'address') {
            const addressData = onboardingData.address
            if (!addressData.name || !addressData.addressLine1 || !addressData.city || !addressData.country) {
              throw new Error('Address information is incomplete')
            }

            let addressResult = null
            if (cachedOrgData?.address?.addressId) {
              // Update existing address
              const updateData: UpdateAddressData = {
                name: addressData.name,
                addressLine1: addressData.addressLine1,
                addressLine2: addressData.addressLine2,
                number: addressData.number,
                city: addressData.city,
                state: addressData.state,
                zipCode: addressData.zipCode,
                country: addressData.country,
                addressType: addressData.addressType,
                isPrimary: addressData.isPrimary
              }
              addressResult = await addressService.update(cachedOrgData.address.addressId, updateData)
            } else {
              // Create new address
              const createData: CreateAddressData = {
                name: addressData.name,
                addressLine1: addressData.addressLine1,
                addressLine2: addressData.addressLine2,
                number: addressData.number,
                city: addressData.city,
                state: addressData.state || '',
                zipCode: addressData.zipCode,
                country: addressData.country,
                addressType: addressData.addressType,
                isPrimary: addressData.isPrimary
              }
              addressResult = await addressService.create(createData)
            }

            if (!addressResult?.success) {
              throw new Error('Failed to save address')
            }

            // If we have an organization and created a new address, link them
            if (addressResult.success && addressResult.data && cachedOrgData && !cachedOrgData.addressId) {
              try {
                // Update organization with the new address ID
                const orgUpdateData = {
                  ...cachedOrgData,
                  addressId: addressResult.data.addressId
                }
                await organizationService.update(cachedOrgData.organizationId, orgUpdateData)
              } catch (linkError) {
                console.warn('Failed to link address to organization:', linkError)
                // Don't fail the whole process for this
              }
            }
          }

        } catch (error) {
          showErrorToast(error instanceof Error ? error.message : 'Failed to save data')
          console.error('Save data error:', error)
          return
        } finally {
          setIsCompleting(false)
        }
      }

      // Move to next step
      const index = getCurrentStepIndex()
      const nextStep = availableSteps[index + 1]
      if (nextStep) {
        setCurrentStep(nextStep)
      } else {
        // Complete onboarding
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Navigation error:', error)
      showErrorToast(error instanceof Error ? error.message : 'Navigation error occurred') 
    }
  }, [
    currentStep,
    isStepValid,
    onboardingData,
    state.user,
    getCurrentStepIndex,
    availableSteps,
    showErrorToast,
    navigate,
    cachedOrgData
  ])

  const handleBack = useCallback(() => {
    if (!isFirstStep()) {
      const currentIndex = getCurrentStepIndex()
      const prevStep = availableSteps[currentIndex - 1]
      setCurrentStep(prevStep)
    }
  }, [isFirstStep, getCurrentStepIndex, availableSteps])

  const handleStepClick = useCallback((step: OnboardingStep) => {
    setCurrentStep(step)
  }, [])

  // UI helpers
  const getNextButtonClasses = (): string => {
    if (!isStepValid(currentStep) || isCompleting) {
      return 'bg-white/5 text-gray-500 cursor-not-allowed'
    }
    return 'bg-gradient-to-r from-[#D417C8] to-[#14BDEA] text-white hover:shadow-lg hover:shadow-[#D417C8]/30 transform hover:scale-105'
  }

  const getButtonText = (): string => {
    if (isCompleting) return 'Saving...'
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

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'userInfo':
        return (
          <UserInfoStep
            data={onboardingData.userInfo}
            onChange={updateUserInfo}
          />
        )
      case 'organization':
        return (
          <OrganizationStep
            data={onboardingData.organization}
            onChange={updateOrganization}
            isPrePopulated={!!onboardingData.organization.companyName}
          />
        )
      case 'businessSettings':
        return (
          <BusinessSettingsStep
            data={onboardingData.businessSettings}
            onChange={updateBusinessSettings}
          />
        )
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
      
      {/* Error Toast - You'll need to create this component or remove if not available */}
      {errorToast.isVisible && (
        <div className="fixed top-4 right-4 bg-red-500/90 text-white p-4 rounded-xl shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{errorToast.message}</span>
            <button onClick={hideErrorToast} className="ml-2 text-white/70 hover:text-white">
              ×
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}