import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, LogOut, User } from 'lucide-react'
import { memo, useCallback } from 'react'
import { Link } from 'react-router-dom'

import { ANIMATION_VARIANTS } from '@/shared/layout/DashboardLayout/constants'
import { PlainButton } from '@/shared/ui/Button'
import { cn } from '@/shared/utils/cn'

/**
 * Type for transition configs
 */
type TransitionConfig = {
  fast: { duration: number }
  normal: { duration: number }
  sidebar: { duration: number; ease: 'easeOut' }
}

/**
 * User data shape
 */
interface UserData {
  firstName?: string
  lastName?: string
  email: string
  role?: string
}

/**
 * Props for the SidebarFooter component
 */
export interface SidebarFooterProps {
  isCollapsed: boolean
  showProfileDropdown: boolean
  setShowProfileDropdown: (show: boolean) => void
  user: UserData | null
  companyName: string
  isActive: (href: string) => boolean
  handleLogout: () => void
  handleUserTooltipEnter: (event: React.MouseEvent) => void
  handleTooltipEnter: (itemId: string, label: string, badge: string | undefined, event: React.MouseEvent) => void
  handleTooltipLeave: () => void
  profileDropdownRef: React.RefObject<HTMLDivElement>
  transitionConfigs: TransitionConfig
}

/**
 * Helper function to get user initials
 */
const getInitials = (firstName?: string, lastName?: string): string => {
  const first = firstName && firstName !== 'undefined' ? firstName.trim() : ''
  const last = lastName && lastName !== 'undefined' ? lastName.trim() : ''
  
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase()
  if (first) return first.slice(0, 2).toUpperCase()
  if (last) return last.slice(0, 2).toUpperCase()
  return 'U'
}

/**
 * Helper function to get user display name
 */
const getUserDisplayName = (user: UserData | null): string => {
  if (!user) return 'User'
  const firstName = user.firstName && user.firstName !== 'undefined' ? user.firstName.trim() : ''
  const lastName = user.lastName && user.lastName !== 'undefined' ? user.lastName.trim() : ''
  
  if (firstName && lastName) return `${firstName} ${lastName}`
  if (firstName) return firstName
  if (user.email) return user.email
  return 'User'
}

/**
 * SidebarFooter Component
 * 
 * Renders the footer section of the sidebar with:
 * - User profile display (avatar, name, company)
 * - Expandable dropdown menu with:
 *   - User Settings link
 *   - Logout button
 * - Tooltips in collapsed mode
 * - Responsive layout
 * 
 * @component
 */
export const SidebarFooter = memo<SidebarFooterProps>(({
  isCollapsed,
  showProfileDropdown,
  setShowProfileDropdown,
  user,
  companyName,
  isActive,
  handleLogout,
  handleUserTooltipEnter,
  handleTooltipEnter,
  handleTooltipLeave,
  profileDropdownRef,
  transitionConfigs
}) => {
  const handleDropdownToggle = useCallback(() => {
    setShowProfileDropdown(!showProfileDropdown)
  }, [showProfileDropdown, setShowProfileDropdown])

  const handleUserSettingsClick = useCallback(() => {
    setShowProfileDropdown(false)
  }, [setShowProfileDropdown])

  const handleLogoutClick = useCallback(() => {
    setShowProfileDropdown(false)
    handleLogout()
  }, [setShowProfileDropdown, handleLogout])

  return (
    <div className="absolute bottom-0 left-0 right-0">
      {/* Expandable Profile Menu Items */}
      <AnimatePresence>
        {showProfileDropdown && (
          <motion.div
            {...ANIMATION_VARIANTS.expandCollapse}
            transition={transitionConfigs.normal}
            className={`overflow-hidden border-t border-[#262626] mx-2 space-y-1.5 md:space-y-2 lg:space-y-1.5 ${isCollapsed ? 'px-2 py-2' : 'px-4 md:px-6 lg:px-4 py-3 md:py-4 lg:py-3'}`}
          >
            <Link
              to="/user-settings"
              onClick={handleUserSettingsClick}
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
                  <span className="font-normal whitespace-nowrap text-sm md:text-base lg:text-sm">User Settings</span>
                </div>
              )}
            </Link>

            <PlainButton
              onClick={handleLogoutClick}
              onMouseEnter={(e) => handleTooltipEnter('logout', 'Logout', undefined, e)}
              onMouseLeave={handleTooltipLeave}
              className={cn(
                'group relative flex items-center rounded-lg transition-all duration-200 h-9 w-full',
                'text-white/60 hover:text-[#D417C8]',
                isCollapsed ? 'justify-center px-0' : 'px-6'
              )}
              aria-label="Logout"
              unstyled
            >
              <LogOut className={`w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 ${isCollapsed ? '' : 'mr-2.5 md:mr-3 lg:mr-2.5'} flex-shrink-0`} />

              {!isCollapsed && (
                <div className="overflow-hidden">
                  <span className="font-normal whitespace-nowrap text-sm md:text-base lg:text-sm">Logout</span>
                </div>
              )}
            </PlainButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Divider */}
      <div className="border-t border-white/10 mx-2" />
      
      {/* User Profile */}
      <div className={cn('py-2', isCollapsed ? 'px-2' : 'px-4 md:px-6 lg:px-4')}>
        <div className="relative" ref={profileDropdownRef}>
          <PlainButton
            onClick={handleDropdownToggle}
            onMouseEnter={handleUserTooltipEnter}
            onMouseLeave={handleTooltipLeave}
            className={cn(
              'group relative flex items-center rounded-lg transition-all duration-200 w-full text-white/60 hover:text-white',
              isCollapsed ? 'justify-center px-0 h-9' : 'px-3 py-2.5 md:py-2 lg:py-1.5',
              showProfileDropdown && 'text-white'
            )}
            aria-label="User profile menu"
            aria-expanded={showProfileDropdown}
            unstyled
          >
            {/* User Avatar */}
            <div className={`flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`}>
              {user ? (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-normal tracking-tight">
                  {getInitials(user.firstName, user.lastName)}
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-white/60" />
                </div>
              )}
            </div>

            {/* User Info - Only show when expanded */}
            {!isCollapsed && user && (
              <div className="flex-1 text-left overflow-hidden">
                <div className="font-normal text-sm text-white truncate tracking-tight">
                  {getUserDisplayName(user)}
                </div>
                <div className="text-xs text-white/60 truncate">
                  {companyName}
                </div>
              </div>
            )}

            {/* Dropdown Arrow - Only show when expanded */}
            {!isCollapsed && (
              <ChevronUp 
                className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
                  showProfileDropdown ? 'rotate-0' : 'rotate-180'
                }`} 
              />
            )}
          </PlainButton>
        </div>
      </div>
    </div>
  )
})

SidebarFooter.displayName = 'SidebarFooter'

