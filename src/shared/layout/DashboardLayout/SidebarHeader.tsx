import { PanelLeft, PanelLeftClose } from 'lucide-react'
import { memo } from 'react'
import { Link } from 'react-router-dom'

import ColorLogo from '@/assets/logos/color-logo.svg'
import { IconButton } from '@/shared/ui/Button'
import { cn } from '@/shared/utils/cn'

/**
 * Logo text component with gradient colors
 */
const LogoText = memo(({ className = "text-xl" }: { className?: string }) => (
  <div className="flex items-center space-x-0.5">
    <span className={cn("text-[#D417C8] font-light tracking-wider transition-all duration-300", className)}>R</span>
    <span className={cn("text-[#BD2CD0] font-light tracking-wider transition-all duration-300", className)}>O</span>
    <span className={cn("text-[#7767DA] font-light tracking-wider transition-all duration-300", className)}>U</span>
    <span className={cn("text-[#32A1E4] font-light tracking-wider transition-all duration-300", className)}>N</span>
    <span className={cn("text-[#14BDEA] font-light tracking-wider transition-all duration-300", className)}>D</span>
  </div>
))
LogoText.displayName = 'LogoText'

/**
 * Props for the SidebarHeader component
 */
export interface SidebarHeaderProps {
  isCollapsed: boolean
  isMobileView: boolean
  toggleSidebar: () => void
}

/**
 * SidebarHeader Component
 * 
 * Renders the header section of the sidebar with:
 * - Logo (color logo + text)
 * - Collapse/Expand button
 * - Responsive layout (different for mobile vs desktop)
 * - Keyboard shortcut support (Ctrl+Shift+B)
 * 
 * @component
 */
export const SidebarHeader = memo<SidebarHeaderProps>(({ 
  isCollapsed, 
  isMobileView, 
  toggleSidebar 
}) => (
  <>
    {/* Desktop Header */}
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
                size="md"
                aria-label="Collapse sidebar"
                title="Collapse sidebar (Ctrl+Shift+B)"
                className="flex-shrink-0"
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
                size="md"
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
              size="md"
              aria-label="Close sidebar"
              title="Close sidebar"
              className="flex-shrink-0"
            />
          </div>
        </div>

        {/* Divider below logo */}
        <div className="border-t border-white/10 mx-2"></div>
      </>
    )}
  </>
))

SidebarHeader.displayName = 'SidebarHeader'

