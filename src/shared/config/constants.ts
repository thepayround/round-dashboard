/**
 * Centralized Application Constants
 * 
 * All magic numbers, strings, and configuration values should be defined here
 * to ensure consistency and maintainability across the application.
 */

export const CONSTANTS = {
  // UI Layout
  SIDEBAR: {
    WIDTH_COLLAPSED: 80,
    WIDTH_EXPANDED: 280,
    TRANSITION_DURATION: 150,
  },

  // Timing
  DEBOUNCE: {
    SEARCH: 300,
    INPUT: 500,
    RESIZE: 150,
  },

  ANIMATION: {
    FAST: 150,
    NORMAL: 200,
    SLOW: 300,
  },

  // Colors (Tailwind color values)
  COLORS: {
    PRIMARY: '#D417C8',
    SECONDARY: '#14BDEA',
    ACCENT: '#7767DA',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    DANGER: '#EF4444',
    INFO: '#3B82F6',
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
    MAX_VISIBLE_PAGES: 7,
  },

  // Form Validation
  VALIDATION: {
    PASSWORD_MIN_LENGTH: 8,
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 30,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
  },

  // File Upload
  FILE_UPLOAD: {
    MAX_SIZE_MB: 10,
    MAX_SIZE_BYTES: 10 * 1024 * 1024,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'text/plain'],
  },

  // API
  API: {
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
  },

  // Cache
  CACHE: {
    DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
    SHORT_TTL: 60 * 1000, // 1 minute
    LONG_TTL: 30 * 60 * 1000, // 30 minutes
  },

  // Modal Z-Index
  Z_INDEX: {
    DROPDOWN: 40,
    MODAL_OVERLAY: 50,
    MODAL_CONTENT: 51,
    TOAST: 60,
    TOOLTIP: 70,
  },

  // Breakpoints (matches Tailwind config)
  BREAKPOINTS: {
    XS: 475,
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },

  // Date/Time Formats
  DATE_FORMATS: {
    DISPLAY: 'MMM DD, YYYY',
    DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
    ISO: 'YYYY-MM-DD',
    TIME_ONLY: 'HH:mm',
  },

  // Local Storage Keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_PREFERENCES: 'user_preferences',
    THEME: 'theme',
    SIDEBAR_STATE: 'sidebar_collapsed',
  },

  // Feature Flags
  FEATURES: {
    ENABLE_ANALYTICS: import.meta.env.VITE_FEATURE_ANALYTICS === 'true',
    ENABLE_CHAT_SUPPORT: import.meta.env.VITE_FEATURE_CHAT === 'true',
    ENABLE_NOTIFICATIONS: import.meta.env.VITE_FEATURE_NOTIFICATIONS === 'true',
  },

  // Customer Status
  CUSTOMER_STATUS: {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    SUSPENDED: 'Suspended',
    CANCELLED: 'Cancelled',
  },

  // Keyboard Shortcuts
  KEYBOARD: {
    SIDEBAR_TOGGLE: 'Ctrl+Shift+B',
    SEARCH: 'Ctrl+K',
    SAVE: 'Ctrl+S',
    ESCAPE: 'Escape',
  },
} as const

// Type-safe access to constants
export type Constants = typeof CONSTANTS

// Export individual constant groups for convenience
export const { SIDEBAR, DEBOUNCE, COLORS, PAGINATION, VALIDATION, BREAKPOINTS } = CONSTANTS

