/**
 * Address Type API service
 */

import { httpClient } from './base/client'
import type { AddressTypeResponse } from '../../types/api/addressType'

export class AddressTypeService {
  private readonly baseUrl = '/address-types'

  async getAddressTypes(): Promise<AddressTypeResponse[]> {
    const response = await httpClient.getClient().get<AddressTypeResponse[]>(`${this.baseUrl}`)
    return response.data
  }

  async getAddressTypeByCode(code: string): Promise<AddressTypeResponse> {
    const response = await httpClient.getClient().get<AddressTypeResponse>(`${this.baseUrl}/${code}`)
    return response.data
  }
}

export const addressTypeService = new AddressTypeService()