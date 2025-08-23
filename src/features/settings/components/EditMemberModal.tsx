import { useState, useEffect } from 'react'
import { Modal } from '@/shared/components/Modal/Modal'
import { ActionButton } from '@/shared/components/ActionButton'
import { Edit, Crown, Shield, Users } from 'lucide-react'
import type { UserRole, TeamMember } from '../types/team.types'

interface EditMemberModalProps {
  isOpen: boolean
  onClose: () => void
  member: TeamMember | null
  onUpdateRole: (userId: string, role: UserRole) => Promise<boolean>
  isLoading?: boolean
}

const roleOptions: { value: UserRole; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  {
    value: 'Admin',
    label: 'Administrator',
    description: 'Full access to manage organization, settings, billing, and team members',
    icon: Crown
  },
  {
    value: 'TeamManager',
    label: 'Team Manager',
    description: 'Manage team members, view reports, and handle team operations',
    icon: Shield
  },
  {
    value: 'TeamMember',
    label: 'Team Member',
    description: 'Standard access to collaborate and work with the team',
    icon: Users
  },
  {
    value: 'SalesManager',
    label: 'Sales Manager',
    description: 'Manage sales operations, leads, and sales team performance',
    icon: Shield
  },
  {
    value: 'SalesRepresentative',
    label: 'Sales Representative',
    description: 'Handle sales activities, customer relationships, and deals',
    icon: Users
  },
  {
    value: 'MarketingManager',
    label: 'Marketing Manager',
    description: 'Manage marketing campaigns, analytics, and marketing team',
    icon: Shield
  },
  {
    value: 'SupportAdmin',
    label: 'Support Administrator',
    description: 'Manage support operations and customer service team',
    icon: Shield
  },
  {
    value: 'SupportAgent',
    label: 'Support Agent',
    description: 'Provide customer support and handle support tickets',
    icon: Users
  },
  {
    value: 'Viewer',
    label: 'Viewer',
    description: 'Read-only access to view data and reports',
    icon: Users
  }
]

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
          <div className="block text-sm font-medium text-gray-300 mb-3">
            Select New Role
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {roleOptions.map((role) => {
              const IconComponent = role.icon
              const isCurrentRole = role.value === member.role
              
              // Determine classes based on state
              let containerClasses = 'relative flex items-start p-3 cursor-pointer rounded-lg border transition-all duration-200 '
              if (selectedRole === role.value) {
                containerClasses += 'border-purple-500 bg-purple-500/10'
              } else if (isCurrentRole) {
                containerClasses += 'border-blue-500 bg-blue-500/5'
              } else {
                containerClasses += 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
              }

              let radioClasses = 'flex-shrink-0 w-2 h-2 border-2 rounded-full mr-3 '
              if (selectedRole === role.value) {
                radioClasses += 'border-purple-500 bg-purple-500'
              } else if (isCurrentRole) {
                radioClasses += 'border-blue-500 bg-blue-500'
              } else {
                radioClasses += 'border-gray-400'
              }

              return (
                <label
                  key={role.value}
                  className={containerClasses}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={selectedRole === role.value}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="sr-only"
                  />
                  <div className="flex items-center w-full">
                    <div className={radioClasses} />
                    <IconComponent className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-white">
                          {role.label}
                        </span>
                        {isCurrentRole && (
                          <span className="ml-2 px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-md">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {role.description}
                      </div>
                    </div>
                  </div>
                </label>
              )
            })}
          </div>
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
