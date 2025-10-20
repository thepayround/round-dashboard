import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'

interface ErrorToastProps {
  isVisible: boolean
  message: string
  details?: Record<string, string>
  onClose: () => void
  autoClose?: boolean
  duration?: number
}

export const ErrorToast = ({
  isVisible,
  message,
  details,
  onClose,
  autoClose = true,
  duration = 5000,
}: ErrorToastProps) => {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, autoClose, duration, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-4 right-4 z-toast max-w-md"
        >
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 shadow-2xl">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm">{message}</p>
                
                {details && Object.keys(details).length > 0 && (
                  <div className="mt-2 space-y-1">
                    {Object.entries(details).map(([field, error]) => (
                      <p key={field} className="text-red-300 text-xs">
                        <span className="font-medium capitalize">{field}:</span> {error}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              
              <button
                onClick={onClose}
                className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors duration-200 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}