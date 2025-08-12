/**
 * useRoundAccount - Hook for managing round account data
 */

import { useState, useEffect } from 'react'
import { roundAccountService, type RoundAccountInfo } from '@/shared/services/api/roundAccount.service'

export interface UseRoundAccountResult {
  roundAccount: RoundAccountInfo | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  updateRoundAccount: (data: { accountName?: string; organizationId?: string }) => Promise<boolean>
}

export const useRoundAccount = (): UseRoundAccountResult => {
  const [roundAccount, setRoundAccount] = useState<RoundAccountInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRoundAccount = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await roundAccountService.getCurrentRoundAccount()
      
      if (response.success && response.data) {
        setRoundAccount(response.data)
      } else {
        setError(response.error ?? 'Failed to fetch round account')
        setRoundAccount(null)
      }
    } catch (err) {
      setError('Network error occurred while fetching round account')
      setRoundAccount(null)
    } finally {
      setIsLoading(false)
    }
  }

  const updateRoundAccount = async (data: { accountName?: string; organizationId?: string }): Promise<boolean> => {
    try {
      const response = await roundAccountService.updateRoundAccount(data)
      
      if (response.success) {
        // Refetch the updated data
        await fetchRoundAccount()
        return true
      } else {
        setError(response.error ?? 'Failed to update round account')
        return false
      }
    } catch (err) {
      setError('Network error occurred while updating round account')
      return false
    }
  }

  useEffect(() => {
    fetchRoundAccount()
  }, [])

  return {
    roundAccount,
    isLoading,
    error,
    refetch: fetchRoundAccount,
    updateRoundAccount
  }
}