import { motion, AnimatePresence } from 'framer-motion'
import { PanelLeft, PanelLeftClose, LogOut, X, Settings, ChevronUp } from 'lucide-react'
import { memo } from 'react'
import { Link } from 'react-router-dom'

import WhiteLogo from '../../assets/logos/white-logo.svg?url'

import { mainNavigationItems, bottomNavigationItems } from '@/shared/config/navigation.config'
import { NavigationItem } from '@/shared/layout/DashboardLayout/NavigationItem'
import { LAYOUT_CONSTANTS, ANIMATION_VARIANTS } from '@/shared/layout/DashboardLayout/constants'
import type { DashboardLayoutProps } from '@/shared/layout/DashboardLayout/types'
import { useDashboardLayoutController } from '@/shared/layout/DashboardLayout/useDashboardLayoutController'
import { Button } from '@/shared/ui/shadcn/button'
import { cn } from '@/shared/utils/cn'

// Mobile Header Component
const MobileHeader = memo(({
  onMenuClick,
  isMenuOpen
}: {
  onMenuClick: () => void
  isMenuOpen: boolean
}) => (
  <header
    className="fixed top-0 left-0 right-0 h-14 bg-background border-b border-border z-50 flex items-center justify-between px-4"
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
      className="text-muted-foreground hover:text-foreground"
      aria-label={isMenuOpen ? "Close sidebar" : "Open sidebar"}
    >
      <PanelLeft className="h-4 w-4" />
    </Button>

    <Link to="/dashboard" className="flex items-center">
      <img src={WhiteLogo} alt="Round Logo" className="h-7 w-7" />
    </Link>

    {/* Empty div for spacing to center the logo */}
    <div className="w-10 h-10" />
  </header>
))
MobileHeader.displayName = 'MobileHeader'

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
      className="min-h-screen relative bg-background"
      style={{
        '--sidebar-width': isCollapsed ? '64px' : '200px'
      } as React.CSSProperties}
    >
      {/* Skip to main content link for accessibility */}
      <Button
        type="button"
        onClick={handleSkipToMainContent}
        variant="default"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[999] focus:px-4 focus:py-2 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
      >
        Skip to main content
      </Button>

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
        className={cn(
          'fixed left-0 top-0 h-full flex flex-col',
          'bg-zinc-950/95 border-r border-zinc-800/50',
          isMobileView ? 'z-[70] shadow-2xl' : 'z-auto'
        )}
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
          "flex-shrink-0 h-12 flex items-center",
          isCollapsed ? "justify-center px-2" : "justify-between px-3"
        )}>
          <Link
            to="/dashboard"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img src={WhiteLogo} alt="Round Logo" className="h-6 w-6" />
          </Link>

          {/* Collapse/Expand Button */}
          {!isMobileView && !isCollapsed && (
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {/* Expand Button - Only visible when collapsed */}
        {!isMobileView && isCollapsed && (
          <div className="flex-shrink-0 py-1 flex items-center justify-center">
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
              aria-label="Expand sidebar"
            >
              <PanelLeft className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {/* Mobile close button */}
        {isMobileView && !isCollapsed && (
          <div className="absolute top-4 right-4">
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden pt-2">
          {/* Navigation */}
          <nav
            ref={navigationRef}
            className={cn(
              'flex-1 space-y-0.5 overflow-y-auto overflow-x-hidden',
              isMobileView ? 'px-2' : (isCollapsed ? 'px-2' : 'px-2')
            )}
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
            <div className={cn(
              'space-y-0.5 pt-2 border-t border-zinc-800/50',
              isMobileView ? 'px-2' : 'px-2'
            )}>
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

          {/* User Profile Section */}
          <div className="mt-auto relative">
            {/* Dropdown Menu (Opens Upwards) */}
            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className={cn(
                    "absolute bottom-full mb-1 left-2 right-2 bg-zinc-900 border border-zinc-800 rounded-md shadow-lg overflow-hidden z-50"
                  )}
                >
                  <div className="p-1">
                    <Link
                      to="/user-settings"
                      className={cn(
                        "flex items-center gap-2 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors",
                        isCollapsed && "justify-center px-2"
                      )}
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <Settings className="h-3.5 w-3.5 shrink-0" />
                      {!isCollapsed && <span>Settings</span>}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={cn(
                        "w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-500/10 rounded transition-colors",
                        isCollapsed && "justify-center px-2"
                      )}
                    >
                      <LogOut className="h-3.5 w-3.5 shrink-0" />
                      {!isCollapsed && <span>Logout</span>}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mx-2 border-t border-zinc-800/50" />
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className={cn(
                "w-full flex items-center gap-2 hover:bg-zinc-800/30 transition-colors",
                isCollapsed ? "p-2 justify-center" : "px-2 py-2"
              )}
            >
              <div className={cn(
                "rounded-full bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden",
                isCollapsed ? "h-8 w-8" : "h-7 w-7"
              )}>
                {userAvatar}
              </div>

              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs font-medium text-zinc-200 truncate">{userDisplayName}</p>
                    <p className="text-[10px] text-zinc-500 truncate">{secondaryUserInfo}</p>
                  </div>
                  <ChevronUp
                    className={cn(
                      "h-3 w-3 shrink-0 text-zinc-500 transition-transform duration-200",
                      showProfileDropdown ? "rotate-0" : "rotate-180"
                    )}
                  />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* External Tooltips for Collapsed Sidebar */}
      <AnimatePresence>
        {hoveredTooltip && isCollapsed && (
          <motion.div
            {...ANIMATION_VARIANTS.tooltip}
            transition={transitionConfigs.fast}
            className={cn(
              'fixed bg-popover border border-border text-popover-foreground rounded-md pointer-events-none z-[100] shadow-md',
              hoveredTooltip.isUser ? 'px-3 py-2 text-xs max-w-[200px]' : 'px-2 py-1.5 text-sm whitespace-nowrap'
            )}
            style={{
              top: hoveredTooltip.position.top,
              left: hoveredTooltip.position.left
            }}
          >
            {hoveredTooltip.isUser ? (
              <div>
                <div className="font-medium mb-1">
                  {hoveredTooltip.label}
                </div>
                <div className="text-muted-foreground text-xs space-y-0.5">
                  <div>{hoveredTooltip.userInfo?.role as React.ReactNode} at {hoveredTooltip.userInfo?.company as React.ReactNode}</div>
                  <div>{hoveredTooltip.userInfo?.email as React.ReactNode}</div>
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
              className="bg-card border border-border rounded-lg p-6 max-w-md mx-4 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
                <Button
                  onClick={() => setShowShortcuts(false)}
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Close shortcuts help"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6 text-sm">
                <div>
                  <h4 className="font-medium mb-3">Navigation</h4>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex justify-between items-center">
                      <span>Dashboard</span>
                      <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono">Alt+1</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Customers</span>
                      <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono">Alt+2</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Catalog</span>
                      <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono">Alt+3</kbd>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Sidebar</h4>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex justify-between items-center">
                      <span>Toggle Sidebar</span>
                      <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono">Ctrl+Shift+B</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Arrow Navigation</span>
                      <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono">↑↓</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Select Item</span>
                      <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono">Enter</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Close/Escape</span>
                      <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono">Esc</kbd>
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
        className={cn(
          'relative z-10',
          isMobileView ? 'mt-14 p-0' : 'py-2'
        )}
        style={isMobileView ? {
          paddingBottom: 'max(1rem, var(--safe-area-inset-bottom))'
        } : undefined}
      >
        <div className={cn(
          'bg-card overflow-y-auto',
          isMobileView ? 'min-h-[calc(100vh-4rem)]' : 'h-[calc(100vh-1rem)] rounded-xl border border-border'
        )}>
          <div className={cn(
            'max-w-[1400px] mx-auto',
            isMobileView ? 'px-4 py-4' : 'px-6 py-6'
          )}>
            {children}
          </div>
        </div>
      </motion.main>
    </div>
  )
})

DashboardLayout.displayName = 'DashboardLayout'
