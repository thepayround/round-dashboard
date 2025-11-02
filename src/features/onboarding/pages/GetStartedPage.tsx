import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { TabNavigation } from '../components/TabNavigation'
import { AddressStep } from '../components/steps/AddressStep'
import { BillingStep } from '../components/steps/BillingStep'
import { OrganizationStep } from '../components/steps/OrganizationStep'
import { ProductsStep } from '../components/steps/ProductsStep'
import { TeamStep } from '../components/steps/TeamStep'
import { UserInfoStep } from '../components/steps/UserInfoStep'
import type {
  OnboardingData,
  OnboardingStep,
  UserInfo,
  OrganizationInfo,
  BusinessSettings,
  EnhancedAddressInfo,
  ProductInfo,
  BillingSettings,
  TeamSettings
} from '../types/onboarding'

import { ActionButton } from '@/shared/components'
import { Button } from '@/shared/components/Button'
import { DashboardLayout } from '@/shared/components/DashboardLayout'
import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { useOrganization } from '@/shared/hooks/api/useOrganization'
import { useAuth } from '@/shared/hooks/useAuth'
import { useDebouncedUpdate } from '@/shared/hooks/useDebouncedUpdate'
import { useFormChangeDetection } from '@/shared/hooks/useFormChangeDetection'
import { addressService } from '@/shared/services/api/address.service'
import { authService } from '@/shared/services/api/auth.service'
import { organizationService } from '@/shared/services/api/organization.service'
import type {
  OrganizationResponse,
  OrganizationRequest,
  CreateAddressData
} from '@/shared/types/api'

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

// Constants
const allSteps: OnboardingStep[] = ['organization', 'address', 'team', 'products', 'billing']

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
    organizationType: '',
    website: '',
    description: '',
    timeZone: '',
    revenue: '',
    country: '',
    registrationNumber: '',
    taxId: '',
    currency: '',
  },
  businessSettings: {
    timezone: '',
    fiscalYearStart: '',
  },
  address: {
    billingAddress: {
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
    shippingAddress: {
      name: '',
      street: '',
      addressLine1: '',
      addressLine2: '',
      number: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      addressType: 'shipping',
      isPrimary: false,
    },
    sameAsBilling: true,
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
  const { showSuccess, showError } = useGlobalToast()

  // State
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('organization')
  const [completedSteps, setCompletedSteps] = useState<OnboardingStep[]>([])
  const [availableSteps, setAvailableSteps] = useState<OnboardingStep[]>(allSteps)
  const [isCompleting, setIsCompleting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [cachedOrgData, setCachedOrgData] = useState<OrganizationResponse | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(true) // Track if we're still loading initial data
  // Removed local error toast state - using global toast system instead
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(defaultOnboardingData)
  
  // Form change detection hooks
  const organizationChangeDetection = useFormChangeDetection<OrganizationRequest>()
  const _addressChangeDetection = useFormChangeDetection<CreateAddressData>()
  
  // Refs
  const loadingRef = useRef(false)

  // Error handling using global toast system
  const handleError = useCallback((error: unknown) => {
    const parsedError = parseBackendError(error)
    showError(parsedError.message ?? 'An error occurred')
  }, [showError])

  // Step validation
  const isStepValid = useCallback((step: OnboardingStep): boolean => {
    switch (step) {
      case 'organization': {
        const { organization, businessSettings } = onboardingData
        if (!organization) return false
        return (
          organization.companyName?.trim() !== '' &&
          organization.industry !== '' &&
          organization.companySize !== '' &&
          organization.organizationType !== '' &&
          organization.country !== '' &&
          organization.registrationNumber?.trim() !== '' &&
          organization.taxId?.trim() !== '' && // Tax ID is now required
          // Include business settings validation (timezone and fiscal year are optional but recommended)
          businessSettings?.timezone !== '' &&
          businessSettings?.fiscalYearStart !== ''
        )
      }

      case 'address': {
        const { address } = onboardingData
        if (!address?.billingAddress) return false
        const billing = address.billingAddress
        return (
          billing.name?.trim() !== '' &&
          billing.addressLine1?.trim() !== '' &&
          billing.number?.trim() !== '' &&
          billing.city?.trim() !== '' &&
          billing.state?.trim() !== '' &&
          billing.zipCode?.trim() !== '' &&
          billing.country !== ''
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

  // Find first incomplete step - smart navigation logic
  const getFirstIncompleteStep = useCallback((): OnboardingStep => {
    // Check each step in order and return the first incomplete one
    for (const step of allSteps) {
      if (!isStepValid(step)) {
        return step
      }
    }
    // If all steps are valid, return the last step
    return allSteps[allSteps.length - 1]
  }, [isStepValid])

  // Step navigation
  const getCurrentStepIndex = useCallback(() => availableSteps.indexOf(currentStep), [availableSteps, currentStep])

  const isFirstStep = useCallback(() => getCurrentStepIndex() === 0, [getCurrentStepIndex])
  const isLastStep = useCallback(() => getCurrentStepIndex() === availableSteps.length - 1, [getCurrentStepIndex, availableSteps])

  // Debounced save functions (declared first)
  const saveOrganizationData = useCallback(async (orgData: OrganizationRequest) => {
    try {
      setIsCompleting(true)
      let result = null
      
      if (cachedOrgData) {
        // Update existing organization
        result = await organizationService.update(cachedOrgData.organizationId, orgData)
      } else {
        // Create new organization
        result = await organizationService.create(orgData)
        // Cache the created organization for future updates
        if (result?.success && result.data) {
          setCachedOrgData(result.data)
          organizationChangeDetection.resetTracking(orgData)
        }
      }

      if (!result?.success) {
        console.error('Organization save failed:', result)
        const errorMessage = result?.error ?? 'Failed to save organization'
        throw new Error(errorMessage)
      }
    } catch (error) {
      handleError(error)
    } finally {
      setIsCompleting(false)
    }
  }, [cachedOrgData, organizationChangeDetection, handleError])

  const { debouncedFn: _debouncedSaveOrganization, flush: flushOrganizationSave } = useDebouncedUpdate(
    saveOrganizationData,
    2000 // 2 second delay
  )

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

  const updateAddress = useCallback((address: EnhancedAddressInfo) => {
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
    setIsLoadingData(true)

    try {
      // Load user data
      try {
        const userResponse = await authService.getCurrentUser()
        if (userResponse.success && userResponse.data) {
          const currentUser = userResponse.data
          updateUserInfo({
            firstName: currentUser.firstName ?? '',
            lastName: currentUser.lastName ?? '',
            email: currentUser.email ?? '',
            phone: currentUser.phone ?? '',
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
              organizationType: org.type ?? '',
              website: org.website ?? '',
              description: org.description ?? '',
              timeZone: org.timeZone ?? '',
              revenue: org.revenue?.toString() ?? '',
              country: org.country ?? '',
              registrationNumber: org.registrationNumber ?? '',
              taxId: org.taxId ?? '',
              currency: org.currency ?? '',
            }
            
            updateOrganization(orgData)
            
            // Determine which steps are completed based on loaded data
            const completedStepsFromData: OnboardingStep[] = []
            
            // Check organization completion (now includes business settings)
            if (org.name && org.category && org.size && org.type && org.country && org.registrationNumber && org.timeZone && org.fiscalYearStart) {
              completedStepsFromData.push('organization')
            }

            // Load organization addresses
            try {
              const addressesResponse = await addressService.getByOrganizationId(org.organizationId)
              if (addressesResponse.success && addressesResponse.data) {
                const addresses = addressesResponse.data

                // Find billing address
                const billingAddress = addresses.find(addr => addr.addressType === 'billing')

                // Create enhanced address data (only billing address for B2B)
                const enhancedAddressData: EnhancedAddressInfo = {
                  billingAddress: billingAddress ? {
                    name: billingAddress.name,
                    street: billingAddress.addressLine1,
                    addressLine1: billingAddress.addressLine1,
                    addressLine2: billingAddress.addressLine2 ?? '',
                    number: billingAddress.number ?? '',
                    city: billingAddress.city,
                    state: billingAddress.state,
                    zipCode: billingAddress.zipCode,
                    country: billingAddress.country,
                    addressType: 'billing',
                    isPrimary: billingAddress.isPrimary ?? true,
                  } : defaultOnboardingData.address.billingAddress,
                  shippingAddress: defaultOnboardingData.address.shippingAddress,
                  sameAsBilling: true,
                }

                updateAddress(enhancedAddressData)

                // Check address completion - require billing address
                if (billingAddress?.name && billingAddress.addressLine1 && billingAddress.city && billingAddress.country) {
                  completedStepsFromData.push('address')
                }
              } else {
                // Fallback to organization address if addresses API fails
                if (org.address) {
                  updateAddress({
                    billingAddress: {
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
                      isPrimary: true,
                    },
                    shippingAddress: defaultOnboardingData.address.shippingAddress,
                    sameAsBilling: true,
                  })

                  // Check address completion
                  if (org.address.name && org.address.addressLine1 && org.address.city && org.address.country) {
                    completedStepsFromData.push('address')
                  }
                }
              }
            } catch (addressError) {
              // Fallback to organization address if addresses API fails
              if (org.address) {
                updateAddress({
                  billingAddress: {
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
                    isPrimary: true,
                  },
                  shippingAddress: defaultOnboardingData.address.shippingAddress,
                  sameAsBilling: true,
                })

                // Check address completion
                if (org.address.name && org.address.addressLine1 && org.address.city && org.address.country) {
                  completedStepsFromData.push('address')
                }
              }
            }

            // Update business settings (now loaded with organization data)
            updateBusinessSettings({
              timezone: org.timeZone ?? '',
              fiscalYearStart: org.fiscalYearStart ?? '',
            })
            
            // Set all completed steps at once to avoid race conditions
            if (completedStepsFromData.length > 0) {
              setCompletedSteps(completedStepsFromData)
            }
          }
        } catch (orgError) {
          handleError(orgError)
          setApiError('Failed to load organization data')
        }
      }

      if (user) {
        setAvailableSteps(allSteps)
      } else {
        setAvailableSteps(['userInfo'])
      }

    } catch (error) {
      setApiError('Failed to load onboarding data')
    } finally {
      loadingRef.current = false
      setIsLoadingData(false)
    }
  }, [getCurrentOrganization, user, updateUserInfo, updateOrganization, updateAddress, updateBusinessSettings, handleError])

  // Initialize data when user is available
  useEffect(() => {
    if (user && !loadingRef.current) {
      loadOnboardingData()
    }
  }, [user, loadOnboardingData])

  // Smart navigation: Auto-navigate to first incomplete step after data is loaded (only once)
  useEffect(() => {
    if (!isLoadingData && onboardingData) {
      // Update completed steps based on loaded data
      const newCompletedSteps: OnboardingStep[] = []
      for (const step of allSteps) {
        if (isStepValid(step)) {
          newCompletedSteps.push(step)
        }
      }
      setCompletedSteps(newCompletedSteps)

      // Only trigger smart navigation once when data first loads
      // Don't interfere with manual navigation afterwards
      const firstIncompleteStep = getFirstIncompleteStep()
      // Only auto-navigate if we're on organization step (initial step) and it's completed
      if (currentStep === 'organization' && isStepValid('organization') && firstIncompleteStep !== 'organization') {
        setCurrentStep(firstIncompleteStep)
      }
    }
  }, [isLoadingData, onboardingData, getFirstIncompleteStep, isStepValid, currentStep])

  // Navigation handlers
  const handleNext = useCallback(async () => {
    try {
      const currentStepValid = isStepValid(currentStep)
      
      if (!currentStepValid) {
        showError('Please fill in all required fields')
        return
      }

      // Save data based on current step
      if (isStepValid(currentStep)) {
        setIsCompleting(true)
        try {
          // Save organization data when leaving organization step (now includes business settings)
          if (currentStep === 'organization') {
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
              // Add Industry field as backend expects it (capital I)
              Industry: onboardingData.organization.industry ?? '',
              type: onboardingData.organization.organizationType ?? '',
              registrationNumber: onboardingData.organization.registrationNumber ?? '',
              taxId: onboardingData.organization.taxId ?? '', // Tax ID is now required
              currency: onboardingData.organization.currency ?? 'USD',
              timeZone: onboardingData.businessSettings.timezone ?? 'UTC',
              country: onboardingData.organization.country ?? 'US',
              userId: state.user?.id ?? '',
              fiscalYearStart: onboardingData.businessSettings.fiscalYearStart ?? 'January'
            } as OrganizationRequest & { Industry: string }

            
            // Validate that industry is not empty
            if (!onboardingData.organization.industry || onboardingData.organization.industry.trim() === '') {
              throw new Error('Industry is required. Please select an industry.')
            }

            // Validate that taxId is not empty (now required)
            if (!onboardingData.organization.taxId || onboardingData.organization.taxId.trim() === '') {
              throw new Error('Tax ID is required for business compliance.')
            }

            // Only save if data has actually changed
            if (organizationChangeDetection.hasChanged(baseOrgData)) {
              // Flush any pending debounced saves and save immediately when navigating
              await flushOrganizationSave(baseOrgData)
            }
          }

          // Save address data when leaving address step
          if (currentStep === 'address') {
            const addressData = onboardingData.address
            const {billingAddress} = addressData

            // Validate billing address (required)
            if (!billingAddress.name || !billingAddress.addressLine1 || !billingAddress.city || !billingAddress.country) {
              throw new Error('Billing address information is incomplete')
            }

            // Create only billing address for B2B service
            const billingApiData: CreateAddressData = {
              name: billingAddress.name,
              addressLine1: billingAddress.addressLine1,
              addressLine2: billingAddress.addressLine2,
              number: billingAddress.number,
              city: billingAddress.city,
              state: billingAddress.state ?? '',
              zipCode: billingAddress.zipCode,
              country: billingAddress.country,
              addressType: 'billing',
              isPrimary: true
            }

            // Create billing address
            if (cachedOrgData?.organizationId) {
              const addressResult = await organizationService.createOrganizationAddress(
                cachedOrgData.organizationId,
                billingApiData
              )

              if (!addressResult?.success) {
                throw new Error('Failed to save billing address')
              }

              // Link the billing address to organization
              if (addressResult.success && addressResult.data && !cachedOrgData.addressId) {
                try {
                  const orgUpdateData = {
                    ...cachedOrgData,
                    addressId: addressResult.data.addressId
                  }
                  await organizationService.update(cachedOrgData.organizationId, orgUpdateData)
                } catch (linkError) {
                  // Don't fail the whole process for this
                }
              }
            } else {
              throw new Error('Organization ID not found for address creation')
            }
          }

        } catch (error) {
          showError(error instanceof Error ? error.message : 'Failed to save data')
          return
        } finally {
          setIsCompleting(false)
        }
      }

      // Mark current step as completed BEFORE moving to next step
      // Only mark as completed if the step is actually valid
      if (isStepValid(currentStep)) {
        setCompletedSteps(prev => {
          if (!prev.includes(currentStep)) {
            return [...prev, currentStep]
          }
          return prev
        })
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
      showError(error instanceof Error ? error.message : 'Navigation error occurred') 
    }
  }, [
    currentStep,
    isStepValid,
    onboardingData,
    state.user,
    getCurrentStepIndex,
    availableSteps,
    showError,
    navigate,
    cachedOrgData,
    flushOrganizationSave,
    organizationChangeDetection
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
  const getButtonText = (): string => {
    if (isCompleting) return 'Saving...'
    if (isLastStep()) return 'Complete Setup'
    return 'Next'
  }

  const _getButtonIcon = () => {
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
        // Show loading state if we're still loading data OR if organization has currency but currencies API isn't ready
        if (isLoadingData && !onboardingData.organization.companyName) {
          return (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#14BDEA]/30 border-t-[#14BDEA] rounded-full animate-spin" />
              <span className="ml-3 text-white/60">Loading organization data...</span>
            </div>
          )
        }
        return (
          <OrganizationStep
            data={onboardingData.organization}
            onChange={updateOrganization}
            isPrePopulated={!!onboardingData.organization.companyName}
            businessSettings={onboardingData.businessSettings}
          />
        )
      case 'address':
        // Show loading state if we're still loading data and don't have address data yet
        if (isLoadingData && !onboardingData.address.billingAddress.name) {
          return (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#14BDEA]/30 border-t-[#14BDEA] rounded-full animate-spin" />
              <span className="ml-3 text-white/60">Loading address data...</span>
            </div>
          )
        }
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
        return (
          <TeamStep
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-lg font-medium text-white mb-4">
              Welcome to{' '}
              <span className="text-primary">
                Round
              </span>
            </h1>
            <p className="text-gray-500 dark:text-polar-500 leading-snug mb-3">
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
              className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-6"
            >
              <div className="flex items-center space-x-2 text-[#D417C8]">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{apiError}</span>
              </div>
            </motion.div>
          )}

          {/* Step Content */}
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

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            {!isFirstStep() && (
              <Button
                onClick={handleBack}
                variant="ghost"
                enhanced
                icon={ArrowLeft}
                iconPosition="left"
                size="sm"
              >
                Back
              </Button>
            )}
            {isFirstStep() && <div />}

            <ActionButton
              label={getButtonText()}
              onClick={handleNext}
              disabled={!isStepValid(currentStep) || isCompleting}
              variant={isLastStep() ? "success" : "primary"}
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