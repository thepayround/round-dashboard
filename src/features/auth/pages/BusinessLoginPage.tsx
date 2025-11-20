import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'


import { GoogleLoginButton } from '../components/GoogleLoginButton'
import { SocialLoginButton } from '../components/SocialLoginButton'
import { useBusinessLoginController } from '../hooks/useBusinessLoginController'

import { FacebookIcon } from '@/features/auth/components/icons/SocialIcons'
import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { ActionButton } from '@/shared/ui/ActionButton'
import { AuthInput } from '@/shared/ui/AuthInput'
import { AuthLogo } from '@/shared/ui/AuthLogo'

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
          <div className="text-center mb-5 md:mb-6 lg:mb-5">
            <div className="gradient-header" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative"
            >
              <h1 className="text-xl md:text-2xl lg:text-xl font-medium tracking-tight text-white mb-2 md:mb-3 lg:mb-2 relative">
                Business Sign In
              </h1>
              <p className="text-white/85 text-sm md:text-base lg:text-sm font-medium">
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
                <Link to="/auth/forgot-password" className="text-auth-primary/90 text-sm font-semibold no-underline transition-all duration-300 hover:text-auth-primary hover:-translate-y-px">
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
              isLoading={isLoading}
              size="md"
              animated={false}
              actionType="auth"
              className="mt-6 md:mt-8 lg:mt-6 w-full"
            />

            {/* Divider */}
            <div className="relative flex items-center justify-center my-6 before:content-[''] before:flex-1 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent before:mr-4 after:content-[''] after:flex-1 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/15 after:to-transparent after:ml-4">
              <span>or</span>
            </div>

            {/* Social Login Buttons */}
            <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
              <GoogleLoginButton 
                accountType="business"
                onSuccess={() => showSuccess('Successfully signed in with Google!')}
                onError={(error) => showError(error)}
              />

              <SocialLoginButton
                label="Facebook"
                icon={FacebookIcon}
              />
            </div>

            {/* Links */}
            <div className="text-center space-y-4">
              <p className="text-white/85">
                Don&apos;t have an account?{' '}
                <Link to="/signup/business" className="text-auth-primary/90 font-semibold no-underline transition-all duration-300 hover:text-auth-primary hover:-translate-y-px">
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

