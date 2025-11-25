import type { CompanyInfo, BillingAddress } from './business'

import type { OnboardingData } from '@/features/onboarding/types/onboarding'
import type { CountryPhoneInfo } from '@/shared/services/api/phoneValidation.service'

export type AccountType = 'personal' | 'business'

export interface RoundAccountUser {
  roundAccountId: string
  userId: string
  // Add other fields as needed
}

export interface BaseUser {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  countryPhoneCode?: string
  phoneNumberFormatted?: string
  phoneCountryInfo?: CountryPhoneInfo
  avatar?: string
  accountType: AccountType
  createdAt: string
  updatedAt: string
  onboardingCompleted?: boolean
  onboardingData?: Partial<OnboardingData>
  roundAccountId?: string
  roundAccountUsers?: RoundAccountUser[]
}

export interface PersonalUser extends BaseUser {
  accountType: 'personal'
  role: 'admin' | 'user' | 'viewer'
}

export interface BusinessUser extends BaseUser {
  accountType: 'business'
  companyInfo: CompanyInfo
  billingAddress?: BillingAddress
  role: 'admin' | 'member' | 'billing_manager' | 'viewer'
}

export type User = PersonalUser | BusinessUser

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface LoginRequest {
  identifier: string // Email, phone, or username
  password: string
  roundAccountId?: string
}

export interface PersonalRegisterRequest {
  accountType: 'personal'
  firstName: string
  lastName: string
  email: string
  phone: string
  countryPhoneCode?: string
  password: string
}

export interface BusinessRegisterRequest {
  accountType: 'business'
  firstName: string
  lastName: string
  email: string
  phone: string
  countryPhoneCode?: string
  password: string
  companyInfo: CompanyInfo
  billingAddress?: BillingAddress
}

export type RegisterRequest = PersonalRegisterRequest | BusinessRegisterRequest

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  succeeded: boolean
  message: string
}

export interface ResetPasswordRequest {
  email: string
  token: string
  newPassword: string
  confirmPassword: string
}

export interface ResetPasswordResponse {
  succeeded: boolean
  message?: string
  errors?: { code: string; description: string }[]
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
