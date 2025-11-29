import { motion, AnimatePresence } from 'framer-motion'
import { PanelLeft, PanelLeftClose, LogOut, X, Settings } from 'lucide-react'
import { memo } from 'react'
import { Link } from 'react-router-dom'

import ColorLogo from '../../assets/logos/color-logo.svg?url'

import { mainNavigationItems, bottomNavigationItems } from '@/shared/config/navigation.config'
import { NavigationItem } from '@/shared/layout/DashboardLayout/NavigationItem'
import { LAYOUT_CONSTANTS, ANIMATION_VARIANTS } from '@/shared/layout/DashboardLayout/constants'
import type { DashboardLayoutProps } from '@/shared/layout/DashboardLayout/types'
import { useDashboardLayoutController } from '@/shared/layout/DashboardLayout/useDashboardLayoutController'
import { Button } from '@/shared/ui/shadcn/button'
import { cn } from '@/shared/utils/cn'

// Logo text component (reusable, kept here as it's small and only used in mobile header)
const LogoText = memo(({ className = "text-xl" }: { className?: string }) => (
  <div className="flex items-center space-x-0.5">
    <span className={`text-primary font-light ${className} tracking-wider transition-all duration-300`}>R</span>
    <span className={`text-[#BD2CD0] font-light ${className} tracking-wider transition-all duration-300`}>O</span>
    <span className={`text-accent font-light ${className} tracking-wider transition-all duration-300`}>U</span>
    <span className={`text-secondary font-light ${className} tracking-wider transition-all duration-300`}>N</span>
    <span className={`text-secondary font-light ${className} tracking-wider transition-all duration-300`}>D</span>
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
  <header
    className="fixed top-0 left-0 right-0 h-14 bg-[#070708] border-b border-border z-[50] flex items-center justify-between px-4"
    role="banner"
    aria-label="Mobile header"
    style={{
      paddingTop: 'unset',
      paddingLeft: 'max(1rem, var(--safe-area-inset-left))',
      paddingRight: 'max(1rem, var(--safe-area-inset-right))',
      height: 'calc(3.5rem + var(--safe-area-inset-top))'
    }}
  >
    <Button
      onClick={onMenuClick}
      variant="ghost"
      size="icon"
      className="text-gray-400 hover:text-white"
      aria-label={isMenuOpen ? "Close sidebar" : "Open sidebar"}
    >
      <PanelLeft className="h-4 w-4" />
    </Button>

    <Link to="/dashboard" className="flex items-center space-x-2">
      <img src={ColorLogo} alt="Round Logo" className="w-7 h-7" />
      <LogoText className="text-lg" />
    </Link>

    {/* Empty div for spacing to center the logo */}
    <div className="w-10 h-10"></div>
  </header>
))
MobileHeader.displayName = 'MobileHeader'

// NavigationItem is now imported from separate file

export const DashboardLayout = memo(({
  children,
  navigationItems = mainNavigationItems,
  bottomNavigationItems: bottomNavItemsProp = bottomNavigationItems,
}: DashboardLayoutProps) => {
  const {
    navigationItems: resolvedNavigationItems,
    bottomNavigationItems: resolvedBottomNavItems,
    isMobileView,
    isCollapsed,
    setIsCollapsed,
    toggleSidebar,
    showMobileOverlay,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isSwiping,
    swipeOffset,
    transitionConfigs,
    handleSkipToMainContent,
    showShortcuts,
    setShowShortcuts,
    expandedItems,
    toggleExpanded,
    navigationRef,
    focusedIndex,
    isKeyboardNavigating,
    handleTooltipEnter,
    handleTooltipLeave,
    handleUserTooltipEnter: _handleUserTooltipEnter,
    hoveredTooltip,
    showProfileDropdown,
    setShowProfileDropdown,
    profileDropdownRef: _profileDropdownRef,
    userDisplayName,
    secondaryUserInfo,
    userAvatar,
    getAllNavItems,
    isActive,
    isParentActive,
    handleLogout,
  } = useDashboardLayoutController({
    navigationItems,
    bottomNavigationItems: bottomNavItemsProp,
  })

  const { SIDEBAR } = LAYOUT_CONSTANTS

  return (
    <div
      className="min-h-screen relative bg-bg"
      style={{
        '--sidebar-width': isCollapsed ? '80px' : '220px'
      } as React.CSSProperties}
    >
      {/* Skip to main content link for accessibility */}
      <Button
        type="button"
        onClick={handleSkipToMainContent}
        variant="default"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[999] focus:px-4 focus:py-2 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      >
        Skip to main content
      </Button>

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
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
        className={`fixed left-0 top-0 h-full bg-bg flex flex-col ${isMobileView ? 'z-[70] shadow-2xl' : 'z-auto'}`}
        aria-label="Sidebar navigation"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={isMobileView ? {
          touchAction: 'pan-y',
          paddingTop: 'var(--safe-area-inset-top)',
          paddingBottom: 'var(--safe-area-inset-bottom)'
        } : {
          touchAction: 'auto'
        }}
      >
        {/* Logo Section */}
        <div className={cn(
          "flex-shrink-0 h-20 flex items-center transition-all duration-200",
          isCollapsed ? "justify-center px-0" : "px-4"
        )}>
          <Link
            to="/dashboard"
            className={cn(
              "flex items-center gap-3 transition-opacity duration-200 hover:opacity-80",
              isCollapsed ? "hidden" : "flex"
            )}
          >
            <img src={ColorLogo} alt="Round Logo" className="w-8 h-8" />
            <LogoText />
          </Link>

          {/* Logo for collapsed state */}
          {isCollapsed && (
            <Link to="/dashboard" className="hover:opacity-80 transition-opacity">
              <img src={ColorLogo} alt="Round Logo" className="w-8 h-8" />
            </Link>
          )}

          {/* Collapse Button - Only visible when expanded */}
          {!isMobileView && !isCollapsed && (
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="icon"
              className="ml-auto text-fg-muted hover:text-fg"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Expand Button Section - Only visible when collapsed */}
        {!isMobileView && isCollapsed && (
          <div className="flex-shrink-0 h-10 flex items-center justify-center px-2 mb-2">
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="icon"
              className="text-fg-muted hover:text-fg"
              aria-label="Expand sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Mobile Header inside sidebar */}
        {isMobileView && !isCollapsed && (
          <div className="absolute top-4 right-4">
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="icon"
              className="text-fg-muted hover:text-fg"
              aria-label="Close sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden pt-4">
          {/* Navigation */}
          <nav
            ref={navigationRef}
            className={`hide-scrollbar flex-1 space-y-1 overflow-y-auto overflow-x-hidden ${isMobileView ? 'px-4' : (isCollapsed ? 'px-2' : 'px-4')}`}
            role="navigation"
            aria-label="Main navigation"
          >
            {resolvedNavigationItems.map(item => (
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
          </nav>

          {/* Bottom Navigation */}
          {resolvedBottomNavItems.length > 0 && (
            <div className={`space-y-1 ${isMobileView ? 'px-4' : (isCollapsed ? 'px-2' : 'px-4')} pb-2`}>
              {resolvedBottomNavItems.map(item => (
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
            </div>
          )}

          {/* User Profile Section - Polar Style */}
          <div className="mt-auto px-0 pb-0 relative">
            {/* Dropdown Menu (Opens Upwards) */}
            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className={cn(
                    "absolute bottom-full mb-2 bg-card rounded-xl shadow-lg overflow-hidden z-50",
                    isCollapsed ? "left-0 right-0" : "left-0 right-0"
                  )}
                >
                  <div className="p-0 space-y-1">
                    <Link
                      to="/user-settings"
                      className={cn(
                        "flex items-center text-sm text-fg-muted hover:text-fg hover:bg-bg-hover rounded-lg transition-all duration-200",
                        isCollapsed ? "gap-0 px-0 h-10 justify-center" : "gap-3 px-4 h-10"
                      )}
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <Settings className="w-4 h-4 flex-shrink-0" />
                      {!isCollapsed && <span className="font-medium">Settings</span>}
                    </Link>
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className={cn(
                        "w-full flex items-center justify-start text-sm text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200",
                        isCollapsed ? "gap-0 px-0 h-10 justify-center" : "gap-3 px-4 h-10"
                      )}
                    >
                      <LogOut className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && <span className="font-medium">Logout</span>}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              variant="ghost"
              className={cn(
                "w-full border-t border-border bg-bg transition-all duration-200 cursor-pointer h-auto justify-start",
                isCollapsed ? "py-3 px-0 border-0 bg-transparent flex items-center justify-center" : "py-3 px-4 mx-2",
                showProfileDropdown ? "border-t-primary" : ""
              )}
            >
              <div className={cn(
                "flex items-center gap-3",
                isCollapsed && "justify-center"
              )}>
                <div className={cn(
                  "rounded-full bg-bg flex items-center justify-center flex-shrink-0 overflow-hidden",
                  isCollapsed ? "w-14 h-14" : "w-8 h-8"
                )}>
                  {userAvatar}
                </div>

                {!isCollapsed && (
                  <div className="flex-1 min-w-0 overflow-hidden text-left">
                    <p className="text-sm font-medium text-fg truncate">{userDisplayName}</p>
                    <p className="text-xs text-fg-muted truncate">{secondaryUserInfo}</p>
                  </div>
                )}
              </div>
            </Button>
          </div>
        </div>
      </motion.aside>


      {/* External Tooltips for Collapsed Sidebar */}
      <AnimatePresence>
        {hoveredTooltip && isCollapsed && (
          <motion.div
            {...ANIMATION_VARIANTS.tooltip}
            transition={transitionConfigs.fast}
            className={`fixed bg-card border border-border text-fg rounded-lg pointer-events-none z-[100] shadow-xl ${hoveredTooltip.isUser ? 'px-4 py-3 text-xs max-w-[250px]' : 'px-3 py-2 text-sm whitespace-nowrap'
              }`}
            style={{
              top: hoveredTooltip.position.top,
              left: hoveredTooltip.position.left
            }}
          >
            {hoveredTooltip.isUser ? (
              <div>
                <div className="font-medium mb-1 text-fg tracking-tight">
                  {hoveredTooltip.label}
                </div>
                <div className="text-fg-muted text-xs leading-relaxed space-y-0.5">
                  <div>{hoveredTooltip.userInfo?.role as React.ReactNode} at {hoveredTooltip.userInfo?.company as React.ReactNode}</div>
                  <div className="text-fg-muted">{hoveredTooltip.userInfo?.email as React.ReactNode}</div>
                </div>
              </div>
            ) : (
              <>
                {hoveredTooltip.label}
                {hoveredTooltip.badge && <span className="ml-1 text-primary">({hoveredTooltip.badge})</span>}
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              {...ANIMATION_VARIANTS.modal}
              transition={transitionConfigs.normal}
              className="bg-card border border-border rounded-xl p-6 max-w-md mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-fg tracking-tight">Keyboard Shortcuts</h3>
                <Button
                  onClick={() => setShowShortcuts(false)}
                  variant="ghost"
                  size="icon"
                  className="text-fg-muted hover:text-fg"
                  aria-label="Close shortcuts help"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6 text-sm">
                <div>
                  <h4 className="text-fg font-medium mb-3 tracking-tight">Navigation</h4>
                  <div className="space-y-2 text-fg-muted">
                    <div className="flex justify-between items-center">
                      <span>Dashboard</span>
                      <kbd className="px-2 py-1 bg-bg-raised border border-border rounded text-xs font-mono text-fg">Alt+1</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Customers</span>
                      <kbd className="px-2 py-1 bg-bg-raised border border-border rounded text-xs font-mono text-fg">Alt+2</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Catalog</span>
                      <kbd className="px-2 py-1 bg-bg-raised border border-border rounded text-xs font-mono text-fg">Alt+3</kbd>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-fg font-medium mb-3">Sidebar</h4>
                  <div className="space-y-2 text-fg-muted">
                    <div className="flex justify-between items-center">
                      <span>Toggle Sidebar</span>
                      <kbd className="px-2 py-1 bg-bg-raised border border-border rounded text-xs font-mono text-fg">Ctrl+Shift+B</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Arrow Navigation</span>
                      <kbd className="px-2 py-1 bg-bg-raised border border-border rounded text-xs font-mono text-fg">β†‘β†“</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Select Item</span>
                      <kbd className="px-2 py-1 bg-bg-raised border border-border rounded text-xs font-mono text-fg">Enter</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Close/Escape</span>
                      <kbd className="px-2 py-1 bg-bg-raised border border-border rounded text-xs font-mono text-fg">Esc</kbd>
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
        className={`relative z-10 ${isMobileView ? 'mt-14 p-0' : 'py-2 pl-2'}`}
        style={isMobileView ? {
          paddingBottom: 'max(1rem, var(--safe-area-inset-bottom))'
        } : undefined}
      >
        <div className={`bg-[#101011] overflow-y-auto scrollbar-thin ${isMobileView ? 'min-h-[calc(100vh-4rem)]' : 'h-[calc(100vh-1rem)] rounded-xl'}`}>
          <div className={`max-w-[1400px] mx-auto ${isMobileView ? 'px-4 py-4' : 'px-6 py-6'}`}>
            {children}
          </div>
        </div>
      </motion.main>

    </div>
  )
})

DashboardLayout.displayName = 'DashboardLayout'

