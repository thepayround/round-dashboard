import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
import { useAuthActions, useAuthState } from '@/shared/contexts/AuthContext'
import { mockApi } from '@/shared/services/mockApi'

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
  const { logout } = useAuthActions()
  const { token } = useAuthState()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()

  const isActive = (href: string) => location.pathname === href

  const handleLogout = async () => {
    if (token) {
      await mockApi.logout(token)
    }
    logout()
    navigate('/auth/login')
  }

  const LogoText = () => (
    <div className="flex items-center space-x-1">
      <span className="text-[#14BDEA] font-bold text-xl">R</span>
      <span className="text-[#32A1E4] font-bold text-xl">O</span>
      <span className="text-[#7767DA] font-bold text-xl">U</span>
      <span className="text-[#BD2CD0] font-bold text-xl">N</span>
      <span className="text-[#D417C8] font-bold text-xl">D</span>
    </div>
  )

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
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-full z-50 auth-card border-r border-white/10"
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center justify-center border-b border-white/10 relative">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                key="expanded-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D417C8]/20 to-[#14BDEA]/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#D417C8] to-[#14BDEA]" />
                </div>
                <LogoText />
              </motion.div>
            ) : (
              <motion.div
                key="collapsed-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D417C8]/20 to-[#14BDEA]/20 backdrop-blur-sm border border-white/20 flex items-center justify-center"
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#D417C8] to-[#14BDEA]" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-200 z-10"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-white" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-white" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
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
                ${isCollapsed ? 'justify-center px-0' : 'px-4'}
              `}
            >
              <item.icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0`} />

              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between flex-1 overflow-hidden"
                  >
                    <span className="font-medium whitespace-nowrap">{item.label}</span>
                    {item.badge && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-[#D417C8] to-[#14BDEA] text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

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
        <div className="border-t border-white/10 px-4 py-4 space-y-2">
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
                ${isCollapsed ? 'justify-center px-0' : 'px-4'}
              `}
            >
              <item.icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0`} />

              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <span className="font-medium whitespace-nowrap">{item.label}</span>
                  </motion.div>
                )}
              </AnimatePresence>

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
              ${isCollapsed ? 'justify-center px-0' : 'px-4'}
            `}
          >
            <LogOut className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0`} />

            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <span className="font-medium whitespace-nowrap">Logout</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        initial={false}
        animate={{ marginLeft: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="min-h-screen relative z-10"
      >
        {children}
      </motion.main>
    </div>
  )
}
