/**
 * Company Size API service
 */

import type { CompanySizeResponse } from '../../types/api/companySize'

import { httpClient } from './base/client'

export class CompanySizeService {
  private readonly baseUrl = '/organizations/company-sizes'

  async getCompanySizes(): Promise<CompanySizeResponse[]> {
    const response = await httpClient.getClient().get<CompanySizeResponse[]>(`${this.baseUrl}`)
    return response.data
  }

  async getCompanySizeByCode(code: string): Promise<CompanySizeResponse> {
    const response = await httpClient.getClient().get<CompanySizeResponse>(`${this.baseUrl}/${code}`)
    return response.data
  }

  async searchCompanySizes(query: string): Promise<CompanySizeResponse[]> {
    const response = await httpClient.getClient().get<CompanySizeResponse[]>(`${this.baseUrl}/search`, {
      params: { query }
    })
    return response.data
  }
}

export const companySizeService = new CompanySizeService()