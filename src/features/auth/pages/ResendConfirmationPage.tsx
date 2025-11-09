import { motion } from 'framer-motion'
import { Mail, ArrowLeft, AlertCircle, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { ActionButton } from '@/shared/components'
import { useAsyncAction, useForm } from '@/shared/hooks'
import { apiClient } from '@/shared/services/apiClient'
import { validators, handleApiError } from '@/shared/utils'

export const ResendConfirmationPage = () => {
  const { loading: isSubmitting, execute } = useAsyncAction()
  const [apiError, setApiError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Use form hook for validation
  const { values, errors, handleChange, handleBlur, validateAll, resetForm } = useForm(
    { email: '' },
    {
      email: (value: string) => {
        if (!value.trim()) {
          return { valid: false, message: 'Email is required' }
        }
        return validators.emailWithMessage(value)
      },
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    setSuccessMessage('')

    if (!validateAll()) {
      return
    }

    await execute(async () => {
      const response = await apiClient.resendConfirmationEmail(values.email)

      if (response.success) {
        setSuccessMessage(response.message ?? 'Confirmation email sent successfully!')
        resetForm()
      } else {
        setApiError(response.error ?? 'Failed to resend confirmation email')
      }
    }, {
      onError: (error) => {
        const message = handleApiError(error, 'ResendConfirmation')
        setApiError(message)
      }
    })
  }

  const isFormValid = values.email.trim() !== '' && !errors.email

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
            <div className="flex items-center space-x-2 text-[#D417C8]">
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
                value={values.email}
                onChange={handleChange('email')}
                onBlur={handleBlur('email')}
                placeholder="Enter your email"
                className={`auth-input input-with-icon-left ${errors.email ? 'auth-input-error' : ''}`}
                required
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
            </div>
            {errors.email && (
              <motion.div
                id="email-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                role="alert"
                aria-live="polite"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{errors.email}</span>
              </motion.div>
            )}
          </div>

          <ActionButton
            type="submit"
            label={isSubmitting ? 'Sending...' : 'Send Confirmation Email'}
            disabled={!isFormValid || isSubmitting}
            icon={ArrowRight}
            loading={isSubmitting}
            size="md"
            animated={false}
            actionType="auth"
            className="w-full"
          />
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
