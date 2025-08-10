import { useState, useEffect, useCallback, useMemo } from 'react'

interface UseDebouncedSearchProps<T> {
  items: T[]
  searchFields: (item: T) => string[]
  debounceMs?: number
  filters?: Record<string, unknown>
  filterFn?: (item: T, filters: Record<string, unknown>) => boolean
}

interface UseDebouncedSearchReturn<T> {
  searchQuery: string
  setSearchQuery: (query: string) => void
  filteredItems: T[]
  isSearching: boolean
  clearSearch: () => void
  totalCount: number
  filteredCount: number
}

/**
 * Focus-safe debounced search hook
 * 
 * Provides debounced search functionality while maintaining input focus stability.
 * Uses stable state management and optimized filtering to prevent re-render issues.
 */
export function useDebouncedSearch<T>({
  items,
  searchFields,
  debounceMs = 300,
  filters = {},
  filterFn
}: UseDebouncedSearchProps<T>): UseDebouncedSearchReturn<T> {
  // Search query state - stable reference
  const [searchQuery, setSearchQuery] = useState('')
  
  // Debounced query for filtering
  const debouncedQuery = useDebounce(searchQuery, debounceMs)
  
  // Simple searching state
  const isSearching = searchQuery !== debouncedQuery && searchQuery.trim() !== ''
  
  // Memoized search function with performance optimizations
  const searchItems = useCallback((items: T[], query: string, filters: Record<string, unknown>) => {
    let result = items
    
    // Apply search filter with performance optimizations
    if (query.trim()) {
      const lowercaseQuery = query.toLowerCase().trim()
      
      // Early return if query is too short
      if (lowercaseQuery.length < 1) return result
      
      result = result.filter(item => {
        try {
          const fieldsToSearch = searchFields(item)
            .filter(field => field != null && field !== '')
            .join(' ')
            .toLowerCase()
          return fieldsToSearch.includes(lowercaseQuery)
        } catch (error) {
          console.warn('Search error for item:', item, error)
          return false
        }
      })
    }
    
    // Apply additional filters
    if (filterFn && Object.keys(filters).length > 0) {
      result = result.filter(item => {
        try {
          return filterFn(item, filters)
        } catch (error) {
          console.warn('Filter error for item:', item, error)
          return false
        }
      })
    }
    
    return result
  }, [searchFields, filterFn])
  
  // Memoized filtered results
  const filteredItems = useMemo(() => searchItems(items, debouncedQuery, filters), [items, debouncedQuery, filters, searchItems])
  
  // Clear search function
  const clearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])
  
  return {
    searchQuery,
    setSearchQuery,
    filteredItems,
    isSearching,
    clearSearch,
    totalCount: items.length,
    filteredCount: filteredItems.length
  }
}

/**
 * Simple debounce hook for search queries
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}