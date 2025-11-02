import { motion } from 'framer-motion'
import { Mail, RefreshCw, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { apiClient } from '@/shared/services/apiClient'

export const ConfirmationPendingPage = () => {
  const location = useLocation()
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const [resendSuccess, setResendSuccess] = useState(false)

  // Get email and account type from navigation state
  const email = location.state?.email || ''
  const _accountType = location.state?.accountType || 'personal'
  const hasBusinessData = location.state?.hasBusinessData || false

  const handleResendEmail = async () => {
    if (!email) {
      setResendMessage('Email address not available. Please try registering again.')
      return
    }

    setIsResending(true)
    setResendMessage('')
    setResendSuccess(false)

    try {
      const response = await apiClient.resendConfirmationEmail(email)

      if (response.success) {
        setResendSuccess(true)
        setResendMessage('Confirmation email sent successfully! Please check your inbox.')
      } else {
        setResendMessage(response.error ?? 'Failed to resend confirmation email. Please try again.')
      }
    } catch (error) {
      console.error('Resend email error:', error)
      setResendMessage('An unexpected error occurred. Please try again.')
    } finally {
      setIsResending(false)
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
            <h1 className="text-4xl font-medium tracking-tight auth-text mb-4 relative">Check Your Email</h1>
            <p className="auth-text-muted text-lg font-medium">
              We&apos;ve sent you a confirmation link
            </p>
          </motion.div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center"
        >
          {/* Email Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5, type: 'spring' }}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-medium tracking-tight auth-text mb-4">Registration Successful!</h2>
            <p className="auth-text-muted mb-4">We&apos;ve sent a confirmation email to:</p>
            <p className="text-lg font-medium text-[#D417C8] mb-6">
              {email || 'your email address'}
            </p>
            <p className="auth-text-muted text-sm">
              Click the link in the email to confirm your account
              {hasBusinessData ? ' and set up your business profile' : ''} and get started with
              Round.
            </p>
            {hasBusinessData && (
              <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-accent/20">
                <p className="text-sm text-[#32A1E4] font-medium">
                  🏢 Your business information has been saved and will be set up automatically after
                  email confirmation.
                </p>
              </div>
            )}
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="p-6 rounded-lg bg-primary/10 border border-white/10 mb-8"
          >
            <h3 className="text-lg font-medium tracking-tight auth-text mb-4">What to do next:</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#D417C8] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-medium tracking-tight">1</span>
                </div>
                <p className="auth-text-muted text-sm">
                  Check your email inbox (and spam folder if needed)
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#14BDEA] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-medium tracking-tight">2</span>
                </div>
                <p className="auth-text-muted text-sm">
                  Click the &quot;Confirm Email&quot; button in the email
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#7767DA] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-medium tracking-tight">3</span>
                </div>
                <p className="auth-text-muted text-sm">
                  {hasBusinessData
                    ? "Your business account will be automatically set up and you'll be redirected to your dashboard"
                    : "You'll be redirected to complete your setup"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Resend Email Section */}
          {resendMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border mb-6 ${
                resendSuccess
                  ? 'bg-green-500/10 border-green-500/20'
                  : 'bg-red-500/10 border-red-500/20'
              }`}
            >
              <p className={`text-sm ${resendSuccess ? 'text-green-400' : 'text-[#D417C8]'}`}>
                {resendMessage}
              </p>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="space-y-4"
          >
            <div className="text-center">
              <p className="auth-text-muted text-sm mb-4">Didn&apos;t receive the email?</p>
              <button
                onClick={handleResendEmail}
                disabled={isResending || !email}
                className={`btn-secondary flex items-center space-x-2 mx-auto ${
                  isResending || !email ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isResending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                <span>{isResending ? 'Sending...' : 'Resend Email'}</span>
              </button>
            </div>

            <div className="flex items-center justify-center">
              <Link
                to="/login"
                className="auth-link brand-primary flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
