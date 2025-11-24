import { AlertTriangle, Trash2, Info, CheckCircle, HelpCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Button } from '../ui/Button'
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
  /** Optional detailed list items to display */
  details?: string[]
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
  icon: _icon,
  details
}: ConfirmDialogProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: Trash2,
          buttonClass: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/30 font-medium'
        }
      case 'warning':
        return {
          icon: AlertTriangle,
          buttonClass: 'bg-yellow-600 text-white hover:bg-yellow-700 shadow-lg shadow-yellow-600/30 font-medium'
        }
      case 'info':
        return {
          icon: Info,
          buttonClass: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30 font-medium'
        }
      case 'success':
        return {
          icon: CheckCircle,
          buttonClass: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 font-medium'
        }
      case 'neutral':
        return {
          icon: HelpCircle,
          buttonClass: 'bg-white/20 text-white hover:bg-white/30 shadow-lg font-medium'
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
      centerInViewport
    >
      <div className="space-y-6">
        {/* Message */}
        <div className="space-y-4">
          <p className="text-white/70 text-[15px] leading-relaxed">
            {message}
          </p>

          {/* Details list if provided */}
          {details && details.length > 0 && (
            <ul className="space-y-2 ml-1">
              {details.map((detail, index) => (
                <li key={index} className="flex items-start gap-2 text-white/60 text-sm">
                  <span className="text-white/60 mt-0.5">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            onClick={onClose}
            variant="ghost"
            size="md"
            disabled={isLoading}
            className="text-white/70 hover:text-white hover:bg-white/5 font-medium px-6"
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            size="md"
            isLoading={isLoading}
            disabled={isLoading}
            className={`${styles.buttonClass} px-6`}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

