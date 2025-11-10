import { AlertTriangle, Trash2, Info, CheckCircle, HelpCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { ActionButton } from '../ui/ActionButton'
import { Modal } from '../ui/Modal'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info' | 'success' | 'neutral'
  isLoading?: boolean
  /** Optional custom icon to override the default variant icon */
  icon?: LucideIcon
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
  isLoading = false,
  icon
}: ConfirmDialogProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: Trash2,
          iconColor: 'text-white/90', // Polar.sh style - clean white icons
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20',
          buttonVariant: 'primary' as const
        }
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-white/90',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20',
          buttonVariant: 'primary' as const
        }
      case 'info':
        return {
          icon: Info,
          iconColor: 'text-white/90',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20',
          buttonVariant: 'primary' as const
        }
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: 'text-white/90',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20',
          buttonVariant: 'success' as const
        }
      case 'neutral':
        return {
          icon: HelpCircle,
          iconColor: 'text-white/90',
          bgColor: 'bg-white/5',
          borderColor: 'border-white/10',
          buttonVariant: 'primary' as const
        }
    }
  }

  const styles = getVariantStyles()
  // Use custom icon if provided, otherwise use variant's default icon
  const Icon = icon ?? styles.icon

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
            <Icon className={`w-6 h-6 ${styles.iconColor}`} />
          </div>
          <div className="flex-1">
            <p className="text-white/70 leading-relaxed font-normal tracking-tight">
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
