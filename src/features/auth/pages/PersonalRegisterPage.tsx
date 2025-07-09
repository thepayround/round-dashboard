import { motion } from 'framer-motion'
import { User, Phone, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import type { ValidationError } from '@/shared/utils/validation'
import {
  validateRegistrationForm,
  getFieldError,
  hasFieldError,
  validateField,
} from '@/shared/utils/validation'

export const PersonalRegisterPage = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Final validation check before submission
    const validation = validateRegistrationForm(formData)

    if (!validation.isValid) {
      setErrors(validation.errors)
      setIsSubmitting(false)
      return
    }

    setErrors([])

    // TODO: Implement personal registration logic
    console.warn('Personal registration data:', {
      accountType: 'personal',
      ...formData,
    })

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // TODO: Handle successful registration
    }, 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
        delay: 0.1,
      }}
      className="auth-card"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="gradient-header" />
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-4xl font-bold auth-text mb-3"
        >
          Create Personal Account
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="auth-text-muted text-lg"
        >
          Join the Round community
        </motion.p>
      </div>

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
              className="mt-2 flex items-center space-x-2 text-amber-300 text-sm font-medium"
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
              className="mt-2 flex items-center space-x-2 text-amber-300 text-sm font-medium"
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
              className="mt-2 flex items-center space-x-2 text-amber-300 text-sm font-medium"
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
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className={`w-full btn-primary text-lg py-4 mt-8 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="flex items-center justify-center space-x-2">
            <span>{isSubmitting ? 'Creating Account...' : 'Create Personal Account'}</span>
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            >
              ✨
            </motion.span>
          </span>
        </motion.button>

        {/* Login Link */}
        <div className="text-center">
          <p className="auth-text-muted">
            Already have an account?{' '}
            <Link to="/auth/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  )
}
