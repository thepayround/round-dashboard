/**
 * Address Type API service
 */

import type { AddressTypeResponse } from '../../types/api/addressType'

import { httpClient } from './base/client'

export class AddressTypeService {
  private readonly baseUrl = '/addresses/types'

  async getAddressTypes(): Promise<AddressTypeResponse[]> {
    const response = await httpClient.getClient().get<AddressTypeResponse[]>(`${this.baseUrl}`)
    return response.data
  }

  async getAddressTypeByCode(code: string): Promise<AddressTypeResponse> {
    const response = await httpClient.getClient().get<AddressTypeResponse>(`${this.baseUrl}/${code}`)
    return response.data
  }

  async searchAddressTypes(query: string): Promise<AddressTypeResponse[]> {
    const response = await httpClient.getClient().get<AddressTypeResponse[]>(`${this.baseUrl}/search`, {
      params: { query }
    })
    return response.data
  }
}

export const addressTypeService = new AddressTypeService()