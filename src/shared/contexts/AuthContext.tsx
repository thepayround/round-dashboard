import React, { useReducer, useEffect } from 'react'

import {
  AuthContext,
  type AuthContextType,
  type AuthState,
  type AuthAction,
} from './AuthContextType'

import type { User } from '@/shared/types/auth'
import { tokenManager } from '@/shared/utils/tokenManager'

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
    let isMounted = true

    const checkExistingSession = async () => {
      // Skip session check on public auth pages (login, register)
      const currentPath = window.location.pathname
      const isPublicAuthPage = 
        currentPath.includes('/login') || 
        currentPath.includes('/identities/register') || 
        currentPath.startsWith('/auth/') ||
        currentPath === '/invite' || // Invitation acceptance
        currentPath === '/' // Welcome page

      if (isPublicAuthPage) {
        if (isMounted) {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
        return
      }

      // Check if we have a token in memory
      const token = tokenManager.getAccessToken()

      if (token) {
        // We have a token in memory, validate it by fetching user
        try {
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
            return
          }
        } catch (error) {
          console.error('Error validating session:', error)
        }
      }

      // No token in memory, try to refresh using HttpOnly cookie
      try {
        const { authService } = await import('@/shared/services/api')
        const refreshResponse = await authService.refreshToken()

        if (refreshResponse.success && refreshResponse.data?.token && isMounted) {
          // Store new access token in memory
          tokenManager.setAccessToken(refreshResponse.data.token)

          // Fetch user data
          const userResponse = await authService.getCurrentUser()
          
          if (userResponse.success && userResponse.data && isMounted) {
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                user: userResponse.data,
                token: refreshResponse.data.token,
              },
            })
            return
          }
        }
      } catch (error) {
        // No valid refresh token cookie, user needs to log in
        // Silent fail - this is expected for new users
      }

      if (isMounted) {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    checkExistingSession()

    return () => {
      isMounted = false
    }
  }, [])

  const login = (user: User, token: string, _refreshToken?: string) => {
    // Store access token in memory only (refresh token is in HttpOnly cookie)
    tokenManager.setAccessToken(token)
    
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: { user, token },
    })
  }

  const logout = async () => {
    // Clear access token from memory
    tokenManager.clearAccessToken()
    
    // Call backend to clear HttpOnly cookie
    try {
      const { authService } = await import('@/shared/services/api')
      await authService.logout()
    } catch (error) {
      console.error('Error during logout:', error)
    }
    
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
