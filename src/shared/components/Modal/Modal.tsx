import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { useResponsive } from '@/shared/hooks/useResponsive'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl'
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  size = 'lg',
  children,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true
}: ModalProps) => {
  const { isMobile, isTablet } = useResponsive()

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose, closeOnEscape])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Calculate positioning based on sidebar state
  const getModalPositioning = () => {
    if (isMobile || isTablet) {
      return 'fixed inset-0'
    }
    // On desktop, account for sidebar (80px collapsed, 280px expanded)
    // We'll use CSS custom properties that the layout can set
    return 'fixed inset-0 lg:left-[var(--sidebar-width,280px)]'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - covers entire viewport */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnOverlayClick ? onClose : undefined}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />

          {/* Modal Container - positioned relative to main content */}
          <div className={`${getModalPositioning()} z-50 flex items-center justify-center p-4`}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0.1 }}
              className={`relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glassmorphism Modal */}
              <div className="relative bg-white/[0.08] backdrop-blur-2xl border border-white/20 rounded-lg shadow-2xl">
                {/* Subtle gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-white/[0.04] rounded-lg pointer-events-none" />

                {/* Content container */}
                <div className="relative">
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/20 bg-white/[0.03]">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-medium text-white truncate">
                        {title}
                      </h2>
                      {subtitle && (
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {subtitle}
                        </p>
                      )}
                    </div>

                    {showCloseButton && (
                      <button
                        onClick={onClose}
                        className="ml-4 p-2 rounded-lg bg-white/[0.08] border border-white/20 text-gray-300 hover:text-white hover:bg-white/[0.15] hover:border-white/30 transition-all duration-200 backdrop-blur-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                  {children}
                </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}