import { useState, useEffect } from 'react'

export interface BreakpointState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isLargeDesktop: boolean
  width: number
  height: number
}

export const useResponsive = (): BreakpointState => {
  const [dimensions, setDimensions] = useState<BreakpointState>(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024
    const height = typeof window !== 'undefined' ? window.innerHeight : 768
    
    return {
      width,
      height,
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024 && width < 1280,
      isLargeDesktop: width >= 1280,
    }
  })

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleResize = () => {
      // Debounce resize events to avoid excessive re-renders
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const width = window.innerWidth
        const height = window.innerHeight
        
        setDimensions({
          width,
          height,
          isMobile: width < 768,
          isTablet: width >= 768 && width < 1024,
          isDesktop: width >= 1024 && width < 1280,
          isLargeDesktop: width >= 1280,
        })
      }, 150)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
      handleResize() // Initial call
      
      return () => {
        window.removeEventListener('resize', handleResize)
        clearTimeout(timeoutId)
      }
    }
  }, [])

  return dimensions
}

// Additional responsive utilities
export const useIsMobile = (): boolean => {
  const { isMobile } = useResponsive()
  return isMobile
}

export const useIsTablet = (): boolean => {
  const { isTablet } = useResponsive()
  return isTablet
}

export const useIsDesktop = (): boolean => {
  const { isDesktop, isLargeDesktop } = useResponsive()
  return isDesktop || isLargeDesktop
}

// Viewport-based conditional rendering hook
export const useViewport = (breakpoint: 'mobile' | 'tablet' | 'desktop' | 'large') => {
  const responsive = useResponsive()
  
  switch (breakpoint) {
    case 'mobile':
      return responsive.isMobile
    case 'tablet':
      return responsive.isTablet
    case 'desktop':
      return responsive.isDesktop
    case 'large':
      return responsive.isLargeDesktop
    default:
      return false
  }
}