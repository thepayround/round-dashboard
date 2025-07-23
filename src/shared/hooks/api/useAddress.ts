/**
 * Address hooks
 */

import { useState } from 'react'
import type {
  ApiResponse,
  PagedResult,
  PagedRequest,
  AddressResponse,
  CreateAddressData,
  UpdateAddressData,
} from '@/shared/types/api'
import { addressService } from '@/shared/services/api'

export const useAddress = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAll = async (
    request?: PagedRequest
  ): Promise<ApiResponse<PagedResult<AddressResponse>>> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await addressService.getAll(request)
      if (!result.success) {
        setError(result.error ?? 'Failed to fetch addresses')
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

  const getById = async (id: string): Promise<ApiResponse<AddressResponse>> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await addressService.getById(id)
      if (!result.success) {
        setError(result.error ?? 'Failed to fetch address')
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

  const create = async (addressData: CreateAddressData): Promise<ApiResponse<AddressResponse>> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await addressService.create(addressData)
      if (!result.success) {
        setError(result.error ?? 'Failed to create address')
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

  const update = async (id: string, addressData: UpdateAddressData): Promise<ApiResponse<void>> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await addressService.update(id, addressData)
      if (!result.success) {
        setError(result.error ?? 'Failed to update address')
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

  const remove = async (id: string): Promise<ApiResponse<void>> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await addressService.delete(id)
      if (!result.success) {
        setError(result.error ?? 'Failed to delete address')
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

  const deleteAll = async (): Promise<ApiResponse<void>> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await addressService.deleteAll()
      if (!result.success) {
        setError(result.error ?? 'Failed to delete all addresses')
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

  const deleteMany = async (ids: string[]): Promise<ApiResponse<void>> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await addressService.deleteMany(ids)
      if (!result.success) {
        setError(result.error ?? 'Failed to delete addresses')
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
    getAll,
    getById,
    create,
    update,
    remove,
    deleteAll,
    deleteMany,

    // Utilities
    clearError,
  }
}
