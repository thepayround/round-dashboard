import { useCallback, useState } from 'react'

import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { customerService, CustomerStatus } from '@/shared/services/api/customer.service'

interface UseDangerousActionsModalControllerParams {
  customerId: string
  customerName: string
  currentStatus: string
  onStatusChanged: (newStatus: string) => void
  onCustomerDeleted: () => void
  onClose: () => void
}

interface UseDangerousActionsModalControllerReturn {
  isDeactivating: boolean
  isDeleting: boolean
  confirmText: string
  actionType: 'deactivate' | 'delete' | null
  canDelete: boolean
  startDeactivate: () => void
  startDelete: () => void
  handleConfirmTextChange: (value: string) => void
  handleDeactivate: () => Promise<void>
  handleDelete: () => Promise<void>
  handleClose: () => void
  reset: () => void
  currentStatus: string
}

export const useDangerousActionsModalController = ({
  customerId,
  customerName,
  currentStatus,
  onStatusChanged,
  onCustomerDeleted,
  onClose,
}: UseDangerousActionsModalControllerParams): UseDangerousActionsModalControllerReturn => {
  const { showSuccess, showError } = useGlobalToast()
  const [isDeactivating, setIsDeactivating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [actionType, setActionType] = useState<'deactivate' | 'delete' | null>(null)

  const reset = useCallback(() => {
    setConfirmText('')
    setActionType(null)
  }, [])

  const handleClose = useCallback(() => {
    reset()
    onClose()
  }, [onClose, reset])

  const handleDeactivate = useCallback(async () => {
    setIsDeactivating(true)
    try {
      await customerService.updateStatus(customerId, {
        status: CustomerStatus.Inactive,
        reason: 'Account deactivated by administrator',
      })
      onStatusChanged('Inactive')
      showSuccess(`${customerName} has been deactivated`)
      handleClose()
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to deactivate customer')
    } finally {
      setIsDeactivating(false)
    }
  }, [customerId, customerName, handleClose, onStatusChanged, showError, showSuccess])

  const handleDelete = useCallback(async () => {
    if (confirmText !== customerName) {
      showError('Please type the customer name exactly to confirm deletion')
      return
    }

    setIsDeleting(true)
    try {
      await customerService.delete(customerId)
      onCustomerDeleted()
      showSuccess(`${customerName} has been permanently deleted`)
      handleClose()
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to delete customer')
    } finally {
      setIsDeleting(false)
    }
  }, [confirmText, customerId, customerName, handleClose, onCustomerDeleted, showError, showSuccess])

  return {
    isDeactivating,
    isDeleting,
    confirmText,
    actionType,
    canDelete: confirmText === customerName,
    startDeactivate: () => setActionType('deactivate'),
    startDelete: () => setActionType('delete'),
    handleConfirmTextChange: setConfirmText,
    handleDeactivate,
    handleDelete,
    handleClose,
    reset,
    currentStatus,
  }
}
