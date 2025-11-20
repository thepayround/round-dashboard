import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import { GoogleLoginButton } from '../components/GoogleLoginButton'
import { SocialLoginButton } from '../components/SocialLoginButton'

import { FacebookIcon } from '@/features/auth/components/icons/SocialIcons'
import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { useAsyncAction, useForm } from '@/shared/hooks'
import { useAuth } from '@/shared/hooks/useAuth'
import { apiClient } from '@/shared/services/apiClient'
import { Input } from '@/shared/ui'
import { ActionButton } from '@/shared/ui/ActionButton'
import { AuthLogo } from '@/shared/ui/AuthLogo'
import { IconButton } from '@/shared/ui/Button'
import { validators, handleApiError } from '@/shared/utils'

export const PersonalLoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { showSuccess, showError } = useGlobalToast()
  const { loading: isSubmitting, execute } = useAsyncAction()
  const [showPassword, setShowPassword] = useState(false)

  // Use form hook for validation
  const { values, errors, handleChange, handleBlur, validateAll, setFieldValue } = useForm(
    { email: '', password: '' },
    {
      email: (value: string) => {
        if (!value.trim()) {
          return { valid: false, message: 'Email is required' }
        }
        return validators.emailWithMessage(value)
      },
      password: (value: string) => {
        if (!value.trim()) {
          return { valid: false, message: 'Password is required' }
        }
        return validators.passwordBasic(value)
      },
    }
  )

  // Handle success message from navigation state
  useEffect(() => {
    const state = location.state as { message?: string; email?: string }
    if (state?.message) {
      showSuccess(state.message)
      if (state.email) {
        setFieldValue('email', state.email)
      }
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state, location.pathname, navigate, showSuccess, setFieldValue])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateAll()) {
      return
    }

    await execute(async () => {
      const response = await apiClient.login(values)

      if (response.success && response.data) {
        login(response.data.user, response.data.accessToken)
        
        const from =
          (location.state as { from?: { pathname?: string } })?.from?.pathname ?? '/dashboard'
        navigate(from, { replace: true })
      } else {
        showError(response.error ?? 'Login failed')
      }
    }, {
      onError: (error) => {
        const message = handleApiError(error, 'Login')
        showError(message)
      }
    })
  }

  const isFormValid = values.email.trim() !== '' && values.password.trim() !== '' && !errors.email && !errors.password

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
                Personal Sign In
              </h1>
              <p className="text-white/85 text-sm md:text-base lg:text-sm font-medium">
                Access your personal Round account
              </p>
            </motion.div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-5 lg:space-y-4">
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
              placeholder="example@gmail.com"
              error={errors.email}
              required
            />

            {/* Password */}
            <div>
              <div className="relative">
                <Input
                  id="password"
                  label="Password"
                  leftIcon={Lock}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={values.password}
                  onChange={handleChange('password')}
                  onBlur={handleBlur('password')}
                  placeholder="Enter your password"
                  error={errors.password}
                  className="pr-9"
                  required
                />
                <IconButton
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  icon={showPassword ? EyeOff : Eye}
                  variant="ghost"
                  size="md"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-[42px] -translate-y-1/2 z-10 flex items-center justify-center cursor-pointer transition-colors duration-200 text-auth-icon hover:text-white/90"
                />
              </div>

              <div className="text-right mt-2">
                <Link to="/auth/forgot-password" className="text-auth-primary/90 text-sm font-semibold no-underline transition-all duration-300 hover:text-auth-primary hover:-translate-y-px">
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <ActionButton
              type="submit"
              label={isSubmitting ? 'Signing In...' : 'Sign In'}
              disabled={!isFormValid || isSubmitting}
              icon={ArrowRight}
              loading={isSubmitting}
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
                <Link to="/signup" className="text-auth-primary/90 font-semibold no-underline transition-all duration-300 hover:text-auth-primary hover:-translate-y-px">
                  Create personal account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

