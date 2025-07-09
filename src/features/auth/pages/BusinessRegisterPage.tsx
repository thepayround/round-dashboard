import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import type { AccountType } from '@/shared/types/auth'
import type { CompanyInfo, BillingAddress } from '@/shared/types/business'
import type { ValidationError } from '@/shared/utils/validation'
import {
  validateRegistrationForm,
  validateField,
  getFieldError,
  hasFieldError,
} from '@/shared/utils/validation'

import { CompanyDetailsForm } from '../components/CompanyDetailsForm'
import { BillingAddressForm } from '../components/BillingAddressForm'
import { useMultiStepForm } from '../hooks/useMultiStepForm'

interface PersonalFormData {
  firstName: string
  lastName: string
  phone: string
  email: string
  password: string
}

export const BusinessRegisterPage = () => {
  // Form state
  const [accountType] = useState<AccountType | null>('business')
  const [personalData, setPersonalData] = useState<PersonalFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
  })
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    companyName: '',
    registrationNumber: '',
    taxId: '',
    currency: 'USD',
    industry: undefined,
    businessType: 'corporation',
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
  const [isBillingValid, setIsBillingValid] = useState(true) // Optional step

  // UI state
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        id: 'company-info',
        title: 'Company Information',
        description: 'Your company details',
        isCompleted: false,
      },
      {
        id: 'billing-address',
        title: 'Billing Address',
        description: 'Your billing information',
        isCompleted: false,
        isOptional: true,
      },
    ],
    onComplete: handleFormComplete,
  })

  // Update step completion based on validation
  useEffect(() => {
    multiStepForm.updateStepCompletion(0, isPersonalValid)
    multiStepForm.updateStepCompletion(1, isCompanyValid)
    multiStepForm.updateStepCompletion(2, isBillingValid)
  }, [isPersonalValid, isCompanyValid, isBillingValid, multiStepForm])

  // Handle personal form changes
  const handlePersonalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPersonalData(prev => ({ ...prev, [name]: value }))

    // Clear field error when user starts typing
    if (hasFieldError(personalErrors, name)) {
      setPersonalErrors(prev => prev.filter(error => error.field !== name))
    }

    // Validate entire form
    const updatedData = { ...personalData, [name]: value }
    const validation = validateRegistrationForm(updatedData)
    setIsPersonalValid(validation.isValid)
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
  function handleFormComplete() {
    setIsSubmitting(true)

    // TODO: Implement API call to register business user
    console.warn('Business registration data:', {
      accountType,
      personal: personalData,
      company: companyInfo,
      billing: billingAddress,
    })

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // TODO: Handle successful registration
    }, 2000)
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
      multiStepForm.completeCurrentStep()
      multiStepForm.goToNext()
    } else if (multiStepForm.currentStep === 1) {
      // Company info step
      if (isCompanyValid) {
        multiStepForm.completeCurrentStep()
        multiStepForm.goToNext()
      }
    } else if (multiStepForm.currentStep === 2) {
      // Billing address step (optional)
      multiStepForm.completeCurrentStep()
      handleFormComplete()
    }
  }

  // Skip billing address
  const handleSkipBilling = () => {
    setBillingAddress(undefined)
    multiStepForm.completeCurrentStep()
    handleFormComplete()
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
            className="auth-card"
          >
            <div className="text-center mb-8">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold auth-text mb-2"
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
                <label htmlFor="phone" className="auth-label">
                  Phone Number
                </label>
                <div className="input-container">
                  <Phone className="input-icon-left auth-icon-primary" />
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={personalData.phone}
                    onChange={handlePersonalInputChange}
                    onBlur={handlePersonalInputBlur}
                    placeholder="+1 (555) 123-4567"
                    className={`auth-input input-with-icon-left ${hasFieldError(personalErrors, 'phone') ? 'auth-input-error' : ''}`}
                    required
                  />
                </div>
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
          <div className="auth-card">
            <CompanyDetailsForm
              companyInfo={companyInfo}
              onCompanyInfoChange={setCompanyInfo}
              onValidationChange={setIsCompanyValid}
              errors={companyErrors}
              onErrorsChange={setCompanyErrors}
            />
          </div>
        )

      case 2:
        return (
          <div className="auth-card">
            <BillingAddressForm
              billingAddress={billingAddress}
              onBillingAddressChange={setBillingAddress}
              onValidationChange={setIsBillingValid}
              errors={billingErrors}
              onErrorsChange={setBillingErrors}
              isOptional
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        {multiStepForm.currentStep >= 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">
                Step {multiStepForm.currentStep + 1} of {multiStepForm.getTotalSteps()}
              </span>
              <span className="text-sm text-gray-400">
                {multiStepForm.getStepProgress()}% Complete
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${multiStepForm.getStepProgress()}%` }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full"
              />
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
            className="flex items-center justify-between mt-8"
          >
            {/* Button Container */}
            <div className="flex items-center justify-between w-full">
              {/* Previous Button */}
              <motion.button
                type="button"
                onClick={multiStepForm.goToPrevious}
                disabled={!multiStepForm.canGoPrevious}
                whileHover={{ scale: multiStepForm.canGoPrevious ? 1.05 : 1 }}
                whileTap={{ scale: multiStepForm.canGoPrevious ? 0.95 : 1 }}
                className={`
                  px-8 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 min-w-[120px]
                  ${
                    multiStepForm.canGoPrevious
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-white/5 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </motion.button>

              {/* Right side buttons */}
              <div className="flex items-center space-x-3">
                {multiStepForm.currentStep === 2 && (
                  <motion.button
                    type="button"
                    onClick={handleSkipBilling}
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                    className="px-8 py-3 rounded-lg font-medium transition-all duration-300 bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 min-w-[120px]"
                  >
                    Skip for now
                  </motion.button>
                )}

                <motion.button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    (multiStepForm.currentStep === 0 && !isPersonalValid) ||
                    (multiStepForm.currentStep === 1 && !isCompanyValid)
                  }
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  className={`
                    px-8 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 min-w-[140px]
                    ${
                      isSubmitting ||
                      (multiStepForm.currentStep === 0 && !isPersonalValid) ||
                      (multiStepForm.currentStep === 1 && !isCompanyValid)
                        ? 'bg-white/10 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg'
                    }
                  `}
                >
                  <span>
                    {(() => {
                      if (isSubmitting) return 'Creating Account...'
                      if (multiStepForm.isLastStep) return 'Create Account'
                      return 'Continue'
                    })()}
                  </span>
                  {!isSubmitting &&
                    (multiStepForm.isLastStep ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    ))}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Login Link */}
        <div className="text-center mt-8">
          <p className="auth-text-muted">
            Already have an account?{' '}
            <Link to="/auth/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
