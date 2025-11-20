import { motion } from 'framer-motion'
import { Mail, ArrowLeft, AlertCircle, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useAsyncAction, useForm } from '@/shared/hooks'
import { apiClient } from '@/shared/services/apiClient'
import { Input } from '@/shared/ui'
import { ActionButton } from '@/shared/ui/ActionButton'
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
        className="bg-white/[0.02] border border-white/10 rounded-lg p-5 md:p-6 lg:p-7 relative overflow-hidden z-10 transition-all duration-150"
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
            <h1 className="text-4xl font-medium tracking-tight text-white mb-4 relative">Resend Confirmation</h1>
            <p className="text-white/85 text-lg font-medium">
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
            <div className="flex items-center space-x-2 text-primary">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{apiError}</span>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="email"
            label="Email Address"
            leftIcon={Mail}
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            placeholder="Enter your email"
            error={errors.email}
            required
          />

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
            className="text-auth-primary/90 font-semibold no-underline transition-all duration-300 hover:text-auth-primary hover:-translate-y-px inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
