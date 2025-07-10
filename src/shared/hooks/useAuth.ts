import { useContext } from 'react'
import { AuthContext, type AuthContextType } from '@/shared/contexts/AuthContextType'

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Helper hooks for common patterns
export const useAuthState = () => {
  const { state } = useAuth()
  return state
}

export const useAuthActions = () => {
  const { login, logout, setUser, setLoading, clearError } = useAuth()
  return { login, logout, setUser, setLoading, clearError }
}
