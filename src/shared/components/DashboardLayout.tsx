import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  CreditCard,
  FileText,
  Package,
  Settings,
  PlusCircle,
  HelpCircle,
  LogOut,
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
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'customers', label: 'Customers', icon: Users, href: '/customers' },
  { id: 'billing', label: 'Billing', icon: CreditCard, href: '/billing' },
  { id: 'invoices', label: 'Invoices', icon: FileText, href: '/invoices' },
  { id: 'products', label: 'Products', icon: Package, href: '/products' },
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

  // Persist sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', isCollapsed.toString())
  }, [isCollapsed])

  const isActive = (href: string) => location.pathname === href

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
        className="fixed left-0 top-0 h-full z-50 bg-white/5 backdrop-blur-xl border-r border-white/10"
      >
        {/* Logo Section */}
        <div
          className="flex items-center justify-center border-b border-white/10"
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
        <nav className="flex-1 px-6 py-6 space-y-2">
          {navItems.map(item => (
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
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-white/10 px-6 py-4 space-y-2">
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
