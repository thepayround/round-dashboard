import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { z } from 'zod'

import { GoogleLoginButton } from '../components/GoogleLoginButton'

import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { useAuth } from '@/shared/hooks/useAuth'
import { apiClient } from '@/shared/services/apiClient'
import { Button } from '@/shared/ui/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/shadcn/card'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
import { PasswordInput } from '@/shared/ui/shadcn/password-input'
import { handleApiError } from '@/shared/utils'

// Zod validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

type LoginFormData = z.infer<typeof loginSchema>

export const BusinessLoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { showSuccess, showError } = useGlobalToast()

  // React Hook Form with Zod validation
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  })

  // Handle success message from navigation state (e.g., from email confirmation)
  useEffect(() => {
    const state = location.state as { message?: string; email?: string }
    if (state?.message) {
      showSuccess(state.message)
      if (state.email) {
        form.setValue('email', state.email)
      }
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state, location.pathname, navigate, showSuccess, form])

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await apiClient.login(data)

      if (response.success && response.data) {
        login(response.data.user, response.data.accessToken)

        const from =
          (location.state as { from?: { pathname?: string } })?.from?.pathname ?? '/get-started'
        navigate(from, { replace: true })
      } else {
        showError(response.error ?? 'Login failed')
      }
    } catch (error) {
      const message = handleApiError(error, 'Login')
      showError(message)
    }
  }

  const isLoading = form.formState.isSubmitting

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Sign In</CardTitle>
        <CardDescription>Access your business Round account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-8">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@company.com"
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

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/auth/forgot-password"
                  className="ml-auto inline-block text-sm text-muted-foreground underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <PasswordInput
                id="password"
                placeholder="********"
                {...form.register('password')}
                aria-invalid={!!form.formState.errors.password}
                autoComplete="current-password"
                required
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
              <GoogleLoginButton
                accountType="business"
                onSuccess={() => showSuccess('Successfully signed in with Google!')}
                onError={(error) => showError(error)}
              />
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link to="/signup/business" className="text-primary underline-offset-4 hover:underline">
              Create business account
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
