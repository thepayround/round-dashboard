/**
 * Round Account Service - Handles round account related API operations
 */

import { httpClient } from './base/client'
import type { ApiResponse } from '@/shared/types/api'

export interface RoundAccountInfo {
  roundAccountId: string
  organizationId?: string
  accountName: string
  accountType: string
  createdDate: string
  modifiedDate: string
  createdBy: string
  modifiedBy: string
  status: string
  organization?: {
    organizationId: string
    name: string
    description?: string
    website?: string
    size?: string
    revenue?: number
    category: string
    type: string
    registrationNumber?: string
    currency: string
    timeZone: string
    country: string
    fiscalYearStart?: string
    userId: string
    addressId?: string
    createdDate: string
    modifiedDate: string
    createdBy?: string
    modifiedBy?: string
    status?: string
  }
  roundAccountUsers?: Array<{
    roundAccountId: string
    userId: string
    role?: string
  }>
  roundAccountAddresses?: Array<{
    addressId: string
    name: string
    addressLine1: string
    addressLine2?: string
    number: string
    city: string
    state?: string
    country: string
    zipCode: string
    addressType: string
    isPrimary: boolean
  }>
}

export class RoundAccountService {
  /**
   * Get current user's round account information
   */
  async getCurrentRoundAccount(): Promise<ApiResponse<RoundAccountInfo>> {
    try {
      const response = await httpClient.getClient().get<RoundAccountInfo>('/round-accounts')

      return {
        success: true,
        data: response.data,
        message: 'Round account retrieved successfully'
      }
    } catch (error) {
      console.error('Error fetching round account:', error)
      return {
        success: false,
        error: 'Failed to fetch round account information'
      }
    }
  }

  /**
   * Update round account information
   */
  async updateRoundAccount(accountData: {
    accountName?: string
    organizationId?: string
  }): Promise<ApiResponse<void>> {
    try {
      await httpClient.getClient().put('/round-accounts', accountData)

      return {
        success: true,
        message: 'Round account updated successfully'
      }
    } catch (error) {
      console.error('Error updating round account:', error)
      return {
        success: false,
        error: 'Failed to update round account'
      }
    }
  }

  /**
   * Get round account addresses
   */
  async getRoundAccountAddresses(): Promise<ApiResponse<Array<NonNullable<RoundAccountInfo['roundAccountAddresses']>[0]>>> {
    try {
      const response = await httpClient.getClient().get<Array<NonNullable<RoundAccountInfo['roundAccountAddresses']>[0]>>('/round-accounts/addresses')

      return {
        success: true,
        data: response.data || [],
        message: 'Round account addresses retrieved successfully'
      }
    } catch (error) {
      console.error('Error fetching round account addresses:', error)
      return {
        success: false,
        error: 'Failed to fetch round account addresses',
        data: []
      }
    }
  }
}

// Export singleton instance
export const roundAccountService = new RoundAccountService()