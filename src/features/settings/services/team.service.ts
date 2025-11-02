import type { 
  TeamMember, 
  TeamInvitation, 
  InviteMemberRequest, 
  UpdateMemberRoleRequest 
} from '../types/team.types'

import { ENDPOINTS } from '@/shared/services/api/base/config'
import { apiClient } from '@/shared/services/apiClient'
import type { ApiResponse } from '@/shared/types/api'

class TeamService {
  
  async getTeamMembers(): Promise<ApiResponse<TeamMember[]>> {
    try {
      const response = await apiClient.get<TeamMember[]>(ENDPOINTS.TEAM.MEMBERS)
      return response
    } catch (error) {
      console.error('Failed to fetch team members:', error)
      return {
        success: false,
        data: undefined,
        error: error instanceof Error ? error.message : 'Failed to fetch team members'
      }
    }
  }

  async getInvitations(): Promise<ApiResponse<TeamInvitation[]>> {
    try {
      const response = await apiClient.get<TeamInvitation[]>(ENDPOINTS.TEAM.INVITATIONS)
      return response
    } catch (error) {
      console.error('Failed to fetch invitations:', error)
      return {
        success: false,
        data: undefined,
        error: error instanceof Error ? error.message : 'Failed to fetch invitations'
      }
    }
  }

  async inviteMember(request: InviteMemberRequest): Promise<ApiResponse<TeamInvitation>> {
    try {
      const response = await apiClient.post<TeamInvitation>(ENDPOINTS.TEAM.INVITE, request)
      return response
    } catch (error) {
      console.error('Failed to invite member:', error)
      return {
        success: false,
        data: undefined,
        error: error instanceof Error ? error.message : 'Failed to invite member'
      }
    }
  }

  async updateMemberRole(userId: string, request: UpdateMemberRoleRequest): Promise<ApiResponse<TeamMember>> {
    try {
      const response = await apiClient.put<TeamMember>(ENDPOINTS.TEAM.MEMBER_ROLE(userId), request)
      return response
    } catch (error) {
      console.error('Failed to update member role:', error)
      return {
        success: false,
        data: undefined,
        error: error instanceof Error ? error.message : 'Failed to update member role'
      }
    }
  }

  async removeMember(userId: string): Promise<ApiResponse<void>> {
    try {
      await apiClient.delete<void>(ENDPOINTS.TEAM.MEMBER_BY_ID(userId))
      return {
        success: true,
        data: undefined,
        error: undefined
      }
    } catch (error) {
      console.error('Failed to remove member:', error)
      return {
        success: false,
        data: undefined,
        error: error instanceof Error ? error.message : 'Failed to remove member'
      }
    }
  }

  async resendInvitation(invitationId: string): Promise<ApiResponse<TeamInvitation>> {
    try {
      const response = await apiClient.post<TeamInvitation>(ENDPOINTS.TEAM.INVITATION_RESEND(invitationId))
      return response
    } catch (error) {
      console.error('Failed to resend invitation:', error)
      return {
        success: false,
        data: undefined,
        error: error instanceof Error ? error.message : 'Failed to resend invitation'
      }
    }
  }

  async cancelInvitation(invitationId: string): Promise<ApiResponse<void>> {
    try {
      await apiClient.delete<void>(ENDPOINTS.TEAM.INVITATION_BY_ID(invitationId))
      return {
        success: true,
        data: undefined,
        error: undefined
      }
    } catch (error) {
      console.error('Failed to cancel invitation:', error)
      return {
        success: false,
        data: undefined,
        error: error instanceof Error ? error.message : 'Failed to cancel invitation'
      }
    }
  }
}

export const teamService = new TeamService()
