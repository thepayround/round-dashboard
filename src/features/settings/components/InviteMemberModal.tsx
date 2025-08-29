import { useState } from 'react'
import { Modal } from '@/shared/components/Modal/Modal'
import { ActionButton } from '@/shared/components/ActionButton'
import { ApiDropdown, teamRoleDropdownConfig } from '@/shared/components/ui/ApiDropdown'
import { Mail, UserPlus } from 'lucide-react'
import type { UserRole } from '../types/team.types'

interface InviteMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onInvite: (email: string, role: UserRole) => Promise<boolean>
  isLoading?: boolean
}


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
          <div className="block text-sm font-medium text-gray-300 mb-2">
            Select Role
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
