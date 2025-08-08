import { useState, useCallback } from 'react'
import type { ToastType } from '../components/Toast'

interface ToastState {
  isVisible: boolean
  type: ToastType
  message: string
  details?: Record<string, string>
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    type: 'info',
    message: '',
    details: undefined
  })

  const showToast = useCallback((type: ToastType, message: string, details?: Record<string, string>) => {
    setToast({
      isVisible: true,
      type,
      message,
      details
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
    setToast(prev => ({
      ...prev,
      isVisible: false
    }))
  }, [])

  return {
    toast,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideToast
  }
}