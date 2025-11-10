import { motion, AnimatePresence } from 'framer-motion'
import { PanelLeft, PanelLeftClose, User, LogOut, X } from 'lucide-react'
import { memo, useCallback, useMemo, useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import ColorLogo from '@/assets/logos/color-logo.svg'
import { Breadcrumb } from '@/shared/components/Breadcrumb'
import { IconButton, UserButton } from '@/shared/components/Button'
import { NavigationItem } from '@/shared/components/DashboardLayout/NavigationItem'
import { LAYOUT_CONSTANTS, ANIMATION_VARIANTS } from '@/shared/components/DashboardLayout/constants'
import type { DashboardLayoutProps } from '@/shared/components/DashboardLayout/types'
import { mainNavigationItems, bottomNavigationItems } from '@/shared/config/navigation.config'
import { useAuth } from '@/shared/hooks/useAuth'
import { useKeyboardNavigation } from '@/shared/hooks/useKeyboardNavigation'
import { useReducedMotion } from '@/shared/hooks/useReducedMotion'
import { useResponsive } from '@/shared/hooks/useResponsive'
import { useRoundAccount } from '@/shared/hooks/useRoundAccount'
import { useSidebarState } from '@/shared/hooks/useSidebarState'
import { useSwipeGesture } from '@/shared/hooks/useSwipeGesture'
import { apiClient } from '@/shared/services/apiClient'
import type { User as AuthUser } from '@/shared/types/auth'
import { cn } from '@/shared/utils/cn'

// Logo text component (reusable, kept here as it's small and only used in mobile header)
const LogoText = memo(({ className = "text-xl" }: { className?: string }) => (
  <div className="flex items-center space-x-0.5">
    <span className={`text-[#D417C8] font-light ${className} tracking-wider transition-all duration-300`}>R</span>
    <span className={`text-[#BD2CD0] font-light ${className} tracking-wider transition-all duration-300`}>O</span>
    <span className={`text-[#7767DA] font-light ${className} tracking-wider transition-all duration-300`}>U</span>
    <span className={`text-[#32A1E4] font-light ${className} tracking-wider transition-all duration-300`}>N</span>
    <span className={`text-[#14BDEA] font-light ${className} tracking-wider transition-all duration-300`}>D</span>
  </div>
))
LogoText.displayName = 'LogoText'

// Mobile Header Component (kept here as it uses LogoText and is specific to mobile layout)
const MobileHeader = memo(({ 
  onMenuClick,
  isMenuOpen 
}: { 
  onMenuClick: () => void
  isMenuOpen: boolean
}) => (
  <div 
    className="fixed top-0 left-0 right-0 h-16 bg-[#070708] border-b border-white/10 z-[50] flex items-center justify-between px-4"
    style={{
      paddingTop: 'max(1rem, var(--safe-area-inset-top))',
      paddingLeft: 'max(1rem, var(--safe-area-inset-left))',
      paddingRight: 'max(1rem, var(--safe-area-inset-right))',
      height: 'calc(4rem + var(--safe-area-inset-top))'
    }}
  >
    <IconButton
      onClick={onMenuClick}
      icon={PanelLeft}
      variant="ghost"
      size="md"
      className="text-gray-400 hover:text-white"
      aria-label={isMenuOpen ? "Close sidebar" : "Open sidebar"}
    />

    <Link to="/dashboard" className="flex items-center space-x-2">
      <img src={ColorLogo} alt="Round Logo" className="w-7 h-7" />
      <LogoText className="text-lg" />
    </Link>

    {/* Empty div for spacing to center the logo */}
    <div className="w-10 h-10"></div>
  </div>
))
MobileHeader.displayName = 'MobileHeader'

// NavigationItem is now imported from separate file

export const DashboardLayout = memo(({ 
  children,
  navigationItems = mainNavigationItems,
  bottomNavigationItems: bottomNavItemsProp = bottomNavigationItems,
}: DashboardLayoutProps) => {
  // Extract constants for cleaner code
  const { SIDEBAR } = LAYOUT_CONSTANTS

  const navigate = useNavigate()
  const { logout, state } = useAuth()
  const { token } = state
  const location = useLocation()
  const { isMobile, isTablet } = useResponsive()
  const { roundAccount, isLoading: isRoundAccountLoading } = useRoundAccount()
  const prefersReducedMotion = useReducedMotion()

  // Memoize isMobileView for better performance
  const isMobileView = useMemo(() => isMobile || isTablet, [isMobile, isTablet])

  // UI state for shortcuts modal  
  const [showShortcuts, setShowShortcuts] = useState(false)

  // Use custom hooks for sidebar state and keyboard navigation
  const {
    isCollapsed,
    setIsCollapsed,
    toggleSidebar,
    expandedItems,
    toggleExpanded,
    showMobileOverlay,
    showProfileDropdown,
    setShowProfileDropdown
  } = useSidebarState({ isMobileView })

  // Get all navigation items (flat list for keyboard navigation)
  const getAllNavItems = useMemo(() => {
    interface FlatNavItem {
      id: string
      label: string
      href: string
      icon: React.ComponentType<{ className?: string }>
      badge?: string
      subItems?: Array<{ id: string; label: string; href: string; icon: React.ComponentType<{ className?: string }> }>
      isSubItem?: boolean
      parentId?: string
    }
    
    const items: FlatNavItem[] = []
    
    navigationItems.forEach((item) => {
      items.push(item)
      if (item.subItems && (!isCollapsed && expandedItems.includes(item.id))) {
        item.subItems.forEach((subItem) => {
          items.push({ ...subItem, isSubItem: true, parentId: item.id })
        })
      }
    })
    
    bottomNavItemsProp.forEach((item) => {
      items.push(item)
    })
    
    return items
  }, [navigationItems, bottomNavItemsProp, isCollapsed, expandedItems])

  const {
    focusedIndex,
    isKeyboardNavigating,
    navigationRef
  } = useKeyboardNavigation({
    getAllNavItems,
    isCollapsed,
    toggleSidebar,
    toggleExpanded,
    showShortcuts,
    setShowShortcuts
  })

  // Swipe gesture state for visual feedback
  const [swipeOffset, setSwipeOffset] = useState(0)

  // Swipe gesture for mobile sidebar (swipe right to open, left to close)
  const {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isSwiping
  } = useSwipeGesture({
    enabled: isMobileView,
    threshold: 50,
    velocityThreshold: 0.3,
    onSwipe: (direction) => {
      if (direction === 'right' && isCollapsed) {
        setIsCollapsed(false)
      } else if (direction === 'left' && !isCollapsed) {
        setIsCollapsed(true)
      }
    },
    onSwiping: (deltaX) => {
      // Update sidebar offset during swipe for visual feedback
      // Clamp the offset to reasonable bounds
      if (isCollapsed && deltaX > 0) {
        // Swipe right to open: allow positive offset up to sidebar width
        setSwipeOffset(Math.min(deltaX, SIDEBAR.WIDTH_EXPANDED))
      } else if (!isCollapsed && deltaX < 0) {
        // Swipe left to close: allow negative offset up to sidebar width
        setSwipeOffset(Math.max(deltaX, -SIDEBAR.WIDTH_EXPANDED))
      }
    },
    onSwipeEnd: () => {
      // Reset offset with animation
      setSwipeOffset(0)
    }
  })

  // Respect user's motion preferences (accessibility)
  const transitionConfigs = useMemo(() => ({
    fast: { duration: prefersReducedMotion ? 0 : 0.15 },
    normal: { duration: prefersReducedMotion ? 0 : 0.2 },
    sidebar: { duration: prefersReducedMotion ? 0 : 0.15, ease: 'easeOut' as const },
  }), [prefersReducedMotion])

  const handleSkipToMainContent = useCallback(() => {
    if (typeof document === 'undefined') {
      return
    }

    const mainContent = document.getElementById('main-content')

    if (mainContent instanceof HTMLElement) {
      const hadTabIndex = mainContent.hasAttribute('tabindex')

      if (!hadTabIndex) {
        mainContent.setAttribute('tabindex', '-1')
      }

      mainContent.focus({ preventScroll: true })
      mainContent.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      })

      if (!hadTabIndex) {
        const removeTabIndex = () => {
          mainContent.removeAttribute('tabindex')
        }

        mainContent.addEventListener('blur', removeTabIndex, { once: true })
      }
    }
  }, [prefersReducedMotion])

  // Track tooltip state
  const [hoveredTooltip, setHoveredTooltip] = useState<{ id: string; label: string; badge?: string; position: { top: number; left: number }; isUser?: boolean; userInfo?: { role: string; company: string; email: string } } | null>(null)

  // Profile dropdown ref
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  // Active state helpers
  const isActive = useCallback((href: string) => location.pathname === href, [location.pathname])

  const isParentActive = useCallback((item: typeof navigationItems[0]) => {
    if (item.subItems) {
      return item.subItems.some(subItem => isActive(subItem.href)) || isActive(item.href)
    }
    return isActive(item.href)
  }, [isActive])

  // Helper functions for user display
  const getInitials = useCallback((firstName?: string, lastName?: string) => {
    const first = firstName && firstName !== 'undefined' ? firstName.trim() : ''
    const last = lastName && lastName !== 'undefined' ? lastName.trim() : ''
    
    if (first && last) return `${first[0]}${last[0]}`.toUpperCase()
    if (first) return first.slice(0, 2).toUpperCase()
    if (last) return last.slice(0, 2).toUpperCase()
    return 'U'
  }, [])

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
    if (state.user?.accountType === 'business' && 'companyInfo' in (state.user || {}) && state.user.companyInfo?.companyName) {
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

  const userAvatar = state.user ? (
    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-normal tracking-tight">
      {getInitials(state.user.firstName, state.user.lastName)}
    </div>
  ) : (
    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
      <User className="w-4 h-4 text-white/60" />
    </div>
  )

  // Tooltip handlers
  const handleTooltipEnter = useCallback((itemId: string, label: string, badge: string | undefined, event: React.MouseEvent) => {
    if (!isCollapsed) return
    
    const buttonRect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    const tooltipPosition = {
      top: buttonRect.top + buttonRect.height / 2 - 20,
      left: buttonRect.right + 12
    }
    
    setHoveredTooltip({ id: itemId, label, badge, position: tooltipPosition })
  }, [isCollapsed])

  const handleTooltipLeave = useCallback(() => {
    setHoveredTooltip(null)
  }, [])

  const handleUserTooltipEnter = useCallback((event: React.MouseEvent) => {
    if (!isCollapsed || !state.user) return
    
    const buttonRect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    const tooltipPosition = {
      top: buttonRect.top - 120,
      left: buttonRect.right + 12
    }
    
    setHoveredTooltip({ 
      id: 'user-profile', 
      label: getUserDisplayName(state.user), 
      position: tooltipPosition, 
      isUser: true,
      userInfo: {
        role: state.user.role,
        company: getCompanyDisplayName(),
        email: state.user.email
      }
    })
  }, [isCollapsed, state.user, getUserDisplayName, getCompanyDisplayName])

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

  // Helper functions (can't be extracted to hooks because they depend on component state)
  const handleLogout = async () => {
    if (token) {
      await apiClient.logout()
    }
    logout()
    navigate('/login')
  }

  return (
    <div
      className="min-h-screen relative bg-[#070708]"
      style={{
        '--sidebar-width': isCollapsed ? '80px' : '280px'
      } as React.CSSProperties}
    >
      {/* Skip to main content link for accessibility */}
      <button
        type="button"
        onClick={handleSkipToMainContent}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[999] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#070708]"
      >
        Skip to main content
      </button>

      {/* Minimal background - no floating orbs */}

      {/* Mobile Header - Fixed at top */}
      {isMobileView && (
        <MobileHeader 
          onMenuClick={toggleSidebar}
          isMenuOpen={!isCollapsed}
        />
      )}

      {/* Mobile Overlay */}
      <AnimatePresence>
        {showMobileOverlay && !isCollapsed && (
          <motion.div
            {...ANIMATION_VARIANTS.fadeIn}
            transition={transitionConfigs.normal}
            className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
            onClick={() => setIsCollapsed(true)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          />
        )}
      </AnimatePresence>

      {/* Swipe area on left edge to open sidebar on mobile (when closed) */}
      {isMobileView && isCollapsed && (
        <div
          className="fixed left-0 top-0 bottom-0 w-6 z-[60]"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isMobileView ? SIDEBAR.WIDTH_EXPANDED : (isCollapsed ? SIDEBAR.WIDTH_COLLAPSED : SIDEBAR.WIDTH_EXPANDED),
          x: isMobileView && isCollapsed ? -SIDEBAR.WIDTH_EXPANDED : (isSwiping ? swipeOffset : 0)
        }}
        transition={isSwiping ? { duration: 0 } : transitionConfigs.sidebar}
        className={`fixed left-0 top-0 h-full bg-[#070708] ${isMobileView ? 'z-[70] shadow-2xl' : 'z-auto'}`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={isMobileView ? {
          touchAction: 'pan-y', // Allow vertical scrolling but control horizontal
          paddingTop: 'var(--safe-area-inset-top)',
          paddingBottom: 'var(--safe-area-inset-bottom)'
        } : {
          touchAction: 'auto'
        }}
      >
        {/* Logo Section with Collapse Button - Desktop Only */}
        {!isMobileView && (
          <>
            <div className="flex-shrink-0">
              {!isCollapsed ? (
                // Expanded: Logo on left, button on right (same row)
                <div className="flex items-center justify-between pl-8 pr-6 py-5">
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2.5 transition-colors duration-200 cursor-pointer min-w-0"
                  >
                    <img src={ColorLogo} alt="Round Logo" className="w-8 h-8 flex-shrink-0" />
                    <LogoText />
                  </Link>
                  
                  {/* Collapse button at same height as logo */}
                  <IconButton
                    onClick={toggleSidebar}
                    icon={PanelLeftClose}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white flex-shrink-0"
                    aria-label="Collapse sidebar"
                    title="Collapse sidebar (Ctrl+Shift+B)"
                  />
                </div>
              ) : (
                // Collapsed: Logo on top, button below
                <div className="flex flex-col items-center py-5 space-y-3">
                  <Link
                    to="/dashboard"
                    className="flex items-center justify-center transition-colors duration-200 cursor-pointer"
                  >
                    <img src={ColorLogo} alt="Round Logo" className="w-8 h-8" />
                  </Link>
                  
                  {/* Expand button below logo */}
                  <IconButton
                    onClick={toggleSidebar}
                    icon={PanelLeft}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                    aria-label="Expand sidebar"
                    title="Expand sidebar (Ctrl+Shift+B)"
                  />
                </div>
              )}
            </div>

            {/* Divider below logo */}
            <div className="border-t border-white/10 mx-2"></div>
          </>
        )}

        {/* Mobile Header inside sidebar - Same as desktop */}
        {isMobileView && !isCollapsed && (
          <>
            <div className="flex-shrink-0">
              <div className="flex items-center justify-between pl-8 pr-6 py-5">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2.5 transition-colors duration-200 cursor-pointer min-w-0"
                >
                  <img src={ColorLogo} alt="Round Logo" className="w-8 h-8 flex-shrink-0" />
                  <LogoText />
                </Link>
                
                {/* Close button - same as desktop collapse button */}
                <IconButton
                  onClick={toggleSidebar}
                  icon={PanelLeftClose}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white flex-shrink-0"
                  aria-label="Close sidebar"
                  title="Close sidebar"
                />
              </div>
            </div>

            {/* Divider below logo */}
            <div className="border-t border-white/10 mx-2"></div>
          </>
        )}

        {/* Main Content Area - Flex container for navigation and bottom sections */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navigation */}
          <nav 
            ref={navigationRef}
            className={`hide-scrollbar flex-1 py-4 md:py-5 lg:py-4 space-y-1.5 md:space-y-2 lg:space-y-1.5 overflow-y-auto overflow-x-hidden ${isMobileView ? 'px-4' : (isCollapsed ? 'px-2' : 'px-4 md:px-6 lg:px-4')}`}
            style={{ paddingBottom: showProfileDropdown ? '16rem' : '8rem' }}
            role="navigation"
            aria-label="Main navigation"
          >
          {navigationItems.map(item => (
            <NavigationItem
              key={item.id}
              item={item}
              isCollapsed={isCollapsed}
              expandedItems={expandedItems}
              isParentActive={isParentActive}
              isActive={isActive}
              toggleExpanded={toggleExpanded}
              handleTooltipEnter={handleTooltipEnter}
              handleTooltipLeave={handleTooltipLeave}
              getAllNavItems={getAllNavItems}
              focusedIndex={focusedIndex}
              isKeyboardNavigating={isKeyboardNavigating}
              transitionConfigs={transitionConfigs}
            />
          ))}

          {/* Bottom Navigation Items - Include in main navigation */}
          {bottomNavItemsProp.map(item => (
            <Link
              key={item.id}
              to={item.href}
              onMouseEnter={(e) => handleTooltipEnter(item.id, item.label, undefined, e)}
              onMouseLeave={handleTooltipLeave}
              className={cn(
                'group relative flex items-center rounded-lg transition-all duration-200 h-9',
                isActive(item.href)
                  ? 'bg-primary/10 text-white border border-primary/20'
                  : 'text-white/60 hover:text-white',
                isCollapsed ? 'justify-center px-0' : 'px-6',
                isKeyboardNavigating && focusedIndex === getAllNavItems.findIndex(navItem => navItem.id === item.id) && 'ring-2 ring-ring'
              )}
              aria-label={item.label}
              tabIndex={isKeyboardNavigating ? -1 : 0}
            >
              <item.icon className={`w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 ${isCollapsed ? '' : 'mr-2.5 md:mr-3 lg:mr-2.5'} flex-shrink-0`} />

              {!isCollapsed && (
                <div className="overflow-hidden">
                  <span className="font-normal whitespace-nowrap text-sm md:text-base lg:text-sm">{item.label}</span>
                </div>
              )}

            </Link>
          ))}

        </nav>

        {/* Fixed User Profile Section at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#070708] z-10">
            {/* Expandable Profile Menu Items */}
            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  {...ANIMATION_VARIANTS.expandCollapse}
                  transition={transitionConfigs.normal}
                  className={`overflow-hidden bg-[#070708] border-t border-[#262626] mx-2 space-y-1.5 md:space-y-2 lg:space-y-1.5 ${isCollapsed ? 'px-2 py-2' : 'px-4 md:px-6 lg:px-4 py-3 md:py-4 lg:py-3'}`}
                >
                <Link
                  to="/user-settings"
                  onClick={() => setShowProfileDropdown(false)}
                  onMouseEnter={(e) => handleTooltipEnter('user-settings', 'User Settings', undefined, e)}
                  onMouseLeave={handleTooltipLeave}
                  className={cn(
                    'group relative flex items-center rounded-lg transition-all duration-200 h-9',
                    isActive('/user-settings')
                      ? 'bg-primary/10 text-white border border-primary/20'
                      : 'text-white/60 hover:text-white',
                    isCollapsed ? 'justify-center px-0' : 'justify-start gap-2'
                  )}
                  aria-label="User Settings"
                >
                  <User className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-normal whitespace-nowrap text-sm md:text-base lg:text-sm">
                      User Settings
                    </span>
                  )}

                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileDropdown(false)
                    handleLogout()
                  }}
                  onMouseEnter={(e) => handleTooltipEnter('logout', 'Logout', undefined, e)}
                  onMouseLeave={handleTooltipLeave}
                  className={cn(
                    'w-full group relative flex items-center rounded-lg transition-all duration-200 h-9 text-white/60 hover:text-white',
                    isCollapsed ? 'justify-center px-0' : 'justify-start gap-3'
                  )}
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-normal whitespace-nowrap text-sm md:text-base lg:text-sm">
                      Logout
                    </span>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Divider */}
          <div className="border-t border-white/10 mx-2 bg-[#070708]" />
          
          {/* User Profile */}
          <div className={cn('py-2 bg-[#070708]', isCollapsed ? 'px-2' : 'px-4 md:px-6 lg:px-4')}>
            <div className="relative" ref={profileDropdownRef}>
              <UserButton
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                onMouseEnter={handleUserTooltipEnter}
                onMouseLeave={handleTooltipLeave}
                collapsed={isCollapsed}
                isExpanded={showProfileDropdown}
                name={userDisplayName}
                subtitle={secondaryUserInfo}
                avatar={userAvatar}
                aria-label="User profile menu"
                aria-expanded={showProfileDropdown}
              />
            </div>
          </div>
          </div>
        </div>
      </motion.aside>


      {/* External Tooltips for Collapsed Sidebar */}
      <AnimatePresence>
        {hoveredTooltip && isCollapsed && (
          <motion.div
            {...ANIMATION_VARIANTS.tooltip}
            transition={transitionConfigs.fast}
            className={`fixed bg-[#171719] border border-white/10 text-white rounded-lg pointer-events-none z-tooltip shadow-xl ${
              hoveredTooltip.isUser ? 'px-4 py-3 text-xs max-w-[250px]' : 'px-3 py-2 text-sm whitespace-nowrap'
            }`}
            style={{
              top: hoveredTooltip.position.top,
              left: hoveredTooltip.position.left
            }}
          >
            {hoveredTooltip.isUser ? (
              <div>
                <div className="font-normal mb-2 text-white tracking-tight">
                  {hoveredTooltip.label}
                </div>
                <div className="text-white/90 text-sm leading-relaxed space-y-1">
                  <div>{hoveredTooltip.userInfo?.role as React.ReactNode} at {hoveredTooltip.userInfo?.company as React.ReactNode}</div>
                  <div className="text-white/90">{hoveredTooltip.userInfo?.email as React.ReactNode}</div>
                </div>
              </div>
            ) : (
              <>
                {hoveredTooltip.label}
                {hoveredTooltip.badge && <span className="ml-1 text-[#D417C8]">({hoveredTooltip.badge})</span>}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Help Modal */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            {...ANIMATION_VARIANTS.fadeIn}
            transition={transitionConfigs.normal}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              {...ANIMATION_VARIANTS.modal}
              transition={transitionConfigs.normal}
              className="bg-[#171719] border border-white/10 rounded-lg p-6 max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-normal text-white tracking-tight">Keyboard Shortcuts</h3>
                <IconButton
                  onClick={() => setShowShortcuts(false)}
                  icon={X}
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-white"
                  aria-label="Close shortcuts help"
                />
              </div>
              
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="text-white font-normal mb-2 tracking-tight">Navigation</h4>
                  <div className="space-y-1 text-white/60">
                    <div className="flex justify-between">
                      <span>Dashboard</span>
                      <kbd className="px-2 py-1 bg-white/5 rounded text-xs">Alt+1</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Customers</span>
                      <kbd className="px-2 py-1 bg-white/5 rounded text-xs">Alt+2</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Catalog</span>
                      <kbd className="px-2 py-1 bg-white/5 rounded text-xs">Alt+3</kbd>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-normal mb-2">Sidebar</h4>
                  <div className="space-y-1 text-white/60">
                    <div className="flex justify-between">
                      <span>Toggle Sidebar</span>
                      <kbd className="px-2 py-1 bg-white/5 rounded text-xs">Ctrl+Shift+B</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Arrow Navigation</span>
                      <kbd className="px-2 py-1 bg-white/20 rounded text-xs">↑↓</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Select Item</span>
                      <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Enter</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Close/Escape</span>
                      <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Esc</kbd>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Responsive margins */}
      <motion.main
        id="main-content"
        initial={false}
        animate={{
          marginLeft: isMobileView ? 0 : (isCollapsed ? SIDEBAR.WIDTH_COLLAPSED : SIDEBAR.WIDTH_EXPANDED)
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className={`relative z-10 ${isMobileView ? 'mt-16 p-0' : 'p-2'}`}
        style={isMobileView ? {
          paddingBottom: 'max(1rem, var(--safe-area-inset-bottom))'
        } : undefined}
      >
        <div className={`bg-[#101011] overflow-y-auto scrollbar-thin ${isMobileView ? 'min-h-[calc(100vh-4rem)]' : 'h-[calc(100vh-1rem)] rounded-xl'}`}>
          <div className={`max-w-6xl lg:max-w-7xl xl:max-w-screen-2xl mx-auto ${isMobileView ? 'px-4 py-4' : 'px-6 py-6'}`}>
            <Breadcrumb />
            {children}
          </div>
        </div>
      </motion.main>

    </div>
  )
})

DashboardLayout.displayName = 'DashboardLayout'
