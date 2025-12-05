import { AlertTriangle, Trash2, Info, CheckCircle, HelpCircle, Loader2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Button } from '../ui/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '../ui/shadcn/dialog'

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
          buttonClass: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/30 font-medium'
        }
      case 'warning':
        return {
          icon: AlertTriangle,
          buttonClass: 'bg-warning text-warning-foreground hover:bg-warning/90 shadow-lg shadow-warning/30 font-medium'
        }
      case 'info':
        return {
          icon: Info,
          buttonClass: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30 font-medium'
        }
      case 'success':
        return {
          icon: CheckCircle,
          buttonClass: 'bg-success text-success-foreground hover:bg-success/90 shadow-lg shadow-success/30 font-medium'
        }
      case 'neutral':
        return {
          icon: HelpCircle,
          buttonClass: 'bg-muted text-muted-foreground hover:bg-muted/80 shadow-lg font-medium'
        }
    }
  }

  const styles = getVariantStyles()
  const Icon = _icon || styles.icon

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription asChild>
            <div className="space-y-4 pt-2">
              <p className="text-muted-foreground text-[15px] leading-relaxed">
                {message}
              </p>

              {/* Details list if provided */}
              {details && details.length > 0 && (
                <ul className="space-y-2 ml-1">
                  {details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground/80 text-sm">
                      <span className="text-muted-foreground/80 mt-0.5">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={onClose}
            variant="ghost"
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground hover:bg-muted font-medium px-6"
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`${styles.buttonClass} px-6`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {confirmLabel}
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

