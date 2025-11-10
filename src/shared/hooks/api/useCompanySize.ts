/**
 * Company Size API hooks
 */

import { useState, useEffect, useRef } from 'react'

import { companySizeService } from '../../services/api/companySize.service'
import type { CompanySizeResponse } from '../../types/api/companySize'

// Simple cache to prevent duplicate API calls
const companySizesCache: {
  data: CompanySizeResponse[] | null
  loading: boolean
  error: string | null
  promise: Promise<CompanySizeResponse[]> | null
} = {
  data: null,
  loading: false,
  error: null,
  promise: null
}

export const useCompanySizes = () => {
  const [companySizes, setCompanySizes] = useState<CompanySizeResponse[]>(companySizesCache.data ?? [])
  const [loading, setLoading] = useState(companySizesCache.loading)
  const [error, setError] = useState<string | null>(companySizesCache.error)
  const isMountedRef = useRef(true)

  const fetchCompanySizes = async () => {
    // If we already have data, use it
    if (companySizesCache.data) {
      setCompanySizes(companySizesCache.data)
      setLoading(false)
      setError(null)
      return
    }

    // If there's already a request in progress, wait for it
    if (companySizesCache.promise) {
      try {
        const data = await companySizesCache.promise
        if (isMountedRef.current) {
          setCompanySizes(data)
          setLoading(false)
          setError(null)
        }
      } catch (err) {
        if (isMountedRef.current) {
          setError(err instanceof Error ? err.message : 'Failed to fetch company sizes')
          setLoading(false)
        }
      }
      return
    }

    try {
      if (isMountedRef.current) {
        setLoading(true)
        setError(null)
      }
      companySizesCache.loading = true
      companySizesCache.error = null
      
      // Create and cache the promise
      companySizesCache.promise = companySizeService.getCompanySizes()
      const data = await companySizesCache.promise
      
      // Cache the result
      companySizesCache.data = data
      companySizesCache.loading = false
      companySizesCache.promise = null
      
      if (isMountedRef.current) {
        setCompanySizes(data)
        setLoading(false)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch company sizes'
      companySizesCache.error = errorMessage
      companySizesCache.loading = false
      companySizesCache.promise = null
      
      if (isMountedRef.current) {
        setError(errorMessage)
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    isMountedRef.current = true
    fetchCompanySizes()
    
    return () => {
      isMountedRef.current = false
    }
  }, [])

  return { 
    data: companySizes, 
    isLoading: loading, 
    isError: !!error, 
    refetch: fetchCompanySizes 
  }
}
