import { useContext } from 'react'

import type { AuthContextType } from '@/shared/contexts/AuthContextType'
import { AuthContext } from '@/shared/contexts/AuthContextType'

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
