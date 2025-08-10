import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  children: React.ReactNode
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

const sizeClasses = {
  sm: 'max-w-[90vw] xs:max-w-sm sm:max-w-md',
  md: 'max-w-[90vw] xs:max-w-md sm:max-w-lg md:max-w-xl',
  lg: 'max-w-[90vw] xs:max-w-lg sm:max-w-xl md:max-w-2xl',
  xl: 'max-w-[95vw] xs:max-w-xl sm:max-w-2xl md:max-w-4xl',
  full: 'max-w-[95vw] xs:max-w-6xl sm:max-w-7xl'
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
  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 xs:p-4">
          {/* Enhanced Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnOverlayClick ? onClose : undefined}
            className="absolute inset-0 bg-black/80 backdrop-blur-lg"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className={`relative w-full ${sizeClasses[size]} max-h-[95vh] xs:max-h-[92vh] sm:max-h-[90vh] overflow-hidden mx-4 xs:mx-0`}
          >
            {/* Glassmorphism Modal */}
            <div className="relative bg-gray-900/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
              {/* Gradient Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#D417C8]/30 via-[#14BDEA]/20 to-[#7767DA]/30 rounded-2xl blur opacity-75" />
              
              {/* Main Content Container */}
              <div className="relative bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl">
                {/* Enhanced Header */}
                <div className="relative px-4 xs:px-6 sm:px-8 py-4 xs:py-5 sm:py-6 border-b border-white/10">
                  {/* Header Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#D417C8]/5 via-transparent to-[#7767DA]/5" />
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="h-1 w-8 xs:w-10 sm:w-12 bg-gradient-to-r from-[#D417C8] to-[#7767DA] rounded-full" />
                      </div>
                      <h2 className="text-lg xs:text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent truncate">
                        {title}
                      </h2>
                      {subtitle && (
                        <p className="text-gray-400 mt-1 xs:mt-2 font-medium text-sm xs:text-base line-clamp-2">
                          {subtitle}
                        </p>
                      )}
                    </div>

                    {showCloseButton && (
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white/10 border border-white/20 text-gray-400 hover:text-white hover:bg-white/20 hover:border-white/30 transition-all duration-200 ml-3 flex-shrink-0 touch-target"
                      >
                        <X className="w-4 h-4 xs:w-5 xs:h-5" />
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-4 xs:p-6 sm:p-8 max-h-[calc(95vh-120px)] xs:max-h-[calc(92vh-140px)] sm:max-h-[calc(90vh-140px)] overflow-y-auto overscroll-contain">
                  {children}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
