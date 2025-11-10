/**
 * Type definitions for DashboardLayout component
 * Following industry best practices from Linear, Vercel, and GitHub
 */

export interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  badge?: string
  subItems?: NavItem[]
}

export interface UserInfo {
  firstName?: string
  lastName?: string
  email?: string
  role?: string
  company?: string
}

export interface TooltipState {
  id: string
  label: string
  badge?: string
  position: { top: number; left: number }
  isUser?: boolean
  userInfo?: UserInfo
}

export interface DashboardLayoutProps {
  children: React.ReactNode
  navigationItems?: NavItem[]
  bottomNavigationItems?: NavItem[]
  config?: LayoutConfig
}

export interface LayoutConfig {
  sidebar: {
    collapsible: boolean
    defaultCollapsed: boolean
    persistState: boolean
    width: {
      collapsed: number
      expanded: number
    }
  }
  breadcrumbs: {
    enabled: boolean
  }
  userMenu: {
    showSettings: boolean
    showHelp: boolean
    customItems?: Array<{
      id: string
      label: string
      icon?: React.ComponentType<{ className?: string }>
      onClick: () => void
    }>
  }
  keyboardShortcuts: {
    enabled: boolean
  }
}

export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  sidebar: {
    collapsible: true,
    defaultCollapsed: false,
    persistState: true,
    width: {
      collapsed: 80,
      expanded: 280
    }
  },
  breadcrumbs: {
    enabled: true
  },
  userMenu: {
    showSettings: true,
    showHelp: true
  },
  keyboardShortcuts: {
    enabled: true
  }
}
