import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, AlertCircle, Shield } from 'lucide-react'
import { useState } from 'react'

import { Modal, ActionButton, PasswordStrengthIndicator } from '@/shared/components'
import { apiClient } from '@/shared/services/apiClient'
import type { ValidationError } from '@/shared/utils/validation'
import {
  validatePassword,
  getFieldError,
  hasFieldError,
} from '@/shared/utils/validation'

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ChangePasswordModal = ({ isOpen, onClose }: ChangePasswordModalProps) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

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

  const isFormValid = () => {
    const passwordValidation = validatePassword(formData.newPassword)
    const passwordsMatch = formData.newPassword === formData.confirmPassword
    return passwordValidation.isValid && passwordsMatch && 
           formData.currentPassword.trim() !== '' && 
           formData.newPassword.trim() !== '' && 
           formData.confirmPassword.trim() !== ''
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

    if (formData.currentPassword.trim() === '') {
      newErrors.push({ field: 'currentPassword', message: 'Current password is required', code: 'REQUIRED' })
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      const response = await apiClient.changePassword(
        formData.currentPassword,
        formData.newPassword,
        formData.confirmPassword
      )

      if (response.success) {
        setIsSuccess(true)
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose()
          resetForm()
        }, 2000)
      } else {
        setApiError(response.error ?? 'Failed to change password')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Change password error:', error)
      setApiError('An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setErrors([])
    setApiError('')
    setIsSuccess(false)
    setIsSubmitting(false)
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
      resetForm()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isSuccess ? "Password Changed" : "Change Password"}
      subtitle={isSuccess ? "Your password has been updated successfully" : "Update your account password"}
      size="md"
    >
      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Password Updated!</h3>
          <p className="text-gray-400 mb-4">
            Your password has been changed successfully. For security, you&apos;ll need to sign in again on other devices.
          </p>
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="text-green-400 text-sm font-medium">
              All existing sessions have been invalidated for security.
            </div>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* API Error Message */}
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-red-500/10 border border-red-500/20"
            >
              <div className="flex items-center space-x-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{apiError}</span>
              </div>
            </motion.div>
          )}

          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-normal tracking-tight text-white/90 mb-2">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="Enter your current password"
                className={`w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 ${
                  hasFieldError(errors, 'currentPassword') ? 'border-red-500/50 focus:ring-red-500/50' : ''
                }`}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {hasFieldError(errors, 'currentPassword') && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center space-x-2 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{getFieldError(errors, 'currentPassword')?.message}</span>
              </motion.div>
            )}
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-normal tracking-tight text-white/90 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="Enter your new password"
                className={`w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 ${
                  hasFieldError(errors, 'newPassword') ? 'border-red-500/50 focus:ring-red-500/50' : ''
                }`}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                className="mt-2 flex items-center space-x-2 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{getFieldError(errors, 'newPassword')?.message}</span>
              </motion.div>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-normal tracking-tight text-white/90 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="Confirm your new password"
                className={`w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 ${
                  hasFieldError(errors, 'confirmPassword') ? 'border-red-500/50 focus:ring-red-500/50' : ''
                }`}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {hasFieldError(errors, 'confirmPassword') && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center space-x-2 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{getFieldError(errors, 'confirmPassword')?.message}</span>
              </motion.div>
            )}
          </div>

          {/* Password Requirements */}
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="text-blue-400 text-sm">
              <p className="font-medium mb-1">Password Requirements:</p>
              <ul className="text-xs space-y-1 opacity-90">
                <li>• At least 8 characters long</li>
                <li>• Contains uppercase and lowercase letters</li>
                <li>• Includes at least one number or special character</li>
              </ul>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <ActionButton
              label={isSubmitting ? 'Changing...' : 'Change Password'}
              onClick={() => {}}
              variant="primary"
              size="md"
              disabled={!isFormValid() || isSubmitting}
              loading={isSubmitting}
              actionType="general"
            />
          </div>
        </form>
      )}
    </Modal>
  )
}
