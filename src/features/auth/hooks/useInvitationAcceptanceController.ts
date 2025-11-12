import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useAsyncAction, useForm, usePhoneValidation } from '@/shared/hooks'
import { useAuth } from '@/shared/hooks/useAuth'
import { teamService, type ValidateInvitationResponse } from '@/shared/services/api'
import { handleApiError } from '@/shared/utils/errorHandler'
import { validators } from '@/shared/utils/validators'

export interface InvitationAcceptanceController {
  tokenError: string
  apiError: string
  isValidatingToken: boolean
  isSubmitting: boolean
  invitation: ValidateInvitationResponse | null
  form: ReturnType<typeof useForm<{
    firstName: string
    lastName: string
    password: string
  }>>
  phone: ReturnType<typeof usePhoneValidation>
  showPassword: boolean
  togglePasswordVisibility: () => void
  handleSubmit: (event: React.FormEvent) => Promise<void>
  isFormReady: boolean
}

export const useInvitationAcceptanceController = (): InvitationAcceptanceController => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [searchParams] = useSearchParams()
  const invitationToken = searchParams.get('token')

  const { execute, loading: isSubmitting } = useAsyncAction()
  const phone = usePhoneValidation('US')
  const form = useForm(
    {
      firstName: '',
      lastName: '',
      password: '',
    },
    {
      firstName: value => validators.required(value, 'First name'),
      lastName: value => validators.required(value, 'Last name'),
      password: validators.password,
    }
  )

  const [showPassword, setShowPassword] = useState(false)
  const [isValidatingToken, setIsValidatingToken] = useState(true)
  const [tokenError, setTokenError] = useState('')
  const [apiError, setApiError] = useState('')
  const [invitation, setInvitation] = useState<ValidateInvitationResponse | null>(null)

  useEffect(() => {
    const validateToken = async () => {
      if (!invitationToken) {
        setTokenError('Missing invitation token')
        setIsValidatingToken(false)
        return
      }

      try {
        const response = await teamService.validateInvitation(invitationToken)

        if (response.success && response.data) {
          setInvitation(response.data)
        } else {
          setTokenError(response.message ?? 'Invalid invitation token')
        }
      } catch (error) {
        setTokenError(handleApiError(error, 'Invitation validation', 'Unable to validate invitation. Please try again.'))
      } finally {
        setIsValidatingToken(false)
      }
    }

    validateToken()
  }, [invitationToken])

  const { values: formValues, errors: formErrors, validateAll } = form
  const { phoneData, phoneError, validatePhone } = phone

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault()
      setApiError('')

      if (!invitation || !invitationToken) {
        setApiError('Invalid invitation')
        return
      }

      const isFormValid = validateAll()
      const isPhoneValid = validatePhone()

      if (!isFormValid || !isPhoneValid) {
        return
      }

      await execute(
        async () => {
          const registrationRequest = {
            firstName: formValues.firstName.trim(),
            lastName: formValues.lastName.trim(),
            email: invitation.email,
            password: formValues.password,
            phoneNumber: phoneData.phone.trim(),
            countryPhoneCode: phoneData.countryPhoneCode,
            token: invitationToken,
          }

          const response = await teamService.registerWithInvitation(registrationRequest)

          if (response.success && response.data) {
            const { token, refreshToken, user } = response.data
            login(user, token, refreshToken)
            navigate('/dashboard', { replace: true })
          } else {
            setApiError(response.error ?? 'Failed to accept invitation')
          }
        },
        {
          onError: error => {
            const message = handleApiError(error, 'Invitation acceptance', 'Unable to accept invitation at the moment.')
            setApiError(message)
          },
        }
      )
    },
    [
      execute,
      formValues.firstName,
      formValues.lastName,
      formValues.password,
      invitation,
      invitationToken,
      login,
      navigate,
      phoneData.countryPhoneCode,
      phoneData.phone,
      validateAll,
      validatePhone,
    ]
  )

  const isFormReady = useMemo(
    () =>
      formValues.firstName.trim() !== '' &&
      formValues.lastName.trim() !== '' &&
      formValues.password.trim() !== '' &&
      phoneData.phone.trim() !== '' &&
      !formErrors.firstName &&
      !formErrors.lastName &&
      !formErrors.password &&
      !phoneError,
    [
      formErrors.firstName,
      formErrors.lastName,
      formErrors.password,
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
    tokenError,
    apiError,
    isValidatingToken,
    isSubmitting,
    invitation,
    form,
    phone,
    showPassword,
    togglePasswordVisibility,
    handleSubmit,
    isFormReady,
  }
}
