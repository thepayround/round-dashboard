import { motion } from 'framer-motion'
import { User, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'


import { GoogleLoginButton } from '../components/GoogleLoginButton'
import { SocialLoginButton } from '../components/SocialLoginButton'
import { usePersonalRegisterController } from '../hooks/usePersonalRegisterController'

import { FacebookIcon } from '@/features/auth/components/icons/SocialIcons'
import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { FormInput } from '@/shared/ui'
import { ActionButton } from '@/shared/ui/ActionButton'
import { AuthLogo } from '@/shared/ui/AuthLogo'
import { PasswordStrengthIndicator } from '@/shared/ui/PasswordStrengthIndicator'
import { PhoneInput } from '@/shared/ui/PhoneInput'

export const PersonalRegisterPage = () => {
  const navigate = useNavigate()
  const { showSuccess, showError } = useGlobalToast()
  const {
    form,
    phone,
    isSubmitting,
    handleSubmit,
    isFormReady,
  } = usePersonalRegisterController()

  const { values, errors, handleChange, handleBlur } = form
  const { phoneData, phoneError, handlePhoneChange, handlePhoneBlur } = phone

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

        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-6 relative overflow-hidden z-10 transition-all duration-150">
          {/* Header */}
          <div className="text-center mb-5 md:mb-6 lg:mb-5">
            <div className="gradient-header" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative"
            >
              <h1 className="text-xl md:text-2xl lg:text-xl font-medium tracking-tight text-white mb-2 md:mb-3 lg:mb-2 relative">Create Personal Account</h1>
              <p className="text-white/85 text-sm md:text-base lg:text-sm font-medium">Join the Round community</p>
            </motion.div>
          </div>


        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 lg:space-y-4">
          {/* Name Fields Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="firstName"
              name="firstName"
              label="First Name"
              leftIcon={User}
              value={values.firstName}
              onChange={handleChange('firstName')}
              onBlur={handleBlur('firstName')}
              placeholder="John"
              error={errors.firstName}
              required
              size="sm"
            />

            <FormInput
              id="lastName"
              name="lastName"
              label="Last Name"
              leftIcon={User}
              value={values.lastName}
              onChange={handleChange('lastName')}
              onBlur={handleBlur('lastName')}
              placeholder="Doe"
              error={errors.lastName}
              required
              size="sm"
            />
          </div>

          {/* Email Address */}
          <FormInput
            id="email"
            type="email"
            name="email"
            label="Email Address"
            leftIcon={Mail}
            value={values.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            placeholder="example@gmail.com"
            error={errors.email}
            required
            size="sm"
          />

          {/* Phone Number */}
          <div>
            <PhoneInput
              id="phone"
              name="phone"
              value={phoneData.phone}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              validateOnBlur={false}
              label="Phone Number"
              placeholder="Phone number"
              error={phoneError}
              defaultCountry="GR"
              showValidation={false}
            />
            {phoneError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center space-x-2 text-auth-error font-medium text-sm"
                role="alert"
                aria-live="polite"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{phoneError}</span>
              </motion.div>
            )}
          </div>

          {/* Password */}
          <div>
            <FormInput
              id="password"
              type="password"
              name="password"
              label="Password"
              leftIcon={Lock}
              value={values.password}
              onChange={handleChange('password')}
              onBlur={handleBlur('password')}
              placeholder="Create a strong password"
              error={errors.password}
              required
              size="sm"
              passwordToggle
            />

            {/* Password Strength Indicator */}
            {values.password && (
              <div className="mt-3">
                <PasswordStrengthIndicator 
                  password={values.password}
                  showStrengthBar
                />
              </div>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="text-center mt-8 md:mt-10 lg:mt-8">
            <p className="text-sm text-white/85">
              By creating an account you accept Round&apos;s{' '}
              <Link to="/terms" className="text-auth-primary/90 font-semibold no-underline transition-all duration-300 hover:text-auth-primary hover:-translate-y-px">
                terms and conditions
              </Link>
            </p>
          </div>

          {/* Submit Button */}
          <ActionButton
            type="submit"
            label={isSubmitting ? 'Creating Account...' : 'Create Personal Account'}
            disabled={!isFormReady}
            icon={ArrowRight}
            isLoading={isSubmitting}
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
              accountType="personal"
              onSuccess={() => {
                showSuccess('Successfully registered with Google!')
                // Redirect to dashboard or profile completion
                navigate('/dashboard')
              }}
              onError={(error) => showError(error)}
            />

            <SocialLoginButton
              label="Facebook"
              icon={FacebookIcon}
            />
          </div>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-white/85">
              Already have an account?{' '}
              <Link to="/login" className="text-auth-primary/90 font-semibold no-underline transition-all duration-300 hover:text-auth-primary hover:-translate-y-px">
                Sign in
              </Link>
            </p>
          </div>
        </form>
        </div>
      </motion.div>
    </div>
  )
}
