import { useCallback, useMemo, useState } from 'react'

import type { UserRole } from '../types/team.types'

import { useGlobalToast } from '@/shared/contexts/ToastContext'

interface UseInviteMemberModalControllerParams {
  onInvite: (email: string, role: UserRole) => Promise<boolean>
  onClose: () => void
}

interface UseInviteMemberModalControllerReturn {
  email: string
  selectedRole: UserRole
  error: string
  isSubmitDisabled: boolean
  handleEmailChange: (value: string) => void
  handleRoleChange: (role: UserRole) => void
  handleSubmit: () => Promise<void>
  handleClose: () => void
  resetForm: () => void
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const useInviteMemberModalController = ({
  onInvite,
  onClose,
}: UseInviteMemberModalControllerParams): UseInviteMemberModalControllerReturn => {
  const [email, setEmail] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole>('TeamMember')
  const [error, setError] = useState('')
  const { showError, showSuccess } = useGlobalToast()

  const resetForm = useCallback(() => {
    setEmail('')
    setSelectedRole('TeamMember')
    setError('')
  }, [])

  const handleClose = useCallback(() => {
    resetForm()
    onClose()
  }, [onClose, resetForm])

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value)
    setError('')
  }, [])

  const handleRoleChange = useCallback((role: UserRole) => {
    setSelectedRole(role)
    setError('')
  }, [])

  const validate = useCallback((): boolean => {
    if (!email.trim()) {
      setError('Email address is required')
      return false
    }

    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address')
      return false
    }

    setError('')
    return true
  }, [email])

  const handleSubmit = useCallback(async () => {
    if (!validate()) {
      return
    }

    try {
      const success = await onInvite(email.trim(), selectedRole)
      if (success) {
        showSuccess('Invitation sent successfully!')
        handleClose()
      } else {
        showError('Failed to send invitation. This email may already have a pending invitation.')
      }
    } catch (err) {
      showError('An unexpected error occurred. Please try again.')
    }
  }, [email, handleClose, onInvite, selectedRole, showError, showSuccess, validate])

  const isSubmitDisabled = useMemo(() => !email.trim(), [email])

  return {
    email,
    selectedRole,
    error,
    isSubmitDisabled,
    handleEmailChange,
    handleRoleChange,
    handleSubmit,
    handleClose,
    resetForm,
  }
}
