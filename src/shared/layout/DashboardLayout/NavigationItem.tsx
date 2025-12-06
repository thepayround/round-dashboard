import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { memo } from 'react'
import { Link } from 'react-router-dom'

import { ANIMATION_VARIANTS } from '@/shared/layout/DashboardLayout/constants'
import type { NavItem } from '@/shared/layout/DashboardLayout/types'
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
 * Props for the NavigationItem component
 */
export interface NavigationItemProps {
  item: NavItem
  isCollapsed: boolean
  expandedItems: string[]
  isParentActive: (item: NavItem) => boolean
  isActive: (href: string, exact?: boolean) => boolean
  toggleExpanded: (itemId: string) => void
  handleTooltipEnter: (itemId: string, label: string, badge: string | undefined, event: React.MouseEvent) => void
  handleTooltipLeave: () => void
  getAllNavItems: (NavItem & { isSubItem?: boolean; parentId?: string })[]
  focusedIndex: number
  isKeyboardNavigating: boolean
  transitionConfigs: TransitionConfig
}

/**
 * NavigationItem Component
 *
 * Renders a single navigation item with support for:
 * - Collapsible sub-items
 * - Active state highlighting
 * - Keyboard navigation
 * - Tooltips in collapsed mode
 * - Badges for notifications
 *
 * @component
 */
export const NavigationItem = memo<NavigationItemProps>(({
  item,
  isCollapsed,
  expandedItems,
  isParentActive,
  isActive,
  toggleExpanded,
  handleTooltipEnter,
  handleTooltipLeave,
  getAllNavItems,
  focusedIndex,
  isKeyboardNavigating,
  transitionConfigs
}) => {
  const isExpanded = expandedItems.includes(item.id)
  const itemIsActive = isParentActive(item)
  const isFocused = isKeyboardNavigating && focusedIndex === getAllNavItems.findIndex(navItem => navItem.id === item.id)

  // Base styles for all nav items - modern slim design
  const baseStyles = cn(
    'group relative flex items-center w-full rounded transition-colors',
    'text-xs font-medium',
    'outline-none focus-visible:ring-1 focus-visible:ring-ring',
    isCollapsed ? 'h-8 justify-center' : 'h-8 px-2.5 gap-2.5',
    isFocused && 'ring-1 ring-ring'
  )

  // Active/hover state styles - dark modern theme
  const stateStyles = itemIsActive
    ? 'bg-sidebar-accent text-sidebar-foreground'
    : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'

  return (
    <div className="space-y-1">
      {/* Main Navigation Item */}
      {item.subItems ? (
        // Parent item with sub-items (expandable)
        <button
          type="button"
          onClick={(e: React.MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            toggleExpanded(item.id)
          }}
          onMouseEnter={(e: React.MouseEvent) => handleTooltipEnter(item.id, item.label, item.badge, e)}
          onMouseLeave={handleTooltipLeave}
          className={cn(baseStyles, stateStyles)}
          aria-expanded={isExpanded}
          aria-haspopup="menu"
          aria-label={`${item.label}${item.badge ? ` (${item.badge})` : ''} menu`}
          tabIndex={isKeyboardNavigating ? -1 : 0}
        >
          <item.icon className="h-3.5 w-3.5 shrink-0" />

          {!isCollapsed && (
            <>
              <span className="flex-1 text-left truncate">{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-primary text-primary-foreground rounded-full">
                  {item.badge}
                </span>
              )}
              <ChevronDown
                className={cn(
                  'h-3 w-3 shrink-0 transition-transform duration-200',
                  isExpanded && 'rotate-180'
                )}
              />
            </>
          )}
        </button>
      ) : (
        // Leaf item (direct link)
        <Link
          to={item.href}
          onMouseEnter={(e: React.MouseEvent) => handleTooltipEnter(item.id, item.label, item.badge, e)}
          onMouseLeave={handleTooltipLeave}
          className={cn(baseStyles, stateStyles)}
          aria-label={`${item.label}${item.badge ? ` (${item.badge})` : ''}`}
          tabIndex={isKeyboardNavigating ? -1 : 0}
        >
          <item.icon className="h-3.5 w-3.5 shrink-0" />

          {!isCollapsed && (
            <>
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-primary text-primary-foreground rounded-full">
                  {item.badge}
                </span>
              )}
            </>
          )}
        </Link>
      )}

      {/* Sub-items */}
      <AnimatePresence>
        {item.subItems && isExpanded && (
          <motion.div
            {...ANIMATION_VARIANTS.expandCollapse}
            transition={transitionConfigs.normal}
            className={cn(
              'overflow-hidden',
              isCollapsed
                ? 'flex flex-col items-center space-y-0.5 pt-1'
                : 'pl-3 space-y-0.5 border-l border-sidebar-border ml-4'
            )}
          >
            {item.subItems.map((subItem) => {
              const subItemIsActive = isActive(subItem.href, subItem.exact)

              return (
                <Link
                  key={subItem.id}
                  to={subItem.href}
                  onMouseEnter={(e) => isCollapsed && handleTooltipEnter(subItem.id, subItem.label, undefined, e)}
                  onMouseLeave={isCollapsed ? handleTooltipLeave : undefined}
                  className={cn(
                    'group relative flex items-center rounded transition-colors',
                    'text-xs font-medium',
                    'outline-none focus-visible:ring-1 focus-visible:ring-ring',
                    isCollapsed
                      ? 'h-7 w-7 justify-center'
                      : 'h-7 px-2 gap-2',
                    subItemIsActive
                      ? 'bg-sidebar-accent text-sidebar-foreground'
                      : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  )}
                >
                  <subItem.icon className="h-3 w-3 shrink-0" />

                  {!isCollapsed && (
                    <span className="truncate">{subItem.label}</span>
                  )}
                </Link>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

NavigationItem.displayName = 'NavigationItem'
