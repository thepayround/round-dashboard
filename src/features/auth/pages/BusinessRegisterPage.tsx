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

import { BillingAddressForm } from '../components/BillingAddressForm'
import { CompanyDetailsForm } from '../components/CompanyDetailsForm'
import { useMultiStepForm } from '../hooks/useMultiStepForm'

import { useAsyncAction, useForm, usePhoneValidation } from '@/shared/hooks'
import { useAuth as useAuthAPI } from '@/shared/hooks/api'
import { useOrganization } from '@/shared/hooks/api'
import type { CompanyInfo, BillingAddress } from '@/shared/types/business'
import { ActionButton } from '@/shared/ui/ActionButton'
import { AuthLogo } from '@/shared/ui/AuthLogo'
import { Button, IconButton } from '@/shared/ui/Button'
import { PasswordStrengthIndicator } from '@/shared/ui/PasswordStrengthIndicator'
import { PhoneInput } from '@/shared/ui/PhoneInput'
import { validateCompanyInfo } from '@/shared/utils/companyValidation'
import { handleApiError } from '@/shared/utils/errorHandler'
import type { ValidationError } from '@/shared/utils/validation'
import { validators } from '@/shared/utils/validators'
// import { useAddress } from '@/shared/hooks/api'
// import { useAuth } from '@/shared/contexts/AuthContext'

export const BusinessRegisterPage = () => {
  const navigate = useNavigate()
  const { registerBusiness } = useAuthAPI()
  const { create: _createOrganization } = useOrganization()
  // const { createOrganizationAddress } = useAddress()
  // const { login } = useAuth() // Not used in this component

  // Form state is hardcoded to 'business' for this page
  // Use useForm hook for personal info fields (firstName, lastName, email, password)
  const { values: personalValues, errors: personalErrors, handleChange: handlePersonalChange, handleBlur: handlePersonalBlur, validateAll: validatePersonalInfo } = useForm(
    {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    {
      firstName: (value) => validators.required(value, 'First name'),
      lastName: (value) => validators.required(value, 'Last name'),
      email: validators.emailWithMessage,
      password: validators.password,
    }
  )
  
  // Use phone validation hook
  const { phoneData, phoneError, handlePhoneChange, handlePhoneBlur, validatePhone } = usePhoneValidation('GR')
  
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

  // Company and billing validation errors (keeping ValidationError[] for child components)
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
  const { execute, loading: isSubmitting } = useAsyncAction()
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
        personalValues.firstName.trim(),
        personalValues.lastName.trim(),
        personalValues.email.trim(),
        phoneData.phone.trim(),
        personalValues.password.trim(),
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
    const isPersonalFormValid = validatePersonalForm()
    setIsPersonalValid(isPersonalFormValid)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalValues, phoneData, personalErrors, phoneError])

  // Helper function to validate personal form
  const validatePersonalForm = () => {
    // Check if all required fields are filled
    if (
      !personalValues.firstName.trim() ||
      !personalValues.lastName.trim() ||
      !phoneData.phone.trim() ||
      !personalValues.email.trim() ||
      !personalValues.password.trim()
    ) {
      return false
    }

    // Check individual error states from useForm and phone validation
    if (personalErrors.firstName ?? personalErrors.lastName ?? personalErrors.email ?? personalErrors.password ?? phoneError) {
      return false
    }

    return true
  }

  // Handle form completion
  async function handleFormComplete() {
    // Prevent multiple submissions
    if (isSubmitting) {
      return
    }

    setApiError('')

    await execute(async () => {
      // Register business user with all company information using new endpoint
      const userResponse = await registerBusiness({
        firstName: personalValues.firstName,
        lastName: personalValues.lastName,
        email: personalValues.email,
        password: personalValues.password,
        phoneNumber: phoneData.phone,
        countryPhoneCode: phoneData.countryPhoneCode,
        companyInfo,
        billingAddress,
      })

      if (!userResponse.success) {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        setApiError(('error' in userResponse && userResponse.error) || 'Business registration failed')
        return
      }

      // Navigate to confirmation pending page
      navigate('/auth/confirmation-pending', {
        state: {
          email: personalValues.email,
          accountType: 'business',
          hasBusinessData: true,
        },
        replace: true,
      })
    }, {
      onError: (error) => {
        const message = handleApiError(error, 'Business registration', 'An unexpected error occurred. Please try again.')
        setApiError(message)
      }
    })
  }

  // Handle navigation to next step
  const handleNextStep = () => {
    if (multiStepForm.currentStep === 0) {
      // Personal info step - validate all fields
      const isFormValid = validatePersonalInfo()
      const isPhoneValid = validatePhone()

      if (!isFormValid || !isPhoneValid) {
        return
      }
      
      multiStepForm.completeAndGoToNext()
    } else if (multiStepForm.currentStep === 1) {
      // Billing address step (optional) - just continue
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

            <div className="space-y-6">
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
                      value={personalValues.firstName}
                      onChange={handlePersonalChange('firstName')}
                      onBlur={handlePersonalBlur('firstName')}
                      placeholder="John"
                      className={`auth-input input-with-icon-left ${personalErrors.firstName ? 'auth-input-error' : ''}`}
                      required
                      aria-required="true"
                      aria-invalid={!!personalErrors.firstName}
                      aria-describedby={personalErrors.firstName ? 'firstName-error' : undefined}
                    />
                  </div>
                  {personalErrors.firstName && (
                    <motion.div
                      id="firstName-error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                      role="alert"
                      aria-live="polite"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{personalErrors.firstName}</span>
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
                      value={personalValues.lastName}
                      onChange={handlePersonalChange('lastName')}
                      onBlur={handlePersonalBlur('lastName')}
                      placeholder="Doe"
                      className={`auth-input input-with-icon-left ${personalErrors.lastName ? 'auth-input-error' : ''}`}
                      required
                      aria-required="true"
                      aria-invalid={!!personalErrors.lastName}
                      aria-describedby={personalErrors.lastName ? 'lastName-error' : undefined}
                    />
                  </div>
                  {personalErrors.lastName && (
                    <motion.div
                      id="lastName-error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                      role="alert"
                      aria-live="polite"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{personalErrors.lastName}</span>
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
                    value={personalValues.email}
                    onChange={handlePersonalChange('email')}
                    onBlur={handlePersonalBlur('email')}
                    placeholder="john@company.com"
                    className={`auth-input input-with-icon-left ${personalErrors.email ? 'auth-input-error' : ''}`}
                    required
                    aria-required="true"
                    aria-invalid={!!personalErrors.email}
                    aria-describedby={personalErrors.email ? 'email-error' : undefined}
                  />
                </div>
                {personalErrors.email && (
                  <motion.div
                    id="email-error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                    role="alert"
                    aria-live="polite"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{personalErrors.email}</span>
                  </motion.div>
                )}
              </div>

              {/* Phone */}
              <div>
                <PhoneInput
                  id="phone"
                  name="phone"
                  value={phoneData.phone}
                  onChange={handlePhoneChange}
                  onBlur={handlePhoneBlur}
                  validateOnBlur={false}
                  label="Phone Number"
                  placeholder="Phone number"
                  error={phoneError}
                  defaultCountry="GR"
                  showValidation={false}
                />
                {phoneError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                    role="alert"
                    aria-live="polite"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{phoneError}</span>
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
                    value={personalValues.password}
                    onChange={handlePersonalChange('password')}
                    onBlur={handlePersonalBlur('password')}
                    placeholder="Create a strong password"
                    className={`auth-input input-with-icon-left input-with-icon-right ${personalErrors.password ? 'auth-input-error' : ''}`}
                    required
                    aria-required="true"
                    aria-invalid={!!personalErrors.password}
                    aria-describedby={personalErrors.password ? 'password-error' : undefined}
                  />
                  <IconButton
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    icon={showPassword ? EyeOff : Eye}
                    variant="ghost"
                    size="md"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="input-icon-right"
                  />
                </div>

                {/* Password Strength Indicator */}
                {personalValues.password && (
                  <div className="mt-3">
                    <PasswordStrengthIndicator 
                      password={personalValues.password}
                      showStrengthBar
                    />
                  </div>
                )}

                {personalErrors.password && (
                  <motion.div
                    id="password-error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                    role="alert"
                    aria-live="polite"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{personalErrors.password}</span>
                  </motion.div>
                )}
              </div>
            </div>
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
                className="bg-primary h-2 rounded-full"
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
            <div className="flex items-center space-x-2 text-[#D417C8]">
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
            <Button
              type="button"
              onClick={multiStepForm.goToPrevious}
              disabled={!multiStepForm.canGoPrevious}
              variant="ghost"
              size="md"
              icon={ArrowLeft}
              iconPosition="left"
              className="h-9 min-w-[100px] sm:min-w-[140px]"
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Button>

            {/* Right side buttons container */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Skip button - only show on billing step when form is NOT complete */}
              {multiStepForm.currentStep === 1 && !isBillingComplete && (
                <Button
                  type="button"
                  onClick={handleSkipBilling}
                  disabled={isSubmitting}
                  variant="ghost"
                  size="md"
                  className="h-9 min-w-[80px] sm:min-w-[100px]"
                >
                  <span className="hidden sm:inline">Skip for now</span>
                  <span className="sm:hidden">Skip</span>
                </Button>
              )}

              {/* Continue button - show on step 0, step 2, and step 1 when billing is complete */}
              {(multiStepForm.currentStep !== 1 || isBillingComplete) && (
                <ActionButton
                  label={(() => {
                    if (isSubmitting) return 'Creating...'
                    if (multiStepForm.isLastStep) return 'Create Account'
                    return 'Continue'
                  })()}
                  onClick={handleNextStep}
                  disabled={
                    isSubmitting ||
                    (multiStepForm.currentStep === 0 && !isPersonalValid) ||
                    (multiStepForm.currentStep === 2 && (!isCompanyValid || !isCompanyComplete))
                  }
                  icon={multiStepForm.isLastStep ? CheckCircle : ArrowRight}
                  loading={isSubmitting}
                  size="md"
                  animated={false}
                  actionType={multiStepForm.isLastStep ? "auth" : "navigation"}
                  className="min-w-[120px] sm:min-w-[160px]"
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

