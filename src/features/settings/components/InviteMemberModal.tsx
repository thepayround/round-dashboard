import { Mail, UserPlus } from 'lucide-react'

import { useInviteMemberModalController } from '../hooks/useInviteMemberModalController'
import type { UserRole } from '../types/team.types'

import { ActionButton } from '@/shared/ui/ActionButton'
import { ApiDropdown, teamRoleDropdownConfig } from '@/shared/ui/ApiDropdown'
import { Input } from '@/shared/ui/Input'
import { Modal } from '@/shared/ui/Modal/Modal'


interface InviteMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onInvite: (email: string, role: UserRole) => Promise<boolean>
  isLoading?: boolean
}

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
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Invite Team Member"
      subtitle="Send an invitation to join your team"
      icon={UserPlus}
      size="lg"
    >
      <form
        onSubmit={event => {
          event.preventDefault()
          handleSubmit()
        }}
        className="p-6 space-y-6"
      >
        <Input
          id="invite-email"
          label="Email Address"
          leftIcon={Mail}
          type="email"
          value={email}
          onChange={event => handleEmailChange(event.target.value)}
          placeholder="colleague@company.com"
          containerClassName="modal-label"
          required
        />

        <div>
          <label htmlFor="invite-role" className="modal-label">
            Select Role
          </label>
          <div id="invite-role">
            <ApiDropdown
              config={teamRoleDropdownConfig}
              value={selectedRole}
              onSelect={value => handleRoleChange(value as UserRole)}
              className="w-full"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-primary text-sm">
            {error}
          </div>
        )}

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
            onClick={handleSubmit}
            loading={isLoading}
            disabled={isLoading || isSubmitDisabled}
            icon={UserPlus}
            actionType="general"
          />
        </div>
      </form>
    </Modal>
  )
}
