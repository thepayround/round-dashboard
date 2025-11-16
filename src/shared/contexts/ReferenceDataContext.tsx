/* eslint-disable react-refresh/only-export-components */
/**
 * ReferenceDataContext
 *
 * Centralized context for managing static/reference data across the application.
 * Prevents duplicate API calls and provides session storage caching for persistence.
 *
 * Features:
 * - Single source of truth for all reference data
 * - Automatic request deduplication
 * - Session storage persistence
 * - Bulk preloading on app start
 * - Type-safe access via hooks
 *
 * Usage:
 * ```tsx
 * // In App.tsx
 * <ReferenceDataProvider>
 *   <YourApp />
 * </ReferenceDataProvider>
 *
 * // In components
 * const { countries, isLoading } = useReferenceData('countries')
 * const { timezones } = useReferenceData('timezones')
 * ```
 */
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'

import { addressTypeService } from '@/shared/services/api/addressType.service'
import { companySizeService } from '@/shared/services/api/companySize.service'
import { countryCurrencyService } from '@/shared/services/api/countryCurrency.service'
import { industryService } from '@/shared/services/api/industry.service'
import { organizationTypeService } from '@/shared/services/api/organizationType.service'
import type { AddressTypeResponse } from '@/shared/types/api/addressType'
import type { CompanySizeResponse } from '@/shared/types/api/companySize'
import type { CountryCurrencyResponse, CurrencyResponse } from '@/shared/types/api/countryCurrency'
import type { IndustryResponse } from '@/shared/types/api/industry'
import type { OrganizationTypeResponse } from '@/shared/types/api/organizationType'

/**
 * Reference data type definitions
 */
export interface ReferenceData {
  countries: CountryCurrencyResponse[]
  currencies: CurrencyResponse[]
  organizationTypes: OrganizationTypeResponse[]
  industries: IndustryResponse[]
  companySizes: CompanySizeResponse[]
  addressTypes: AddressTypeResponse[]
  teamRoles: RoleOption[]
  timezones: TimezoneOption[]
  languages: LanguageOption[]
  dateFormats: DateFormatOption[]
  timeFormats: TimeFormatOption[]
}

export interface RoleOption {
  value: string
  label: string
  description: string
}

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

export type ReferenceDataType = keyof ReferenceData

/**
 * Loading state for each reference data type
 */
type LoadingState = {
  [K in ReferenceDataType]: boolean
}

/**
 * Error state for each reference data type
 */
type ErrorState = {
  [K in ReferenceDataType]: string | null
}

/**
 * Context value interface
 */
interface ReferenceDataContextValue {
  data: ReferenceData
  loading: LoadingState
  errors: ErrorState
  isLoading: (type: ReferenceDataType) => boolean
  hasError: (type: ReferenceDataType) => boolean
  getError: (type: ReferenceDataType) => string | null
  refresh: (type: ReferenceDataType) => Promise<void>
  refreshAll: () => Promise<void>
  clearCache: (type?: ReferenceDataType) => void
}

const ReferenceDataContext = createContext<ReferenceDataContextValue | undefined>(undefined)

/**
 * Session storage keys for caching
 */
const STORAGE_PREFIX = 'ref_data_'
const STORAGE_TIMESTAMP_PREFIX = 'ref_data_ts_'
const CACHE_DURATION_MS = 30 * 60 * 1000 // 30 minutes

/**
 * Helper to check if cached data is still valid
 */
const isCacheValid = (type: ReferenceDataType): boolean => {
  try {
    const timestamp = sessionStorage.getItem(`${STORAGE_TIMESTAMP_PREFIX}${type}`)
    if (!timestamp) return false

    const age = Date.now() - parseInt(timestamp, 10)
    return age < CACHE_DURATION_MS
  } catch {
    return false
  }
}

/**
 * Helper to get cached data from session storage
 */
const getCachedData = <T,>(type: ReferenceDataType): T[] | null => {
  try {
    if (!isCacheValid(type)) {
      return null
    }

    const cached = sessionStorage.getItem(`${STORAGE_PREFIX}${type}`)
    return cached ? JSON.parse(cached) : null
  } catch {
    return null
  }
}

/**
 * Helper to set cached data in session storage
 */
const setCachedData = <T,>(type: ReferenceDataType, data: T[]): void => {
  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}${type}`, JSON.stringify(data))
    sessionStorage.setItem(`${STORAGE_TIMESTAMP_PREFIX}${type}`, Date.now().toString())
  } catch (error) {
    console.warn(`Failed to cache ${type} data:`, error)
  }
}

/**
 * Helper to clear cached data
 */
const clearCachedData = (type?: ReferenceDataType): void => {
  try {
    if (type) {
      sessionStorage.removeItem(`${STORAGE_PREFIX}${type}`)
      sessionStorage.removeItem(`${STORAGE_TIMESTAMP_PREFIX}${type}`)
    } else {
      // Clear all reference data cache
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith(STORAGE_PREFIX) || key.startsWith(STORAGE_TIMESTAMP_PREFIX)) {
          sessionStorage.removeItem(key)
        }
      })
    }
  } catch (error) {
    console.warn('Failed to clear cache:', error)
  }
}

/**
 * Initial empty state
 */
const createInitialData = (): ReferenceData => ({
  countries: [],
  currencies: [],
  organizationTypes: [],
  industries: [],
  companySizes: [],
  addressTypes: [],
  teamRoles: [],
  timezones: [],
  languages: [],
  dateFormats: [],
  timeFormats: [],
})

const createInitialLoading = (): LoadingState => ({
  countries: false,
  currencies: false,
  organizationTypes: false,
  industries: false,
  companySizes: false,
  addressTypes: false,
  teamRoles: false,
  timezones: false,
  languages: false,
  dateFormats: false,
  timeFormats: false,
})

const createInitialErrors = (): ErrorState => ({
  countries: null,
  currencies: null,
  organizationTypes: null,
  industries: null,
  companySizes: null,
  addressTypes: null,
  teamRoles: null,
  timezones: null,
  languages: null,
  dateFormats: null,
  timeFormats: null,
})

/**
 * Request deduplication - track ongoing promises
 */
const ongoingRequests = new Map<ReferenceDataType, Promise<unknown>>()

/**
 * ReferenceDataProvider Component
 */
interface ReferenceDataProviderProps {
  children: React.ReactNode
  preloadOnMount?: boolean // Whether to preload all data on mount (default: true)
}

export const ReferenceDataProvider: React.FC<ReferenceDataProviderProps> = ({
  children,
  preloadOnMount = true,
}) => {
  const [data, setData] = useState<ReferenceData>(createInitialData)
  const [loading, setLoading] = useState<LoadingState>(createInitialLoading)
  const [errors, setErrors] = useState<ErrorState>(createInitialErrors)

  /**
   * Generic fetch function with caching and deduplication
   */
  const fetchData = useCallback(
    async <T,>(
      type: ReferenceDataType,
      fetcher: () => Promise<T[]>,
      useCache = true
    ): Promise<void> => {
      // Check cache first
      if (useCache) {
        const cached = getCachedData<T>(type)
        if (cached) {
          setData((prev) => ({ ...prev, [type]: cached }))
          return
        }
      }

      // Check for ongoing request
      const ongoing = ongoingRequests.get(type)
      if (ongoing) {
        await ongoing
        return
      }

      // Start loading
      setLoading((prev) => ({ ...prev, [type]: true }))
      setErrors((prev) => ({ ...prev, [type]: null }))

      try {
        const promise = fetcher()
        ongoingRequests.set(type, promise)

        const result = await promise

        setData((prev) => ({ ...prev, [type]: result }))
        setCachedData(type, result)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : `Failed to load ${type}`
        setErrors((prev) => ({ ...prev, [type]: errorMessage }))
        console.error(`Error fetching ${type}:`, error)
      } finally {
        setLoading((prev) => ({ ...prev, [type]: false }))
        ongoingRequests.delete(type)
      }
    },
    []
  )

  /**
   * Individual fetch functions for each data type
   */
  const fetchCountries = useCallback(() => fetchData('countries', () => countryCurrencyService.getCountries()), [fetchData])
  const fetchCurrencies = useCallback(() => fetchData('currencies', () => countryCurrencyService.getCurrencies()), [fetchData])
  const fetchOrganizationTypes = useCallback(
    () =>
      fetchData('organizationTypes', async () => {
        const result = await organizationTypeService.getOrganizationTypes()
        return result.data || []
      }),
    [fetchData]
  )
  const fetchIndustries = useCallback(() => fetchData('industries', () => industryService.getIndustries()), [fetchData])
  const fetchCompanySizes = useCallback(() => fetchData('companySizes', () => companySizeService.getCompanySizes()), [fetchData])
  const fetchAddressTypes = useCallback(() => fetchData('addressTypes', () => addressTypeService.getAddressTypes()), [fetchData])

  const fetchTeamRoles = useCallback(() => {
    return fetchData('teamRoles', async () => {
      try {
        const response = await fetch('/api/team/roles')
        if (!response.ok) throw new Error('Failed to fetch team roles')
        const data = await response.json()
        return data as RoleOption[]
      } catch {
        // Fallback to hardcoded roles if API fails
        return [
          { value: 'Admin', label: 'Administrator', description: 'Full system access and management' },
          { value: 'TeamManager', label: 'Team Manager', description: 'Manage team members and workflows' },
          { value: 'Sales', label: 'Sales', description: 'Manage sales and customer relationships' },
          { value: 'Finance', label: 'Finance', description: 'Access to financial data and reporting' },
          { value: 'Support', label: 'Support', description: 'Customer support and service' },
          { value: 'TeamMember', label: 'Team Member', description: 'Standard team access' },
          { value: 'Viewer', label: 'Viewer', description: 'Read-only access' },
        ]
      }
    })
  }, [fetchData])

  const fetchTimezones = useCallback(() => {
    return fetchData('timezones', async () => {
      const response = await fetch('/api/user-settings/options/timezones')
      if (!response.ok) throw new Error('Failed to fetch timezones')
      return response.json()
    })
  }, [fetchData])

  const fetchLanguages = useCallback(() => {
    return fetchData('languages', async () => {
      const response = await fetch('/api/user-settings/options/languages')
      if (!response.ok) throw new Error('Failed to fetch languages')
      return response.json()
    })
  }, [fetchData])

  const fetchDateFormats = useCallback(() => {
    return fetchData('dateFormats', async () => {
      const response = await fetch('/api/user-settings/options/dateformats')
      if (!response.ok) throw new Error('Failed to fetch date formats')
      return response.json()
    })
  }, [fetchData])

  const fetchTimeFormats = useCallback(() => {
    return fetchData('timeFormats', async () => {
      const response = await fetch('/api/user-settings/options/timeformats')
      if (!response.ok) throw new Error('Failed to fetch time formats')
      return response.json()
    })
  }, [fetchData])

  /**
   * Refresh specific data type
   */
  const refresh = useCallback(
    async (type: ReferenceDataType): Promise<void> => {
      const fetchMap: Record<ReferenceDataType, () => Promise<void>> = {
        countries: fetchCountries,
        currencies: fetchCurrencies,
        organizationTypes: fetchOrganizationTypes,
        industries: fetchIndustries,
        companySizes: fetchCompanySizes,
        addressTypes: fetchAddressTypes,
        teamRoles: fetchTeamRoles,
        timezones: fetchTimezones,
        languages: fetchLanguages,
        dateFormats: fetchDateFormats,
        timeFormats: fetchTimeFormats,
      }

      clearCachedData(type)
      await fetchMap[type]()
    },
    [
      fetchCountries,
      fetchCurrencies,
      fetchOrganizationTypes,
      fetchIndustries,
      fetchCompanySizes,
      fetchAddressTypes,
      fetchTeamRoles,
      fetchTimezones,
      fetchLanguages,
      fetchDateFormats,
      fetchTimeFormats,
    ]
  )

  /**
   * Refresh all data
   */
  const refreshAll = useCallback(async (): Promise<void> => {
    clearCachedData()
    await Promise.all([
      fetchCountries(),
      fetchCurrencies(),
      fetchOrganizationTypes(),
      fetchIndustries(),
      fetchCompanySizes(),
      fetchAddressTypes(),
      fetchTeamRoles(),
      fetchTimezones(),
      fetchLanguages(),
      fetchDateFormats(),
      fetchTimeFormats(),
    ])
  }, [
    fetchCountries,
    fetchCurrencies,
    fetchOrganizationTypes,
    fetchIndustries,
    fetchCompanySizes,
    fetchAddressTypes,
    fetchTeamRoles,
    fetchTimezones,
    fetchLanguages,
    fetchDateFormats,
    fetchTimeFormats,
  ])

  /**
   * Preload all data on mount
   */
  useEffect(() => {
    if (preloadOnMount) {
      refreshAll()
    }
  }, [preloadOnMount, refreshAll])

  /**
   * Context value with memoization
   */
  const value = useMemo<ReferenceDataContextValue>(
    () => ({
      data,
      loading,
      errors,
      isLoading: (type: ReferenceDataType) => loading[type],
      hasError: (type: ReferenceDataType) => errors[type] !== null,
      getError: (type: ReferenceDataType) => errors[type],
      refresh,
      refreshAll,
      clearCache: clearCachedData,
    }),
    [data, loading, errors, refresh, refreshAll]
  )

  return <ReferenceDataContext.Provider value={value}>{children}</ReferenceDataContext.Provider>
}

/**
 * Hook to access reference data
 */
export const useReferenceData = <T extends ReferenceDataType>(
  type: T
): {
  data: ReferenceData[T]
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
} => {
  const context = useContext(ReferenceDataContext)

  if (!context) {
    throw new Error('useReferenceData must be used within ReferenceDataProvider')
  }

  return {
    data: context.data[type],
    isLoading: context.loading[type],
    error: context.errors[type],
    refresh: () => context.refresh(type),
  }
}

/**
 * Hook to access all reference data at once
 */
export const useAllReferenceData = (): ReferenceDataContextValue => {
  const context = useContext(ReferenceDataContext)

  if (!context) {
    throw new Error('useAllReferenceData must be used within ReferenceDataProvider')
  }

  return context
}

/**
 * Convenience hooks for specific data types
 */
export const useCountries = () => useReferenceData('countries')
export const useCurrencies = () => useReferenceData('currencies')
export const useOrganizationTypes = () => useReferenceData('organizationTypes')
export const useIndustries = () => useReferenceData('industries')
export const useCompanySizes = () => useReferenceData('companySizes')
export const useAddressTypes = () => useReferenceData('addressTypes')
export const useTeamRoles = () => useReferenceData('teamRoles')
export const useTimezones = () => useReferenceData('timezones')
export const useLanguages = () => useReferenceData('languages')
export const useDateFormats = () => useReferenceData('dateFormats')
export const useTimeFormats = () => useReferenceData('timeFormats')
