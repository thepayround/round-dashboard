import { memo, useMemo } from 'react'
import { stagger, useAnimate } from 'framer-motion'
import { useEffect } from 'react'

interface CardGridProps {
  children: React.ReactNode[]
  columns?: 1 | 2 | 3 | 4 | 6
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  animate?: boolean
  staggerDelay?: number
  className?: string
}

const gapVariants = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12'
}

const columnVariants = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
}

const CardGridComponent = ({
  children,
  columns = 3,
  gap = 'lg',
  animate = true,
  staggerDelay = 0.1,
  className = ''
}: CardGridProps) => {
  const [scope, animateGrid] = useAnimate()

  // Safe children array handling
  const childrenArray = useMemo(() => 
    Array.isArray(children) ? children : [children].filter(Boolean),
    [children]
  )

  useEffect(() => {
    if (animate && childrenArray.length > 0) {
      animateGrid(
        '.card-item',
        { opacity: [0, 1], y: [20, 0] },
        { delay: stagger(staggerDelay), duration: 0.4 }
      )
    }
  }, [animate, animateGrid, childrenArray.length, staggerDelay])

  if (childrenArray.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-400">
        No cards to display
      </div>
    )
  }

  return (
    <div 
      ref={scope}
      className={`grid ${columnVariants[columns]} ${gapVariants[gap]} ${className}`}
    >
      {childrenArray.map((child: React.ReactNode, index: number) => (
        <div
          key={index}
          className={animate ? 'card-item opacity-0' : 'card-item'}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

export const CardGrid = memo(CardGridComponent)