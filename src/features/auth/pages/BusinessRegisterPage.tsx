import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

import { BillingAddressForm } from '../components/BillingAddressForm'
import { CompanyDetailsForm } from '../components/CompanyDetailsForm'
import { useBusinessRegisterController } from '../hooks/useBusinessRegisterController'

import { LoadingSpinner } from '@/shared/ui/LoadingSpinner'
import { PasswordStrengthIndicator } from '@/shared/ui/PasswordStrengthIndicator'
import { PhoneInput } from '@/shared/ui/PhoneInput'
import { Button } from '@/shared/ui/shadcn/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
import { PasswordInput } from '@/shared/ui/shadcn/password-input'

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

  // Get step title and description
  const getStepInfo = () => {
    switch (multiStepForm.currentStep) {
      case 0:
        return {
          title: 'Create Business Account',
          description: 'Tell us about yourself',
        }
      case 1:
        return {
          title: 'Billing Address',
          description: 'Add your billing information (optional)',
        }
      case 2:
        return {
          title: 'Company Details',
          description: 'Tell us about your company',
        }
      default:
        return {
          title: 'Create Business Account',
          description: 'Join Round for business',
        }
    }
  }

  const { title, description } = getStepInfo()

  // Render step content
  const renderStepContent = () => {
    switch (multiStepForm.currentStep) {
      case 0:
        return (
          <div className="flex flex-col gap-6">
            {/* Name Fields Row */}
            <div className="grid md:grid-cols-2 gap-4 items-start">
              <div className="grid gap-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={personalValues.firstName}
                  onChange={handlePersonalChange('firstName')}
                  onBlur={handlePersonalBlur('firstName')}
                  placeholder="John"
                  aria-invalid={!!personalErrors.firstName}
                  aria-describedby={personalErrors.firstName ? 'firstName-error' : undefined}
                  autoComplete="given-name"
                  required
                />
                <div className="min-h-5">
                  {personalErrors.firstName && (
                    <p id="firstName-error" className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {personalErrors.firstName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={personalValues.lastName}
                  onChange={handlePersonalChange('lastName')}
                  onBlur={handlePersonalBlur('lastName')}
                  placeholder="Doe"
                  aria-invalid={!!personalErrors.lastName}
                  aria-describedby={personalErrors.lastName ? 'lastName-error' : undefined}
                  autoComplete="family-name"
                  required
                />
                <div className="min-h-5">
                  {personalErrors.lastName && (
                    <p id="lastName-error" className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {personalErrors.lastName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={personalValues.email}
                onChange={handlePersonalChange('email')}
                onBlur={handlePersonalBlur('email')}
                placeholder="john@company.com"
                aria-invalid={!!personalErrors.email}
                aria-describedby={personalErrors.email ? 'email-error' : undefined}
                autoComplete="email"
                required
              />
              <div className="min-h-5">
                {personalErrors.email && (
                  <p id="email-error" className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {personalErrors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="grid gap-2">
              <Label htmlFor="phone">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <PhoneInput
                id="phone"
                name="phone"
                value={phoneData.phone}
                onChange={handlePhoneChange}
                onBlur={handlePhoneBlur}
                validateOnBlur={false}
                placeholder="Phone number"
                error={phoneError}
                defaultCountry="GR"
                showValidation={false}
              />
              <div className="min-h-5">
                {phoneError && (
                  <p id="phone-error" className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {phoneError}
                  </p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">
                Password <span className="text-destructive">*</span>
              </Label>
              <PasswordInput
                id="password"
                name="password"
                value={personalValues.password}
                onChange={handlePersonalChange('password')}
                onBlur={handlePersonalBlur('password')}
                placeholder="Create a strong password"
                aria-invalid={!!personalErrors.password}
                aria-describedby={personalErrors.password ? 'password-error' : undefined}
                autoComplete="new-password"
                required
              />
              <div className="min-h-5">
                {personalErrors.password && (
                  <p id="password-error" className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {personalErrors.password}
                  </p>
                )}
              </div>

              {/* Password Strength Indicator */}
              {personalValues.password && (
                <div className="mt-2">
                  <PasswordStrengthIndicator
                    password={personalValues.password}
                    showStrengthBar
                  />
                </div>
              )}
            </div>
          </div>
        )

      case 1:
        return (
          <BillingAddressForm
            billingAddress={billingAddress}
            onBillingAddressChange={setBillingAddress}
            onValidationChange={onBillingValidationChange}
            errors={billingErrors}
            onErrorsChange={setBillingErrors}
            isOptional
          />
        )

      case 2:
        return (
          <CompanyDetailsForm
            companyInfo={companyInfo}
            onCompanyInfoChange={setCompanyInfo}
            onValidationChange={onCompanyValidationChange}
            errors={companyErrors}
            onErrorsChange={setCompanyErrors}
          />
        )

      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>

        {/* Progress Bar */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">
              Step {multiStepForm.currentStep + 1} of {multiStepForm.getTotalSteps()}
            </span>
            <span className="text-xs text-muted-foreground">
              {detailedProgress}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${detailedProgress}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6">
          {/* API Error Message */}
          {apiError && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {apiError}
              </p>
            </div>
          )}

          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex flex-col gap-4 pt-2">
            {/* Main action buttons */}
            <div className="flex gap-3">
              {/* Previous Button - only show after step 0 */}
              {multiStepForm.canGoPrevious && (
                <Button
                  type="button"
                  onClick={multiStepForm.goToPrevious}
                  variant="outline"
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}

              {/* Continue/Submit button - always show */}
              <Button
                onClick={handleNextStep}
                disabled={
                  isSubmitting ||
                  (multiStepForm.currentStep === 0 && !isPersonalValid) ||
                  (multiStepForm.currentStep === 2 && (!isCompanyValid || !isCompanyComplete))
                }
                className={multiStepForm.canGoPrevious ? 'flex-1' : 'w-full'}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    {multiStepForm.isLastStep ? 'Create Account' : 'Continue'}
                    {multiStepForm.isLastStep ? (
                      <CheckCircle className="w-4 h-4 ml-2" />
                    ) : (
                      <ArrowRight className="w-4 h-4 ml-2" />
                    )}
                  </>
                )}
              </Button>
            </div>

            {/* Skip link - only show on billing step */}
            {multiStepForm.currentStep === 1 && (
              <button
                type="button"
                onClick={handleSkipBilling}
                disabled={isSubmitting}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip this step
              </button>
            )}
          </div>

          {/* Login Link */}
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/login/business"
              className="text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
