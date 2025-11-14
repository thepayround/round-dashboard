import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Mail, RefreshCw, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'

import { useAuth as useAuthAPI, useOrganization } from '@/shared/hooks/api'
import { useAuth } from '@/shared/hooks/useAuth'
import { organizationService } from '@/shared/services/api'
import type { User } from '@/shared/types/auth'
import { Button } from '@/shared/ui/Button'

export const EmailConfirmationPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  const { confirmEmailAndLogin, resendConfirmationEmail: _resendConfirmationEmail } = useAuthAPI()
  const { create: createOrganization } = useOrganization()

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  // Get userId and token from URL parameters
  const userId = searchParams.get('userId')
  const token = searchParams.get('token')

  useEffect(() => {
    const confirmEmail = async () => {
      if (!userId || !token) {
        setStatus('error')
        setMessage('Invalid confirmation link. Please check your email and try again.')
        return
      }

      // Helper function to create business organization after email confirmation
      const createBusinessOrganization = async (
        userId: string,
        businessData: Record<string, unknown>
      ) => {
        try {
          const companyInfo = businessData.companyInfo as Record<string, unknown>
          const billingAddress = businessData.billingAddress as Record<string, unknown> | undefined
          
          // Create organization with proper field mapping
          const orgResponse = await createOrganization({
            name: (companyInfo?.companyName as string) ?? '',
            description: (companyInfo?.description as string) ?? '',
            website: (companyInfo?.website as string) ?? '',
            size: companyInfo?.employeeCount?.toString() ?? '',
            revenue: 0, // Default value
            category: (companyInfo?.industry as string) ?? 'business', // Default to 'business' 
            type: (companyInfo?.businessType as string) ?? '',
            registrationNumber: (companyInfo?.registrationNumber as string) ?? '',
            currency: (companyInfo?.currency as string) ?? '',
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            country: (billingAddress?.country as string) ?? '', 
            userId,
            fiscalYearStart: 'January', // Default fiscal year start
          })

          if (orgResponse.success && orgResponse.data) {
            
            // Create organization address if billing address exists
            if (billingAddress && orgResponse.data.organizationId) {
              try {
                const addressData = {
                  name: 'Business Address',
                  addressLine1: (billingAddress.street as string) ?? '',
                  addressLine2: (billingAddress.street2 as string) ?? '',
                  number: '', // We don't collect building number separately
                  city: (billingAddress.city as string) ?? '',
                  state: (billingAddress.state as string) ?? '',
                  country: (billingAddress.country as string) ?? '',
                  zipCode: (billingAddress.zipCode as string) ?? '',
                  addressType: 'billing' as const,
                  isPrimary: true,
                }
                
                const addressResult = await organizationService.createOrganizationAddress(
                  orgResponse.data.organizationId,
                  addressData
                )
                
                if (addressResult.success) {
                  // Address created successfully
                } else {
                  console.error('Organization address creation failed:', addressResult.error)
                  // Don't fail the whole flow for address creation failure
                }
              } catch (addressError) {
                console.error('Error creating organization address:', addressError)
                // Don't fail the whole flow for address creation failure
              }
            }
          } else {
            console.error('Organization creation failed:', orgResponse.error)
          }
        } catch (error) {
          console.error('Error creating business organization:', error)
          throw error
        }
      }

      try {
        // Use the new confirmEmailAndLogin method for automatic login
        const response = await confirmEmailAndLogin(userId, token)

        if (response.success && 'data' in response && response.data) {
          setStatus('success')
          const successMessage =
            'message' in response && response.message
              ? response.message
              : 'Email confirmed and logged in successfully!'
          setMessage(successMessage)

          // Automatically log in the user
          login(response.data.user as User, response.data.accessToken, response.data.refreshToken)

          // Check if there's pending business data to process
          const pendingBusinessData = localStorage.getItem('pendingBusinessData')
          if (pendingBusinessData) {
            try {
              const businessData = JSON.parse(pendingBusinessData)
              await createBusinessOrganization(response.data.user.id, businessData)
              localStorage.removeItem('pendingBusinessData')
            } catch (error) {
              console.error('Failed to create business organization:', error)
              // Don't fail the whole flow, user is still logged in
            }
          }

          // Redirect to get-started page after 2 seconds
          setTimeout(() => {
            navigate('/get-started')
          }, 2000)
        } else {
          console.error(
            'Email confirmation failed:',
            'error' in response ? response.error : 'Unknown error'
          )
          setStatus('error')
          const errorMessage =
            'error' in response && response.error
              ? response.error
              : 'Email confirmation failed. Please try again.'
          setMessage(errorMessage)
        }
      } catch (error) {
        console.error('Email confirmation error:', error)
        setStatus('error')
        setMessage('An unexpected error occurred. Please try again.')
      }
    }

    confirmEmail()
  }, [userId, token, navigate, login, confirmEmailAndLogin, createOrganization])

  const handleResendEmail = async () => {
    if (!userId) {
      setResendMessage('Cannot resend email: missing user information')
      return
    }

    setIsResending(true)
    setResendMessage('')

    try {
      // We need the email address to resend confirmation
      // For now, we'll ask the user to go to login page
      setResendMessage('Please go to the login page and request a new confirmation email.')
    } catch (error) {
      console.error('Resend email error:', error)
      setResendMessage('Failed to resend email. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border border-[#D417C8] border-t-transparent rounded-full"
              />
            </div>
            <h2 className="text-2xl font-medium tracking-tight auth-text mb-4">Confirming Your Email</h2>
            <p className="auth-text-muted">Please wait while we confirm your email address...</p>
          </motion.div>
        )

      case 'success':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
              className="flex justify-center mb-6"
            >
              <CheckCircle className="w-16 h-16 text-green-500" />
            </motion.div>
            <h2 className="text-2xl font-medium tracking-tight auth-text mb-4">Email Confirmed!</h2>
            <p className="auth-text-muted mb-6">{message}</p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 mb-6"
            >
              <p className="text-green-400 text-sm">
                π‰ Welcome to Round! You&apos;re now logged in and will be redirected to get started
                in a few seconds...
              </p>
            </motion.div>

            <Link to="/get-started" className="btn-primary inline-flex items-center space-x-2">
              <span>Get Started</span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              >
                β†’
              </motion.span>
            </Link>
          </motion.div>
        )

      case 'error':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
              className="flex justify-center mb-6"
            >
              <XCircle className="w-16 h-16 text-red-500" />
            </motion.div>
            <h2 className="text-2xl font-medium tracking-tight auth-text mb-4">Confirmation Failed</h2>
            <p className="auth-text-muted mb-6">{message}</p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-6"
            >
              <div className="flex items-center space-x-2 text-[#D417C8]">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">
                  The confirmation link may have expired or is invalid.
                </span>
              </div>
            </motion.div>

            {resendMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-6"
              >
                <div className="flex items-center space-x-2 text-blue-400">
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">{resendMessage}</span>
                </div>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleResendEmail}
                disabled={isResending}
                variant="secondary"
                size="md"
                icon={isResending ? RefreshCw : Mail}
                iconPosition="left"
                loading={isResending}
              >
                {isResending ? 'Sending...' : 'Get Help'}
              </Button>

              <Link
                to="/login"
                className="btn-primary inline-flex items-center justify-center"
              >
                Back to Login
              </Link>
            </div>
          </motion.div>
        )

      default:
        return null
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
            <h1 className="text-4xl font-medium tracking-tight auth-text mb-4 relative">Email Confirmation</h1>
            <p className="auth-text-muted text-lg font-medium">Verifying your email address</p>
          </motion.div>
        </div>

        {/* Content */}
        {renderContent()}
      </motion.div>
    </div>
  )
}

