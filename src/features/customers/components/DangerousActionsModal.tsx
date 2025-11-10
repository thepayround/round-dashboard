import { Trash2, UserX, AlertTriangle } from 'lucide-react'
import React, { useState } from 'react'

import { Button } from '@/shared/components/Button'
import { Modal } from '@/shared/components/Modal/Modal'
import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { customerService, CustomerStatus } from '@/shared/services/api/customer.service'

interface DangerousActionsModalProps {
  isOpen: boolean
  onClose: () => void
  customerId: string
  customerName: string
  currentStatus: string
  onStatusChanged: (newStatus: string) => void
  onCustomerDeleted: () => void
}

export const DangerousActionsModal: React.FC<DangerousActionsModalProps> = ({
  isOpen,
  onClose,
  customerId,
  customerName,
  currentStatus,
  onStatusChanged,
  onCustomerDeleted
}) => {
  const { showSuccess, showError } = useGlobalToast()
  const [isDeactivating, setIsDeactivating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [actionType, setActionType] = useState<'deactivate' | 'delete' | null>(null)

  const handleDeactivate = async () => {
    setIsDeactivating(true)
    try {
      await customerService.updateStatus(customerId, {
        status: CustomerStatus.Inactive,
        reason: 'Account deactivated by administrator'
      })
      onStatusChanged('Inactive')
      showSuccess(`${customerName} has been deactivated`)
      onClose()
      resetForm()
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to deactivate customer')
    } finally {
      setIsDeactivating(false)
    }
  }

  const handleDelete = async () => {
    if (confirmText !== customerName) {
      showError('Please type the customer name exactly to confirm deletion')
      return
    }

    setIsDeleting(true)
    try {
      await customerService.delete(customerId)
      onCustomerDeleted()
      showSuccess(`${customerName} has been permanently deleted`)
      onClose()
      resetForm()
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to delete customer')
    } finally {
      setIsDeleting(false)
    }
  }

  const resetForm = () => {
    setConfirmText('')
    setActionType(null)
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Dangerous Actions"
      subtitle="Irreversible customer actions"
      icon={AlertTriangle}
      size="lg"
    >
      <div className="p-6 space-y-6">
            {!actionType ? (
              <div className="space-y-6">
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <h3 className="text-sm font-normal tracking-tight tracking-tight text-[#D417C8] mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Warning
                  </h3>
                  <p className="text-sm text-white/80">
                    These actions are permanent and cannot be undone. Please proceed with caution.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Deactivate Customer */}
                  {currentStatus === 'active' && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-200">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-2 bg-orange-500/20 rounded-lg border border-orange-500/30">
                          <UserX className="w-5 h-5 text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium tracking-tight text-white mb-2">Deactivate Customer</h3>
                          <p className="text-sm text-white/70">
                            Suspend the customer&apos;s account. They won&apos;t be able to access services but data is preserved.
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setActionType('deactivate')}
                        variant="secondary"
                        size="md"
                        icon={UserX}
                        iconPosition="left"
                        fullWidth
                        className="bg-orange-500/20 border-orange-500/30 text-orange-400 hover:bg-orange-500/30 hover:text-white"
                      >
                        Deactivate Account
                      </Button>
                    </div>
                  )}

                  {/* Delete Customer */}
                  <div className="bg-white/5 border border-red-500/20 rounded-xl p-5 hover:bg-red-500/5 transition-all duration-200">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-2 bg-red-500/20 rounded-lg border border-red-500/30">
                        <Trash2 className="w-5 h-5 text-[#D417C8]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium tracking-tight text-white mb-2">Delete Customer</h3>
                        <p className="text-sm text-white/70">
                          Permanently remove the customer and all associated data. This cannot be undone.
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setActionType('delete')}
                      variant="danger"
                      size="md"
                      icon={Trash2}
                      iconPosition="left"
                      fullWidth
                      className="bg-red-500/20 border-red-500/30 hover:bg-red-500/30"
                    >
                      Delete Permanently
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {actionType === 'deactivate' && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-medium tracking-tight text-white mb-2">Confirm Deactivation</h3>
                      <p className="text-white/70">This action will suspend the customer&apos;s account</p>
                    </div>
                    
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <UserX className="w-5 h-5 text-orange-400" />
                        <h4 className="font-medium text-orange-400 tracking-tight">Account Suspension</h4>
                      </div>
                      <p className="text-sm text-white/80 leading-relaxed">
                        You are about to deactivate <strong className="text-white">{customerName}</strong>. 
                        This will suspend their account access but preserve all data. The customer can be reactivated later.
                      </p>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        onClick={() => setActionType(null)}
                        disabled={isDeactivating}
                        variant="ghost"
                        size="md"
                        fullWidth
                        className="bg-white/10 border-white/20 hover:bg-white/20"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleDeactivate}
                        disabled={isDeactivating}
                        variant="secondary"
                        size="md"
                        icon={UserX}
                        iconPosition="left"
                        loading={isDeactivating}
                        fullWidth
                        className="bg-orange-500 hover:bg-orange-600 border-orange-500"
                      >
                        {isDeactivating ? 'Deactivating...' : 'Confirm Deactivation'}
                      </Button>
                    </div>
                  </div>
                )}

                {actionType === 'delete' && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-medium tracking-tight text-white mb-2">Confirm Deletion</h3>
                      <p className="text-white/70">This action cannot be undone</p>
                    </div>
                    
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <Trash2 className="w-5 h-5 text-[#D417C8]" />
                        <h4 className="font-medium text-[#D417C8] tracking-tight">Permanent Deletion</h4>
                      </div>
                      <p className="text-sm text-white/80 leading-relaxed mb-4">
                        You are about to <strong className="text-[#D417C8]">permanently delete</strong> {customerName} 
                        and all associated data. This action cannot be undone.
                      </p>
                      <p className="text-sm text-white/60">
                        To confirm, please type the customer&apos;s name exactly: <strong className="text-white">{customerName}</strong>
                      </p>
                    </div>
                    
                    <div>
                      <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder={`Type "${customerName}" to confirm`}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all auth-input"
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        onClick={() => setActionType(null)}
                        disabled={isDeleting}
                        variant="ghost"
                        size="md"
                        fullWidth
                        className="bg-white/10 border-white/20 hover:bg-white/20"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleDelete}
                        disabled={confirmText !== customerName || isDeleting}
                        variant="danger"
                        size="md"
                        icon={Trash2}
                        iconPosition="left"
                        loading={isDeleting}
                        fullWidth
                        className="bg-red-500 hover:bg-red-600 border-red-500 disabled:bg-gray-700 disabled:text-gray-500"
                      >
                        {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
      </div>
    </Modal>
  )
}