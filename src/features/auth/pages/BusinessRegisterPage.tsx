import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  User,
  Mail,
  Lock,
  AlertCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { BillingAddressForm } from '../components/BillingAddressForm'
import { CompanyDetailsForm } from '../components/CompanyDetailsForm'
import { useBusinessRegisterController } from '../hooks/useBusinessRegisterController'

import { ActionButton } from '@/shared/ui/ActionButton'
import { AuthLogo } from '@/shared/ui/AuthLogo'
import { Button } from '@/shared/ui/Button'
import { FormInput } from '@/shared/ui/FormInput'
import { PasswordStrengthIndicator } from '@/shared/ui/PasswordStrengthIndicator'
import { PhoneInput } from '@/shared/ui/PhoneInput'

export const BusinessRegisterPage = () => {
  const {
    personalForm,
    phone,
    companyForm,
    billingForm,
    multiStepForm,
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
                <FormInput
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  leftIcon={User}
                  value={personalValues.firstName}
                  onChange={handlePersonalChange('firstName')}
                  onBlur={handlePersonalBlur('firstName')}
                  placeholder="John"
                  error={personalErrors.firstName}
                  required
                  size="sm"
                />

                <FormInput
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  leftIcon={User}
                  value={personalValues.lastName}
                  onChange={handlePersonalChange('lastName')}
                  onBlur={handlePersonalBlur('lastName')}
                  placeholder="Doe"
                  error={personalErrors.lastName}
                  required
                  size="sm"
                />
              </div>

              {/* Email */}
              <FormInput
                id="email"
                type="email"
                name="email"
                label="Email Address"
                leftIcon={Mail}
                value={personalValues.email}
                onChange={handlePersonalChange('email')}
                onBlur={handlePersonalBlur('email')}
                placeholder="john@company.com"
                error={personalErrors.email}
                required
                size="sm"
              />

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
                <FormInput
                  id="password"
                  type="password"
                  name="password"
                  label="Password"
                  leftIcon={Lock}
                  value={personalValues.password}
                  onChange={handlePersonalChange('password')}
                  onBlur={handlePersonalBlur('password')}
                  placeholder="Create a strong password"
                  error={personalErrors.password}
                  required
                  size="sm"
                  passwordToggle
                />

                {/* Password Strength Indicator */}
                {personalValues.password && (
                  <div className="mt-3">
                    <PasswordStrengthIndicator 
                      password={personalValues.password}
                      showStrengthBar
                    />
                  </div>
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
            <div className="flex items-center space-x-2 text-primary">
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

