import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Options for the useSidebarState hook
 */
export interface UseSidebarStateOptions {
  isMobileView: boolean
}

/**
 * Return type for the useSidebarState hook
 */
export interface UseSidebarStateReturn {
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
  toggleSidebar: () => void
  expandedItems: string[]
  setExpandedItems: (value: string[] | ((prev: string[]) => string[])) => void
  toggleExpanded: (itemId: string) => void
  showMobileOverlay: boolean
  setShowMobileOverlay: (value: boolean) => void
  showProfileDropdown: boolean
  setShowProfileDropdown: (value: boolean) => void
  lastPathRef: React.MutableRefObject<string>
}

/**
 * Custom hook to manage sidebar state
 * 
 * Handles:
 * - Collapsed/expanded state with localStorage persistence
 * - Expanded menu items with localStorage persistence
 * - Mobile overlay state
 * - Profile dropdown state
 * - Auto-expansion of catalog menu when navigating to catalog pages
 * - Responsive behavior (default collapsed on mobile, expanded on desktop)
 * 
 * @param options - Configuration options
 * @returns Sidebar state and control functions
 * 
 * @example
 * ```tsx
 * const { isCollapsed, toggleSidebar, expandedItems } = useSidebarState({ isMobileView })
 * ```
 */
export function useSidebarState({ isMobileView }: UseSidebarStateOptions): UseSidebarStateReturn {
  const location = useLocation()
  const lastPathRef = useRef<string>('')

  // Initialize sidebar state from localStorage - mobile first
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') return true
    const saved = localStorage.getItem('sidebar-collapsed')
    // Default to collapsed on mobile, open on desktop
    return saved ? saved === 'true' : isMobileView
  })

  // Mobile overlay state
  const [showMobileOverlay, setShowMobileOverlay] = useState(false)

  // Track expanded menu items
  const [expandedItems, setExpandedItems] = useState<string[]>(() => {
    // Auto-expand catalog if user is on a catalog page
    const savedExpanded = localStorage.getItem('sidebar-expanded-items')
    if (savedExpanded) {
      try {
        const parsed = JSON.parse(savedExpanded)
        if (Array.isArray(parsed)) {
          return parsed
        }
      } catch (e) {
        // Fallback to default behavior
      }
    }

    if (location.pathname.startsWith('/catalog')) {
      return ['catalog']
    }
    return []
  })

  // UI state
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  // Toggle sidebar collapsed state
  const toggleSidebar = useCallback(() => {
    setIsCollapsed(prev => !prev)
  }, [])

  // Toggle expanded state of a menu item
  const toggleExpanded = useCallback((itemId: string) => {
    setExpandedItems(prev => {
      const isCurrentlyExpanded = prev.includes(itemId)
      if (isCurrentlyExpanded) {
        return prev.filter(id => id !== itemId)
      } else {
        return [...prev, itemId]
      }
    })
  }, [])

  // Handle responsive behavior - optimized
  useEffect(() => {
    setShowMobileOverlay(isMobileView && !isCollapsed)
  }, [isMobileView, isCollapsed])

  // Persist sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', isCollapsed.toString())
  }, [isCollapsed])

  // Persist expanded items to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-expanded-items', JSON.stringify(expandedItems))
  }, [expandedItems])

  // Auto-expand catalog when navigating to catalog pages (only run once per path change)
  useEffect(() => {
    if (location.pathname !== lastPathRef.current) {
      lastPathRef.current = location.pathname

      if (location.pathname.startsWith('/catalog')) {
        setExpandedItems(prev => {
          if (!prev.includes('catalog')) {
            return [...prev, 'catalog']
          }
          return prev
        })
      }
    }
  }, [location.pathname])

  return {
    isCollapsed,
    setIsCollapsed,
    toggleSidebar,
    expandedItems,
    setExpandedItems,
    toggleExpanded,
    showMobileOverlay,
    setShowMobileOverlay,
    showProfileDropdown,
    setShowProfileDropdown,
    lastPathRef,
  }
}
