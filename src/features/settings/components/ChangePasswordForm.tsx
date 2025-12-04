import {
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Lock,
  RotateCcw,
} from 'lucide-react'

import { useChangePasswordController } from '../hooks/useChangePasswordController'

import { PasswordStrengthIndicator } from '@/shared/ui/PasswordStrengthIndicator'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/shadcn/alert'
import { Button } from '@/shared/ui/shadcn/button'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
import { cn } from '@/shared/utils/cn'
import { getFieldError, hasFieldError } from '@/shared/utils/validation'

interface ChangePasswordFormProps {
  className?: string
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  className = '',
}) => {
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
    <div className={cn('space-y-6', className)}>
      {/* Success Alert */}
      {isSuccess && (
        <Alert className="bg-success/10 border-success/20">
          <CheckCircle className="h-4 w-4 text-success" />
          <AlertTitle>Password changed successfully</AlertTitle>
          <AlertDescription>
            A confirmation email has been sent to your account.
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {apiError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to change password</AlertTitle>
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={(event) => handleSubmit(event)} className="space-y-6">
        {/* Current Password Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Lock className="h-4 w-4 text-muted-foreground" />
            Current Password
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="currentPassword"
              className="text-sm text-muted-foreground"
            >
              Enter Current Password
            </Label>
            <div className="relative">
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
                className={cn(
                  'pr-10',
                  hasFieldError(errors, 'currentPassword') &&
                    'border-destructive focus-visible:ring-destructive'
                )}
                aria-invalid={hasFieldError(errors, 'currentPassword')}
                aria-describedby={
                  hasFieldError(errors, 'currentPassword')
                    ? 'currentPassword-error'
                    : undefined
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => toggleVisibility('currentPassword')}
                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                aria-label={
                  visibility.currentPassword
                    ? 'Hide current password'
                    : 'Show current password'
                }
              >
                {visibility.currentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {hasFieldError(errors, 'currentPassword') && (
              <p
                id="currentPassword-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {getFieldError(errors, 'currentPassword')?.message}
              </p>
            )}
          </div>
        </div>

        {/* New Password Section */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Lock className="h-4 w-4 text-success" />
            New Password
          </div>

          <div className="space-y-4">
            {/* New Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="newPassword"
                className="text-sm text-muted-foreground"
              >
                New Password
              </Label>
              <div className="relative">
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
                  className={cn(
                    'pr-10',
                    hasFieldError(errors, 'newPassword') &&
                      'border-destructive focus-visible:ring-destructive'
                  )}
                  aria-invalid={hasFieldError(errors, 'newPassword')}
                  aria-describedby={
                    hasFieldError(errors, 'newPassword')
                      ? 'newPassword-error'
                      : undefined
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleVisibility('newPassword')}
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                  aria-label={
                    visibility.newPassword
                      ? 'Hide new password'
                      : 'Show new password'
                  }
                >
                  {visibility.newPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {hasFieldError(errors, 'newPassword') && (
                <p
                  id="newPassword-error"
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {getFieldError(errors, 'newPassword')?.message}
                </p>
              )}
              {formData.newPassword && (
                <div className="mt-2">
                  <PasswordStrengthIndicator
                    password={formData.newPassword}
                    showStrengthBar
                  />
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm text-muted-foreground"
              >
                Confirm New Password
              </Label>
              <div className="relative">
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
                  className={cn(
                    'pr-10',
                    hasFieldError(errors, 'confirmPassword') &&
                      'border-destructive focus-visible:ring-destructive'
                  )}
                  aria-invalid={hasFieldError(errors, 'confirmPassword')}
                  aria-describedby={
                    hasFieldError(errors, 'confirmPassword')
                      ? 'confirmPassword-error'
                      : undefined
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleVisibility('confirmPassword')}
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                  aria-label={
                    visibility.confirmPassword
                      ? 'Hide confirm password'
                      : 'Show confirm password'
                  }
                >
                  {visibility.confirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {hasFieldError(errors, 'confirmPassword') && (
                <p
                  id="confirmPassword-error"
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {getFieldError(errors, 'confirmPassword')?.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            variant="outline"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            type="submit"
            disabled={disableSubmit}
          >
            {isLoading ? 'Changing...' : 'Change Password'}
          </Button>
        </div>
      </form>
    </div>
  )
}
