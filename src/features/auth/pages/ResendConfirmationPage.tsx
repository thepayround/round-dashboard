import { motion } from 'framer-motion'
import { Mail, ArrowLeft, AlertCircle, ArrowRight, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useAsyncAction, useForm } from '@/shared/hooks'
import { apiClient } from '@/shared/services/apiClient'
import { Button } from '@/shared/ui/shadcn/button'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
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

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
          delay: 0.2,
        }}
        className="bg-white/[0.02] border border-border rounded-lg p-6 relative overflow-hidden z-10 transition-all duration-150"
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
            className="p-4 rounded-lg bg-success/10 border border-success/20 mb-6"
          >
            <div className="flex items-center space-x-2 text-success">
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
            className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 mb-6"
          >
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{apiError}</span>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-white/90 text-sm mb-2 block">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                id="email"
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange('email')}
                onBlur={handleBlur('email')}
                placeholder="Enter your email"
                className="pl-10"
              />
            </div>
            {errors.email && (
              <div className="mt-1.5 flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send Confirmation Email
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-8">
          <Link
            to="/login"
            className="text-auth-primary/90 font-medium no-underline transition-all duration-300 hover:text-auth-primary hover:-translate-y-px inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
