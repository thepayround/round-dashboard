import { useCallback, useEffect, useMemo, useState } from 'react'

import type { TeamMember, UserRole } from '../types/team.types'

import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { useAuth } from '@/shared/hooks/useAuth'

interface UseEditMemberModalControllerParams {
  member: TeamMember | null
  onUpdateRole: (userId: string, role: UserRole) => Promise<boolean>
  onClose: () => void
}

interface UseEditMemberModalControllerReturn {
  selectedRole: UserRole
  error: string
  isEditingSelf: boolean
  canSubmit: boolean
  handleRoleChange: (role: UserRole) => void
  handleSubmit: () => Promise<void>
  handleClose: () => void
}

export const useEditMemberModalController = ({
  member,
  onUpdateRole,
  onClose,
}: UseEditMemberModalControllerParams): UseEditMemberModalControllerReturn => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('TeamMember')
  const [error, setError] = useState('')
  const { state } = useAuth()
  const { showError, showSuccess } = useGlobalToast()

  const isEditingSelf = useMemo(() => member?.id === state.user?.id, [member?.id, state.user?.id])

  useEffect(() => {
    if (member) {
      setSelectedRole(member.role)
    }
  }, [member])

  const handleRoleChange = useCallback((role: UserRole) => {
    setSelectedRole(role)
    setError('')
  }, [])

  const handleClose = useCallback(() => {
    setError('')
    onClose()
  }, [onClose])

  const handleSubmit = useCallback(async () => {
    if (!member) {
      setError('No member selected')
      return
    }

    if (selectedRole === member.role) {
      handleClose()
      return
    }

    try {
      const success = await onUpdateRole(member.id, selectedRole)
      if (success) {
        showSuccess('Member role updated')
        handleClose()
      } else {
        setError('Failed to update member role. Please try again.')
      }
    } catch {
      setError('An error occurred while updating the member role')
      showError('Failed to update member role')
    }
  }, [handleClose, member, onUpdateRole, selectedRole, showError, showSuccess])

  const canSubmit = useMemo(
    () => Boolean(member) && selectedRole !== member?.role && !isEditingSelf,
    [isEditingSelf, member, selectedRole]
  )

  return {
    selectedRole,
    error,
    isEditingSelf,
    canSubmit,
    handleRoleChange,
    handleSubmit,
    handleClose,
  }
}
