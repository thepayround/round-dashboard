import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import type { NavItem } from '@/shared/layout/DashboardLayout/types'

/**
 * Options for the useKeyboardNavigation hook
 */
export interface UseKeyboardNavigationOptions {
  /** All navigation items (flat list) */
  getAllNavItems: (NavItem & { isSubItem?: boolean; parentId?: string })[]
  /** Whether sidebar is collapsed */
  isCollapsed: boolean
  /** Function to toggle sidebar */
  toggleSidebar: () => void
  /** Function to toggle expanded state of menu item */
  toggleExpanded: (itemId: string) => void
  /** Whether shortcuts modal is shown */
  showShortcuts: boolean
  /** Function to toggle shortcuts modal */
  setShowShortcuts: (value: boolean) => void
}

/**
 * Return type for the useKeyboardNavigation hook
 */
export interface UseKeyboardNavigationReturn {
  /** Currently focused item index */
  focusedIndex: number
  /** Whether keyboard navigation is active */
  isKeyboardNavigating: boolean
  /** Ref to attach to navigation container */
  navigationRef: React.RefObject<HTMLElement>
}

/**
 * Custom hook to handle keyboard navigation in the sidebar
 * 
 * Provides:
 * - Arrow key navigation (Up/Down)
 * - Enter key to activate items/toggle sub-menus
 * - Escape key to exit keyboard navigation
 * - Alt+Number quick navigation shortcuts (Alt+1, Alt+2, Alt+3)
 * - Ctrl+Shift+B to toggle sidebar
 * - Shift+? to show keyboard shortcuts
 * 
 * @param options - Configuration options
 * @returns Navigation state and refs
 * 
 * @example
 * ```tsx
 * const { focusedIndex, isKeyboardNavigating, navigationRef } = useKeyboardNavigation({
 *   getAllNavItems,
 *   isCollapsed,
 *   toggleSidebar,
 *   toggleExpanded,
 *   showShortcuts,
 *   setShowShortcuts
 * })
 * ```
 */
export function useKeyboardNavigation({
  getAllNavItems,
  isCollapsed,
  toggleSidebar,
  toggleExpanded,
  showShortcuts,
  setShowShortcuts,
}: UseKeyboardNavigationOptions): UseKeyboardNavigationReturn {
  const navigate = useNavigate()
  const navigationRef = useRef<HTMLElement>(null)
  
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [isKeyboardNavigating, setIsKeyboardNavigating] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle keyboard navigation when sidebar is focused
      if (!navigationRef.current?.contains(document.activeElement)) {
        return
      }

      const allItems = getAllNavItems
      
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setIsKeyboardNavigating(true)
          setFocusedIndex(prev => {
            const newIndex = prev < allItems.length - 1 ? prev + 1 : 0
            return newIndex
          })
          break
          
        case 'ArrowUp':
          event.preventDefault()
          setIsKeyboardNavigating(true)
          setFocusedIndex(prev => {
            const newIndex = prev > 0 ? prev - 1 : allItems.length - 1
            return newIndex
          })
          break
          
        case 'Enter':
          event.preventDefault()
          if (focusedIndex >= 0 && focusedIndex < allItems.length) {
            const item = allItems[focusedIndex]
            if (item.subItems && !isCollapsed) {
              toggleExpanded(item.id)
            } else {
              navigate(item.href)
            }
          }
          break
          
        case 'Escape':
          setFocusedIndex(-1)
          setIsKeyboardNavigating(false)
          break
          
        // Quick navigation shortcuts
        case '1':
          if (event.altKey) {
            event.preventDefault()
            navigate('/dashboard')
          }
          break
        case '2':
          if (event.altKey) {
            event.preventDefault()
            navigate('/customers')
          }
          break
        case '3':
          if (event.altKey) {
            event.preventDefault()
            navigate('/catalog')
          }
          break
        case 'b':
          if (event.ctrlKey && event.shiftKey) {
            event.preventDefault()
            toggleSidebar()
          }
          break
        case '?':
          if (event.shiftKey) {
            event.preventDefault()
            setShowShortcuts(!showShortcuts)
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [
    focusedIndex,
    getAllNavItems,
    navigate,
    isCollapsed,
    showShortcuts,
    toggleSidebar,
    toggleExpanded,
    setShowShortcuts,
  ])

  return {
    focusedIndex,
    isKeyboardNavigating,
    navigationRef,
  }
}

