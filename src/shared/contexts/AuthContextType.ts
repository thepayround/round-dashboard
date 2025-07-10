import { createContext } from 'react'
import type { MockUser } from '@/shared/services/mockApi'

// Types
export interface AuthState {
  isAuthenticated: boolean
  user: Omit<MockUser, 'password'> | null
  token: string | null
  isLoading: boolean
  error: string | null
}

export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: Omit<MockUser, 'password'>; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: Omit<MockUser, 'password'> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_ERROR' }

export interface AuthContextType {
  state: AuthState
  login: (user: Omit<MockUser, 'password'>, token: string) => void
  logout: () => void
  setUser: (user: Omit<MockUser, 'password'>) => void
  setLoading: (loading: boolean) => void
  clearError: () => void
}

// Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined)
