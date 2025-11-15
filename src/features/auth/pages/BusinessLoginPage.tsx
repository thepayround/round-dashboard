import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { GoogleLoginButton } from '../components/GoogleLoginButton'
import { useBusinessLoginController } from '../hooks/useBusinessLoginController'

import { FacebookIcon } from '@/features/auth/components/icons/SocialIcons'
import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { ActionButton } from '@/shared/ui/ActionButton'
import { AuthInput } from '@/shared/ui/AuthInput'
import { AuthLogo } from '@/shared/ui/AuthLogo'
import { Button } from '@/shared/ui/Button'

export const BusinessLoginPage = () => {
  const { showSuccess, showError } = useGlobalToast()
  const {
    email,
    password,
    handleEmailChange,
    handlePasswordChange,
    handleEmailBlur,
    handlePasswordBlur,
    handleSubmit,
    errors,
    isFormValid,
    isLoading,
  } = useBusinessLoginController()

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
          <div className="text-center mb-5 md:mb-6 lg:mb-5">
            <div className="gradient-header" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative"
            >
              <h1 className="text-xl md:text-2xl lg:text-xl font-medium tracking-tight auth-text mb-2 md:mb-3 lg:mb-2 relative">
                Business Sign In
              </h1>
              <p className="auth-text-muted text-sm md:text-base lg:text-sm font-medium">
                Access your business Round account
              </p>
            </motion.div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-5 lg:space-y-4">
            {/* Email Address */}
            <AuthInput
              id="email"
              type="email"
              name="email"
              label="Email Address"
              value={email}
              onChange={(e) => handleEmailChange(e as React.ChangeEvent<HTMLInputElement>)}
              onBlur={handleEmailBlur}
              placeholder="example@company.com"
              leftIcon={Mail}
              error={errors.email}
              required
            />

            {/* Password */}
            <div className="space-y-2">
              <AuthInput
                id="password"
                type="password"
                name="password"
                label="Password"
                value={password}
                onChange={(e) => handlePasswordChange(e as React.ChangeEvent<HTMLInputElement>)}
                onBlur={handlePasswordBlur}
                placeholder="Enter your password"
                leftIcon={Lock}
                error={errors.password}
                passwordToggle
                required
              />

              <div className="text-right">
                <Link to="/auth/forgot-password" className="auth-link text-sm brand-primary">
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <ActionButton
              type="submit"
              label={isLoading ? 'Signing In...' : 'Sign In'}
              disabled={!isFormValid || isLoading}
              icon={ArrowRight}
              loading={isLoading}
              size="md"
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

              <Button
                type="button"
                variant="ghost"
                size="md"
                className="w-full h-9 btn-social"
                icon={FacebookIcon}
              >
                Facebook
              </Button>
            </div>

            {/* Links */}
            <div className="text-center space-y-4">
              <p className="auth-text-muted">
                Don&apos;t have an account?{' '}
                <Link to="/signup/business" className="auth-link brand-primary">
                  Create business account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

