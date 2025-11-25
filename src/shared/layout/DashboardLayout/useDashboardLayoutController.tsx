import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '@/shared/hooks/useAuth'
import { useKeyboardNavigation } from '@/shared/hooks/useKeyboardNavigation'
import { useReducedMotion } from '@/shared/hooks/useReducedMotion'
import { useResponsive } from '@/shared/hooks/useResponsive'
import { useRoundAccount } from '@/shared/hooks/useRoundAccount'
import { useSidebarState } from '@/shared/hooks/useSidebarState'
import { useSwipeGesture } from '@/shared/hooks/useSwipeGesture'
import { LAYOUT_CONSTANTS } from '@/shared/layout/DashboardLayout/constants'
import type { NavItem, TooltipState } from '@/shared/layout/DashboardLayout/types'
import { apiClient } from '@/shared/services/apiClient'
import type { User as AuthUser } from '@/shared/types/auth'
import { Avatar } from '@/shared/ui'

interface UseDashboardLayoutControllerParams {
  navigationItems: NavItem[]
  bottomNavigationItems: NavItem[]
}

export const useDashboardLayoutController = ({
  navigationItems,
  bottomNavigationItems,
}: UseDashboardLayoutControllerParams) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, state } = useAuth()
  const { token } = state
  const { isMobile, isTablet } = useResponsive()
  const { roundAccount, isLoading: isRoundAccountLoading } = useRoundAccount()
  const prefersReducedMotion = useReducedMotion()

  const isMobileView = useMemo(() => isMobile || isTablet, [isMobile, isTablet])

  const [showShortcuts, setShowShortcuts] = useState(false)
  const [hoveredTooltip, setHoveredTooltip] = useState<TooltipState | null>(null)
  const [swipeOffset, setSwipeOffset] = useState(0)

  const {
    isCollapsed,
    setIsCollapsed,
    toggleSidebar,
    expandedItems,
    toggleExpanded,
    showMobileOverlay,
    showProfileDropdown,
    setShowProfileDropdown,
  } = useSidebarState({ isMobileView })

  const getAllNavItems = useMemo(() => {
    interface FlatNavItem extends NavItem {
      isSubItem?: boolean
      parentId?: string
    }

    const items: FlatNavItem[] = []

    navigationItems.forEach(item => {
      items.push(item)
      if (item.subItems && (!isCollapsed && expandedItems.includes(item.id))) {
        item.subItems.forEach(subItem => {
          items.push({ ...subItem, isSubItem: true, parentId: item.id })
        })
      }
    })

    bottomNavigationItems.forEach(item => items.push(item))

    return items
  }, [navigationItems, bottomNavigationItems, isCollapsed, expandedItems])

  const {
    focusedIndex,
    isKeyboardNavigating,
    navigationRef,
  } = useKeyboardNavigation({
    getAllNavItems,
    isCollapsed,
    toggleSidebar,
    toggleExpanded,
    showShortcuts,
    setShowShortcuts,
  })

  const { SIDEBAR } = LAYOUT_CONSTANTS

  const { onTouchStart, onTouchMove, onTouchEnd, isSwiping } = useSwipeGesture({
    enabled: isMobileView,
    threshold: 50,
    velocityThreshold: 0.3,
    onSwipe: direction => {
      if (direction === 'right' && isCollapsed) {
        setIsCollapsed(false)
      } else if (direction === 'left' && !isCollapsed) {
        setIsCollapsed(true)
      }
    },
    onSwiping: deltaX => {
      if (isCollapsed && deltaX > 0) {
        setSwipeOffset(Math.min(deltaX, SIDEBAR.WIDTH_EXPANDED))
      } else if (!isCollapsed && deltaX < 0) {
        setSwipeOffset(Math.max(deltaX, -SIDEBAR.WIDTH_EXPANDED))
      }
    },
    onSwipeEnd: () => setSwipeOffset(0),
  })

  const transitionConfigs = useMemo(
    () => ({
      fast: { duration: prefersReducedMotion ? 0 : 0.15 },
      normal: { duration: prefersReducedMotion ? 0 : 0.2 },
      sidebar: { duration: prefersReducedMotion ? 0 : 0.15, ease: 'easeOut' as const },
    }),
    [prefersReducedMotion]
  )

  const handleSkipToMainContent = useCallback(() => {
    if (typeof document === 'undefined') return

    const mainContent = document.getElementById('main-content')

    if (mainContent instanceof HTMLElement) {
      const hadTabIndex = mainContent.hasAttribute('tabindex')

      if (!hadTabIndex) {
        mainContent.setAttribute('tabindex', '-1')
      }

      mainContent.focus({ preventScroll: true })
      mainContent.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      })

      if (!hadTabIndex) {
        const removeTabIndex = () => {
          mainContent.removeAttribute('tabindex')
        }

        mainContent.addEventListener('blur', removeTabIndex, { once: true })
      }
    }
  }, [prefersReducedMotion])

  const profileDropdownRef = useRef<HTMLDivElement>(null)

  const isActive = useCallback((href: string, exact?: boolean) => {
    if (href === '/' || href === '/dashboard' || exact) {
      return location.pathname === href
    }
    return location.pathname.startsWith(href)
  }, [location.pathname])

  const isParentActive = useCallback(
    (item: NavItem) => {
      if (item.subItems) {
        return item.subItems.some(subItem => isActive(subItem.href, subItem.exact)) || isActive(item.href, item.exact)
      }
      return isActive(item.href, item.exact)
    },
    [isActive]
  )

  const getUserDisplayName = useCallback((user?: AuthUser | null) => {
    if (!user) return 'User'
    const firstName = user.firstName && user.firstName !== 'undefined' ? user.firstName.trim() : ''
    const lastName = user.lastName && user.lastName !== 'undefined' ? user.lastName.trim() : ''

    if (firstName && lastName) return `${firstName} ${lastName}`
    if (firstName) return firstName
    if (user.email) return user.email
    return 'User'
  }, [])

  const getCompanyDisplayName = useCallback(() => {
    if (isRoundAccountLoading) return 'Loading...'
    if (roundAccount?.accountName) return roundAccount.accountName
    if (roundAccount?.organization?.name) return roundAccount.organization.name
    if (
      state.user?.accountType === 'business' &&
      'companyInfo' in (state.user || {}) &&
      state.user.companyInfo?.companyName
    ) {
      return state.user.companyInfo.companyName
    }
    return state.user?.accountType === 'business' ? 'Business Account' : 'Personal Account'
  }, [isRoundAccountLoading, roundAccount, state.user])

  const userDisplayName = useMemo(
    () => getUserDisplayName(state.user),
    [getUserDisplayName, state.user]
  )

  const secondaryUserInfo = useMemo(() => {
    if (!state.user) return getCompanyDisplayName()
    const companyLabel = getCompanyDisplayName()
    const normalizedCompany = companyLabel?.trim().toLowerCase()
    const normalizedUser = userDisplayName?.trim().toLowerCase()

    if (!companyLabel || normalizedCompany === normalizedUser) {
      return state.user.email ?? companyLabel
    }

    return companyLabel
  }, [getCompanyDisplayName, state.user, userDisplayName])

  const userAvatar = useMemo(() => {
    if (state.user) {
      const firstName = state.user.firstName && state.user.firstName !== 'undefined' ? state.user.firstName.trim() : ''
      const lastName = state.user.lastName && state.user.lastName !== 'undefined' ? state.user.lastName.trim() : ''
      const name = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || 'User'

      return (
        <Avatar
          name={name}
          size="sm"
          shape="circle"
        />
      )
    }

    return (
      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
        <svg
          className="w-4 h-4 text-white/60"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 14a4 4 0 00-8 0v1H5a2 2 0 00-2 2v1h18v-1a2 2 0 00-2-2h-3v-1z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
      </div>
    )
  }, [state.user])

  const handleTooltipEnter = useCallback(
    (itemId: string, label: string, badge: string | undefined, event: ReactMouseEvent) => {
      if (!isCollapsed) return

      const buttonRect = (event.currentTarget as HTMLElement).getBoundingClientRect()
      const tooltipPosition = {
        top: buttonRect.top + buttonRect.height / 2 - 20,
        left: buttonRect.right + 12,
      }

      setHoveredTooltip({ id: itemId, label, badge, position: tooltipPosition })
    },
    [isCollapsed]
  )

  const handleTooltipLeave = useCallback(() => {
    setHoveredTooltip(null)
  }, [])

  const handleUserTooltipEnter = useCallback(
    (event: ReactMouseEvent) => {
      if (!isCollapsed || !state.user) return

      const buttonRect = (event.currentTarget as HTMLElement).getBoundingClientRect()
      const tooltipPosition = {
        top: buttonRect.top - 120,
        left: buttonRect.right + 12,
      }

      setHoveredTooltip({
        id: 'user-profile',
        label: getUserDisplayName(state.user),
        position: tooltipPosition,
        isUser: true,
        userInfo: {
          role: state.user.role,
          company: getCompanyDisplayName(),
          email: state.user.email,
        },
      })
    },
    [getCompanyDisplayName, getUserDisplayName, isCollapsed, state.user]
  )

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (showProfileDropdown && profileDropdownRef.current) {
        const target = event.target as Element
        if (!profileDropdownRef.current.contains(target)) {
          setShowProfileDropdown(false)
        }
      }
    }

    if (showProfileDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showProfileDropdown, setShowProfileDropdown])

  const handleLogout = useCallback(async () => {
    if (token) {
      await apiClient.logout()
    }
    logout()
    navigate('/login')
  }, [logout, navigate, token])

  return {
    // navigation config
    navigationItems,
    bottomNavigationItems,
    getAllNavItems,
    // responsive / sidebar
    isMobileView,
    isCollapsed,
    setIsCollapsed,
    toggleSidebar,
    expandedItems,
    toggleExpanded,
    showMobileOverlay,
    // swipe
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isSwiping,
    swipeOffset,
    // keyboard navigation
    focusedIndex,
    isKeyboardNavigating,
    navigationRef,
    showShortcuts,
    setShowShortcuts,
    // tooltips
    hoveredTooltip,
    handleTooltipEnter,
    handleTooltipLeave,
    handleUserTooltipEnter,
    // profile dropdown
    showProfileDropdown,
    setShowProfileDropdown,
    profileDropdownRef,
    // user info
    userDisplayName,
    secondaryUserInfo,
    userAvatar,
    // state helpers
    isActive,
    isParentActive,
    // transitions & actions
    transitionConfigs,
    handleSkipToMainContent,
    handleLogout,
  }
}
