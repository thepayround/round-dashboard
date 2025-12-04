import { AlertCircle, Eye, EyeOff, Lock, Shield } from 'lucide-react'

import { useChangePasswordController } from '../hooks/useChangePasswordController'

import { PasswordStrengthIndicator } from '@/shared/ui/PasswordStrengthIndicator'
import { Alert, AlertDescription } from '@/shared/ui/shadcn/alert'
import { Button } from '@/shared/ui/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/shadcn/dialog'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Change Password</span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Update your account credentials</p>
        </DialogHeader>

        <form onSubmit={event => handleSubmit(event)} className="space-y-6 pt-4">
          {isSuccess && (
            <Alert className="bg-success/10 border-success/20" role="alert">
              <AlertDescription className="text-success">
                Your password has been updated successfully.
              </AlertDescription>
            </Alert>
          )}

          {apiError && (
            <Alert variant="destructive" role="alert" aria-live="polite">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="modal-current-password">
                Current Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="modal-current-password"
                  type={visibility.currentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange('currentPassword')}
                  onBlur={handleInputBlur('currentPassword')}
                  placeholder="Enter current password"
                  className="pl-10 pr-10"
                  required
                  aria-required="true"
                  aria-invalid={hasFieldError(errors, 'currentPassword')}
                  aria-describedby={
                    hasFieldError(errors, 'currentPassword')
                      ? 'modal-current-password-error'
                      : undefined
                  }
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility('currentPassword')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={visibility.currentPassword ? 'Hide current password' : 'Show current password'}
                >
                  {visibility.currentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {hasFieldError(errors, 'currentPassword') && (
                <p
                  id="modal-current-password-error"
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {getFieldError(errors, 'currentPassword')?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="modal-new-password">
                New Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="modal-new-password"
                  type={visibility.newPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange('newPassword')}
                  onBlur={handleInputBlur('newPassword')}
                  placeholder="Create new password"
                  className="pl-10 pr-10"
                  required
                  aria-required="true"
                  aria-invalid={hasFieldError(errors, 'newPassword')}
                  aria-describedby={
                    hasFieldError(errors, 'newPassword')
                      ? 'modal-new-password-error'
                      : 'modal-new-password-strength'
                  }
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility('newPassword')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={visibility.newPassword ? 'Hide new password' : 'Show new password'}
                >
                  {visibility.newPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {hasFieldError(errors, 'newPassword') && (
                <p
                  id="modal-new-password-error"
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {getFieldError(errors, 'newPassword')?.message}
                </p>
              )}
              {formData.newPassword && (
                <div className="mt-3" id="modal-new-password-strength">
                  <PasswordStrengthIndicator password={formData.newPassword} showStrengthBar />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="modal-confirm-password">
                Confirm Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="modal-confirm-password"
                  type={visibility.confirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  onBlur={handleInputBlur('confirmPassword')}
                  placeholder="Confirm new password"
                  className="pl-10 pr-10"
                  required
                  aria-required="true"
                  aria-invalid={hasFieldError(errors, 'confirmPassword')}
                  aria-describedby={
                    hasFieldError(errors, 'confirmPassword')
                      ? 'modal-confirm-password-error'
                      : undefined
                  }
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility('confirmPassword')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={visibility.confirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {visibility.confirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {hasFieldError(errors, 'confirmPassword') && (
                <p
                  id="modal-confirm-password-error"
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {getFieldError(errors, 'confirmPassword')?.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmit()}
              disabled={disableSubmit}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
