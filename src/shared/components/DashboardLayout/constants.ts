/**
 * Layout constants following industry best practices
 * Centralized configuration like Vercel and Linear
 */

export const LAYOUT_CONSTANTS = {
  SIDEBAR: {
    WIDTH_COLLAPSED: 80,
    WIDTH_EXPANDED: 280,
    ANIMATION_DURATION: 0.15,
    Z_INDEX_MOBILE: 50,
    Z_INDEX_DESKTOP: 'base' as const
  },
  LOGO: {
    HEIGHT: '97px'
  },
  TOGGLE_BUTTON: {
    TOP_MOBILE: 64, // 16 * 4 (top-16)
    TOP_DESKTOP: 80, // 20 * 4 (top-20)
    OFFSET: 16
  },
  STORAGE: {
    SIDEBAR_STATE_KEY: 'sidebar-collapsed',
    CATALOG_EXPANDED_KEY: 'catalog-expanded'
  },
  ANIMATIONS: {
    EASE: 'easeOut' as const,
    DURATION_FAST: 0.15,
    DURATION_MEDIUM: 0.2
  }
} as const

export type LayoutConstants = typeof LAYOUT_CONSTANTS
