export interface ApiResponse<T = unknown> {
  data?: T
  message?: string
  success: boolean
  error?: string
}

export interface ApiError {
  message: string
  code: string
  status: number
}

export interface PaginationParams {
  page: number
  limit: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface PaginationResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Paged result type
export interface PagedResult<T> {
  items: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
}

// Paged request type
export interface PagedRequest {
  pageNumber?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filter?: string
  filterPropertyName?: string
  filterValue?: string
  orderBy?: string
  isAscending?: boolean
}

// API Config
export interface ApiConfig {
  baseURL: string
  timeout: number
  retries: number
  headers?: Record<string, string>
}

// Auth types
export interface LoginRequest {
  identifier: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  userName?: string
  password: string
  phoneNumber: string
}

export interface AuthResponse {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    accountType: 'personal' | 'business'
    role: string
  }
  accessToken: string
  refreshToken: string
}

export interface RefreshTokenResponse {
  token: string
  refreshToken: string
}

// Organization types
export interface OrganizationRequest {
  name: string
  description?: string
  website?: string
  size?: string
  revenue?: number
  category?: string
  type?: string
  registrationNumber?: string
  currency?: string
  timeZone?: string
  country?: string
  userId: string
}

export interface OrganizationResponse {
  organizationId: string
  name: string
  description?: string
  website?: string
  size?: string
  revenue?: number
  category?: string
  type?: string
  registrationNumber?: string
  currency?: string
  timeZone?: string
  country?: string
  userId: string
  address?: AddressResponse
  createdDate?: string
  modifiedDate?: string
}

export interface CreateOrganizationData {
  name: string
  description?: string
  website?: string
  size?: string
  revenue?: number
  category?: string
  type?: string
  registrationNumber?: string
  currency?: string
  timeZone?: string
  country?: string
  userId: string
}

export interface UpdateOrganizationData {
  name?: string
  description?: string
  website?: string
  size?: string
  revenue?: number
  category?: string
  type?: string
  registrationNumber?: string
  currency?: string
  timeZone?: string
  country?: string
}

// Address types
export interface AddressRequest {
  name: string
  addressLine1: string
  addressLine2?: string
  number?: string
  city: string
  state: string
  zipCode: string
  country: string
  addressType: 'billing' | 'shipping' | 'business'
  isPrimary?: boolean
}

export interface AddressResponse {
  addressId: string
  name: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipCode: string
  country: string
  addressType: 'billing' | 'shipping' | 'business'
  organizationId?: string
  createdDate?: string
  modifiedDate?: string
}

export interface CreateAddressData {
  name: string
  addressLine1: string
  addressLine2?: string
  number?: string
  city: string
  state: string
  zipCode: string
  country: string
  addressType: 'billing' | 'shipping' | 'business'
  isPrimary?: boolean
  organizationId?: string
}

export interface UpdateAddressData {
  name?: string
  addressLine1?: string
  addressLine2?: string
  number?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  addressType?: 'billing' | 'shipping' | 'business'
  isPrimary?: boolean
}
