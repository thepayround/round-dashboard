// Enhanced responsive utilities for professional responsive design

export const BREAKPOINTS = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export type Breakpoint = keyof typeof BREAKPOINTS

// Responsive value type for component props
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>

// Type guard to check if value is responsive object
function isResponsiveObject<T>(value: ResponsiveValue<T>): value is Partial<Record<Breakpoint, T>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// Helper to resolve responsive values
export function resolveResponsiveValue<T>(
  value: ResponsiveValue<T>,
  currentBreakpoint: Breakpoint
): T {
  if (!isResponsiveObject(value)) {
    return value as T
  }

  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint)
  
  // Find the closest defined value at or below current breakpoint
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i]
    if (bp in value && value[bp] !== undefined) {
      return value[bp] as T
    }
  }
  
  // Fallback to first available value
  for (const bp of breakpointOrder) {
    if (bp in value && value[bp] !== undefined) {
      return value[bp] as T
    }
  }
  
  throw new Error('No responsive value found')
}

// CSS Custom Properties approach for dynamic theming
export const generateResponsiveCSS = (
  property: string,
  values: ResponsiveValue<string | number>
): Record<string, unknown> => {
  if (!isResponsiveObject(values)) {
    return { [property]: values }
  }

  const styles: Record<string, unknown> = {}
  
  Object.entries(values).forEach(([breakpoint, value]) => {
    const bp = breakpoint as Breakpoint
    const minWidth = BREAKPOINTS[bp]
    
    if (bp === 'xs') {
      styles[property] = value
    } else {
      const mediaQuery = `@media (min-width: ${minWidth}px)`
      styles[mediaQuery] = {
        [property]: value
      }
    }
  })
  
  return styles
}

// Container queries helper (for future use)
export const containerQuery = (minWidth: number, styles: Record<string, unknown>) => ({
  [`@container (min-width: ${minWidth}px)`]: styles
})

// Usage examples:
/*
// Example 1: Responsive component prop
interface CardProps {
  padding?: ResponsiveValue<string>
}

const Card = ({ padding = 'md' }: CardProps) => {
  const { width } = useResponsive()
  const currentBreakpoint = width >= 1280 ? 'xl' : width >= 1024 ? 'lg' : width >= 768 ? 'md' : 'sm'
  const resolvedPadding = resolveResponsiveValue(padding, currentBreakpoint)
  return <div className={`p-${resolvedPadding}`} />
}

// Example 2: CSS generation
const responsiveStyles = generateResponsiveCSS('padding', {
  xs: '1rem',
  md: '2rem',
  lg: '3rem'
})
// Result: { padding: '1rem', '@media (min-width: 768px)': { padding: '2rem' }, ... }
*/