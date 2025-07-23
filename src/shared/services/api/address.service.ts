/**
 * Address service
 */

import axios from 'axios'
import type {
  ApiResponse,
  PagedResult,
  PagedRequest,
  AddressRequest,
  AddressResponse,
  CreateAddressData,
  UpdateAddressData,
} from '@/shared/types/api'
import { httpClient } from './base/client'
import { ENDPOINTS } from './base/config'

export class AddressService {
  private client = httpClient.getClient()

  /**
   * Get all addresses (paginated)
   */
  async getAll(request?: PagedRequest): Promise<ApiResponse<PagedResult<AddressResponse>>> {
    try {
      const params = new URLSearchParams()

      if (request?.pageNumber) params.append('pageNumber', request.pageNumber.toString())
      if (request?.pageSize) params.append('pageSize', request.pageSize.toString())
      if (request?.filterPropertyName) params.append('filterBy', request.filterPropertyName)
      if (request?.filterValue) params.append('filterValue', request.filterValue)
      if (request?.orderBy) params.append('orderBy', request.orderBy)
      if (request?.isAscending !== undefined)
        params.append('isAscending', request.isAscending.toString())

      const response = await this.client.get(`${ENDPOINTS.ADDRESSES.BASE}?${params}`)

      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to fetch addresses')
    }
  }

  /**
   * Get address by ID
   */
  async getById(id: string): Promise<ApiResponse<AddressResponse>> {
    try {
      const response = await this.client.get(ENDPOINTS.ADDRESSES.BY_ID(id))

      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to fetch address')
    }
  }

  /**
   * Create new address
   */
  async create(addressData: CreateAddressData): Promise<ApiResponse<AddressResponse>> {
    try {
      const addressRequest: AddressRequest = {
        name: addressData.name,
        addressLine1: addressData.addressLine1,
        addressLine2: addressData.addressLine2,
        number: addressData.number,
        city: addressData.city,
        state: addressData.state,
        country: addressData.country,
        zipCode: addressData.zipCode,
        addressType: addressData.addressType,
        isPrimary: addressData.isPrimary,
      }

      const response = await this.client.post<AddressResponse>(
        ENDPOINTS.ADDRESSES.BASE,
        addressRequest
      )

      return {
        success: true,
        data: response.data,
        message: 'Address created successfully',
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to create address')
    }
  }

  /**
   * Update address
   */
  async update(id: string, addressData: UpdateAddressData): Promise<ApiResponse<void>> {
    try {
      await this.client.put(ENDPOINTS.ADDRESSES.BY_ID(id), addressData)

      return {
        success: true,
        message: 'Address updated successfully',
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to update address')
    }
  }

  /**
   * Delete address
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      await this.client.delete(ENDPOINTS.ADDRESSES.BY_ID(id))

      return {
        success: true,
        message: 'Address deleted successfully',
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to delete address')
    }
  }

  /**
   * Delete all addresses for current account
   */
  async deleteAll(): Promise<ApiResponse<void>> {
    try {
      await this.client.delete(ENDPOINTS.ADDRESSES.BASE)

      return {
        success: true,
        message: 'All addresses deleted successfully',
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to delete all addresses')
    }
  }

  /**
   * Delete multiple addresses by IDs
   */
  async deleteMany(ids: string[]): Promise<ApiResponse<void>> {
    try {
      await this.client.post(ENDPOINTS.ADDRESSES.DELETE_MANY, ids)

      return {
        success: true,
        message: 'Addresses deleted successfully',
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to delete addresses')
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
export const addressService = new AddressService()
