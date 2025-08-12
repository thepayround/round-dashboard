/**
 * Currency Context
 * Provides global currency management and formatting functions
 */

/* eslint-disable react-refresh/only-export-components */

import type { ReactNode } from 'react';
import React, { createContext, useContext } from 'react'
import { useCurrency } from '../hooks/useCurrency'
import type { CurrencyInfo } from '../hooks/useCurrency'

interface CurrencyContextType {
  currencies: CurrencyInfo[]
  getCurrencySymbol: (currencyCode: string) => string
  getCurrencyInfo: (currencyCode: string) => CurrencyInfo | null
  formatCurrency: (
    amount: number | string,
    currencyCode: string,
    options?: {
      showSymbol?: boolean
      showCode?: boolean
      decimalPlaces?: number
      locale?: string
    }
  ) => string
  isLoading: boolean
  isError: boolean
}

const CurrencyContext = createContext<CurrencyContextType | null>(null)

interface CurrencyProviderProps {
  children: ReactNode
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const currencyHook = useCurrency()

  const contextValue: CurrencyContextType = {
    currencies: currencyHook.currencies,
    getCurrencySymbol: currencyHook.getCurrencySymbol,
    getCurrencyInfo: currencyHook.getCurrencyInfo,
    formatCurrency: currencyHook.formatCurrency,
    isLoading: currencyHook.isLoading,
    isError: currencyHook.isError
  }

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrencyContext = (): CurrencyContextType => {
  const context = useContext(CurrencyContext)
  
  if (!context) {
    throw new Error('useCurrencyContext must be used within a CurrencyProvider')
  }
  
  return context
}