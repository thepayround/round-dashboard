export interface ApiResponse<T = any> {
  data: T
  message: string
  success: boolean
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