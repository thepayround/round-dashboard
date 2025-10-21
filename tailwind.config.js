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
        // Round Brand Design System - Pure Black with Pink/Cyan/Purple
        bg: {
          DEFAULT: 'hsl(var(--bg))',        // Pure black #000000
          subtle: 'hsl(var(--bg-subtle))',  // #0a0a0a
          raised: 'hsl(var(--bg-raised))',  // #141414
        },
        fg: {
          DEFAULT: 'hsl(var(--fg))',        // Almost white
          muted: 'hsl(var(--fg-muted))',    // Gray
        },
        
        // Your Brand Colors
        primary: {
          DEFAULT: 'hsl(var(--primary))',        // #D417C8 pink
          contrast: 'hsl(var(--accent-contrast))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',      // #14BDEA cyan
          contrast: 'hsl(var(--accent-contrast))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',         // #7767DA purple
          contrast: 'hsl(var(--accent-contrast))',
        },
        
        // Semantic colors
        destructive: 'hsl(var(--destructive))',
        warning: 'hsl(var(--warning))',
        success: 'hsl(var(--success))',
        
        // UI elements
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        card: 'hsl(var(--card))',
        
        // Elevation system
        elev: {
          1: 'hsl(var(--elev-1))',
          2: 'hsl(var(--elev-2))',
        },
      },
      // Minimal - removed gradients per design system
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
      // Dev-SaaS Minimal elevation system (no glass morphism)
      boxShadow: {
        card: '0 6px 18px rgba(0,0,0,.12)',
        hover: '0 8px 24px rgba(0,0,0,.18)',
        focus: '0 0 0 3px hsla(var(--ring) / .35)',
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
      },
      spacing: {
        13: '3.25rem',
        15: '3.75rem',
      },
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(.2,.8,.2,1)',
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
