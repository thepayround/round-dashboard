import { useState } from 'react'

import { teamService, type InviteUserRequest, type RegisterWithInvitationRequest, UserRole } from '../../services/api/team.service'

export const useTeamInvitation = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const inviteUser = async (request: InviteUserRequest) => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const result = await teamService.inviteUser(request)
      
      if (result.success) {
        setSuccess(result.message ?? 'Invitation sent successfully!')
        return { success: true, data: result.data }
      } else {
        setError(result.message ?? 'Failed to send invitation')
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const registerWithInvitation = async (request: RegisterWithInvitationRequest) => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const result = await teamService.registerWithInvitation(request)
      
      if (result.success) {
        setSuccess(result.message ?? 'Registration successful!')
        return { success: true, data: result.data }
      } else {
        setError(result.message ?? 'Failed to register')
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  return {
    inviteUser,
    registerWithInvitation,
    isLoading,
    error,
    success,
    clearMessages
  }
}

export const useTeamRoleUtils = () => {
  const getAvailableRoles = () => teamService.getAvailableRoles()
  const getCommonRoles = () => teamService.getCommonRoles()
  const getRoleName = (role: UserRole) => teamService.getRoleName(role)

  return {
    getAvailableRoles,
    getCommonRoles,
    getRoleName,
    UserRole
  }
}


