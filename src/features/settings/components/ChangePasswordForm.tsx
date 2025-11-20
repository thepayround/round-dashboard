import { Eye, EyeOff, CheckCircle, AlertCircle, Lock, RotateCcw, Shield } from 'lucide-react'

import { useChangePasswordController } from '../hooks/useChangePasswordController'

import { Input, Badge } from '@/shared/ui'
import { ActionButton } from '@/shared/ui/ActionButton'
import { PlainButton } from '@/shared/ui/Button'
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
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 mb-5 border border-primary/30">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <div className="space-y-3">
          <Badge variant="info" size="lg" className="inline-flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Enhanced security enabled
          </Badge>
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
          <div className="flex items-start gap-4">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <div>
              <h4 className="text-white font-medium mb-1">Password changed successfully</h4>
              <p className="text-emerald-50/80 text-sm">A confirmation email has been sent to your account.</p>
            </div>
          </div>
        </div>
      )}

      {apiError && (
        <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4 text-[#fda4af] text-sm mb-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-4 h-4 text-primary" />
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
            <div className="relative">
              <Input
                id="currentPassword"
                type={visibility.currentPassword ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange('currentPassword')}
                onBlur={handleInputBlur('currentPassword')}
                placeholder="Enter your current password"
                label="Enter Current Password"
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
          </div>

          <div className="p-4 bg-white/[0.02] rounded-lg border border-white/8">
            <h3 className="text-sm font-normal tracking-tight text-white mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              New Password
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <Input
                  id="newPassword"
                  type={visibility.newPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange('newPassword')}
                  onBlur={handleInputBlur('newPassword')}
                  placeholder="Enter new password"
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
                  id="confirmPassword"
                  type={visibility.confirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  onBlur={handleInputBlur('confirmPassword')}
                  placeholder="Confirm new password"
                  label="Confirm New Password"
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
          </div>

          <div className="flex justify-center gap-4 pt-2">
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
              isLoading={isLoading}
              className="px-6"
            />
          </div>
        </form>
      </div>
    </div>
  )
}
