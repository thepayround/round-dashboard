import { motion, AnimatePresence } from 'framer-motion'
import { PanelLeft, PanelLeftClose, User, LogOut, X } from 'lucide-react'
import { memo } from 'react'
import { Link } from 'react-router-dom'

import ColorLogo from '@/assets/logos/color-logo.svg'
import { mainNavigationItems, bottomNavigationItems } from '@/shared/config/navigation.config'
import { Breadcrumb } from '@/shared/layout/Breadcrumb'
import { NavigationItem } from '@/shared/layout/DashboardLayout/NavigationItem'
import { LAYOUT_CONSTANTS, ANIMATION_VARIANTS } from '@/shared/layout/DashboardLayout/constants'
import type { DashboardLayoutProps } from '@/shared/layout/DashboardLayout/types'
import { useDashboardLayoutController } from '@/shared/layout/DashboardLayout/useDashboardLayoutController'
import { Button, IconButton, UserButton } from '@/shared/ui/Button'
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
    handleUserTooltipEnter,
    hoveredTooltip,
    showProfileDropdown,
    setShowProfileDropdown,
    profileDropdownRef,
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
      className="min-h-screen relative bg-[#070708]"
      style={{
        '--sidebar-width': isCollapsed ? '80px' : '280px'
      } as React.CSSProperties}
    >
      {/* Skip to main content link for accessibility */}
      <Button
        type="button"
        onClick={handleSkipToMainContent}
        variant="primary"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[999] focus:px-4 focus:py-2 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#070708]"
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
                <div className="flex flex-col items-center py-5 space-y-4">
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

          {/* Bottom Navigation Items - Include in main navigation */}
          {resolvedBottomNavItems.map(item => (
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
                    isCollapsed ? 'justify-center px-0' : 'px-6'
                  )}
                  aria-label="User Settings"
                >
                  <User className={`w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 ${isCollapsed ? '' : 'mr-2.5 md:mr-3 lg:mr-2.5'} flex-shrink-0`} />
                  {!isCollapsed && (
                    <div className="overflow-hidden">
                      <span className="font-normal whitespace-nowrap text-sm md:text-base lg:text-sm">
                        User Settings
                      </span>
                    </div>
                  )}
                </Link>

                <Button
                  type="button"
                  variant="link"
                  icon={LogOut}
                  iconPosition="left"
                  onClick={() => {
                    setShowProfileDropdown(false)
                    handleLogout()
                  }}
                  onMouseEnter={(e) => handleTooltipEnter('logout', 'Logout', undefined, e)}
                  onMouseLeave={handleTooltipLeave}
                  className={cn(
                    'group relative rounded-lg transition-all duration-200 h-9',
                    isCollapsed ? 'justify-center px-0' : 'px-6'
                  )}
                  aria-label="Logout"
                >
                  {!isCollapsed ? 'Logout' : ''}
                </Button>
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
                      <kbd className="px-2 py-1 bg-white/20 rounded text-xs">β†‘β†“</kbd>
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

