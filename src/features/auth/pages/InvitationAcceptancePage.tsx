import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Users, Building, Check, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useInvitationAcceptanceController } from '../hooks/useInvitationAcceptanceController'

import { AuthLogo } from '@/shared/ui/AuthLogo'
import { PasswordStrengthIndicator } from '@/shared/ui/PasswordStrengthIndicator'
import { PhoneInput } from '@/shared/ui/PhoneInput'
import { Button } from '@/shared/ui/shadcn/button'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'

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

        <div className="w-full max-w-[360px] mx-auto relative z-10">
          <div className="bg-white/[0.02] border border-border rounded-lg p-6 relative overflow-hidden z-10 transition-all duration-150 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 text-secondary animate-spin" />
              <p className="text-white/85 text-sm">Validating invitation...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

// Token error state
  if (tokenError) {
    return (
      <div className="relative min-h-screen flex items-center justify-center pb-12 z-[1]">
        
        <div className="w-full max-w-[360px] mx-auto relative z-10">
          <div className="bg-white/[0.02] border border-border rounded-lg p-6 relative overflow-hidden z-10 transition-all duration-150 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-medium tracking-tight text-white mb-2">Invalid Invitation</h1>
            <p className="text-white/85 mb-6">{tokenError}</p>
            <Button
              onClick={() => navigate('/login')}
              size="default"
              className="w-full bg-secondary hover:bg-secondary/90 text-white"
            >
              Go to Login
            </Button>
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

        <div className="bg-white/[0.02] border border-border rounded-lg p-6 relative overflow-hidden z-10 transition-all duration-150">
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
              <div className="bg-white/5 rounded-lg border border-border p-6 mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                    <Building className="w-6 h-6 text-secondary" />
                  </div>
                </div>
                
                <h2 className="text-xl font-medium tracking-tight text-white mb-2">{invitation.organizationName}</h2>
                <p className="text-white/85 text-sm mb-4">
                  {invitation.inviterName} has invited you to join as a{' '}
                  <span className="font-medium text-secondary tracking-tight">{invitation.roleName}</span>
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
              className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 mb-6"
            >
              <div className="flex items-center space-x-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{apiError}</span>
              </div>
            </motion.div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pre-filled Email (Read-only) */}
            <div>
              <Label htmlFor="email" className="block text-sm font-normal text-white/90 mb-2 tracking-tight">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-success w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={invitation.email}
                  disabled
                  className="w-full h-10 px-3 pl-9 pr-9 bg-success/5 border border-success/20 rounded-lg text-white/70 placeholder:text-auth-placeholder font-light text-xs tracking-tight transition-all duration-200 hover:border-success/40 focus:border-success focus:bg-success/10 outline-none appearance-none"
                />
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-success w-4 h-4" />
              </div>
              <p className="mt-1 text-xs text-success">Verified from invitation</p>
            </div>

            {/* Name Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <Label htmlFor="firstName" className="block text-sm font-normal text-white/90 mb-2 tracking-tight">
                  First Name <span className="text-primary">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-auth-icon w-4 h-4" />
                  <Input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange('firstName')}
                    onBlur={handleBlur('firstName')}
                    placeholder="John"
                    className="w-full h-10 px-3 pl-9 bg-white/[0.02] border border-border rounded-lg text-white placeholder:text-auth-placeholder font-light text-xs tracking-tight transition-all duration-200 hover:border-border-hover focus:border-secondary focus:bg-white/[0.04] outline-none appearance-none"
                    aria-invalid={!!errors.firstName}
                    aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                  />
                </div>
                {errors.firstName && (
                  <motion.div
                    id="firstName-error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center space-x-2 text-auth-error font-medium text-sm"
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
                <Label htmlFor="lastName" className="block text-sm font-normal text-white/90 mb-2 tracking-tight">
                  Last Name <span className="text-primary">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-auth-icon w-4 h-4" />
                  <Input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange('lastName')}
                    onBlur={handleBlur('lastName')}
                    placeholder="Doe"
                    className="w-full h-10 px-3 pl-9 bg-white/[0.02] border border-border rounded-lg text-white placeholder:text-auth-placeholder font-light text-xs tracking-tight transition-all duration-200 hover:border-border-hover focus:border-secondary focus:bg-white/[0.04] outline-none appearance-none"
                    aria-invalid={!!errors.lastName}
                    aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                  />
                </div>
                {errors.lastName && (
                  <motion.div
                    id="lastName-error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center space-x-2 text-auth-error font-medium text-sm"
                    role="alert"
                    aria-live="polite"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.lastName}</span>
                  </motion.div>
                )}
              </div>
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
            <div>
              <Label htmlFor="password" className="block text-sm font-normal text-white/90 mb-2 tracking-tight">
                Create Password <span className="text-primary">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-auth-icon w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={values.password}
                  onChange={handleChange('password')}
                  onBlur={handleBlur('password')}
                  placeholder="Create a secure password"
                  className="w-full h-10 px-3 pl-9 pr-9 bg-white/[0.02] border border-border rounded-lg text-white placeholder:text-auth-placeholder font-light text-xs tracking-tight transition-all duration-200 hover:border-border-hover focus:border-secondary focus:bg-white/[0.04] outline-none appearance-none"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center cursor-pointer transition-colors duration-200 text-auth-icon hover:text-white/90"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <motion.div
                  id="password-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center space-x-2 text-auth-error font-medium text-sm"
                  role="alert"
                  aria-live="polite"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </motion.div>
              )}

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
            <Button
              type="submit"
              disabled={!isFormReady || isSubmitting}
              size="default"
              className="mt-8 w-full bg-secondary hover:bg-secondary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Joining Organization...
                </>
              ) : (
                <>
                  Join {invitation.organizationName}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            {/* Terms */}
            <div className="text-center">
              <p className="text-sm text-white/85">
                By joining, you accept the organization&apos;s terms and Round&apos;s{' '}
                <a href="/terms" className="text-auth-primary/90 font-medium no-underline transition-all duration-300 hover:text-auth-primary hover:-translate-y-px">terms of service</a>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}




