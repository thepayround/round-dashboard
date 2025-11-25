/**
 * Team Invitation API service
 */

import type { ApiResponse } from '../../types/api'
import type { User } from '../../types/auth'

import { httpClient } from './base/client'

export interface InviteUserRequest {
  roundAccountId: string
  email: string
  role: UserRole
}

export interface RegisterWithInvitationRequest {
  firstName: string
  lastName: string
  email: string
  userName?: string
  password: string
  phoneNumber: string
  countryPhoneCode?: string
  token: string
}

export interface ValidateInvitationResponse {
  invitationId: string
  roundAccountId: string
  email: string
  role: UserRole
  roleName: string
  expiryDate: string
  organizationName: string
  inviterName: string
  inviterEmail: string
}

export interface InvitationResponse {
  invitationId: string
  roundAccountId: string
  email: string
  role: UserRole
  expiryDate: string
  createdDate: string
  createdBy: string
}

export enum UserRole {
  // Administrative Roles
  SuperAdmin = 0,
  Admin = 1,
  
  // Team Management Roles
  TeamOwner = 2,
  TeamManager = 3,
  TeamMember = 4,
  
  // Sales and Marketing Roles
  SalesManager = 5,
  SalesRepresentative = 6,
  MarketingManager = 7,
  MarketingAnalyst = 8,
  
  // Customer Support Roles
  SupportAdmin = 9,
  SupportAgent = 10,
  
  // Product/Development Roles
  ProductManager = 11,
  Developer = 12,
  QAEngineer = 13,
  Designer = 14,
  
  // Financial Roles
  FinanceManager = 15,
  BillingSpecialist = 16,
  
  // Viewer/Restricted Roles
  Viewer = 17,
  Guest = 18
}


export class TeamService {
  private readonly baseUrl = '/identities'

  /**
   * Invite a user to join the team/account
   */
  async inviteUser(request: InviteUserRequest): Promise<ApiResponse<{ message: string }>> {
    try {
      // Backend API respects camelCase JSON policy set in Program.cs
      const response = await httpClient.getClient().post<{ message: string }>(
        `${this.baseUrl}/invite-user`, 
        request
      )
      
      return {
        success: true,
        data: response.data,
        message: 'Invitation sent successfully'
      }
    } catch (error: unknown) {
      const axiosError = error as { 
        response?: { 
          status?: number; 
          data?: string | { message?: string } | Array<{ code: string; description: string }> 
        } 
      }
      
      let errorMessage = 'Failed to send invitation'
      let errorDetails: Record<string, string> | undefined
      
      if (axiosError.response?.data) {
        const responseData = axiosError.response.data
        
        // Handle array of error objects (like your PendingInvitation case)
        if (Array.isArray(responseData)) {
          const [firstError] = responseData
          if (firstError?.description) {
            errorMessage = firstError.description
            // Create details object for additional context
            errorDetails = { [firstError.code || 'Error']: firstError.description }
          }
        }
        // Handle simple object with message
        else if (typeof responseData === 'object' && 'message' in responseData) {
          errorMessage = responseData.message ?? errorMessage
        }
        // Handle string response
        else if (typeof responseData === 'string') {
          errorMessage = responseData
        }
      }
      
      return {
        success: false,
        data: undefined,
        message: errorMessage,
        error: errorMessage,
        details: errorDetails
      }
    }
  }

  /**
   * Register a new user with an invitation token
   */
  async registerWithInvitation(request: RegisterWithInvitationRequest): Promise<ApiResponse<{ message: string; token: string; refreshToken: string; user: User }>> {
    try {
      const response = await httpClient.getClient().post<{ succeeded: boolean; token: string; expiresIn: number; message: string }>(
        `${this.baseUrl}/register-with-invitation`, 
        request
      )
      
      if (response.data.succeeded && response.data.token) {
        // Store access token in memory only
        const { tokenManager } = await import('@/shared/utils/tokenManager')
        tokenManager.setAccessToken(response.data.token)

        // Get user data
        const { authService } = await import('./auth.service')
        const userResponse = await authService.getCurrentUser()

        if (!userResponse.success || !userResponse.data) {
          return {
            success: false,
            data: undefined,
            message: 'Failed to retrieve user information',
            error: 'Failed to retrieve user information'
          }
        }

        return {
          success: true,
          data: {
            message: response.data.message,
            token: response.data.token,
            refreshToken: '',  // Never exposed to client
            user: userResponse.data
          },
          message: 'Registration successful'
        }
      }

      return {
        success: false,
        data: undefined,
        message: 'Registration failed',
        error: 'Registration failed'
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } } }
      return {
        success: false,
        data: undefined,
        message: axiosError.response?.data?.message ?? 'Failed to register with invitation',
        error: axiosError.response?.data?.message ?? 'Failed to register with invitation'
      }
    }
  }

  /**
   * Validate an invitation token and get invitation details
   */
  async validateInvitation(token: string): Promise<ApiResponse<ValidateInvitationResponse>> {
    try {
      const response = await httpClient.getClient().get<ValidateInvitationResponse>(
        `${this.baseUrl}/validate-invitation?token=${encodeURIComponent(token)}`
      )
      
      return {
        success: true,
        data: response.data,
        message: 'Invitation validated successfully'
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } } }
      return {
        success: false,
        data: undefined,
        message: axiosError.response?.data?.message ?? 'Invalid or expired invitation',
        error: axiosError.response?.data?.message ?? 'Invalid or expired invitation'
      }
    }
  }

  /**
   * Get user-friendly role names
   */
  getRoleName(role: UserRole): string {
    const roleNames: Record<UserRole, string> = {
      [UserRole.SuperAdmin]: 'Super Admin',
      [UserRole.Admin]: 'Admin',
      [UserRole.TeamOwner]: 'Team Owner',
      [UserRole.TeamManager]: 'Team Manager',
      [UserRole.TeamMember]: 'Team Member',
      [UserRole.SalesManager]: 'Sales Manager',
      [UserRole.SalesRepresentative]: 'Sales Representative',
      [UserRole.MarketingManager]: 'Marketing Manager',
      [UserRole.MarketingAnalyst]: 'Marketing Analyst',
      [UserRole.SupportAdmin]: 'Support Admin',
      [UserRole.SupportAgent]: 'Support Agent',
      [UserRole.ProductManager]: 'Product Manager',
      [UserRole.Developer]: 'Developer',
      [UserRole.QAEngineer]: 'QA Engineer',
      [UserRole.Designer]: 'Designer',
      [UserRole.FinanceManager]: 'Finance Manager',
      [UserRole.BillingSpecialist]: 'Billing Specialist',
      [UserRole.Viewer]: 'Viewer',
      [UserRole.Guest]: 'Guest'
    }
    
    return roleNames[role] ?? 'Unknown Role'
  }

  /**
   * Get available roles for invitations (excluding SuperAdmin)
   */
  getAvailableRoles(): Array<{ value: UserRole; label: string }> {
    return [
      { value: UserRole.Admin, label: this.getRoleName(UserRole.Admin) },
      { value: UserRole.TeamOwner, label: this.getRoleName(UserRole.TeamOwner) },
      { value: UserRole.TeamManager, label: this.getRoleName(UserRole.TeamManager) },
      { value: UserRole.TeamMember, label: this.getRoleName(UserRole.TeamMember) },
      { value: UserRole.SalesManager, label: this.getRoleName(UserRole.SalesManager) },
      { value: UserRole.SalesRepresentative, label: this.getRoleName(UserRole.SalesRepresentative) },
      { value: UserRole.MarketingManager, label: this.getRoleName(UserRole.MarketingManager) },
      { value: UserRole.MarketingAnalyst, label: this.getRoleName(UserRole.MarketingAnalyst) },
      { value: UserRole.SupportAdmin, label: this.getRoleName(UserRole.SupportAdmin) },
      { value: UserRole.SupportAgent, label: this.getRoleName(UserRole.SupportAgent) },
      { value: UserRole.ProductManager, label: this.getRoleName(UserRole.ProductManager) },
      { value: UserRole.Developer, label: this.getRoleName(UserRole.Developer) },
      { value: UserRole.QAEngineer, label: this.getRoleName(UserRole.QAEngineer) },
      { value: UserRole.Designer, label: this.getRoleName(UserRole.Designer) },
      { value: UserRole.FinanceManager, label: this.getRoleName(UserRole.FinanceManager) },
      { value: UserRole.BillingSpecialist, label: this.getRoleName(UserRole.BillingSpecialist) },
      { value: UserRole.Viewer, label: this.getRoleName(UserRole.Viewer) }
    ]
  }

  /**
   * Get common team roles (most frequently used)
   */
  getCommonRoles(): Array<{ value: UserRole; label: string }> {
    return [
      { value: UserRole.Admin, label: this.getRoleName(UserRole.Admin) },
      { value: UserRole.TeamManager, label: this.getRoleName(UserRole.TeamManager) },
      { value: UserRole.TeamMember, label: this.getRoleName(UserRole.TeamMember) },
      { value: UserRole.Developer, label: this.getRoleName(UserRole.Developer) },
      { value: UserRole.Designer, label: this.getRoleName(UserRole.Designer) },
      { value: UserRole.Viewer, label: this.getRoleName(UserRole.Viewer) }
    ]
  }

}

export const teamService = new TeamService()