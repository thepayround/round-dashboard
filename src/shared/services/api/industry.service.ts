/**
 * Industry API service
 */

import { httpClient } from './base/client'
import type { IndustryResponse } from '../../types/api/industry'

export class IndustryService {
  private readonly baseUrl = '/api/Industries'

  async getIndustries(): Promise<IndustryResponse[]> {
    const response = await httpClient.getClient().get<IndustryResponse[]>(`${this.baseUrl}`)
    return response.data
  }

  async getIndustryByCode(code: string): Promise<IndustryResponse> {
    const response = await httpClient.getClient().get<IndustryResponse>(`${this.baseUrl}/${code}`)
    return response.data
  }

  async searchIndustries(query: string): Promise<IndustryResponse[]> {
    const response = await httpClient.getClient().get<IndustryResponse[]>(`${this.baseUrl}/search`, {
      params: { query }
    })
    return response.data
  }
}

export const industryService = new IndustryService()