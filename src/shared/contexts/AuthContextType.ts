import { createContext } from 'react'
import type { User } from '@/shared/types/auth'

// Types
export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_ERROR' }

export interface AuthContextType {
  state: AuthState
  login: (user: User, token: string, refreshToken?: string) => void
  logout: () => void
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
  clearError: () => void
}

// Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined)
