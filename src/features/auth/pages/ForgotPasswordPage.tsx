import { motion } from 'framer-motion'
import { Mail, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ActionButton, AuthLogo } from '@/shared/components'

import type { ValidationError } from '@/shared/utils/validation'
import {
  validateEmail,
  getFieldError,
  hasFieldError,
} from '@/shared/utils/validation'
import { apiClient } from '@/shared/services/apiClient'

export const ForgotPasswordPage = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [apiError, setApiError] = useState('')

  // Form validation helper
  const isFormValid = () => {
    const emailValidation = validateEmail(email)
    return emailValidation.isValid && email.trim() !== ''
  }

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isFormValid()) {
      e.preventDefault()
      handleSubmit(e as React.FormEvent)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setEmail(value)

    // Clear field error when user starts typing
    if (hasFieldError(errors, 'email')) {
      setErrors(prev => prev.filter(error => error.field !== 'email'))
    }
    setApiError('')
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { value } = e.target
    
    if (value.trim() !== '') {
      const emailValidation = validateEmail(value)
      if (!emailValidation.isValid && emailValidation.errors.length > 0) {
        setErrors(prev => {
          const filtered = prev.filter(error => error.field !== 'email')
          return [...filtered, emailValidation.errors[0]]
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setApiError('')

    // Validate email
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      setErrors(emailValidation.errors)
      setIsSubmitting(false)
      return
    }

    try {
      const response = await apiClient.forgotPassword(email.trim())

      if (response.success) {
        setIsSuccess(true)
      } else {
        setApiError(response.error ?? 'Failed to send password reset email')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      setApiError('An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleButtonClick = () => {
    if (!isSuccess) {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent
      handleSubmit(fakeEvent)
    }
  }

  const handleBackToLogin = () => {
    navigate('/login')
  }

  const handleTryAgain = () => {
    setIsSuccess(false)
    setIsSubmitting(false)
    setEmail('')
    setErrors([])
    setApiError('')
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
          <div className="text-center mb-6 sm:mb-8">
            <div className="gradient-header" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative"
            >
              {!isSuccess ? (
                <>
                  <h1 className="text-xl md:text-2xl lg:text-xl font-bold auth-text mb-2 md:mb-3 lg:mb-2 relative">
                    Forgot Password?
                  </h1>
                  <p className="auth-text-muted text-sm md:text-base lg:text-sm font-medium">
                    Enter your email address and we&apos;ll send you a link to reset your password
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h1 className="text-xl md:text-2xl lg:text-xl font-bold auth-text mb-2 md:mb-3 lg:mb-2 relative">
                    Check Your Email
                  </h1>
                  <p className="auth-text-muted text-sm md:text-base lg:text-sm font-medium">
                    We&apos;ve sent a password reset link to <strong className="text-white">{email}</strong>
                  </p>
                </>
              )}
            </motion.div>
          </div>

          {!isSuccess ? (
            <>
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

              {/* Forgot Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
                      value={email}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      placeholder="example@gmail.com"
                      className={`auth-input input-with-icon-left ${hasFieldError(errors, 'email') ? 'auth-input-error' : ''}`}
                      required
                      autoComplete="email"
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

                {/* Submit Button */}
                <ActionButton
                  label={isSubmitting ? 'Sending...' : 'Send Reset Link'}
                  onClick={handleButtonClick}
                  disabled={!isFormValid()}
                  icon={ArrowRight}
                  loading={isSubmitting}
                  size="sm"
                  animated={false}
                  actionType="auth"
                  className="mt-8 w-full"
                />

                {/* Back to Login */}
                <div className="text-center">
                  <Link
                    to="/login"
                    className="auth-link text-sm brand-primary inline-flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Sign In</span>
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="text-green-400 text-sm font-medium">
                    <p>We&apos;ve sent you a secure password reset link that will expire in <strong>1 hour</strong>.</p>
                    <p className="mt-2">Check your spam folder if you don&apos;t see the email in your inbox.</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <ActionButton
                    label="Back to Sign In"
                    onClick={handleBackToLogin}
                    icon={ArrowLeft}
                    size="sm"
                    animated={false}
                    actionType="auth"
                    className="w-full"
                  />
                  
                  <button
                    type="button"
                    onClick={handleTryAgain}
                    className="w-full text-center auth-link text-sm brand-primary py-2"
                  >
                    Send to a different email
                  </button>
                </div>

                {/* Help Text */}
                <div className="text-center">
                  <p className="auth-text-muted text-sm">
                    Didn&apos;t receive the email?{' '}
                    <button
                      type="button"
                      onClick={handleTryAgain}
                      className="auth-link brand-primary"
                    >
                      Try again
                    </button>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}