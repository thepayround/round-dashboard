import type { ReactNode } from 'react';
import { createContext, useContext, useCallback } from 'react'
import type { ToastType } from '../components/Toast';
import { Toast } from '../components/Toast'
import { useToast } from '../hooks/useToast'

interface ToastContextValue {
  showToast: (type: ToastType, message: string, details?: Record<string, string>) => void
  showSuccess: (message: string, details?: Record<string, string>) => void
  showError: (message: string, details?: Record<string, string>) => void
  showWarning: (message: string, details?: Record<string, string>) => void
  showInfo: (message: string, details?: Record<string, string>) => void
  hideToast: () => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

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
export const useGlobalToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useGlobalToast must be used within a ToastProvider')
  }
  return context
}