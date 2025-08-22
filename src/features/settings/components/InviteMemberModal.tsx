import { useState } from 'react'
import { Modal } from '@/shared/components/Modal/Modal'
import { ActionButton } from '@/shared/components/ActionButton'
import { Mail, UserPlus, Crown, Shield, Users } from 'lucide-react'
import type { UserRole } from '../types/team.types'

interface InviteMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onInvite: (email: string, role: UserRole) => Promise<boolean>
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

export const InviteMemberModal = ({ isOpen, onClose, onInvite, isLoading = false }: InviteMemberModalProps) => {
  const [email, setEmail] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole>('TeamMember')
  const [error, setError] = useState('')

  const handleInviteClick = () => {
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

    // Validation
    if (!email.trim()) {
      setError('Email address is required')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    try {
      const success = await onInvite(email.trim(), selectedRole)
      if (success) {
        // Reset form and close modal
        setEmail('')
        setSelectedRole('TeamMember')
        setError('')
        onClose()
      } else {
        setError('Failed to send invitation. Please try again.')
      }
    } catch (err) {
      setError('An error occurred while sending the invitation')
      console.error('Invite member error:', err)
    }
  }

  const handleClose = () => {
    setEmail('')
    setSelectedRole('TeamMember')
    setError('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Invite Team Member"
      subtitle="Send an invitation to join your team"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div>
          <div className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-600 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Role Selection */}
        <div>
          <div className="block text-sm font-medium text-gray-300 mb-3">
            Select Role
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {roleOptions.map((role) => {
              const IconComponent = role.icon
              return (
                <label
                  key={role.value}
                  className={`relative flex items-start p-3 cursor-pointer rounded-lg border transition-all duration-200 ${
                    selectedRole === role.value
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={selectedRole === role.value}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 w-2 h-2 border-2 rounded-full mr-3 ${
                      selectedRole === role.value ? 'border-purple-500 bg-purple-500' : 'border-gray-400'
                    }`} />
                    <IconComponent className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-white">
                        {role.label}
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
            label="Send Invitation"
            onClick={handleInviteClick}
            loading={isLoading}
            disabled={isLoading || !email.trim()}
            icon={UserPlus}
            actionType="general"
          />
        </div>
      </form>
    </Modal>
  )
}
