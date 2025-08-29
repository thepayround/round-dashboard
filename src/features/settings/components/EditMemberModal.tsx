import { useState, useEffect } from 'react'
import { Modal } from '@/shared/components/Modal/Modal'
import { ActionButton } from '@/shared/components/ActionButton'
import { ApiDropdown, teamRoleDropdownConfig } from '@/shared/components/ui/ApiDropdown'
import { Edit } from 'lucide-react'
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
        <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {member.firstName[0]}{member.lastName[0]}
              </span>
            </div>
            <div>
              <h3 className="text-white font-medium">{member.fullName}</h3>
              <p className="text-gray-400 text-sm">{member.email}</p>
              <p className="text-gray-500 text-xs mt-1">
                Current role: <span className="text-gray-300">{member.roleName}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Role Selection */}
        <div>
          <div className="block text-sm font-medium text-gray-300 mb-2">
            Select New Role
          </div>
          <div className="mb-2">
            <span className="text-xs text-gray-400">
              Current: <span className="text-gray-300">{member.roleName}</span>
            </span>
          </div>
          <ApiDropdown
            config={teamRoleDropdownConfig}
            value={selectedRole}
            onSelect={(value) => setSelectedRole(value as UserRole)}
            className="w-full"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
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
            disabled={isLoading || selectedRole === member.role}
            icon={Edit}
            actionType="general"
          />
        </div>
      </form>
    </Modal>
  )
}
