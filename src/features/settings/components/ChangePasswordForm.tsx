import { motion } from 'framer-motion'
import { Eye, EyeOff, CheckCircle, AlertCircle, Lock, RotateCcw } from 'lucide-react'
import { useState } from 'react'

import { ActionButton, PasswordStrengthIndicator } from '@/shared/components'
import { apiClient } from '@/shared/services/apiClient'
import {
  validatePassword,
  getFieldError,
  hasFieldError,
  type ValidationError
} from '@/shared/utils/validation'

interface ChangePasswordFormProps {
  className?: string
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ className = '' }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<ValidationError[]>([])
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    setError(null)
    setIsSuccess(false)

    // Clear field error when user starts typing
    if (hasFieldError(errors, field)) {
      setErrors(prev => prev.filter(error => error.field !== field))
    }

    // If changing new password, also clear confirm password errors
    if (field === 'newPassword' && hasFieldError(errors, 'confirmPassword')) {
      setErrors(prev => prev.filter(error => error.field !== 'confirmPassword'))
    }
  }

  const handleInputBlur = (field: keyof typeof formData) => (e: React.FocusEvent<HTMLInputElement>) => {
    const { value } = e.target

    // Don't validate empty fields on blur
    if (!value?.trim()) {
      return
    }

    // Validate field when user leaves it
    if (field === 'currentPassword') {
      const fieldValidation = validatePassword(value)
      if (!fieldValidation.isValid) {
        // Map the field name from 'password' to 'currentPassword'
        const mappedErrors = fieldValidation.errors.map(error => ({
          ...error,
          field: 'currentPassword'
        }))
        setErrors(prev => [...prev.filter(error => error.field !== field), ...mappedErrors])
      }
    } else if (field === 'newPassword') {
      const fieldValidation = validatePassword(value)
      if (!fieldValidation.isValid) {
        // Map the field name from 'password' to 'newPassword'
        const mappedErrors = fieldValidation.errors.map(error => ({
          ...error,
          field: 'newPassword'
        }))
        setErrors(prev => [...prev.filter(error => error.field !== field), ...mappedErrors])
      }
    } else if (field === 'confirmPassword') {
      // Validate password confirmation
      if (value && value !== formData.newPassword) {
        setErrors(prev => [
          ...prev.filter(error => error.field !== field),
          { field: 'confirmPassword', message: 'Passwords do not match', code: 'PASSWORD_MISMATCH' }
        ])
      }
    }
  }

  const handleSubmitClick = () => {
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent
    handleSubmit(fakeEvent)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Client-side validation - use the same validation as registration
      if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
        throw new Error('All fields are required')
      }

      // Validate new password using registration validation
      const passwordValidation = validatePassword(formData.newPassword)
      if (!passwordValidation.isValid) {
        // Map the field name from 'password' to 'newPassword'
        const mappedErrors = passwordValidation.errors.map(error => ({
          ...error,
          field: 'newPassword'
        }))
        setErrors(mappedErrors)
        setIsLoading(false)
        return
      }

      // Validate password confirmation
      if (formData.newPassword !== formData.confirmPassword) {
        setErrors([{ field: 'confirmPassword', message: 'Passwords do not match', code: 'PASSWORD_MISMATCH' }])
        return
      }

      const response = await apiClient.changePassword(
        formData.currentPassword,
        formData.newPassword,
        formData.confirmPassword
      )

      if (response.success) {
        setIsSuccess(true)
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setErrors([])
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setIsSuccess(false)
        }, 5000)
      } else {
        throw new Error(response.message ?? 'Failed to change password')
      }
      
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string }
      setError(error.response?.data?.message ?? error.message ?? 'Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setError(null)
    setIsSuccess(false)
    setErrors([])
  }

  return (
    <div className={`${className}`}>
      {/* Success State */}
      {isSuccess && (
        <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
            <div>
              <h4 className="text-green-400 font-normal text-xs">Password updated successfully</h4>
              <p className="text-green-300/80 text-sm mt-0.5">
                Your password has been changed securely.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
            <div>
              <h4 className="text-red-400 font-normal text-xs">Password change failed</h4>
              <p className="text-red-300/80 text-sm mt-0.5">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password Section */}
          <div className="p-4 bg-white/[0.02] rounded-lg border border-white/8">
            <h3 className="text-sm font-normal tracking-tight text-white mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-400" />
              Current Password
            </h3>
            <div>
              <label htmlFor="currentPassword" className="auth-label">
                Enter Current Password
              </label>
              <div className="input-container">
                <Lock className="input-icon-left auth-icon-primary" />
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange('currentPassword')}
                  onBlur={handleInputBlur('currentPassword')}
                  placeholder="Enter your current password"
                  className={`auth-input input-with-icon-left input-with-icon-right ${hasFieldError(errors, 'currentPassword') ? 'auth-input-error' : ''}`}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="input-icon-right auth-icon hover:text-gray-600 transition-colors"
                >
                  {showCurrentPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {hasFieldError(errors, 'currentPassword') && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{getFieldError(errors, 'currentPassword')?.message}</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* New Password Section */}
          <div className="p-4 bg-white/[0.02] rounded-lg border border-white/8">
            <h3 className="text-sm font-normal tracking-tight text-white mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              New Password
            </h3>
            <div className="space-y-4">
              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="auth-label">
                  New Password
                </label>
                <div className="input-container">
                  <Lock className="input-icon-left auth-icon-primary" />
                  <input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange('newPassword')}
                    onBlur={handleInputBlur('newPassword')}
                    placeholder="Enter new password"
                    className={`auth-input input-with-icon-left input-with-icon-right ${hasFieldError(errors, 'newPassword') ? 'auth-input-error' : ''}`}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="input-icon-right auth-icon hover:text-gray-600 transition-colors"
                  >
                    {showNewPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <div className="mt-3">
                    <PasswordStrengthIndicator 
                      password={formData.newPassword}
                      showStrengthBar
                    />
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

              {/* Confirm New Password */}
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
                    onChange={handleInputChange('confirmPassword')}
                    onBlur={handleInputBlur('confirmPassword')}
                    placeholder="Confirm new password"
                    className={`auth-input input-with-icon-left input-with-icon-right ${hasFieldError(errors, 'confirmPassword') ? 'auth-input-error' : ''}`}
                    required
                    disabled={isLoading}
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
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 pt-2">
            <ActionButton
              label="Reset"
              onClick={handleReset}
              disabled={isLoading}
              variant="secondary"
              size="sm"
              icon={RotateCcw}
              actionType="general"
              className="px-6"
            />
            <ActionButton
              label={isLoading ? 'Changing...' : 'Change Password'}
              onClick={handleSubmitClick}
              disabled={isLoading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
              size="sm"
              actionType="general"
              loading={isLoading}
              className="px-6"
            />
          </div>
        </form>
      </div>
    </div>
  )
}
