import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { IconButton, PlainButton } from '@/shared/components/Button'
import { useResponsive } from '@/shared/hooks/useResponsive'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showHeader?: boolean
  className?: string
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
  className = ''
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
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
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
              bg-[#171719] border border-[#1e1f22]
              rounded-lg shadow-xl overflow-hidden
              ${className}
            `}
          >
              {/* Header */}
              {showHeader && (
                <div className="flex items-start justify-between p-4 border-b border-white/10">
                  <div className="flex-1 min-w-0">
                    {title && (
                      <h2 className="text-lg font-medium text-white truncate tracking-tight">
                        {title}
                      </h2>
                    )}
                    {subtitle && (
                      <p className="text-sm text-[#a3a3a3] mt-1 truncate">
                        {subtitle}
                      </p>
                    )}
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
              <div className={`
                overflow-y-auto max-h-[calc(90vh-${showHeader ? '80px' : '0px'})]
                ${showHeader ? 'p-6' : 'p-6'}
              `}>
                {children}
              </div>
            </div>
    </div>
  )
}
