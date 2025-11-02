import * as DialogPrimitive from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import React from 'react'

import { cn } from '@/shared/utils/cn'

export interface ModalProps {
  /** Whether modal is open */
  isOpen: boolean
  /** Callback when modal is closed */
  onClose: () => void
  /** Modal title */
  title?: string
  /** Modal description */
  description?: string
  /** Modal content */
  children: React.ReactNode
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /** Whether to show close button */
  showCloseButton?: boolean
  /** Whether clicking overlay closes modal */
  closeOnOverlayClick?: boolean
  /** Additional class for content */
  className?: string
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  full: 'max-w-[90vw]',
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className,
}) => {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {isOpen && (
          <DialogPrimitive.Portal forceMount>
            {/* Overlay */}
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                onClick={closeOnOverlayClick ? onClose : undefined}
              />
            </DialogPrimitive.Overlay>

            {/* Content */}
            <DialogPrimitive.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full',
                  sizeClasses[size],
                  'max-h-[90vh] overflow-hidden'
                )}
              >
                <div className={cn('bg-[#101011] border border-[#333333] rounded-lg shadow-2xl', className)}>
                  {/* Header */}
                  {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-6 border-b border-[#333333]">
                      {title && (
                        <div>
                          <DialogPrimitive.Title className="text-xl font-medium text-white">
                            {title}
                          </DialogPrimitive.Title>
                          {description && (
                            <DialogPrimitive.Description className="text-sm text-white/70 mt-1">
                              {description}
                            </DialogPrimitive.Description>
                          )}
                        </div>
                      )}
                      {showCloseButton && (
                        <DialogPrimitive.Close asChild>
                          <button
                            onClick={onClose}
                            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                            aria-label="Close"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </DialogPrimitive.Close>
                      )}
                    </div>
                  )}

                  {/* Body - Scrollable */}
                  <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                    {children}
                  </div>
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}

// Compound Components for structured content
export const ModalHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn('p-6 border-b border-[#333333]', className)}>
    {children}
  </div>
)

export const ModalBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn('p-6', className)}>
    {children}
  </div>
)

export const ModalFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn('flex items-center justify-end space-x-3 p-6 border-t border-[#333333]', className)}>
    {children}
  </div>
)

