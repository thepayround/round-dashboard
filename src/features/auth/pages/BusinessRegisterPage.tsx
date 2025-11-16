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
import { Link } from 'react-router-dom'

import { BillingAddressForm } from '../components/BillingAddressForm'
import { CompanyDetailsForm } from '../components/CompanyDetailsForm'
import { useBusinessRegisterController } from '../hooks/useBusinessRegisterController'

import { Input } from '@/shared/ui'
import { ActionButton } from '@/shared/ui/ActionButton'
import { AuthLogo } from '@/shared/ui/AuthLogo'
import { Button, IconButton } from '@/shared/ui/Button'
import { PasswordStrengthIndicator } from '@/shared/ui/PasswordStrengthIndicator'
import { PhoneInput } from '@/shared/ui/PhoneInput'

export const BusinessRegisterPage = () => {
  const {
    personalForm,
    phone,
    companyForm,
    billingForm,
    multiStepForm,
    showPassword,
    togglePasswordVisibility,
    detailedProgress,
    apiError,
    isSubmitting,
    isPersonalValid,
    isCompanyValid,
    isCompanyComplete,
    isBillingComplete,
    handleNextStep,
    handleSkipBilling,
  } = useBusinessRegisterController()

  const {
    values: personalValues,
    errors: personalErrors,
    handleChange: handlePersonalChange,
    handleBlur: handlePersonalBlur,
  } = personalForm

  const {
    phoneData,
    phoneError,
    handlePhoneChange,
    handlePhoneBlur,
  } = phone

  const {
    info: companyInfo,
    setInfo: setCompanyInfo,
    errors: companyErrors,
    setErrors: setCompanyErrors,
    onValidationChange: onCompanyValidationChange,
  } = companyForm

  const {
    address: billingAddress,
    setAddress: setBillingAddress,
    errors: billingErrors,
    setErrors: setBillingErrors,
    onValidationChange: onBillingValidationChange,
  } = billingForm

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
                className="text-2xl font-medium tracking-tight text-white mb-2"
              >
                Personal Information
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/85"
              >
                Tell us about yourself
              </motion.p>
            </div>

            <div className="space-y-6">
              {/* Name Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-normal text-white/90 mb-2 tracking-tight">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-auth-icon-primary w-4 h-4" />
                    <Input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={personalValues.firstName}
                      onChange={handlePersonalChange('firstName')}
                      onBlur={handlePersonalBlur('firstName')}
                      placeholder="John"
                      className={`w-full h-9 px-3 pl-9 bg-auth-bg border border-auth-border rounded-lg text-white placeholder:text-auth-placeholder font-light text-xs tracking-tight transition-all duration-200 hover:border-auth-border-hover focus:border-auth-primary focus:bg-auth-bg outline-none appearance-none ${personalErrors.firstName ? 'border-auth-error bg-auth-error-bg focus:border-auth-error' : ''}`}
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
                      className="mt-2 flex items-center space-x-2 text-auth-error font-medium text-sm"
                      role="alert"
                      aria-live="polite"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{personalErrors.firstName}</span>
                    </motion.div>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-normal text-white/90 mb-2 tracking-tight">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-auth-icon-primary w-4 h-4" />
                    <Input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={personalValues.lastName}
                      onChange={handlePersonalChange('lastName')}
                      onBlur={handlePersonalBlur('lastName')}
                      placeholder="Doe"
                      className={`w-full h-9 px-3 pl-9 bg-auth-bg border border-auth-border rounded-lg text-white placeholder:text-auth-placeholder font-light text-xs tracking-tight transition-all duration-200 hover:border-auth-border-hover focus:border-auth-primary focus:bg-auth-bg outline-none appearance-none ${personalErrors.lastName ? 'border-auth-error bg-auth-error-bg focus:border-auth-error' : ''}`}
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
                      className="mt-2 flex items-center space-x-2 text-auth-error font-medium text-sm"
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
                <label htmlFor="email" className="block text-sm font-normal text-white/90 mb-2 tracking-tight">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-auth-icon-primary w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={personalValues.email}
                    onChange={handlePersonalChange('email')}
                    onBlur={handlePersonalBlur('email')}
                    placeholder="john@company.com"
                    className={`w-full h-9 px-3 pl-9 bg-auth-bg border border-auth-border rounded-lg text-white placeholder:text-auth-placeholder font-light text-xs tracking-tight transition-all duration-200 hover:border-auth-border-hover focus:border-auth-primary focus:bg-auth-bg outline-none appearance-none ${personalErrors.email ? 'border-auth-error bg-auth-error-bg focus:border-auth-error' : ''}`}
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
                    className="mt-2 flex items-center space-x-2 text-auth-error font-medium text-sm"
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
                    className="mt-2 flex items-center space-x-2 text-auth-error font-medium text-sm"
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
                <label htmlFor="password" className="block text-sm font-normal text-white/90 mb-2 tracking-tight">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-auth-icon-primary w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={personalValues.password}
                    onChange={handlePersonalChange('password')}
                    onBlur={handlePersonalBlur('password')}
                    placeholder="Create a strong password"
                    className={`w-full h-9 px-3 pl-9 pr-9 bg-auth-bg border border-auth-border rounded-lg text-white placeholder:text-auth-placeholder font-light text-xs tracking-tight transition-all duration-200 hover:border-auth-border-hover focus:border-auth-primary focus:bg-auth-bg outline-none appearance-none ${personalErrors.password ? 'border-auth-error bg-auth-error-bg focus:border-auth-error' : ''}`}
                    required
                    aria-required="true"
                    aria-invalid={!!personalErrors.password}
                    aria-describedby={personalErrors.password ? 'password-error' : undefined}
                  />
                  <IconButton
                    type="button"
                    onClick={togglePasswordVisibility}
                    icon={showPassword ? EyeOff : Eye}
                    variant="ghost"
                    size="md"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center cursor-pointer transition-colors duration-200 text-auth-icon hover:text-white/90"
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
                    className="mt-2 flex items-center space-x-2 text-auth-error font-medium text-sm"
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
              onValidationChange={onBillingValidationChange}
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
              onValidationChange={onCompanyValidationChange}
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
    <div className="relative min-h-screen flex items-center justify-center pb-12 z-[1]">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
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

        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-5 md:p-6 lg:p-7 relative overflow-hidden z-10 transition-all duration-150">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <div className="gradient-header" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative"
          >
            <h1 className="text-xl md:text-2xl lg:text-xl font-medium tracking-tight text-white mb-2 md:mb-3 lg:mb-2 relative">Create Business Account</h1>
            <p className="text-white/85 text-sm md:text-base lg:text-sm font-medium">Join Round for business</p>
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
              <span className="text-sm text-white/85">
                Step {multiStepForm.currentStep + 1} of {multiStepForm.getTotalSteps()}
              </span>
              <span className="text-sm text-white/85">
                {detailedProgress}% Complete
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${detailedProgress}%` }}
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
            <p className="text-white/85 text-sm sm:text-base">
              Already have an account?{' '}
              <Link to="/login/business" className="text-auth-primary/90 font-semibold no-underline transition-all duration-300 hover:text-auth-primary hover:-translate-y-px">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

