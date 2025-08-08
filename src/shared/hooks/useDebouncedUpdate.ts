import { useCallback, useRef } from 'react'

/**
 * Hook to debounce function calls to prevent excessive API requests
 * @param fn Function to debounce
 * @param delay Delay in milliseconds (default: 1000ms)
 * @returns Debounced function and cancel function
 */
export function useDebouncedUpdate<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 1000
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      // Cancel previous timeout if it exists
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        fn(...args)
      }, delay)
    },
    [fn, delay]
  )

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const flush = useCallback(
    (...args: Parameters<T>) => {
      cancel()
      fn(...args)
    },
    [fn, cancel]
  )

  return { debouncedFn, cancel, flush }
}