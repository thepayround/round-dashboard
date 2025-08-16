/**
 * useRoundAccount - Hook for managing round account data with caching
 */

import { useState, useEffect } from 'react'
import { roundAccountService, type RoundAccountInfo } from '@/shared/services/api/roundAccount.service'

// Global cache for round account data to prevent multiple API calls
interface RoundAccountCache {
  data: RoundAccountInfo | null
  loaded: boolean
  loading: boolean
  error: string | null
}

let roundAccountCache: RoundAccountCache = {
  data: null,
  loaded: false,
  loading: false,
  error: null
}

// List of active hooks listening for cache updates
const activeHooks = new Set<(cache: RoundAccountCache) => void>()

export interface UseRoundAccountResult {
  roundAccount: RoundAccountInfo | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  updateRoundAccount: (data: { accountName?: string; organizationId?: string }) => Promise<boolean>
}

export const useRoundAccount = (): UseRoundAccountResult => {
  const [roundAccount, setRoundAccount] = useState<RoundAccountInfo | null>(roundAccountCache.data)
  const [isLoading, setIsLoading] = useState(roundAccountCache.loading)
  const [error, setError] = useState<string | null>(roundAccountCache.error)

  const fetchRoundAccount = async () => {
    // If already loaded from cache, don't reload
    if (roundAccountCache.loaded) {
      setRoundAccount(roundAccountCache.data)
      setIsLoading(false)
      setError(roundAccountCache.error)
      return
    }

    // If already loading, don't start another request
    if (roundAccountCache.loading) {
      return
    }

    // Update cache and notify all hooks
    roundAccountCache.loading = true
    roundAccountCache.error = null
    notifyHooks()
    
    try {
      const response = await roundAccountService.getCurrentRoundAccount()
      
      if (response.success && response.data) {
        roundAccountCache.data = response.data
        roundAccountCache.error = null
      } else {
        roundAccountCache.error = response.error ?? 'Failed to fetch round account'
        roundAccountCache.data = null
      }
    } catch (err) {
      roundAccountCache.error = 'Network error occurred while fetching round account'
      roundAccountCache.data = null
    } finally {
      roundAccountCache.loading = false
      roundAccountCache.loaded = true
      notifyHooks()
    }
  }

  const updateRoundAccount = async (data: { accountName?: string; organizationId?: string }): Promise<boolean> => {
    try {
      const response = await roundAccountService.updateRoundAccount(data)
      
      if (response.success) {
        // Clear cache and refetch the updated data
        roundAccountCache.loaded = false
        await fetchRoundAccount()
        return true
      } else {
        const errorMsg = response.error ?? 'Failed to update round account'
        roundAccountCache.error = errorMsg
        notifyHooks()
        return false
      }
    } catch (err) {
      const errorMsg = 'Network error occurred while updating round account'
      roundAccountCache.error = errorMsg
      notifyHooks()
      return false
    }
  }

  // Function to update this hook when cache changes
  const updateHook = (cache: RoundAccountCache) => {
    setRoundAccount(cache.data)
    setIsLoading(cache.loading)
    setError(cache.error)
  }

  useEffect(() => {
    // Register this hook for cache updates
    activeHooks.add(updateHook)
    
    // Load data if not already loaded
    if (!roundAccountCache.loaded && !roundAccountCache.loading) {
      fetchRoundAccount()
    } else {
      // Use cached data immediately
      setRoundAccount(roundAccountCache.data)
      setIsLoading(roundAccountCache.loading)
      setError(roundAccountCache.error)
    }

    // Cleanup on unmount
    return () => {
      activeHooks.delete(updateHook)
    }
  }, [])

  return {
    roundAccount,
    isLoading,
    error,
    refetch: fetchRoundAccount,
    updateRoundAccount
  }
}

// Helper function to notify all active hooks about cache changes
function notifyHooks() {
  activeHooks.forEach(updateHook => {
    updateHook(roundAccountCache)
  })
}

// Helper to clear cache if needed (useful for logout)
export const clearRoundAccountCache = () => {
  roundAccountCache = {
    data: null,
    loaded: false,
    loading: false,
    error: null
  }
  notifyHooks()
}