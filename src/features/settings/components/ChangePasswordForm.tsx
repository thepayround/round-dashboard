import { Eye, EyeOff, CheckCircle, AlertCircle, Lock, RotateCcw, Shield } from 'lucide-react'

import { useChangePasswordController } from '../hooks/useChangePasswordController'

import { Badge } from '@/shared/ui'
import { PasswordStrengthIndicator } from '@/shared/ui/PasswordStrengthIndicator'
import { Button } from '@/shared/ui/shadcn/button'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
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
    <div className={`bg-input border border-white/5 rounded-2xl p-6 md:p-8 lg:p-10 shadow-2xl shadow-primary/5 ${className}`}>
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 mb-6 border border-primary/30">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <div className="space-y-4">
          <Badge variant="secondary" className="inline-flex items-center gap-2 px-4 py-2">
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
        <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4 text-destructive text-sm mb-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-4 h-4 text-primary" />
            <div>
              <h4 className="text-white font-medium mb-1">Failed to change password</h4>
              <p className="text-destructive/80 text-sm">{apiError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto">
        <form onSubmit={event => handleSubmit(event)} className="space-y-6">
          <div className="p-4 bg-white/[0.02] rounded-lg border border-white/8">
            <h3 className="text-sm font-normal tracking-tight text-white mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-400" />
              Current Password
            </h3>
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-sm text-white/80">
                Enter Current Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="currentPassword"
                  type={visibility.currentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange('currentPassword')}
                  onBlur={handleInputBlur('currentPassword')}
                  placeholder="Enter your current password"
                  required
                  disabled={isLoading}
                  className="pl-10 pr-10"
                  aria-invalid={hasFieldError(errors, 'currentPassword')}
                  aria-describedby={hasFieldError(errors, 'currentPassword') ? 'currentPassword-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility('currentPassword')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center cursor-pointer transition-colors duration-200 text-gray-400 hover:text-white/90"
                  aria-label={visibility.currentPassword ? 'Hide current password' : 'Show current password'}
                >
                  {visibility.currentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {hasFieldError(errors, 'currentPassword') && (
                <p id="currentPassword-error" className="text-sm text-destructive">
                  {getFieldError(errors, 'currentPassword')?.message}
                </p>
              )}
            </div>
          </div>

          <div className="p-4 bg-white/[0.02] rounded-lg border border-white/8">
            <h3 className="text-sm font-normal tracking-tight text-white mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              New Password
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm text-white/80">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="newPassword"
                    type={visibility.newPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange('newPassword')}
                    onBlur={handleInputBlur('newPassword')}
                    placeholder="Enter new password"
                    required
                    disabled={isLoading}
                    className="pl-10 pr-10"
                    aria-invalid={hasFieldError(errors, 'newPassword')}
                    aria-describedby={hasFieldError(errors, 'newPassword') ? 'newPassword-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility('newPassword')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center cursor-pointer transition-colors duration-200 text-gray-400 hover:text-white/90"
                    aria-label={visibility.newPassword ? 'Hide new password' : 'Show new password'}
                  >
                    {visibility.newPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {hasFieldError(errors, 'newPassword') && (
                  <p id="newPassword-error" className="text-sm text-destructive">
                    {getFieldError(errors, 'newPassword')?.message}
                  </p>
                )}
                {formData.newPassword && (
                  <div className="mt-3">
                    <PasswordStrengthIndicator password={formData.newPassword} showStrengthBar />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm text-white/80">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={visibility.confirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    onBlur={handleInputBlur('confirmPassword')}
                    placeholder="Confirm new password"
                    required
                    disabled={isLoading}
                    className="pl-10 pr-10"
                    aria-invalid={hasFieldError(errors, 'confirmPassword')}
                    aria-describedby={hasFieldError(errors, 'confirmPassword') ? 'confirmPassword-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility('confirmPassword')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center cursor-pointer transition-colors duration-200 text-gray-400 hover:text-white/90"
                    aria-label={visibility.confirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {visibility.confirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {hasFieldError(errors, 'confirmPassword') && (
                  <p id="confirmPassword-error" className="text-sm text-destructive">
                    {getFieldError(errors, 'confirmPassword')?.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <Button
              onClick={handleReset}
              disabled={isLoading}
              variant="secondary"
              size="sm"
              className="px-6"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={() => handleSubmit()}
              disabled={disableSubmit}
              size="sm"
              className="px-6"
            >
              {isLoading ? 'Changing...' : 'Change Password'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
