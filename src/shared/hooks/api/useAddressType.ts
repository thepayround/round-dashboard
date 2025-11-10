/**
 * Address Type API hooks
 */

import { useState, useEffect, useRef } from 'react'

import { addressTypeService } from '../../services/api/addressType.service'
import type { AddressTypeResponse } from '../../types/api/addressType'

// Simple cache to prevent duplicate API calls
const addressTypesCache: {
  data: AddressTypeResponse[] | null
  loading: boolean
  error: string | null
  promise: Promise<AddressTypeResponse[]> | null
} = {
  data: null,
  loading: false,
  error: null,
  promise: null
}

export const useAddressTypes = () => {
  const [addressTypes, setAddressTypes] = useState<AddressTypeResponse[]>(addressTypesCache.data ?? [])
  const [loading, setLoading] = useState(addressTypesCache.loading)
  const [error, setError] = useState<string | null>(addressTypesCache.error)
  const isMountedRef = useRef(true)

  const fetchAddressTypes = async () => {
    // If we already have data, use it
    if (addressTypesCache.data) {
      setAddressTypes(addressTypesCache.data)
      setLoading(false)
      setError(null)
      return
    }

    // If there's already a request in progress, wait for it
    if (addressTypesCache.promise) {
      try {
        const data = await addressTypesCache.promise
        if (isMountedRef.current) {
          setAddressTypes(data)
          setLoading(false)
          setError(null)
        }
      } catch (err) {
        if (isMountedRef.current) {
          setError(err instanceof Error ? err.message : 'Failed to fetch address types')
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
      addressTypesCache.loading = true
      addressTypesCache.error = null
      
      // Create and cache the promise
      addressTypesCache.promise = addressTypeService.getAddressTypes()
      const data = await addressTypesCache.promise
      
      // Cache the result
      addressTypesCache.data = data
      addressTypesCache.loading = false
      addressTypesCache.promise = null
      
      if (isMountedRef.current) {
        setAddressTypes(data)
        setLoading(false)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch address types'
      addressTypesCache.error = errorMessage
      addressTypesCache.loading = false
      addressTypesCache.promise = null
      
      if (isMountedRef.current) {
        setError(errorMessage)
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    isMountedRef.current = true
    fetchAddressTypes()
    
    return () => {
      isMountedRef.current = false
    }
  }, [])

  return { 
    data: addressTypes, 
    isLoading: loading, 
    isError: !!error, 
    refetch: fetchAddressTypes 
  }
}
