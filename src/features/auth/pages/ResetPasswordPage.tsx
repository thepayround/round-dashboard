import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { useAsyncAction } from '@/shared/hooks'
import { useAuth } from '@/shared/hooks/useAuth'
import { apiClient } from '@/shared/services/apiClient'
import type { User } from '@/shared/types/auth'
import { AuthLogo } from '@/shared/ui/AuthLogo'
import { PasswordStrengthIndicator } from '@/shared/ui/PasswordStrengthIndicator'
import { Alert, AlertDescription } from '@/shared/ui/shadcn/alert'
import { Button } from '@/shared/ui/shadcn/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/shadcn/form'
import { Input } from '@/shared/ui/shadcn/input'
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

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
      <div className="relative min-h-screen flex items-center justify-center pb-12 z-[1]">

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="w-full max-w-[360px] mx-auto relative z-10"
        >
          <div className="bg-card/50 border border-border rounded-lg p-6 relative overflow-hidden z-10">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/15 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h1 className="text-2xl font-medium tracking-tight text-foreground mb-4">Invalid Reset Link</h1>
              <p className="text-muted-foreground mb-6">{tokenError}</p>
              <Link to="/auth/forgot-password">
                <Button size="lg">
                  Request New Reset Link
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center pb-12 z-[1]">
      {/* Animated Background */}

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
          delay: 0.2,
        }}
        className="w-full max-w-[360px] mx-auto relative z-10"
      >
        {/* Centered Logo Above Form */}
        <AuthLogo />

        <div className="bg-card/50 border border-border rounded-lg p-6 relative overflow-hidden z-10 transition-all duration-150">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="gradient-header" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative"
            >
              {!isSuccess ? (
                <>
                  <h1 className="text-xl md:text-2xl lg:text-xl font-medium tracking-tight text-foreground mb-2 relative">
                    Reset Password
                  </h1>
                  <p className="text-muted-foreground text-sm md:text-base lg:text-sm font-medium">
                    Enter your new password for <strong className="text-foreground">{tokenEmail}</strong>
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-xl md:text-2xl lg:text-xl font-medium tracking-tight text-foreground mb-2 relative">
                    Password Reset Successful
                  </h1>
                  <p className="text-muted-foreground text-sm md:text-base lg:text-sm font-medium">
                    Your password has been successfully reset. You will be logged in automatically...
                  </p>
                </>
              )}
            </motion.div>
          </div>

          {!isSuccess ? (
            <>
              {/* API Error Message */}
              {apiError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{apiError}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {/* Reset Password Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                  {/* New Password */}
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                            <Input
                              {...field}
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Enter your new password"
                              className="pl-10 pr-10 bg-input border-border"
                              autoComplete="new-password"
                            />
                            <Button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-1/2 -translate-y-1/2 h-full px-3 hover:bg-transparent"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Confirm New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                            <Input
                              {...field}
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Confirm your new password"
                              className="pl-10 pr-10 bg-input border-border"
                              autoComplete="new-password"
                            />
                            <Button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-1/2 -translate-y-1/2 h-full px-3 hover:bg-transparent"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password Requirements */}
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <PasswordStrengthIndicator
                      password={form.watch('newPassword')}
                      showStrengthBar={!!form.watch('newPassword')}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={!form.formState.isValid || isSubmitting}
                    className="w-full mt-8"
                    size="lg"
                  >
                    {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                    {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              </Form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="space-y-6">
                <Alert className="bg-success/10 border-success/20 text-success">
                  <AlertDescription>
                    <p>Your password has been successfully reset and all existing sessions have been invalidated for security.</p>
                  </AlertDescription>
                </Alert>

                {/* Action Button */}
                <Button onClick={goToLogin} className="w-full" size="lg">
                  Continue to Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
