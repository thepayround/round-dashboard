/**
 * Centralized Error Handling Utilities
 * Provides consistent error handling and user feedback across the application
 */

import type { AxiosError } from 'axios'

export interface ApiErrorResponse {
  message?: string
  error?: string
  errors?: Array<{ code: string; description: string }>
}

/**
 * Extract error message from various error formats
 */
export const getErrorMessage = (error: unknown, defaultMessage = 'An error occurred'): string => {
  if (!error) return defaultMessage

  // Axios error
  if (typeof error === 'object' && error !== null && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<ApiErrorResponse>
    
    // Check for response data
    if (axiosError.response?.data) {
      const {data} = axiosError.response
      
      // Handle array of errors (e.g., validation errors)
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        return data.errors.map(e => e.description).join(', ')
      }
      
      // Handle single error message
      if (data.message) return data.message
      if (data.error) return data.error
    }
    
    // Network error
    if (axiosError.message === 'Network Error') {
      return 'Unable to connect to the server. Please check your internet connection.'
    }
    
    // Timeout error
    if (axiosError.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.'
    }
    
    // HTTP status errors
    if (axiosError.response?.status) {
      switch (axiosError.response.status) {
        case 400:
          return 'Invalid request. Please check your input.'
        case 401:
          return 'Unauthorized. Please log in again.'
        case 403:
          return 'Access forbidden. You do not have permission to perform this action.'
        case 404:
          return 'Resource not found.'
        case 409:
          return 'Conflict. This resource may already exist.'
        case 422:
          return 'Validation error. Please check your input.'
        case 500:
          return 'Server error. Please try again later.'
        case 503:
          return 'Service unavailable. Please try again later.'
        default:
          return `Error ${axiosError.response.status}: ${axiosError.message}`
      }
    }
    
    return axiosError.message || defaultMessage
  }

  // Standard Error object
  if (error instanceof Error) {
    return error.message
  }

  // String error
  if (typeof error === 'string') {
    return error
  }

  // Object with message property
  if (typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }

  return defaultMessage
}

/**
 * Log error to console in development
 */
export const logError = (context: string, error: unknown): void => {
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error)
  }
}

/**
 * Handle API errors with consistent logging and message extraction
 */
export const handleApiError = (
  error: unknown,
  context: string,
  defaultMessage?: string
): string => {
  logError(context, error)
  return getErrorMessage(error, defaultMessage)
}

/**
 * Format validation errors for display
 */
export const formatValidationErrors = (
  errors: Record<string, string[]>
): string => Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    .join('\n')

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (typeof error === 'object' && error !== null && 'isAxiosError' in error) {
    const axiosError = error as AxiosError
    return axiosError.message === 'Network Error' || !axiosError.response
  }
  return false
}

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  if (typeof error === 'object' && error !== null && 'isAxiosError' in error) {
    const axiosError = error as AxiosError
    return axiosError.response?.status === 401 || axiosError.response?.status === 403
  }
  return false
}

/**
 * Create a user-friendly error object
 */
export interface UserFriendlyError {
  message: string
  isNetworkError: boolean
  isAuthError: boolean
  statusCode?: number
}

export const createUserFriendlyError = (error: unknown): UserFriendlyError => {
  const message = getErrorMessage(error)
  const networkError = isNetworkError(error)
  const authError = isAuthError(error)
  
  let statusCode: number | undefined
  if (typeof error === 'object' && error !== null && 'isAxiosError' in error) {
    const axiosError = error as AxiosError
    statusCode = axiosError.response?.status
  }

  return {
    message,
    isNetworkError: networkError,
    isAuthError: authError,
    statusCode,
  }
}
