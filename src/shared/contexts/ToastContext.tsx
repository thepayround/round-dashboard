import type { ReactNode } from 'react';
import { createContext, useCallback, useContext } from 'react'

import type { ToastType } from '../ui/Toast'

import { toast } from '@/shared/hooks/use-toast'

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
  const showToast = useCallback((type: ToastType, message: string, details?: Record<string, string>) => {
    toast({
      variant: type,
      title: message,
      description: details ? (
        <div className="mt-2 space-y-1">
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className="text-sm">
              <span className="font-medium">{key}:</span> {value}
            </div>
          ))}
        </div>
      ) : undefined,
    })
  }, [])

  const showSuccess = useCallback((message: string, details?: Record<string, string>) => {
    showToast('success', message, details)
  }, [showToast])

  const showError = useCallback((message: string, details?: Record<string, string>) => {
    showToast('error', message, details)
  }, [showToast])

  const showWarning = useCallback((message: string, details?: Record<string, string>) => {
    showToast('warning', message, details)
  }, [showToast])

  const showInfo = useCallback((message: string, details?: Record<string, string>) => {
    showToast('info', message, details)
  }, [showToast])

  const hideToast = useCallback(() => {
    // Shadcn toast auto-dismisses, but we can provide a no-op for API compatibility
  }, [])

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
