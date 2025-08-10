import { useEffect } from 'react'

/**
 * Hook to apply mobile-specific optimizations
 * Handles viewport meta tag, scroll behavior, and touch interactions
 */
export const useMobileOptimizations = () => {
  useEffect(() => {
    // Ensure viewport meta tag for proper mobile scaling
    let viewportMeta = document.querySelector('meta[name="viewport"]')
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta')
      viewportMeta.setAttribute('name', 'viewport')
      document.head.appendChild(viewportMeta)
    }
    viewportMeta.setAttribute(
      'content',
      'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
    )

    // Add touch-action optimization for better scroll performance
    document.body.style.touchAction = 'pan-x pan-y'
    
    // Prevent overscroll on iOS
    document.body.style.overscrollBehavior = 'none'
    
    // Better scroll behavior for touch devices
    if ('ontouchstart' in window) {
      document.body.classList.add('touch-device')
      
      // Add mobile-specific class
      document.documentElement.classList.add('mobile-optimized')
      
      // Prevent zoom on double-tap for better UX
      let lastTouchEnd = 0
      const handleTouchEnd = (e: TouchEvent) => {
        const now = new Date().getTime()
        if (now - lastTouchEnd <= 300) {
          e.preventDefault()
        }
        lastTouchEnd = now
      }
      
      document.addEventListener('touchend', handleTouchEnd, { passive: false })
      
      return () => {
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [])

  // Return utility functions for mobile optimizations
  return {
    // Check if device supports touch
    isTouchDevice: 'ontouchstart' in window,
    
    // Check if device prefers reduced motion
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    
    // Get safe area insets (for devices with notches)
    getSafeAreaInsets: () => ({
      top: getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)') || '0px',
      right: getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-right)') || '0px',
      bottom: getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)') || '0px',
      left: getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-left)') || '0px'
    }),
    
    // Vibrate function (if supported)
    vibrate: (pattern: number | number[]) => {
      if ('vibrate' in navigator) {
        navigator.vibrate(pattern)
      }
    },
    
    // Scroll to top with smooth behavior
    scrollToTop: () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
}