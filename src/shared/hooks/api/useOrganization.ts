/**
 * Organization hooks
 */

import { useState, useCallback } from 'react'
import type {
  ApiResponse,
  PagedResult,
  PagedRequest,
  OrganizationResponse,
  CreateOrganizationData,
  UpdateOrganizationData,
} from '@/shared/types/api'
import { organizationService, authService } from '@/shared/services/api'

export const useOrganization = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAll = async (
    request?: PagedRequest
  ): Promise<ApiResponse<PagedResult<OrganizationResponse>>> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await organizationService.getAll(request)
      if (!result.success) {
        setError(result.error ?? 'Failed to fetch organizations')
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

  const getById = async (id: string): Promise<ApiResponse<OrganizationResponse>> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await organizationService.getById(id)
      if (!result.success) {
        setError(result.error ?? 'Failed to fetch organization')
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

  const create = async (
    organizationData: CreateOrganizationData
  ): Promise<ApiResponse<OrganizationResponse>> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await organizationService.create(organizationData)
      if (!result.success) {
        setError(result.error ?? 'Failed to create organization')
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

  const update = async (
    id: string,
    organizationData: UpdateOrganizationData
  ): Promise<ApiResponse<void>> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await organizationService.update(id, organizationData)
      if (!result.success) {
        setError(result.error ?? 'Failed to update organization')
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
      const result = await organizationService.delete(id)
      if (!result.success) {
        setError(result.error ?? 'Failed to delete organization')
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

  // NOTE: Address methods removed - addresses are included in organization responses
  // Use the organization methods (getById, getByRoundAccountId, etc.) to get address data

  /**
   * Get organization using the complete user workflow:
   * 1. Extract roundAccountId from JWT token
   * 2. Get organization by roundAccountId
   * This is the preferred method for getting the current user's organization
   */
  const getCurrentUserOrganization = useCallback(async (): Promise<
    ApiResponse<OrganizationResponse>
  > => {
    setIsLoading(true)
    setError(null)

    try {
      // Step 1: Get authentication token
      const token = authService.getToken()
      if (!token) {
        const errorMessage = 'No authentication token found'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }

      // Step 2: Extract roundAccountId from token
      const roundAccountId = authService.getRoundAccountIdFromToken(token)
      if (!roundAccountId) {
        const errorMessage = 'No roundAccountId found in token'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }

      // Step 3: Get organization by roundAccountId
      const result = await organizationService.getByRoundAccountId(roundAccountId)
      if (!result.success) {
        setError(result.error ?? 'Failed to fetch organization')
      }
      return result
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while getting user organization'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Get organization by roundAccountId (explicit method)
   */
  const getByRoundAccountId = async (
    roundAccountId: string
  ): Promise<ApiResponse<OrganizationResponse>> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await organizationService.getByRoundAccountId(roundAccountId)
      if (!result.success) {
        setError(result.error ?? 'Failed to fetch organization by round account ID')
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

  /**
   * Get organization by organizationId (explicit method)
   */
  const getByOrganizationId = async (
    organizationId: string
  ): Promise<ApiResponse<OrganizationResponse>> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await organizationService.getByOrganizationId(organizationId)
      if (!result.success) {
        setError(result.error ?? 'Failed to fetch organization by organization ID')
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

    // Organization methods
    getAll,
    getById,
    create,
    update,
    remove,

    // New workflow methods (recommended)
    getCurrentUserOrganization,
    getByRoundAccountId,
    getByOrganizationId,

    // NOTE: Address methods removed - addresses are included in organization responses

    // Utilities
    clearError,
  }
}
