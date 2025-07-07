/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: '#D417C8',
        secondary: '#14BDEA',
        accent: '#7767DA',
        
        // Border colors
        border: 'rgba(255, 255, 255, 0.15)',
        'border-light': 'rgba(255, 255, 255, 0.1)',
        DEFAULT: 'rgba(255, 255, 255, 0.15)',
        
        // Status gradients
        success: {
          from: '#42E695',
          to: '#3BB2B8',
          glass: 'rgba(66, 230, 149, 0.1)',
          text: '#38D39F'
        },
        warning: {
          from: '#FFC107',
          to: '#FF8A00',
          glass: 'rgba(255, 193, 7, 0.1)',
          text: '#FF9F0A'
        },
        error: {
          from: '#FF4E50',
          to: '#F44336',
          glass: 'rgba(244, 67, 54, 0.1)',
          text: '#FF3B30'
        },
        info: {
          from: '#14BDEA',
          to: '#7767DA',
          glass: 'rgba(20, 189, 234, 0.1)',
          text: '#32A1E4'
        },
        
        // Glass morphism colors
        glass: {
          bg: 'rgba(255, 255, 255, 0.08)',
          border: 'rgba(255, 255, 255, 0.15)',
          hover: 'rgba(255, 255, 255, 0.12)',
          'hover-border': 'rgba(255, 255, 255, 0.2)',
          disabled: 'rgba(150, 150, 150, 0.1)',
          'disabled-text': 'rgba(150, 150, 150, 0.5)'
        }
      },
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
        
        // Glass morphism background
        'glass-bg': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.25)',
        'glass-lg': '0 16px 64px 0 rgba(31, 38, 135, 0.5)',
        'inner-glass': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
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
  },
  plugins: [],
}