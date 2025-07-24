/**
 * Organization hook for managing user's organization
 * Since users belong to a single organization, this hook provides
 * access to the current user's organization data.
 */

import { useState, useCallback } from 'react'
import type { ApiResponse, OrganizationResponse, CreateOrganizationData } from '@/shared/types/api'
import { organizationService, authService } from '@/shared/services/api'

export const useOrganization = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getCurrentOrganization = useCallback(async (): Promise<ApiResponse<OrganizationResponse>> => {
    setIsLoading(true)
    setError(null)

    try {
      // First, get current user to ensure we have fresh authentication
      const userResponse = await authService.getCurrentUser()
      if (!userResponse.success || !userResponse.data) {
        const errorMessage = 'Failed to get current user'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }

      const token = authService.getToken()
      if (!token) {
        const errorMessage = 'No authentication token found'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }

      const roundAccountId = authService.getRoundAccountIdFromToken(token)
      
      if (roundAccountId) {
        const result = await organizationService.getCurrentOrganization(roundAccountId)
        if (!result.success) {
          setError(result.error ?? 'Failed to fetch organization')
        }
        return result
      } else {
        // No roundAccountId found - this shouldn't happen for authenticated users
        const errorMessage = 'No roundAccountId found in JWT token - cannot fetch organization'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while fetching organization'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, []) // No dependencies since we're using services which are singletons

  const create = useCallback(async (organizationData: CreateOrganizationData): Promise<ApiResponse<OrganizationResponse>> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await organizationService.create(organizationData)
      if (!result.success) {
        setError(result.error ?? 'Failed to create organization')
      }
      return result
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while creating organization'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    getCurrentOrganization,
    create,
    isLoading,
    error,
  }
}
