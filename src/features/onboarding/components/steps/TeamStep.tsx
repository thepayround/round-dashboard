import { motion } from 'framer-motion'
import { Users, UserPlus, Trash2, Loader2, Mail } from 'lucide-react'

import type { StepComponentProps } from '../../config/types'
import { useTeamStepController } from '../../hooks/useTeamStepController'
import type { TeamSettings } from '../../types/onboarding'

import { SimpleSelect } from '@/shared/ui/SimpleSelect'
import { Button } from '@/shared/ui/shadcn/button'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'


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
          className="w-16 h-16 mx-auto rounded-lg bg-secondary/20 border border-secondary/20 flex items-center justify-center"
        >
          <Users className="w-8 h-8 text-secondary" />
        </motion.div>

        <div>
          <h2 className="text-lg font-medium tracking-tight text-foreground mb-2">Team</h2>
          <p className="text-muted-foreground text-sm">Invite your team members</p>
        </div>
      </div>

      <div className="max-w-[520px] mx-auto space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-[1fr_140px_auto] gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="inviteEmail">Email Address</Label>
              <Input
                id="inviteEmail"
                type="email"
                value={inviteEmail}
                onChange={event => handleInviteEmailChange(event.target.value)}
                placeholder="colleague@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inviteRole">Role</Label>
              <SimpleSelect
                id="inviteRole"
                options={[
                  { value: 'TeamMember', label: 'Team Member' },
                  { value: 'TeamManager', label: 'Team Manager' },
                  { value: 'TeamOwner', label: 'Team Owner' },
                  { value: 'Admin', label: 'Admin' },
                  { value: 'Viewer', label: 'Viewer' }
                ]}
                value={inviteRole}
                onChange={handleInviteRoleChange}
                placeholder="Select role"
              />
            </div>
            <Button
              onClick={handleInviteTeamMember}
              disabled={!canInvite}
              variant="secondary"
              size="default"
              className="shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Invite
                </>
              )}
            </Button>
          </div>
        </div>

        {pendingInvitations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h4 className="text-xs font-normal tracking-tight text-foreground">Pending invitations</h4>
            <div className="space-y-2">
              {pendingInvitations.map(invitation => (
                <motion.div
                  key={invitation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 rounded-lg bg-muted border border-border"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                        <Mail className="w-3 h-3 text-secondary" />
                      </div>
                      <div>
                        <p className="text-xs font-normal tracking-tight text-foreground">{invitation.email}</p>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded border ${getRoleBadgeColor(invitation.role)}`}
                          >
                            {invitation.role}
                          </span>
                          <span className="text-xs text-muted-foreground">{invitation.status}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleRemoveInvitation(invitation.id)}
                      variant="destructive"
                      size="icon"
                      aria-label="Remove invitation"
                      className="h-8 w-8 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            You can invite team members later from your team management page
          </p>
        </div>
      </div>
    </motion.div>
  )
}
