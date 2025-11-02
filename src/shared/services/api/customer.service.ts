import { httpClient } from './base/client'

import type { PagedResult } from '@/shared/types/api/common'

// Customer Types - Use string enums to match backend validation
export enum CustomerType {
  Individual = 'Individual',
  Business = 'Business'
}

export enum CustomerStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Suspended = 'Suspended',
  Cancelled = 'Cancelled'
}

// Add customers endpoint to config first
const CUSTOMER_ENDPOINTS = {
  BASE: '/customers',
  BY_ID: (id: string) => `/customers/${id}`,
  SEARCH: '/customers/search',
  TAGS: (id: string) => `/customers/${id}/tags`,
  STATUS: (id: string) => `/customers/${id}/status`,
  NOTES: (id: string) => `/customers/${id}/notes`,
  NOTE_BY_ID: (id: string, noteId: string) => `/customers/${id}/notes/${noteId}`,
  SEND_EMAIL: (id: string) => `/customers/${id}/send-email`,
} as const

// Customer Types
export interface CustomerResponse {
  id: string
  type: CustomerType
  effectiveDisplayName: string
  isBusinessCustomer: boolean
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
  status: CustomerStatus
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
  type?: CustomerType
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
  type: CustomerType
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
  billingAddress?: CustomerAddressCreateRequest | null
  shippingAddress?: CustomerAddressCreateRequest | null
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
  status: CustomerStatus
  reason?: string
}

export interface CustomerSearchParams {
  pageNumber?: number
  pageSize?: number
  searchQuery?: string  // Global search across name, email, company
  orderBy?: string
  isAscending?: boolean
  // Multiple filters - sent as query params: ?Status=Active&Currency=USD&Type=Business
  Status?: string
  Type?: string
  Currency?: string
  PortalAccess?: string
  AutoCollection?: string
}

export interface CustomerSearchRequest {
  query?: string
  email?: string
  phone?: string
  limit?: number
}

export interface CustomerNoteCreateRequest {
  content: string
  isInternal: boolean
  createdBy: string
}

export interface CustomerEmailRequest {
  subject: string
  message: string
  isHtml: boolean
}

// Customer Service Class
export class CustomerService {
  private client = httpClient.getClient()
  private baseUrl = CUSTOMER_ENDPOINTS.BASE

  async getAll(params: CustomerSearchParams = {}): Promise<PagedResult<CustomerResponse>> {
    const searchParams = new URLSearchParams()
    
    if (params.pageNumber) searchParams.set('pageNumber', params.pageNumber.toString())
    if (params.pageSize) searchParams.set('pageSize', params.pageSize.toString())
    if (params.searchQuery) searchParams.set('searchQuery', params.searchQuery)
    if (params.orderBy) searchParams.set('orderBy', params.orderBy)
    if (params.isAscending !== undefined) searchParams.set('isAscending', params.isAscending.toString())
    
    // Multiple filters - sent as separate query params
    if (params.Status) searchParams.set('Status', params.Status)
    if (params.Type) searchParams.set('Type', params.Type)
    if (params.Currency) searchParams.set('Currency', params.Currency)
    if (params.PortalAccess) searchParams.set('PortalAccess', params.PortalAccess)
    if (params.AutoCollection) searchParams.set('AutoCollection', params.AutoCollection)

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
    // Convert type from string enum to numeric value for backend
    const requestWithNumericType = {
      ...request,
      type: request.type === CustomerType.Individual ? 1 : 2
    }
    const response = await this.client.post<CustomerResponse>(this.baseUrl, requestWithNumericType)
    return response.data
  }

  async update(id: string, request: CustomerUpdateRequest): Promise<CustomerResponse> {
    // Convert type from string enum to numeric value for backend if present
    const requestWithNumericType = request.type !== undefined 
      ? { ...request, type: request.type === CustomerType.Individual ? 1 : 2 }
      : request
    const response = await this.client.put<CustomerResponse>(CUSTOMER_ENDPOINTS.BY_ID(id), requestWithNumericType)
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

  // Customer Notes methods
  async getNotes(id: string): Promise<CustomerNoteResponse[]> {
    const response = await this.client.get<CustomerNoteResponse[]>(CUSTOMER_ENDPOINTS.NOTES(id))
    return response.data
  }

  async getNote(id: string, noteId: string): Promise<CustomerNoteResponse> {
    const response = await this.client.get<CustomerNoteResponse>(CUSTOMER_ENDPOINTS.NOTE_BY_ID(id, noteId))
    return response.data
  }

  async createNote(id: string, request: CustomerNoteCreateRequest): Promise<CustomerNoteResponse> {
    const response = await this.client.post<CustomerNoteResponse>(CUSTOMER_ENDPOINTS.NOTES(id), request)
    return response.data
  }

  async updateNote(id: string, noteId: string, request: CustomerNoteCreateRequest): Promise<CustomerNoteResponse> {
    const response = await this.client.put<CustomerNoteResponse>(CUSTOMER_ENDPOINTS.NOTE_BY_ID(id, noteId), request)
    return response.data
  }

  async deleteNote(id: string, noteId: string): Promise<void> {
    await this.client.delete(CUSTOMER_ENDPOINTS.NOTE_BY_ID(id, noteId))
  }

  // Email method
  async sendEmail(id: string, request: CustomerEmailRequest): Promise<void> {
    await this.client.post(CUSTOMER_ENDPOINTS.SEND_EMAIL(id), request)
  }
}

// Export singleton instance
export const customerService = new CustomerService()
