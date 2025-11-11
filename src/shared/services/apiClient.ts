/**
 * API Client service for connecting to the Round backend
 * This replaces the mock API service with real backend integration
 */

import type { AxiosInstance, AxiosError } from 'axios'
import axios from 'axios'

import { API_ENDPOINTS } from '@/shared/config/api-endpoints'
import type { User } from '@/shared/types/auth'
import { tokenManager } from '@/shared/utils/tokenManager'

// Base URL for the API - fixed backend port
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

// Ensure we don't have double slashes in the URL
// const formatUrl = (path: string) => {
//   const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL
//   const cleanPath = path.startsWith('/') ? path : `/${path}`
//   return `${baseUrl}${cleanPath}`
// }

// Request/Response types matching the backend
interface LoginRequest {
  identifier: string // Email, phone, or username
  password: string
  roundAccountId?: string
}

interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  userName?: string
  password: string
  phoneNumber: string
  countryPhoneCode: string
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface LoginResponse {
  succeeded: boolean
  token: string
  refreshToken: string
  errors?: { code: string; description: string }[]
}



interface RegisterResponse {
  message: string
}

// interface ResendConfirmationRequest {
//   email: string
// }

// interface ConfirmEmailResponse {
//   message: string
// }

// User type is imported from auth types

interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      config => {
        const token = tokenManager.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      error => Promise.reject(error)
    )

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          tokenManager.clearTokens()
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    )
  }

  /**
   * Login user with backend API
   */
  async login(credentials: {
    email: string
    password: string
  }): Promise<ApiResponse<AuthResponse>> {
    try {
      const loginData: LoginRequest = {
        identifier: credentials.email,
        password: credentials.password,
      }

      const response = await this.client.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, loginData)

      if (response.data.succeeded && response.data.token) {
        // Store tokens using tokenManager
        tokenManager.setTokens(response.data.token, response.data.refreshToken)

        // Get user information using the token
        const userResponse = await this.getCurrentUser()
        if (!userResponse.success || !userResponse.data) {
          return {
            success: false,
            error: 'Failed to retrieve user information after login',
          }
        }

        return {
          success: true,
          data: {
            user: userResponse.data,
            accessToken: response.data.token,
            refreshToken: response.data.refreshToken || '',
          },
          message: 'Login successful',
        }
      } else {
        return {
          success: false,
          error: response.data.errors?.[0]?.description ?? 'Login failed',
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        let errorMessage = 'Login failed'

        // Handle IdentityResult.Errors array format from backend
        if (Array.isArray(error.response.data)) {
          const [firstError] = error.response.data
          if (firstError?.description) {
            errorMessage = firstError.description
          } else if (typeof firstError === 'string') {
            errorMessage = firstError
          }
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error
        }

        return {
          success: false,
          error: errorMessage,
        }
      }

      return {
        success: false,
        error: 'Network error. Please try again.',
      }
    }
  }

  /**
   * Register new user with backend API
   * Note: Registration requires email confirmation before login
   */
  async register(userData: {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    countryPhoneCode: string
    password: string
    userName?: string
  }): Promise<ApiResponse<{ message: string; requiresEmailConfirmation: boolean }>> {
    try {
      const registerData: RegisterRequest = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        userName: userData.userName,
        password: userData.password,
        phoneNumber: userData.phoneNumber,
        countryPhoneCode: userData.countryPhoneCode,
      }

      const response = await this.client.post<RegisterResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        registerData
      )

      if (response.status === 200) {
        // Backend returns success message and requires email confirmation
        return {
          success: true,
          data: {
            message: response.data.message,
            requiresEmailConfirmation: true,
          },
          message: 'Registration successful. Please check your email to confirm your account.',
        }
      } else {
        return {
          success: false,
          error: 'Registration failed',
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        let errorMessage = 'Registration failed'

        // Handle IdentityResult.Errors array format from backend
        if (Array.isArray(error.response.data)) {
          const [firstError] = error.response.data
          if (firstError?.description) {
            errorMessage = firstError.description
          } else if (typeof firstError === 'string') {
            errorMessage = firstError
          }
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error
        }

        return {
          success: false,
          error: errorMessage,
        }
      }

      return {
        success: false,
        error: 'Network error. Please try again.',
      }
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<ApiResponse<{ token: string; refreshToken: string }>> {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        return {
          success: false,
          error: 'No refresh token available',
        }
      }

      const response = await this.client.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
        refreshToken,
      })

      if (response.data.token) {
        tokenManager.setTokens(response.data.token, response.data.refreshToken || refreshToken)

        return {
          success: true,
          data: {
            token: response.data.token,
            refreshToken: response.data.refreshToken,
          },
        }
      }

      return {
        success: false,
        error: 'Token refresh failed',
      }
    } catch (error) {
      tokenManager.clearTokens()
      return {
        success: false,
        error: 'Token refresh failed',
      }
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<null>> {
    try {
      await this.client.post(API_ENDPOINTS.AUTH.LOGOUT)
      tokenManager.clearTokens()
      return {
        success: true,
        message: 'Logout successful',
      }
    } catch (error) {
      // Clear tokens even if logout fails
      tokenManager.clearTokens()
      return {
        success: true,
        message: 'Logout successful',
      }
    }
  }

  /**
   * Confirm email with userId and token from email link
   */
  async confirmEmail(userId: string, token: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await this.client.get(
        `${API_ENDPOINTS.AUTH.CONFIRM_EMAIL}?userId=${encodeURIComponent(userId)}&token=${encodeURIComponent(token)}`
      )

      return {
        success: true,
        data: { message: response.data },
        message: 'Email confirmed successfully',
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data?.message || error.response.data?.error || 'Email confirmation failed'
        return {
          success: false,
          error: errorMessage,
        }
      }

      return {
        success: false,
        error: 'Network error. Please try again.',
      }
    }
  }

  /**
   * Confirm email and automatically log in the user
   */
  async confirmEmailAndLogin(userId: string, token: string): Promise<ApiResponse<AuthResponse>> {
    try {
      const url = `${API_ENDPOINTS.AUTH.CONFIRM_EMAIL_AND_LOGIN}?userId=${encodeURIComponent(userId)}&token=${encodeURIComponent(token)}`

      const response = await this.client.post<LoginResponse>(url, {})

      if (response.data.succeeded && response.data.token) {
        // Store tokens using tokenManager
        tokenManager.setTokens(response.data.token, response.data.refreshToken)

        // Create user object from the response
        // Note: The backend doesn't return user info in login response,
        // so we'll need to fetch it separately or modify the backend
        const user: User = {
          id: 'temp-id', // This should come from JWT or separate call
          firstName: '',
          lastName: '',
          email: userId, // userId is the email address
          phone: '',
          accountType: 'personal',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          role: 'admin',
        }

        return {
          success: true,
          data: {
            user,
            accessToken: response.data.token,
            refreshToken: response.data.refreshToken,
          },
          message: 'Email confirmed and logged in successfully',
        }
      } else {
        return {
          success: false,
          error: response.data.errors?.[0]?.description ?? 'Email confirmation failed',
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        let errorMessage = 'Email confirmation failed'

        // Handle IdentityResult.Errors array format from backend
        if (Array.isArray(error.response.data)) {
          const [firstError] = error.response.data
          if (firstError?.description) {
            errorMessage = firstError.description
          } else if (typeof firstError === 'string') {
            errorMessage = firstError
          }
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error
        }

        return {
          success: false,
          error: errorMessage,
        }
      }

      return {
        success: false,
        error: 'Network error. Please try again.',
      }
    }
  }

  /**
   * Resend confirmation email
   */
  async resendConfirmationEmail(email: string): Promise<ApiResponse<{ message: string }>> {
    try {
      // Use longer timeout for email operations (SMTP can be slow)
      const response = await this.client.post(API_ENDPOINTS.AUTH.RESEND_CONFIRMATION, { email }, {
        timeout: 30000 // 30 seconds to match backend SMTP timeout
      })

      return {
        success: true,
        data: { message: response.data.message },
        message: 'Confirmation email sent successfully',
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          'Failed to resend confirmation email'
        return {
          success: false,
          error: errorMessage,
        }
      }

      return {
        success: false,
        error: 'Network error. Please try again.',
      }
    }
  }

  /**
   * Get current user profile
   */
  /**
   * Decode JWT token to extract user information
   */
  private decodeJWT(token: string): Record<string, unknown> | null {
    try {
      const [, base64Url] = token.split('.')
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      return null
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const token = tokenManager.getToken()
      if (!token) {
        return {
          success: false,
          error: 'No authentication token found',
        }
      }

      // Use the /identities/me endpoint - no need to decode JWT as backend handles it
      const response = await this.client.get(API_ENDPOINTS.AUTH.CURRENT_USER)

      if (response.data) {
        const userData = response.data

        // Extract organization information from the response
        const hasOrganizations = userData.organizations && userData.organizations.length > 0
        const organization = hasOrganizations ? userData.organizations[0] : null
        
        // Extract account information from RoundAccountUsers
        const hasAccountUsers = userData.roundAccountUsers && userData.roundAccountUsers.length > 0
        const accountUser = hasAccountUsers ? userData.roundAccountUsers[0] : null
        const _account = accountUser?.roundAccount || null
        
        // Determine account type based on whether user has organizations
        const accountType = hasOrganizations ? 'business' : 'personal'
        
        // Map backend response to frontend User type
        const user: User = {
          id: userData.userId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phoneNumber || '',
          accountType,
          role: 'admin', // Default - could be enhanced based on user role from accountUser
          ...(accountType === 'business' && organization && {
            companyInfo: {
              companyName: organization.name,
              registrationNumber: organization.registrationNumber || '',
              currency: organization.currency || '',
              businessType: organization.type || '',
            }
          }),
          createdAt: userData.createdDate
            ? userData.createdDate.toString()
            : new Date().toISOString(),
          updatedAt: userData.modifiedDate
            ? userData.modifiedDate.toString()
            : new Date().toISOString(),
        }

        return {
          success: true,
          data: user,
        }
      } else {
        return {
          success: false,
          error: 'User not found in search results',
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.response) {
        // Server responded with error status
      } else if (axiosError.request) {
        // Request was made but no response received
      } else {
        // Error in request setup
      }
      return {
        success: false,
        error: `Failed to get user profile: ${axiosError.message || 'Unknown error'}`,
      }
    }
  }

  /**
   * Create organization
   */
  async createOrganization(orgData: {
    name: string
    description?: string
    website?: string
    size?: string
    revenue?: number
    category: string
    type: string
    registrationNumber: string
    currency: string
    timeZone: string
    country: string
    userId: string
  }): Promise<ApiResponse<OrganizationResponse>> {
    try {
      const organizationRequest: OrganizationRequest = {
        name: orgData.name,
        description: orgData.description,
        website: orgData.website,
        size: orgData.size,
        revenue: orgData.revenue,
        category: orgData.category,
        type: orgData.type,
        registrationNumber: orgData.registrationNumber,
        currency: orgData.currency,
        timeZone: orgData.timeZone,
        country: orgData.country,
        userId: orgData.userId,
      }

      const response = await this.client.post<OrganizationResponse>(
        '/organizations',
        organizationRequest
      )

      return {
        success: true,
        data: response.data,
        message: 'Organization created successfully',
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return {
          success: false,
          error: error.response.data?.message || 'Failed to create organization',
        }
      }

      return {
        success: false,
        error: 'Network error. Please try again.',
      }
    }
  }

  /**
   * Create address for organization
   */
  async createOrganizationAddress(
    organizationId: string,
    addressData: {
      name: string
      addressLine1: string
      addressLine2?: string
      number: string
      city: string
      state?: string
      country: string
      zipCode: string
      addressType: string
      isPrimary: boolean
    }
  ): Promise<ApiResponse<AddressResponse>> {
    try {
      const addressRequest: AddressRequest = {
        name: addressData.name,
        addressLine1: addressData.addressLine1,
        addressLine2: addressData.addressLine2,
        number: addressData.number,
        city: addressData.city,
        state: addressData.state,
        country: addressData.country,
        zipCode: addressData.zipCode,
        addressType: addressData.addressType,
        isPrimary: addressData.isPrimary,
      }

      const response = await this.client.post<AddressResponse>(
        `/organizations/${organizationId}/addresses`,
        addressRequest
      )

      return {
        success: true,
        data: response.data,
        message: 'Address created successfully',
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return {
          success: false,
          error: error.response.data?.message || 'Failed to create address',
        }
      }

      return {
        success: false,
        error: 'Network error. Please try again.',
      }
    }
  }

  /**
   * Create standalone address
   */
  async createAddress(addressData: {
    name: string
    addressLine1: string
    addressLine2?: string
    number: string
    city: string
    state?: string
    country: string
    zipCode: string
    addressType: string
    isPrimary: boolean
  }): Promise<ApiResponse<AddressResponse>> {
    try {
      const addressRequest: AddressRequest = {
        name: addressData.name,
        addressLine1: addressData.addressLine1,
        addressLine2: addressData.addressLine2,
        number: addressData.number,
        city: addressData.city,
        state: addressData.state,
        country: addressData.country,
        zipCode: addressData.zipCode,
        addressType: addressData.addressType,
        isPrimary: addressData.isPrimary,
      }

      const response = await this.client.post<AddressResponse>('/addresses', addressRequest)

      return {
        success: true,
        data: response.data,
        message: 'Address created successfully',
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return {
          success: false,
          error: error.response.data?.message || 'Failed to create address',
        }
      }

      return {
        success: false,
        error: 'Network error. Please try again.',
      }
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return tokenManager.hasToken()
  }

  /**
   * Get stored auth token
   */
  getToken(): string | null {
    return tokenManager.getToken()
  }

  /**
   * Generic POST method for API calls
   */
  async post<T = unknown>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<T>(endpoint, data)
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        let errorMessage = 'Request failed'

        // Handle IdentityResult.Errors array format from backend
        if (Array.isArray(error.response.data)) {
          const [firstError] = error.response.data
          if (firstError?.description) {
            errorMessage = firstError.description
          } else if (typeof firstError === 'string') {
            errorMessage = firstError
          }
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error
        }

        return {
          success: false,
          error: errorMessage,
        }
      }

      return {
        success: false,
        error: 'Network error. Please try again.',
      }
    }
  }

  /**
   * Generic GET method for API calls
   */
  async get<T = unknown>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<T>(endpoint)
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        let errorMessage = 'Request failed'

        if (error.response.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error
        }

        return {
          success: false,
          error: errorMessage,
        }
      }

      return {
        success: false,
        error: 'Network error. Please try again.',
      }
    }
  }

  /**
   * Generic PUT method for API calls
   */
  async put<T = unknown>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<T>(endpoint, data)
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        let errorMessage = 'Request failed'

        if (error.response.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error
        }

        return {
          success: false,
          error: errorMessage,
        }
      }

      return {
        success: false,
        error: 'Network error. Please try again.',
      }
    }
  }

  /**
   * Generic DELETE method for API calls
   */
  async delete<T = unknown>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<T>(endpoint)
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        let errorMessage = 'Request failed'

        if (error.response.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error
        }

        return {
          success: false,
          error: errorMessage,
        }
      }

      return {
        success: false,
        error: 'Network error. Please try again.',
      }
    }
  }

  /**
   * Send forgot password email
   */
  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    try {
      // Use longer timeout for email operations (SMTP can be slow)
      const response = await this.client.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }, {
        timeout: 30000 // 30 seconds to match backend SMTP timeout
      })

      return {
        success: true,
        data: { message: response.data.message || 'Password reset email sent' },
        message: 'Password reset email sent successfully',
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          'Failed to send password reset email'
        return {
          success: false,
          error: errorMessage,
        }
      }

      return {
        success: false,
        error: 'Network error. Please try again.',
      }
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(
    email: string,
    token: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<ApiResponse<{ message: string; token?: string; refreshToken?: string }>> {
    try {
      const response = await this.client.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        email,
        token,
        newPassword,
        confirmPassword,
      })

      return {
        success: true,
        data: { 
          message: response.data.message || 'Password reset successfully',
          token: response.data.token,
          refreshToken: response.data.refreshToken
        },
        message: 'Password reset successfully',
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        let errorMessage = 'Failed to reset password'

        // Handle IdentityResult.Errors array format from backend
        if (Array.isArray(error.response.data)) {
          const [firstError] = error.response.data
          if (firstError?.description) {
            errorMessage = firstError.description
          } else if (typeof firstError === 'string') {
            errorMessage = firstError
          }
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error
        }

        return {
          success: false,
          error: errorMessage,
        }
      }

      return {
        success: false,
        error: 'Network error. Please try again.',
      }
    }
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await this.client.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
        confirmPassword,
      })

      return {
        success: true,
        data: { 
          message: response.data.message || 'Password changed successfully'
        },
        message: 'Password changed successfully',
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        let errorMessage = 'Failed to change password'

        // Handle IdentityResult.Errors array format from backend
        if (Array.isArray(error.response.data)) {
          const [firstError] = error.response.data
          if (firstError?.description) {
            errorMessage = firstError.description
          } else if (typeof firstError === 'string') {
            errorMessage = firstError
          }
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error
        }

        return {
          success: false,
          error: errorMessage,
        }
      }

      return {
        success: false,
        error: 'Network error. Please try again.',
      }
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Organization and Address interfaces
interface OrganizationRequest {
  organizationId?: string
  name: string
  description?: string
  website?: string
  size?: string
  revenue?: number
  category: string
  type: string
  registrationNumber: string
  currency: string
  timeZone: string
  country: string
  userId: string
  addressId?: string
}

interface AddressRequest {
  addressId?: string
  name: string
  addressLine1: string
  addressLine2?: string
  number: string
  city: string
  state?: string
  country: string
  zipCode: string
  addressType: string
  isPrimary: boolean
}

interface OrganizationResponse {
  organizationId: string
  name: string
  description?: string
  website?: string
  size?: string
  revenue?: number
  category: string
  type: string
  registrationNumber: string
  currency: string
  timeZone: string
  country: string
  userId: string
  addressId?: string
  createdDate: string
  modifiedDate: string
}

interface AddressResponse {
  addressId: string
  name: string
  addressLine1: string
  addressLine2?: string
  number: string
  city: string
  state?: string
  country: string
  zipCode: string
  addressType: string
  isPrimary: boolean
  createdDate: string
  modifiedDate: string
}

// Export types for use in components
export type {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  User,
  AuthResponse,
  OrganizationRequest,
  OrganizationResponse,
  AddressRequest,
  AddressResponse,
}
