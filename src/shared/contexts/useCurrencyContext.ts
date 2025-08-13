/**
 * Currency Context Hook
 * Separated from the context provider for better fast refresh support
 */

import { useContext } from 'react'
import CurrencyContext from './CurrencyContext'
import type { CurrencyContextType } from './CurrencyContext'

export const useCurrencyContext = (): CurrencyContextType => {
  const context = useContext(CurrencyContext)
  
  if (!context) {
    throw new Error('useCurrencyContext must be used within a CurrencyProvider')
  }
  
  return context
}
