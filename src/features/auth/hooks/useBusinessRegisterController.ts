import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useMultiStepForm } from './useMultiStepForm'

import { useAsyncAction, useForm, usePhoneValidation } from '@/shared/hooks'
import { useAuth as useAuthAPI } from '@/shared/hooks/api'
import type { BillingAddress, CompanyInfo } from '@/shared/types/business'
import { validateCompanyInfo } from '@/shared/utils/companyValidation'
import { handleApiError } from '@/shared/utils/errorHandler'
import type { ValidationError } from '@/shared/utils/validation'
import { validators } from '@/shared/utils/validators'

export interface BusinessRegisterController {
  personalForm: ReturnType<typeof useForm<{
    firstName: string
    lastName: string
    email: string
    password: string
  }>>
  phone: ReturnType<typeof usePhoneValidation>
  companyForm: {
    info: CompanyInfo
    setInfo: (info: CompanyInfo) => void
    errors: ValidationError[]
    setErrors: (errors: ValidationError[]) => void
    isValid: boolean
    isComplete: boolean
    onValidationChange: (isValid: boolean) => void
  }
  billingForm: {
    address: BillingAddress | undefined
    setAddress: (address: BillingAddress | undefined) => void
    errors: ValidationError[]
    setErrors: (errors: ValidationError[]) => void
    isComplete: boolean
    onValidationChange: (isValid: boolean) => void
  }
  multiStepForm: ReturnType<typeof useMultiStepForm>
  showPassword: boolean
  togglePasswordVisibility: () => void
  detailedProgress: number
  apiError: string
  isSubmitting: boolean
  isPersonalValid: boolean
  handleNextStep: () => void
  handleSkipBilling: () => void
  isBillingComplete: boolean
  isCompanyValid: boolean
  isCompanyComplete: boolean
}

export const useBusinessRegisterController = (): BusinessRegisterController => {
  const navigate = useNavigate()
  const { registerBusiness } = useAuthAPI()
  const { execute, loading: isSubmitting } = useAsyncAction()

  const personalForm = useForm(
    {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    {
      firstName: value => validators.required(value, 'First name'),
      lastName: value => validators.required(value, 'Last name'),
      email: validators.emailWithMessage,
      password: validators.password,
    }
  )

  const phone = usePhoneValidation('GR')

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    companyName: '',
    registrationNumber: '',
    taxId: '',
    currency: undefined,
    industry: undefined,
    businessType: undefined,
    website: '',
    employeeCount: undefined,
    description: '',
  })
  const [billingAddress, setBillingAddress] = useState<BillingAddress | undefined>(undefined)
  const [companyErrors, setCompanyErrors] = useState<ValidationError[]>([])
  const [billingErrors, setBillingErrors] = useState<ValidationError[]>([])

  const [isCompanyValid, setIsCompanyValid] = useState(false)
  const [, setIsBillingValid] = useState(true)
  const [isPersonalValid, setIsPersonalValid] = useState(false)

  const [apiError, setApiError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleFormComplete = useCallback(async () => {
    if (isSubmitting) {
      return
    }

    setApiError('')

    await execute(
      async () => {
        const response = await registerBusiness({
          firstName: personalForm.values.firstName,
          lastName: personalForm.values.lastName,
          email: personalForm.values.email,
          password: personalForm.values.password,
          phoneNumber: phone.phoneData.phone,
          countryPhoneCode: phone.phoneData.countryPhoneCode,
          companyInfo,
          billingAddress,
        })

        if (!response.success) {
          setApiError(('error' in response && response.error) || 'Business registration failed')
          return
        }

        navigate('/auth/confirmation-pending', {
          state: {
            email: personalForm.values.email,
            accountType: 'business',
            hasBusinessData: true,
          },
          replace: true,
        })
      },
      {
        onError: error => {
          const message = handleApiError(
            error,
            'Business registration',
            'An unexpected error occurred. Please try again.'
          )
          setApiError(message)
        },
      }
    )
  }, [
    billingAddress,
    companyInfo,
    execute,
    isSubmitting,
    navigate,
    personalForm.values.email,
    personalForm.values.firstName,
    personalForm.values.lastName,
    personalForm.values.password,
    phone.phoneData.countryPhoneCode,
    phone.phoneData.phone,
    registerBusiness,
  ])

  const multiStepForm = useMultiStepForm({
    initialSteps: [
      {
        id: 'personal-info',
        title: 'Personal Information',
        description: 'Your personal details',
        isCompleted: false,
      },
      {
        id: 'billing-address',
        title: 'Billing Address',
        description: 'Your billing information',
        isCompleted: false,
        isOptional: true,
      },
      {
        id: 'company-info',
        title: 'Company Information',
        description: 'Your company details',
        isCompleted: false,
      },
    ],
    onComplete: handleFormComplete,
  })

  const isBillingComplete = useMemo(
    () =>
      Boolean(
        billingAddress &&
          billingAddress.street.trim() !== '' &&
          billingAddress.city.trim() !== '' &&
          billingAddress.state.trim() !== '' &&
          billingAddress.zipCode.trim() !== '' &&
          billingAddress.country.trim() !== ''
      ),
    [billingAddress]
  )

  const isCompanyComplete = useMemo(
    () =>
      Boolean(
        companyInfo.companyName.trim() !== '' &&
          companyInfo.registrationNumber.trim() !== '' &&
          companyInfo.currency !== undefined
      ),
    [companyInfo]
  )

  useEffect(() => {
    const validation = validateCompanyInfo(companyInfo)
    setIsCompanyValid(validation.isValid)
  }, [companyInfo])

  const validatePersonalForm = useCallback(() => {
    if (
      !personalForm.values.firstName.trim() ||
      !personalForm.values.lastName.trim() ||
      !personalForm.values.email.trim() ||
      !personalForm.values.password.trim() ||
      !phone.phoneData.phone.trim()
    ) {
      return false
    }

    if (
      personalForm.errors.firstName ||
      personalForm.errors.lastName ||
      personalForm.errors.email ||
      personalForm.errors.password ||
      phone.phoneError
    ) {
      return false
    }

    return true
  }, [
    personalForm.errors.email,
    personalForm.errors.firstName,
    personalForm.errors.lastName,
    personalForm.errors.password,
    personalForm.values.email,
    personalForm.values.firstName,
    personalForm.values.lastName,
    personalForm.values.password,
    phone.phoneData.phone,
    phone.phoneError,
  ])

  useEffect(() => {
    setIsPersonalValid(validatePersonalForm())
  }, [validatePersonalForm])

  const totalSteps = multiStepForm.getTotalSteps()
  const detailedProgress = useMemo(() => {
    if (totalSteps === 0) {
      return 0
    }

    const progressPerStep = 100 / totalSteps
    const baseProgress = (multiStepForm.currentStep / totalSteps) * 100
    let currentStepProgress = 0

    if (multiStepForm.currentStep === 0) {
      const filledFields = [
        personalForm.values.firstName.trim(),
        personalForm.values.lastName.trim(),
        personalForm.values.email.trim(),
        phone.phoneData.phone.trim(),
        personalForm.values.password.trim(),
      ].filter(Boolean).length

      currentStepProgress = (filledFields / 5) * progressPerStep
    } else if (multiStepForm.currentStep === 1) {
      if (billingAddress) {
        const filledFields = [
          billingAddress.street?.trim(),
          billingAddress.city?.trim(),
          billingAddress.state?.trim(),
          billingAddress.zipCode?.trim(),
          billingAddress.country?.trim(),
        ].filter(Boolean).length

        currentStepProgress = Math.min(filledFields / 5, 1) * progressPerStep
      }
    } else if (multiStepForm.currentStep === 2) {
      const filledFields = [
        companyInfo.companyName.trim(),
        companyInfo.registrationNumber.trim(),
        companyInfo.currency ?? '',
      ].filter(Boolean).length

      currentStepProgress = (filledFields / 3) * progressPerStep
    }

    return Math.round(Math.min(baseProgress + currentStepProgress, 100))
  }, [
    billingAddress,
    companyInfo.companyName,
    companyInfo.currency,
    companyInfo.registrationNumber,
    multiStepForm.currentStep,
    personalForm.values.email,
    personalForm.values.firstName,
    personalForm.values.lastName,
    personalForm.values.password,
    phone.phoneData.phone,
    totalSteps,
  ])

  const handleNextStep = useCallback(() => {
    if (multiStepForm.currentStep === 0) {
      const personalValid = personalForm.validateAll()
      const phoneValid = phone.validatePhone()

      if (!personalValid || !phoneValid) {
        return
      }

      multiStepForm.completeAndGoToNext()
      return
    }

    if (multiStepForm.currentStep === 1) {
      multiStepForm.goToStep(2)
      return
    }

    if (multiStepForm.currentStep === 2) {
      if (isCompanyValid && isCompanyComplete) {
        multiStepForm.completeCurrentStep()
      }
    }
  }, [
    isCompanyComplete,
    isCompanyValid,
    multiStepForm,
    personalForm,
    phone,
  ])

  const handleSkipBilling = useCallback(() => {
    setBillingAddress(undefined)
    multiStepForm.completeAndGoToNext()
  }, [multiStepForm])

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev)
  }, [])

  const handleBillingValidationChange = useCallback((isValid: boolean) => {
    setIsBillingValid(isValid)
  }, [])

  const handleCompanyValidationChange = useCallback((isValid: boolean) => {
    setIsCompanyValid(isValid)
  }, [])

  return {
    personalForm,
    phone,
    companyForm: {
      info: companyInfo,
      setInfo: setCompanyInfo,
      errors: companyErrors,
      setErrors: setCompanyErrors,
      isValid: isCompanyValid,
      isComplete: isCompanyComplete,
      onValidationChange: handleCompanyValidationChange,
    },
    billingForm: {
      address: billingAddress,
      setAddress: setBillingAddress,
      errors: billingErrors,
      setErrors: setBillingErrors,
      isComplete: isBillingComplete,
      onValidationChange: handleBillingValidationChange,
    },
    multiStepForm,
    showPassword,
    togglePasswordVisibility,
    detailedProgress,
    apiError,
    isSubmitting,
    isPersonalValid,
    handleNextStep,
    handleSkipBilling,
    isBillingComplete,
    isCompanyValid,
    isCompanyComplete,
  }
}

