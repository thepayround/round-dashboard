import { motion } from 'framer-motion'
import { Users, UserPlus, Mail, Trash2, Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { TeamSettings } from '../../types/onboarding'
import { useTeamInvitation, useTeamRoleUtils } from '@/shared/hooks/api/useTeam'
import { UserRole } from '@/shared/services/api/team.service'
import { useAuth } from '@/shared/hooks/useAuth'
import { ApiDropdown } from '@/shared/components/ui/ApiDropdown'
import { teamRoleDropdownConfig } from '@/shared/components/ui/ApiDropdown/configs'

interface TeamStepProps {
  data: TeamSettings
  onChange: (data: TeamSettings) => void
  showSuccess: (message: string) => void
  showError: (message: string, details?: Record<string, string>) => void
}

export const TeamStep = ({ data, onChange, showSuccess, showError }: TeamStepProps) => {
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('TeamMember') // Use string value that maps to UserRole.TeamMember
  const { state } = useAuth()
  const { inviteUser, isLoading } = useTeamInvitation()
  const { getRoleName } = useTeamRoleUtils()

  // Map string role values to UserRole enum values for API calls
  const mapStringRoleToEnum = (roleString: string): UserRole => {
    const roleMapping: Record<string, UserRole> = {
      'SuperAdmin': UserRole.SuperAdmin,
      'Admin': UserRole.Admin,
      'TeamOwner': UserRole.TeamOwner,
      'TeamManager': UserRole.TeamManager,
      'TeamMember': UserRole.TeamMember,
      'SalesManager': UserRole.SalesManager,
      'SalesRepresentative': UserRole.SalesRepresentative,
      'MarketingManager': UserRole.MarketingManager,
      'MarketingAnalyst': UserRole.MarketingAnalyst,
      'SupportAdmin': UserRole.SupportAdmin,
      'SupportAgent': UserRole.SupportAgent,
      'ProductManager': UserRole.ProductManager,
      'Developer': UserRole.Developer,
      'QAEngineer': UserRole.QAEngineer,
      'Designer': UserRole.Designer,
      'FinanceManager': UserRole.FinanceManager,
      'BillingSpecialist': UserRole.BillingSpecialist,
      'Viewer': UserRole.Viewer,
      'Guest': UserRole.Guest,
      // Handle backend role names (simplified)
      'Sales': UserRole.SalesRepresentative,
      'Finance': UserRole.FinanceManager,
      'Support': UserRole.SupportAgent
    }
    
    return roleMapping[roleString] ?? UserRole.TeamMember
  }

  const handleInviteTeamMember = async () => {
    if (!inviteEmail.trim()) {
      showError('Please enter an email address.')
      return
    }
    
    // Get roundAccountId from the user's RoundAccountUsers collection
    // The user.id is the userId, not the roundAccountId
    let roundAccountId = state.user?.roundAccountUsers?.[0]?.roundAccountId ?? state.user?.roundAccountId
    
    // Fallback: If no round account exists, use the user's ID 
    // This handles cases where the user account relationship isn't properly set up
    if (!roundAccountId) {
      console.warn('No roundAccountId found, using user ID as fallback')
      roundAccountId = state.user?.id
    }
    
    if (!roundAccountId) {
      console.error('No ID available for round account')
      showError('User authentication error. Please refresh and try again.')
      return
    }
    
    // Check if user is trying to invite themselves
    if (state.user?.email && inviteEmail.trim().toLowerCase() === state.user.email.toLowerCase()) {
      showError('You cannot invite yourself to the organization.')
      return
    }

    // Check if email is already in pending invitations
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
        role: mapStringRoleToEnum(inviteRole)
      })
      

      if (result.success) {
        showSuccess('Invitation sent successfully!')
        
        // Add to local state for UI display
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

        // Reset form
        setInviteEmail('')
        setInviteRole('TeamMember')
      } else {
        // Backend validation errors will be handled by the API response
        showError(
          result.error ?? 'Failed to send invitation', 
          'details' in result ? result.details as Record<string, string> : undefined
        )
      }
    } catch (error) {
      showError('An unexpected error occurred while sending the invitation.')
    }
  }

  const handleRemoveInvitation = (id: string) => {
    onChange({
      ...data,
      invitations: data.invitations.filter(inv => inv.id !== id),
    })
  }

  const getRoleBadgeColor = (role: string) => {
    const roleLower = role.toLowerCase()
    
    if (roleLower.includes('admin')) {
      return 'bg-[#D417C8]/20 text-[#D417C8] border-[#D417C8]/30'
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


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 mx-auto rounded-lg bg-secondary/20 border border-white/20 flex items-center justify-center"
        >
          <Users className="w-8 h-8 text-[#32A1E4]" />
        </motion.div>

        <div>
          <h2 className="text-lg font-medium tracking-tight text-white mb-2">Team</h2>
          <p className="text-gray-400 text-sm">Invite your team members</p>
        </div>
      </div>

      {/* Invite Team Members Section */}
      <div className="space-y-6">
        <div className="p-4 rounded-lg bg-[#1d1d20] border border-[#25262a]">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <UserPlus className="w-4 h-4 text-[#32A1E4]" />
              <h3 className="text-sm font-normal tracking-tight text-white">Invite team members</h3>
            </div>

            {/* Invite Form */}
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label htmlFor="inviteEmail" className="auth-label">Email Address</label>
                <div className="input-container">
                  <Mail className="input-icon-left auth-icon-primary w-3 h-3" />
                  <input
                    id="inviteEmail"
                    type="email"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    className="auth-input input-with-icon-left text-xs w-full"
                  />
                </div>
              </div>
              <div className="w-40">
                <label htmlFor="inviteRole" className="auth-label">Role</label>
                <ApiDropdown
                  config={teamRoleDropdownConfig}
                  value={inviteRole}
                  onSelect={(value) => setInviteRole(value)}
                />
              </div>
              <button
                onClick={handleInviteTeamMember}
                disabled={!inviteEmail.trim() || isLoading}
                className="px-4 py-2 h-9 rounded-lg bg-secondary hover:brightness-105 disabled:opacity-50 text-white text-xs font-normal tracking-tight flex items-center gap-2 shrink-0"
              >
                {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserPlus className="w-3 h-3" />}
                {isLoading ? 'Sending...' : 'Invite'}
              </button>
            </div>
          </div>
        </div>

        {/* Invited Members List */}
        {data.invitations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h4 className="text-xs font-normal tracking-tight text-white">Pending invitations</h4>
            <div className="space-y-2">
              {data.invitations.map(invitation => (
                <motion.div
                  key={invitation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 rounded-lg bg-[#212124] border border-[#2c2d31]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                        <Mail className="w-3 h-3 text-[#32A1E4]" />
                      </div>
                      <div>
                        <p className="text-xs font-normal tracking-tight text-white">{invitation.email}</p>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded border ${getRoleBadgeColor(invitation.role)}`}
                          >
                            {invitation.role}
                          </span>
                          <span className="text-xs text-white/90">{invitation.status}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveInvitation(invitation.id)}
                      className="p-1.5 rounded text-red-400 hover:bg-red-400/10 transition-colors duration-200"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}


        {/* Skip Option */}
        <div className="text-center">
          <p className="text-xs text-gray-400">
            You can invite team members later from your team management page
          </p>
        </div>
      </div>

    </motion.div>
  )
}
