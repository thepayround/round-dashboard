import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ActionButton, AuthLogo } from '@/shared/components'

import type { ValidationError } from '@/shared/utils/validation'
import {
  validateLoginForm,
  getFieldError,
  hasFieldError,
  validateEmail,
  validatePassword,
} from '@/shared/utils/validation'
import { apiClient } from '@/shared/services/apiClient'
import { useAuth } from '@/shared/hooks/useAuth'

export const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Handle success message from navigation state (e.g., from password reset)
  useEffect(() => {
    const state = location.state as { message?: string; email?: string }
    if (state?.message) {
      setSuccessMessage(state.message)
      if (state.email) {
        setFormData(prev => ({ ...prev, email: state.email! }))
      }
      // Clear the state to prevent showing the message again on refresh
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state, location.pathname, navigate])

  // Form validation helper
  const isFormValid = () => {
    const validation = validateLoginForm(formData)
    return validation.isValid && formData.email.trim() !== '' && formData.password.trim() !== ''
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
    setApiError('')
    setSuccessMessage('')
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Validate field when user leaves it
    if (name === 'email') {
      const emailValidation = validateEmail(value)
      if (!emailValidation.isValid) {
        setErrors(prev => [
          ...prev.filter(error => error.field !== 'email'),
          ...emailValidation.errors,
        ])
      }
    } else if (name === 'password') {
      const passwordValidation = validatePassword(value)
      if (!passwordValidation.isValid) {
        setErrors(prev => [
          ...prev.filter(error => error.field !== 'password'),
          ...passwordValidation.errors,
        ])
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setApiError('')

    // Final validation check before submission
    const validation = validateLoginForm(formData)

    if (!validation.isValid) {
      setErrors(validation.errors)
      setIsSubmitting(false)
      return
    }

    setErrors([])

    try {
      // Call real API
      const response = await apiClient.login(formData)

      if (response.success && response.data) {
        // Log the user in
        login(response.data.user, response.data.accessToken)

        // Navigate to intended destination or get-started page
        const from =
          (location.state as { from?: { pathname?: string } })?.from?.pathname ?? '/get-started'
        navigate(from, { replace: true })
      } else {
        setApiError(response.error ?? 'Login failed')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Login error:', error)
      setApiError('An unexpected error occurred. Please try again.')
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
              <h1 className="text-xl md:text-2xl lg:text-xl font-bold auth-text mb-2 md:mb-3 lg:mb-2 relative">Welcome Back</h1>
              <p className="auth-text-muted text-sm md:text-base lg:text-sm font-medium">Sign in to your Round account</p>
            </motion.div>
          </div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 mb-6"
          >
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{successMessage}</span>
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
            {apiError.toLowerCase().includes('email') &&
              apiError.toLowerCase().includes('confirm') && (
                <div className="mt-3 pt-3 border-t border-red-500/20">
                  <Link
                    to="/auth/resend-confirmation"
                    className="text-sm text-red-300 hover:text-red-200 underline"
                  >
                    Resend confirmation email
                  </Link>
                </div>
              )}
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-5 lg:space-y-4">
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
                placeholder="Enter your password"
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
            
            {/* Forgot Password - positioned right under password input */}
            <div className="text-right mt-2">
              <Link to="/auth/forgot-password" className="auth-link text-sm brand-primary">
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <ActionButton
            label={isSubmitting ? 'Signing In...' : 'Sign In'}
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
            <button
              type="button"
              className="w-full h-12 px-4 py-2 
                         bg-white/8 backdrop-blur-sm border border-white/15 rounded-lg
                         text-white font-semibold text-sm
                         hover:bg-white/12 hover:border-white/20
                         transition-all duration-200 ease-out
                         flex items-center justify-center gap-2.5
                         relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12" />
              <svg className="w-4 h-4 z-10" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="z-10">Google</span>
            </button>

            <button
              type="button"
              className="w-full h-12 px-4 py-2 
                         bg-white/8 backdrop-blur-sm border border-white/15 rounded-lg
                         text-white font-semibold text-sm
                         hover:bg-white/12 hover:border-white/20
                         transition-all duration-200 ease-out
                         flex items-center justify-center gap-2.5
                         relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12" />
              <svg className="w-4 h-4 z-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="z-10">Facebook</span>
            </button>
          </div>

          {/* Links */}
          <div className="text-center space-y-4">
            <p className="auth-text-muted">
              Don&apos;t have an account?{' '}
              <Link to="/auth/register" className="auth-link brand-primary">
                Create account
              </Link>
            </p>
          </div>
        </form>
        </div>
      </motion.div>
    </div>
  )
}
