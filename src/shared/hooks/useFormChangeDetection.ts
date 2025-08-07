import { useRef, useCallback } from 'react'

/**
 * Hook to detect if form data has actually changed
 * Prevents unnecessary API calls when data hasn't been modified
 */
export function useFormChangeDetection<T>() {
  const previousDataRef = useRef<T | null>(null)

  const hasChanged = useCallback((currentData: T): boolean => {
    if (previousDataRef.current === null) {
      // First time - consider it as changed to allow initial save
      previousDataRef.current = currentData
      return true
    }

    // Deep comparison of objects
    const hasDataChanged = !deepEqual(previousDataRef.current, currentData)
    
    if (hasDataChanged) {
      previousDataRef.current = currentData
    }
    
    return hasDataChanged
  }, [])

  const resetTracking = useCallback((newData?: T) => {
    previousDataRef.current = newData ?? null
  }, [])

  return { hasChanged, resetTracking }
}

/**
 * Deep equality check for objects
 * Handles nested objects, arrays, and primitive values
 */
function deepEqual(obj1: unknown, obj2: unknown): boolean {
  if (obj1 === obj2) {
    return true
  }

  if (obj1 == null || obj2 == null) {
    return obj1 === obj2
  }

  if (typeof obj1 !== typeof obj2) {
    return false
  }

  if (typeof obj1 !== 'object') {
    return obj1 === obj2
  }

  if (Array.isArray(obj1) !== Array.isArray(obj2)) {
    return false
  }

  if (Array.isArray(obj1)) {
    const arr2 = obj2 as unknown[]
    if (obj1.length !== arr2.length) {
      return false
    }
    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], arr2[i])) {
        return false
      }
    }
    return true
  }

  const keys1 = Object.keys(obj1 as Record<string, unknown>)
  const keys2 = Object.keys(obj2 as Record<string, unknown>)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (!(key in (obj2 as Record<string, unknown>))) {
      return false
    }
    if (!deepEqual((obj1 as Record<string, unknown>)[key], (obj2 as Record<string, unknown>)[key])) {
      return false
    }
  }

  return true
}