import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
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

const navItems: NavItem[] = [
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
  {
    id: 'get-started',
    label: 'Get Started',
    icon: PlusCircle,
    href: '/get-started',
    badge: 'Setup',
  },
]

const bottomNavItems: NavItem[] = [
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  { id: 'help', label: 'Help & Support', icon: HelpCircle, href: '/help' },
]

// User data comes from auth context and API

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
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
    if (location.pathname.startsWith('/catalog')) {
      return ['catalog']
    }
    return []
  })

  // Track collapsed sidebar dropdown
  const [collapsedDropdown, setCollapsedDropdown] = useState<string | null>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })

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
    // Close collapsed dropdown when sidebar is expanded
    if (!isCollapsed) {
      setCollapsedDropdown(null)
    }
  }, [isCollapsed])

  // Auto-expand catalog when navigating to catalog pages
  useEffect(() => {
    if (location.pathname.startsWith('/catalog') && !expandedItems.includes('catalog')) {
      setExpandedItems(prev => [...prev, 'catalog'])
    }
  }, [location.pathname, expandedItems])

  const isActive = (href: string) => location.pathname === href

  const isParentActive = (item: NavItem) => {
    if (item.subItems) {
      return item.subItems.some(subItem => isActive(subItem.href)) || isActive(item.href)
    }
    return isActive(item.href)
  }

  // Get all navigation items (flat list for keyboard navigation)
  const getAllNavItems = useCallback(() => {
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

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const isCurrentlyExpanded = prev.includes(itemId)
      const newState = isCurrentlyExpanded 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
      return newState
    })
  }

  const toggleCollapsedDropdown = (itemId: string, event: React.MouseEvent) => {
    if (collapsedDropdown === itemId) {
      setCollapsedDropdown(null)
    } else {
      // Calculate position based on the clicked button with viewport awareness
      const buttonRect = (event.currentTarget as HTMLElement).getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const viewportWidth = window.innerWidth
      const dropdownMinWidth = 200
      const dropdownEstimatedHeight = 250 // Estimated height for calculation
      
      let {top} = buttonRect
      let left = buttonRect.right + 8 // 8px gap from sidebar
      
      // Check if dropdown would overflow viewport horizontally
      if (left + dropdownMinWidth > viewportWidth) {
        left = buttonRect.left - dropdownMinWidth - 8 // Position to the left of sidebar
      }
      
      // Check if dropdown would overflow viewport vertically
      if (top + dropdownEstimatedHeight > viewportHeight) {
        top = Math.max(8, viewportHeight - dropdownEstimatedHeight - 8) // 8px margin from top/bottom
      }
      
      // Ensure dropdown doesn't go above viewport
      if (top < 8) {
        top = 8
      }
      
      setDropdownPosition({ top, left })
      setCollapsedDropdown(itemId)
    }
  }

  // Close collapsed dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (collapsedDropdown) {
        // Check if click is outside the dropdown
        const target = event.target as Element
        if (!target.closest('.collapsed-dropdown') && 
            !target.closest('.catalog-button')) {
          setCollapsedDropdown(null)
        }
      }
    }

    if (collapsedDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [collapsedDropdown])

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

      const allItems = getAllNavItems()
      
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
          if (collapsedDropdown) {
            setCollapsedDropdown(null)
          } else {
            setFocusedIndex(-1)
            setIsKeyboardNavigating(false)
          }
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
  }, [focusedIndex, getAllNavItems, collapsedDropdown, navigate, isCollapsed, showShortcuts, toggleSidebar])

  const handleLogout = async () => {
    if (token) {
      await apiClient.logout()
    }
    logout()
    navigate('/auth/login')
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
    <div className="min-h-screen relative">
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
              <img src={ColorLogo} alt="Round Logo" className="w-10 h-10" />
              <div className="flex items-center space-x-1">
                <span className="text-[#D417C8] font-bold text-3xl">R</span>
                <span className="text-[#BD2CD0] font-bold text-3xl">O</span>
                <span className="text-[#7767DA] font-bold text-3xl">U</span>
                <span className="text-[#32A1E4] font-bold text-3xl">N</span>
                <span className="text-[#14BDEA] font-bold text-3xl">D</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <img src={ColorLogo} alt="Round Logo" className="w-8 h-8" />
            </div>
          )}
        </Link>

        {/* Main Content Area - Flex container for navigation and bottom sections */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navigation */}
          <nav 
            ref={navigationRef}
            className={`flex-1 py-4 md:py-5 lg:py-4 pb-24 space-y-1.5 md:space-y-2 lg:space-y-1.5 overflow-y-auto overflow-x-hidden ${isCollapsed ? 'px-2' : 'px-4 md:px-6 lg:px-4'}`}
            role="navigation"
            aria-label="Main navigation"
          >
          {navItems.map(item => (
            <div key={item.id}>
              {/* Main Navigation Item */}
              {item.subItems ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (!isCollapsed) {
                      toggleExpanded(item.id)
                    } else {
                      // In collapsed mode, toggle dropdown
                      toggleCollapsedDropdown(item.id, e)
                    }
                  }}
                  className={`
                    catalog-button group relative flex items-center rounded-lg transition-all duration-200 h-10 w-full
                    ${
                      isParentActive(item)
                        ? 'bg-gradient-to-r from-[#14BDEA]/20 to-[#D417C8]/20 text-white border border-white/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                    ${isCollapsed ? 'justify-center px-0' : 'px-6'}
                    ${isKeyboardNavigating && focusedIndex === getAllNavItems().findIndex(navItem => navItem.id === item.id) 
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

                  {/* Tooltip for collapsed state (only show when dropdown is not open) */}
                  {isCollapsed && collapsedDropdown !== item.id && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                      {item.badge && <span className="ml-1 text-[#D417C8]">({item.badge})</span>}
                    </div>
                  )}

                </button>
              ) : (
                <Link
                  to={item.href}
                  className={`
                    group relative flex items-center rounded-lg transition-all duration-200 h-10
                    ${
                      isParentActive(item)
                        ? 'bg-gradient-to-r from-[#14BDEA]/20 to-[#D417C8]/20 text-white border border-white/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                    ${isCollapsed ? 'justify-center px-0' : 'px-6'}
                    ${isKeyboardNavigating && focusedIndex === getAllNavItems().findIndex(navItem => navItem.id === item.id) 
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

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                      {item.badge && <span className="ml-1 text-[#D417C8]">({item.badge})</span>}
                    </div>
                  )}
                </Link>
              )}

              {/* Sub-items for expanded sidebar */}
              <AnimatePresence>
                {item.subItems && !isCollapsed && expandedItems.includes(item.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-1.5 md:mt-2 lg:mt-1.5 space-y-0.5 md:space-y-1 lg:space-y-0.5 pl-3 md:pl-4 lg:pl-3"
                  >
                    {item.subItems.map(subItem => (
                      <Link
                        key={subItem.id}
                        to={subItem.href}
                        className={`
                          group relative flex items-center rounded-lg transition-all duration-200 h-9 md:h-8 lg:h-7 px-3 md:px-3.5 lg:px-3
                          ${
                            isActive(subItem.href)
                              ? 'bg-gradient-to-r from-[#D417C8]/30 to-[#14BDEA]/30 text-white border-l-2 border-[#D417C8]'
                              : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent hover:border-white/20'
                          }
                        `}
                      >
                        <subItem.icon className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-3.5 lg:h-3.5 mr-2 md:mr-3 lg:mr-2 flex-shrink-0" />
                        <span className="font-medium text-xs md:text-sm lg:text-xs whitespace-nowrap">{subItem.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Bottom Navigation Items - Include in main navigation */}
          {bottomNavItems.map(item => (
            <Link
              key={item.id}
              to={item.href}
              className={`
                group relative flex items-center rounded-lg transition-all duration-200 h-10
                ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-[#14BDEA]/20 to-[#D417C8]/20 text-white border border-white/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
                ${isCollapsed ? 'justify-center px-0' : 'px-6'}
                ${isKeyboardNavigating && focusedIndex === getAllNavItems().findIndex(navItem => navItem.id === item.id) 
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

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
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
                  className={`
                    group relative flex items-center rounded-lg transition-all duration-200 h-10
                    ${
                      isActive('/user-settings')
                        ? 'bg-gradient-to-r from-[#14BDEA]/20 to-[#D417C8]/20 text-white border border-white/20'
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

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      User Settings
                    </div>
                  )}
                </Link>

                <button
                  onClick={() => {
                    setShowProfileDropdown(false)
                    handleLogout()
                  }}
                  className={`
                    group relative flex items-center rounded-lg transition-all duration-200 h-10 w-full
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

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      Logout
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
                if (isCollapsed) {
                  // In collapsed mode, show tooltip-like dropdown
                  if (collapsedDropdown === 'profile') {
                    setCollapsedDropdown(null)
                  } else {
                    const buttonRect = (document.activeElement as HTMLElement).getBoundingClientRect()
                    const viewportHeight = window.innerHeight
                    const viewportWidth = window.innerWidth
                    const dropdownMinWidth = 280
                    const dropdownEstimatedHeight = 300
                    
                    let top = buttonRect.top - dropdownEstimatedHeight - 8
                    let left = buttonRect.right + 8
                    
                    // Check horizontal overflow
                    if (left + dropdownMinWidth > viewportWidth) {
                      left = buttonRect.left - dropdownMinWidth - 8
                    }
                    
                    // Check vertical overflow - position above button
                    if (top < 8) {
                      top = Math.min(buttonRect.bottom + 8, viewportHeight - dropdownEstimatedHeight - 8)
                    }
                    
                    setDropdownPosition({ top, left })
                    setCollapsedDropdown('profile')
                  }
                } else {
                  // In expanded mode, toggle inline menu
                  setShowProfileDropdown(!showProfileDropdown)
                }
              }}
              className={`
                group relative flex items-center rounded-lg transition-all duration-200 w-full
                text-gray-400 hover:text-white hover:bg-white/5
                ${isCollapsed ? 'justify-center px-0 h-10' : 'px-3 py-2.5 md:py-2 lg:py-1.5'}
                ${showProfileDropdown && !isCollapsed ? 'bg-white/10 text-white' : ''}
                ${collapsedDropdown === 'profile' && isCollapsed ? 'bg-white/10 text-white' : ''}
              `}
              aria-label="User profile menu"
              aria-expanded={showProfileDropdown}
              data-profile-button={isCollapsed ? 'true' : undefined}
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

              {/* Tooltip for collapsed state (only show when dropdown is not open) */}
              {isCollapsed && collapsedDropdown !== 'profile' && state.user && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 max-w-[200px]">
                  <div className="font-semibold mb-1">
                    {state.user.firstName?.trim() && state.user.lastName?.trim()
                      ? `${state.user.firstName.trim()} ${state.user.lastName.trim()}`
                      : state.user.firstName?.trim() || state.user.email || 'User'}
                  </div>
                  <div className="text-gray-300 text-[10px] leading-tight">
                    {state.user.role} at {(() => {
                      if (isRoundAccountLoading) return 'Loading...'
                      if (roundAccount?.accountName) return roundAccount.accountName
                      if (roundAccount?.organization?.name) return roundAccount.organization.name
                      if (state.user.accountType === 'business' && 'companyInfo' in state.user && state.user.companyInfo?.companyName) {
                        return state.user.companyInfo.companyName
                      }
                      return state.user.accountType === 'business' ? 'Business Account' : 'Personal Account'
                    })()}<br/>
                    {state.user.email}
                  </div>
                </div>
              )}
            </button>
            </div>
          </div>
        </div>
        </div>
      </motion.aside>

      {/* Collapsed Sidebar Dropdown - Outside sidebar to avoid clipping */}
      <AnimatePresence>
        {isCollapsed && collapsedDropdown && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -10 }}
            transition={{ duration: 0.15 }}
            className="collapsed-dropdown fixed bg-gray-900/95 backdrop-blur-xl border border-white/30 rounded-lg shadow-2xl z-50 min-w-[200px]"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Catalog dropdown content */}
            {(() => {
              const catalogItem = navItems.find(item => item.id === collapsedDropdown)
              if (!catalogItem) return null
              
              return (
                <>
                  {/* Dropdown Header */}
                  <div className="px-4 py-3 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                      <catalogItem.icon className="w-5 h-5 text-white" />
                      <span className="font-medium text-white">{catalogItem.label}</span>
                    </div>
                  </div>
                  
                  {/* Dropdown Items */}
                  <div className="py-2">
                    {catalogItem.subItems?.map(subItem => (
                      <Link
                        key={subItem.id}
                        to={subItem.href}
                        onClick={() => setCollapsedDropdown(null)}
                        className={`
                          flex items-center px-4 py-3 hover:bg-white/10 transition-colors duration-200
                          ${
                            isActive(subItem.href)
                              ? 'bg-gradient-to-r from-[#14BDEA]/20 to-[#D417C8]/20 text-white border-r-2 border-[#D417C8]'
                              : 'text-gray-300 hover:text-white'
                          }
                        `}
                      >
                        <subItem.icon className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-3.5 lg:h-3.5 mr-2 md:mr-3 lg:mr-2 flex-shrink-0" />
                        <span className="font-medium text-sm">{subItem.label}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )
            })()}
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
        className="fixed top-16 lg:top-20 w-10 h-10 lg:w-8 lg:h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-200 z-50 lg:z-base"
      >
        {isCollapsed ? (
          <ChevronRight className="w-5 h-5 lg:w-4 lg:h-4 text-white" />
        ) : (
          <ChevronLeft className="w-5 h-5 lg:w-4 lg:h-4 text-white" />
        )}
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
        <div className="p-4 sm:p-8 md:p-16 lg:p-32">
          <Breadcrumb />
          {children}
        </div>
      </motion.main>

    </div>
  )
}
