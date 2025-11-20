import { AlertCircle, Eye, EyeOff, Lock, Shield } from 'lucide-react'

import { useChangePasswordController } from '../hooks/useChangePasswordController'

import { Input } from '@/shared/ui'
import { ActionButton } from '@/shared/ui/ActionButton'
import { Button, PlainButton } from '@/shared/ui/Button'
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
          <div className="bg-primary/10 border border-primary/30 rounded-xl px-4 py-3 text-[#fda4af] text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-primary mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <Input
              id="modal-current-password"
              type={visibility.currentPassword ? 'text' : 'password'}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange('currentPassword')}
              onBlur={handleInputBlur('currentPassword')}
              placeholder="Enter current password"
              label="Current Password"
              leftIcon={Lock}
              error={hasFieldError(errors, 'currentPassword') ? getFieldError(errors, 'currentPassword')?.message : undefined}
              required
              disabled={isLoading}
              className="pr-9"
            />
            <PlainButton
              type="button"
              onClick={() => toggleVisibility('currentPassword')}
              className="absolute right-3 top-[38px] z-10 flex items-center justify-center cursor-pointer transition-colors duration-200 text-auth-icon hover:text-white/90"
              aria-label={visibility.currentPassword ? 'Hide current password' : 'Show current password'}
              unstyled
            >
              {visibility.currentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </PlainButton>
          </div>

          <div className="relative">
            <Input
              id="modal-new-password"
              type={visibility.newPassword ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange('newPassword')}
              onBlur={handleInputBlur('newPassword')}
              placeholder="Create new password"
              label="New Password"
              leftIcon={Lock}
              error={hasFieldError(errors, 'newPassword') ? getFieldError(errors, 'newPassword')?.message : undefined}
              required
              disabled={isLoading}
              className="pr-9"
            />
            <PlainButton
              type="button"
              onClick={() => toggleVisibility('newPassword')}
              className="absolute right-3 top-[38px] z-10 flex items-center justify-center cursor-pointer transition-colors duration-200 text-auth-icon hover:text-white/90"
              aria-label={visibility.newPassword ? 'Hide new password' : 'Show new password'}
              unstyled
            >
              {visibility.newPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </PlainButton>
            {formData.newPassword && (
              <div className="mt-3">
                <PasswordStrengthIndicator password={formData.newPassword} showStrengthBar />
              </div>
            )}
          </div>

          <div className="relative">
            <Input
              id="modal-confirm-password"
              type={visibility.confirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              onBlur={handleInputBlur('confirmPassword')}
              placeholder="Confirm new password"
              label="Confirm Password"
              leftIcon={Lock}
              error={hasFieldError(errors, 'confirmPassword') ? getFieldError(errors, 'confirmPassword')?.message : undefined}
              required
              disabled={isLoading}
              className="pr-9"
            />
            <PlainButton
              type="button"
              onClick={() => toggleVisibility('confirmPassword')}
              className="absolute right-3 top-[38px] z-10 flex items-center justify-center cursor-pointer transition-colors duration-200 text-auth-icon hover:text-white/90"
              aria-label={visibility.confirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              unstyled
            >
              {visibility.confirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </PlainButton>
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
