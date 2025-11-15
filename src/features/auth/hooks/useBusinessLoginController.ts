import { useState, useEffect, FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { useAsyncAction, useForm } from '@/shared/hooks'
import { useAuth } from '@/shared/hooks/useAuth'
import { apiClient } from '@/shared/services/apiClient'
import { validators, handleApiError } from '@/shared/utils'

export function useBusinessLoginController() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { showSuccess, showError } = useGlobalToast()
  const { loading: isSubmitting, execute } = useAsyncAction()
  const [showPassword, setShowPassword] = useState(false)

  // Form state and validation
  const { values, errors, handleChange, handleBlur, validateAll, setFieldValue } = useForm(
    { email: '', password: '' },
    {
      email: (value: string) => {
        if (!value.trim()) {
          return { valid: false, message: 'Email is required' }
        }
        return validators.emailWithMessage(value)
      },
      password: (value: string) => {
        if (!value.trim()) {
          return { valid: false, message: 'Password is required' }
        }
        return validators.passwordBasic(value)
      },
    }
  )

  // Handle success message from navigation state
  useEffect(() => {
    const state = location.state as { message?: string; email?: string }
    if (state?.message) {
      showSuccess(state.message)
      if (state.email) {
        setFieldValue('email', state.email)
      }
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state, location.pathname, navigate, showSuccess, setFieldValue])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateAll()) {
      return
    }

    await execute(async () => {
      const response = await apiClient.login(values)

      if (response.success && response.data) {
        login(response.data.user, response.data.accessToken)

        const from =
          (location.state as { from?: { pathname?: string } })?.from?.pathname ?? '/get-started'
        navigate(from, { replace: true })
      } else {
        showError(response.error ?? 'Login failed')
      }
    }, {
      onError: (error) => {
        const message = handleApiError(error, 'Login')
        showError(message)
      }
    })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const isFormValid = values.email.trim() !== '' && values.password.trim() !== '' && !errors.email && !errors.password

  return {
    // Form state
    email: values.email,
    password: values.password,
    showPassword,

    // Form handlers
    handleEmailChange: handleChange('email'),
    handlePasswordChange: handleChange('password'),
    handleEmailBlur: handleBlur('email'),
    handlePasswordBlur: handleBlur('password'),
    togglePasswordVisibility,
    handleSubmit,

    // Validation
    errors,
    isFormValid,

    // Loading state
    isLoading: isSubmitting,
  }
}
