/**
 * Layout constants following industry best practices
 * Centralized configuration like Vercel and Linear
 */

export const LAYOUT_CONSTANTS = {
  SIDEBAR: {
    WIDTH_COLLAPSED: 64,
    WIDTH_EXPANDED: 200,
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

/**
 * Animation variants for Framer Motion
 * Centralized for consistency and performance
 */
export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  expandCollapse: {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: 'auto' },
    exit: { opacity: 0, height: 0 },
  },
  tooltip: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  modal: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
  },
} as const

/**
 * Z-index values for layering
 * Centralized to prevent z-index wars
 */
export const Z_INDEX = {
  MOBILE_HEADER: 50,
  SIDEBAR: 40,
  TOOLTIP: 60,
  MODAL: 70,
  DROPDOWN: 55,
} as const
