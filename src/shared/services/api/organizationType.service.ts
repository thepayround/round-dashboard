/**
 * Organization Type Service - Handles organization type related API operations
 */

import { httpClient } from './base/client'
import type { ApiResponse } from '@/shared/types/api'
import type { OrganizationTypeResponse } from '@/shared/types/api/organizationType'

export class OrganizationTypeService {
  /**
   * Get all organization types
   */
  async getOrganizationTypes(): Promise<ApiResponse<OrganizationTypeResponse[]>> {
    try {
      const response = await httpClient.getClient().get<OrganizationTypeResponse[]>('/organization-types')

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
}

// Export singleton instance
export const organizationTypeService = new OrganizationTypeService()
