/**
 * Currency utility hook
 * Provides easy access to currency symbols and formatting functions
 */

import { useMemo, useCallback } from 'react'

import { useCurrencies } from './api/useCountryCurrency'
export interface CurrencyInfo {
  code: string
  name: string
  symbol: string
  decimalPrecision: number
  unicodeDecimal?: number[]
  unicodeHex?: string[]
}

export const useCurrency = () => {
  const { data: currencies, isLoading, isError } = useCurrencies()

  // Create a map for fast currency lookup by code
  const currencyMap = useMemo(() => {
    const map = new Map<string, CurrencyInfo>()
        
    if (currencies) {
      currencies.forEach(currency => {
        map.set(currency.currencyCodeAlpha, {
          code: currency.currencyCodeAlpha,
          name: currency.currencyName,
          symbol: currency.currencySymbol,
          decimalPrecision: currency.decimalPrecision,
          unicodeDecimal: currency.unicodeDecimal,
          unicodeHex: currency.unicodeHex
        })
      })
    }
    
    // console.log('Currency map built:', { mapSize: map.size, sampleEntries: Array.from(map.entries()).slice(0, 3) })
    return map
  }, [currencies])

  const getCurrencySymbol = useCallback((currencyCode: string): string => {
    const currency = currencyMap.get(currencyCode)
    const symbol = currency?.symbol ?? currencyCode
    // console.log('getCurrencySymbol:', { currencyCode, currency, symbol, mapSize: currencyMap.size })
    return symbol
  }, [currencyMap])

  const getCurrencyInfo = useCallback((currencyCode: string): CurrencyInfo | null => 
    currencyMap.get(currencyCode) ?? null, [currencyMap])

  const formatCurrency = useCallback((
    amount: number | string, 
    currencyCode: string, 
    options?: {
      showSymbol?: boolean
      showCode?: boolean
      decimalPlaces?: number
      locale?: string
    }
  ): string => {
    const {
      showSymbol = true,
      showCode = false,
      decimalPlaces,
      locale = 'en-US'
    } = options ?? {}

    const currency = currencyMap.get(currencyCode)
    const symbol = currency?.symbol ?? currencyCode
    const precision = decimalPlaces ?? currency?.decimalPrecision ?? 2

    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

    if (isNaN(numAmount)) {
      return showSymbol ? `${symbol}0` : '0'
    }

    const formattedNumber = new Intl.NumberFormat(locale, {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision
    }).format(numAmount)

    let result = formattedNumber

    if (showSymbol) {
      result = `${symbol}${formattedNumber}`
    }

    if (showCode) {
      result = `${result} ${currencyCode}`
    }

    return result
  }, [currencyMap])

  const getCurrenciesList = useCallback((): CurrencyInfo[] => 
    Array.from(currencyMap.values()).sort((a, b) => a.name.localeCompare(b.name)), [currencyMap])

  return {
    currencies: getCurrenciesList(),
    currencyMap,
    getCurrencySymbol,
    getCurrencyInfo,
    formatCurrency,
    isLoading,
    isError
  }
}

export default useCurrency