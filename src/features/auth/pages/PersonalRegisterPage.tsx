import { motion } from 'framer-motion'
import { User, Phone, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import type { ValidationError } from '@/shared/utils/validation'
import {
  validateRegistrationForm,
  getFieldError,
  hasFieldError,
  validateField,
} from '@/shared/utils/validation'
import { mockApi } from '@/shared/services/mockApi'
import { useAuthActions } from '@/shared/contexts/AuthContext'

export const PersonalRegisterPage = () => {
  const navigate = useNavigate()
  const { login } = useAuthActions()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')

  // Form validation helper
  const isFormValid = () => {
    const validation = validateRegistrationForm(formData)
    return (
      validation.isValid &&
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.password.trim() !== ''
    )
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
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Validate field when user leaves it
    const fieldValidation = validateField(name, value)
    if (!fieldValidation.isValid) {
      setErrors(prev => [...prev.filter(error => error.field !== name), ...fieldValidation.errors])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setApiError('')

    // Final validation check before submission
    const validation = validateRegistrationForm(formData)

    if (!validation.isValid) {
      setErrors(validation.errors)
      setIsSubmitting(false)
      return
    }

    setErrors([])

    try {
      // Call mock API
      const response = await mockApi.register({
        ...formData,
        accountType: 'personal',
      })

      if (response.success && response.data) {
        // Log the user in automatically
        login(response.data.user, response.data.token)

        // Navigate to get-started page
        navigate('/get-started')
      } else {
        setApiError(response.error ?? 'Registration failed')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Registration error:', error)
      setApiError('An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
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
        className="auth-card"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="gradient-header" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative"
          >
            <h1 className="text-4xl font-bold auth-text mb-4 relative">Create Personal Account</h1>
            <p className="auth-text-muted text-lg font-medium">Join the Round community</p>
          </motion.div>
        </div>

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

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={formData.firstName}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="John"
                  className={`auth-input input-with-icon-left ${hasFieldError(errors, 'firstName') ? 'auth-input-error' : ''}`}
                  required
                />
              </div>
              {hasFieldError(errors, 'firstName') && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{getFieldError(errors, 'firstName')?.message}</span>
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
                  value={formData.lastName}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="Doe"
                  className={`auth-input input-with-icon-left ${hasFieldError(errors, 'lastName') ? 'auth-input-error' : ''}`}
                  required
                />
              </div>
              {hasFieldError(errors, 'lastName') && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{getFieldError(errors, 'lastName')?.message}</span>
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
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="example@gmail.com"
                className={`auth-input input-with-icon-left ${hasFieldError(errors, 'email') ? 'auth-input-error' : ''}`}
                required
              />
            </div>
            {hasFieldError(errors, 'email') && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{getFieldError(errors, 'email')?.message}</span>
              </motion.div>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="auth-label">
              Phone Number
            </label>
            <div className="input-container">
              <Phone className="input-icon-left auth-icon-primary" />
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="+30 698 123 4567"
                className={`auth-input input-with-icon-left ${hasFieldError(errors, 'phone') ? 'auth-input-error' : ''}`}
                required
              />
            </div>
            {hasFieldError(errors, 'phone') && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{getFieldError(errors, 'phone')?.message}</span>
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
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="Create a strong password"
                className={`auth-input input-with-icon-left input-with-icon-right ${hasFieldError(errors, 'password') ? 'auth-input-error' : ''}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="input-icon-right auth-icon hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {hasFieldError(errors, 'password') && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{getFieldError(errors, 'password')?.message}</span>
              </motion.div>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="text-center">
            <p className="text-sm auth-text-muted">
              By creating an account you accept Round&apos;s{' '}
              <Link to="/terms" className="auth-link">
                terms and conditions
              </Link>
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !isFormValid()}
            className={`w-full btn-primary text-lg py-4 mt-8 ${isSubmitting || !isFormValid() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="flex items-center justify-center space-x-2">
              <span>{isSubmitting ? 'Creating Account...' : 'Create Personal Account'}</span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              >
                →
              </motion.span>
            </span>
          </button>

          {/* Divider */}
          <div className="auth-divider">
            <span>or</span>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              className="btn-secondary flex items-center justify-center space-x-3 py-4 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12" />
              <svg className="w-5 h-5 z-10" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-semibold z-10">Google</span>
            </button>

            <button
              type="button"
              className="btn-secondary flex items-center justify-center space-x-3 py-4 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12" />
              <svg className="w-5 h-5 z-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="font-semibold z-10">Facebook</span>
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="auth-text-muted">
              Already have an account?{' '}
              <Link to="/auth/login" className="auth-link brand-primary">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
