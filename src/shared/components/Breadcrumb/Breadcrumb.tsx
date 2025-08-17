import React from 'react'
import { motion } from 'framer-motion'
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
    })
  })

  return breadcrumbs
}

const BreadcrumbSeparator: React.FC = () => (
  <span className="text-gray-400 mx-2">/</span>
)

const BreadcrumbItem: React.FC<{ item: BreadcrumbItem; index: number }> = ({ item, index }) => {
  const { label, href, isActive } = item

  const content = (
    <motion.span
      initial={{ opacity: 0, y: -3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        'transition-all duration-200 hover:transition-all',
        isActive
          ? 'text-[#BD2CD0] font-medium drop-shadow-[0_0_8px_rgba(189,44,208,0.6)]'
          : 'text-gray-400 hover:text-gray-200'
      )}
    >
      <span className="text-sm">{label}</span>
    </motion.span>
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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('mb-6', className)}
    >
      <div className="flex items-center flex-wrap">
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={`${item.label}-${index}`}>
            <BreadcrumbItem item={item} index={index} />
            {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </div>
    </motion.nav>
  )
}
