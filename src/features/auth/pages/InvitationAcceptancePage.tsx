import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Users, Building, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useAsyncAction, useForm, usePhoneValidation } from '@/shared/hooks'
import { useAuth } from '@/shared/hooks/useAuth'
import { teamService } from '@/shared/services/api'
import type { ValidateInvitationResponse } from '@/shared/services/api'
import { ActionButton } from '@/shared/ui/ActionButton'
import { AuthLogo } from '@/shared/ui/AuthLogo'
import { PlainButton } from '@/shared/ui/Button'
import { PasswordStrengthIndicator } from '@/shared/ui/PasswordStrengthIndicator'
import { PhoneInput } from '@/shared/ui/PhoneInput'
import { handleApiError } from '@/shared/utils/errorHandler'
import { validators } from '@/shared/utils/validators'

export const InvitationAcceptancePage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [showPassword, setShowPassword] = useState(false)
  
  // Use usePhoneValidation hook for phone field with async validation
  const { 
    phoneData, 
    phoneError, 
    handlePhoneChange, 
    handlePhoneBlur,
    validatePhone,
  } = usePhoneValidation('US') // Default country US
  
  const { execute, loading: isSubmitting } = useAsyncAction()
  const [isValidatingToken, setIsValidatingToken] = useState(true)
  const [apiError, setApiError] = useState('')
  const [invitation, setInvitation] = useState<ValidateInvitationResponse | null>(null)
  const [tokenError, setTokenError] = useState('')

  // Use useForm hook for firstName, lastName, password
  const { values, errors, handleChange, handleBlur, validateAll } = useForm(
    {
      firstName: '',
      lastName: '',
      password: '',
    },
    {
      firstName: (value) => validators.required(value, 'First name'),
      lastName: (value) => validators.required(value, 'Last name'),
      password: validators.password,
    }
  )

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
  const isFormValid = values.firstName.trim() !== '' &&
      values.lastName.trim() !== '' &&
      phoneData.phone.trim() !== '' &&
      values.password.trim() !== '' &&
      !errors.firstName && !errors.lastName && !errors.password && !phoneError

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')

    if (!invitation || !token) {
      setApiError('Invalid invitation')
      return
    }

    // Validate all fields
    const isFormValid = validateAll()
    
    // Validate phone using the hook
    const isPhoneValid = validatePhone()

    if (!isFormValid || !isPhoneValid) {
      return
    }

    await execute(async () => {
      const registrationRequest = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: invitation.email,
        password: values.password,
        phoneNumber: phoneData.phone.trim(),
        countryPhoneCode: phoneData.countryPhoneCode,
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
      }
    }, {
      onError: (error) => {
        const message = handleApiError(error, 'Registration')
        setApiError(message)
      }
    })
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
              <AlertCircle className="w-8 h-8 text-[#D417C8]" />
            </div>
            <h1 className="text-2xl font-medium tracking-tight auth-text mb-2">Invalid Invitation</h1>
            <p className="auth-text-muted mb-6">{tokenError}</p>
            <ActionButton
              label="Go to Login"
              onClick={() => navigate('/login')}
              size="md"
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

              <h1 className="text-4xl font-medium tracking-tight auth-text mb-4 relative">You&apos;re Invited!</h1>
              
              {/* Invitation Details Card */}
              <div className="bg-white/5 rounded-lg border border-white/10 p-6 mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-[#14BDEA]/20 rounded-full flex items-center justify-center">
                    <Building className="w-6 h-6 text-[#14BDEA]" />
                  </div>
                </div>
                
                <h2 className="text-xl font-medium tracking-tight auth-text mb-2">{invitation.organizationName}</h2>
                <p className="auth-text-muted text-sm mb-4">
                  {invitation.inviterName} has invited you to join as a{' '}
                  <span className="font-medium text-[#14BDEA] tracking-tight">{invitation.roleName}</span>
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
              <div className="flex items-center space-x-2 text-[#D417C8]">
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
                    value={values.firstName}
                    onChange={handleChange('firstName')}
                    onBlur={handleBlur('firstName')}
                    placeholder="John"
                    className={`auth-input input-with-icon-left ${errors.firstName ? 'auth-input-error' : ''}`}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.firstName}
                    aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                  />
                </div>
                {errors.firstName && (
                  <motion.div
                    id="firstName-error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                    role="alert"
                    aria-live="polite"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.firstName}</span>
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
                    value={values.lastName}
                    onChange={handleChange('lastName')}
                    onBlur={handleBlur('lastName')}
                    placeholder="Doe"
                    className={`auth-input input-with-icon-left ${errors.lastName ? 'auth-input-error' : ''}`}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.lastName}
                    aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                  />
                </div>
                {errors.lastName && (
                  <motion.div
                    id="lastName-error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                    role="alert"
                    aria-live="polite"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.lastName}</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Phone Number */}
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
                defaultCountry="US"
                showValidation={false}
                required
                className="auth-phone-input"
              />
              {phoneError && (
                <motion.div
                  id="phone-error"
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
                Create Password
              </label>
              <div className="input-container">
                <Lock className="input-icon-left auth-icon-primary" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={values.password}
                  onChange={handleChange('password')}
                  onBlur={handleBlur('password')}
                  placeholder="Create a secure password"
                  className={`auth-input input-with-icon-left input-with-icon-right ${errors.password ? 'auth-input-error' : ''}`}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <PlainButton
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="input-icon-right auth-icon hover:text-gray-600 transition-colors"
                  unstyled
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </PlainButton>
              </div>

              {/* Password Strength Indicator */}
              {values.password && (
                <div className="mt-3">
                  <PasswordStrengthIndicator 
                    password={values.password}
                    showStrengthBar
                  />
                </div>
              )}

              {errors.password && (
                <motion.div
                  id="password-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                  role="alert"
                  aria-live="polite"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <ActionButton
              type="submit"
              label={isSubmitting ? 'Joining Organization...' : `Join ${invitation.organizationName}`}
              disabled={!isFormValid}
              icon={ArrowRight}
              loading={isSubmitting}
              size="md"
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

