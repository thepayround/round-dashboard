import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Users, Building, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useInvitationAcceptanceController } from '../hooks/useInvitationAcceptanceController'

import { Input, LoadingSpinner } from '@/shared/ui'
import { ActionButton } from '@/shared/ui/ActionButton'
import { AuthLogo } from '@/shared/ui/AuthLogo'
import { PlainButton } from '@/shared/ui/Button'
import { PasswordStrengthIndicator } from '@/shared/ui/PasswordStrengthIndicator'
import { PhoneInput } from '@/shared/ui/PhoneInput'

export const InvitationAcceptancePage = () => {
  const navigate = useNavigate()
  const {
    tokenError,
    apiError,
    isValidatingToken,
    isSubmitting,
    invitation,
    form,
    phone,
    showPassword,
    togglePasswordVisibility,
    handleSubmit,
    isFormReady,
  } = useInvitationAcceptanceController()

  const { values, errors, handleChange, handleBlur } = form
  const { phoneData, phoneError, handlePhoneChange, handlePhoneBlur } = phone

  if (isValidatingToken) {
    return (
      <div className="relative min-h-screen flex items-center justify-center pb-12 z-[1]">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="floating-orb" />
          <div className="floating-orb" />
          <div className="floating-orb" />
        </div>

        <div className="w-full max-w-[360px] mx-auto relative z-10">
          <div className="bg-white/[0.02] border border-white/10 rounded-lg p-5 md:p-6 lg:p-7 relative overflow-hidden z-10 transition-all duration-150 text-center">
            <LoadingSpinner size="xl" color="secondary" label="Validating invitation..." />
          </div>
        </div>
      </div>
    )
  }

// Token error state
  if (tokenError) {
    return (
      <div className="relative min-h-screen flex items-center justify-center pb-12 z-[1]">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="floating-orb" />
          <div className="floating-orb" />
          <div className="floating-orb" />
        </div>
        
        <div className="w-full max-w-[360px] mx-auto relative z-10">
          <div className="bg-white/[0.02] border border-white/10 rounded-lg p-5 md:p-6 lg:p-7 relative overflow-hidden z-10 transition-all duration-150 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-medium tracking-tight text-white mb-2">Invalid Invitation</h1>
            <p className="text-white/85 mb-6">{tokenError}</p>
            <ActionButton
              label="Go to Login"
              onClick={() => navigate('/login')}
              size="md"
              actionType="auth"
            />
          </div>
        </div>
      </div>
    )
  }

  if (!invitation) {
    return null
  }

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
        className="w-full max-w-[420px] mx-auto relative z-10"
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

              <h1 className="text-4xl font-medium tracking-tight text-white mb-4 relative">You&apos;re Invited!</h1>
              
              {/* Invitation Details Card */}
              <div className="bg-white/5 rounded-lg border border-white/10 p-6 mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-[#14BDEA]/20 rounded-full flex items-center justify-center">
                    <Building className="w-6 h-6 text-[#14BDEA]" />
                  </div>
                </div>
                
                <h2 className="text-xl font-medium tracking-tight text-white mb-2">{invitation.organizationName}</h2>
                <p className="text-white/85 text-sm mb-4">
                  {invitation.inviterName} has invited you to join as a{' '}
                  <span className="font-medium text-[#14BDEA] tracking-tight">{invitation.roleName}</span>
                </p>
                
                <div className="flex items-center justify-center space-x-4 text-xs text-white/85">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-3 h-3" />
                    <span>{invitation.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{invitation.roleName}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-white/85 text-lg font-medium">Complete your account setup</p>
            </motion.div>
          </div>

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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pre-filled Email (Read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-normal text-white/90 mb-2 tracking-tight">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-green-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={invitation.email}
                  disabled
                  className="w-full h-9 px-3 pl-9 pr-9 bg-green-500/5 border border-green-500/20 rounded-lg text-white/70 placeholder:text-auth-placeholder font-light text-xs tracking-tight transition-all duration-200 hover:border-green-500/40 focus:border-green-500 focus:bg-green-500/10 outline-none appearance-none"
                />
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-green-400 w-4 h-4" />
              </div>
              <p className="mt-1 text-xs text-green-400">Verified from invitation</p>
            </div>

            {/* Name Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <Input
                id="firstName"
                type="text"
                name="firstName"
                value={values.firstName}
                onChange={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                placeholder="John"
                label="First Name"
                leftIcon={User}
                error={errors.firstName}
                required
              />

              {/* Last Name */}
              <Input
                id="lastName"
                type="text"
                name="lastName"
                value={values.lastName}
                onChange={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                placeholder="Doe"
                label="Last Name"
                leftIcon={User}
                error={errors.lastName}
                required
              />
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
                defaultCountry="US"
                showValidation={false}
                required
                className="w-full"
              />
              {phoneError && (
                <motion.div
                  id="phone-error"
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
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={values.password}
                onChange={handleChange('password')}
                onBlur={handleBlur('password')}
                placeholder="Create a secure password"
                label="Create Password"
                leftIcon={Lock}
                error={errors.password}
                required
                className="pr-9"
              />
              <PlainButton
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-[38px] z-10 flex items-center justify-center cursor-pointer transition-colors duration-200 text-auth-icon hover:text-white/90"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                unstyled
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </PlainButton>

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

            {/* Submit Button */}
            <ActionButton
              type="submit"
              label={isSubmitting ? 'Joining Organization...' : `Join ${invitation.organizationName}`}
              disabled={!isFormReady}
              icon={ArrowRight}
              loading={isSubmitting}
              size="md"
              animated={false}
              actionType="auth"
              className="mt-8 w-full"
            />

            {/* Terms */}
            <div className="text-center">
              <p className="text-sm text-white/85">
                By joining, you accept the organization&apos;s terms and Round&apos;s{' '}
                <a href="/terms" className="text-auth-primary/90 font-semibold no-underline transition-all duration-300 hover:text-auth-primary hover:-translate-y-px">terms of service</a>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}




