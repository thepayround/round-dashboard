import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ActionButton } from '@/shared/components'

import type { ValidationError } from '@/shared/utils/validation'
import {
  validatePassword,
  getFieldError,
  hasFieldError,
} from '@/shared/utils/validation'
import { apiClient } from '@/shared/services/apiClient'
import { useAuth } from '@/shared/hooks/useAuth'

export const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [searchParams] = useSearchParams()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    token: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    // Extract email and token from URL parameters
    // Handle both 'email' and 'userId' parameters for backward compatibility
    const email = searchParams.get('email') ?? searchParams.get('userId') ?? ''
    const token = searchParams.get('token') ?? ''
    
    // Debug logging - removed console statements for production
    // console.log('Reset password page - URL params:', { email, token, userId: searchParams.get('userId') })
    // console.log('All search params:', Object.fromEntries(searchParams.entries()))
    
    if (!email || !token) {
      console.error('Missing parameters:', { email, token, allParams: Object.fromEntries(searchParams.entries()) })
      setApiError('Invalid or missing reset link parameters. Please request a new password reset.')
      return
    }

    setFormData(prev => ({
      ...prev,
      email: decodeURIComponent(email),
      token: decodeURIComponent(token)
    }))
  }, [searchParams])

  // Form validation helper
  const isFormValid = () => {
    const passwordValidation = validatePassword(formData.newPassword)
    const passwordsMatch = formData.newPassword === formData.confirmPassword
    return passwordValidation.isValid && passwordsMatch && formData.newPassword.trim() !== '' && formData.confirmPassword.trim() !== ''
  }

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isFormValid()) {
      e.preventDefault()
      handleSubmit(e as React.FormEvent)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear field error when user starts typing
    if (hasFieldError(errors, name)) {
      setErrors(prev => prev.filter(error => error.field !== name))
    }
    setApiError('')

    // Check password confirmation match
    if (name === 'confirmPassword' || (name === 'newPassword' && formData.confirmPassword)) {
      const newPassword = name === 'newPassword' ? value : formData.newPassword
      const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword
      
      if (confirmPassword && newPassword !== confirmPassword) {
        setErrors(prev => {
          const filtered = prev.filter(error => error.field !== 'confirmPassword')
          return [...filtered, { field: 'confirmPassword', message: 'Passwords do not match', code: 'MISMATCH' }]
        })
      } else if (newPassword === confirmPassword) {
        setErrors(prev => prev.filter(error => error.field !== 'confirmPassword'))
      }
    }
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (value.trim() !== '') {
      if (name === 'newPassword') {
        const passwordValidation = validatePassword(value)
        if (!passwordValidation.isValid && passwordValidation.errors.length > 0) {
          setErrors(prev => {
            const filtered = prev.filter(error => error.field !== 'newPassword')
            return [...filtered, passwordValidation.errors[0]]
          })
        }
      }

      if (name === 'confirmPassword' && value !== formData.newPassword) {
        setErrors(prev => {
          const filtered = prev.filter(error => error.field !== 'confirmPassword')
          return [...filtered, { field: 'confirmPassword', message: 'Passwords do not match', code: 'MISMATCH' }]
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setApiError('')

    // Validate form
    const passwordValidation = validatePassword(formData.newPassword)
    const newErrors: ValidationError[] = []

    if (!passwordValidation.isValid) {
      newErrors.push(...passwordValidation.errors)
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.push({ field: 'confirmPassword', message: 'Passwords do not match', code: 'MISMATCH' })
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      const response = await apiClient.resetPassword(
        formData.email,
        formData.token,
        formData.newPassword,
        formData.confirmPassword
      )

      if (response.success && response.data) {
        if (response.data.token && response.data.refreshToken) {
          // Auto-login with the returned tokens
          const userData = {
            id: '', // Will be fetched when needed
            email: formData.email,
            firstName: '',
            lastName: '',
            phone: '',
            accountType: 'business' as const, // Default assumption for password reset
            role: 'member' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            companyInfo: {
              companyName: '',
              registrationNumber: '',
              currency: 'USD' as const,
              businessType: 'corporation' as const,
              website: '',
              description: ''
            }
          }
          
          // Log the user in
          login(userData, response.data.token, response.data.refreshToken)
          
          setIsSuccess(true)
          // Navigate to dashboard after brief delay for UX
          setTimeout(() => {
            navigate('/dashboard', { replace: true })
          }, 1000)
        } else {
          // Fallback to old flow if tokens not returned
          setIsSuccess(true)
          await handleAutoLogin()
        }
      } else {
        setApiError(response.error ?? 'Failed to reset password')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Reset password error:', error)
      setApiError('An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleButtonClick = async () => {
    if (!isSuccess) {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent
      await handleSubmit(fakeEvent)
    } else {
      navigate('/auth/login')
    }
  }

  const handleAutoLogin = async () => {
    try {
      const response = await apiClient.login({
        email: formData.email,
        password: formData.newPassword
      })

      if (response.success && response.data) {
        // Save the authentication data
        localStorage.setItem('token', response.data.accessToken)
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken)
        }
        
        // Navigate to dashboard
        navigate('/dashboard')
      } else {
        // If auto-login fails, just go to login page
        navigate('/auth/login')
      }
    } catch (error) {
      console.error('Auto-login failed:', error)
      // If auto-login fails, just go to login page
      navigate('/auth/login')
    }
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { score: 0, label: '', color: 'bg-gray-300' }
    if (password.length < 6) return { score: 1, label: 'Weak', color: 'bg-red-500' }
    if (password.length < 8) return { score: 2, label: 'Fair', color: 'bg-yellow-500' }
    if (password.length < 12) return { score: 3, label: 'Good', color: 'bg-blue-500' }
    return { score: 4, label: 'Strong', color: 'bg-green-500' }
  }

  const getPasswordTextColor = (score: number) => {
    if (score >= 3) return 'text-green-400'
    if (score >= 2) return 'text-yellow-400'
    return 'text-red-400'
  }

  const passwordStrength = getPasswordStrength(formData.newPassword)

  if (!formData.email || !formData.token) {
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
          className="w-full max-w-md mx-auto relative z-10"
        >
          <div className="auth-card">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold auth-text mb-4">Invalid Reset Link</h1>
              <p className="auth-text-muted mb-6">
                This password reset link is invalid or has expired. Please request a new one.
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
        className="w-full max-w-md mx-auto relative z-10"
        onKeyDown={handleKeyDown}
      >
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
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold auth-text mb-2 sm:mb-4 relative">
                    Reset Password
                  </h1>
                  <p className="auth-text-muted text-base sm:text-lg font-medium">
                    Enter your new password for <strong className="text-white">{formData.email}</strong>
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold auth-text mb-2 sm:mb-4 relative">
                    Password Reset Successful
                  </h1>
                  <p className="auth-text-muted text-base sm:text-lg font-medium">
                    Your password has been successfully reset. Logging you in automatically...
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
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-6"
                >
                  <div className="flex items-center space-x-2 text-red-400">
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
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      placeholder="Enter your new password"
                      className={`auth-input input-with-icon-left input-with-icon-right ${hasFieldError(errors, 'newPassword') ? 'auth-input-error' : ''}`}
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="input-icon-right auth-icon hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.newPassword && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs auth-text-muted">Password strength</span>
                        <span className={`text-xs font-medium ${getPasswordTextColor(passwordStrength.score)}`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {hasFieldError(errors, 'newPassword') && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{getFieldError(errors, 'newPassword')?.message}</span>
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
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      placeholder="Confirm your new password"
                      className={`auth-input input-with-icon-left input-with-icon-right ${hasFieldError(errors, 'confirmPassword') ? 'auth-input-error' : ''}`}
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="input-icon-right auth-icon hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  {hasFieldError(errors, 'confirmPassword') && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{getFieldError(errors, 'confirmPassword')?.message}</span>
                    </motion.div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
                  className="mt-8 w-full h-[48px] btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Resetting Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Security Notice */}
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="text-blue-400 text-sm">
                    <p className="font-medium mb-1">Password Requirements:</p>
                    <ul className="text-xs space-y-1 opacity-90">
                      <li>• At least 8 characters long</li>
                      <li>• Contains uppercase and lowercase letters</li>
                      <li>• Includes at least one number or special character</li>
                    </ul>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <div className="text-green-400 text-sm font-medium">
                    <p>Your password has been successfully reset and all existing sessions have been invalidated for security.</p>
                  </div>
                </div>

                {/* Action Button */}
                <ActionButton
                  label="Continue to Sign In"
                  onClick={handleButtonClick}
                  icon={ArrowRight}
                  size="md"
                  animated={false}
                  actionType="auth"
                  className="w-full h-[48px]"
                />
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}