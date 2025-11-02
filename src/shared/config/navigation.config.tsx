/**
 * Navigation configuration
 * Following industry best practices - external configuration like Vercel, Linear, GitHub
 * 
 * This allows:
 * - Easy modification without touching component code
 * - Role-based navigation (future enhancement)
 * - A/B testing of navigation structure
 * - Dynamic navigation based on feature flags
 */

import {
  LayoutDashboard,
  Users,
  Package,
  Settings,
  PlusCircle,
  HelpCircle,
  ShoppingCart,
  Grid3X3,
} from 'lucide-react'
import type { NavItem } from '@/shared/components/DashboardLayout/types'

export const mainNavigationItems: NavItem[] = [
  {
    id: 'get-started',
    label: 'Get Started',
    icon: PlusCircle,
    href: '/get-started',
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard'
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: Users,
    href: '/customers'
  },
  {
    id: 'catalog',
    label: 'Catalog',
    icon: ShoppingCart,
    href: '/catalog',
    subItems: [
      {
        id: 'product-families',
        label: 'Product Families',
        icon: Grid3X3,
        href: '/catalog'
      },
      {
        id: 'plans',
        label: 'Plans',
        icon: Package,
        href: '/catalog/plans'
      }
    ]
  },
]

export const bottomNavigationItems: NavItem[] = [
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings'
  },
  {
    id: 'help',
    label: 'Help & Support',
    icon: HelpCircle,
    href: '/help'
  },
]

/**
 * Get navigation items based on user permissions (future enhancement)
 * Similar to how Vercel/Linear handle role-based navigation
 */
export const getNavigationForUser = (_userRole?: string): NavItem[] => 
  // Future: Filter navigation based on role
  // For now, return all items
   mainNavigationItems

