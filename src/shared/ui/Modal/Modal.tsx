import { X } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

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
  centerInViewport?: boolean
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
  icon: Icon,
  centerInViewport = false
}: ModalProps) => {
  const { isMobile, isTablet } = useResponsive()
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

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
    // If centerInViewport is true, always center in full viewport
    if (centerInViewport || isMobile || isTablet) {
      return { left: 0, width: '100vw' }
    }

    const sidebarWidth = sidebarCollapsed ? 80 : 280
    const availableWidth = `calc(100vw - ${sidebarWidth}px)`

    return {
      left: sidebarWidth,
      width: availableWidth
    }
  }

  // Handle escape key, body scroll lock, focus trap, and focus return
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (!isOpen || e.key !== 'Tab' || !modalRef.current) return

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      if (!firstElement) return

      // Shift+Tab on first element: focus last
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      }
      // Tab on last element: focus first
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }

    if (isOpen) {
      // Store currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement

      // Set up event listeners
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('keydown', handleTabKey)
      document.body.style.overflow = 'hidden'

      // Focus first focusable element in modal
      setTimeout(() => {
        const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        firstFocusable?.focus()
      }, 100)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleTabKey)
      document.body.style.overflow = 'unset'

      // Return focus to previous element when modal closes
      if (!isOpen && previousActiveElement.current) {
        previousActiveElement.current.focus()
        previousActiveElement.current = null
      }
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
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={subtitle ? "modal-description" : undefined}
    >
      <PlainButton
        className="fixed inset-0 w-full h-full bg-transparent border-none cursor-default"
        onClick={onClose}
        aria-label="Close modal"
        tabIndex={-1}
        unstyled
      />
      <div
        ref={modalRef}
        role="document"
        className={`
              relative w-full ${sizeClasses[size]} max-h-[90vh] mx-auto
              bg-[#1c1c1e] border border-white/10
              rounded-xl shadow-2xl overflow-hidden
              ${className}
            `}
      >
        {/* Header */}
        {showHeader && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              {Icon && (
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
              )}
              <div>
                {title && (
                  <h2 id="modal-title" className="text-lg font-medium tracking-tight text-white">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p id="modal-description" className="text-xs text-white/60">
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
              className="ml-3 flex-shrink-0 hover:bg-white/5 text-white/60 hover:text-white"
            />
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-6 max-h-[calc(90vh-88px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

