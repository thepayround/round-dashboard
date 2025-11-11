/**
 * Authentication API types
 */

import type { User } from '@/shared/types/auth'

export interface LoginRequest {
  identifier: string // Email, phone, or username
  password: string
  roundAccountId?: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  userName?: string
  password: string
  phoneNumber: string
  countryPhoneCode: string
}

export interface LoginResponse {
  succeeded: boolean
  token: string
  refreshToken: string
  errors?: { code: string; description: string }[]
}

export interface RegisterResponse {
  message: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  token: string
  refreshToken: string
}

export interface ConfirmEmailRequest {
  userId: string
  token: string
}

export interface ResendConfirmationRequest {
  email: string
}
