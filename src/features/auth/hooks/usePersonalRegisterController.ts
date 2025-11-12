import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { useAsyncAction, useForm, usePhoneValidation } from '@/shared/hooks'
import { apiClient } from '@/shared/services/apiClient'
import { handleApiError, validators } from '@/shared/utils'

export interface PersonalRegisterController {
  form: ReturnType<typeof useForm<{
    firstName: string
    lastName: string
    email: string
    password: string
  }>>
  phone: ReturnType<typeof usePhoneValidation>
  showPassword: boolean
  togglePasswordVisibility: () => void
  isSubmitting: boolean
  handleSubmit: (event: React.FormEvent) => Promise<void>
  isFormReady: boolean
}

export const usePersonalRegisterController = (): PersonalRegisterController => {
  const navigate = useNavigate()
  const { showError } = useGlobalToast()
  const { loading: isSubmitting, execute } = useAsyncAction()

  const [showPassword, setShowPassword] = useState(false)

  const form = useForm(
    {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    {
      firstName: value => validators.required(value, 'First name'),
      lastName: value => validators.required(value, 'Last name'),
      email: validators.emailWithMessage,
      password: validators.password,
    }
  )

  const phone = usePhoneValidation('GR')

  const { values: formValues, errors: formErrors, validateAll } = form
  const { phoneData, phoneError, validatePhone } = phone

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault()

      const isFormValid = validateAll()
      const isPhoneValid = validatePhone()

      if (!isFormValid || !isPhoneValid) {
        return
      }

      await execute(
        async () => {
          const response = await apiClient.register({
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            email: formValues.email,
            password: formValues.password,
            phoneNumber: phoneData.phone,
            countryPhoneCode: phoneData.countryPhoneCode,
          })

          if (response.success && response.data) {
            navigate('/auth/confirmation-pending', {
              state: { email: formValues.email },
              replace: true,
            })
          } else {
            showError(response.error ?? 'Registration failed')
          }
        },
        {
          onError: error => {
            const message = handleApiError(error, 'Registration')
            showError(message)
          },
        }
      )
    },
    [execute, formValues.email, formValues.firstName, formValues.lastName, formValues.password, navigate, phoneData.countryPhoneCode, phoneData.phone, showError, validateAll, validatePhone]
  )

  const isFormReady = useMemo(
    () =>
      formValues.firstName.trim() !== '' &&
      formValues.lastName.trim() !== '' &&
      formValues.email.trim() !== '' &&
      formValues.password.trim() !== '' &&
      phoneData.phone.trim() !== '' &&
      !formErrors.firstName &&
      !formErrors.lastName &&
      !formErrors.email &&
      !formErrors.password &&
      !phoneError,
    [
      formErrors.email,
      formErrors.firstName,
      formErrors.lastName,
      formErrors.password,
      formValues.email,
      formValues.firstName,
      formValues.lastName,
      formValues.password,
      phoneData.phone,
      phoneError,
    ]
  )

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev)
  }, [])

  return {
    form,
    phone,
    showPassword,
    togglePasswordVisibility,
    isSubmitting,
    handleSubmit,
    isFormReady,
  }
}
