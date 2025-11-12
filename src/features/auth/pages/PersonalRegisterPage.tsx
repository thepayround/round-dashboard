import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { GoogleLoginButton } from '../components/GoogleLoginButton'
import { usePersonalRegisterController } from '../hooks/usePersonalRegisterController'

import { FacebookIcon } from '@/features/auth/components/icons/SocialIcons'
import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { ActionButton } from '@/shared/ui/ActionButton'
import { AuthLogo } from '@/shared/ui/AuthLogo'
import { IconButton, Button } from '@/shared/ui/Button'
import { PasswordStrengthIndicator } from '@/shared/ui/PasswordStrengthIndicator'
import { PhoneInput } from '@/shared/ui/PhoneInput'

export const PersonalRegisterPage = () => {
  const navigate = useNavigate()
  const { showSuccess, showError } = useGlobalToast()
  const {
    form,
    phone,
    showPassword,
    togglePasswordVisibility,
    isSubmitting,
    handleSubmit,
    isFormReady,
  } = usePersonalRegisterController()

  const { values, errors, handleChange, handleBlur } = form
  const { phoneData, phoneError, handlePhoneChange, handlePhoneBlur } = phone

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
              <h1 className="text-xl md:text-2xl lg:text-xl font-medium tracking-tight auth-text mb-2 md:mb-3 lg:mb-2 relative">Create Personal Account</h1>
              <p className="auth-text-muted text-sm md:text-base lg:text-sm font-medium">Join the Round community</p>
            </motion.div>
          </div>


        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-5 lg:space-y-4">
          {/* Name Fields Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="auth-label">
                First Name
              </label>
              <div className="input-container">
                <User className="input-icon-left auth-icon-primary" />
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange('firstName')}
                  onBlur={handleBlur('firstName')}
                  placeholder="John"
                  className={`auth-input input-with-icon-left ${errors.firstName ? 'auth-input-error' : ''}`}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                />
              </div>
              {errors.firstName && (
                <motion.div
                  id="firstName-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                  role="alert"
                  aria-live="polite"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.firstName}</span>
                </motion.div>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="auth-label">
                Last Name
              </label>
              <div className="input-container">
                <User className="input-icon-left auth-icon-primary" />
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange('lastName')}
                  onBlur={handleBlur('lastName')}
                  placeholder="Doe"
                  className={`auth-input input-with-icon-left ${errors.lastName ? 'auth-input-error' : ''}`}
                  required
                />
              </div>
              {errors.lastName && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                  role="alert"
                  aria-live="polite"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.lastName}</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Email Address */}
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
                placeholder="example@gmail.com"
                className={`auth-input input-with-icon-left ${errors.email ? 'auth-input-error' : ''}`}
                required
              />
            </div>
            {errors.email && (
              <motion.div
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
                className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
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
              <label htmlFor="password" className="auth-label">
                Password
              </label>
              <div className="input-container">
              <Lock className="input-icon-left auth-icon-primary" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={values.password}
                onChange={handleChange('password')}
                onBlur={handleBlur('password')}
                placeholder="Create a strong password"
                className={`auth-input input-with-icon-left input-with-icon-right ${errors.password ? 'auth-input-error' : ''}`}
                required
              />
              <IconButton
                type="button"
                onClick={togglePasswordVisibility}
                icon={showPassword ? EyeOff : Eye}
                variant="ghost"
                size="sm"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="input-icon-right auth-icon hover:text-gray-600 transition-colors"
              />
            </div>

            {/* Password Strength Indicator */}
            {values.password && (
              <div className="mt-3">
                <PasswordStrengthIndicator 
                  password={values.password}
                  showStrengthBar
                />
              </div>
            )}

            {errors.password && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                role="alert"
                aria-live="polite"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{errors.password}</span>
              </motion.div>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="text-center mt-8 md:mt-10 lg:mt-8">
            <p className="text-sm auth-text-muted">
              By creating an account you accept Round&apos;s{' '}
              <Link to="/terms" className="auth-link">
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
            loading={isSubmitting}
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
              accountType="personal"
              onSuccess={() => {
                showSuccess('Successfully registered with Google!')
                // Redirect to dashboard or profile completion
                navigate('/dashboard')
              }}
              onError={(error) => showError(error)}
            />

            <Button
              type="button"
              variant="secondary"
              size="md"
              fullWidth
              className="h-9"
              icon={FacebookIcon}
            >
              Facebook
            </Button>
          </div>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="auth-text-muted">
              Already have an account?{' '}
              <Link to="/login" className="auth-link brand-primary">
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

