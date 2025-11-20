/**
 * URL Sanitization Utilities
 * Prevents XSS attacks through malicious URLs (javascript:, data:, vbscript: protocols)
 */

/**
 * Sanitizes a URL to prevent XSS attacks
 * Blocks dangerous protocols like javascript:, data:, vbscript:
 * Ensures URLs use http:// or https:// protocols
 *
 * @param url - The URL to sanitize
 * @param fallback - Fallback URL if sanitization fails (default: '#')
 * @returns Sanitized URL safe for use in href attributes
 *
 * @example
 * sanitizeUrl('https://example.com') // 'https://example.com'
 * sanitizeUrl('example.com') // 'https://example.com'
 * sanitizeUrl('javascript:alert(1)') // '#'
 * sanitizeUrl('') // '#'
 */
export const sanitizeUrl = (url: string | null | undefined, fallback = '#'): string => {
  // Handle null/undefined/empty
  if (!url || !url.trim()) {
    return fallback
  }

  const trimmed = url.trim()
  const normalized = trimmed.toLowerCase()

  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'about:']
  for (const protocol of dangerousProtocols) {
    if (normalized.startsWith(protocol)) {
      console.warn(`[Security] Blocked dangerous URL protocol: ${protocol}`)
      return fallback
    }
  }

  // Ensure http/https protocol (if no protocol specified, add https://)
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    return `https://${trimmed}`
  }

  return trimmed
}

/**
 * Checks if a URL is safe (doesn't use dangerous protocols)
 *
 * @param url - The URL to check
 * @returns true if URL is safe, false otherwise
 */
export const isUrlSafe = (url: string | null | undefined): boolean => {
  if (!url || !url.trim()) {
    return false
  }

  const normalized = url.trim().toLowerCase()
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'about:']

  return !dangerousProtocols.some(protocol => normalized.startsWith(protocol))
}

/**
 * Validates URL protocol for forms and user input
 * More strict than sanitizeUrl - rejects instead of fixing
 *
 * @param url - The URL to validate
 * @returns true if URL has valid protocol, false otherwise
 */
export const hasValidProtocol = (url: string): boolean => {
  if (!url || !url.trim()) {
    return true // Empty URLs are handled by required validation
  }

  const normalized = url.trim().toLowerCase()

  // Must start with http:// or https:// or have no protocol
  const hasHttp = normalized.startsWith('http://') || normalized.startsWith('https://')
  const hasNoProtocol = !normalized.includes('://')

  return hasHttp || hasNoProtocol
}
