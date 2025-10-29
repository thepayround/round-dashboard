import React, { useReducer, useEffect } from 'react'
import type { User } from '@/shared/types/auth'
import { tokenManager } from '@/shared/utils/tokenManager'
import {
  AuthContext,
  type AuthContextType,
  type AuthState,
  type AuthAction,
} from './AuthContextType'

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: true, // Start with loading to check for existing session
  error: null,
}

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        error: null,
      }

    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        error: action.payload,
      }

    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        error: null,
      }

    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}

// Provider component
interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check for existing session on mount
  useEffect(() => {
    let isMounted = true // Prevent duplicate calls

    const checkExistingSession = async () => {
      const token = tokenManager.getToken()

      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false })
        return
      }

      try {
        // Import authService here to avoid circular dependency
        const { authService } = await import('@/shared/services/api')
        const response = await authService.getCurrentUser()

        if (response.success && response.data && isMounted) {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: response.data,
              token,
            },
          })
        } else if (isMounted) {
          // Invalid token, remove from storage
          localStorage.removeItem('auth_token')
          localStorage.removeItem('refresh_token')
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        console.error('Error checking session:', error)
        if (isMounted) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('refresh_token')
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      }
    }

    checkExistingSession()

    return () => {
      isMounted = false // Cleanup to prevent duplicate calls
    }
  }, [])

  const login = (user: User, token: string, refreshToken?: string) => {
    localStorage.setItem('auth_token', token)
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken)
    }
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: { user, token },
    })
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    
    // Clear round account cache on logout
    import('@/shared/hooks/useRoundAccount').then(({ clearRoundAccountCache }) => {
      clearRoundAccountCache()
    })
    
    dispatch({ type: 'LOGOUT' })
  }

  const setUser = (user: User) => {
    dispatch({ type: 'SET_USER', payload: user })
  }

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value: AuthContextType = {
    state,
    login,
    logout,
    setUser,
    setLoading,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
