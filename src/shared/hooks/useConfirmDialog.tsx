/**
 * useConfirmDialog Hook
 * 
 * Simplifies ConfirmDialog usage with built-in state management.
 * Follows industry best practices from Vercel, Linear, GitHub.
 * 
 * @example
 * ```tsx
 * const confirmDelete = useConfirmDialog()
 * 
 * const handleDelete = (item) => {
 *   confirmDelete.show({
 *     title: 'Delete Item',
 *     message: `Delete ${item.name}?`,
 *     onConfirm: async () => {
 *       await deleteItem(item.id)
 *     }
 *   })
 * }
 * 
 * return (
 *   <>
 *     <button onClick={() => handleDelete(item)}>Delete</button>
 *     <confirmDelete.Dialog />
 *   </>
 * )
 * ```
 */

import { useState, useCallback } from 'react'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import type { LucideIcon } from 'lucide-react'

interface ConfirmDialogConfig {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info' | 'success' | 'neutral'
  icon?: LucideIcon
  onConfirm: () => void | Promise<void>
}

export const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [config, setConfig] = useState<ConfirmDialogConfig | null>(null)

  const show = useCallback((dialogConfig: ConfirmDialogConfig) => {
    setConfig(dialogConfig)
    setIsOpen(true)
  }, [])

  const hide = useCallback(() => {
    setIsOpen(false)
    setIsLoading(false)
    // Clear config after animation completes
    setTimeout(() => setConfig(null), 300)
  }, [])

  const handleConfirm = useCallback(async () => {
    if (!config) return

    setIsLoading(true)
    try {
      await config.onConfirm()
      hide()
    } catch (error) {
      // Error should be handled by the onConfirm callback
      setIsLoading(false)
    }
  }, [config, hide])

  const Dialog = useCallback(() => {
    if (!config) return null

    return (
      <ConfirmDialog
        isOpen={isOpen}
        onClose={hide}
        onConfirm={handleConfirm}
        title={config.title}
        message={config.message}
        confirmLabel={config.confirmLabel}
        cancelLabel={config.cancelLabel}
        variant={config.variant}
        icon={config.icon}
        isLoading={isLoading}
      />
    )
  }, [config, isOpen, isLoading, hide, handleConfirm])

  return {
    show,
    hide,
    Dialog,
    isOpen,
    isLoading
  }
}
