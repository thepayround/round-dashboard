/**
 * API Client service for connecting to the Round backend
 * This replaces the mock API service with real backend integration
 */

import type { AxiosInstance, AxiosError } from 'axios'
import axios from 'axios'
import type { User } from '@/shared/types/auth'

// Base URL for the API - fixed backend port
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

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
  token: string
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
        const token = this.getStoredToken()
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
          this.clearStoredToken()
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/auth/login')) {
            window.location.href = '/auth/login'
          }
        }
        return Promise.reject(error)
      }
    )
  }

  private getStoredToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  private setStoredToken(token: string): void {
    localStorage.setItem('auth_token', token)
  }

  private clearStoredToken(): void {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
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

      const response = await this.client.post<LoginResponse>('/identities/login', loginData)

      if (response.data.succeeded && response.data.token) {
        // Store tokens
        this.setStoredToken(response.data.token)
        if (response.data.refreshToken) {
          localStorage.setItem('refresh_token', response.data.refreshToken)
        }

        // Create user object from the response
        // Note: The backend doesn't return user info in login response,
        // so we'll need to fetch it separately or modify the backend
        const user: User = {
          id: 'temp-id', // This should come from JWT or separate call
          firstName: '',
          lastName: '',
          email: credentials.email,
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
            token: response.data.token,
            refreshToken: response.data.refreshToken,
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
      console.error('Login error:', error)

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

      const response = await this.client.post<RegisterResponse>(
        '/identities/register',
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
      console.error('Registration error:', error)

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

      const response = await this.client.post('/identities/refresh-token', {
        refreshToken,
      })

      if (response.data.token) {
        this.setStoredToken(response.data.token)
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
      console.error('Token refresh error:', error)
      this.clearStoredToken()
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
      await this.client.post('/identities/logout')
      this.clearStoredToken()
      return {
        success: true,
        message: 'Logout successful',
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Clear tokens even if logout fails
      this.clearStoredToken()
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
        `/identities/confirm-email?userId=${encodeURIComponent(userId)}&token=${encodeURIComponent(token)}`
      )

      return {
        success: true,
        data: { message: response.data },
        message: 'Email confirmed successfully',
      }
    } catch (error) {
      console.error('Email confirmation error:', error)

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
      const url = `/identities/confirm-email-and-login?userId=${encodeURIComponent(userId)}&token=${encodeURIComponent(token)}`

      const response = await this.client.post<LoginResponse>(url, {})

      if (response.data.succeeded && response.data.token) {
        // Store tokens
        this.setStoredToken(response.data.token)
        if (response.data.refreshToken) {
          localStorage.setItem('refresh_token', response.data.refreshToken)
        }

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
            token: response.data.token,
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
      console.error('Email confirmation and login error:', error)

      if (axios.isAxiosError(error) && error.response) {
        console.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        })

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
      const response = await this.client.post('/identities/resend', { email })

      return {
        success: true,
        data: { message: response.data.message },
        message: 'Confirmation email sent successfully',
      }
    } catch (error) {
      console.error('Resend confirmation error:', error)

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
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const response = await this.client.get('/users/profile')
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      console.error('Get current user error:', error)
      return {
        success: false,
        error: 'Failed to get user profile',
      }
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getStoredToken()
  }

  /**
   * Get stored auth token
   */
  getToken(): string | null {
    return this.getStoredToken()
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export types for use in components
export type { ApiResponse, LoginRequest, RegisterRequest, User, AuthResponse }
