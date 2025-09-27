import { httpClient } from './base/client'
import type { PagedResult } from '@/shared/types/api/common'

// Add customers endpoint to config first
const CUSTOMER_ENDPOINTS = {
  BASE: '/customers',
  BY_ID: (id: string) => `/customers/${id}`,
  SEARCH: '/customers/search',
  TAGS: (id: string) => `/customers/${id}/tags`,
  STATUS: (id: string) => `/customers/${id}/status`,
} as const

// Customer Types
export interface CustomerResponse {
  id: string
  email: string
  firstName: string
  lastName: string
  displayName: string
  company?: string
  phoneNumber?: string
  phoneNumberConfirmed?: boolean
  taxNumber?: string
  locale?: string
  timezone?: string
  currency: string
  status: 'active' | 'inactive' | 'suspended' | 'cancelled'
  signupDate: string
  lastActivityDate?: string
  portalAccess: boolean
  autoCollection: boolean
  tags: string[]
  customFields: Record<string, string>
  createdDate: string
  modifiedDate: string
  billingAddress?: CustomerAddressResponse
  shippingAddress?: CustomerAddressResponse
  allAddresses: CustomerAddressResponse[]
  notes: CustomerNoteResponse[]
}

export interface CustomerAddressResponse {
  id: string
  type: string
  isPrimary: boolean
  name?: string
  line1: string
  line2?: string
  city: string
  state?: string
  country: string
  zipCode: string
}

export interface CustomerNoteResponse {
  id: string
  content: string
  author: string
  isInternal: boolean
  createdDate: string
}

export interface CustomerCreateRequest {
  email: string
  firstName: string
  lastName: string
  company?: string
  phoneNumber?: string
  countryPhoneCode?: string
  taxNumber?: string
  locale?: string
  timezone?: string
  currency?: string
  portalAccess?: boolean
  autoCollection?: boolean
  tags?: string[]
  customFields?: Record<string, string>
  billingAddress?: CustomerAddressCreateRequest
  shippingAddress?: CustomerAddressCreateRequest
}

export interface CustomerUpdateRequest {
  email: string
  firstName: string
  lastName: string
  company?: string
  phoneNumber?: string
  countryPhoneCode?: string
  taxNumber?: string
  locale?: string
  timezone?: string
  currency?: string
  portalAccess: boolean
  autoCollection: boolean
  tags: string[]
  customFields: Record<string, string>
}

export interface CustomerAddressCreateRequest {
  type?: string
  isPrimary?: boolean
  name?: string
  line1: string
  line2?: string
  number?: string
  city: string
  state?: string
  country: string
  zipCode: string
}

export interface CustomerStatusUpdateRequest {
  status: 'active' | 'inactive' | 'suspended' | 'cancelled'
  reason?: string
}

export interface CustomerSearchParams {
  pageNumber?: number
  pageSize?: number
  filterBy?: string
  filterValue?: string
  orderBy?: string
  isAscending?: boolean
}

export interface CustomerSearchRequest {
  query?: string
  email?: string
  phone?: string
  limit?: number
}

// Customer Service Class
export class CustomerService {
  private client = httpClient.getClient()
  private baseUrl = CUSTOMER_ENDPOINTS.BASE

  async getAll(params: CustomerSearchParams = {}): Promise<PagedResult<CustomerResponse>> {
    const searchParams = new URLSearchParams()
    
    if (params.pageNumber) searchParams.set('pageNumber', params.pageNumber.toString())
    if (params.pageSize) searchParams.set('pageSize', params.pageSize.toString())
    if (params.filterBy) searchParams.set('filterBy', params.filterBy)
    if (params.filterValue) searchParams.set('filterValue', params.filterValue)
    if (params.orderBy) searchParams.set('orderBy', params.orderBy)
    if (params.isAscending !== undefined) searchParams.set('isAscending', params.isAscending.toString())

    const response = await this.client.get<PagedResult<CustomerResponse>>(
      `${this.baseUrl}?${searchParams.toString()}`
    )
    return response.data
  }

  async get(id: string): Promise<CustomerResponse> {
    const response = await this.client.get<CustomerResponse>(CUSTOMER_ENDPOINTS.BY_ID(id))
    return response.data
  }

  async search(params: CustomerSearchRequest): Promise<CustomerResponse[]> {
    const searchParams = new URLSearchParams()
    
    if (params.query) searchParams.set('query', params.query)
    if (params.email) searchParams.set('email', params.email)
    if (params.phone) searchParams.set('phone', params.phone)
    if (params.limit) searchParams.set('limit', params.limit.toString())

    const response = await this.client.get<CustomerResponse[]>(
      `${CUSTOMER_ENDPOINTS.SEARCH}?${searchParams.toString()}`
    )
    return response.data
  }

  async create(request: CustomerCreateRequest): Promise<CustomerResponse> {
    const response = await this.client.post<CustomerResponse>(this.baseUrl, request)
    return response.data
  }

  async update(id: string, request: CustomerUpdateRequest): Promise<CustomerResponse> {
    const response = await this.client.put<CustomerResponse>(CUSTOMER_ENDPOINTS.BY_ID(id), request)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await this.client.delete(CUSTOMER_ENDPOINTS.BY_ID(id))
  }

  async addTags(id: string, tags: string[]): Promise<void> {
    await this.client.post(CUSTOMER_ENDPOINTS.TAGS(id), tags)
  }

  async removeTags(id: string, tags: string[]): Promise<void> {
    await this.client.delete(CUSTOMER_ENDPOINTS.TAGS(id), { data: tags })
  }

  async updateStatus(id: string, request: CustomerStatusUpdateRequest): Promise<void> {
    await this.client.put(CUSTOMER_ENDPOINTS.STATUS(id), request)
  }
}

// Export singleton instance
export const customerService = new CustomerService()
