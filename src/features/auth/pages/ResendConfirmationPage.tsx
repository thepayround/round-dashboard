import { motion } from 'framer-motion'
import { Mail, ArrowLeft, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import type { ValidationError } from '@/shared/utils/validation'
import { validateEmail, hasFieldError, getFieldError } from '@/shared/utils/validation'
import { apiClient } from '@/shared/services/apiClient'

export const ResendConfirmationPage = () => {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setEmail(value)
    setApiError('')
    setSuccessMessage('')

    // Clear field error when user starts typing
    if (hasFieldError(errors, 'email')) {
      setErrors(prev => prev.filter(error => error.field !== 'email'))
    }
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { value } = e.target
    const emailValidation = validateEmail(value)
    if (!emailValidation.isValid) {
      setErrors(prev => [
        ...prev.filter(error => error.field !== 'email'),
        ...emailValidation.errors,
      ])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setApiError('')
    setSuccessMessage('')

    // Validate email
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      setErrors(emailValidation.errors)
      setIsSubmitting(false)
      return
    }

    setErrors([])

    try {
      const response = await apiClient.resendConfirmationEmail(email)

      if (response.success) {
        setSuccessMessage(response.message ?? 'Confirmation email sent successfully!')
        setEmail('')
      } else {
        setApiError(response.error ?? 'Failed to resend confirmation email')
      }
    } catch (error) {
      console.error('Resend confirmation error:', error)
      setApiError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
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
        className="auth-card"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="gradient-header" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative"
          >
            <h1 className="text-4xl font-medium tracking-tight auth-text mb-4 relative">Resend Confirmation</h1>
            <p className="auth-text-muted text-lg font-medium">
              Enter your email to receive a new confirmation link
            </p>
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
              <Mail className="w-5 h-5" />
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
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Enter your email address"
                className={`auth-input input-with-icon-left ${
                  hasFieldError(errors, 'email') ? 'auth-input-error' : ''
                }`}
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

          <button
            type="submit"
            disabled={isSubmitting || !email.trim()}
            className={`w-full btn-primary ${
              isSubmitting || !email.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className="flex items-center justify-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>{isSubmitting ? 'Sending...' : 'Send Confirmation Email'}</span>
            </span>
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-8">
          <Link
            to="/login"
            className="auth-link brand-primary inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
