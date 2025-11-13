import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useResetPasswordController } from '../hooks/useResetPasswordController'

import { ActionButton } from '@/shared/ui/ActionButton'
import { AuthLogo } from '@/shared/ui/AuthLogo'
import { IconButton } from '@/shared/ui/Button'
import { PasswordStrengthIndicator } from '@/shared/ui/PasswordStrengthIndicator'

export const ResetPasswordPage = () => {
  const {
    values,
    errors,
    handleBlur,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleSubmit,
    isSubmitting,
    apiError,
    isSuccess,
    showPassword,
    showConfirmPassword,
    toggleShowPassword,
    toggleShowConfirmPassword,
    disableSubmit,
    goToLogin,
    tokenError,
    tokenEmail,
  } = useResetPasswordController()
  if (tokenError) {
    return (
      <div className="auth-container">
        <div className="auth-background">
          <div className="floating-orb" />
          <div className="floating-orb" />
          <div className="floating-orb" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="w-full max-w-[360px] mx-auto relative z-10"
        >
          <div className="auth-card">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-medium tracking-tight auth-text mb-4">Invalid Reset Link</h1>
              <p className="auth-text-muted mb-6">
                {tokenError}
              </p>
              <Link
                to="/auth/forgot-password"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <span>Request New Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    )
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
                  <h1 className="text-xl md:text-2xl lg:text-xl font-medium tracking-tight auth-text mb-2 md:mb-3 lg:mb-2 relative">
                    Reset Password
                  </h1>
                  <p className="auth-text-muted text-sm md:text-base lg:text-sm font-medium">
                    Enter your new password for <strong className="text-white">{tokenEmail}</strong>
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-xl md:text-2xl lg:text-xl font-medium tracking-tight auth-text mb-2 md:mb-3 lg:mb-2 relative">
                    Password Reset Successful
                  </h1>
                  <p className="auth-text-muted text-sm md:text-base lg:text-sm font-medium">
                    Your password has been successfully reset. You will be logged in automatically...
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
                  <div className="flex items-center space-x-2 text-[#D417C8]">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{apiError}</span>
                  </div>
                </motion.div>
              )}

              {/* Reset Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* New Password */}
                <div>
                  <label htmlFor="newPassword" className="auth-label">
                    New Password
                  </label>
                  <div className="input-container">
                    <Lock className="input-icon-left auth-icon-primary" />
                    <input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={values.newPassword}
                      onChange={handlePasswordChange}
                      onBlur={handleBlur('newPassword')}
                      placeholder="Enter your new password"
                      className={`auth-input input-with-icon-left input-with-icon-right ${errors.newPassword ? 'auth-input-error' : ''}`}
                      required
                      autoComplete="new-password"
                      aria-required="true"
                      aria-invalid={!!errors.newPassword}
                      aria-describedby={errors.newPassword ? 'newPassword-error' : undefined}
                    />
                    <IconButton
                      type="button"
                      onClick={toggleShowPassword}
                      icon={showPassword ? EyeOff : Eye}
                      variant="ghost"
                      size="md"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="input-icon-right"
                    />
                  </div>

                  {errors.newPassword && (
                    <motion.div
                      id="newPassword-error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                      role="alert"
                      aria-live="polite"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.newPassword}</span>
                    </motion.div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="auth-label">
                    Confirm New Password
                  </label>
                  <div className="input-container">
                    <Lock className="input-icon-left auth-icon-primary" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={values.confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      onBlur={handleBlur('confirmPassword')}
                      placeholder="Confirm your new password"
                      className={`auth-input input-with-icon-left input-with-icon-right ${errors.confirmPassword ? 'auth-input-error' : ''}`}
                      required
                      autoComplete="new-password"
                      aria-required="true"
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                    />
                    <IconButton
                      type="button"
                      onClick={toggleShowConfirmPassword}
                      icon={showConfirmPassword ? EyeOff : Eye}
                      variant="ghost"
                      size="md"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      className="input-icon-right"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <motion.div
                      id="confirmPassword-error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                      role="alert"
                      aria-live="polite"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.confirmPassword}</span>
                    </motion.div>
                  )}
                </div>

                {/* Submit Button */}
                <ActionButton
                  type="submit"
                  label={isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                  disabled={disableSubmit}
                  icon={ArrowRight}
                  loading={isSubmitting}
                  size="md"
                  animated={false}
                  actionType="auth"
                  className="mt-8 w-full"
                />

                {/* Password Requirements */}
                <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
                  <PasswordStrengthIndicator 
                    password={values.newPassword}
                    showStrengthBar={!!values.newPassword}
                  />
                </div>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="text-green-400 text-sm font-medium">
                    <p>Your password has been successfully reset and all existing sessions have been invalidated for security.</p>
                  </div>
                </div>

                {/* Action Button */}
                <ActionButton
                  label="Continue to Sign In"
                  onClick={goToLogin}
                  icon={ArrowRight}
                  size="md"
                  animated={false}
                  actionType="auth"
                  className="w-full "
                />
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}



