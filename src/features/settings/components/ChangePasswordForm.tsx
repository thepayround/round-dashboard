import { motion } from 'framer-motion'
import { Eye, EyeOff, CheckCircle, AlertCircle, Lock, RotateCcw, Shield } from 'lucide-react'

import { useChangePasswordController } from '../hooks/useChangePasswordController'

import { ActionButton } from '@/shared/ui/ActionButton'
import { IconButton } from '@/shared/ui/Button'
import { PasswordStrengthIndicator } from '@/shared/ui/PasswordStrengthIndicator'
import { getFieldError, hasFieldError } from '@/shared/utils/validation'


interface ChangePasswordFormProps {
  className?: string
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ className = '' }) => {
  const {
    formData,
    errors,
    apiError,
    isLoading,
    isSuccess,
    visibility,
    handleInputChange,
    handleInputBlur,
    toggleVisibility,
    handleSubmit,
    handleReset,
    disableSubmit,
  } = useChangePasswordController()

  return (
    <div className={`bg-[#0F1115] border border-white/5 rounded-2xl p-6 md:p-8 lg:p-10 shadow-2xl shadow-primary/5 ${className}`}>
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#D417C8]/15 mb-5 border border-[#D417C8]/30">
          <Lock className="w-6 h-6 text-[#D417C8]" />
        </div>
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/[0.03] px-3 py-1 rounded-full border border-white/[0.08] text-white/70 text-sm">
            <Shield className="w-4 h-4" />
            Enhanced security enabled
          </div>
          <div>
            <h2 className="text-2xl font-normal tracking-tight text-white">Secure Password Update</h2>
            <p className="text-gray-400 text-sm mt-2 max-w-lg mx-auto">
              Update your password regularly to keep your account secure. New passwords must meet strict security requirements.
            </p>
          </div>
        </div>
      </div>

      {isSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-emerald-50 text-sm mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <div>
              <h4 className="text-white font-medium mb-1">Password changed successfully</h4>
              <p className="text-emerald-50/80 text-sm">A confirmation email has been sent to your account.</p>
            </div>
          </div>
        </div>
      )}

      {apiError && (
        <div className="bg-[#D417C8]/10 border border-[#D417C8]/30 rounded-2xl p-4 text-[#fda4af] text-sm mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-[#D417C8]" />
            <div>
              <h4 className="text-white font-medium mb-1">Failed to change password</h4>
              <p className="text-[#fda4af]/80 text-sm">{apiError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto">
        <form onSubmit={event => handleSubmit(event)} className="space-y-6">
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
                  type={visibility.currentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange('currentPassword')}
                  onBlur={handleInputBlur('currentPassword')}
                  placeholder="Enter your current password"
                  className={`auth-input input-with-icon-left input-with-icon-right ${hasFieldError(errors, 'currentPassword') ? 'auth-input-error' : ''}`}
                  required
                  disabled={isLoading}
                />
                <IconButton
                  type="button"
                  onClick={() => toggleVisibility('currentPassword')}
                  icon={visibility.currentPassword ? EyeOff : Eye}
                  variant="ghost"
                  size="md"
                  aria-label={visibility.currentPassword ? 'Hide current password' : 'Show current password'}
                  className="input-icon-right"
                />
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

          <div className="p-4 bg-white/[0.02] rounded-lg border border-white/8">
            <h3 className="text-sm font-normal tracking-tight text-white mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              New Password
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="auth-label">
                  New Password
                </label>
                <div className="input-container">
                  <Lock className="input-icon-left auth-icon-primary" />
                  <input
                    id="newPassword"
                    type={visibility.newPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange('newPassword')}
                    onBlur={handleInputBlur('newPassword')}
                    placeholder="Enter new password"
                    className={`auth-input input-with-icon-left input-with-icon-right ${hasFieldError(errors, 'newPassword') ? 'auth-input-error' : ''}`}
                    required
                    disabled={isLoading}
                  />
                  <IconButton
                    type="button"
                    onClick={() => toggleVisibility('newPassword')}
                    icon={visibility.newPassword ? EyeOff : Eye}
                    variant="ghost"
                    size="md"
                    aria-label={visibility.newPassword ? 'Hide new password' : 'Show new password'}
                    className="input-icon-right"
                  />
                </div>

                {formData.newPassword && (
                  <div className="mt-3">
                    <PasswordStrengthIndicator password={formData.newPassword} showStrengthBar />
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

              <div>
                <label htmlFor="confirmPassword" className="auth-label">
                  Confirm New Password
                </label>
                <div className="input-container">
                  <Lock className="input-icon-left auth-icon-primary" />
                  <input
                    id="confirmPassword"
                    type={visibility.confirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    onBlur={handleInputBlur('confirmPassword')}
                    placeholder="Confirm new password"
                    className={`auth-input input-with-icon-left input-with-icon-right ${hasFieldError(errors, 'confirmPassword') ? 'auth-input-error' : ''}`}
                    required
                    disabled={isLoading}
                  />
                  <IconButton
                    type="button"
                    onClick={() => toggleVisibility('confirmPassword')}
                    icon={visibility.confirmPassword ? EyeOff : Eye}
                    variant="ghost"
                    size="md"
                    aria-label={visibility.confirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    className="input-icon-right"
                  />
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
              onClick={() => handleSubmit()}
              disabled={disableSubmit}
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
