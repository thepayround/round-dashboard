import { useState, useEffect } from 'react'
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
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'
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

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate()
  const { logout, state } = useAuth()
  const { token } = state
  const location = useLocation()

  // Initialize sidebar state from localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    return saved === 'true'
  })

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
      // Calculate position based on the clicked button
      const buttonRect = (event.currentTarget as HTMLElement).getBoundingClientRect()
      setDropdownPosition({
        top: buttonRect.top,
        left: buttonRect.right + 8 // 8px gap from sidebar
      })
      setCollapsedDropdown(itemId)
    }
  }

  // Close collapsed dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (collapsedDropdown) {
        // Check if click is outside the dropdown
        const target = event.target as Element
        if (!target.closest('.collapsed-dropdown') && !target.closest('.catalog-button')) {
          setCollapsedDropdown(null)
        }
      }
    }

    if (collapsedDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [collapsedDropdown])

  const handleLogout = async () => {
    if (token) {
      await apiClient.logout()
    }
    logout()
    navigate('/auth/login')
  }

  return (
    <div className="min-h-screen relative">
      {/* Animated Background - Same as auth pages */}
      <div className="fixed inset-0 z-0">
        <div className="floating-orb" />
        <div className="floating-orb" />
        <div className="floating-orb" />
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="fixed left-0 top-0 h-full z-50 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col overflow-hidden"
      >
        {/* Logo Section */}
        <div
          className="flex items-center justify-center border-b border-white/10 flex-shrink-0"
          style={{ height: '97px' }}
        >
          {!isCollapsed ? (
            <div className="flex items-center space-x-4">
              <img src={ColorLogo} alt="Round Logo" className="w-10 h-10" />
              <div className="flex items-center space-x-1">
                <span className="text-[#14BDEA] font-bold text-3xl">R</span>
                <span className="text-[#32A1E4] font-bold text-3xl">O</span>
                <span className="text-[#7767DA] font-bold text-3xl">U</span>
                <span className="text-[#BD2CD0] font-bold text-3xl">N</span>
                <span className="text-[#D417C8] font-bold text-3xl">D</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <img src={ColorLogo} alt="Round Logo" className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-6 space-y-2 overflow-y-auto overflow-x-hidden ${isCollapsed ? 'px-2' : 'px-6'}`}>
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
                    catalog-button group relative flex items-center rounded-xl transition-all duration-200 h-12 w-full
                    ${
                      isParentActive(item)
                        ? 'bg-gradient-to-r from-[#D417C8]/20 to-[#14BDEA]/20 text-white border border-white/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                    ${isCollapsed ? 'justify-center px-0' : 'px-6'}
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0`} />
                  
                  {!isCollapsed && (
                    <div className="flex items-center justify-between flex-1 overflow-hidden">
                      <span className="font-medium whitespace-nowrap">{item.label}</span>
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
                    group relative flex items-center rounded-xl transition-all duration-200 h-12
                    ${
                      isParentActive(item)
                        ? 'bg-gradient-to-r from-[#D417C8]/20 to-[#14BDEA]/20 text-white border border-white/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                    ${isCollapsed ? 'justify-center px-0' : 'px-6'}
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0`} />

                  {!isCollapsed && (
                    <div className="flex items-center justify-between flex-1 overflow-hidden">
                      <span className="font-medium whitespace-nowrap">{item.label}</span>
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
                    className="mt-2 space-y-1 pl-4"
                  >
                    {item.subItems.map(subItem => (
                      <Link
                        key={subItem.id}
                        to={subItem.href}
                        className={`
                          group relative flex items-center rounded-lg transition-all duration-200 h-10 px-4
                          ${
                            isActive(subItem.href)
                              ? 'bg-gradient-to-r from-[#D417C8]/30 to-[#14BDEA]/30 text-white border-l-2 border-[#D417C8]'
                              : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent hover:border-white/20'
                          }
                        `}
                      >
                        <subItem.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span className="font-medium text-sm whitespace-nowrap">{subItem.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className={`border-t border-white/10 py-4 space-y-2 flex-shrink-0 ${isCollapsed ? 'px-2' : 'px-6'}`}>
          {bottomNavItems.map(item => (
            <Link
              key={item.id}
              to={item.href}
              className={`
                group relative flex items-center rounded-xl transition-all duration-200 h-12
                ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-[#D417C8]/20 to-[#14BDEA]/20 text-white border border-white/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
                ${isCollapsed ? 'justify-center px-0' : 'px-6'}
              `}
            >
              <item.icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0`} />

              {!isCollapsed && (
                <div className="overflow-hidden">
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
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

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`
              group relative flex items-center rounded-xl transition-all duration-200 h-12 w-full
              text-gray-400 hover:text-red-400 hover:bg-red-400/10
              ${isCollapsed ? 'justify-center px-0' : 'px-6'}
            `}
          >
            <LogOut className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0`} />

            {!isCollapsed && (
              <div className="overflow-hidden">
                <span className="font-medium whitespace-nowrap">Logout</span>
              </div>
            )}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </button>
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
            className="collapsed-dropdown fixed min-w-[200px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Find the catalog item to show its dropdown */}
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
                              ? 'bg-gradient-to-r from-[#D417C8]/20 to-[#14BDEA]/20 text-white border-r-2 border-[#D417C8]'
                              : 'text-gray-300 hover:text-white'
                          }
                        `}
                      >
                        <subItem.icon className="w-4 h-4 mr-3 flex-shrink-0" />
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

      {/* Toggle Button - Outside sidebar */}
      <motion.button
        initial={false}
        animate={{ left: isCollapsed ? 64 : 264 }}
        transition={{ duration: 0, ease: 'linear' }}
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-20 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-200 z-50"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-white" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-white" />
        )}
      </motion.button>

      {/* Main Content */}
      <motion.main
        initial={false}
        animate={{ marginLeft: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="min-h-screen relative z-10"
      >
        <div className="p-8">
          <Breadcrumb />
          {children}
        </div>
      </motion.main>
    </div>
  )
}
