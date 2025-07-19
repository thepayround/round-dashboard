import React from 'react'
import { motion } from 'framer-motion'
import { Home, ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
  isActive?: boolean
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  className?: string
}

// Route-based breadcrumb generation
const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  // Route mapping for better labels
  const routeLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    billing: 'Billing',
    invoices: 'Invoices',
    customers: 'Customers',
    'revenue-analytics': 'Revenue Analytics',
    'ai-assistant': 'AI Assistant',
    pricing: 'Pricing',
    integrations: 'Integrations',
    orders: 'Orders',
    products: 'Products',
    quotes: 'Quotes',
    contracts: 'Contracts',
    settings: 'Settings',
    'get-started': 'Get Started',
  }

  // Build breadcrumbs from path segments
  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`

    const isLast = index === segments.length - 1
    const label = routeLabels[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1)

    breadcrumbs.push({
      label,
      href: currentPath, // Always provide href, even for current page
      isActive: isLast,
      icon: segment === 'dashboard' ? Home : undefined,
    })
  })

  return breadcrumbs
}

const BreadcrumbSeparator: React.FC = () => (
  <div className="flex items-center">
    <ChevronRight className="w-4 h-4 text-white/25" />
  </div>
)

const BreadcrumbItem: React.FC<{ item: BreadcrumbItem; index: number }> = ({ item, index }) => {
  const { label, href, icon: Icon, isActive } = item

  const content = (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className={cn(
        'flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 group cursor-pointer',
        isActive
          ? 'bg-gradient-to-r from-[#D417C8]/10 to-[#14BDEA]/10 text-white font-semibold border border-[#D417C8]/20'
          : 'text-white/70 hover:text-white hover:bg-white/8 hover:border-white/10 border border-transparent'
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            'w-4 h-4 transition-all duration-300',
            isActive ? 'text-[#D417C8]' : 'text-white/50 group-hover:text-white/80'
          )}
        />
      )}
      <span className="text-sm font-medium">{label}</span>
      {isActive && (
        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#D417C8] to-[#14BDEA]" />
      )}
    </motion.div>
  )

  // Make ALL items clickable, including current page
  return (
    <Link to={href ?? '#'} className="block">
      {content}
    </Link>
  )
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  const location = useLocation()
  const breadcrumbItems = items ?? generateBreadcrumbs(location.pathname)

  // Always show breadcrumbs, even for single items like dashboard
  return (
    <motion.nav
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn('mb-8', className)}
    >
      {/* Background container with subtle styling */}
      <div className="relative">
        <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-sm rounded-xl border border-white/5" />
        <div className="relative flex items-center space-x-1 px-4 py-3">
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={`${item.label}-${index}`}>
              <BreadcrumbItem item={item} index={index} />
              {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}
