/**
 * Organization Type Service - Handles organization type related API operations
 */

import { httpClient } from './base/client'
import type { ApiResponse } from '@/shared/types/api'
import type { OrganizationTypeResponse } from '@/shared/types/api/organizationType'

export class OrganizationTypeService {
  private cache: OrganizationTypeResponse[] | null = null
  private fetchPromise: Promise<ApiResponse<OrganizationTypeResponse[]>> | null = null

  /**
   * Get all organization types (with caching)
   */
  async getOrganizationTypes(): Promise<ApiResponse<OrganizationTypeResponse[]>> {
    // Return cached data if available
    if (this.cache !== null) {
      return {
        success: true,
        data: this.cache,
        message: 'Organization types retrieved from cache'
      }
    }

    // If already fetching, return the existing promise to avoid duplicate requests
    if (this.fetchPromise !== null) {
      return this.fetchPromise
    }

    // Create new fetch promise
    this.fetchPromise = this.fetchOrganizationTypes()
    
    try {
      const result = await this.fetchPromise
      
      // Cache successful results
      if (result.success && result.data) {
        this.cache = result.data
      }
      
      return result
    } finally {
      // Clear the fetch promise
      this.fetchPromise = null
    }
  }

  /**
   * Internal method to fetch organization types from API
   */
  private async fetchOrganizationTypes(): Promise<ApiResponse<OrganizationTypeResponse[]>> {
    try {
      const response = await httpClient.getClient().get<OrganizationTypeResponse[]>('/organizations/types')

      return {
        success: true,
        data: response.data || [],
        message: 'Organization types retrieved successfully'
      }
    } catch (error) {
      console.error('Error fetching organization types:', error)
      return {
        success: false,
        error: 'Failed to fetch organization types',
        data: []
      }
    }
  }

  /**
   * Clear the cache (useful for testing or forced refresh)
   */
  clearCache(): void {
    this.cache = null
    this.fetchPromise = null
  }
}

// Export singleton instance
export const organizationTypeService = new OrganizationTypeService()
