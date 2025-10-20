import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ActionButton, AuthLogo, PhoneInput } from '@/shared/components'

import type { CompanyInfo, BillingAddress } from '@/shared/types/business'
import type { ValidationError } from '@/shared/utils/validation'
import type { CountryPhoneInfo } from '@/shared/services/api/phoneValidation.service'
import { phoneValidationService } from '@/shared/services/api/phoneValidation.service'
import {
  validateRegistrationForm,
  validateField,
  getFieldError,
  hasFieldError,
  validateEmail,
  validatePassword,
  validateFirstName,
  validateLastName,
} from '@/shared/utils/validation'
import { validateCompanyInfo } from '@/shared/utils/companyValidation'
import { phoneValidator } from '@/shared/utils/phoneValidation'

import { CompanyDetailsForm } from '../components/CompanyDetailsForm'
import { BillingAddressForm } from '../components/BillingAddressForm'
import { useMultiStepForm } from '../hooks/useMultiStepForm'
import { useAuth as useAuthAPI } from '@/shared/hooks/api'
import { useOrganization } from '@/shared/hooks/api'
// import { useAddress } from '@/shared/hooks/api'
// import { useAuth } from '@/shared/contexts/AuthContext'

interface PersonalFormData {
  firstName: string
  lastName: string
  phone: string
  countryPhoneCode: string
  email: string
  password: string
}

export const BusinessRegisterPage = () => {
  const navigate = useNavigate()
  const { registerBusiness } = useAuthAPI()
  const { create: _createOrganization } = useOrganization()
  // const { createOrganizationAddress } = useAddress()
  // const { login } = useAuth() // Not used in this component

  // Form state is hardcoded to 'business' for this page
  const [personalData, setPersonalData] = useState<PersonalFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    countryPhoneCode: '',
    email: '',
    password: '',
  })
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    companyName: '',
    registrationNumber: '',
    taxId: '',
    currency: undefined, // No preselected currency
    industry: undefined,
    businessType: undefined,
    website: '',
    employeeCount: undefined,
    description: '',
  })
  const [billingAddress, setBillingAddress] = useState<BillingAddress | undefined>(undefined)

  // Validation state
  const [personalErrors, setPersonalErrors] = useState<ValidationError[]>([])
  const [companyErrors, setCompanyErrors] = useState<ValidationError[]>([])
  const [billingErrors, setBillingErrors] = useState<ValidationError[]>([])
  const [isPersonalValid, setIsPersonalValid] = useState(false)
  const [isCompanyValid, setIsCompanyValid] = useState(false)
  const [, setIsBillingValid] = useState(true) // Optional step

  // Check if billing address is complete
  const isBillingComplete =
    billingAddress &&
    billingAddress.street.trim() !== '' &&
    billingAddress.city.trim() !== '' &&
    billingAddress.state.trim() !== '' &&
    billingAddress.zipCode.trim() !== '' &&
    billingAddress.country.trim() !== ''

  // Check if company details are complete (required fields only)
  const isCompanyComplete =
    companyInfo.companyName.trim() !== '' &&
    companyInfo.registrationNumber.trim() !== '' &&
    companyInfo.currency !== undefined // Check if currency is selected

  // UI state
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')

  // Calculate progress based on current step and field completion
  const calculateDetailedProgress = () => {
    const { currentStep } = multiStepForm
    const totalSteps = 3

    // Base progress for reaching this step
    const stepProgress = (currentStep / totalSteps) * 100

    // Additional progress within current step
    let currentStepProgress = 0
    const progressPerStep = 100 / totalSteps

    if (currentStep === 0) {
      // Personal info step - 5 required fields
      const filledFields = [
        personalData.firstName.trim(),
        personalData.lastName.trim(),
        personalData.email.trim(),
        personalData.phone.trim(),
        personalData.password.trim(),
      ].filter(field => field !== '').length

      currentStepProgress = (filledFields / 5) * progressPerStep
    } else if (currentStep === 1) {
      // Billing address step - optional, show as partially complete if any fields filled
      if (billingAddress) {
        const filledFields = [
          billingAddress.street?.trim(),
          billingAddress.city?.trim(),
          billingAddress.state?.trim(),
          billingAddress.zipCode?.trim(),
          billingAddress.country?.trim(),
        ].filter(field => field && field !== '').length

        currentStepProgress = Math.min(filledFields / 5, 1) * progressPerStep
      }
    } else if (currentStep === 2) {
      // Company info step - count filled required fields
      const filledFields = [
        companyInfo.companyName.trim(),
        companyInfo.registrationNumber.trim(),
        companyInfo.currency ?? '',
      ].filter(field => field !== '').length

      currentStepProgress = (filledFields / 3) * progressPerStep
    }

    return Math.round(Math.min(stepProgress + currentStepProgress, 100))
  }

  // Multi-step form management
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

  // Initialize company validation state on mount and when companyInfo changes
  useEffect(() => {
    const validation = validateCompanyInfo(companyInfo)
    setIsCompanyValid(validation.isValid)
  }, [companyInfo])

  // Re-validate personal form when data changes
  useEffect(() => {
    const isPersonalFormValid = validatePersonalForm(personalData)
    setIsPersonalValid(isPersonalFormValid)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalData, personalErrors])


  // Handle personal form changes
  const handlePersonalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPersonalData(prev => ({ ...prev, [name]: value }))

    // Clear field error when user starts typing
    if (hasFieldError(personalErrors, name)) {
      setPersonalErrors(prev => prev.filter(error => error.field !== name))
    }

    // Validate personal form excluding phone (handled separately)
    const updatedData = { ...personalData, [name]: value }
    const isPersonalFormValid = validatePersonalForm(updatedData)
    setIsPersonalValid(isPersonalFormValid)
  }

  const handlePersonalPhoneChange = (phoneNumber: string) => {
    setPersonalData(prev => ({ ...prev, phone: phoneNumber }))
    
    // Clear phone error when user starts typing (same as other fields)
    if (hasFieldError(personalErrors, 'phone')) {
      setPersonalErrors(prev => prev.filter(error => error.field !== 'phone'))
    }

    // Validate personal form
    const updatedData = { ...personalData, phone: phoneNumber }
    const isPersonalFormValid = validatePersonalForm(updatedData)
    setIsPersonalValid(isPersonalFormValid)
  }

  const handlePersonalPhoneBlur = async (phoneNumber: string, countryInfo: CountryPhoneInfo | null) => {
    // Store the country phone code for backend submission
    if (countryInfo?.phoneCode) {
      setPersonalData(prev => ({ ...prev, countryPhoneCode: countryInfo.phoneCode }))
    }

    // Always validate phone when user leaves the field (same pattern as other fields)
    
    // If field is empty and required, show required error immediately
    if (!phoneNumber?.trim()) {
      setPersonalErrors(prev => [
        ...prev.filter(error => error.field !== 'phone'),
        { field: 'phone', message: 'Phone number is required', code: 'REQUIRED' }
      ])
      return
    }

    try {
      // Use the provided phone number and country info
      const countryCode = countryInfo?.countryCode ?? 'US'

      // Call backend API for validation using service (follows platform pattern)
      const result = await phoneValidationService.validatePhoneNumber({
        phoneNumber: phoneNumber.trim(),
        countryCode
      })
      
      if (!result.isValid && result.error) {
        setPersonalErrors(prev => [
          ...prev.filter(error => error.field !== 'phone'),
          { field: 'phone', message: result.error ?? 'Phone number is invalid', code: 'INVALID_PHONE' }
        ])
      }
    } catch (error) {
      console.error('Phone validation failed:', error)
      // Don't show error for network issues, just log them
    }
  }

  // Helper function to validate personal form with simple phone check
  const validatePersonalForm = (data: PersonalFormData) => {
    // Check if all required fields are filled
    if (
      !data.firstName.trim() ||
      !data.lastName.trim() ||
      !data.phone.trim() ||
      !data.email.trim() ||
      !data.password.trim()
    ) {
      return false
    }

    // Simple phone check - use client-side validation
    if (!phoneValidator.hasMinimumContent(data.phone)) {
      return false
    }

    // Check if there are any validation errors from other fields
    const nonPhoneErrors = personalErrors.filter(error => error.field !== 'phone')
    if (nonPhoneErrors.length > 0) {
      return false
    }

    // Validate other fields
    const emailValidation = validateEmail(data.email)
    const passwordValidation = validatePassword(data.password)
    const firstNameValidation = validateFirstName(data.firstName)
    const lastNameValidation = validateLastName(data.lastName)

    return (
      emailValidation.isValid &&
      passwordValidation.isValid &&
      firstNameValidation.isValid &&
      lastNameValidation.isValid
    )
  }

  const handlePersonalInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const fieldValidation = validateField(name, value)
    if (!fieldValidation.isValid) {
      setPersonalErrors(prev => [
        ...prev.filter(error => error.field !== name),
        ...fieldValidation.errors,
      ])
    }
  }

  // Handle form completion
  async function handleFormComplete() {
    // Prevent multiple submissions
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setApiError('')

    try {
      // Register business user with all company information using new endpoint
      const userResponse = await registerBusiness({
        firstName: personalData.firstName,
        lastName: personalData.lastName,
        email: personalData.email,
        password: personalData.password,
        phoneNumber: personalData.phone,
        countryPhoneCode: personalData.countryPhoneCode,
        companyInfo,
        billingAddress,
      })

      if (!userResponse.success) {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        setApiError(('error' in userResponse && userResponse.error) || 'Business registration failed')
        setIsSubmitting(false)
        return
      }

      // Navigate to confirmation pending page
      navigate('/auth/confirmation-pending', {
        state: {
          email: personalData.email,
          accountType: 'business',
          hasBusinessData: true,
        },
        replace: true,
      })
    } catch (error) {
      console.error('Business registration error:', error)
      setApiError('An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (multiStepForm.currentStep === 0) {
      // Personal info step
      const validation = validateRegistrationForm(personalData)
      if (!validation.isValid) {
        setPersonalErrors(validation.errors)
        return
      }
      setPersonalErrors([])
      multiStepForm.completeAndGoToNext()
    } else if (multiStepForm.currentStep === 1) {
      // Billing address step (optional)
      multiStepForm.goToStep(2)
    } else if (multiStepForm.currentStep === 2) {
      // Company info step (final step)
      if (isCompanyValid && isCompanyComplete) {
        // completeCurrentStep automatically calls handleFormComplete via onComplete
        multiStepForm.completeCurrentStep()
      }
    }
  }

  // Skip billing address
  const handleSkipBilling = () => {
    setBillingAddress(undefined)
    multiStepForm.completeAndGoToNext()
  }

  const handleButtonClick = () => {
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent
    handleSubmit(fakeEvent)
  }

  // Render step content
  const renderStepContent = () => {
    switch (multiStepForm.currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className=""
          >
            <div className="text-center mb-8">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-medium tracking-tight auth-text mb-2"
              >
                Personal Information
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="auth-text-muted"
              >
                Tell us about yourself
              </motion.p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="auth-label">
                    First Name
                  </label>
                  <div className="input-container">
                    <User className="input-icon-left auth-icon-primary" />
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={personalData.firstName}
                      onChange={handlePersonalInputChange}
                      onBlur={handlePersonalInputBlur}
                      placeholder="John"
                      className={`auth-input input-with-icon-left ${hasFieldError(personalErrors, 'firstName') ? 'auth-input-error' : ''}`}
                      required
                    />
                  </div>
                  {hasFieldError(personalErrors, 'firstName') && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{getFieldError(personalErrors, 'firstName')?.message}</span>
                    </motion.div>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="auth-label">
                    Last Name
                  </label>
                  <div className="input-container">
                    <User className="input-icon-left auth-icon-primary" />
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={personalData.lastName}
                      onChange={handlePersonalInputChange}
                      onBlur={handlePersonalInputBlur}
                      placeholder="Doe"
                      className={`auth-input input-with-icon-left ${hasFieldError(personalErrors, 'lastName') ? 'auth-input-error' : ''}`}
                      required
                    />
                  </div>
                  {hasFieldError(personalErrors, 'lastName') && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{getFieldError(personalErrors, 'lastName')?.message}</span>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="auth-label">
                  Email Address
                </label>
                <div className="input-container">
                  <Mail className="input-icon-left auth-icon-primary" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={personalData.email}
                    onChange={handlePersonalInputChange}
                    onBlur={handlePersonalInputBlur}
                    placeholder="john@company.com"
                    className={`auth-input input-with-icon-left ${hasFieldError(personalErrors, 'email') ? 'auth-input-error' : ''}`}
                    required
                  />
                </div>
                {hasFieldError(personalErrors, 'email') && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{getFieldError(personalErrors, 'email')?.message}</span>
                  </motion.div>
                )}
              </div>

              {/* Phone */}
              <div>
                <PhoneInput
                  id="phone"
                  name="phone"
                  value={personalData.phone}
                  onChange={handlePersonalPhoneChange}
                  onBlur={handlePersonalPhoneBlur}
                  validateOnBlur={false}
                  label="Phone Number"
                  placeholder="Phone number"
                  error={hasFieldError(personalErrors, 'phone') ? getFieldError(personalErrors, 'phone')?.message : undefined}
                  defaultCountry="GR"
                  showValidation={false}
                />
                {hasFieldError(personalErrors, 'phone') && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{getFieldError(personalErrors, 'phone')?.message}</span>
                  </motion.div>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="auth-label">
                  Password
                </label>
                <div className="input-container">
                  <Lock className="input-icon-left auth-icon-primary" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={personalData.password}
                    onChange={handlePersonalInputChange}
                    onBlur={handlePersonalInputBlur}
                    placeholder="Create a strong password"
                    className={`auth-input input-with-icon-left input-with-icon-right ${hasFieldError(personalErrors, 'password') ? 'auth-input-error' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="input-icon-right auth-icon hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {hasFieldError(personalErrors, 'password') && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{getFieldError(personalErrors, 'password')?.message}</span>
                  </motion.div>
                )}
              </div>
            </form>
          </motion.div>
        )

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className=""
          >
            <BillingAddressForm
              billingAddress={billingAddress}
              onBillingAddressChange={setBillingAddress}
              onValidationChange={setIsBillingValid}
              errors={billingErrors}
              onErrorsChange={setBillingErrors}
              isOptional
            />
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className=""
          >
            <CompanyDetailsForm
              companyInfo={companyInfo}
              onCompanyInfoChange={setCompanyInfo}
              onValidationChange={setIsCompanyValid}
              errors={companyErrors}
              onErrorsChange={setCompanyErrors}
            />
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="auth-container">
      {/* Animated Background */}
      <div className="auth-background">
        <div className="floating-orb" />
        <div className="floating-orb" />
        <div className="floating-orb" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
          delay: 0.2,
        }}
        className="w-full max-w-[420px] relative z-10"
      >
        {/* Centered Logo Above Form */}
        <AuthLogo className="sm:mb-10" />

        <div className="auth-card">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <div className="gradient-header" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative"
          >
            <h1 className="text-xl md:text-2xl lg:text-xl font-medium tracking-tight auth-text mb-2 md:mb-3 lg:mb-2 relative">Create Business Account</h1>
            <p className="auth-text-muted text-sm md:text-base lg:text-sm font-medium">Join Round for business</p>
          </motion.div>
        </div>

        {/* Progress Bar */}
        {multiStepForm.currentStep >= 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm auth-text-muted">
                Step {multiStepForm.currentStep + 1} of {multiStepForm.getTotalSteps()}
              </span>
              <span className="text-sm auth-text-muted">
                {calculateDetailedProgress()}% Complete
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${calculateDetailedProgress()}%` }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-r from-[#14BDEA] via-[#7767DA] to-[#D417C8] h-2 rounded-full"
              />
            </div>
          </motion.div>
        )}

        {/* API Error Message */}
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-6"
          >
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{apiError}</span>
            </div>
          </motion.div>
        )}

        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation Buttons */}
        {multiStepForm.currentStep >= 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between mt-8 sm:mt-10 gap-4"
          >
            {/* Previous Button - Always on left */}
            <button
              type="button"
              onClick={multiStepForm.goToPrevious}
              disabled={!multiStepForm.canGoPrevious}
              className={`
                h-11 md:h-9 px-4 sm:px-6 rounded-lg font-normal tracking-tight transition-all duration-200 flex items-center justify-center space-x-2 min-w-[100px] sm:min-w-[140px] 
                ${
                  multiStepForm.canGoPrevious
                    ? 'bg-white/8 backdrop-blur-sm border border-white/15 text-white hover:bg-white/12 hover:border-white/20'
                    : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/10'
                }
              `}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </button>

            {/* Right side buttons container */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Skip button - only show on billing step when form is NOT complete */}
              {multiStepForm.currentStep === 1 && !isBillingComplete && (
                <button
                  type="button"
                  onClick={handleSkipBilling}
                  disabled={isSubmitting}
                  className="h-11 md:h-9 px-3 sm:px-4 bg-white/8 backdrop-blur-sm border border-white/15 text-white hover:bg-white/12 hover:border-white/20 disabled:opacity-50 min-w-[80px] sm:min-w-[100px] flex items-center justify-center rounded-lg text-sm font-normal tracking-tight transition-all duration-200"
                >
                  <span className="hidden sm:inline">Skip for now</span>
                  <span className="sm:hidden">Skip</span>
                </button>
              )}

              {/* Continue button - show on step 0, step 2, and step 1 when billing is complete */}
              {(multiStepForm.currentStep !== 1 || isBillingComplete) && (
                <ActionButton
                  label={(() => {
                    if (isSubmitting) return 'Creating...'
                    if (multiStepForm.isLastStep) return 'Create Account'
                    return 'Continue'
                  })()}
                  onClick={handleButtonClick}
                  disabled={
                    isSubmitting ||
                    (multiStepForm.currentStep === 0 && !isPersonalValid) ||
                    (multiStepForm.currentStep === 2 && (!isCompanyValid || !isCompanyComplete))
                  }
                  icon={multiStepForm.isLastStep ? CheckCircle : ArrowRight}
                  loading={isSubmitting}
                  size="sm"
                  animated={false}
                  actionType={multiStepForm.isLastStep ? "auth" : "navigation"}
                  className="min-w-[120px] sm:min-w-[160px] "
                />
              )}
            </div>
          </motion.div>
        )}

          {/* Login Link */}
          <div className="text-center mt-6 sm:mt-8">
            <p className="auth-text-muted text-sm sm:text-base">
              Already have an account?{' '}
              <Link to="/login/business" className="auth-link brand-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
