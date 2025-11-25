/**
 * Base HTTP client with interceptors
 * Gold Standard: Memory-only access tokens, HttpOnly cookie refresh tokens
 */

import axios from 'axios'
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'

import { API_CONFIG } from './config'

import { tokenManager } from '@/shared/utils/tokenManager'

class BaseHttpClient {
  private client: AxiosInstance
  private isRefreshing = false
  private refreshPromise: Promise<string> | null = null

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: API_CONFIG.headers,
      withCredentials: true,  // CRITICAL: Send HttpOnly cookies
    })

    this.setupInterceptors()
    this.setupTokenRefreshListener()
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Skip token for login/register/google-auth endpoints
        if (config.url?.includes('/login') || 
            config.url?.includes('/register') || 
            config.url?.includes('/google-auth')) {
          return config;
        }

        let token = tokenManager.getAccessToken();
        
        // If no token or expired, try to refresh
        if (!token && !config.url?.includes('/refresh-token')) {
          try {
            token = await this.refreshAccessToken();
          } catch (error) {
            // Refresh failed, redirect to login
            const currentPath = window.location.pathname;
            if (!currentPath.includes('/auth/') && !currentPath.includes('/login')) {
              window.location.href = '/login';
            }
            return Promise.reject(error);
          }
        }

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor to handle 401 with retry
    this.client.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If 401 and haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect
            tokenManager.clearAccessToken();
            
            const currentPath = window.location.pathname;
            if (!currentPath.includes('/auth/') && !currentPath.includes('/login')) {
              window.location.href = '/login';
            }
            
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Refresh access token using HttpOnly cookie
   * Refresh token is sent automatically via withCredentials
   */
  private async refreshAccessToken(): Promise<string> {
    // Prevent concurrent refresh requests
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        // POST to refresh endpoint
        // Refresh token sent automatically via cookie (withCredentials: true)
        const response = await axios.post(
          `${API_CONFIG.baseURL}/identities/refresh-token`,
          {},  // Empty body
          {
            withCredentials: true,  // Send HttpOnly cookie
            timeout: 5000
          }
        );

        const newAccessToken = response.data.token;
        
        if (!newAccessToken) {
          throw new Error('No access token in refresh response');
        }

        tokenManager.setAccessToken(newAccessToken);
        return newAccessToken;
      } catch (error) {
        tokenManager.clearAccessToken();
        throw error;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Listen for token refresh events (from auto-refresh timer)
   */
  private setupTokenRefreshListener(): void {
    window.addEventListener('token-refresh-needed', async () => {
      try {
        await this.refreshAccessToken();
        // Token auto-refreshed successfully
      } catch (error) {
        // Silent fail - token refresh will be retried on next request
      }
    });
  }

  // Legacy methods maintained for compatibility
  private getStoredToken(): string | null {
    return tokenManager.getAccessToken();
  }

  private clearStoredToken(): void {
    tokenManager.clearAccessToken();
  }

  public setStoredToken(token: string): void {
    tokenManager.setAccessToken(token);
  }

  public getClient(): AxiosInstance {
    return this.client;
  }

  public isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
  }

  public getToken(): string | null {
    return tokenManager.getAccessToken();
  }
}

// Export singleton instance
export const httpClient = new BaseHttpClient()

