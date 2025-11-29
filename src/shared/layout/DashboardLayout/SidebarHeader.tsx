import { PanelLeft, PanelLeftClose } from 'lucide-react'
import { memo } from 'react'
import { Link } from 'react-router-dom'

import ColorLogo from '@/assets/logos/color-logo.svg'
import { Button } from '@/shared/ui/shadcn/button'
import { cn } from '@/shared/utils/cn'

/**
 * Logo text component with gradient colors
 */
const LogoText = memo(({ className = "text-xl" }: { className?: string }) => (
  <div className="flex items-center space-x-0.5">
    <span className={cn("text-primary font-light tracking-wider transition-all duration-300", className)}>R</span>
    <span className={cn("text-[#BD2CD0] font-light tracking-wider transition-all duration-300", className)}>O</span>
    <span className={cn("text-accent font-light tracking-wider transition-all duration-300", className)}>U</span>
    <span className={cn("text-secondary font-light tracking-wider transition-all duration-300", className)}>N</span>
    <span className={cn("text-secondary font-light tracking-wider transition-all duration-300", className)}>D</span>
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
            <div className="flex items-center justify-between pl-4 pr-6 pt-4 pb-2">
              <Link
                to="/dashboard"
                className="flex items-center space-x-2.5 transition-colors duration-200 cursor-pointer min-w-0"
              >
                <img src={ColorLogo} alt="Round Logo" className="w-8 h-8 flex-shrink-0" />
                <LogoText />
              </Link>
              
              {/* Collapse button at same height as logo */}
              <Button
                onClick={toggleSidebar}
                variant="ghost"
                size="icon"
                aria-label="Collapse sidebar"
                title="Collapse sidebar (Ctrl+Shift+B)"
                className="flex-shrink-0"
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            // Collapsed: Logo on top, button below
            <div className="flex flex-col items-center pt-4 pb-2 space-y-4">
              <Link
                to="/dashboard"
                className="flex items-center justify-center transition-colors duration-200 cursor-pointer"
              >
                <img src={ColorLogo} alt="Round Logo" className="w-8 h-8" />
              </Link>
              
              {/* Expand button below logo */}
              <Button
                onClick={toggleSidebar}
                variant="ghost"
                size="icon"
                aria-label="Expand sidebar"
                title="Expand sidebar (Ctrl+Shift+B)"
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Divider below logo */}
        <div className="border-t border-border mx-2"></div>
      </>
    )}

    {/* Mobile Header inside sidebar - Same as desktop */}
    {isMobileView && !isCollapsed && (
      <>
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between pl-4 pr-6 pt-4 pb-2">
            <Link
              to="/dashboard"
              className="flex items-center space-x-2.5 transition-colors duration-200 cursor-pointer min-w-0"
            >
              <img src={ColorLogo} alt="Round Logo" className="w-8 h-8 flex-shrink-0" />
              <LogoText />
            </Link>
            
            {/* Close button - same as desktop collapse button */}
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="icon"
              aria-label="Close sidebar"
              title="Close sidebar"
              className="flex-shrink-0"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Divider below logo */}
        <div className="border-t border-border mx-2"></div>
      </>
    )}
  </>
))

SidebarHeader.displayName = 'SidebarHeader'

