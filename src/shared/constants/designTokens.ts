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

    // Border colors
    border: {
      DEFAULT: '#333333', // Default borders
      hover: '#404040', // Hover state borders
      light: 'rgba(255, 255, 255, 0.1)', // Light borders (10%)
      lighter: 'rgba(255, 255, 255, 0.2)', // Lighter borders (20%)
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

    // Validation colors
    validation: {
      error: '#EF4444', // red-500
      errorBg: 'rgba(239, 68, 68, 0.12)', // Error background
      success: '#42E695', // Success green - matches CSS variable
      warning: '#F59E0B', // amber-500
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
   * Typography
   */
  typography: {
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
    letterSpacing: {
      tight: '-0.01em',
      normal: '0em',
      wide: '0.05em',
    },
  },

  /**
   * Spacing
   */
  spacing: {
    // Input heights
    inputHeight: {
      sm: '2rem', // 32px
      md: '2.25rem', // 36px (default)
      lg: '2.5rem', // 40px
    },

    // Padding
    inputPadding: {
      x: '0.75rem', // 12px horizontal
      withIconLeft: '2.25rem', // 36px when icon on left
      withIconRight: '2.25rem', // 36px when icon on right
    },

    // Icon positioning
    iconPosition: {
      left: '0.75rem', // 12px from left
      right: '0.75rem', // 12px from right
    },

    // Card padding (responsive)
    cardPadding: {
      mobile: {
        y: '1.25rem', // 20px
        x: '1rem', // 16px
      },
      tablet: {
        y: '1.5rem', // 24px
        x: '1.25rem', // 20px
      },
      desktop: {
        y: '1.75rem', // 28px
        x: '1.5rem', // 24px
      },
    },
  },

  /**
   * Border Radius
   */
  borderRadius: {
    sm: '4px',
    md: '0.5rem', // 8px - consistent across all components
    lg: '8px', // Same as md for consistency
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
   * Shadows
   */
  shadows: {
    card: `
      0 4px 24px rgba(0, 0, 0, 0.15),
      0 2px 12px rgba(0, 0, 0, 0.1),
      0 1px 4px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.04),
      inset 0 -1px 0 rgba(255, 255, 255, 0.02)
    `,
    text: '0 1px 3px rgba(0, 0, 0, 0.3)',
    textStrong: '0 1px 3px rgba(0, 0, 0, 0.6)',
    focus: '0 0 0 3px rgba(20, 189, 234, 0.5)', // Primary focus ring
    focusError: '0 0 0 3px rgba(239, 68, 68, 0.25)', // Error focus ring
    glow: {
      primary: '0 0 8px rgba(20, 189, 234, 0.3)',
      accent: `
        0 0 8px rgba(212, 23, 200, 0.6),
        0 0 16px rgba(212, 23, 200, 0.4),
        0 0 24px rgba(212, 23, 200, 0.2),
        0 2px 4px rgba(0, 0, 0, 0.3)
      `,
    },
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
   */
  authInput: `
    w-full h-9 px-3
    bg-[#171719] border border-[#333333] rounded-lg
    text-white placeholder:text-[#737373]
    font-light text-xs tracking-tight
    transition-all duration-200
    outline-none appearance-none
    hover:border-[#404040]
    focus:border-[#14BDEA] focus:bg-[#171719]
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
   */
  authLink: `
    text-[#14BDEA]/90 font-semibold no-underline
    transition-all duration-300
    hover:text-[#14BDEA] hover:-translate-y-px
    focus-visible:outline-2 focus-visible:outline-[#14BDEA]/50
    focus-visible:outline-offset-2 focus-visible:rounded-lg
  `,

  /**
   * Primary button (Tailwind equivalent of .btn-primary)
   */
  btnPrimary: `
    bg-[#D417C8] text-white font-medium
    h-9 px-4 rounded-lg border-0
    inline-flex items-center justify-center
    text-sm whitespace-nowrap
    transition-colors duration-200
    hover:bg-[#E02DD8]
    disabled:bg-[#525252] disabled:opacity-50 disabled:cursor-not-allowed
  `,

  /**
   * Secondary button (Tailwind equivalent of .btn-secondary)
   */
  btnSecondary: `
    bg-transparent text-white font-medium
    h-9 px-4 border border-[#333333] rounded-lg
    inline-flex items-center justify-center
    text-sm whitespace-nowrap
    transition-colors duration-200
    hover:bg-white/5
    disabled:border-[#262626] disabled:text-[#525252] disabled:opacity-50 disabled:cursor-not-allowed
  `,

  /**
   * Ghost button (Tailwind equivalent of .btn-ghost)
   */
  btnGhost: `
    bg-transparent text-[#A3A3A3] font-medium
    h-9 px-4 border-0 rounded-lg
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
   */
  inputError: `
    border-[#EF4444] bg-[#EF4444]/10
    focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/25
  `,

  /**
   * Auth card (Tailwind equivalent of .auth-card)
   */
  authCard: `
    bg-white/[0.02] border border-white/10 rounded-lg
    p-5 md:p-6 lg:p-7
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
