import { motion } from 'framer-motion'
import { Users, UserPlus, Mail, Trash2, Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { TeamSettings } from '../../types/onboarding'
import { useTeamInvitation, useTeamRoleUtils } from '@/shared/hooks/api/useTeam'
import { UserRole } from '@/shared/services/api/team.service'
import { useAuth } from '@/shared/hooks/useAuth'
import { ActionButton } from '@/shared/components'

interface TeamStepProps {
  data: TeamSettings
  onChange: (data: TeamSettings) => void
  showSuccess: (message: string) => void
  showError: (message: string, details?: Record<string, string>) => void
}

export const TeamStep = ({ data, onChange, showSuccess, showError }: TeamStepProps) => {
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState(UserRole.TeamMember)
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false)
  const { state } = useAuth()
  const { inviteUser, isLoading } = useTeamInvitation()
  const { getCommonRoles, getRoleName } = useTeamRoleUtils()


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
        role: inviteRole
      })
      

      if (result.success) {
        showSuccess('Invitation sent successfully!')
        
        // Add to local state for UI display
        const newInvitation = {
          id: Date.now().toString(),
          email: inviteEmail.trim(),
          role: getRoleName(inviteRole),
          status: 'pending' as const,
        }

        onChange({
          ...data,
          invitations: [...data.invitations, newInvitation],
        })

        // Reset form
        setInviteEmail('')
        setInviteRole(UserRole.TeamMember)
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

  const Dropdown = ({
    value,
    options,
    placeholder,
    onSelect,
    isOpen,
    setIsOpen,
    error,
  }: {
    value: number
    options: Array<{ value: number; label: string }>
    placeholder: string
    onSelect: (value: number) => void
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    error?: string
  }) => (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`auth-input flex items-center justify-between ${error ? 'auth-input-error' : ''}`}
      >
        <span className={value ? 'text-white' : 'text-gray-400'}>
          {value ? options.find(opt => opt.value === value)?.label : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 text-gray-400"
        >
          ▼
        </motion.div>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl z-dropdown max-h-60 overflow-y-auto"
        >
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onSelect(option.value)
                setIsOpen(false)
              }}
              className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
            >
              {option.label}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  )

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
          className="w-16 h-16 mx-auto rounded-lg bg-gradient-to-br from-[#32A1E4]/20 to-[#14BDEA]/20 backdrop-blur-sm border border-white/20 flex items-center justify-center"
        >
          <Users className="w-8 h-8 text-[#32A1E4]" />
        </motion.div>

        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Team</h2>
          <p className="text-gray-400 text-lg">Invite your team members</p>
        </div>
      </div>

      {/* Invite Team Members Section */}
      <div className="space-y-6">
        <div className="p-6 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <UserPlus className="w-6 h-6 text-[#32A1E4]" />
              <h3 className="text-lg font-semibold text-white">Invite Team Members</h3>
            </div>

            {/* Invite Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="inviteEmail" className="auth-label">
                    Email Address
                  </label>
                  <div className="input-container">
                    <Mail className="input-icon-left auth-icon-primary" />
                    <input
                      id="inviteEmail"
                      type="email"
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      placeholder="colleague@example.com"
                      className="auth-input input-with-icon-left"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="inviteRole"
                    className="auth-label"
                  >
                    Role
                  </label>
                  <Dropdown
                    value={inviteRole}
                    options={getCommonRoles()}
                    placeholder="Select role"
                    onSelect={(value) => setInviteRole(value)}
                    isOpen={roleDropdownOpen}
                    setIsOpen={setRoleDropdownOpen}
                  />
                </div>
              </div>

              <ActionButton
                label={isLoading ? 'Sending...' : 'Send Invitation'}
                onClick={handleInviteTeamMember}
                disabled={!inviteEmail.trim() || isLoading}
                icon={isLoading ? Loader2 : UserPlus}
                loading={isLoading}
                size="md"
                animated={false}
                actionType="general"
              />

            </div>
          </div>
        </div>

        {/* Invited Members List */}
        {data.invitations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-medium text-white">Pending Invitations</h4>
            <div className="space-y-3">
              {data.invitations.map(invitation => (
                <motion.div
                  key={invitation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D417C8]/20 to-[#14BDEA]/20 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-[#32A1E4]" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{invitation.email}</p>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full border ${getRoleBadgeColor(invitation.role)}`}
                          >
                            {invitation.role}
                          </span>
                          <span className="text-xs text-gray-400">Status: {invitation.status}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveInvitation(invitation.id)}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}


        {/* Skip Option */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            You can invite team members later from your team management page
          </p>
        </div>
      </div>

    </motion.div>
  )
}
