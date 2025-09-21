import { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronDown,
  LayoutDashboard,
  Users,
  CreditCard,
  FileText,
  Package,
  Settings,
  PlusCircle,
  HelpCircle,
  LogOut,
  ShoppingCart,
  Zap,
  DollarSign,
  Tag,
  Grid3X3,
  X,
  User,
  ChevronUp,
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'
import { useResponsive } from '@/shared/hooks/useResponsive'
import { useRoundAccount } from '@/shared/hooks/useRoundAccount'
import { apiClient } from '@/shared/services/apiClient'
import { Breadcrumb } from '@/shared/components/Breadcrumb'
import ColorLogo from '@/assets/logos/color-logo.svg'

interface DashboardLayoutProps {
  children: React.ReactNode
}

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  badge?: string
  subItems?: NavItem[]
}

interface UserInfo {
  firstName?: string
  lastName?: string
  email?: string
  role?: string
  company?: string
}

interface TooltipState {
  id: string
  label: string
  badge?: string
  position: { top: number; left: number }
  isUser?: boolean
  userInfo?: UserInfo
}

const navItems: NavItem[] = [
  {
    id: 'get-started',
    label: 'Get Started',
    icon: PlusCircle,
    href: '/get-started',
  },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'customers', label: 'Customers', icon: Users, href: '/customers' },
  { id: 'billing', label: 'Billing', icon: CreditCard, href: '/billing' },
  { id: 'invoices', label: 'Invoices', icon: FileText, href: '/invoices' },
  { 
    id: 'catalog', 
    label: 'Catalog', 
    icon: ShoppingCart, 
    href: '/catalog',
    subItems: [
      { id: 'product-families', label: 'Product Families', icon: Grid3X3, href: '/catalog' },
      { id: 'plans', label: 'Plans', icon: Package, href: '/catalog/plans' },
      { id: 'addons', label: 'Add-ons', icon: Zap, href: '/catalog/addons' },
      { id: 'charges', label: 'Charges', icon: DollarSign, href: '/catalog/charges' },
      { id: 'coupons', label: 'Coupons', icon: Tag, href: '/catalog/coupons' }
    ]
  },
]

const bottomNavItems: NavItem[] = [
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  { id: 'help', label: 'Help & Support', icon: HelpCircle, href: '/help' },
]

// User data comes from auth context and API

// Memoized sub-item component to prevent unnecessary re-renders
const CatalogSubItem = memo(({ 
  subItem, 
  index: _index, 
  isCollapsed, 
  isActive, 
  handleTooltipEnter, 
  handleTooltipLeave,
  isLastItem 
}: {
  subItem: NavItem
  index: number
  isCollapsed: boolean
  isActive: boolean
  handleTooltipEnter: (itemId: string, label: string, badge: string | undefined, event: React.MouseEvent) => void
  handleTooltipLeave: () => void
  isLastItem: boolean
}) => {
  // Determine the className for active/inactive states
  const getActiveStateClasses = () => {
    if (isActive) {
      return isCollapsed
        ? 'bg-gradient-to-br from-pink-500/25 via-purple-500/20 to-cyan-500/25 text-white shadow-[0_0_12px_rgba(212,23,200,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] border border-pink-400/50'
        : 'bg-gradient-to-r from-pink-500/15 to-cyan-500/15 text-white border border-pink-400/40 shadow-[0_0_20px_rgba(212,23,200,0.3),0_0_12px_rgba(20,189,234,0.2)]'
    }
    return 'text-gray-400 hover:text-white hover:bg-white/5'
  }

  return (
    <Link
      to={subItem.href}
      onMouseEnter={(e) => isCollapsed && handleTooltipEnter(subItem.id, subItem.label, undefined, e)}
      onMouseLeave={isCollapsed ? handleTooltipLeave : undefined}
      className={`
        group relative flex items-center rounded-lg transition-all duration-200
        ${getActiveStateClasses()}
        ${
          isCollapsed 
            ? 'justify-center w-8 h-8 px-0 backdrop-blur-sm' 
            : 'h-8 px-4 mx-2'
        }
      `}
    >
      <subItem.icon className={`flex-shrink-0 transition-all duration-200 ${
        isCollapsed 
          ? 'w-3.5 h-3.5 drop-shadow-sm group-hover:scale-105' 
          : 'w-3.5 h-3.5 md:w-4 md:h-4 lg:w-3.5 lg:h-3.5 mr-2 md:mr-3 lg:mr-2'
      }`} />
      
      {!isCollapsed && (
        <span className="font-normal text-xs text-gray-300 whitespace-nowrap">{subItem.label}</span>
      )}

      {/* Subtle inner glow for active state in collapsed mode */}
      {isCollapsed && isActive && (
        <div className="absolute inset-0.5 rounded-md bg-gradient-to-br from-pink-500/10 to-cyan-500/10 -z-10" />
      )}

      {/* Connection indicator for collapsed mode */}
      {isCollapsed && !isLastItem && (
        <div className="absolute left-1/2 -bottom-0.5 transform -translate-x-1/2 w-px h-1 bg-white/15" />
      )}
    </Link>
  )
})

CatalogSubItem.displayName = 'CatalogSubItem'

// Memoized navigation item component
const NavigationItem = memo(({ 
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
  isKeyboardNavigating
}: {
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
}) => (
  <div>
    {/* Main Navigation Item */}
    {item.subItems ? (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          toggleExpanded(item.id)
        }}
        onMouseEnter={(e) => handleTooltipEnter(item.id, item.label, item.badge, e)}
        onMouseLeave={handleTooltipLeave}
        className={`
          group relative flex items-center rounded-lg transition-all duration-200 h-11 md:h-9 w-full
          ${
            isParentActive(item)
              ? 'bg-gradient-to-r from-pink-500/15 to-cyan-500/15 text-white border border-pink-400/40 shadow-[0_0_20px_rgba(212,23,200,0.3),0_0_12px_rgba(20,189,234,0.2)]'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }
          ${isCollapsed ? 'justify-center px-0' : 'px-6'}
          ${isKeyboardNavigating && focusedIndex === getAllNavItems.findIndex(navItem => navItem.id === item.id) 
            ? 'ring-2 ring-white/50' : ''
          }
        `}
        aria-expanded={expandedItems.includes(item.id)}
        aria-haspopup="menu"
        aria-label={`${item.label}${item.badge ? ` (${item.badge})` : ''} menu`}
        tabIndex={isKeyboardNavigating ? -1 : 0}
      >
        <item.icon className={`w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 ${isCollapsed ? '' : 'mr-2.5 md:mr-3 lg:mr-2.5'} flex-shrink-0`} />
        
        {!isCollapsed && (
          <div className="flex items-center justify-between flex-1 overflow-hidden">
            <span className="font-medium whitespace-nowrap text-sm md:text-base lg:text-sm">{item.label}</span>
            <ChevronDown 
              className={`w-4 h-4 transition-transform duration-200 ${
                expandedItems.includes(item.id) ? 'transform rotate-180' : ''
              }`} 
            />
          </div>
        )}
        
        {!isCollapsed && item.badge && (
          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-[#D417C8] to-[#14BDEA] text-white rounded-full">
            {item.badge}
          </span>
        )}
      </button>
    ) : (
      <Link
        to={item.href}
        onMouseEnter={(e) => handleTooltipEnter(item.id, item.label, item.badge, e)}
        onMouseLeave={handleTooltipLeave}
        className={`
          group relative flex items-center rounded-lg transition-all duration-200 h-11 md:h-9
          ${
            isParentActive(item)
              ? 'bg-gradient-to-r from-pink-500/15 to-cyan-500/15 text-white border border-pink-400/40 shadow-[0_0_20px_rgba(212,23,200,0.3),0_0_12px_rgba(20,189,234,0.2)]'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }
          ${isCollapsed ? 'justify-center px-0' : 'px-6'}
          ${isKeyboardNavigating && focusedIndex === getAllNavItems.findIndex(navItem => navItem.id === item.id) 
            ? 'ring-2 ring-white/50' : ''
          }
        `}
        aria-label={`${item.label}${item.badge ? ` (${item.badge})` : ''}`}
        tabIndex={isKeyboardNavigating ? -1 : 0}
      >
        <item.icon className={`w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 ${isCollapsed ? '' : 'mr-2.5 md:mr-3 lg:mr-2.5'} flex-shrink-0`} />

        {!isCollapsed && (
          <div className="flex items-center justify-between flex-1 overflow-hidden">
            <span className="font-medium whitespace-nowrap text-sm md:text-base lg:text-sm">{item.label}</span>
            {item.badge && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-[#D417C8] to-[#14BDEA] text-white rounded-full">
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
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
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
            <CatalogSubItem
              key={subItem.id}
              subItem={subItem}
              index={index}
              isCollapsed={isCollapsed}
              isActive={isActive(subItem.href)}
              handleTooltipEnter={handleTooltipEnter}
              handleTooltipLeave={handleTooltipLeave}
              isLastItem={index === (item.subItems?.length ?? 0) - 1}
            />
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

export const DashboardLayout = memo(({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate()
  const { logout, state } = useAuth()
  const { token } = state
  const location = useLocation()
  const { isMobile, isTablet } = useResponsive()
  const { roundAccount, isLoading: isRoundAccountLoading } = useRoundAccount()

  // Initialize sidebar state from localStorage - mobile first
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') return true
    const saved = localStorage.getItem('sidebar-collapsed')
    // Default to collapsed on mobile, open on desktop
    return saved ? saved === 'true' : (isMobile || isTablet)
  })

  // Mobile overlay state
  const [showMobileOverlay, setShowMobileOverlay] = useState(false)

  // Track expanded menu items
  const [expandedItems, setExpandedItems] = useState<string[]>(() => {
    // Auto-expand catalog if user is on a catalog page
    const savedExpanded = localStorage.getItem('sidebar-expanded-items')
    if (savedExpanded) {
      try {
        const parsed = JSON.parse(savedExpanded)
        if (Array.isArray(parsed)) {
          return parsed
        }
      } catch (e) {
        // Fallback to default behavior
      }
    }
    
    if (location.pathname.startsWith('/catalog')) {
      return ['catalog']
    }
    return []
  })

  
  // Track tooltip state
  const [hoveredTooltip, setHoveredTooltip] = useState<TooltipState | null>(null)

  // UI state
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)


  // Keyboard navigation
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [isKeyboardNavigating, setIsKeyboardNavigating] = useState(false)
  const navigationRef = useRef<HTMLElement>(null)
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  // Handle responsive behavior
  useEffect(() => {
    if ((isMobile || isTablet) && !isCollapsed) {
      setShowMobileOverlay(true)
    } else {
      setShowMobileOverlay(false)
    }
  }, [isMobile, isTablet, isCollapsed])

  // Persist sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', isCollapsed.toString())
  }, [isCollapsed])

  // Persist expanded items to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-expanded-items', JSON.stringify(expandedItems))
  }, [expandedItems])

  // Auto-expand catalog when navigating to catalog pages (only run once per path change)
  const lastPathRef = useRef<string>('')
  useEffect(() => {
    if (location.pathname !== lastPathRef.current) {
      lastPathRef.current = location.pathname
      
      if (location.pathname.startsWith('/catalog')) {
        setExpandedItems(prev => {
          if (!prev.includes('catalog')) {
            return [...prev, 'catalog']
          }
          return prev
        })
      }
    }
  }, [location.pathname])

  const isActive = (href: string) => location.pathname === href

  const isParentActive = (item: NavItem) => {
    if (item.subItems) {
      return item.subItems.some(subItem => isActive(subItem.href)) || isActive(item.href)
    }
    return isActive(item.href)
  }

  // Get all navigation items (flat list for keyboard navigation)
  const getAllNavItems = useMemo(() => {
    const items: (NavItem & { isSubItem?: boolean; parentId?: string })[] = []
    
    navItems.forEach(item => {
      items.push(item)
      if (item.subItems && (!isCollapsed && expandedItems.includes(item.id))) {
        item.subItems.forEach(subItem => {
          items.push({ ...subItem, isSubItem: true, parentId: item.id })
        })
      }
    })
    
    bottomNavItems.forEach(item => {
      items.push(item)
    })
    
    return items
  }, [isCollapsed, expandedItems])

  const toggleExpanded = useCallback((itemId: string) => {
    setExpandedItems(prev => {
      const isCurrentlyExpanded = prev.includes(itemId)
      if (isCurrentlyExpanded) {
        return prev.filter(id => id !== itemId)
      } else {
        return [...prev, itemId]
      }
    })
  }, [])

  const handleTooltipEnter = (itemId: string, label: string, badge: string | undefined, event: React.MouseEvent) => {
    if (!isCollapsed) return
    
    const buttonRect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    const tooltipPosition = {
      top: buttonRect.top + buttonRect.height / 2 - 20, // Center vertically
      left: buttonRect.right + 12 // Position to the right of sidebar
    }
    
    setHoveredTooltip({ id: itemId, label, badge, position: tooltipPosition })
  }

  const handleTooltipLeave = () => {
    setHoveredTooltip(null)
  }

  const handleUserTooltipEnter = (event: React.MouseEvent) => {
    if (!isCollapsed || !state.user) return
    
    const buttonRect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    const tooltipPosition = {
      top: buttonRect.top - 120, // Position above the user button
      left: buttonRect.right + 12 // Position to the right of sidebar
    }
    
    const userName = state.user.firstName?.trim() && state.user.lastName?.trim()
      ? `${state.user.firstName.trim()} ${state.user.lastName.trim()}`
      : state.user.firstName?.trim() || state.user.email || 'User'
    
    const companyName = (() => {
      if (isRoundAccountLoading) return 'Loading...'
      if (roundAccount?.accountName) return roundAccount.accountName
      if (roundAccount?.organization?.name) return roundAccount.organization.name
      if (state.user.accountType === 'business' && 'companyInfo' in state.user && state.user.companyInfo?.companyName) {
        return state.user.companyInfo.companyName
      }
      return state.user.accountType === 'business' ? 'Business Account' : 'Personal Account'
    })()
    
    setHoveredTooltip({ 
      id: 'user-profile', 
      label: userName, 
      position: tooltipPosition, 
      isUser: true,
      userInfo: {
        role: state.user.role,
        company: companyName,
        email: state.user.email
      }
    })
  }



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
  }, [showProfileDropdown])


  const toggleSidebar = useCallback(() => {
    setIsCollapsed(!isCollapsed)
    if (isMobile || isTablet) {
      setShowMobileOverlay(!isCollapsed)
    }
  }, [isCollapsed, isMobile, isTablet])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle keyboard navigation when sidebar is focused
      if (!navigationRef.current?.contains(document.activeElement)) {
        return
      }

      const allItems = getAllNavItems
      
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setIsKeyboardNavigating(true)
          setFocusedIndex(prev => {
            const newIndex = prev < allItems.length - 1 ? prev + 1 : 0
            return newIndex
          })
          break
          
        case 'ArrowUp':
          event.preventDefault()
          setIsKeyboardNavigating(true)
          setFocusedIndex(prev => {
            const newIndex = prev > 0 ? prev - 1 : allItems.length - 1
            return newIndex
          })
          break
          
        case 'Enter':
          event.preventDefault()
          if (focusedIndex >= 0 && focusedIndex < allItems.length) {
            const item = allItems[focusedIndex]
            if (item.subItems && !isCollapsed) {
              toggleExpanded(item.id)
            } else {
              navigate(item.href)
            }
          }
          break
          
        case 'Escape':
          setFocusedIndex(-1)
          setIsKeyboardNavigating(false)
          break
          
        // Quick navigation shortcuts
        case '1':
          if (event.altKey) {
            event.preventDefault()
            navigate('/dashboard')
          }
          break
        case '2':
          if (event.altKey) {
            event.preventDefault()
            navigate('/customers')
          }
          break
        case '3':
          if (event.altKey) {
            event.preventDefault()
            navigate('/billing')
          }
          break
        case '4':
          if (event.altKey) {
            event.preventDefault()
            navigate('/invoices')
          }
          break
        case '5':
          if (event.altKey) {
            event.preventDefault()
            navigate('/catalog')
          }
          break
        case 'b':
          if (event.ctrlKey && event.shiftKey) {
            event.preventDefault()
            toggleSidebar()
          }
          break
        case '?':
          if (event.shiftKey) {
            event.preventDefault()
            setShowShortcuts(!showShortcuts)
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [focusedIndex, getAllNavItems, navigate, isCollapsed, showShortcuts, toggleSidebar, toggleExpanded])

  const handleLogout = async () => {
    if (token) {
      await apiClient.logout()
    }
    logout()
    navigate('/login')
  }



  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.trim()
    const last = lastName?.trim()
    
    if (first && last) {
      return `${first[0]}${last[0]}`.toUpperCase()
    } else if (first) {
      return first.slice(0, 2).toUpperCase()
    } else if (last) {
      return last.slice(0, 2).toUpperCase()
    }
    return 'U' // Default fallback
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        '--sidebar-width': isCollapsed ? '80px' : '280px'
      } as React.CSSProperties}
    >
      {/* Animated Background - Same as auth pages */}
      <div className="fixed inset-0 z-0">
        <div className="floating-orb" />
        <div className="floating-orb" />
        <div className="floating-orb" />
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {showMobileOverlay && !isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsCollapsed(true)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isCollapsed ? 80 : 280,
          x: (isMobile || isTablet) && isCollapsed ? -80 : 0
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="fixed left-0 top-0 h-full z-50 lg:z-base bg-white/5 backdrop-blur-xl border-r border-white/10"
      >
        {/* Logo Section - Clickable */}
        <Link
          to="/dashboard"
          className="flex items-center justify-center border-b border-white/10 flex-shrink-0 hover:bg-white/5 transition-colors duration-200 cursor-pointer"
          style={{ height: '97px' }}
        >
          {!isCollapsed ? (
            <div className="flex items-center space-x-4">
              <img src={ColorLogo} alt="Round Logo" className="w-10 h-11 md:h-9 animate-[pulse_3s_ease-in-out_infinite] drop-shadow-[0_0_20px_rgba(212,23,200,0.6)]" />
              <div className="flex items-center space-x-0.5 animate-[pulse_3s_ease-in-out_infinite]">
                <span className="text-[#D417C8] font-extralight text-3xl tracking-wider drop-shadow-[0_0_15px_rgba(212,23,200,0.7)] transition-all duration-300">R</span>
                <span className="text-[#BD2CD0] font-extralight text-3xl tracking-wider drop-shadow-[0_0_15px_rgba(189,44,208,0.7)] transition-all duration-300">O</span>
                <span className="text-[#7767DA] font-extralight text-3xl tracking-wider drop-shadow-[0_0_15px_rgba(119,103,218,0.7)] transition-all duration-300">U</span>
                <span className="text-[#32A1E4] font-extralight text-3xl tracking-wider drop-shadow-[0_0_15px_rgba(50,161,228,0.7)] transition-all duration-300">N</span>
                <span className="text-[#14BDEA] font-extralight text-3xl tracking-wider drop-shadow-[0_0_15px_rgba(20,189,234,0.7)] transition-all duration-300">D</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <img src={ColorLogo} alt="Round Logo" className="w-8 h-8 animate-[pulse_3s_ease-in-out_infinite] drop-shadow-[0_0_16px_rgba(212,23,200,0.6)]" />
            </div>
          )}
        </Link>

        {/* Main Content Area - Flex container for navigation and bottom sections */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navigation */}
          <nav 
            ref={navigationRef}
            className={`hide-scrollbar flex-1 py-4 md:py-5 lg:py-4 pb-24 space-y-1.5 md:space-y-2 lg:space-y-1.5 overflow-y-auto overflow-x-hidden ${isCollapsed ? 'px-2' : 'px-4 md:px-6 lg:px-4'}`}
            role="navigation"
            aria-label="Main navigation"
          >
          {navItems.map(item => (
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
            />
          ))}

          {/* Bottom Navigation Items - Include in main navigation */}
          {bottomNavItems.map(item => (
            <Link
              key={item.id}
              to={item.href}
              onMouseEnter={(e) => handleTooltipEnter(item.id, item.label, undefined, e)}
              onMouseLeave={handleTooltipLeave}
              className={`
                group relative flex items-center rounded-lg transition-all duration-200 h-11 md:h-9
                ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-pink-500/15 to-cyan-500/15 text-white border border-pink-400/40 shadow-[0_0_20px_rgba(212,23,200,0.3),0_0_12px_rgba(20,189,234,0.2)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
                ${isCollapsed ? 'justify-center px-0' : 'px-6'}
                ${isKeyboardNavigating && focusedIndex === getAllNavItems.findIndex(navItem => navItem.id === item.id)
                  ? 'ring-2 ring-white/50' : ''
                }
              `}
              aria-label={item.label}
              tabIndex={isKeyboardNavigating ? -1 : 0}
            >
              <item.icon className={`w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 ${isCollapsed ? '' : 'mr-2.5 md:mr-3 lg:mr-2.5'} flex-shrink-0`} />

              {!isCollapsed && (
                <div className="overflow-hidden">
                  <span className="font-medium whitespace-nowrap text-sm md:text-base lg:text-sm">{item.label}</span>
                </div>
              )}

            </Link>
          ))}
        </nav>

        {/* Fixed User Profile Section at Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          {/* Expandable Profile Menu Items */}
          <AnimatePresence>
            {showProfileDropdown && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`overflow-hidden border-t border-white/10 space-y-1.5 md:space-y-2 lg:space-y-1.5 ${isCollapsed ? 'px-2 py-2' : 'px-4 md:px-6 lg:px-4 py-3 md:py-4 lg:py-3'}`}
              >
                <Link
                  to="/user-settings"
                  onClick={() => setShowProfileDropdown(false)}
                  onMouseEnter={(e) => handleTooltipEnter('user-settings', 'User Settings', undefined, e)}
                  onMouseLeave={handleTooltipLeave}
                  className={`
                    group relative flex items-center rounded-lg transition-all duration-200 h-11 md:h-9
                    ${
                      isActive('/user-settings')
                        ? 'bg-gradient-to-r from-pink-500/15 to-cyan-500/15 text-white border border-pink-400/40 shadow-[0_0_20px_rgba(212,23,200,0.3),0_0_12px_rgba(20,189,234,0.2)]'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                    ${isCollapsed ? 'justify-center px-0' : 'px-6'}
                  `}
                  aria-label="User Settings"
                >
                  <User className={`w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 ${isCollapsed ? '' : 'mr-2.5 md:mr-3 lg:mr-2.5'} flex-shrink-0`} />

                  {!isCollapsed && (
                    <div className="overflow-hidden">
                      <span className="font-medium whitespace-nowrap text-sm md:text-base lg:text-sm">User Settings</span>
                    </div>
                  )}

                </Link>

                <button
                  onClick={() => {
                    setShowProfileDropdown(false)
                    handleLogout()
                  }}
                  onMouseEnter={(e) => handleTooltipEnter('logout', 'Logout', undefined, e)}
                  onMouseLeave={handleTooltipLeave}
                  className={`
                    group relative flex items-center rounded-lg transition-all duration-200 h-11 md:h-9 w-full
                    text-gray-400 hover:text-red-400 hover:bg-red-400/10
                    ${isCollapsed ? 'justify-center px-0' : 'px-6'}
                  `}
                  aria-label="Logout"
                >
                  <LogOut className={`w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 ${isCollapsed ? '' : 'mr-2.5 md:mr-3 lg:mr-2.5'} flex-shrink-0`} />

                  {!isCollapsed && (
                    <div className="overflow-hidden">
                      <span className="font-medium whitespace-nowrap text-sm md:text-base lg:text-sm">Logout</span>
                    </div>
                  )}

                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Divider */}
          <div className="border-t border-white/10" />
          
          {/* User Profile */}
          <div className={`py-2 ${isCollapsed ? 'px-2' : 'px-4 md:px-6 lg:px-4'}`}>
            <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => {
                // Always use inline menu for both collapsed and expanded states
                setShowProfileDropdown(!showProfileDropdown)
              }}
              onMouseEnter={handleUserTooltipEnter}
              onMouseLeave={handleTooltipLeave}
              className={`
                group relative flex items-center rounded-lg transition-all duration-200 w-full
                text-gray-400 hover:text-white hover:bg-white/5
                ${isCollapsed ? 'justify-center px-0 h-11 md:h-9' : 'px-3 py-2.5 md:py-2 lg:py-1.5'}
                ${showProfileDropdown ? 'bg-white/10 text-white' : ''}
              `}
              aria-label="User profile menu"
              aria-expanded={showProfileDropdown}
            >
              {/* User Avatar */}
              <div className={`flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`}>
                {state.user ? (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#D417C8] to-[#14BDEA] flex items-center justify-center text-white text-sm font-medium">
                    {getInitials(state.user.firstName, state.user.lastName)}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-300" />
                  </div>
                )}
              </div>

              {/* User Info - Only show when expanded */}
              {!isCollapsed && state.user && (
                <div className="flex-1 text-left overflow-hidden">
                  <div className="font-medium text-sm text-white truncate">
                    {state.user.firstName?.trim() && state.user.lastName?.trim()
                      ? `${state.user.firstName.trim()} ${state.user.lastName.trim()}`
                      : state.user.firstName?.trim() || state.user.email || 'User'}
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {(() => {
                      if (isRoundAccountLoading) return 'Loading...'
                      if (roundAccount?.accountName) return roundAccount.accountName
                      if (roundAccount?.organization?.name) return roundAccount.organization.name
                      if (state.user.accountType === 'business' && 'companyInfo' in state.user && state.user.companyInfo?.companyName) {
                        return state.user.companyInfo.companyName
                      }
                      return state.user.accountType === 'business' ? 'Business Account' : 'Personal Account'
                    })()}
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

            </button>
            </div>
          </div>
        </div>
        </div>
      </motion.aside>


      {/* External Tooltips for Collapsed Sidebar */}
      <AnimatePresence>
        {hoveredTooltip && isCollapsed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className={`fixed bg-black/90 backdrop-blur-md border border-white/30 text-white rounded-lg pointer-events-none z-tooltip shadow-xl ${
              hoveredTooltip.isUser ? 'px-4 py-3 text-xs max-w-[250px]' : 'px-3 py-2 text-sm whitespace-nowrap'
            }`}
            style={{
              top: hoveredTooltip.position.top,
              left: hoveredTooltip.position.left
            }}
          >
            {hoveredTooltip.isUser ? (
              <div>
                <div className="font-semibold mb-2 text-white">
                  {hoveredTooltip.label}
                </div>
                <div className="text-gray-300 text-[11px] leading-relaxed space-y-1">
                  <div>{hoveredTooltip.userInfo?.role as React.ReactNode} at {hoveredTooltip.userInfo?.company as React.ReactNode}</div>
                  <div className="text-gray-400">{hoveredTooltip.userInfo?.email as React.ReactNode}</div>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-6 max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Keyboard Shortcuts</h3>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close shortcuts help"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="text-white font-medium mb-2">Navigation</h4>
                  <div className="space-y-1 text-gray-300">
                    <div className="flex justify-between">
                      <span>Dashboard</span>
                      <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Alt+1</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Customers</span>
                      <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Alt+2</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Billing</span>
                      <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Alt+3</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Invoices</span>
                      <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Alt+4</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Catalog</span>
                      <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Alt+5</kbd>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-2">Sidebar</h4>
                  <div className="space-y-1 text-gray-300">
                    <div className="flex justify-between">
                      <span>Toggle Sidebar</span>
                      <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Ctrl+Shift+B</kbd>
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

      {/* Toggle Button - Responsive positioning */}
      <motion.button
        initial={false}
        animate={{ 
          left: (() => {
            if (isMobile || isTablet) {
              return isCollapsed ? 16 : 264
            }
            return isCollapsed ? 64 : 264
          })()
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        onClick={toggleSidebar}
        className="fixed top-16 lg:top-20 w-10 h-11 md:h-9 lg:w-8 lg:h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-200 z-50 lg:z-base"
      >
        <ChevronLeft className="w-5 h-5 lg:w-4 lg:h-4 text-white" />
      </motion.button>

      {/* Main Content - Responsive margins */}
      <motion.main
        initial={false}
        animate={{
          marginLeft: (() => {
            if (isMobile || isTablet) {
              return 0
            }
            return isCollapsed ? 80 : 280
          })()
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="min-h-screen relative z-10"
      >
        <div className="max-w-6xl lg:max-w-7xl xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6">
          <Breadcrumb />
          {children}
        </div>
      </motion.main>

    </div>
  )
})

DashboardLayout.displayName = 'DashboardLayout'
