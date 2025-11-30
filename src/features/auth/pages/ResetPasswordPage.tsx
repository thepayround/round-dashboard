import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { useAsyncAction } from '@/shared/hooks'
import { useAuth } from '@/shared/hooks/useAuth'
import { apiClient } from '@/shared/services/apiClient'
import type { User } from '@/shared/types/auth'
import { PasswordStrengthIndicator } from '@/shared/ui/PasswordStrengthIndicator'
import { Alert, AlertDescription } from '@/shared/ui/shadcn/alert'
import { Button } from '@/shared/ui/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/shadcn/card'
import { Label } from '@/shared/ui/shadcn/label'
import { PasswordInput } from '@/shared/ui/shadcn/password-input'
import { handleApiError } from '@/shared/utils'

const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [searchParams] = useSearchParams()
  const { loading: isSubmitting, execute } = useAsyncAction()

  const [tokenData, setTokenData] = useState({ email: '', token: '' })
  const [tokenError, setTokenError] = useState<string | null>(null)
  const [tokenEmail, setTokenEmail] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [apiError, setApiError] = useState('')

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  // Validate token from URL
  useEffect(() => {
    const email = searchParams.get('email') ?? searchParams.get('userId') ?? ''
    const token = searchParams.get('token') ?? ''

    if (!email || !token) {
      setTokenError('Invalid or missing reset link parameters. Please request a new password reset.')
      return
    }

    setTokenData({
      email: decodeURIComponent(email),
      token: decodeURIComponent(token),
    })
    setTokenEmail(decodeURIComponent(email))
    setTokenError(null)
  }, [searchParams])

  const handleAutoLogin = useCallback(async () => {
    try {
      const response = await apiClient.login({
        email: tokenData.email,
        password: form.getValues('newPassword'),
      })

      if (response.success && response.data) {
        const loginData = response.data as unknown as Record<string, unknown>
        const token = typeof loginData.token === 'string' ? loginData.token : ''
        const refreshToken = typeof loginData.refreshToken === 'string' ? loginData.refreshToken : undefined
        const user = loginData.user as User | undefined
        if (user && token) {
          login(user, token, refreshToken)
        }
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/login')
      }
    } catch {
      navigate('/login')
    }
  }, [login, navigate, tokenData.email, form])

  const onSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      setApiError('')

      if (tokenError) {
        return
      }

      await execute(
        async () => {
          const response = await apiClient.resetPassword(
            tokenData.email,
            tokenData.token,
            data.newPassword,
            data.confirmPassword
          )

          if (response.success) {
            setIsSuccess(true)
            setTimeout(() => {
              void handleAutoLogin()
            }, 1500)
          } else {
            setApiError(response.error ?? 'Failed to reset password')
          }
        },
        {
          onError: error => {
            const message = handleApiError(error, 'ResetPassword')
            setApiError(message)
          },
        }
      )
    },
    [execute, handleAutoLogin, tokenData, tokenError]
  )

  const goToLogin = useCallback(() => navigate('/login'), [navigate])

  // Invalid token error state
  if (tokenError) {
    return (
      <Card>
        <CardHeader>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-center">Invalid Reset Link</CardTitle>
          <CardDescription className="text-center">{tokenError}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link to="/auth/forgot-password">
              Request New Reset Link
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Success state
  if (isSuccess) {
    return (
      <Card>
        <CardHeader>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-center">Password Reset Successful</CardTitle>
          <CardDescription className="text-center">
            Your password has been successfully reset. You will be logged in automatically...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-8">
            <Alert className="bg-primary/10 border-primary/20">
              <AlertDescription>
                Your password has been successfully reset and all existing sessions have been invalidated for security.
              </AlertDescription>
            </Alert>

            <Button onClick={goToLogin} className="w-full">
              Continue to Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter your new password for <strong className="text-foreground">{tokenEmail}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {apiError && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-8">
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <PasswordInput
                id="newPassword"
                placeholder="Enter your new password"
                {...form.register('newPassword')}
                aria-invalid={!!form.formState.errors.newPassword}
                autoComplete="new-password"
              />
              {form.formState.errors.newPassword && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <PasswordInput
                id="confirmPassword"
                placeholder="Confirm your new password"
                {...form.register('confirmPassword')}
                aria-invalid={!!form.formState.errors.confirmPassword}
                autoComplete="new-password"
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Password Strength Indicator */}
            {form.watch('newPassword') && (
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <PasswordStrengthIndicator
                  password={form.watch('newPassword')}
                  showStrengthBar
                />
              </div>
            )}

            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                disabled={!form.formState.isValid || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
              </Button>

              <Button variant="link" asChild className="w-full">
                <Link to="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Sign In
                </Link>
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
