export type UserRole = 
  | 'SuperAdmin'
  | 'Admin'
  | 'TeamManager'
  | 'TeamMember'
  | 'Sales'
  | 'Finance'
  | 'Support'
  | 'Viewer'

export type InvitationStatus = 'Pending' | 'Expired' | 'Accepted' | 'Cancelled'

export interface TeamMember {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  role: UserRole
  roleName: string
  joinedAt: string
  isOwner: boolean
  status: string
}

export interface TeamInvitation {
  id: string
  email: string
  role: UserRole
  roleName: string
  invitedAt: string
  invitedByName: string
  status: InvitationStatus
  expiresAt?: string
}

export interface InviteMemberRequest {
  email: string
  role: UserRole
}

export interface UpdateMemberRoleRequest {
  role: UserRole
}

export interface TeamManagementState {
  members: TeamMember[]
  invitations: TeamInvitation[]
  isLoading: boolean
  error: string | null
}

export interface TeamManagementActions {
  inviteMember: (roundAccountId: string, email: string, role: UserRole) => Promise<boolean>
  updateMemberRole: (roundAccountId: string, userId: string, role: UserRole) => Promise<boolean>
  removeMember: (roundAccountId: string, userId: string) => Promise<boolean>
  resendInvitation: (roundAccountId: string, invitationId: string) => Promise<boolean>
  cancelInvitation: (roundAccountId: string, invitationId: string) => Promise<boolean>
  refresh: (roundAccountId: string) => Promise<void>
}
