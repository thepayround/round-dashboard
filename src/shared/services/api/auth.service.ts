/**
 * Authentication service
 */

import axios from 'axios'
import type {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenResponse,
} from '@/shared/types/api'
import type { User } from '@/shared/types/auth'
import { httpClient } from './base/client'
import { ENDPOINTS } from './base/config'

export class AuthService {
  private client = httpClient.getClient()
  private userCache: { user: User; timestamp: number } | null = null
  private pendingUserRequest: Promise<ApiResponse<User>> | null = null
  private readonly CACHE_DURATION = 30000 // 30 seconds

  /**
   * Login user with email/username and password
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

      const response = await this.client.post(ENDPOINTS.AUTH.LOGIN, loginData)

      if (response.data.succeeded && response.data.token) {
        // Store tokens
        httpClient.setStoredToken(response.data.token)
        if (response.data.refreshToken) {
          localStorage.setItem('refresh_token', response.data.refreshToken)
        }

        // Get user information using the token
        const userResponse = await this.getCurrentUser()
        if (!userResponse.success || !userResponse.data) {
          return {
            success: false,
            error: 'Failed to retrieve user information after login',
            data: null as never,
            message: '',
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
      return this.handleApiError(error, 'Login failed')
    }
  }

  /**
   * Register new user
   */
  async register(userData: {
    firstName: string
    lastName: string
    email: string
    phone: string
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
        phoneNumber: userData.phone,
      }

      const response = await this.client.post(ENDPOINTS.AUTH.REGISTER, registerData)

      if (response.status === 200) {
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
      return this.handleApiError(error, 'Registration failed')
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<null>> {
    try {
      await this.client.post(ENDPOINTS.AUTH.LOGOUT)
      this.clearStoredTokens()
      this.userCache = null // Clear user cache
      this.pendingUserRequest = null // Clear pending request
      return {
        success: true,
        data: null,
        message: 'Logout successful',
      }
    } catch (error) {
      // Clear tokens even if logout fails
      this.clearStoredTokens()
      this.userCache = null // Clear user cache
      this.pendingUserRequest = null // Clear pending request
      return {
        success: true,
        data: null,
        message: 'Logout successful',
      }
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<ApiResponse<RefreshTokenResponse>> {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        return {
          success: false,
          error: 'No refresh token available',
        }
      }

      const response = await this.client.post(ENDPOINTS.AUTH.REFRESH_TOKEN, {
        refreshToken,
      })

      if (response.data.token) {
        httpClient.setStoredToken(response.data.token)
        if (response.data.refreshToken) {
          localStorage.setItem('refresh_token', response.data.refreshToken)
        }

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
      this.clearStoredTokens()
      return {
        success: false,
        error: 'Token refresh failed',
      }
    }
  }

  /**
   * Confirm email with userId and token from email link
   */
  async confirmEmail(userId: string, token: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await this.client.get(
        `${ENDPOINTS.AUTH.CONFIRM_EMAIL}?userId=${encodeURIComponent(userId)}&token=${encodeURIComponent(token)}`
      )

      return {
        success: true,
        data: { message: response.data },
        message: 'Email confirmed successfully',
      }
    } catch (error) {
      return this.handleApiError(error, 'Email confirmation failed')
    }
  }

  /**
   * Confirm email and automatically log in the user
   */
  async confirmEmailAndLogin(userId: string, token: string): Promise<ApiResponse<AuthResponse>> {
    try {
      const url = `${ENDPOINTS.AUTH.CONFIRM_EMAIL_AND_LOGIN}?userId=${encodeURIComponent(userId)}&token=${encodeURIComponent(token)}`

      const response = await this.client.post(url, {})

      if (response.data.succeeded && response.data.token) {
        // Store tokens
        httpClient.setStoredToken(response.data.token)
        if (response.data.refreshToken) {
          localStorage.setItem('refresh_token', response.data.refreshToken)
        }

        // Get actual user information using the token
        const userResponse = await this.getCurrentUser()
        if (!userResponse.success || !userResponse.data) {
          return {
            success: false,
            error: 'Failed to retrieve user information after login',
            data: null as never,
            message: '',
          }
        }

        return {
          success: true,
          data: {
            user: userResponse.data,
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
      return this.handleApiError(error, 'Email confirmation failed')
    }
  }

  /**
   * Resend confirmation email
   */
  async resendConfirmationEmail(email: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await this.client.post(ENDPOINTS.AUTH.RESEND_CONFIRMATION, { email })

      return {
        success: true,
        data: { message: response.data.message },
        message: 'Confirmation email sent successfully',
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to resend confirmation email')
    }
  }

  /**
   * Get current user profile using /identities/me endpoint
   * Makes exactly ONE API call and fetches organization data if needed
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const token = httpClient.getToken()
      if (!token) {
        return {
          success: false,
          error: 'No authentication token found',
        }
      }

      // Check cache first to prevent duplicate API calls
      if (this.userCache && Date.now() - this.userCache.timestamp < this.CACHE_DURATION) {
        return {
          success: true,
          data: this.userCache.user,
        }
      }

      // If there's already a pending request, return that promise to prevent duplicate calls
      if (this.pendingUserRequest) {
        return this.pendingUserRequest
      }

      // Create new request and store it to prevent duplicates
      this.pendingUserRequest = this.fetchUserData()

      try {
        const result = await this.pendingUserRequest
        return result
      } finally {
        // Clear pending request when done
        this.pendingUserRequest = null
      }
    } catch (error) {
      this.pendingUserRequest = null
      return this.handleApiError(error, 'Failed to get user profile')
    }
  }

  /**
   * Internal method to fetch user data using /identities/me endpoint
   * Makes exactly ONE call to /identities/me, then fetches organization data if needed
   */
  private async fetchUserData(): Promise<ApiResponse<User>> {
    try {
      // Step 1: Get user data from /identities/me endpoint (JWT middleware handles authentication)
      const userResponse = await this.client.get(ENDPOINTS.AUTH.ME)

      if (!userResponse.data) {
        return {
          success: false,
          error: 'No user data received from /identities/me endpoint',
        }
      }

      const userData = userResponse.data

      // Create base user object from /identities/me response
      const baseUser = {
        id: userData.userId || userData.id || 'unknown',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phoneNumber || userData.phone || '',
        role: 'admin' as const,
        createdAt: userData.createdDate
          ? new Date(userData.createdDate).toISOString()
          : new Date().toISOString(),
        updatedAt: userData.modifiedDate
          ? new Date(userData.modifiedDate).toISOString()
          : new Date().toISOString(),
      }

      // Step 2: Fetch organization data using the userId to get company info and billing address
      let organizationData = null
      let addressData = null

      try {
        const orgResponse = await this.client.get(
          `${ENDPOINTS.ORGANIZATIONS.BASE}?userId=${userData.userId}`
        )

        if (
          orgResponse.data &&
          Array.isArray(orgResponse.data.items) &&
          orgResponse.data.items.length > 0
        ) {
          // Get the most recent organization
          const organizations = orgResponse.data.items
          organizationData =
            organizations.length === 1
              ? organizations[0]
              : organizations.sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
                  // Sort by creation date, most recent first
                  const dateA = new Date(
                    (a.createdDate as string) || (a.createdAt as string) || 0
                  ).getTime()
                  const dateB = new Date(
                    (b.createdDate as string) || (b.createdAt as string) || 0
                  ).getTime()
                  return dateB - dateA
                })[0]

          // Extract address data from organization response
          if (organizationData?.address) {
            addressData = organizationData.address
          }
        }
      } catch (orgError) {
        // Organization fetch failed, but user data is still valid
        console.warn('Failed to fetch organization data:', orgError)
      }

      // Step 3: Create complete user object with organization data if available
      const user: User = organizationData
        ? {
            ...baseUser,
            accountType: 'business',
            companyInfo: {
              companyName: organizationData.name || '',
              registrationNumber: organizationData.registrationNumber || '',
              currency: organizationData.currency || 'USD',
              businessType: organizationData.type || 'corporation',
              industry: organizationData.category || '',
              website: organizationData.website || '',
              employeeCount: organizationData.size
                ? parseInt(organizationData.size.split('-')[0])
                : undefined,
            },
            billingAddress: addressData
              ? {
                  street: addressData.addressLine1 || '',
                  street2: addressData.addressLine2 || '',
                  city: addressData.city || '',
                  state: addressData.state || '',
                  zipCode: addressData.zipCode || '',
                  country: addressData.country || '',
                }
              : undefined,
          }
        : {
            ...baseUser,
            accountType: 'personal',
            role: 'admin',
          }

      // Cache the user data
      this.userCache = {
        user,
        timestamp: Date.now(),
      }

      return {
        success: true,
        data: user,
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to fetch user data')
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return httpClient.isAuthenticated()
  }

  /**
   * Get stored auth token
   */
  getToken(): string | null {
    return httpClient.getToken()
  }

  /**
   * Get organization data for the current user
   * Used to prefill get-started form with existing company info
   */
  async getOrganizationData(): Promise<
    ApiResponse<{
      organization: Record<string, unknown> | null
      address: Record<string, unknown> | null
    }>
  > {
    try {
      const token = httpClient.getToken()
      if (!token) {
        return {
          success: false,
          error: 'No authentication token found',
        }
      }

      // Get user ID from JWT token
      const payload = this.decodeJWT(token)
      const userId = payload?.UserId ?? payload?.sub ?? payload?.id ?? payload?.userId

      if (!userId) {
        return {
          success: false,
          error: 'Invalid token format - no userId claim found',
        }
      }

      // Fetch organization data
      const orgResponse = await this.client.get(`${ENDPOINTS.ORGANIZATIONS.BASE}?userId=${userId}`)

      if (
        orgResponse.data &&
        Array.isArray(orgResponse.data.items) &&
        orgResponse.data.items.length > 0
      ) {
        // Get the most recent organization
        const organizations = orgResponse.data.items
        const organizationData =
          organizations.length === 1
            ? organizations[0]
            : organizations.sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
                const dateA = new Date(
                  (a.createdDate as string) || (a.createdAt as string) || 0
                ).getTime()
                const dateB = new Date(
                  (b.createdDate as string) || (b.createdAt as string) || 0
                ).getTime()
                return dateB - dateA
              })[0]

        return {
          success: true,
          data: {
            organization: organizationData,
            address: organizationData.address || null,
          },
          message: 'Organization data retrieved successfully',
        }
      }

      return {
        success: true,
        data: {
          organization: null,
          address: null,
        },
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to get organization data')
    }
  }

  /**
   * Extract roundAccountId from JWT token
   */
  getRoundAccountIdFromToken(token: string): string | null {
    const payload = this.decodeJWT(token)
    return (payload?.RoundAccountId as string) || null
  }

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

  private clearStoredTokens(): void {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
  }

  private handleApiError(error: unknown, defaultMessage: string): ApiResponse<never> {
    if (axios.isAxiosError(error) && error.response) {
      let errorMessage = defaultMessage

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

// Export singleton instance
export const authService = new AuthService()
