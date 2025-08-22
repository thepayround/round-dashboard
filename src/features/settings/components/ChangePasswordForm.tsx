import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, CheckCircle, AlertCircle, ChevronDown, Loader2 } from 'lucide-react'
import { AuthInput } from '@/shared/components/AuthInput'
import { ActionButton } from '@/shared/components'
import { apiClient } from '@/shared/services/apiClient'

interface ChangePasswordFormProps {
  className?: string
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    setError(null)
    setIsSuccess(false)
  }

  const handleSubmitClick = async () => {
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent
    await handleSubmit(fakeEvent)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Client-side validation
      if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
        throw new Error('All fields are required')
      }

      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error('New passwords do not match')
      }

      if (formData.newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters long')
      }

      const response = await apiClient.changePassword(
        formData.currentPassword,
        formData.newPassword,
        formData.confirmPassword
      )

      if (response.success) {
        setIsSuccess(true)
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        
        // Auto-collapse form after success
        setTimeout(() => {
          setIsExpanded(false)
          setIsSuccess(false)
        }, 3000)
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

  const handleCancel = () => {
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setError(null)
    setIsSuccess(false)
    setIsExpanded(false)
  }

  return (
    <div className={`${className}`}>
      {/* Header Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30 group-hover:bg-blue-500/30 transition-colors">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-white font-medium">Change Password</h3>
            <p className="text-gray-400 text-sm">Update your account password</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>

      {/* Expandable Form */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              {/* Success State */}
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-400/30"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <div>
                      <h4 className="text-green-400 font-medium">Password Updated Successfully!</h4>
                      <p className="text-green-300/80 text-sm mt-1">
                        Your password has been changed. For security, you&apos;ll need to sign in again on other devices.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error State */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-400/30"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <div>
                      <h4 className="text-red-400 font-medium">Password Change Failed</h4>
                      <p className="text-red-300/80 text-sm mt-1">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  {/* Current Password */}
                  <AuthInput
                    label="Current Password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={handleInputChange('currentPassword')}
                    placeholder="Enter your current password"
                    required
                    disabled={isLoading}
                    rightIcon={showCurrentPassword ? EyeOff : Eye}
                    onRightIconClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  />

                  {/* New Password */}
                  <AuthInput
                    label="New Password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={handleInputChange('newPassword')}
                    placeholder="Enter your new password"
                    required
                    disabled={isLoading}
                    rightIcon={showNewPassword ? EyeOff : Eye}
                    onRightIconClick={() => setShowNewPassword(!showNewPassword)}
                    hint="Must be at least 8 characters long"
                  />

                  {/* Confirm New Password */}
                  <AuthInput
                    label="Confirm New Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    placeholder="Confirm your new password"
                    required
                    disabled={isLoading}
                    rightIcon={showConfirmPassword ? EyeOff : Eye}
                    onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <ActionButton
                    label={isLoading ? 'Changing...' : 'Change Password'}
                    onClick={handleSubmitClick}
                    disabled={isLoading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    icon={isLoading ? Loader2 : undefined}
                  />
                  <ActionButton
                    label="Cancel"
                    onClick={handleCancel}
                    disabled={isLoading}
                    variant="secondary"
                    size="sm"
                    className="px-6"
                  />
                </div>
              </form>

              {/* Security Tips */}
              <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
                <h4 className="text-blue-400 font-medium mb-2">Security Tips</h4>
                <ul className="text-blue-300/80 text-sm space-y-1">
                  <li>• Use a unique password you don&apos;t use elsewhere</li>
                  <li>• Include uppercase, lowercase, numbers, and special characters</li>
                  <li>• Avoid common words or personal information</li>
                  <li>• Consider using a password manager</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
