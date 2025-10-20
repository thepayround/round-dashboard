/**
 * Tailwind CSS Configuration for Round Dashboard
 *
 * PURPOSE:
 * Tailwind CSS is a utility-first CSS framework that provides low-level utility classes
 * to build custom designs. This config customizes Tailwind to match Round's design system.
 *
 * WHEN TO MODIFY:
 * - Adding new brand colors or design tokens
 * - Creating custom components or utilities
 * - Integrating with design systems
 * - Adding responsive breakpoints
 * - Customizing spacing, typography, or shadows
 *
 * CONFIGURATION OPTIONS:
 * - content: Files to scan for class names (enables purging unused CSS)
 * - darkMode: Dark mode strategy ('media', 'class', 'selector')
 * - theme: Customize or extend default theme (colors, spacing, fonts, etc.)
 * - plugins: Add functionality (@tailwindcss/forms, @tailwindcss/typography, etc.)
 * - corePlugins: Enable/disable core utilities
 * - variants: Configure responsive, hover, focus variants
 *
 * ALTERNATIVE CONFIGURATIONS:
 * - For component libraries: Add safelist for dynamic classes
 * - For better performance: Configure purge options more specifically
 * - For custom design systems: Completely override default theme
 * - For plugins: Add @tailwindcss/forms, @tailwindcss/typography, @tailwindcss/aspect-ratio
 */

/** @type {import('tailwindcss').Config} */
export default {
  // Files to scan for Tailwind classes (enables CSS purging in production)
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // Add additional paths if needed:
    // "./components/**/*.{js,ts,jsx,tsx}",
    // "./pages/**/*.{js,ts,jsx,tsx}",
  ],

  // Dark mode configuration
  darkMode: 'class', // Use 'class' strategy (toggle via class on html/body)

  // Theme customization
  theme: {
    // Custom responsive breakpoints
    screens: {
      'xs': '475px',    // Extra small devices
      'sm': '640px',    // Small devices (landscape phones, 640px and up)
      'md': '768px',    // Medium devices (tablets, 768px and up)
      'lg': '1024px',   // Large devices (desktops, 1024px and up)
      'xl': '1280px',   // Extra large devices (large desktops, 1280px and up)
      '2xl': '1536px',  // 2X large devices (larger desktops, 1536px and up)
    },
    // Extend default theme (keeps defaults + adds custom)
    extend: {
      colors: {
        // Round Brand Colors
        primary: '#D417C8', // Pink - Primary brand color
        secondary: '#14BDEA', // Cyan - Secondary brand color
        accent: '#7767DA', // Purple - Accent color

        white: '#fafafa', // Softer white instead of pure #ffffff
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a1a1aa', // secondary text
          500: '#71717a', // tertiary text
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        },

        // Neutral scale
        'bg-primary': '#000000',
        'bg-secondary': '#0a0a0a',
        'bg-tertiary': '#141414',
        'bg-elevated': '#1a1a1a',
        
        'border-subtle': '#262626',
        'border-default': '#333333',
        'border-strong': '#404040',
        
        'text-primary': '#fafafa',
        'text-secondary': '#a1a1aa',
        'text-tertiary': '#71717a',
        'text-disabled': '#52525b',

        // Legacy glass morphism support (deprecated - migrate to solid colors)
        border: '#333333',
        'border-light': '#262626',
        DEFAULT: '#333333',

        // Status colors - solid approach
        success: {
          DEFAULT: '#42E695',
          light: '#3BB2B8',
          bg: 'rgba(66, 230, 149, 0.1)',
          text: '#38D39F',
        },
        warning: {
          DEFAULT: '#FFC107',
          light: '#FF8A00',
          bg: 'rgba(255, 193, 7, 0.1)',
          text: '#FF9F0A',
        },
        error: {
          DEFAULT: '#FF4E50',
          light: '#F44336',
          bg: 'rgba(244, 67, 54, 0.1)',
          text: '#FF3B30',
        },
        info: {
          DEFAULT: '#14BDEA',
          light: '#7767DA',
          bg: 'rgba(20, 189, 234, 0.1)',
          text: '#32A1E4',
        },
      },
      // Custom background gradients
      backgroundImage: {
        // Brand gradients
        'gradient-primary': 'linear-gradient(135deg, #D417C8 0%, #14BDEA 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #14BDEA 0%, #7767DA 100%)',
        'gradient-accent': 'linear-gradient(135deg, #7767DA 0%, #D417C8 100%)',

        // Status gradients
        'gradient-success': 'linear-gradient(135deg, #42E695 0%, #3BB2B8 100%)',
        'gradient-warning': 'linear-gradient(135deg, #FFC107 0%, #FF8A00 100%)',
        'gradient-error': 'linear-gradient(135deg, #FF4E50 0%, #F44336 100%)',
        'gradient-info': 'linear-gradient(135deg, #14BDEA 0%, #7767DA 100%)',

        // Glass morphism backgrounds
        'glass-bg':
          'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },
      // Custom font family
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Primary font stack
        // Add custom fonts:
        // mono: ['Fira Code', 'monospace'],
        // serif: ['Georgia', 'serif'],
      },
      // Polar.sh inspired font weights
      fontWeight: {
        thin: '200',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
        normal: '0',
        wide: '0.01em',
        wider: '0.02em',
        widest: '0.03em',
      },
      // Custom backdrop blur values for glass effects
      backdropBlur: {
        xs: '2px', // Extra small blur
        sm: '4px', // Small blur
        md: '8px', // Medium blur
        lg: '12px', // Large blur
        xl: '16px', // Extra large blur
        '2xl': '24px', // 2x large blur
        '3xl': '40px', // 3x large blur
      },
      // Premium box shadows for glass morphism
      boxShadow: {
        // Refined glass shadows - more subtle and premium
        glass: '0 4px 20px 0 rgba(0, 0, 0, 0.15)', // Default premium glass shadow
        'glass-sm': '0 2px 8px 0 rgba(0, 0, 0, 0.08)', // Small premium shadow
        'glass-md': '0 4px 12px 0 rgba(0, 0, 0, 0.12)', // Medium premium shadow
        'glass-lg': '0 8px 24px 0 rgba(0, 0, 0, 0.18)', // Large premium shadow
        'glass-xl': '0 12px 32px 0 rgba(0, 0, 0, 0.22)', // Extra large premium shadow
        'inner-glass': 'inset 0 1px 2px 0 rgba(255, 255, 255, 0.06)', // Subtle inner glow
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)', // Top inner glow
        // Business card shadows
        'card-premium': '0 2px 12px 0 rgba(0, 0, 0, 0.08), 0 1px 3px 0 rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 20px 0 rgba(0, 0, 0, 0.12), 0 2px 6px 0 rgba(0, 0, 0, 0.06)',
        // Button shadows
        'btn-premium': '0 2px 6px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'btn-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)',
      },
      // Custom animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out', // Fade in animation
        'slide-up': 'slideUp 0.3s ease-out', // Slide up animation
        'slide-down': 'slideDown 0.3s ease-out', // Slide down animation
        'scale-in': 'scaleIn 0.2s ease-out', // Scale in animation
      },
      // Custom keyframes for animations
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
    // Complete theme override (uncomment to replace defaults entirely):
    // colors: { /* custom colors only */ },
    // spacing: { /* custom spacing only */ },
    // screens: { /* custom breakpoints only */ },
  },

  // Plugins extend Tailwind with additional utilities
  plugins: [
    // Popular plugins to consider:
    // require('@tailwindcss/forms'),        // Better form styling
    // require('@tailwindcss/typography'),   // Rich text styling
    // require('@tailwindcss/aspect-ratio'), // Aspect ratio utilities
    // require('@tailwindcss/container-queries'), // Container queries
  ],

  // Advanced configuration options:
  // corePlugins: {
  //   preflight: false,  // Disable Tailwind's base styles
  // },
  // prefix: 'tw-',      // Add prefix to all utilities
  // important: true,    // Make all utilities !important
  // separator: '_',     // Change separator (default is ':')
  // safelist: [         // Always include these classes
  //   'bg-red-500',
  //   'text-3xl',
  //   { pattern: /bg-(red|green|blue)-(100|200|300)/ }
  // ],
}
