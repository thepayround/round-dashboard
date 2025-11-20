import { motion } from 'framer-motion'
import { Users, UserPlus, Mail, Trash2, Loader2 } from 'lucide-react'

import type { StepComponentProps } from '../../config/types'
import { useTeamStepController } from '../../hooks/useTeamStepController'
import type { TeamSettings } from '../../types/onboarding'

import { ApiDropdown } from '@/shared/ui/ApiDropdown'
import { teamRoleDropdownConfig } from '@/shared/ui/ApiDropdown/configs'
import { Button, IconButton } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'


interface TeamStepProps extends StepComponentProps<TeamSettings> {
  showSuccess: (message: string) => void
  showError: (message: string, details?: Record<string, string>) => void
}

export const TeamStep = ({ data, onChange, showSuccess, showError }: TeamStepProps) => {
  const {
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
  } = useTeamStepController({ data, onChange, showSuccess, showError })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
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

      <div className="space-y-6">
        <div className="p-4">
          <div className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Input
                  id="inviteEmail"
                  type="email"
                  label="Email Address"
                  value={inviteEmail}
                  onChange={event => handleInviteEmailChange(event.target.value)}
                  placeholder="colleague@example.com"
                  leftIcon={Mail}
                  size="sm"
                />
              </div>
              <div className="w-40">
                <label htmlFor="inviteRole" className="auth-label">
                  Role
                </label>
                <ApiDropdown
                  config={teamRoleDropdownConfig}
                  value={inviteRole}
                  onSelect={handleInviteRoleChange}
                />
              </div>
              <Button
                onClick={handleInviteTeamMember}
                disabled={!canInvite}
                variant="secondary"
                size="md"
                icon={isLoading ? Loader2 : UserPlus}
                iconPosition="left"
                loading={isLoading}
                className="shrink-0"
              >
                {isLoading ? 'Sending...' : 'Invite'}
              </Button>
            </div>
          </div>
        </div>

        {pendingInvitations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h4 className="text-xs font-normal tracking-tight text-white">Pending invitations</h4>
            <div className="space-y-2">
              {pendingInvitations.map(invitation => (
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
                    <IconButton
                      onClick={() => handleRemoveInvitation(invitation.id)}
                      icon={Trash2}
                      variant="danger"
                      size="sm"
                      aria-label="Remove invitation"
                      className="hover:bg-red-400/10"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="text-center">
          <p className="text-xs text-gray-400">
            You can invite team members later from your team management page
          </p>
        </div>
      </div>
    </motion.div>
  )
}
