import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useAsyncAction, useForm } from '@/shared/hooks'
import { useAuth } from '@/shared/hooks/useAuth'
import { apiClient } from '@/shared/services/apiClient'
import type { User } from '@/shared/types/auth'
import { handleApiError, validators } from '@/shared/utils'

export const useResetPasswordController = () => {
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

  const { values, errors, handleChange, handleBlur, validateAll, validateField } = useForm(
    { newPassword: '', confirmPassword: '' },
    {
      newPassword: (value: string) => {
        if (!value.trim()) {
          return { valid: false, message: 'Password is required' }
        }
        return validators.password(value)
      },
      confirmPassword: (value: string, formValues?: { newPassword?: string }) => {
        if (!value.trim()) {
          return { valid: false, message: 'Confirm password is required' }
        }
        const comparisonValue = formValues?.newPassword ?? values.newPassword
        if (value !== comparisonValue) {
          return { valid: false, message: 'Passwords do not match' }
        }
        return { valid: true }
      },
    }
  )

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
        password: values.newPassword,
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
  }, [login, navigate, tokenData.email, values.newPassword])

  const handlePasswordChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleChange('newPassword')(event)
      setApiError('')

      if (values.confirmPassword) {
        setTimeout(() => validateField('confirmPassword', values.confirmPassword), 0)
      }
    },
    [handleChange, validateField, values.confirmPassword]
  )

  const handleConfirmPasswordChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleChange('confirmPassword')(event)
      setApiError('')
    },
    [handleChange]
  )

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault()
      setApiError('')

      if (!validateAll() || tokenError) {
        return
      }

      await execute(
        async () => {
          const response = await apiClient.resetPassword(
            tokenData.email,
            tokenData.token,
            values.newPassword,
            values.confirmPassword
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
    [execute, handleAutoLogin, tokenData.email, tokenData.token, tokenError, validateAll, values.confirmPassword, values.newPassword]
  )

  const disableSubmit = useMemo(
    () =>
      isSubmitting ||
      !values.newPassword ||
      !values.confirmPassword ||
      !!errors.newPassword ||
      !!errors.confirmPassword,
    [errors.confirmPassword, errors.newPassword, isSubmitting, values.confirmPassword, values.newPassword]
  )

  const toggleShowPassword = () => setShowPassword(prev => !prev)
  const toggleShowConfirmPassword = () => setShowConfirmPassword(prev => !prev)
  const goToLogin = useCallback(() => navigate('/login'), [navigate])

  return {
    values,
    errors,
    handleBlur,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleSubmit,
    isSubmitting,
    apiError,
    isSuccess,
    showPassword,
    showConfirmPassword,
    toggleShowPassword,
    toggleShowConfirmPassword,
    disableSubmit,
    goToLogin,
    tokenError,
    tokenEmail,
  }
}
