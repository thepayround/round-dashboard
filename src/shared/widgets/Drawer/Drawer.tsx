import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import { Button } from '@/shared/ui/shadcn/button'
import { cn } from '@/shared/utils/cn'

export interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  isLoading?: boolean
  className?: string
}

/**
 * Slide-out drawer component
 * Opens from the right side of the screen
 * Full-width on mobile, 400px on desktop (default)
 * Can be used for filters, forms, settings, or any slide-out content
 */
export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
  title = 'Panel',
  isLoading = false,
  className
}) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Lock body scroll when panel is open - MOBILE ONLY
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      // Save current scroll position
      const { scrollY } = window
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'

      return () => {
        // Restore scroll position
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  // Focus management - Move focus into panel when opened
  useEffect(() => {
    if (isOpen && panelRef.current) {
      // Find first focusable element (input, button, select, etc.)
      const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
        'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
      )

      // Focus first input/select if available, otherwise focus close button
      const firstInput = Array.from(focusableElements).find(
        el => el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA'
      )

      if (firstInput) {
        firstInput.focus()
      } else if (closeButtonRef.current) {
        closeButtonRef.current.focus()
      }
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Focus trap - Keep Tab navigation within panel
  useEffect(() => {
    if (!isOpen || !panelRef.current) return

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusableElements = panelRef.current!.querySelectorAll<HTMLElement>(
        'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
      )
      const [firstElement] = focusableElements
      const lastElement = focusableElements[focusableElements.length - 1]

      // If Shift+Tab on first element, go to last
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      }
      // If Tab on last element, go to first
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }

    document.addEventListener('keydown', handleTabKey)
    return () => document.removeEventListener('keydown', handleTabKey)
  }, [isOpen])

  // Respect prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const panelTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : { type: 'spring' as const, damping: 25, stiffness: 200 }

  const backdropTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: 0.2 }

  const panelContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Visible on mobile, transparent on desktop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[60]"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            ref={panelRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={panelTransition}
            className={cn(
              "fixed inset-y-0 right-0 w-full md:w-[400px] lg:w-[450px]",
              "bg-card",
              "border-l border-border",
              "z-[70]",
              "flex flex-col",
              className
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
          >
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
              <h2
                id="drawer-title"
                className="text-xl font-medium tracking-tight text-foreground"
              >
                {title}
              </h2>
              <Button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                variant="ghost"
                size="icon"
                aria-label={`Close ${title.toLowerCase()}`}
                className="hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className={cn(
              "flex-1 p-6 overflow-y-auto",
              // Custom scrollbar styling
              "[&::-webkit-scrollbar]:w-2",
              "[&::-webkit-scrollbar-track]:bg-transparent",
              "[&::-webkit-scrollbar-thumb]:bg-muted-foreground/20",
              "[&::-webkit-scrollbar-thumb]:rounded-full",
              "[&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/40"
            )}>
              {isLoading ? (
                // Loading skeleton
                <div className="space-y-6 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i}>
                      <div className="h-4 bg-muted rounded w-24 mb-2" />
                      <div className="h-10 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {children}
                </div>
              )}
            </div>

            {/* Screen reader live region for announcements */}
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
            >
              {isOpen && `${title} opened`}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  // Render panel in a portal at document.body level to avoid z-index and positioning issues
  return typeof document !== 'undefined'
    ? createPortal(panelContent, document.body)
    : null
}
