/**
 * Authentication hooks
 */

import { useState } from 'react'
import type { ApiResponse, AuthResponse } from '@/shared/types/api'
import { authService } from '@/shared/services/api'

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (credentials: {
    email: string
    password: string
  }): Promise<ApiResponse<AuthResponse>> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await authService.login(credentials)
      if (!result.success) {
        setError(result.error ?? 'Login failed')
      }
      return result
    } catch (err) {
      const errorMessage = 'An unexpected error occurred'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    userName?: string
  }) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await authService.register(userData)
      if (!result.success) {
        setError(result.error ?? 'Registration failed')
      }
      return result
    } catch (err) {
      const errorMessage = 'An unexpected error occurred'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await authService.logout()
      if (!result.success) {
        setError(result.error ?? 'Logout failed')
      }
      return result
    } catch (err) {
      const errorMessage = 'An unexpected error occurred'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const confirmEmail = async (userId: string, token: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await authService.confirmEmail(userId, token)
      if (!result.success) {
        setError(result.error ?? 'Email confirmation failed')
      }
      return result
    } catch (err) {
      const errorMessage = 'An unexpected error occurred'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const confirmEmailAndLogin = async (userId: string, token: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await authService.confirmEmailAndLogin(userId, token)
      if (!result.success) {
        setError(result.error ?? 'Email confirmation failed')
      }
      return result
    } catch (err) {
      const errorMessage = 'An unexpected error occurred'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const resendConfirmationEmail = async (email: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await authService.resendConfirmationEmail(email)
      if (!result.success) {
        setError(result.error ?? 'Failed to resend confirmation email')
      }
      return result
    } catch (err) {
      const errorMessage = 'An unexpected error occurred'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentUser = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await authService.getCurrentUser()
      if (!result.success) {
        setError(result.error ?? 'Failed to get user information')
      }
      return result
    } catch (err) {
      const errorMessage = 'An unexpected error occurred'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const refreshToken = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await authService.refreshToken()
      if (!result.success) {
        setError(result.error ?? 'Token refresh failed')
      }
      return result
    } catch (err) {
      const errorMessage = 'An unexpected error occurred'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => setError(null)

  return {
    // State
    isLoading,
    error,

    // Methods
    login,
    register,
    logout,
    confirmEmail,
    confirmEmailAndLogin,
    resendConfirmationEmail,
    getCurrentUser,
    refreshToken,
    clearError,

    // Utilities
    isAuthenticated: authService.isAuthenticated,
    getToken: authService.getToken,
  }
}
