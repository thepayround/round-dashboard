/**
 * Client-side encryption utilities for sensitive data
 */

import CryptoJS from 'crypto-js'

export class PasswordEncryption {
  private static readonly ENCRYPTION_KEY = 'round-app-secure-key-2024' // In production, use environment variable

  /**
   * Encrypt password before sending to server
   */
  static encryptPassword(password: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(password, this.ENCRYPTION_KEY).toString()
      return encrypted
    } catch (error) {
      console.error('Password encryption failed:', error)
      return password // Fallback to plain password if encryption fails
    }
  }

  /**
   * Hash password for additional security (one-way)
   */
  static hashPassword(password: string): string {
    return CryptoJS.SHA256(password + this.ENCRYPTION_KEY).toString()
  }

  /**
   * Generate secure random salt
   */
  static generateSalt(): string {
    return CryptoJS.lib.WordArray.random(128 / 8).toString()
  }

  /**
   * Encrypt password with salt (most secure)
   */
  static encryptPasswordWithSalt(password: string): { encrypted: string; salt: string } {
    const salt = this.generateSalt()
    const saltedPassword = password + salt
    const encrypted = CryptoJS.AES.encrypt(saltedPassword, this.ENCRYPTION_KEY).toString()

    return {
      encrypted,
      salt,
    }
  }
}

/**
 * Secure form data handling
 */
export class SecureFormData {
  /**
   * Create secure login payload that masks password in Network tab
   * Uses Base64 encoding - simpler but still hides from casual viewing
   */
  static createSecureLoginPayload(email: string, password: string) {
    // Option 1: Simple Base64 encoding (easier to implement on backend)
    const encodedPassword = btoa(password) // Base64 encode

    return {
      identifier: email,
      password: encodedPassword,
      encoded: true, // Flag to tell backend this is base64 encoded
    }
  }

  /**
   * Create login payload with AES encryption (more secure)
   */
  static createEncryptedLoginPayload(email: string, password: string) {
    const encryptedPassword = PasswordEncryption.encryptPassword(password)

    return {
      identifier: email,
      password: encryptedPassword,
      encrypted: true, // Flag to tell backend this is encrypted
    }
  }

  /**
   * Create login payload with hash (alternative approach)
   */
  static createHashedLoginPayload(email: string, password: string) {
    const hashedPassword = PasswordEncryption.hashPassword(password)

    return {
      identifier: email,
      passwordHash: hashedPassword,
      type: 'hashed', // Flag to tell backend this is hashed
    }
  }
}
