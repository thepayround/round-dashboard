import { Mail, UserPlus } from 'lucide-react'
import { useState } from 'react'

import type { UserRole } from '../types/team.types'

import { ActionButton } from '@/shared/components/ActionButton'
import { Modal } from '@/shared/components/Modal/Modal'
import { ApiDropdown, teamRoleDropdownConfig } from '@/shared/components/ui/ApiDropdown'
import { useGlobalToast } from '@/shared/contexts/ToastContext'


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
  const { showError, showSuccess } = useGlobalToast()


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
        // Reset form and close modal on success
        setEmail('')
        setSelectedRole('TeamMember')
        setError('')
        showSuccess('Invitation sent successfully!')
        onClose()
      } else {
        // Show error toast and keep modal open
        setError('')
        showError('Failed to send invitation. This email may already have a pending invitation.')
        // Modal stays open for user to try again
      }
    } catch (err: unknown) {
      setError('')
      showError('An unexpected error occurred. Please try again.')
      // Modal stays open for user to try again
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
      icon={UserPlus}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Email Input */}
        <div>
          <label htmlFor="invite-email" className="modal-label">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center pointer-events-none">
              <Mail className="w-4 h-4 text-white/60" />
            </div>
            <input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="modal-input pl-10"
              required
            />
          </div>
        </div>

        {/* Role Selection */}
        <div>
          <label htmlFor="invite-role" className="modal-label">
            Select Role
          </label>
          <div id="invite-role">
            <ApiDropdown
              config={teamRoleDropdownConfig}
              value={selectedRole}
              onSelect={(value) => setSelectedRole(value as UserRole)}
              className="w-full"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-[#D417C8] text-sm">
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
