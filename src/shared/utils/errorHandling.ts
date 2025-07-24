import type { AxiosError } from 'axios'

export interface BackendError {
  statusCode: number
  error: string
  message: string
  path: string
  timestamp: string
  details?: Record<string, string>
}

export interface ParsedError {
  message: string
  details?: Record<string, string>
  statusCode?: number
}

/**
 * Parse backend error response into a user-friendly format
 */
export function parseBackendError(error: unknown): ParsedError {
  // If it's an Axios error with response data
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError<BackendError>
    
    if (axiosError.response?.data) {
      const {data} = axiosError.response
      
      return {
        message: data.message || data.error || 'An error occurred',
        details: data.details,
        statusCode: data.statusCode || axiosError.response.status,
      }
    }
  }

  // If it's a plain error object
  if (error instanceof Error) {
    return {
      message: error.message,
    }
  }

  // If it's a string
  if (typeof error === 'string') {
    return {
      message: error,
    }
  }

  // Default fallback
  return {
    message: 'An unexpected error occurred',
  }
}

/**
 * Check if an error is a validation error (400 status)
 */
export function isValidationError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError
    return axiosError.response?.status === 400
  }
  return false
}

/**
 * Check if an error is an authentication error (401 status)
 */
export function isAuthError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError
    return axiosError.response?.status === 401
  }
  return false
}

/**
 * Check if an error is a not found error (404 status)
 */
export function isNotFoundError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError
    return axiosError.response?.status === 404
  }
  return false
}