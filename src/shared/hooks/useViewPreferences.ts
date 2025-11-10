import { useState, useEffect } from 'react'

import type { ViewMode } from '@/shared/ui/ViewModeToggle'

interface ViewPreferences {
  viewMode: ViewMode
  itemsPerPage: number
  sortField: string
  sortDirection: 'asc' | 'desc'
}

const DEFAULT_PREFERENCES: ViewPreferences = {
  viewMode: 'table',
  itemsPerPage: 12,
  sortField: 'displayName',
  sortDirection: 'asc'
}

const STORAGE_KEY = 'customer-page-preferences'

export const useViewPreferences = () => {
  const [preferences, setPreferences] = useState<ViewPreferences>(DEFAULT_PREFERENCES)

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed })
      }
    } catch (error) {
      console.warn('Failed to load view preferences:', error)
    }
  }, [])

  // Save preferences to localStorage whenever they change
  const updatePreferences = (updates: Partial<ViewPreferences>) => {
    const newPreferences = { ...preferences, ...updates }
    setPreferences(newPreferences)
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences))
    } catch (error) {
      console.warn('Failed to save view preferences:', error)
    }
  }

  return {
    preferences,
    updatePreferences,
    setViewMode: (viewMode: ViewMode) => updatePreferences({ viewMode }),
    setItemsPerPage: (itemsPerPage: number) => updatePreferences({ itemsPerPage }),
    setSortConfig: (sortField: string, sortDirection: 'asc' | 'desc') => 
      updatePreferences({ sortField, sortDirection })
  }
}
