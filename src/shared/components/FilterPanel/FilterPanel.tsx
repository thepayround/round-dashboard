import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  isLoading?: boolean
}

/**
 * Slide-out filter panel component
 * Opens from the right side of the screen
 * Full-width on mobile, 400px on desktop
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  children,
  title = 'Filters',
  isLoading = false
}) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Lock body scroll when panel is open - MOBILE ONLY
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      // Save current scroll position
      const {scrollY} = window
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
            className="fixed inset-0 bg-black/60 md:bg-transparent z-[60]"
            aria-hidden="true"
          />

          {/* Filter Panel */}
          <motion.div
            ref={panelRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={panelTransition}
            className="fixed inset-y-0 right-0 w-full md:w-[400px] lg:w-[450px]
                     bg-[#171719]
                     border-l border-[#1e1f22]
                     shadow-2xl shadow-black/50
                     z-[70]
                     flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-panel-title"
          >
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-[#1e1f22] sticky top-0 bg-[#171719] z-10">
              <h2 
                id="filter-panel-title" 
                className="text-xl font-medium tracking-tight text-white"
              >
                {title}
              </h2>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 group"
                aria-label="Close filters"
              >
                <X className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {isLoading ? (
                // Loading skeleton
                <div className="space-y-5 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i}>
                      <div className="h-4 bg-white/10 rounded w-24 mb-2" />
                      <div className="h-10 bg-white/10 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-5">
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
              {isOpen && 'Filter panel opened'}
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
