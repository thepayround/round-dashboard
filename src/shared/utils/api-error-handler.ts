// API Error Handling Utilities
// Provides typed error handling for different API error scenarios

export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
  isValidationError?: boolean
  isNetworkError?: boolean
  isAuthError?: boolean
  isServerError?: boolean
}

export interface ValidationError {
  field: string
  messages: string[]
}

/**
 * Parse API error response into a structured error object
 */
export function parseApiError(error: unknown): ApiError {
  // Type guard to check if error has response property
  const hasResponse = (err: unknown): err is { response: { status: number; data?: { message?: string; errors?: Record<string, string[]> } }; code?: string } => typeof err === 'object' && err !== null && 'response' in err

  // Type guard for network errors
  const hasCode = (err: unknown): err is { code?: string } => typeof err === 'object' && err !== null

  // Network error (no response)
  if (!hasResponse(error)) {
    const code = hasCode(error) ? error.code : undefined;
    return {
      status: 0,
      message: code === 'ECONNABORTED' 
        ? 'Request timeout. Please try again.' 
        : 'Network error. Please check your connection.',
      isNetworkError: true
    }
  }

  const { status, data } = error.response

  // Validation error (400)
  if (status === 400) {
    return {
      status,
      message: data?.message ?? 'Invalid request parameters',
      errors: data?.errors,
      isValidationError: true
    }
  }

  // Authentication error (401)
  if (status === 401) {
    return {
      status,
      message: data?.message ?? 'You are not authenticated. Please log in.',
      isAuthError: true
    }
  }

  // Authorization error (403)
  if (status === 403) {
    return {
      status,
      message: data?.message ?? 'You do not have permission to perform this action.',
      isAuthError: true
    }
  }

  // Not found (404)
  if (status === 404) {
    return {
      status,
      message: data?.message ?? 'The requested resource was not found.',
    }
  }

  // Server error (500+)
  if (status >= 500) {
    return {
      status,
      message: data?.message ?? 'Server error. Please try again later.',
      isServerError: true
    }
  }

  // Other errors
  return {
    status,
    message: data?.message ?? 'An unexpected error occurred.',
  }
}

/**
 * Format validation errors into a user-friendly message
 */
export function formatValidationErrors(errors: Record<string, string[]>): string {
  const messages = Object.entries(errors)
    .map(([field, fieldErrors]) => {
      const fieldName = field.replace(/([A-Z])/g, ' $1').trim()
      return `${fieldName}: ${fieldErrors.join(', ')}`
    })
    .join('\n')

  return `Validation errors:\n${messages}`
}

/**
 * Get a user-friendly error message from an API error
 */
export function getUserMessage(error: ApiError): string {
  if (error.isValidationError && error.errors) {
    return formatValidationErrors(error.errors)
  }

  return error.message
}

/**
 * Retry logic for transient failures
 */
export async function retryRequest<T>(
  requestFn: () => Promise<T>,
  options: {
    maxRetries?: number
    initialDelay?: number
    shouldRetry?: (error: ApiError) => boolean
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    shouldRetry = (err) => err.isServerError ?? err.isNetworkError ?? false
  } = options

  let lastError: unknown

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await requestFn()
    } catch (error: unknown) {
      lastError = error
      const apiError = parseApiError(error)

      // Don't retry if it's not a retryable error
      if (!shouldRetry(apiError)) {
        throw error
      }

      // Don't retry on last attempt
      if (attempt === maxRetries - 1) {
        throw error
      }

      // Exponential backoff
      const delay = initialDelay * Math.pow(2, attempt)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

/**
 * Type guard to check if error is an API error
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'message' in error
  )
}
