import { motion } from 'framer-motion'
import { Mail, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useForgotPasswordController } from '../hooks/useForgotPasswordController'

import { Input } from '@/shared/ui'
import { ActionButton } from '@/shared/ui/ActionButton'
import { AuthLogo } from '@/shared/ui/AuthLogo'
import { Button } from '@/shared/ui/Button'

export const ForgotPasswordPage = () => {
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    handleBackToLogin,
    handleTryAgain,
    isSubmitting,
    apiError,
    isSuccess,
    isFormValid,
  } = useForgotPasswordController()

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
        className="w-full max-w-[360px] mx-auto relative z-10"
      >
        {/* Centered Logo Above Form */}
        <AuthLogo />

        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-5 md:p-6 lg:p-7 relative overflow-hidden z-10 transition-all duration-150">
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
                  <h1 className="text-xl md:text-2xl lg:text-xl font-medium tracking-tight text-white mb-2 md:mb-3 lg:mb-2 relative">
                    Forgot Password?
                  </h1>
                  <p className="text-white/85 text-sm md:text-base lg:text-sm font-medium">
                    Enter your email address and we&apos;ll send you a link to reset your password
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center">
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
                  <h1 className="text-xl md:text-2xl lg:text-xl font-medium tracking-tight text-white mb-2 md:mb-3 lg:mb-2 relative">
                    Check Your Email
                  </h1>
                  <p className="text-white/85 text-sm md:text-base lg:text-sm font-medium">
                    We&apos;ve sent a password reset link to <strong className="text-white">{values.email}</strong>
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
                  <div className="flex items-center space-x-2 text-primary">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{apiError}</span>
                  </div>
                </motion.div>
              )}

              {/* Forgot Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Email Address */}
                <Input
                  id="email"
                  label="Email Address"
                  leftIcon={Mail}
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange('email')}
                  onBlur={handleBlur('email')}
                  placeholder="example@email.com"
                  error={errors.email}
                  required
                  autoComplete="email"
                />

                {/* Submit Button */}
                <ActionButton
                  type="submit"
                  label={isSubmitting ? 'Sending...' : 'Send Reset Link'}
                  disabled={!isFormValid || isSubmitting}
                  icon={ArrowRight}
                  loading={isSubmitting}
                  size="md"
                  animated={false}
                  actionType="auth"
                  className="mt-8 w-full"
                />

                {/* Back to Login */}
                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-auth-primary/90 text-sm font-semibold no-underline transition-all duration-300 hover:text-auth-primary hover:-translate-y-px inline-flex items-center space-x-2"
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
                    size="md"
                    animated={false}
                    actionType="auth"
                    className="w-full"
                  />
                  
                  <Button
                    type="button"
                    onClick={handleTryAgain}
                    variant="ghost"
                    size="md"
                    className="w-full"
                  >
                    Send to a different email
                  </Button>
                </div>

                {/* Help Text */}
                <div className="text-center">
                  <p className="text-white/85 text-sm">
                    Didn&apos;t receive the email?{' '}
                    <Button
                      type="button"
                      onClick={handleTryAgain}
                      variant="ghost"
                      size="sm"
                      className="inline-flex h-auto px-0 py-0 text-primary hover:text-[#E02DD8]"
                    >
                      Try again
                    </Button>
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


