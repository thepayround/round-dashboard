/**
 * Country Currency API hooks
 */

import { useState, useEffect, useRef } from 'react'
import { countryCurrencyService } from '../../services/api/countryCurrency.service'
import type {
  CountryCurrencyResponse,
  CurrencyResponse,
  CountryResponse,
} from '../../types/api/countryCurrency'

// Simple cache to prevent duplicate API calls
const countriesCache: {
  data: CountryCurrencyResponse[] | null
  loading: boolean
  error: string | null
  promise: Promise<CountryCurrencyResponse[]> | null
} = {
  data: null,
  loading: false,
  error: null,
  promise: null
}

export const useCountries = () => {
  const [countries, setCountries] = useState<CountryCurrencyResponse[]>(countriesCache.data ?? [])
  const [loading, setLoading] = useState(countriesCache.loading)
  const [error, setError] = useState<string | null>(countriesCache.error)
  const isMountedRef = useRef(true)

  const fetchCountries = async () => {
    // If we already have data, use it
    if (countriesCache.data) {
      setCountries(countriesCache.data)
      setLoading(false)
      setError(null)
      return
    }

    // If there's already a request in progress, wait for it
    if (countriesCache.promise) {
      try {
        const data = await countriesCache.promise
        if (isMountedRef.current) {
          setCountries(data)
          setLoading(false)
          setError(null)
        }
      } catch (err) {
        if (isMountedRef.current) {
          setError(err instanceof Error ? err.message : 'Failed to fetch countries')
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
      countriesCache.loading = true
      countriesCache.error = null
      
      // Create and cache the promise
      countriesCache.promise = countryCurrencyService.getCountries()
      const data = await countriesCache.promise
      
      // Cache the result
      countriesCache.data = data
      countriesCache.loading = false
      countriesCache.promise = null
      
      if (isMountedRef.current) {
        setCountries(data)
        setLoading(false)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch countries'
      countriesCache.error = errorMessage
      countriesCache.loading = false
      countriesCache.promise = null
      
      if (isMountedRef.current) {
        setError(errorMessage)
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    isMountedRef.current = true
    fetchCountries()
    
    return () => {
      isMountedRef.current = false
    }
  }, [])

  return { 
    data: countries, 
    isLoading: loading, 
    isError: !!error, 
    refetch: fetchCountries 
  }
}

export const useCountryByCode = (countryCode: string | null) => {
  const [country, setCountry] = useState<CountryResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCountry = async (code: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await countryCurrencyService.getCountryByCode(code)
      setCountry(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch country')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (countryCode) {
      fetchCountry(countryCode)
    }
  }, [countryCode])

  return { country, loading, error, refetch: () => countryCode && fetchCountry(countryCode) }
}

export const useCurrencies = () => {
  const [currencies, setCurrencies] = useState<CurrencyResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCurrencies = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await countryCurrencyService.getCurrencies()
      setCurrencies(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch currencies')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCurrencies()
  }, [])

  return { 
    data: currencies, 
    isLoading: loading, 
    isError: !!error, 
    refetch: fetchCurrencies 
  }
}

export const useCurrencyByCode = (currencyCode: string | null) => {
  const [currency, setCurrency] = useState<CurrencyResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCurrency = async (code: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await countryCurrencyService.getCurrencyByCode(code)
      setCurrency(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch currency')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currencyCode) {
      fetchCurrency(currencyCode)
    }
  }, [currencyCode])

  return { currency, loading, error, refetch: () => currencyCode && fetchCurrency(currencyCode) }
}

export const useCountryCurrencySearch = () => {
  const [results, setResults] = useState<CountryCurrencyResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = async (query: string) => {
    if (!query.trim()) {
      setResults([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await countryCurrencyService.searchCountryCurrency(query)
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    setResults([])
    setError(null)
  }

  return { results, loading, error, search, clearResults }
}