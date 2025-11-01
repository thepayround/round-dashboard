/**
 * Centralized Token Management Utility
 * Handles all token storage, retrieval, and management operations
 */

const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export const tokenManager = {
  /**
   * Get the access token from storage
   */
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),

  /**
   * Set the access token in storage
   */
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token)
  },

  /**
   * Get the refresh token from storage
   */
  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),

  /**
   * Set the refresh token in storage
   */
  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  },

  /**
   * Set both access and refresh tokens
   */
  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },

  /**
   * Remove the access token from storage
   */
  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY)
  },

  /**
   * Remove the refresh token from storage
   */
  removeRefreshToken: (): void => {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  /**
   * Remove all tokens from storage
   */
  clearTokens: (): void => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  /**
   * Check if a valid access token exists
   */
  hasToken: (): boolean => !!localStorage.getItem(TOKEN_KEY),

  /**
   * Check if a valid refresh token exists
   */
  hasRefreshToken: (): boolean => !!localStorage.getItem(REFRESH_TOKEN_KEY),
}
