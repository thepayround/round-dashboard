import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react'
import { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  isVisible: boolean
  type: ToastType
  message: string
  details?: Record<string, string>
  onClose: () => void
  autoClose?: boolean
  duration?: number
}

const toastStyles = {
  success: {
    background: 'bg-green-500/10',
    border: 'border-green-500/20',
    icon: CheckCircle,
    iconColor: 'text-green-400',
    textColor: 'text-white'
  },
  error: {
    background: 'bg-red-500/10',
    border: 'border-red-500/20',
    icon: AlertTriangle,
    iconColor: 'text-red-400',
    textColor: 'text-white'
  },
  warning: {
    background: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    icon: AlertCircle,
    iconColor: 'text-yellow-400',
    textColor: 'text-white'
  },
  info: {
    background: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon: Info,
    iconColor: 'text-blue-400',
    textColor: 'text-white'
  }
}

export const Toast = ({
  isVisible,
  type,
  message,
  details,
  onClose,
  autoClose = true,
  duration = 5000,
}: ToastProps) => {
  const styles = toastStyles[type]
  const IconComponent = styles.icon

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
          <div className={`${styles.background} backdrop-blur-xl border ${styles.border} rounded-lg p-4 shadow-2xl`}>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <IconComponent className={`w-6 h-6 ${styles.iconColor}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`${styles.textColor} font-normal tracking-tight text-sm`}>{message}</p>
                
                {details && Object.keys(details).length > 0 && (
                  <div className="mt-2 space-y-1">
                    {Object.entries(details).map(([field, error]) => (
                      <p key={field} className={`${styles.iconColor} text-xs`}>
                        <span className="font-medium capitalize">{field}:</span> {error}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              
              <button
                onClick={onClose}
                className={`flex-shrink-0 w-6 h-6 rounded-full ${styles.background} hover:opacity-80 transition-opacity duration-200 flex items-center justify-center`}
              >
                <X className={`w-4 h-4 ${styles.iconColor}`} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}