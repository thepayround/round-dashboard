/**
 * Organization service
 */

import axios from 'axios'

import { httpClient } from './base/client'
import { ENDPOINTS } from './base/config'

import type {
  ApiResponse,
  OrganizationRequest,
  OrganizationResponse,
  CreateOrganizationData,
  UpdateOrganizationData,
  AddressResponse,
  CreateAddressData,
  UpdateAddressData,
} from '@/shared/types/api'

export class OrganizationService {
  private client = httpClient.getClient()

  /**
   * Get organization by roundAccountId (RESTful approach)
   * Uses GET /organizations?roundAccountId={roundAccountId}
   */
  async getCurrentOrganization(roundAccountId: string): Promise<ApiResponse<OrganizationResponse>> {
    try {
      const url = ENDPOINTS.ORGANIZATIONS.BASE
      const response = await this.client.get(url, {
        params: {
          roundAccountId,
        },
      })

      return {
        success: true,
        data: response.data,
        message: 'Organization retrieved successfully',
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to fetch organization')
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
   * @deprecated This method is deprecated. All calls should use getCurrentOrganization(roundAccountId) instead.
   */
  async getCurrent(): Promise<ApiResponse<OrganizationResponse>> {
    return {
      success: false,
      error: 'getCurrent() is deprecated. Use getCurrentOrganization(roundAccountId) with a valid roundAccountId from JWT token.',
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
        // Add Industry field as backend expects it (capital I)
        Industry: (organizationData as OrganizationRequest & { Industry?: string }).Industry ?? organizationData.category,
        type: organizationData.type,
        registrationNumber: organizationData.registrationNumber,
        taxId: organizationData.taxId,
        currency: organizationData.currency,
        timeZone: organizationData.timeZone,
        country: organizationData.country,
        fiscalYearStart: organizationData.fiscalYearStart,
        userId: organizationData.userId,
      } as OrganizationRequest & { Industry: string }

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
      // Transform UpdateOrganizationData to OrganizationRequest format
      const organizationRequest: Partial<OrganizationRequest> = {
        name: organizationData.name,
        description: organizationData.description,
        website: organizationData.website,
        size: organizationData.size,
        revenue: organizationData.revenue,
        category: organizationData.category,
        // Add Industry field as backend expects it (capital I)
        Industry: (organizationData as OrganizationRequest & { Industry?: string }).Industry ?? organizationData.category,
        type: organizationData.type,
        registrationNumber: organizationData.registrationNumber,
        taxId: organizationData.taxId,
        currency: organizationData.currency,
        timeZone: organizationData.timeZone,
        country: organizationData.country,
        fiscalYearStart: organizationData.fiscalYearStart,
        // Note: Do not include userId for updates to avoid FK constraint issues
      } as Omit<OrganizationRequest, 'userId'> & { Industry: string }

      await this.client.put(ENDPOINTS.ORGANIZATIONS.BY_ID(id), organizationRequest)

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

  /**
   * Get organization address
   */
  async getOrganizationAddress(organizationId: string): Promise<ApiResponse<AddressResponse>> {
    try {
      const response = await this.client.get(ENDPOINTS.ORGANIZATIONS.ADDRESSES(organizationId))

      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to fetch organization address')
    }
  }

  /**
   * Create organization address
   */
  async createOrganizationAddress(organizationId: string, addressData: CreateAddressData): Promise<ApiResponse<AddressResponse>> {
    try {
      const response = await this.client.post<AddressResponse>(ENDPOINTS.ORGANIZATIONS.ADDRESSES(organizationId), addressData)

      return {
        success: true,
        data: response.data,
        message: 'Organization address created successfully',
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to create organization address')
    }
  }

  /**
   * Update organization address
   */
  async updateOrganizationAddress(organizationId: string, addressData: UpdateAddressData): Promise<ApiResponse<void>> {
    try {
      await this.client.put(ENDPOINTS.ORGANIZATIONS.ADDRESSES(organizationId), addressData)

      return {
        success: true,
        message: 'Organization address updated successfully',
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to update organization address')
    }
  }

  /**
   * Delete organization address
   */
  async deleteOrganizationAddress(organizationId: string): Promise<ApiResponse<void>> {
    try {
      await this.client.delete(ENDPOINTS.ORGANIZATIONS.ADDRESSES(organizationId))

      return {
        success: true,
        message: 'Organization address deleted successfully',
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to delete organization address')
    }
  }

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
