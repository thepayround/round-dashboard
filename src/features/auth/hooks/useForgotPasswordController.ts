import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAsyncAction, useForm } from '@/shared/hooks'
import { apiClient } from '@/shared/services/apiClient'
import { handleApiError, validators } from '@/shared/utils'

export const useForgotPasswordController = () => {
  const navigate = useNavigate()
  const { loading: isSubmitting, execute } = useAsyncAction()
  const [apiError, setApiError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const { values, errors, handleChange, handleBlur, validateAll, resetForm } = useForm(
    { email: '' },
    {
      email: (value: string) => {
        if (!value.trim()) {
          return { valid: false, message: 'Email is required' }
        }
        return validators.emailWithMessage(value)
      },
    }
  )

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault()
      setApiError('')

      if (!validateAll()) {
        return
      }

      await execute(
        async () => {
          const response = await apiClient.forgotPassword(values.email.trim())

          if (response.success) {
            setIsSuccess(true)
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
    [execute, validateAll, values.email]
  )

  const handleBackToLogin = useCallback(() => navigate('/login'), [navigate])

  const handleTryAgain = useCallback(() => {
    setIsSuccess(false)
    resetForm()
    setApiError('')
  }, [resetForm])

  const isFormValid = useMemo(
    () => values.email.trim() !== '' && !errors.email,
    [errors.email, values.email]
  )

  return {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    handleBackToLogin,
    handleTryAgain,
    isSubmitting,
    apiError,
    isSuccess,
    isFormValid,
  }
}

