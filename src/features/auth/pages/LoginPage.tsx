import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ActionButton, AuthLogo } from '@/shared/components'
import { GoogleLoginButton } from '../components/GoogleLoginButton'
import { useGlobalToast } from '@/shared/contexts/ToastContext'

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
  const { showSuccess, showError } = useGlobalToast()

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle success message from navigation state (e.g., from password reset)
  useEffect(() => {
    const state = location.state as { message?: string; email?: string }
    if (state?.message) {
      showSuccess(state.message)
      if (state.email) {
        setFormData(prev => ({ ...prev, email: state.email! }))
      }
      // Clear the state to prevent showing the message again on refresh
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state, location.pathname, navigate, showSuccess])

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
        showError(response.error ?? 'Login failed')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Login error:', error)
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
              <h1 className="text-xl md:text-2xl lg:text-xl font-medium tracking-tight auth-text mb-2 md:mb-3 lg:mb-2 relative">Welcome Back</h1>
              <p className="auth-text-muted text-sm md:text-base lg:text-sm font-medium">Sign in to your Round account</p>
            </motion.div>
          </div>


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
            <GoogleLoginButton
              accountType="business"
              onSuccess={() => showSuccess('Successfully signed in with Google!')}
              onError={(error) => showError(error)}
            />

            <button
              type="button"
              className="w-full h-11 md:h-9 px-4 py-1.5 
                         bg-white/6 border border-white/10 rounded-lg
                         text-white font-light text-xs
                         hover:bg-white/8 hover:border-white/15
                         transition-all duration-150 ease-out
                         flex items-center justify-center gap-2
                         relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform -skew-x-12" />
              <svg className="w-5 h-5 z-10" fill="currentColor" viewBox="0 0 24 24">
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
