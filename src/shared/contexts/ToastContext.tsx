import type { ReactNode } from 'react';
import { createContext, useContext } from 'react'

import { useToast } from '../hooks/useToast'
import type { ToastType } from '../ui/Toast'
import { Toast } from '../ui/Toast'

interface ToastContextValue {
  showToast: (type: ToastType, message: string, details?: Record<string, string>) => void
  showSuccess: (message: string, details?: Record<string, string>) => void
  showError: (message: string, details?: Record<string, string>) => void
  showWarning: (message: string, details?: Record<string, string>) => void
  showInfo: (message: string, details?: Record<string, string>) => void
  hideToast: () => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

const noop = () => undefined
const fallbackContext: ToastContextValue = {
  showToast: noop,
  showSuccess: noop,
  showError: noop,
  showWarning: noop,
  showInfo: noop,
  hideToast: noop,
}

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const {
    toast,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideToast,
  } = useToast()

  const value: ToastContextValue = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideToast,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Global Toast Component - positioned at top-right corner */}
      <Toast
        isVisible={toast.isVisible}
        type={toast.type}
        message={toast.message}
        details={toast.details}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  )
}

// Custom hook to use the toast context
// eslint-disable-next-line react-refresh/only-export-components
export const useGlobalToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    if (import.meta?.env?.DEV) {
      console.warn('useGlobalToast called outside of ToastProvider. Falling back to no-op handlers.')
    }
    return fallbackContext
  }
  return context
}
