/**
 * Design Tokens
 * Centralized design system values for consistent styling across the application
 * These tokens are used in Tailwind config and component styling
 */

export const designTokens = {
  /**
   * Color Palette
   */
  colors: {
    // Primary brand colors
    primary: {
      DEFAULT: '#14BDEA', // Cyan - primary links, focus states
      hover: '#17D1FF',
    },
    accent: {
      DEFAULT: '#D417C8', // Magenta - primary actions, buttons
      hover: '#E02DD8',
    },

    // Background colors
    background: {
      primary: '#0A0A0A', // Main app background
      secondary: '#171719', // Input backgrounds, cards
      tertiary: '#1F1F21', // Hover states
    },

    // Border colors (more subtle like polar.sh)
    border: {
      DEFAULT: '#333333', // Default borders
      subtle: 'rgba(255, 255, 255, 0.08)', // Very subtle borders (8%)
      light: 'rgba(255, 255, 255, 0.1)', // Light borders (10%)
      lighter: 'rgba(255, 255, 255, 0.15)', // Lighter borders (15%)
      hover: '#404040', // Hover state borders
    },

    // Subtle gray scale (polar.sh inspired)
    gray: {
      50: '#FAFAFA', // Very light background (light mode)
      100: '#F5F5F5', // Card backgrounds, hover states (light mode)
      200: '#E5E5E5', // Borders (light mode)
      300: '#D4D4D4', // Muted borders (light mode)
      600: '#737373', // Secondary text
      700: '#525252', // Body text (dark mode)
      800: '#404040', // Muted elements (dark mode)
      900: '#262626', // Deep dark (dark mode)
    },

    // Text colors
    text: {
      primary: 'rgba(255, 255, 255, 1)', // Primary white text
      secondary: 'rgba(255, 255, 255, 0.9)', // Slightly dimmed white
      muted: 'rgba(255, 255, 255, 0.85)', // Muted text
      disabled: 'rgba(255, 255, 255, 0.6)', // Disabled/placeholder text
      placeholder: '#737373', // Input placeholder
    },

    // Icon colors
    icon: {
      DEFAULT: 'rgba(255, 255, 255, 0.6)', // Default icons
      primary: '#C084FC', // Purple accent for primary icons
      hover: 'rgba(255, 255, 255, 0.9)', // Hover state
    },

    // Validation colors (more muted like polar.sh)
    validation: {
      error: '#DC2626', // red-600 - More muted red
      errorBg: 'rgba(220, 38, 38, 0.1)', // Error background
      success: '#059669', // emerald-600 - More muted green
      successBg: 'rgba(5, 150, 105, 0.1)', // Success background
      warning: '#D97706', // amber-600 - More muted yellow
      warningBg: 'rgba(217, 119, 6, 0.1)', // Warning background
      info: '#2563EB', // blue-600 - Information
      infoBg: 'rgba(37, 99, 235, 0.1)', // Info background
    },

    // Button colors
    button: {
      primary: '#D417C8',
      primaryHover: '#E02DD8',
      secondary: 'transparent',
      secondaryBorder: '#333333',
      ghost: 'transparent',
      ghostText: '#A3A3A3',
      disabled: '#525252',
    },
  },

  /**
   * Typography - Compact Polar.sh Inspired
   */
  typography: {
    fontSize: {
      tiny: '0.625rem', // 10px - Very small labels
      xs: '0.6875rem', // 11px - Small text, badges
      sm: '0.8125rem', // 13px - Body text, inputs
      base: '0.875rem', // 14px - Standard text
      md: '0.9375rem', // 15px - Emphasized text
      lg: '1rem', // 16px - Headings (h3)
      xl: '1.125rem', // 18px - Headings (h2)
      '2xl': '1.25rem', // 20px - Headings (h1)
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      snug: 1.4, // Polar.sh style tight line height
      normal: 1.5,
      relaxed: 1.75,
    },
    letterSpacing: {
      tighter: '-0.02em',
      tight: '-0.01em',
      normal: '0em',
      wide: '0.01em',
      wider: '0.05em',
    },
  },

  /**
   * Spacing - Compact Polar.sh Inspired
   */
  spacing: {
    // Base spacing scale (tighter than default)
    scale: {
      xs: '0.125rem', // 2px - Minimal spacing
      sm: '0.25rem', // 4px - Tight spacing
      md: '0.5rem', // 8px - Standard spacing
      lg: '0.75rem', // 12px - Comfortable spacing
      xl: '1rem', // 16px - Section spacing
      '2xl': '1.5rem', // 24px - Large section spacing
    },

    // Input heights (reduced from current)
    inputHeight: {
      sm: '1.75rem', // 28px - Compact inputs
      md: '2.25rem', // 36px - Standard inputs (reduced from 40px)
      lg: '2.5rem', // 40px - Large inputs
    },

    // Padding (reduced for compact design)
    inputPadding: {
      x: '0.75rem', // 12px horizontal
      y: '0.5rem', // 8px vertical (compact)
      withIconLeft: '2rem', // 32px when icon on left
      withIconRight: '2rem', // 32px when icon on right
    },

    // Icon positioning
    iconPosition: {
      left: '0.75rem', // 12px from left
      right: '0.75rem', // 12px from right
    },

    // Card padding (single value, not responsive)
    cardPadding: {
      compact: '0.75rem', // 12px - Very compact cards
      default: '1rem', // 16px - Standard cards (reduced from 24px)
      comfortable: '1.5rem', // 24px - Spacious cards
    },

    // Table spacing (new for compact tables)
    table: {
      cellPaddingX: '1rem', // 16px (reduced from 24px)
      cellPaddingY: '0.75rem', // 12px (reduced from 16px)
      rowHeight: '3rem', // 48px (reduced from 72px)
      headerHeight: '2.5rem', // 40px - Compact header
    },

    // Button padding (compact)
    button: {
      paddingX: '1rem', // 16px (reduced from 24px)
      paddingY: '0.5rem', // 8px (reduced from 12px)
      height: '2.25rem', // 36px (reduced from 44px)
    },

    // Modal spacing (compact)
    modal: {
      paddingX: '1.25rem', // 20px (reduced from 24px)
      paddingY: '1rem', // 16px (reduced from 24px)
      headerPaddingY: '0.75rem', // 12px (reduced from 16px)
      footerPaddingY: '0.75rem', // 12px (reduced from 16px)
    },
  },

  /**
   * Border Radius - Simplified and Refined
   */
  borderRadius: {
    sm: '0.25rem', // 4px - Small elements
    md: '0.375rem', // 6px - Standard elements (buttons, inputs)
    lg: '0.5rem', // 8px - Cards, modals
    xl: '0.75rem', // 12px - Large containers
  },

  /**
   * Transitions
   */
  transitions: {
    duration: {
      fast: '0.15s',
      normal: '0.2s',
      slow: '0.3s',
    },
    easing: {
      DEFAULT: 'ease',
      in: 'ease-in',
      out: 'ease-out',
      inOut: 'ease-in-out',
    },
  },

  /**
   * Shadows - Minimal and Subtle (Polar.sh Style)
   */
  shadows: {
    // Minimal shadows for clean look
    subtle: '0 1px 2px rgba(0, 0, 0, 0.05)',
    card: '0 2px 8px rgba(0, 0, 0, 0.08)',
    cardHover: '0 4px 12px rgba(0, 0, 0, 0.12)',
    modal: '0 8px 24px rgba(0, 0, 0, 0.15)',

    // Refined focus rings (thinner, 1px instead of 3px)
    focus: '0 0 0 1px rgba(20, 189, 234, 0.4)', // Primary focus ring (thinner)
    focusError: '0 0 0 1px rgba(220, 38, 38, 0.4)', // Error focus ring (thinner)
    focusSuccess: '0 0 0 1px rgba(5, 150, 105, 0.4)', // Success focus ring

    // Text shadows (minimal)
    text: '0 1px 2px rgba(0, 0, 0, 0.2)',

    // No heavy glow effects in polar.sh style
  },

  /**
   * Z-Index Scale
   */
  zIndex: {
    background: -10,
    base: 1,
    dropdown: 10,
    sticky: 100,
    fixed: 1000,
    modalBackdrop: 9998,
    modal: 9999,
    popover: 10000,
    tooltip: 10001,
  },
} as const

/**
 * Utility class name generators for common patterns
 */
export const classPatterns = {
  /**
   * Auth input base classes (Tailwind equivalent of .auth-input)
   * Updated for compact design system
   */
  authInput: `
    w-full h-9 px-4
    bg-input border border-[#333333] rounded-md
    text-white placeholder:text-muted-foreground
    font-light text-xs tracking-tight
    transition-all duration-200
    outline-none appearance-none
    hover:border-[#404040]
    focus:border-[#14BDEA] focus:bg-input
    disabled:opacity-50 disabled:cursor-not-allowed
  `,

  /**
   * Auth input with left icon
   */
  authInputWithLeftIcon: 'pl-9',

  /**
   * Auth input with right icon
   */
  authInputWithRightIcon: 'pr-9',

  /**
   * Auth label (Tailwind equivalent of .auth-label)
   */
  authLabel: `
    block text-sm font-normal text-white/90 mb-2
    tracking-tight
  `,

  /**
   * Auth link (Tailwind equivalent of .auth-link)
   * Updated for compact design system
   */
  authLink: `
    text-[#14BDEA]/90 font-semibold no-underline
    transition-all duration-300
    hover:text-[#14BDEA] hover:-translate-y-px
    focus-visible:outline-2 focus-visible:outline-[#14BDEA]/50
    focus-visible:outline-offset-2 focus-visible:rounded-md
  `,

  /**
   * Primary button (Tailwind equivalent of .btn-primary)
   * Updated for compact design system
   */
  btnPrimary: `
    bg-primary text-white font-medium
    h-9 px-4 rounded-md border-0
    inline-flex items-center justify-center
    text-sm whitespace-nowrap
    transition-colors duration-200
    hover:bg-[#E02DD8]
    disabled:bg-[#525252] disabled:opacity-50 disabled:cursor-not-allowed
  `,

  /**
   * Secondary button (Tailwind equivalent of .btn-secondary)
   * Updated for compact design system
   */
  btnSecondary: `
    bg-transparent text-white font-medium
    h-9 px-4 border border-[#333333] rounded-md
    inline-flex items-center justify-center
    text-sm whitespace-nowrap
    transition-colors duration-200
    hover:bg-white/5
    disabled:border-[#262626] disabled:text-[#525252] disabled:opacity-50 disabled:cursor-not-allowed
  `,

  /**
   * Ghost button (Tailwind equivalent of .btn-ghost)
   * Updated for compact design system
   */
  btnGhost: `
    bg-transparent text-[#A3A3A3] font-medium
    h-9 px-4 border-0 rounded-md
    inline-flex items-center justify-center
    text-sm whitespace-nowrap
    transition-colors duration-200
    hover:bg-white/5
    disabled:text-[#525252] disabled:opacity-50 disabled:cursor-not-allowed
  `,

  /**
   * Input container (Tailwind equivalent of .input-container)
   */
  inputContainer: 'relative',

  /**
   * Input icon left (Tailwind equivalent of .input-icon-left)
   */
  inputIconLeft: `
    absolute left-3 top-1/2 -translate-y-1/2 z-10
    flex items-center justify-center
  `,

  /**
   * Input icon right (Tailwind equivalent of .input-icon-right)
   */
  inputIconRight: `
    absolute right-3 top-1/2 -translate-y-1/2 z-10
    flex items-center justify-center
    cursor-pointer transition-colors duration-200
    hover:text-white/90
  `,

  /**
   * Icon base styles
   */
  authIcon: 'w-4 h-4 text-white/60 z-10',

  /**
   * Primary icon (Tailwind equivalent of .auth-icon-primary)
   */
  authIconPrimary: 'w-4 h-4 text-[#C084FC] z-10',

  /**
   * Validation error text
   */
  validationError: 'text-[#EF4444] font-medium',

  /**
   * Input error state
   * Updated for compact design system
   */
  inputError: `
    border-[#DC2626] bg-[#DC2626]/10
    focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]/25
  `,

  /**
   * Auth card (Tailwind equivalent of .auth-card)
   */
  authCard: `
    bg-white/[0.02] border border-border rounded-lg
    p-6
    relative overflow-hidden z-10
    transition-all duration-150
  `,

  /**
   * Auth container (Tailwind equivalent of .auth-container)
   */
  authContainer: `
    relative min-h-screen
    flex items-center justify-center
    pb-12 z-[1]
  `,

  /**
   * Auth background (Tailwind equivalent of .auth-background)
   */
  authBackground: `
    fixed inset-0 -z-10
    overflow-hidden pointer-events-none
  `,

  /**
   * Brand primary text
   */
  brandPrimary: 'text-[#14BDEA]/90',

  /**
   * Brand accent text
   */
  brandAccent: 'text-[#D417C8]/90',

  /**
   * Text muted
   */
  textMuted: 'text-white/85',

  /**
   * Auth divider
   */
  authDivider: `
    relative flex items-center justify-center my-6
    before:content-[''] before:flex-1 before:h-px
    before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent before:mr-4
    after:content-[''] after:flex-1 after:h-px
    after:bg-gradient-to-r after:from-transparent after:via-white/15 after:to-transparent after:ml-4
  `,
} as const

/**
 * Type-safe access to design tokens
 */
export type DesignTokens = typeof designTokens
export type ClassPatterns = typeof classPatterns
