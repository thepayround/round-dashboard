/**
 * Industry API hooks
 */

import { useState, useEffect, useRef } from 'react'

import { industryService } from '../../services/api/industry.service'
import type { IndustryResponse } from '../../types/api/industry'

// Simple cache to prevent duplicate API calls
const industriesCache: {
  data: IndustryResponse[] | null
  loading: boolean
  error: string | null
  promise: Promise<IndustryResponse[]> | null
} = {
  data: null,
  loading: false,
  error: null,
  promise: null
}

export const useIndustries = () => {
  const [industries, setIndustries] = useState<IndustryResponse[]>(industriesCache.data ?? [])
  const [loading, setLoading] = useState(industriesCache.loading)
  const [error, setError] = useState<string | null>(industriesCache.error)
  const isMountedRef = useRef(true)

  const fetchIndustries = async () => {
    // If we already have data, use it
    if (industriesCache.data) {
      setIndustries(industriesCache.data)
      setLoading(false)
      setError(null)
      return
    }

    // If there's already a request in progress, wait for it
    if (industriesCache.promise) {
      try {
        const data = await industriesCache.promise
        if (isMountedRef.current) {
          setIndustries(data)
          setLoading(false)
          setError(null)
        }
      } catch (err) {
        if (isMountedRef.current) {
          setError(err instanceof Error ? err.message : 'Failed to fetch industries')
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
      industriesCache.loading = true
      industriesCache.error = null
      
      // Create and cache the promise
      industriesCache.promise = industryService.getIndustries()
      const data = await industriesCache.promise
      
      // Cache the result
      industriesCache.data = data
      industriesCache.loading = false
      industriesCache.promise = null
      
      if (isMountedRef.current) {
        setIndustries(data)
        setLoading(false)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch industries'
      industriesCache.error = errorMessage
      industriesCache.loading = false
      industriesCache.promise = null
      
      if (isMountedRef.current) {
        setError(errorMessage)
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    isMountedRef.current = true
    fetchIndustries()
    
    return () => {
      isMountedRef.current = false
    }
  }, [])

  return { 
    data: industries, 
    isLoading: loading, 
    isError: !!error, 
    refetch: fetchIndustries 
  }
}
