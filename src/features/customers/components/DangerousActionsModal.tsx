import { Trash2, UserX, AlertTriangle } from 'lucide-react'

import { useDangerousActionsModalController } from '../hooks/useDangerousActionsModalController'

import { Alert } from '@/shared/ui'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Modal } from '@/shared/ui/Modal/Modal'


interface DangerousActionsModalProps {
  isOpen: boolean
  onClose: () => void
  customerId: string
  customerName: string
  currentStatus: string
  onStatusChanged: (newStatus: string) => void
  onCustomerDeleted: () => void
}

export const DangerousActionsModal = ({
  isOpen,
  onClose,
  customerId,
  customerName,
  currentStatus,
  onStatusChanged,
  onCustomerDeleted,
}: DangerousActionsModalProps) => {
  const {
    isDeactivating,
    isDeleting,
    confirmText,
    actionType,
    canDelete,
    startDeactivate,
    startDelete,
    handleConfirmTextChange,
    handleDeactivate,
    handleDelete,
    handleClose,
    reset,
  } = useDangerousActionsModalController({
    customerId,
    customerName,
    currentStatus,
    onStatusChanged,
    onCustomerDeleted,
    onClose,
  })

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
            <Alert
              variant="danger"
              title="Warning"
              description="These actions are permanent and cannot be undone. Please proceed with caution."
            />

            <div className="space-y-4">
              {currentStatus === 'active' && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-200">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-orange-500/20 rounded-lg border border-orange-500/30">
                      <UserX className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium tracking-tight text-white mb-2">Deactivate Customer</h3>
                      <p className="text-sm text-white/70">
                        Suspend the account. They won&apos;t access services but data is preserved.
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={startDeactivate}
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

              <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-2 bg-red-500/20 rounded-lg border border-red-500/30">
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium tracking-tight text-white mb-2">Delete Customer</h3>
                    <p className="text-sm text-white/70">
                      Permanently remove all data associated with {customerName}.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={startDelete}
                  variant="danger"
                  size="md"
                  icon={Trash2}
                  iconPosition="left"
                  fullWidth
                >
                  Delete Customer
                </Button>
              </div>
            </div>
          </div>
        ) : actionType === 'deactivate' ? (
          <div className="space-y-6">
            <Alert
              variant="warning"
              title="Confirm Deactivation"
              description={`${customerName} will be unable to access services until reactivated.`}
              icon={UserX}
            />

            <div className="flex items-center space-x-3">
              <Button onClick={reset} variant="ghost">
                Cancel
              </Button>
              <Button
                onClick={handleDeactivate}
                variant="secondary"
                loading={isDeactivating}
                disabled={isDeactivating}
                icon={UserX}
                iconPosition="left"
                className="bg-orange-500/20 border-orange-500/30 text-orange-400 hover:bg-orange-500/30 hover:text-white"
              >
                Confirm Deactivation
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Alert
              variant="error"
              title="Confirm Deletion"
              description={`Type ${customerName} to confirm permanent deletion.`}
              icon={Trash2}
            />

            <Input
              type="text"
              value={confirmText}
              onChange={event => handleConfirmTextChange(event.target.value)}
              placeholder={customerName}
              className="w-full bg-[#0B0D12] border border-white/10 rounded-lg text-white text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/40"
            />

            <div className="flex items-center space-x-3">
              <Button onClick={reset} variant="ghost">
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                variant="danger"
                loading={isDeleting}
                disabled={isDeleting || !canDelete}
                icon={Trash2}
                iconPosition="left"
              >
                Permanently Delete
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
