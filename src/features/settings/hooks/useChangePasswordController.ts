import { useCallback, useMemo, useState } from 'react'
import type { ChangeEvent, FocusEvent } from 'react'

import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { apiClient } from '@/shared/services/apiClient'
import { validatePassword, type ValidationError } from '@/shared/utils/validation'

type FieldName = 'currentPassword' | 'newPassword' | 'confirmPassword'

interface UseChangePasswordControllerOptions {
  onSuccess?: () => void
  autoResetOnSuccess?: boolean
}

interface UseChangePasswordControllerReturn {
  formData: Record<FieldName, string>
  errors: ValidationError[]
  apiError: string | null
  isLoading: boolean
  isSuccess: boolean
  visibility: Record<FieldName, boolean>
  handleInputChange: (field: FieldName) => (event: ChangeEvent<HTMLInputElement>) => void
  handleInputBlur: (field: FieldName) => (event: FocusEvent<HTMLInputElement>) => void
  toggleVisibility: (field: FieldName) => void
  handleSubmit: (event?: { preventDefault?: () => void }) => Promise<void>
  handleReset: () => void
  disableSubmit: boolean
  canSubmit: boolean
}

const initialFormState = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

export const useChangePasswordController = (
  { onSuccess, autoResetOnSuccess = true }: UseChangePasswordControllerOptions = {}
): UseChangePasswordControllerReturn => {
  const { showSuccess, showError } = useGlobalToast()

  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [visibility, setVisibility] = useState<Record<FieldName, boolean>>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  })

  const mapValidationErrors = useCallback(
    (validationErrors: ValidationError[], field: FieldName) =>
      validationErrors.map(error => ({
        ...error,
        field,
      })),
    []
  )

  const handleInputChange = useCallback(
    (field: FieldName) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target
      setFormData(prev => ({ ...prev, [field]: value }))
      setApiError(null)
      setIsSuccess(false)

      setErrors(prev => prev.filter(error => error.field !== field))

      if (field === 'newPassword') {
        setErrors(prev => prev.filter(error => error.field !== 'confirmPassword'))
      }
    },
    []
  )

  const handleInputBlur = useCallback(
    (field: FieldName) => (event: FocusEvent<HTMLInputElement>) => {
      const { value } = event.target
      if (!value?.trim()) return

      if (field === 'currentPassword' || field === 'newPassword') {
        const validation = validatePassword(value)
        if (!validation.isValid) {
          setErrors(prev => [
            ...prev.filter(error => error.field !== field),
            ...mapValidationErrors(validation.errors, field),
          ])
        }
      }

      if (field === 'confirmPassword' && value !== formData.newPassword) {
        setErrors(prev => [
          ...prev.filter(error => error.field !== field),
          { field: 'confirmPassword', message: 'Passwords do not match', code: 'PASSWORD_MISMATCH' },
        ])
      }
    },
    [formData.newPassword, mapValidationErrors]
  )

  const toggleVisibility = useCallback((field: FieldName) => {
    setVisibility(prev => ({ ...prev, [field]: !prev[field] }))
  }, [])

  const validateForm = useCallback((): boolean => {
    const nextErrors: ValidationError[] = []

    if (!formData.currentPassword.trim()) {
      nextErrors.push({
        field: 'currentPassword',
        message: 'Current password is required',
        code: 'REQUIRED',
      })
    }

    const passwordValidation = validatePassword(formData.newPassword)
    if (!passwordValidation.isValid) {
      nextErrors.push(...mapValidationErrors(passwordValidation.errors, 'newPassword'))
    }

    if (formData.newPassword !== formData.confirmPassword) {
      nextErrors.push({
        field: 'confirmPassword',
        message: 'Passwords do not match',
        code: 'PASSWORD_MISMATCH',
      })
    }

    if (!formData.confirmPassword.trim()) {
      nextErrors.push({
        field: 'confirmPassword',
        message: 'Please confirm your new password',
        code: 'REQUIRED',
      })
    }

    if (nextErrors.length > 0) {
      setErrors(nextErrors)
      return false
    }

    setErrors([])
    return true
  }, [formData.confirmPassword, formData.currentPassword, formData.newPassword, mapValidationErrors])

  const resetForm = useCallback(() => {
    setFormData(initialFormState)
    setErrors([])
    setApiError(null)
    setIsSuccess(false)
    setVisibility({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
    })
  }, [])

  const handleSubmit = useCallback(
    async (event?: { preventDefault?: () => void }) => {
      event?.preventDefault?.()
      if (isLoading) return

      setApiError(null)
      setIsSuccess(false)

      const isValid = validateForm()
      if (!isValid) return

      setIsLoading(true)
      try {
        const response = await apiClient.changePassword(
          formData.currentPassword,
          formData.newPassword,
          formData.confirmPassword
        )

        if (response.success) {
          showSuccess(response.data?.message ?? 'Password changed successfully')
          setIsSuccess(true)
          if (autoResetOnSuccess) {
            resetForm()
          }
          onSuccess?.()
        } else {
          const message = response.error ?? 'Failed to change password'
          setApiError(message)
          showError(message)
        }
      } catch (error) {
        setApiError('Unexpected error. Please try again.')
        showError('Unexpected error. Please try again.')
      } finally {
        setIsLoading(false)
      }
    },
    [
      autoResetOnSuccess,
      formData.confirmPassword,
      formData.currentPassword,
      formData.newPassword,
      isLoading,
      onSuccess,
      resetForm,
      showError,
      showSuccess,
      validateForm,
    ]
  )

  const handleReset = useCallback(() => {
    resetForm()
  }, [resetForm])

  const canSubmit = useMemo(
    () =>
      Boolean(formData.currentPassword && formData.newPassword && formData.confirmPassword) &&
      !isLoading,
    [formData.confirmPassword, formData.currentPassword, formData.newPassword, isLoading]
  )

  return {
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
    disableSubmit: !canSubmit,
    canSubmit,
  }
}
