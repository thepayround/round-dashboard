import { useState, useEffect } from 'react'
import { Modal } from '@/shared/components/Modal/Modal'
import { ActionButton } from '@/shared/components/ActionButton'
import { ApiDropdown, teamRoleDropdownConfig } from '@/shared/components/ui/ApiDropdown'
import { Edit, User, Crown, AlertCircle } from 'lucide-react'
import { useAuth } from '@/shared/hooks/useAuth'
import type { UserRole, TeamMember } from '../types/team.types'

interface EditMemberModalProps {
  isOpen: boolean
  onClose: () => void
  member: TeamMember | null
  onUpdateRole: (userId: string, role: UserRole) => Promise<boolean>
  isLoading?: boolean
}


export const EditMemberModal = ({ isOpen, onClose, member, onUpdateRole, isLoading = false }: EditMemberModalProps) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('TeamMember')
  const [error, setError] = useState('')
  const { state } = useAuth()

  // Check if the member being edited is the current user
  const isEditingSelf = member?.id === state.user?.id

  // Update selected role when member changes
  useEffect(() => {
    if (member) {
      setSelectedRole(member.role)
    }
  }, [member])

  const handleUpdateClick = () => {
    const event = {
      preventDefault: () => {},
      currentTarget: {} as HTMLFormElement,
      target: {} as HTMLFormElement
    } as unknown as React.FormEvent<HTMLFormElement>
    handleSubmit(event)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!member) {
      setError('No member selected')
      return
    }

    // Check if role actually changed
    if (selectedRole === member.role) {
      onClose()
      return
    }

    try {
      const success = await onUpdateRole(member.id, selectedRole)
      if (success) {
        setError('')
        onClose()
      } else {
        setError('Failed to update member role. Please try again.')
      }
    } catch (err) {
      setError('An error occurred while updating the member role')
      console.error('Update member role error:', err)
    }
  }

  const handleClose = () => {
    setError('')
    onClose()
  }

  if (!member) {
    return null
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Team Member"
      subtitle={`Update role for ${member.fullName}`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Member Info */}
        <div className="bg-white/[0.06] border border-white/15 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#D417C8] to-[#14BDEA] rounded-lg flex items-center justify-center">
              <span className="text-white font-medium text-lg">
                {member.firstName[0]}{member.lastName[0]}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-white font-medium">{member.fullName}</h3>
                {member.isOwner && (
                  <Crown className="w-4 h-4 text-yellow-400" />
                )}
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

        {/* Role Selection */}
        <div>
          <div className="block text-sm font-normal tracking-tight text-gray-300 mb-2">
            Select New Role
          </div>
          <div className="mb-3">
            <span className="text-xs text-gray-400 bg-white/[0.08] px-2 py-1 rounded-lg border border-white/15">
              Current: <span className="text-gray-300 font-medium">{member.roleName}</span>
            </span>
          </div>
          <ApiDropdown
            config={teamRoleDropdownConfig}
            value={selectedRole}
            onSelect={(value) => setSelectedRole(value as UserRole)}
            disabled={isEditingSelf}
            className="w-full"
          />
        </div>

        {/* Warning Message for Self-Edit */}
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

        {/* Error Message */}
        {error && (
          <div className="relative">
            <div className="p-3 bg-red-500/15 border border-red-500/25 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          </div>
        )}

        {/* Actions */}
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
            onClick={handleUpdateClick}
            loading={isLoading}
            disabled={isLoading || selectedRole === member.role || isEditingSelf}
            icon={Edit}
            actionType="general"
          />
        </div>
      </form>
    </Modal>
  )
}
