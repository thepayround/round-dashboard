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
}

// Export singleton instance
export const httpClient = new BaseHttpClient()
