import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Users, Building, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ActionButton, AuthLogo, PhoneInput } from '@/shared/components'

import type { ValidationError } from '@/shared/utils/validation'
import type { CountryPhoneInfo } from '@/shared/services/api/phoneValidation.service'
import { phoneValidationService } from '@/shared/services/api/phoneValidation.service'
import {
  validateRegistrationForm,
  getFieldError,
  hasFieldError,
  validateField,
} from '@/shared/utils/validation'
import { teamService } from '@/shared/services/api'
import type { ValidateInvitationResponse, RegisterWithInvitationRequest } from '@/shared/services/api'
import { useAuth } from '@/shared/hooks/useAuth'

export const InvitationAcceptancePage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    countryPhoneCode: '',
  })
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValidatingToken, setIsValidatingToken] = useState(true)
  const [apiError, setApiError] = useState('')
  const [invitation, setInvitation] = useState<ValidateInvitationResponse | null>(null)
  const [tokenError, setTokenError] = useState('')

  // Validate invitation token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenError('Missing invitation token')
        setIsValidatingToken(false)
        return
      }

      try {
        const response = await teamService.validateInvitation(token)
        
        if (response.success && response.data) {
          setInvitation(response.data)
        } else {
          setTokenError(response.message ?? 'Invalid invitation token')
        }
      } catch (error) {
        setTokenError('Unable to validate invitation. Please try again.')
      } finally {
        setIsValidatingToken(false)
      }
    }

    validateToken()
  }, [token])

  // Form validation helper
  const isFormValid = () => (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.password.trim() !== '' &&
      formData.password.length >= 8 &&
      errors.length === 0
    )

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
    setApiError('')
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Validate field when user leaves it
    const fieldValidation = validateField(name, value)
    if (!fieldValidation.isValid) {
      setErrors(prev => [...prev.filter(error => error.field !== name), ...fieldValidation.errors])
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

    // Check if field is empty and required, show required error immediately
    if (!phoneNumber?.trim()) {
      setErrors(prev => [
        ...prev.filter(error => error.field !== 'phone'),
        { field: 'phone', message: 'Phone number is required', code: 'REQUIRED' }
      ])
      return
    }

    try {
      // Use the provided phone number and country info
      const countryCode = countryInfo?.countryCode ?? 'US'

      // Call backend API for validation using the service
      const validationResult = await phoneValidationService.validatePhoneNumber({
        phoneNumber,
        countryCode,
      })

      if (!validationResult.isValid) {
        const phoneError: ValidationError = {
          field: 'phone',
          message: validationResult.error ?? 'Invalid phone number format',
          code: 'INVALID_PHONE'
        }
        setErrors(prev => [...prev.filter(error => error.field !== 'phone'), phoneError])
      } else {
        // Clear phone error if validation passed
        setErrors(prev => prev.filter(error => error.field !== 'phone'))
      }
    } catch (error: unknown) {
      console.error('Phone validation failed:', error)
      
      // Check if this is a validation response in the error
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } }
        if (axiosError.response?.data) {
          const validationResult = axiosError.response.data
          if (validationResult.error) {
            // Use the specific error from backend
            const phoneError: ValidationError = {
              field: 'phone',
              message: validationResult.error,
              code: 'INVALID_PHONE'
            }
            setErrors(prev => [...prev.filter(error => error.field !== 'phone'), phoneError])
            return
          }
        }
      }
      
      // Only show generic error if we can't get specific error from backend
      const phoneError: ValidationError = {
        field: 'phone',
        message: 'Phone validation service unavailable',
        code: 'SERVICE_ERROR'
      }
      setErrors(prev => [...prev.filter(error => error.field !== 'phone'), phoneError])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setApiError('')

    if (!invitation || !token) {
      setApiError('Invalid invitation')
      setIsSubmitting(false)
      return
    }

    // Final validation check before submission
    const validation = validateRegistrationForm({
      ...formData,
      email: invitation.email, // Email is pre-filled from invitation
    })

    if (!validation.isValid) {
      setErrors(validation.errors)
      setIsSubmitting(false)
      return
    }

    setErrors([])

    try {
      const registrationRequest: RegisterWithInvitationRequest = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: invitation.email,
        password: formData.password,
        phoneNumber: formData.phone.trim(),
        countryPhoneCode: formData.countryPhoneCode,
        token,
      }

      const response = await teamService.registerWithInvitation(registrationRequest)

      if (response.success && response.data) {
        // Auto-login with the returned tokens and user data
        const { token, refreshToken, user } = response.data
        
        // Log the user in with complete data from API (includes formatted phone number)
        login(user, token, refreshToken)
        
        // Navigate to dashboard
        navigate('/dashboard', { replace: true })
      } else {
        setApiError(response.message ?? 'Registration failed')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Registration error:', error)
      setApiError('An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleButtonClick = () => {
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent
    handleSubmit(fakeEvent)
  }

  // Loading state
  if (isValidatingToken) {
    return (
      <div className="auth-container">
        <div className="auth-background">
          <div className="floating-orb" />
          <div className="floating-orb" />
          <div className="floating-orb" />
        </div>
        
        <div className="w-full max-w-[360px] mx-auto relative z-10">
          <div className="auth-card text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14BDEA] mx-auto mb-4" />
            <p className="auth-text-muted">Validating invitation...</p>
          </div>
        </div>
      </div>
    )
  }

  // Token error state
  if (tokenError) {
    return (
      <div className="auth-container">
        <div className="auth-background">
          <div className="floating-orb" />
          <div className="floating-orb" />
          <div className="floating-orb" />
        </div>
        
        <div className="w-full max-w-[360px] mx-auto relative z-10">
          <div className="auth-card text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold auth-text mb-2">Invalid Invitation</h1>
            <p className="auth-text-muted mb-6">{tokenError}</p>
            <ActionButton
              label="Go to Login"
              onClick={() => navigate('/login')}
              size="sm"
              actionType="auth"
            />
          </div>
        </div>
      </div>
    )
  }

  if (!invitation) {
    return null
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
        className="w-full max-w-[420px] mx-auto relative z-10"
        onKeyDown={handleKeyDown}
      >
        {/* Centered Logo Above Form */}
        <AuthLogo />

        <div className="auth-card">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="gradient-header" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative"
            >

              <h1 className="text-4xl font-bold auth-text mb-4 relative">You&apos;re Invited!</h1>
              
              {/* Invitation Details Card */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-[#14BDEA]/20 rounded-full flex items-center justify-center">
                    <Building className="w-6 h-6 text-[#14BDEA]" />
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold auth-text mb-2">{invitation.organizationName}</h2>
                <p className="auth-text-muted text-sm mb-4">
                  {invitation.inviterName} has invited you to join as a{' '}
                  <span className="font-semibold text-[#14BDEA]">{invitation.roleName}</span>
                </p>
                
                <div className="flex items-center justify-center space-x-4 text-xs auth-text-muted">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-3 h-3" />
                    <span>{invitation.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{invitation.roleName}</span>
                  </div>
                </div>
              </div>
              
              <p className="auth-text-muted text-lg font-medium">Complete your account setup</p>
            </motion.div>
          </div>

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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pre-filled Email (Read-only) */}
            <div>
              <label htmlFor="email" className="auth-label">Email Address</label>
              <div className="input-container">
                <Mail className="input-icon-left text-green-400" />
                <input
                  id="email"
                  type="email"
                  value={invitation.email}
                  disabled
                  className="auth-input input-with-icon-left input-with-icon-right bg-green-500/5 border-green-500/20 text-white/70"
                />
                <Check className="input-icon-right text-green-400" />
              </div>
              <p className="mt-1 text-xs text-green-400">Verified from invitation</p>
            </div>

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
                defaultCountry="US"
                showValidation={false}
                required
                className="auth-phone-input"
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
                Create Password
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
                  placeholder="Create a secure password"
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

            {/* Submit Button */}
            <ActionButton
              label={isSubmitting ? 'Joining Organization...' : `Join ${invitation.organizationName}`}
              onClick={handleButtonClick}
              disabled={!isFormValid()}
              icon={ArrowRight}
              loading={isSubmitting}
              size="sm"
              animated={false}
              actionType="auth"
              className="mt-8 w-full"
            />

            {/* Terms */}
            <div className="text-center">
              <p className="text-sm auth-text-muted">
                By joining, you accept the organization&apos;s terms and Round&apos;s{' '}
                <a href="/terms" className="auth-link">terms of service</a>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}