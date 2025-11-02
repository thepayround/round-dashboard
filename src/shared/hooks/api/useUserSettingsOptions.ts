/**
 * User Settings Options hooks for fetching available options from backend
 */

import { useState, useEffect, useCallback } from 'react'

import { httpClient } from '@/shared/services/api/base/client'

// Types for the options responses
export interface TimezoneOption {
  value: string
  label: string
  standardName: string
}

export interface LanguageOption {
  value: string
  label: string
  nativeName: string
}


export interface DateFormatOption {
  value: string
  label: string
  description: string
}

export interface TimeFormatOption {
  value: string
  label: string
  description: string
}


// Shared cache for all options data to prevent multiple API calls
interface OptionsCache {
  timezones: { data: TimezoneOption[], loaded: boolean }
  languages: { data: LanguageOption[], loaded: boolean }
  dateFormats: { data: DateFormatOption[], loaded: boolean }
  timeFormats: { data: TimeFormatOption[], loaded: boolean }
}


const optionsCache: OptionsCache = {
  timezones: { data: [], loaded: false },
  languages: { data: [], loaded: false },
  dateFormats: { data: [], loaded: false },
  timeFormats: { data: [], loaded: false }
}

// Generic hook factory for options with caching
const useOptionsData = <T>(endpoint: string, cacheKey: keyof OptionsCache) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<T[]>((optionsCache as any)[cacheKey].data as T[])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const refetch = useCallback(async () => {
    // If already loaded from cache, don't reload
    if (optionsCache[cacheKey].loaded) {
      setData(optionsCache[cacheKey].data as T[])
      return
    }

    setIsLoading(true)
    setIsError(false)
    
    try {
      const response = await httpClient.getClient().get<T[]>(endpoint)
      const responseData = response.data || []
      
      // Update cache
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(optionsCache as any)[cacheKey] = { data: responseData, loaded: true }
      setData(responseData)
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error)
      setIsError(true)
      setData([])
    } finally {
      setIsLoading(false)
    }
  }, [endpoint, cacheKey])

  useEffect(() => {
    // Only fetch if not already loaded
    if (!optionsCache[cacheKey].loaded) {
      refetch()
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setData((optionsCache as any)[cacheKey].data as T[])
    }
  }, [endpoint, cacheKey, refetch])

  return { data, isLoading, isError, refetch }
}

// Specific hooks for each option type with caching
export const useTimezones = () => useOptionsData<TimezoneOption>('/user-settings/options/timezones', 'timezones')
export const useLanguages = () => useOptionsData<LanguageOption>('/user-settings/options/languages', 'languages')
export const useDateFormats = () => useOptionsData<DateFormatOption>('/user-settings/options/dateformats', 'dateFormats')
export const useTimeFormats = () => useOptionsData<TimeFormatOption>('/user-settings/options/timeformats', 'timeFormats')

// Bulk loader for preloading all options at once
export const usePreloadAllOptions = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const preloadAll = async () => {
    // Check if all options are already loaded
    const allLoaded = Object.values(optionsCache).every(cache => cache.loaded)
    if (allLoaded) {
      return true
    }

    setIsLoading(true)
    setIsError(false)

    try {
      const endpoints = [
        { key: 'timezones' as const, url: '/user-settings/options/timezones' },
        { key: 'languages' as const, url: '/user-settings/options/languages' },
        { key: 'dateFormats' as const, url: '/user-settings/options/dateformats' },
        { key: 'timeFormats' as const, url: '/user-settings/options/timeformats' }
      ]

      // Only fetch endpoints that haven't been loaded yet
      const pendingEndpoints = endpoints.filter(ep => !optionsCache[ep.key].loaded)
      
      if (pendingEndpoints.length === 0) {
        return true
      }

      const promises = pendingEndpoints.map(async ({ key, url }) => {
        try {
          const response = await httpClient.getClient().get(url)
          optionsCache[key] = { data: response.data || [], loaded: true }
          return { key, success: true }
        } catch (error) {
          console.error(`Failed to preload ${key}:`, error)
          return { key, success: false }
        }
      })

      await Promise.all(promises)
      return true
    } catch (error) {
      console.error('Failed to preload user settings options:', error)
      setIsError(true)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    preloadAll()
  }, [])

  return { isLoading, isError, preloadAll }
}

// Helper to clear cache if needed
export const clearOptionsCache = () => {
  Object.keys(optionsCache).forEach(key => {
    optionsCache[key as keyof OptionsCache] = { data: [], loaded: false }
  })
}
