import { useState, useCallback, useRef, TouchEvent } from 'react'

/**
 * Direction of the swipe gesture
 */
export type SwipeDirection = 'left' | 'right' | 'up' | 'down'

/**
 * Options for the useSwipeGesture hook
 */
export interface UseSwipeGestureOptions {
  /** Minimum distance in pixels to trigger a swipe (default: 50) */
  threshold?: number
  /** Minimum velocity to trigger a swipe (default: 0.3) */
  velocityThreshold?: number
  /** Callback when swipe is detected */
  onSwipe?: (direction: SwipeDirection) => void
  /** Callback when swiping (for visual feedback) */
  onSwiping?: (deltaX: number, deltaY: number) => void
  /** Callback when swipe ends */
  onSwipeEnd?: () => void
  /** Whether swipe is enabled (default: true) */
  enabled?: boolean
}

/**
 * Return type for the useSwipeGesture hook
 */
export interface UseSwipeGestureReturn {
  /** Touch start handler */
  onTouchStart: (e: TouchEvent) => void
  /** Touch move handler */
  onTouchMove: (e: TouchEvent) => void
  /** Touch end handler */
  onTouchEnd: (e: TouchEvent) => void
  /** Whether currently swiping */
  isSwiping: boolean
  /** Current swipe delta (for visual feedback) */
  swipeDelta: { x: number; y: number }
}

/**
 * Custom hook to handle swipe gestures on touch devices
 * 
 * Detects swipe direction based on touch events and provides callbacks
 * for swipe detection and visual feedback during swiping.
 * 
 * Features:
 * - Configurable swipe threshold and velocity
 * - Real-time swipe feedback (delta values)
 * - Prevents accidental swipes (minimum distance & velocity)
 * - Can be disabled when not needed
 * 
 * @param options - Configuration options
 * @returns Touch event handlers and swipe state
 * 
 * @example
 * ```tsx
 * const { onTouchStart, onTouchMove, onTouchEnd, isSwiping } = useSwipeGesture({
 *   threshold: 50,
 *   onSwipe: (direction) => {
 *     if (direction === 'left') closeSidebar()
 *     if (direction === 'right') openSidebar()
 *   },
 *   onSwiping: (deltaX) => {
 *     // Update sidebar position during swipe
 *     setSidebarOffset(deltaX)
 *   }
 * })
 * ```
 */
export function useSwipeGesture({
  threshold = 50,
  velocityThreshold = 0.3,
  onSwipe,
  onSwiping,
  onSwipeEnd,
  enabled = true
}: UseSwipeGestureOptions = {}): UseSwipeGestureReturn {
  const [isSwiping, setIsSwiping] = useState(false)
  const [swipeDelta, setSwipeDelta] = useState({ x: 0, y: 0 })
  
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const touchMoveRef = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return
    
    const touch = e.touches[0]
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }
    touchMoveRef.current = null
    setIsSwiping(false)
    setSwipeDelta({ x: 0, y: 0 })
  }, [enabled])

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || !touchStartRef.current) return
    
    const touch = e.touches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y
    
    touchMoveRef.current = { x: touch.clientX, y: touch.clientY }
    
    // Start swiping if moved enough
    if (!isSwiping && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
      setIsSwiping(true)
    }
    
    // Update delta for visual feedback
    if (isSwiping) {
      setSwipeDelta({ x: deltaX, y: deltaY })
      onSwiping?.(deltaX, deltaY)
    }
  }, [enabled, isSwiping, onSwiping])

  const onTouchEnd = useCallback(() => {
    if (!enabled || !touchStartRef.current) return
    
    const endTouch = touchMoveRef.current || {
      x: touchStartRef.current.x,
      y: touchStartRef.current.y
    }
    
    const deltaX = endTouch.x - touchStartRef.current.x
    const deltaY = endTouch.y - touchStartRef.current.y
    const deltaTime = Date.now() - touchStartRef.current.time
    
    // Calculate velocity (pixels per millisecond)
    const velocityX = Math.abs(deltaX) / deltaTime
    const velocityY = Math.abs(deltaY) / deltaTime
    
    // Determine swipe direction
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)
    
    let direction: SwipeDirection | null = null
    
    // Horizontal swipe
    if (absX > absY && absX > threshold && velocityX > velocityThreshold) {
      direction = deltaX > 0 ? 'right' : 'left'
    }
    // Vertical swipe
    else if (absY > absX && absY > threshold && velocityY > velocityThreshold) {
      direction = deltaY > 0 ? 'down' : 'up'
    }
    
    // Trigger callback if swipe detected
    if (direction) {
      onSwipe?.(direction)
    }
    
    // Reset state
    setIsSwiping(false)
    setSwipeDelta({ x: 0, y: 0 })
    touchStartRef.current = null
    touchMoveRef.current = null
    onSwipeEnd?.()
  }, [enabled, threshold, velocityThreshold, onSwipe, onSwipeEnd])

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isSwiping,
    swipeDelta
  }
}
