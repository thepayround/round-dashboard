import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type {
  OnboardingData,
  OnboardingStep,
  OrganizationInfo,
  BusinessSettings,
  EnhancedAddressInfo,
  ProductInfo,
  BillingSettings,
  TeamSettings,
  UserInfo,
} from '../types/onboarding'


import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { useOrganization } from '@/shared/hooks/api/useOrganization'
import { useAuth } from '@/shared/hooks/useAuth'
import { useDebouncedUpdate } from '@/shared/hooks/useDebouncedUpdate'
import { useFormChangeDetection } from '@/shared/hooks/useFormChangeDetection'
import { addressService } from '@/shared/services/api/address.service'
import { authService } from '@/shared/services/api/auth.service'
import { organizationService } from '@/shared/services/api/organization.service'
import type { OrganizationResponse, CreateAddressData } from '@/shared/types/api'
import type { OrganizationRequest } from '@/shared/types/api/organization'

const parseBackendError = (error: unknown) => {
  if (error instanceof Error) {
    return { message: error.message, details: error }
  }
  if (typeof error === 'string') {
    return { message: error, details: error }
  }
  return { message: 'An unknown error occurred', details: error }
}

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

export const useGetStartedController = () => {
  const navigate = useNavigate()
  const { state } = useAuth()
  const { user } = state
  const { getCurrentOrganization } = useOrganization()
  const { showSuccess, showError } = useGlobalToast()

  const [currentStep, setCurrentStep] = useState<OnboardingStep>('organization')
  const [completedSteps, setCompletedSteps] = useState<OnboardingStep[]>([])
  const [availableSteps, setAvailableSteps] = useState<OnboardingStep[]>(allSteps)
  const [isCompleting, setIsCompleting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [cachedOrgData, setCachedOrgData] = useState<OrganizationResponse | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(defaultOnboardingData)

  const organizationChangeDetection = useFormChangeDetection<OrganizationRequest>()

  const loadingRef = useRef(false)

  const handleError = useCallback(
    (error: unknown) => {
      const parsedError = parseBackendError(error)
      showError(parsedError.message ?? 'An error occurred')
    },
    [showError]
  )

  const isStepValid = useCallback(
    (step: OnboardingStep): boolean => {
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
            organization.taxId?.trim() !== '' &&
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
          return true
        default:
          return false
      }
    },
    [onboardingData]
  )

  const getFirstIncompleteStep = useCallback((): OnboardingStep => {
    for (const step of allSteps) {
      if (!isStepValid(step)) {
        return step
      }
    }
    return allSteps[allSteps.length - 1]
  }, [isStepValid])

  const getCurrentStepIndex = useCallback(
    () => availableSteps.indexOf(currentStep),
    [availableSteps, currentStep]
  )

  const isFirstStep = useCallback(() => getCurrentStepIndex() === 0, [getCurrentStepIndex])
  const isLastStep = useCallback(
    () => getCurrentStepIndex() === availableSteps.length - 1,
    [getCurrentStepIndex, availableSteps]
  )

  const saveOrganizationData = useCallback(
    async (orgData: OrganizationRequest) => {
      try {
        setIsCompleting(true)
        let result = null

        if (cachedOrgData) {
          result = await organizationService.update(cachedOrgData.organizationId, orgData)
        } else {
          result = await organizationService.create(orgData)
          if (result?.success && result.data) {
            setCachedOrgData(result.data)
            organizationChangeDetection.resetTracking(orgData)
          }
        }

        if (!result?.success) {
          const errorMessage = result?.error ?? 'Failed to save organization'
          throw new Error(errorMessage)
        }
      } catch (error) {
        handleError(error)
      } finally {
        setIsCompleting(false)
      }
    },
    [cachedOrgData, organizationChangeDetection, handleError]
  )

  const { debouncedFn: _debouncedSaveOrganization, flush: flushOrganizationSave } = useDebouncedUpdate(
    saveOrganizationData,
    2000
  )

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

  const loadOnboardingData = useCallback(async () => {
    if (loadingRef.current) return
    loadingRef.current = true
    setApiError('')
    setIsLoadingData(true)

    try {
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

            const completedStepsFromData: OnboardingStep[] = []

            if (
              org.name &&
              org.category &&
              org.size &&
              org.type &&
              org.country &&
              org.registrationNumber &&
              org.timeZone &&
              org.fiscalYearStart
            ) {
              completedStepsFromData.push('organization')
            }

            try {
              const addressesResponse = await addressService.getByOrganizationId(org.organizationId)
              if (addressesResponse.success && addressesResponse.data) {
                const addresses = addressesResponse.data
                const billingAddress = addresses.find(addr => addr.addressType === 'billing')

                const enhancedAddressData: EnhancedAddressInfo = {
                  billingAddress: billingAddress
                    ? {
                        name: billingAddress.name,
                        street: billingAddress.addressLine1,
                        addressLine1: billingAddress.addressLine1,
                        addressLine2: billingAddress.addressLine2 ?? '',
                        number: billingAddress.number ?? '',
                        city: billingAddress.city,
                        state: billingAddress.state ?? '',
                        zipCode: billingAddress.zipCode,
                        country: billingAddress.country,
                        addressType: 'billing',
                        isPrimary: billingAddress.isPrimary ?? true,
                      }
                    : defaultOnboardingData.address.billingAddress,
                  shippingAddress: defaultOnboardingData.address.shippingAddress,
                  sameAsBilling: true,
                }

                updateAddress(enhancedAddressData)

                if (
                  billingAddress?.name &&
                  billingAddress.addressLine1 &&
                  billingAddress.city &&
                  billingAddress.country
                ) {
                  completedStepsFromData.push('address')
                }
              } else if (org.address) {
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

                if (org.address.name && org.address.addressLine1 && org.address.city && org.address.country) {
                  completedStepsFromData.push('address')
                }
              }
            } catch (addressError) {
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

                if (org.address.name && org.address.addressLine1 && org.address.city && org.address.country) {
                  completedStepsFromData.push('address')
                }
              }
            }

            updateBusinessSettings({
              timezone: org.timeZone ?? '',
              fiscalYearStart: org.fiscalYearStart ?? '',
            })

            if (completedStepsFromData.length > 0) {
              setCompletedSteps(completedStepsFromData)
            }
          }
        } catch (orgError) {
          handleError(orgError)
          setApiError('Failed to load organization data')
        }
      }

      setAvailableSteps(user ? allSteps : ['userInfo'])
    } catch (error) {
      setApiError('Failed to load onboarding data')
    } finally {
      loadingRef.current = false
      setIsLoadingData(false)
    }
  }, [getCurrentOrganization, user, updateUserInfo, updateOrganization, updateAddress, updateBusinessSettings, handleError])

  useEffect(() => {
    if (user && !loadingRef.current) {
      loadOnboardingData()
    }
  }, [user, loadOnboardingData])

  useEffect(() => {
    if (!isLoadingData) {
      const newCompletedSteps: OnboardingStep[] = []
      for (const step of allSteps) {
        if (isStepValid(step)) {
          newCompletedSteps.push(step)
        }
      }
      setCompletedSteps(newCompletedSteps)

      const firstIncompleteStep = getFirstIncompleteStep()
      if (currentStep === 'organization' && isStepValid('organization') && firstIncompleteStep !== 'organization') {
        setCurrentStep(firstIncompleteStep)
      }
    }
  }, [isLoadingData, onboardingData, getFirstIncompleteStep, isStepValid, currentStep])

  const handleNext = useCallback(async () => {
    try {
      if (!isStepValid(currentStep)) {
        showError('Please fill in all required fields')
        return
      }

      if (isStepValid(currentStep)) {
        setIsCompleting(true)
        try {
          if (currentStep === 'organization') {
            const baseOrgData: OrganizationRequest & { Industry: string } = {
              name: onboardingData.organization.companyName ?? 'Untitled Company',
              description:
                onboardingData.organization.description ?? `${onboardingData.organization.industry} company`,
              website: onboardingData.organization.website ?? '',
              size: onboardingData.organization.companySize ?? '',
              revenue: onboardingData.organization.revenue ? parseFloat(onboardingData.organization.revenue) : 0,
              category: onboardingData.organization.industry ?? '',
              Industry: onboardingData.organization.industry ?? '',
              type: onboardingData.organization.organizationType ?? '',
              registrationNumber: onboardingData.organization.registrationNumber ?? '',
              taxId: onboardingData.organization.taxId ?? '',
              currency: onboardingData.organization.currency ?? 'USD',
              timeZone: onboardingData.businessSettings.timezone ?? 'UTC',
              country: onboardingData.organization.country ?? 'US',
              userId: state.user?.id ?? '',
              fiscalYearStart: onboardingData.businessSettings.fiscalYearStart ?? 'January',
            }

            if (!onboardingData.organization.industry?.trim()) {
              throw new Error('Industry is required. Please select an industry.')
            }

            if (!onboardingData.organization.taxId?.trim()) {
              throw new Error('Tax ID is required for business compliance.')
            }

            if (organizationChangeDetection.hasChanged(baseOrgData)) {
              await flushOrganizationSave(baseOrgData)
            }
          }

          if (currentStep === 'address') {
            const { billingAddress } = onboardingData.address

            if (
              !billingAddress.name ||
              !billingAddress.addressLine1 ||
              !billingAddress.city ||
              !billingAddress.country
            ) {
              throw new Error('Billing address information is incomplete')
            }

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
              isPrimary: true,
            }

            if (cachedOrgData?.organizationId) {
              const addressResult = await organizationService.createOrganizationAddress(
                cachedOrgData.organizationId,
                billingApiData
              )

              if (!addressResult?.success) {
                throw new Error('Failed to save billing address')
              }

              if (addressResult.success && addressResult.data && !cachedOrgData.addressId) {
                try {
                  const orgUpdateData = {
                    ...cachedOrgData,
                    addressId: addressResult.data.addressId,
                  }
                  await organizationService.update(cachedOrgData.organizationId, orgUpdateData)
                } catch (linkError) {
                  // ignore link failure
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

      if (isStepValid(currentStep)) {
        setCompletedSteps(prev => {
          if (!prev.includes(currentStep)) {
            return [...prev, currentStep]
          }
          return prev
        })
      }

      const index = getCurrentStepIndex()
      const nextStep = availableSteps[index + 1]
      if (nextStep) {
        setCurrentStep(nextStep)
      } else {
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
    organizationChangeDetection,
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

  const getButtonText = useCallback((): string => {
    if (isCompleting) return 'Saving...'
    if (isLastStep()) return 'Complete Setup'
    return 'Next'
  }, [isCompleting, isLastStep])

  return {
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
    updateUserInfo,
    updateOrganization,
    updateBusinessSettings,
    updateAddress,
    updateProducts,
    updateBilling,
    updateTeam,
    showSuccess,
    showError,
  }
}
