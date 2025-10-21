import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ActionButton, AuthLogo, PhoneInput } from '@/shared/components'
import { GoogleLoginButton } from '../components/GoogleLoginButton'
import { useGlobalToast } from '@/shared/contexts/ToastContext'

import type { ValidationError } from '@/shared/utils/validation'
import type { CountryPhoneInfo } from '@/shared/services/api/phoneValidation.service'
import { phoneValidationService } from '@/shared/services/api/phoneValidation.service'
import {
  validateRegistrationForm,
  getFieldError,
  hasFieldError,
  validateField,
  validateEmail,
  validatePassword,
  validateFirstName,
  validateLastName,
} from '@/shared/utils/validation'
import { apiClient } from '@/shared/services/apiClient'
import { phoneValidator } from '@/shared/utils/phoneValidation'
// import { useAuth } from '@/shared/contexts/AuthContext'

export const PersonalRegisterPage = () => {
  const navigate = useNavigate()
  const { showSuccess, showError } = useGlobalToast()
  // const { login } = useAuth() // Not used in this component
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    countryPhoneCode: '', 
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form validation helper
  const isFormValid = () => {
    // Check if all required fields are filled
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      return false
    }

    // Simple phone check - use client-side validation
    if (!phoneValidator.hasMinimumContent(formData.phone)) {
      return false
    }

    // Check if there are any validation errors from other fields
    const nonPhoneErrors = errors.filter(error => error.field !== 'phone')
    if (nonPhoneErrors.length > 0) {
      return false
    }

    // Validate other fields
    const emailValidation = validateEmail(formData.email)
    const passwordValidation = validatePassword(formData.password)
    const firstNameValidation = validateFirstName(formData.firstName)
    const lastNameValidation = validateLastName(formData.lastName)

    return (
      emailValidation.isValid &&
      passwordValidation.isValid &&
      firstNameValidation.isValid &&
      lastNameValidation.isValid
    )
  }

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isFormValid()) {
      e.preventDefault()
      handleSubmit(e as React.FormEvent)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear field error when user starts typing
    if (hasFieldError(errors, name)) {
      setErrors(prev => prev.filter(error => error.field !== name))
    }
  }

  const handlePhoneChange = (phoneNumber: string) => {
    setFormData(prev => ({ ...prev, phone: phoneNumber }))
    
    // Clear phone error when user starts typing (same as other fields)
    if (hasFieldError(errors, 'phone')) {
      setErrors(prev => prev.filter(error => error.field !== 'phone'))
    }
  }

  const handlePhoneBlur = async (phoneNumber: string, countryInfo: CountryPhoneInfo | null) => {
    // Store the country phone code for backend submission
    if (countryInfo?.phoneCode) {
      setFormData(prev => ({ ...prev, countryPhoneCode: countryInfo.phoneCode }))
    }

    // Validate phone when user leaves the field (same pattern as other fields)
    if (!phoneNumber?.trim()) {
      return // Don't validate empty fields on blur
    }

    try {
      // Use the provided phone number and country info
      const countryCode = countryInfo?.countryCode ?? 'GR'

      // Call backend API for validation using service (follows platform pattern)
      const result = await phoneValidationService.validatePhoneNumber({
        phoneNumber: phoneNumber.trim(),
        countryCode
      })
      
      if (!result.isValid && result.error) {
        setErrors(prev => [
          ...prev.filter(error => error.field !== 'phone'),
          { field: 'phone', message: result.error ?? 'Phone number is invalid', code: 'INVALID_PHONE' }
        ])
      }
    } catch (error) {
      console.error('Phone validation failed:', error)
      // Don't show error for network issues, just log them
    }
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Validate field when user leaves it
    const fieldValidation = validateField(name, value)
    if (!fieldValidation.isValid) {
      setErrors(prev => [...prev.filter(error => error.field !== name), ...fieldValidation.errors])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Final validation check before submission
    const validation = validateRegistrationForm(formData)

    if (!validation.isValid) {
      setErrors(validation.errors)
      setIsSubmitting(false)
      return
    }

    setErrors([])

    try {
      // Call real API
      const response = await apiClient.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phone,
        countryPhoneCode: formData.countryPhoneCode,
      })

      if (response.success && response.data) {
        // Navigate to confirmation pending page instead of auto-login
        navigate('/auth/confirmation-pending', {
          state: { email: formData.email },
          replace: true,
        })
      } else {
        showError(response.error ?? 'Registration failed')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Registration error:', error)
      showError('An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleButtonClick = () => {
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent
    handleSubmit(fakeEvent)
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
        className="w-full max-w-[360px] mx-auto relative z-10"
        onKeyDown={handleKeyDown}
      >
        {/* Centered Logo Above Form */}
        <AuthLogo />

        <div className="auth-card">
          {/* Header */}
          <div className="text-center mb-5 md:mb-6 lg:mb-5">
            <div className="gradient-header" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative"
            >
              <h1 className="text-xl md:text-2xl lg:text-xl font-medium tracking-tight auth-text mb-2 md:mb-3 lg:mb-2 relative">Create Personal Account</h1>
              <p className="auth-text-muted text-sm md:text-base lg:text-sm font-medium">Join the Round community</p>
            </motion.div>
          </div>


        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-5 lg:space-y-4">
          {/* Name Fields Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
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
                  value={formData.firstName}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="John"
                  className={`auth-input input-with-icon-left ${hasFieldError(errors, 'firstName') ? 'auth-input-error' : ''}`}
                  required
                />
              </div>
              {hasFieldError(errors, 'firstName') && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{getFieldError(errors, 'firstName')?.message}</span>
                </motion.div>
              )}
            </div>

            {/* Last Name */}
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
                  value={formData.lastName}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="Doe"
                  className={`auth-input input-with-icon-left ${hasFieldError(errors, 'lastName') ? 'auth-input-error' : ''}`}
                  required
                />
              </div>
              {hasFieldError(errors, 'lastName') && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{getFieldError(errors, 'lastName')?.message}</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Email Address */}
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
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="example@gmail.com"
                className={`auth-input input-with-icon-left ${hasFieldError(errors, 'email') ? 'auth-input-error' : ''}`}
                required
              />
            </div>
            {hasFieldError(errors, 'email') && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{getFieldError(errors, 'email')?.message}</span>
              </motion.div>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <PhoneInput
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              validateOnBlur={false}
              label="Phone Number"
              placeholder="Phone number"
              error={hasFieldError(errors, 'phone') ? getFieldError(errors, 'phone')?.message : undefined}
              defaultCountry="GR"
              showValidation={false}
            />
            {hasFieldError(errors, 'phone') && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{getFieldError(errors, 'phone')?.message}</span>
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
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="Create a strong password"
                className={`auth-input input-with-icon-left input-with-icon-right ${hasFieldError(errors, 'password') ? 'auth-input-error' : ''}`}
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
            {hasFieldError(errors, 'password') && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{getFieldError(errors, 'password')?.message}</span>
              </motion.div>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="text-center mt-8 md:mt-10 lg:mt-8">
            <p className="text-sm auth-text-muted">
              By creating an account you accept Round&apos;s{' '}
              <Link to="/terms" className="auth-link">
                terms and conditions
              </Link>
            </p>
          </div>

          {/* Submit Button */}
          <ActionButton
            label={isSubmitting ? 'Creating Account...' : 'Create Personal Account'}
            onClick={handleButtonClick}
            disabled={!isFormValid()}
            icon={ArrowRight}
            loading={isSubmitting}
            size="sm"
            animated={false}
            actionType="auth"
            className="mt-6 md:mt-8 lg:mt-6 w-full"
          />

          {/* Divider */}
          <div className="auth-divider">
            <span>or</span>
          </div>

          {/* Social Login Buttons */}
          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4">
            <GoogleLoginButton
              accountType="personal"
              onSuccess={() => {
                showSuccess('Successfully registered with Google!')
                // Redirect to dashboard or profile completion
                navigate('/dashboard')
              }}
              onError={(error) => showError(error)}
            />

            <button
              type="button"
              className="w-full h-11 md:h-9 px-4 py-2 
                         bg-white/8 border border-white/15 rounded-lg
                         text-white font-normal tracking-tight text-sm
                         hover:bg-white/12 hover:border-white/20
                         transition-all duration-200 ease-out
                         flex items-center justify-center gap-2.5
                         relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <svg className="w-4 h-4 z-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="z-10">Facebook</span>
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="auth-text-muted">
              Already have an account?{' '}
              <Link to="/login" className="auth-link brand-primary">
                Sign in
              </Link>
            </p>
          </div>
        </form>
        </div>
      </motion.div>
    </div>
  )
}
