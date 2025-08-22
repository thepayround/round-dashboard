/**
 * Country Currency API service
 */

import { httpClient } from './base/client'
import type {
  CountryCurrencyResponse,
  CurrencyResponse,
  CountryResponse,
} from '../../types/api/countryCurrency'

export class CountryCurrencyService {
  private readonly baseUrl = '/country-currency'

  async getCountries(): Promise<CountryCurrencyResponse[]> {
    const response = await httpClient.getClient().get<CountryCurrencyResponse[]>(`${this.baseUrl}/countries`)
    return response.data
  }

  async getCountryByCode(countryCode: string): Promise<CountryResponse> {
    const response = await httpClient.getClient().get<CountryResponse>(`${this.baseUrl}/countries/${countryCode}`)
    return response.data
  }

  async getCurrencies(): Promise<CurrencyResponse[]> {
    const response = await httpClient.getClient().get<CurrencyResponse[]>(`${this.baseUrl}/currencies`)
    return response.data
  }

  async getCurrencyByCode(currencyCode: string): Promise<CurrencyResponse> {
    const response = await httpClient.getClient().get<CurrencyResponse>(`${this.baseUrl}/currencies/${currencyCode}`)
    return response.data
  }

  async searchCountryCurrency(query: string): Promise<CountryCurrencyResponse[]> {
    const response = await httpClient.getClient().get<CountryCurrencyResponse[]>(`${this.baseUrl}/search`, {
      params: { query }
    })
    return response.data
  }
}

export const countryCurrencyService = new CountryCurrencyService()