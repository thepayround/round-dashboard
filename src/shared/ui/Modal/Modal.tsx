import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useResponsive } from '@/shared/hooks/useResponsive'
import { IconButton, PlainButton } from '@/shared/ui/Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showHeader?: boolean
  className?: string
  icon?: React.ComponentType<{ className?: string }>
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
  children,
  size = 'md',
  showHeader = true,
  className = '',
  icon: Icon
}: ModalProps) => {
  const { isMobile, isTablet } = useResponsive()

  // Track sidebar state reactively
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem('sidebar-collapsed') === 'true')

  // Listen for sidebar state changes
  useEffect(() => {
    const handleStorageChange = () => {
      setSidebarCollapsed(localStorage.getItem('sidebar-collapsed') === 'true')
    }

    // Listen for localStorage changes (cross-tab)
    window.addEventListener('storage', handleStorageChange)

    // Listen for custom sidebar toggle events (same tab)
    window.addEventListener('sidebar-toggle', handleStorageChange)

    // Poll for changes as fallback (in case events don't fire)
    const interval = setInterval(handleStorageChange, 100)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('sidebar-toggle', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // Calculate modal positioning to center between sidebar and right edge
  const getModalPositioning = () => {
    if (isMobile || isTablet) {
      return { left: 0, width: '100vw' }
    }

    const sidebarWidth = sidebarCollapsed ? 80 : 280
    const availableWidth = `calc(100vw - ${sidebarWidth}px)`

    return {
      left: sidebarWidth,
      width: availableWidth
    }
  }

  // Handle escape key and body scroll lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      style={{
        left: getModalPositioning().left,
        width: getModalPositioning().width
      }}
      role="dialog"
      aria-modal="true"
    >
      <PlainButton
        className="fixed inset-0 w-full h-full bg-transparent border-none cursor-default"
        onClick={onClose}
        aria-label="Close modal"
        tabIndex={-1}
        unstyled
      />
          <div
            role="document"
            className={`
              relative w-full ${sizeClasses[size]} max-h-[90vh] mx-auto
              bg-[#101011] border border-[#333333]
              rounded-lg shadow-2xl overflow-hidden
              ${className}
            `}
          >
              {/* Header */}
              {showHeader && (
                <div className="flex items-center justify-between p-6 border-b border-[#333333]">
                  <div className="flex items-center space-x-3">
                    {Icon && (
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div>
                      {title && (
                        <h2 className="text-xl font-medium tracking-tight text-white">
                          {title}
                        </h2>
                      )}
                      {subtitle && (
                        <p className="text-sm text-white/70">
                          {subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <IconButton
                    onClick={onClose}
                    icon={X}
                    variant="ghost"
                    size="sm"
                    aria-label="Close modal"
                    className="ml-3 flex-shrink-0 border border-white/10 hover:border-white/20"
                  />
                </div>
              )}

              {/* Content */}
              <div className="max-h-[calc(90vh-88px)]">
                {children}
              </div>
            </div>
    </div>
  )
}

