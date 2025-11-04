/**
 * DashboardLayout - Index file for cleaner imports
 * Following industry best practices from Vercel, Linear, GitHub
 * 
 * Usage:
 * import DashboardLayout, { LAYOUT_CONSTANTS, type NavItem } from '@/shared/components/DashboardLayout'
 */

export { DashboardLayout as default } from '../DashboardLayout'
export { LAYOUT_CONSTANTS, ANIMATION_VARIANTS, Z_INDEX } from './constants'
export { NavigationItem } from './NavigationItem'
export { SidebarHeader } from './SidebarHeader'
export { SidebarFooter } from './SidebarFooter'
export type { 
  DashboardLayoutProps, 
  NavItem, 
  UserInfo, 
  TooltipState, 
  LayoutConfig 
} from './types'
export { DEFAULT_LAYOUT_CONFIG } from './types'
