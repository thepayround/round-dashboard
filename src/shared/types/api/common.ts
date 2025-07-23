/**
 * Common API types and interfaces
 */

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface PagedRequest {
  pageNumber?: number
  pageSize?: number
  filterPropertyName?: string
  filterValue?: string
  orderBy?: string
  isAscending?: boolean
}

export interface ApiError {
  code: string
  message: string
  details?: string
}

export interface ApiConfig {
  baseURL: string
  timeout: number
  headers: Record<string, string>
}
