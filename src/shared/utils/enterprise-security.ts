/**
 * Enterprise-grade security measures inspired by major tech companies
 * Facebook, Google, Netflix, GitHub, LinkedIn approach
 */

export class EnterprisePasswordSecurity {
  /**
   * Method 1: Facebook/Google Style - Focus on HTTPS + Backend Security
   * They accept Network tab exposure and focus on what actually matters
   */
  static createSecureLoginPayload_Standard(email: string, password: string) {
    // This is what major companies do - send password as-is with strong backend security
    return {
      identifier: email,
      password,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      sessionId: crypto.randomUUID(),
    }
  }

  /**
   * Method 2: GitHub Style - Add Client Fingerprinting
   * Additional device/browser verification
   */
  static createSecureLoginPayload_WithFingerprinting(email: string, password: string) {
    const fingerprint = this.generateDeviceFingerprint()

    return {
      identifier: email,
      password,
      deviceFingerprint: fingerprint,
      timestamp: Date.now(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
  }

  /**
   * Method 3: Banking Style - Multiple Security Layers
   * What financial institutions use
   */
  static createSecureLoginPayload_Banking(email: string, password: string) {
    const deviceInfo = this.getDeviceInfo()
    const locationInfo = this.getLocationInfo()

    return {
      identifier: email,
      password: btoa(password), // Base64 (minimal obfuscation)
      encoded: true,
      device: deviceInfo,
      location: locationInfo,
      riskScore: this.calculateRiskScore(),
      timestamp: Date.now(),
    }
  }

  /**
   * Method 4: Advanced Obfuscation (What we implemented)
   * Better than major companies for Network tab viewing
   */
  static createSecureLoginPayload_Advanced(email: string, password: string) {
    const obfuscatedPassword = this.obfuscatePassword(password)

    return {
      identifier: email,
      password: obfuscatedPassword.value,
      encoded: obfuscatedPassword.encoded,
      encrypted: obfuscatedPassword.encrypted,
      salt: obfuscatedPassword.salt,
      timestamp: Date.now(),
    }
  }

  // Helper methods
  private static generateDeviceFingerprint(): string {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx!.textBaseline = 'top'
    ctx!.font = '14px Arial'
    ctx!.fillText('Device fingerprint', 2, 2)

    const fingerprint = {
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      canvas: canvas.toDataURL(),
      plugins: Array.from(navigator.plugins)
        .map(p => p.name)
        .sort(),
    }

    return btoa(JSON.stringify(fingerprint))
  }

  private static getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
  }

  private static getLocationInfo() {
    // Note: This would require user permission for precise location
    return {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      // coordinates would require geolocation API permission
    }
  }

  private static calculateRiskScore(): number {
    // Basic risk calculation based on various factors
    let risk = 0

    // Check for development environment
    if (window.location.hostname === 'localhost') risk += 0.1

    // Check for unusual browser characteristics
    if (!window.navigator.cookieEnabled) risk += 0.3

    // Time-based risk (unusual login hours)
    const hour = new Date().getHours()
    if (hour < 6 || hour > 23) risk += 0.2

    return Math.min(risk, 1.0)
  }

  private static obfuscatePassword(password: string) {
    // Multi-layer obfuscation
    const salt = crypto.randomUUID()
    const saltedPassword = password + salt
    const base64 = btoa(saltedPassword)

    // Simple character substitution for additional obfuscation
    const substituted = base64
      .replace(/A/g, '9')
      .replace(/E/g, '8')
      .replace(/I/g, '7')
      .replace(/O/g, '6')
      .replace(/U/g, '5')

    return {
      value: substituted,
      encoded: true,
      encrypted: false,
      salt,
    }
  }
}

/**
 * Production Security Recommendations (What major companies actually focus on)
 */
export class ProductionSecurity {
  /**
   * What Facebook/Google/Netflix actually prioritize
   */
  static getIndustryBestPractices() {
    return {
      priorities: [
        '1. HTTPS Everywhere (SSL/TLS)',
        '2. Strong backend password hashing (bcrypt/Argon2)',
        '3. Rate limiting and brute force protection',
        '4. Two-factor authentication',
        '5. Device verification and suspicious activity detection',
        '6. Session management and timeout',
        '7. Input validation and SQL injection prevention',
        '8. Regular security audits and penetration testing',
      ],
      lessImportant: [
        'Hiding passwords from Network tab (impossible anyway)',
        'Client-side password encryption (security theater)',
        'Disabling browser dev tools (easily bypassed)',
      ],
    }
  }

  /**
   * Security theater vs Real security
   */
  static explainSecurityReality() {
    // console.group('🎭 Security Theater vs 🛡️ Real Security')
    // console.log('🎭 Security Theater (looks good, minimal impact):')
    // console.log('   - Hiding Network tab (impossible)')
    // console.log('   - Disabling F12 (easily bypassed)')
    // console.log('   - Client-side validation only')
    // console.log('🛡️ Real Security (actually protects users):')
    // console.log('   - HTTPS encryption')
    // console.log('   - Strong password hashing (bcrypt)')
    // console.log('   - Rate limiting')
    // console.log('   - 2FA/MFA')
    // console.log('   - Session security')
    // console.log('   - Input validation')
    // console.groupEnd()
  }
}
