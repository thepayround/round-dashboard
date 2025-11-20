import { useCallback, useMemo, useState } from 'react'

import type { TeamSettings } from '../types/onboarding'

import { useTeamInvitation, useTeamRoleUtils } from '@/shared/hooks/api/useTeam'
import { useAuth } from '@/shared/hooks/useAuth'
import { UserRole } from '@/shared/services/api/team.service'

interface UseTeamStepControllerParams {
  data: TeamSettings
  onChange: (data: TeamSettings) => void
  showSuccess: (message: string) => void
  showError: (message: string, details?: Record<string, string>) => void
}

interface UseTeamStepControllerReturn {
  inviteEmail: string
  inviteRole: string
  isLoading: boolean
  canInvite: boolean
  pendingInvitations: TeamSettings['invitations']
  handleInviteEmailChange: (value: string) => void
  handleInviteRoleChange: (value: string) => void
  handleInviteTeamMember: () => Promise<void>
  handleRemoveInvitation: (id: string) => void
  getRoleBadgeColor: (role: string) => string
}

const ROLE_FALLBACK: UserRole = UserRole.TeamMember

const ROLE_MAPPING: Record<string, UserRole> = {
  SuperAdmin: UserRole.SuperAdmin,
  Admin: UserRole.Admin,
  TeamOwner: UserRole.TeamOwner,
  TeamManager: UserRole.TeamManager,
  TeamMember: UserRole.TeamMember,
  SalesManager: UserRole.SalesManager,
  SalesRepresentative: UserRole.SalesRepresentative,
  MarketingManager: UserRole.MarketingManager,
  MarketingAnalyst: UserRole.MarketingAnalyst,
  SupportAdmin: UserRole.SupportAdmin,
  SupportAgent: UserRole.SupportAgent,
  ProductManager: UserRole.ProductManager,
  Developer: UserRole.Developer,
  QAEngineer: UserRole.QAEngineer,
  Designer: UserRole.Designer,
  FinanceManager: UserRole.FinanceManager,
  BillingSpecialist: UserRole.BillingSpecialist,
  Viewer: UserRole.Viewer,
  Guest: UserRole.Guest,
  Sales: UserRole.SalesRepresentative,
  Finance: UserRole.FinanceManager,
  Support: UserRole.SupportAgent,
}

const getRoleBadgeColor = (role: string): string => {
  const roleLower = role.toLowerCase()

  if (roleLower.includes('admin')) {
    return 'bg-primary/20 text-primary border-primary/30'
  }
  if (roleLower.includes('manager') || roleLower.includes('owner')) {
    return 'bg-[#7767DA]/20 text-[#7767DA] border-[#7767DA]/30'
  }
  if (roleLower.includes('member') || roleLower.includes('developer') || roleLower.includes('designer')) {
    return 'bg-[#14BDEA]/20 text-[#14BDEA] border-[#14BDEA]/30'
  }
  if (roleLower.includes('viewer') || roleLower.includes('guest')) {
    return 'bg-gray-400/20 text-gray-400 border-gray-400/30'
  }

  return 'bg-[#32A1E4]/20 text-[#32A1E4] border-[#32A1E4]/30'
}

export const useTeamStepController = ({
  data,
  onChange,
  showSuccess,
  showError,
}: UseTeamStepControllerParams): UseTeamStepControllerReturn => {
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<string>('TeamMember')
  const { state } = useAuth()
  const { inviteUser, isLoading } = useTeamInvitation()
  const { getRoleName } = useTeamRoleUtils()

  const pendingInvitations = useMemo(() => data.invitations, [data.invitations])

  const mapStringRoleToEnum = useCallback(
    (roleString: string): UserRole => ROLE_MAPPING[roleString] ?? ROLE_FALLBACK,
    []
  )

  const handleInviteEmailChange = useCallback((value: string) => {
    setInviteEmail(value)
  }, [])

  const handleInviteRoleChange = useCallback((value: string) => {
    setInviteRole(value)
  }, [])

  const handleRemoveInvitation = useCallback(
    (id: string) => {
      onChange({
        ...data,
        invitations: data.invitations.filter(inv => inv.id !== id),
      })
    },
    [data, onChange]
  )

  const handleInviteTeamMember = useCallback(async () => {
    if (!inviteEmail.trim()) {
      showError('Please enter an email address.')
      return
    }

    let roundAccountId =
      state.user?.roundAccountUsers?.[0]?.roundAccountId ?? state.user?.roundAccountId

    if (!roundAccountId) {
      roundAccountId = state.user?.id
    }

    if (!roundAccountId) {
      showError('User authentication error. Please refresh and try again.')
      return
    }

    if (state.user?.email && inviteEmail.trim().toLowerCase() === state.user.email.toLowerCase()) {
      showError('You cannot invite yourself to the organization.')
      return
    }

    const existingInvitation = data.invitations.find(
      inv => inv.email.toLowerCase() === inviteEmail.trim().toLowerCase()
    )
    if (existingInvitation) {
      showError('This email address has already been invited.')
      return
    }

    try {
      const result = await inviteUser({
        roundAccountId,
        email: inviteEmail.trim(),
        role: mapStringRoleToEnum(inviteRole),
      })

      if (result.success) {
        showSuccess('Invitation sent successfully!')

        const newInvitation = {
          id: Date.now().toString(),
          email: inviteEmail.trim(),
          role: getRoleName(mapStringRoleToEnum(inviteRole)),
          status: 'pending' as const,
        }

        onChange({
          ...data,
          invitations: [...data.invitations, newInvitation],
        })

        setInviteEmail('')
        setInviteRole('TeamMember')
      } else {
        const details =
          'details' in result ? (result.details as Record<string, string>) : undefined
        showError(result.error ?? 'Failed to send invitation', details)
      }
    } catch (error) {
      showError('An unexpected error occurred while sending the invitation.')
    }
  }, [
    data,
    getRoleName,
    inviteEmail,
    inviteRole,
    inviteUser,
    mapStringRoleToEnum,
    onChange,
    showError,
    showSuccess,
    state.user,
  ])

  const canInvite = useMemo(() => inviteEmail.trim().length > 0 && !isLoading, [inviteEmail, isLoading])

  return {
    inviteEmail,
    inviteRole,
    isLoading,
    canInvite,
    pendingInvitations,
    handleInviteEmailChange,
    handleInviteRoleChange,
    handleInviteTeamMember,
    handleRemoveInvitation,
    getRoleBadgeColor,
  }
}
