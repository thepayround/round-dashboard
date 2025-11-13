import { AlertCircle, Eye, EyeOff, Lock, Shield } from 'lucide-react'

import { useChangePasswordController } from '../hooks/useChangePasswordController'

import { ActionButton } from '@/shared/ui/ActionButton'
import { Button, IconButton } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { PasswordStrengthIndicator } from '@/shared/ui/PasswordStrengthIndicator'
import { getFieldError, hasFieldError } from '@/shared/utils/validation'


interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ChangePasswordModal = ({ isOpen, onClose }: ChangePasswordModalProps) => {
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

  const handleClose = () => {
    handleReset()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Change Password"
      subtitle="Update your account credentials"
      icon={Shield}
      size="md"
    >
      <form onSubmit={event => handleSubmit(event)} className="space-y-6">
        {isSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 text-emerald-50 text-sm">
            Your password has been updated successfully.
          </div>
        )}

        {apiError && (
          <div className="bg-[#D417C8]/10 border border-[#D417C8]/30 rounded-xl px-4 py-3 text-[#fda4af] text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#D417C8] mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="modal-current-password" className="auth-label">
              Current Password
            </label>
            <div className="input-container">
              <Lock className="input-icon-left auth-icon-primary" />
              <input
                id="modal-current-password"
                type={visibility.currentPassword ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange('currentPassword')}
                onBlur={handleInputBlur('currentPassword')}
                placeholder="Enter current password"
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
              <p className="text-sm text-[#D417C8] mt-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {getFieldError(errors, 'currentPassword')?.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="modal-new-password" className="auth-label">
              New Password
            </label>
            <div className="input-container">
              <Lock className="input-icon-left auth-icon-primary" />
              <input
                id="modal-new-password"
                type={visibility.newPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange('newPassword')}
                onBlur={handleInputBlur('newPassword')}
                placeholder="Create new password"
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
              <p className="text-sm text-[#D417C8] mt-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {getFieldError(errors, 'newPassword')?.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="modal-confirm-password" className="auth-label">
              Confirm Password
            </label>
            <div className="input-container">
              <Lock className="input-icon-left auth-icon-primary" />
              <input
                id="modal-confirm-password"
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
              <p className="text-sm text-[#D417C8] mt-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {getFieldError(errors, 'confirmPassword')?.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <ActionButton
            label={isLoading ? 'Updating...' : 'Update Password'}
            onClick={() => handleSubmit()}
            disabled={disableSubmit}
            loading={isLoading}
            actionType="general"
          />
        </div>
      </form>
    </Modal>
  )
}
