import { Edit, User, Crown, AlertCircle } from 'lucide-react'

import { useEditMemberModalController } from '../hooks/useEditMemberModalController'
import type { UserRole, TeamMember } from '../types/team.types'

import { ActionButton } from '@/shared/ui/ActionButton'
import { ApiDropdown, teamRoleDropdownConfig } from '@/shared/ui/ApiDropdown'
import { Modal } from '@/shared/ui/Modal/Modal'


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
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Team Member"
      subtitle={`Update role for ${member.fullName}`}
      icon={Edit}
      size="lg"
    >
      <form
        onSubmit={event => {
          event.preventDefault()
          handleSubmit()
        }}
        className="p-6 space-y-6"
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
              <p className="text-gray-400 text-sm mb-2">{member.email}</p>
              <div className="flex items-center space-x-2">
                <User className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-400">
                  Current role: <span className="text-gray-300 font-medium">{member.roleName}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="block text-sm font-normal tracking-tight text-gray-300 mb-2">Select New Role</div>
          <div className="mb-3">
            <span className="text-xs text-gray-400 bg-white/[0.08] px-2 py-1 rounded-lg border border-white/15">
              Current: <span className="text-gray-300 font-medium">{member.roleName}</span>
            </span>
          </div>
          <ApiDropdown
            config={teamRoleDropdownConfig}
            value={selectedRole}
            onSelect={value => handleRoleChange(value as UserRole)}
            disabled={isEditingSelf}
            className="w-full"
          />
        </div>

        {isEditingSelf && (
          <div className="relative">
            <div className="p-3 bg-amber-500/15 border border-amber-500/25 rounded-lg text-amber-400 text-sm">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>You cannot change your own role. Ask another administrator to update your role.</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="relative">
            <div className="p-3 bg-red-500/15 border border-red-500/25 rounded-lg text-primary text-sm">{error}</div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-6">
          <ActionButton
            label="Cancel"
            onClick={handleClose}
            variant="secondary"
            disabled={isLoading}
            actionType="general"
          />
          <ActionButton
            label="Update Role"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={isLoading || !canSubmit}
            icon={Edit}
            actionType="general"
          />
        </div>
      </form>
    </Modal>
  )
}
