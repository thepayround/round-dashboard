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
          className="fixed top-4 right-4 z-toast max-w-sm md:max-w-md lg:max-w-sm"
        >
          <div className={`${styles.background} backdrop-blur-xl border ${styles.border} rounded-lg md:rounded-lg lg:rounded-lg p-3 md:p-4 lg:p-3 shadow-2xl`}>
            <div className="flex items-start space-x-2.5 md:space-x-3 lg:space-x-2.5">
              <div className="flex-shrink-0">
                <IconComponent className={`w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 ${styles.iconColor}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`${styles.textColor} font-medium text-xs md:text-sm lg:text-xs`}>{message}</p>
                
                {details && Object.keys(details).length > 0 && (
                  <div className="mt-1.5 md:mt-2 lg:mt-1.5 space-y-0.5 md:space-y-1 lg:space-y-0.5">
                    {Object.entries(details).map(([field, error]) => (
                      <p key={field} className={`${styles.iconColor} text-xs md:text-xs lg:text-xs`}>
                        <span className="font-medium capitalize">{field}:</span> {error}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              
              <button
                onClick={onClose}
                className={`flex-shrink-0 w-5 h-5 md:w-6 md:h-6 lg:w-5 lg:h-5 rounded-full ${styles.background} hover:opacity-80 transition-opacity duration-200 flex items-center justify-center`}
              >
                <X className={`w-3 h-3 md:w-4 md:h-4 lg:w-3 lg:h-3 ${styles.iconColor}`} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}