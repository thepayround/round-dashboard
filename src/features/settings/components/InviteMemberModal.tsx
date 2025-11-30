import { Mail, UserPlus } from 'lucide-react'

import { useInviteMemberModalController } from '../hooks/useInviteMemberModalController'
import type { UserRole } from '../types/team.types'

import { Combobox } from '@/shared/ui/Combobox'
import type { ComboboxOption } from '@/shared/ui/Combobox/types'
import { Alert, AlertDescription } from '@/shared/ui/shadcn/alert'
import { Button } from '@/shared/ui/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/shadcn/dialog'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'

interface InviteMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onInvite: (email: string, role: UserRole) => Promise<boolean>
  isLoading?: boolean
}

const ROLE_OPTIONS: ComboboxOption<UserRole>[] = [
  { value: 'SuperAdmin', label: 'Super Admin - Full system access' },
  { value: 'Admin', label: 'Admin - Manage team and settings' },
  { value: 'TeamManager', label: 'Team Manager - Manage team members' },
  { value: 'TeamMember', label: 'Team Member - Standard access' },
  { value: 'Sales', label: 'Sales - Sales team member' },
  { value: 'Finance', label: 'Finance - Finance team member' },
  { value: 'Support', label: 'Support - Support team member' },
  { value: 'Viewer', label: 'Viewer - Read-only access' },
]

export const InviteMemberModal = ({
  isOpen,
  onClose,
  onInvite,
  isLoading = false,
}: InviteMemberModalProps) => {
  const {
    email,
    selectedRole,
    error,
    isSubmitDisabled,
    handleEmailChange,
    handleRoleChange,
    handleSubmit,
    handleClose,
  } = useInviteMemberModalController({ onInvite, onClose })

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5" />
            <span>Invite Team Member</span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Send an invitation to join your team</p>
        </DialogHeader>

        <form
          onSubmit={event => {
            event.preventDefault()
            handleSubmit()
          }}
          className="space-y-6 pt-4"
        >
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="invite-email"
                type="email"
                value={email}
                onChange={event => handleEmailChange(event.target.value)}
                placeholder="colleague@company.com"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invite-role">Select Role</Label>
            <Combobox
              id="invite-role"
              options={ROLE_OPTIONS}
              value={selectedRole}
              onChange={value => handleRoleChange((value ?? 'TeamMember') as UserRole)}
              placeholder="Select a role"
              searchable={true}
              clearable={false}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              variant="secondary"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || isSubmitDisabled}
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Sending...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Send Invitation
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
