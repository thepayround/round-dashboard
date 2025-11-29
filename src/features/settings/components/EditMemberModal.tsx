import { Edit, User, Crown, AlertCircle } from 'lucide-react'

import { useEditMemberModalController } from '../hooks/useEditMemberModalController'
import type { UserRole, TeamMember } from '../types/team.types'

import { Alert, AlertDescription } from '@/shared/ui/shadcn/alert'
import { Button } from '@/shared/ui/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/shadcn/dialog'
import { Label } from '@/shared/ui/shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/shadcn/select'

const ROLE_OPTIONS: { value: UserRole; label: string; description: string }[] = [
  { value: 'SuperAdmin', label: 'Super Admin', description: 'Full system access' },
  { value: 'Admin', label: 'Admin', description: 'Manage team and settings' },
  { value: 'TeamManager', label: 'Team Manager', description: 'Manage team members' },
  { value: 'TeamMember', label: 'Team Member', description: 'Standard access' },
  { value: 'Sales', label: 'Sales', description: 'Sales team member' },
  { value: 'Finance', label: 'Finance', description: 'Finance team member' },
  { value: 'Support', label: 'Support', description: 'Support team member' },
  { value: 'Viewer', label: 'Viewer', description: 'Read-only access' },
]


interface EditMemberModalProps {
  isOpen: boolean
  onClose: () => void
  member: TeamMember | null
  onUpdateRole: (userId: string, role: UserRole) => Promise<boolean>
  isLoading?: boolean
}

export const EditMemberModal = ({
  isOpen,
  onClose,
  member,
  onUpdateRole,
  isLoading = false,
}: EditMemberModalProps) => {
  const { selectedRole, error, isEditingSelf, canSubmit, handleRoleChange, handleSubmit, handleClose } =
    useEditMemberModalController({ member, onUpdateRole, onClose })

  if (!member) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Edit className="w-5 h-5" />
            <span>Edit Team Member</span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Update role for {member.fullName}</p>
        </DialogHeader>

        <form
          onSubmit={event => {
            event.preventDefault()
            handleSubmit()
          }}
          className="space-y-6 pt-4"
        >
          <div className="bg-white/[0.06] border border-white/15 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-medium text-lg">
                  {member.firstName[0]}
                  {member.lastName[0]}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-white font-medium">{member.fullName}</h3>
                  {member.isOwner && <Crown className="w-4 h-4 text-yellow-400" />}
                </div>
                <p className="text-muted-foreground text-sm mb-2">{member.email}</p>
                <div className="flex items-center space-x-2">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Current role: <span className="text-foreground font-medium">{member.roleName}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="member-role">Select New Role</Label>
            <div className="mb-4">
              <span className="text-xs text-muted-foreground bg-white/[0.08] px-2 py-1 rounded-lg border border-white/15">
                Current: <span className="text-foreground font-medium">{member.roleName}</span>
              </span>
            </div>
            <Select
              value={selectedRole}
              onValueChange={value => handleRoleChange(value as UserRole)}
              disabled={isEditingSelf}
            >
              <SelectTrigger id="member-role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex flex-col">
                      <span>{role.label}</span>
                      <span className="text-xs text-muted-foreground">{role.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isEditingSelf && (
            <Alert className="bg-amber-500/10 border-amber-500/30">
              <AlertCircle className="h-4 w-4 text-amber-400" />
              <AlertDescription className="text-amber-50">
                You cannot change your own role. Ask another administrator to update your role.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" onClick={handleClose} variant="ghost" disabled={isLoading}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={isLoading || !canSubmit}>
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Update Role
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
