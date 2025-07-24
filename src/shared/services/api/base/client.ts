/**
 * Base HTTP client with interceptors
 */

import axios from 'axios'
import type { AxiosInstance, AxiosError } from 'axios'
import { API_CONFIG } from './config'

class BaseHttpClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: API_CONFIG.headers,
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token and secure logging
    this.client.interceptors.request.use(
      config => {
        const token = this.getStoredToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Secure logging (only in development)
        if (import.meta.env.DEV) {
          // console.group('🔐 API Request')
          // console.log('Method:', config.method?.toUpperCase())
          // console.log('URL:', config.url)
          // console.log('Data (MASKED):', this.maskSensitiveData(config.data))
          // console.log('Headers (MASKED):', this.maskSensitiveHeaders(config.headers))
          // console.groupEnd()
        }

        return config
      },
      error => Promise.reject(error)
    )

    // Response interceptor to handle errors and secure logging
    this.client.interceptors.response.use(
      response =>
        // Secure logging (only in development)
        // if (import.meta.env.DEV) {
        //   console.log('✅ API Response:', {
        //     status: response.status,
        //     url: response.config.url,
        //     data: this.maskSensitiveData(response.data),
        //   })
        // }
        response,
      (error: AxiosError) => {
        // Secure error logging (only in development)
        if (import.meta.env.DEV) {
          console.error('❌ API Error:', {
            status: error.response?.status,
            url: error.config?.url,
            method: error.config?.method?.toUpperCase(),
            message: error.message,
            data: this.maskSensitiveData(error.response?.data as Record<string, unknown>),
          })
        }

        if (error.response?.status === 401) {
          // Token expired or invalid
          this.clearStoredToken()
          // Only redirect if not already on auth pages and if we're actually logged in
          const currentPath = window.location.pathname
          const isAuthPage = currentPath.includes('/auth/')
          const hasToken = !!localStorage.getItem('auth_token')

          if (!isAuthPage && hasToken) {
            // Only redirect if user was logged in and got 401
            console.warn('Session expired, redirecting to login')
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

  private clearStoredToken(): void {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
  }

  public setStoredToken(token: string): void {
    localStorage.setItem('auth_token', token)
  }

  public getClient(): AxiosInstance {
    return this.client
  }

  public isAuthenticated(): boolean {
    return !!this.getStoredToken()
  }

  public getToken(): string | null {
    return this.getStoredToken()
  }

  /**
   * Mask sensitive data in request payloads for secure logging
   */
  private maskSensitiveData(data: Record<string, unknown>): Record<string, unknown> {
    if (!data) return data

    const sensitiveFields = [
      'password',
      'newPassword',
      'currentPassword',
      'confirmPassword',
      'token',
      'refreshToken',
      'accessToken',
      'secret',
      'apiKey',
      'creditCard',
      'ssn',
      'socialSecurityNumber',
    ]

    const maskedData: Record<string, unknown> = { ...data }

    sensitiveFields.forEach(field => {
      if (Object.prototype.hasOwnProperty.call(maskedData, field)) {
        maskedData[field] = '***MASKED***'
      }
    })

    return maskedData
  }

  /**
   * Mask sensitive headers for secure logging
   */
  private maskSensitiveHeaders(headers: Record<string, unknown>): Record<string, unknown> {
    if (!headers) return headers

    const maskedHeaders: Record<string, unknown> = { ...headers }

    if ('Authorization' in maskedHeaders) {
      maskedHeaders['Authorization'] = 'Bearer ***MASKED***'
    }

    return maskedHeaders
  }
}

// Export singleton instance
export const httpClient = new BaseHttpClient()
