import { Edit, User, Crown, AlertCircle } from 'lucide-react'

import { useEditMemberModalController } from '../hooks/useEditMemberModalController'
import type { UserRole, TeamMember } from '../types/team.types'

import { Combobox } from '@/shared/ui/Combobox'
import type { ComboboxOption } from '@/shared/ui/Combobox/types'
import { Alert, AlertDescription } from '@/shared/ui/shadcn/alert'
import { Button } from '@/shared/ui/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/shadcn/dialog'
import { Label } from '@/shared/ui/shadcn/label'

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
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-medium text-lg">
                  {member.firstName[0]}
                  {member.lastName[0]}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-foreground font-medium">{member.fullName}</h3>
                  {member.isOwner && <Crown className="w-4 h-4 text-warning" />}
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
            <Label htmlFor="member-role">
              Select New Role <span className="text-destructive">*</span>
            </Label>
            <div className="mb-4">
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg border border-border">
                Current: <span className="text-foreground font-medium">{member.roleName}</span>
              </span>
            </div>
            <Combobox
              id="member-role"
              options={ROLE_OPTIONS}
              value={selectedRole}
              onChange={value => handleRoleChange(value ?? selectedRole)}
              placeholder="Select a role"
              disabled={isEditingSelf}
              searchable={true}
              clearable={false}
            />
          </div>

          {isEditingSelf && (
            <Alert className="bg-warning/10 border-warning/30" role="alert">
              <AlertCircle className="h-4 w-4 text-warning" />
              <AlertDescription className="text-warning-foreground">
                You cannot change your own role. Ask another administrator to update your role.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" role="alert" aria-live="polite">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" onClick={handleClose} variant="ghost" disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !canSubmit}
              aria-busy={isLoading}
            >
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
