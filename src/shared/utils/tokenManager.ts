/**
 * Secure Token Manager - Memory-Only Storage
 * Gold Standard Implementation: Tokens NEVER stored in localStorage (XSS protection)
 * Access tokens in memory only, refresh tokens in HttpOnly cookies
 */

class SecureTokenManager {
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;

  /**
   * Set access token in memory only
   */
  setAccessToken(token: string): void {
    // Validate token is a string and looks like a JWT
    if (!token || typeof token !== 'string') {
      console.error('Invalid token provided to setAccessToken:', typeof token, token);
      return;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Token is not a valid JWT (expected 3 parts, got ' + parts.length + '):', token);
      return;
    }

    this.accessToken = token;
    
    // Decode JWT to get expiry (JWT uses Base64URL, need to convert to standard Base64)
    try {
      // Convert Base64URL to standard Base64 (replace - with +, _ with /, and add padding)
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padding = '='.repeat((4 - (base64.length % 4)) % 4);
      const payload = JSON.parse(atob(base64 + padding));
      
      this.tokenExpiry = payload.exp * 1000; // Convert to milliseconds
      
      // Schedule automatic refresh 1 minute before expiry
      this.scheduleTokenRefresh();
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  }

  /**
   * Get access token if still valid
   */
  getAccessToken(): string | null {
    // Check if token expired
    if (this.tokenExpiry && Date.now() >= this.tokenExpiry) {
      this.clearAccessToken();
      return null;
    }
    return this.accessToken;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }

  /**
   * Clear access token from memory
   */
  clearAccessToken(): void {
    this.accessToken = null;
    this.tokenExpiry = null;
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Schedule automatic token refresh before expiry
   */
  private scheduleTokenRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    if (this.tokenExpiry) {
      // Refresh 1 minute (60 seconds) before expiry
      const refreshTime = this.tokenExpiry - Date.now() - 60000;
      
      if (refreshTime > 0) {
        this.refreshTimer = setTimeout(() => {
          // Trigger refresh through event
          window.dispatchEvent(new CustomEvent('token-refresh-needed'));
        }, refreshTime);
      }
    }
  }

  /**
   * Get token expiry time
   */
  getTokenExpiry(): number | null {
    return this.tokenExpiry;
  }
}

export const tokenManager = new SecureTokenManager();

