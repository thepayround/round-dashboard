import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { useAsyncAction } from '@/shared/hooks'
import { apiClient } from '@/shared/services/apiClient'
import { Alert, AlertDescription } from '@/shared/ui/shadcn/alert'
import { Button } from '@/shared/ui/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/shadcn/card'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
import { handleApiError } from '@/shared/utils'

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const { loading: isSubmitting, execute } = useAsyncAction()
  const [apiError, setApiError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [emailSent, setEmailSent] = useState('')

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      setApiError('')

      await execute(
        async () => {
          const response = await apiClient.forgotPassword(data.email.trim())

          if (response.success) {
            setIsSuccess(true)
            setEmailSent(data.email)
          } else {
            setApiError(response.error ?? 'Failed to send password reset email')
          }
        },
        {
          onError: error => {
            const message = handleApiError(error, 'ForgotPassword')
            setApiError(message)
          },
        }
      )
    },
    [execute]
  )

  const handleBackToLogin = useCallback(() => navigate('/login'), [navigate])

  const handleTryAgain = useCallback(() => {
    setIsSuccess(false)
    setEmailSent('')
    setApiError('')
    form.reset()
  }, [form])

  if (isSuccess) {
    return (
      <Card>
        <CardHeader>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-center">Check Your Email</CardTitle>
          <CardDescription className="text-center">
            We&apos;ve sent a password reset link to <strong className="text-foreground">{emailSent}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-8">
            <Alert className="bg-primary/10 border-primary/20">
              <AlertDescription>
                <p>We&apos;ve sent you a secure password reset link that will expire in <strong>1 hour</strong>.</p>
                <p className="mt-2">Check your spam folder if you don&apos;t see the email in your inbox.</p>
              </AlertDescription>
            </Alert>

            <div className="flex flex-col gap-4">
              <Button onClick={handleBackToLogin} className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Button>

              <Button type="button" onClick={handleTryAgain} variant="ghost" className="w-full">
                Send to a different email
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Didn&apos;t receive the email?{' '}
              <Button
                type="button"
                onClick={handleTryAgain}
                variant="link"
                className="h-auto p-0 text-primary underline-offset-4"
              >
                Try again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot Password?</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a link to reset your password
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
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                {...form.register('email')}
                aria-invalid={!!form.formState.errors.email}
                autoComplete="email"
                required
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
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
