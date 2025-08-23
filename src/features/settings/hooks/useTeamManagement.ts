import { useState, useCallback } from 'react'
import { teamService } from '../services/team.service'
import type { TeamMember, TeamInvitation, UserRole, TeamManagementState, TeamManagementActions } from '../types/team.types'

export const useTeamManagement = (): TeamManagementState & TeamManagementActions => {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [invitations, setInvitations] = useState<TeamInvitation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async (roundAccountId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const [membersResult, invitationsResult] = await Promise.all([
        teamService.getTeamMembers(),
        teamService.getInvitations()
      ])

      if (membersResult.success && membersResult.data) {
        setMembers(membersResult.data)
      }

      if (invitationsResult.success && invitationsResult.data) {
        setInvitations(invitationsResult.data)
      }

      if (!membersResult.success) {
        setError(membersResult.error ?? 'Failed to load team members')
      } else if (!invitationsResult.success) {
        setError(invitationsResult.error ?? 'Failed to load invitations')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const inviteMember = useCallback(async (roundAccountId: string, email: string, role: UserRole): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await teamService.inviteMember({ email, role })
      
      if (result.success) {
        // Refresh invitations to show the new one
        const invitationsResult = await teamService.getInvitations()
        if (invitationsResult.success && invitationsResult.data) {
          setInvitations(invitationsResult.data)
        }
        return true
      } else {
        setError(result.error ?? 'Failed to invite member')
        return false
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateMemberRole = useCallback(async (roundAccountId: string, userId: string, role: UserRole): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await teamService.updateMemberRole(userId, { role })
      
      if (result.success) {
        // Update local state
        setMembers(prevMembers => 
          prevMembers.map(member => 
            member.id === userId 
              ? { ...member, role }
              : member
          )
        )
        return true
      } else {
        setError(result.error ?? 'Failed to update member role')
        return false
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const removeMember = useCallback(async (roundAccountId: string, userId: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await teamService.removeMember(userId)
      
      if (result.success) {
        // Remove from local state
        setMembers(prevMembers => 
          prevMembers.filter(member => member.id !== userId)
        )
        return true
      } else {
        setError(result.error ?? 'Failed to remove member')
        return false
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const resendInvitation = useCallback(async (roundAccountId: string, invitationId: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await teamService.resendInvitation(invitationId)
      
      if (result.success) {
        // Refresh invitations to update status
        const invitationsResult = await teamService.getInvitations()
        if (invitationsResult.success && invitationsResult.data) {
          setInvitations(invitationsResult.data)
        }
        return true
      } else {
        setError(result.error ?? 'Failed to resend invitation')
        return false
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const cancelInvitation = useCallback(async (roundAccountId: string, invitationId: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await teamService.cancelInvitation(invitationId)
      
      if (result.success) {
        // Remove from local state
        setInvitations(prevInvitations => 
          prevInvitations.filter(invitation => invitation.id !== invitationId)
        )
        return true
      } else {
        setError(result.error ?? 'Failed to cancel invitation')
        return false
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    members,
    invitations,
    isLoading,
    error,
    inviteMember,
    updateMemberRole,
    removeMember,
    resendInvitation,
    cancelInvitation,
    refresh
  }
}
