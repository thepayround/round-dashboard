/**
 * Organization service
 */

import axios from 'axios'
import type {
  ApiResponse,
  PagedResult,
  PagedRequest,
  OrganizationRequest,
  OrganizationResponse,
  CreateOrganizationData,
  UpdateOrganizationData,
} from '@/shared/types/api'
import { httpClient } from './base/client'
import { ENDPOINTS } from './base/config'

export class OrganizationService {
  private client = httpClient.getClient()

  /**
   * Get all organizations (paginated)
   */
  async getAll(request?: PagedRequest): Promise<ApiResponse<PagedResult<OrganizationResponse>>> {
    try {
      const params = new URLSearchParams()

      if (request?.pageNumber) params.append('pageNumber', request.pageNumber.toString())
      if (request?.pageSize) params.append('pageSize', request.pageSize.toString())
      if (request?.filterPropertyName) params.append('filterBy', request.filterPropertyName)
      if (request?.filterValue) params.append('filterValue', request.filterValue)
      if (request?.orderBy) params.append('orderBy', request.orderBy)
      if (request?.isAscending !== undefined)
        params.append('isAscending', request.isAscending.toString())

      const response = await this.client.get(`${ENDPOINTS.ORGANIZATIONS.BASE}?${params}`)

      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to fetch organizations')
    }
  }

  /**
   * Get organization by roundAccountId (RESTful approach)
   * Uses GET /organizations?roundAccountId={roundAccountId}
   */
  async getByRoundAccountId(roundAccountId: string): Promise<ApiResponse<OrganizationResponse>> {
    try {
      const response = await this.client.get(
        ENDPOINTS.ORGANIZATIONS.FILTERED_BY_ROUND_ACCOUNT(roundAccountId)
      )

      // Handle single organization response (backend now returns OrganizationResponse directly)
      if (response.data) {
        return {
          success: true,
          data: response.data,
          message: 'Organization retrieved successfully',
        }
      } else {
        return {
          success: false,
          error: 'No organization found for the given round account ID',
          message: '',
          data: null as unknown as OrganizationResponse,
        }
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to fetch organization by round account ID')
    }
  }

  /**
   * Get organization by organizationId (RESTful resource approach)
   * Uses GET /organizations/{id}
   */
  async getByOrganizationId(organizationId: string): Promise<ApiResponse<OrganizationResponse>> {
    try {
      const response = await this.client.get(ENDPOINTS.ORGANIZATIONS.BY_ID(organizationId))

      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to fetch organization by organization ID')
    }
  }

  /**
   * Get current user's organization (backwards compatibility)
   * @deprecated Use getByAnyId instead for better RESTful design
   */
  async getCurrent(): Promise<ApiResponse<OrganizationResponse>> {
    try {
      // Use proper RESTful endpoint with pageSize=1 to get the user's organization
      // The backend now includes address data in the response
      const response = await this.client.get(`${ENDPOINTS.ORGANIZATIONS.BASE}?pageSize=1`)

      if (response.data?.items?.length > 0) {
        return {
          success: true,
          data: response.data.items[0],
        }
      } else {
        return {
          success: false,
          error: 'No organization found for current user',
        }
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to fetch current organization')
    }
  }

  /**
   * Get organization by ID
   */
  async getById(id: string): Promise<ApiResponse<OrganizationResponse>> {
    try {
      const response = await this.client.get(ENDPOINTS.ORGANIZATIONS.BY_ID(id))

      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to fetch organization')
    }
  }

  /**
   * Create new organization
   */
  async create(
    organizationData: CreateOrganizationData
  ): Promise<ApiResponse<OrganizationResponse>> {
    try {
      const organizationRequest: OrganizationRequest = {
        name: organizationData.name,
        description: organizationData.description,
        website: organizationData.website,
        size: organizationData.size,
        revenue: organizationData.revenue,
        category: organizationData.category,
        type: organizationData.type,
        registrationNumber: organizationData.registrationNumber,
        currency: organizationData.currency,
        timeZone: organizationData.timeZone,
        country: organizationData.country,
        userId: organizationData.userId,
      }

      const response = await this.client.post<OrganizationResponse>(
        ENDPOINTS.ORGANIZATIONS.BASE,
        organizationRequest
      )

      return {
        success: true,
        data: response.data,
        message: 'Organization created successfully',
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to create organization')
    }
  }

  /**
   * Update organization
   */
  async update(id: string, organizationData: UpdateOrganizationData): Promise<ApiResponse<void>> {
    try {
      await this.client.put(ENDPOINTS.ORGANIZATIONS.BY_ID(id), organizationData)

      return {
        success: true,
        message: 'Organization updated successfully',
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to update organization')
    }
  }

  /**
   * Delete organization
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      await this.client.delete(ENDPOINTS.ORGANIZATIONS.BY_ID(id))

      return {
        success: true,
        message: 'Organization deleted successfully',
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to delete organization')
    }
  }

  // NOTE: Address operations removed - addresses are included in organization responses
  // Use organization CRUD operations instead

  private handleApiError(error: unknown, defaultMessage: string): ApiResponse<never> {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data?.message || error.response.data?.error || defaultMessage
      return {
        success: false,
        error: errorMessage,
      }
    }

    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

// Export singleton instance
export const organizationService = new OrganizationService()
