import { motion } from 'framer-motion'
import { Users, UserPlus, Trash2, Loader2, Mail } from 'lucide-react'

import type { StepComponentProps } from '../../config/types'
import { useTeamStepController } from '../../hooks/useTeamStepController'
import type { TeamSettings } from '../../types/onboarding'

import { DetailCard } from '@/shared/ui/DetailCard'
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
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1 text-center">
        <h2 className="text-base font-medium text-foreground">Team</h2>
        <p className="text-sm text-muted-foreground">Invite your team members to collaborate</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <DetailCard
          title="Invite Team Members"
          icon={<Users className="h-4 w-4" />}
        >
          <div className="space-y-6">
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
                type="button"
                onClick={handleInviteTeamMember}
                disabled={!canInvite}
                variant="secondary"
                size="default"
                className="shrink-0 gap-2"
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

            {pendingInvitations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending Invitations</h4>
                <div className="space-y-2">
                  {pendingInvitations.map(invitation => (
                    <motion.div
                      key={invitation.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-foreground">{invitation.email}</p>
                          <div className="flex items-center gap-2 mt-0.5">
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
                        type="button"
                        onClick={() => handleRemoveInvitation(invitation.id)}
                        variant="ghost"
                        size="icon"
                        aria-label="Remove invitation"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            <p className="text-xs text-muted-foreground text-center pt-2">
              You can invite team members later from your team management page
            </p>
          </div>
        </DetailCard>
      </div>
    </div>
  )
}
