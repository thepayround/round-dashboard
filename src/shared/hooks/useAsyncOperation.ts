/**
 * Custom Hook for Async Operations
 * Provides consistent loading, error, and success state management
 */

import { useState, useCallback } from 'react'
import { handleApiError, type UserFriendlyError, createUserFriendlyError } from '../utils/errorHandler'

export interface AsyncOperationState<T> {
  loading: boolean
  error: UserFriendlyError | null
  data: T | null
}

export interface UseAsyncOperationReturn<T> {
  loading: boolean
  error: UserFriendlyError | null
  data: T | null
  execute: (
    operation: () => Promise<T>,
    options?: AsyncOperationOptions
  ) => Promise<T | null>
  reset: () => void
  setData: (data: T | null) => void
}

export interface AsyncOperationOptions<T = unknown> {
  onSuccess?: (data: T) => void
  onError?: (error: UserFriendlyError) => void
  errorMessage?: string
  successMessage?: string
  showErrorToast?: boolean
  showSuccessToast?: boolean
}

/**
 * Hook for managing async operations with loading, error, and data states
 */
export function useAsyncOperation<T = unknown>(
  initialData: T | null = null
): UseAsyncOperationReturn<T> {
  const [state, setState] = useState<AsyncOperationState<T>>({
    loading: false,
    error: null,
    data: initialData,
  })

  const execute = useCallback(
    async (
      operation: () => Promise<T>,
      options: AsyncOperationOptions = {}
    ): Promise<T | null> => {
      setState(prev => ({ ...prev, loading: true, error: null }))

      try {
        const result = await operation()
        setState({ loading: false, error: null, data: result })
        
        // Call success callback if provided
        options.onSuccess?.(result)

        return result
      } catch (err) {
        const errorObj = createUserFriendlyError(err)
        setState(prev => ({ ...prev, loading: false, error: errorObj }))
        
        // Log the error
        handleApiError(err, 'AsyncOperation', options.errorMessage)
        
        // Call error callback if provided
        options.onError?.(errorObj)

        return null
      }
    },
    []
  )

  const reset = useCallback(() => {
    setState({ loading: false, error: null, data: initialData })
  }, [initialData])

  const setData = useCallback((data: T | null) => {
    setState(prev => ({ ...prev, data }))
  }, [])

  return {
    loading: state.loading,
    error: state.error,
    data: state.data,
    execute,
    reset,
    setData,
  }
}

/**
 * Simpler version for operations that don't return data
 */
export function useAsyncAction(): {
  loading: boolean
  error: UserFriendlyError | null
  execute: (
    operation: () => Promise<void>,
    options?: AsyncOperationOptions
  ) => Promise<boolean>
  reset: () => void
} {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<UserFriendlyError | null>(null)

  const execute = useCallback(
    async (
      operation: () => Promise<void>,
      options: AsyncOperationOptions = {}
    ): Promise<boolean> => {
      setLoading(true)
      setError(null)

      try {
        await operation()
        setLoading(false)
        
        // Call success callback if provided
        options.onSuccess?.(undefined)

        return true
      } catch (err) {
        const errorObj = createUserFriendlyError(err)
        setError(errorObj)
        setLoading(false)
        
        // Log the error
        handleApiError(err, 'AsyncAction', options.errorMessage)
        
        // Call error callback if provided
        options.onError?.(errorObj)

        return false
      }
    },
    []
  )

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
  }, [])

  return { loading, error, execute, reset }
}
