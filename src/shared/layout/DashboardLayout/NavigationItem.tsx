import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { memo } from 'react'
import { Link } from 'react-router-dom'

import { ANIMATION_VARIANTS } from '@/shared/layout/DashboardLayout/constants'
import type { NavItem } from '@/shared/layout/DashboardLayout/types'
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
 * Props for the NavigationItem component
 */
export interface NavigationItemProps {
  item: NavItem
  isCollapsed: boolean
  expandedItems: string[]
  isParentActive: (item: NavItem) => boolean
  isActive: (href: string) => boolean
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
}) => (
  <div>
    {/* Main Navigation Item */}
    {item.subItems ? (
      <PlainButton
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          toggleExpanded(item.id)
        }}
        onMouseEnter={(e) => handleTooltipEnter(item.id, item.label, item.badge, e)}
        onMouseLeave={handleTooltipLeave}
        className={cn(
          'group relative flex items-center rounded-md transition-all duration-200 h-9 w-full',
          'outline-none focus-visible:ring-1 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-[#070708]',
          isParentActive(item)
            ? 'bg-primary/10 text-white border border-primary/20'
            : 'text-white/60 hover:text-white',
          isCollapsed ? 'justify-center px-0' : 'px-3',
          isKeyboardNavigating && focusedIndex === getAllNavItems.findIndex(navItem => navItem.id === item.id) && 'ring-1 ring-ring'
        )}
        aria-expanded={expandedItems.includes(item.id)}
        aria-haspopup="menu"
        aria-label={`${item.label}${item.badge ? ` (${item.badge})` : ''} menu`}
        tabIndex={isKeyboardNavigating ? -1 : 0}
        unstyled
      >
        <item.icon className={`w-4 h-4 ${isCollapsed ? '' : 'mr-4'} flex-shrink-0`} />

        {!isCollapsed && (
          <div className="flex items-center justify-between flex-1 overflow-hidden">
            <span className="font-geist font-medium whitespace-nowrap text-base leading-5">{item.label}</span>
            <div className="inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors duration-200">
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  expandedItems.includes(item.id) ? 'transform rotate-180' : ''
                }`}
              />
            </div>
          </div>
        )}
        
        {!isCollapsed && item.badge && (
          <span className="ml-2 px-2 py-0.5 text-xs font-normal tracking-tight bg-primary text-white rounded-full">
            {item.badge}
          </span>
        )}
      </PlainButton>
    ) : (
      <Link
        to={item.href}
        onMouseEnter={(e) => handleTooltipEnter(item.id, item.label, item.badge, e)}
        onMouseLeave={handleTooltipLeave}
        className={cn(
          'group relative flex items-center rounded-md transition-all duration-200 h-9',
          'outline-none focus-visible:ring-1 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-[#070708]',
          isParentActive(item)
            ? 'bg-primary/10 text-white border border-primary/20'
            : 'text-white/60 hover:text-white',
          isCollapsed ? 'justify-center px-0' : 'px-3',
          isKeyboardNavigating && focusedIndex === getAllNavItems.findIndex(navItem => navItem.id === item.id) && 'ring-1 ring-ring'
        )}
        aria-label={`${item.label}${item.badge ? ` (${item.badge})` : ''}`}
        tabIndex={isKeyboardNavigating ? -1 : 0}
      >
        <item.icon className={cn(
          'w-4 h-4 flex-shrink-0',
          !isCollapsed && 'mr-4'
        )} />

        {!isCollapsed && (
          <div className="flex items-center justify-between flex-1 overflow-hidden">
            <span className="font-geist font-medium whitespace-nowrap text-base leading-5">{item.label}</span>
            {item.badge && (
              <span className="ml-2 px-2 py-0.5 text-xs font-normal tracking-tight bg-primary text-white rounded-full">
                {item.badge}
              </span>
            )}
          </div>
        )}
      </Link>
    )}

    {/* Sub-items */}
    <AnimatePresence>
      {item.subItems && expandedItems.includes(item.id) && (
        <motion.div
          {...ANIMATION_VARIANTS.expandCollapse}
          transition={transitionConfigs.normal}
          className={`mt-1 ${
            isCollapsed 
              ? 'flex flex-col items-center space-y-1 py-1' 
              : 'ml-6 space-y-1 border-l-2 border-pink-500/20 py-2'
          }`}
        >
          {isCollapsed && (
            <div className="w-8 h-px bg-pink-500/20 mb-1" />
          )}

          {item.subItems.map((subItem, index) => (
            <Link
              key={subItem.id}
              to={subItem.href}
              onMouseEnter={(e) => isCollapsed && handleTooltipEnter(subItem.id, subItem.label, undefined, e)}
              onMouseLeave={isCollapsed ? handleTooltipLeave : undefined}
              className={cn(
                'group relative flex items-center rounded-md transition-all duration-200',
                'outline-none focus-visible:ring-1 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-[#070708]',
                isActive(subItem.href)
                  ? 'bg-primary/10 text-white border border-primary/20'
                  : 'text-white/60 hover:text-white',
                isCollapsed
                  ? 'justify-center w-8 h-8 px-0'
                  : 'h-8 px-4 mx-2'
              )}
            >
              <subItem.icon className={`flex-shrink-0 transition-all duration-200 ${
                isCollapsed
                  ? 'w-3.5 h-3.5'
                  : 'w-3.5 h-3.5 mr-4'
              }`} />

              {!isCollapsed && (
                <span className="font-geist font-medium text-base leading-5 text-white/60 group-hover:text-white transition-colors duration-200 whitespace-nowrap">{subItem.label}</span>
              )}

              {/* Connection indicator for collapsed mode */}
              {isCollapsed && index !== (item.subItems?.length ?? 0) - 1 && (
                <div className="absolute left-1/2 -bottom-0.5 transform -translate-x-1/2 w-px h-1 bg-white/5" />
              )}
            </Link>
          ))}

          {isCollapsed && (
            <div className="w-6 h-px bg-pink-500/20 mt-1" />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
))

NavigationItem.displayName = 'NavigationItem'

