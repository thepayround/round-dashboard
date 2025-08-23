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

        // Glass morphism border colors
        border: 'rgba(255, 255, 255, 0.15)', // Default border
        'border-light': 'rgba(255, 255, 255, 0.1)', // Light border
        DEFAULT: 'rgba(255, 255, 255, 0.15)', // Default fallback

        // Status colors with gradient support
        success: {
          from: '#42E695', // Green gradient start
          to: '#3BB2B8', // Green gradient end
          glass: 'rgba(66, 230, 149, 0.1)', // Glass effect background
          text: '#38D39F', // Text color
        },
        warning: {
          from: '#FFC107', // Yellow gradient start
          to: '#FF8A00', // Orange gradient end
          glass: 'rgba(255, 193, 7, 0.1)', // Glass effect background
          text: '#FF9F0A', // Text color
        },
        error: {
          from: '#FF4E50', // Red gradient start
          to: '#F44336', // Red gradient end
          glass: 'rgba(244, 67, 54, 0.1)', // Glass effect background
          text: '#FF3B30', // Text color
        },
        info: {
          from: '#14BDEA', // Blue gradient start
          to: '#7767DA', // Purple gradient end
          glass: 'rgba(20, 189, 234, 0.1)', // Glass effect background
          text: '#32A1E4', // Text color
        },

        // Premium glass morphism effect colors
        glass: {
          bg: 'rgba(255, 255, 255, 0.04)', // Subtle premium background
          'bg-light': 'rgba(255, 255, 255, 0.06)', // Slightly more visible
          'bg-medium': 'rgba(255, 255, 255, 0.08)', // Medium visibility
          border: 'rgba(255, 255, 255, 0.1)', // Subtle border
          'border-light': 'rgba(255, 255, 255, 0.12)', // Light border
          'border-medium': 'rgba(255, 255, 255, 0.15)', // Medium border
          hover: 'rgba(255, 255, 255, 0.08)', // Hover state
          'hover-border': 'rgba(255, 255, 255, 0.18)', // Hover border
          focus: 'rgba(255, 255, 255, 0.12)', // Focus state
          'focus-border': 'rgba(20, 189, 234, 0.3)', // Focus border with brand color
          disabled: 'rgba(150, 150, 150, 0.08)', // Disabled state
          'disabled-text': 'rgba(150, 150, 150, 0.4)', // Disabled text
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
