import { Modal } from './Modal/Modal'
import { ActionButton } from './ActionButton/ActionButton'
import { AlertTriangle, Trash2 } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false
}: ConfirmDialogProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconColor: 'text-red-400',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20',
          buttonVariant: 'primary' as const
        }
      case 'warning':
        return {
          iconColor: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20',
          buttonVariant: 'primary' as const
        }
      case 'info':
        return {
          iconColor: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20',
          buttonVariant: 'primary' as const
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
    >
      <div className="space-y-6">
        {/* Icon and Message */}
        <div className="flex items-start space-x-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-full ${styles.bgColor} ${styles.borderColor} border flex items-center justify-center`}>
            {variant === 'danger' ? (
              <Trash2 className={`w-6 h-6 ${styles.iconColor}`} />
            ) : (
              <AlertTriangle className={`w-6 h-6 ${styles.iconColor}`} />
            )}
          </div>
          <div className="flex-1">
            <p className="text-gray-300 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <ActionButton
            label={cancelLabel}
            onClick={onClose}
            variant="secondary"
            disabled={isLoading}
            actionType="general"
          />
          <ActionButton
            label={confirmLabel}
            onClick={onConfirm}
            variant={styles.buttonVariant}
            loading={isLoading}
            disabled={isLoading}
            actionType="general"
          />
        </div>
      </div>
    </Modal>
  )
}
