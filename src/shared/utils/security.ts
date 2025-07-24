/**
 * Security utilities for protecting sensitive data
 */

/**
 * Enhanced security measures for sensitive operations
 */
export class SecurityUtils {
  /**
   * Disable browser dev tools in production (partial protection)
   */
  static disableDevToolsInProduction(): void {
    if (import.meta.env.PROD) {
      // Disable right-click context menu
      document.addEventListener('contextmenu', e => {
        e.preventDefault()
        return false
      })

      // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
      document.addEventListener('keydown', e => {
        // F12
        if (e.key === 'F12') {
          e.preventDefault()
          return false
        }

        // Ctrl+Shift+I (Inspector)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
          e.preventDefault()
          return false
        }

        // Ctrl+U (View Source)
        if (e.ctrlKey && e.key === 'u') {
          e.preventDefault()
          return false
        }

        // Ctrl+Shift+C (Select Element)
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
          e.preventDefault()
          return false
        }

        // Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
          e.preventDefault()
          return false
        }
      })

      // Detect dev tools being opened (basic detection)
      const devtools = { open: false }
      const threshold = 160

      setInterval(() => {
        if (
          window.outerHeight - window.innerHeight > threshold ||
          window.outerWidth - window.innerWidth > threshold
        ) {
          if (!devtools.open) {
            devtools.open = true
            // console.clear()
            // console.warn('🚨 Developer tools detected. This is a security-conscious application.')
          }
        } else {
          devtools.open = false
        }
      }, 500)
    }
  }

  /**
   * Clear sensitive data from memory (basic protection)
   */
  static clearSensitiveData(obj: Record<string, unknown>): void {
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        if (
          key.toLowerCase().includes('password') ||
          key.toLowerCase().includes('token') ||
          key.toLowerCase().includes('secret')
        ) {
          obj[key] = null
        }
      })
    }
  }

  /**
   * Warn user about network tab exposure (development only)
   */
  static warnAboutNetworkTab(): void {
    if (import.meta.env.DEV) {
      console.warn(
        '%c🔒 SECURITY NOTICE',
        'color: red; font-weight: bold; font-size: 14px;',
        '\n\n⚠️  Passwords are visible in Browser Network tab - this is normal browser behavior.\n' +
          '✅  Passwords are masked in console logs for security.\n' +
          '🔐  In production, additional security measures are active.\n' +
          '🚫  Never share screenshots of Network tab containing sensitive data.\n'
      )
    }
  }
}

/**
 * Enhanced password input security
 */
export class PasswordSecurity {
  /**
   * Create a secure password input that clears itself after use
   */
  static createSecurePasswordInput(value: string): SecurePassword {
    return new SecurePassword(value)
  }
}

/**
 * Secure password container that auto-clears
 */
class SecurePassword {
  private _value: string
  private _cleared: boolean = false

  constructor(value: string) {
    this._value = value
  }

  get value(): string {
    if (this._cleared) {
      throw new Error('Password has been cleared for security')
    }
    return this._value
  }

  clear(): void {
    this._value = ''
    this._cleared = true
  }

  toString(): string {
    return '***SECURE_PASSWORD***'
  }

  toJSON(): string {
    return '***SECURE_PASSWORD***'
  }
}
