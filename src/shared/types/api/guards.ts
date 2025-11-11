/**
 * Type guards for runtime validation of API responses
 * These guards ensure backend responses match expected TypeScript interfaces
 */

import type { CustomerResponse } from '@/shared/services/api/customer.service'
import { CustomerType, CustomerStatus } from '@/shared/services/api/customer.service'
import type { LoginResponse, RegisterResponse, AuthResponse } from '@/shared/types/api/auth'
import type { User, PersonalUser, BusinessUser } from '@/shared/types/auth'

/**
 * Type guard to check if a value is a non-null object
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Type guard to check if a value is a string
 */
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

/**
 * Type guard to check if a value is a boolean
 */
function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

/**
 * Type guard for LoginResponse
 */
export function isLoginResponse(data: unknown): data is LoginResponse {
  if (!isObject(data)) return false
  
  const response = data as Record<string, unknown>
  
  return (
    isBoolean(response.succeeded) &&
    isString(response.token) &&
    isString(response.refreshToken) &&
    (response.errors === undefined || Array.isArray(response.errors))
  )
}

/**
 * Type guard for RegisterResponse
 */
export function isRegisterResponse(data: unknown): data is RegisterResponse {
  if (!isObject(data)) return false
  
  const response = data as Record<string, unknown>
  
  return isString(response.message)
}

/**
 * Type guard for base User properties
 */
function hasBaseUserProperties(user: Record<string, unknown>): boolean {
  return (
    isString(user.id) &&
    isString(user.email) &&
    isString(user.firstName) &&
    isString(user.lastName) &&
    isString(user.phone) &&
    isString(user.accountType) &&
    isString(user.createdAt) &&
    isString(user.updatedAt) &&
    (user.countryPhoneCode === undefined || isString(user.countryPhoneCode)) &&
    (user.phoneNumberFormatted === undefined || isString(user.phoneNumberFormatted)) &&
    (user.avatar === undefined || isString(user.avatar)) &&
    (user.roundAccountId === undefined || isString(user.roundAccountId))
  )
}

/**
 * Type guard for PersonalUser
 */
export function isPersonalUser(data: unknown): data is PersonalUser {
  if (!isObject(data)) return false
  
  const user = data as Record<string, unknown>
  
  return (
    hasBaseUserProperties(user) &&
    user.accountType === 'personal' &&
    isString(user.role) &&
    ['admin', 'user', 'viewer'].includes(user.role as string)
  )
}

/**
 * Type guard for BusinessUser
 */
export function isBusinessUser(data: unknown): data is BusinessUser {
  if (!isObject(data)) return false
  
  const user = data as Record<string, unknown>
  
  return (
    hasBaseUserProperties(user) &&
    user.accountType === 'business' &&
    isObject(user.companyInfo) &&
    isString(user.role) &&
    ['admin', 'member', 'billing_manager', 'viewer'].includes(user.role as string)
  )
}

/**
 * Type guard for User (PersonalUser | BusinessUser)
 */
export function isUser(data: unknown): data is User {
  return isPersonalUser(data) || isBusinessUser(data)
}

/**
 * Type guard for AuthResponse
 */
export function isAuthResponse(data: unknown): data is AuthResponse {
  if (!isObject(data)) return false
  
  const response = data as Record<string, unknown>
  
  return (
    isUser(response.user) &&
    isString(response.accessToken) &&
    isString(response.refreshToken)
  )
}

/**
 * Type guard for CustomerType enum (string values from backend)
 */
function isCustomerType(value: unknown): value is CustomerType {
  return value === 'Individual' || value === 'Business'
}

/**
 * Type guard for CustomerStatus enum (string values from backend)
 */
function isCustomerStatus(value: unknown): value is CustomerStatus {
  return (
    value === 'Active' ||
    value === 'Inactive' ||
    value === 'Suspended' ||
    value === 'Cancelled'
  )
}

/**
 * Type guard for CustomerResponse
 */
export function isCustomerResponse(data: unknown): data is CustomerResponse {
  if (!isObject(data)) return false
  
  const customer = data as Record<string, unknown>
  
  return (
    isString(customer.id) &&
    isCustomerType(customer.type) &&
    isString(customer.effectiveDisplayName) &&
    isBoolean(customer.isBusinessCustomer) &&
    isString(customer.email) &&
    isString(customer.firstName) &&
    isString(customer.lastName) &&
    isString(customer.displayName) &&
    (customer.company === undefined || customer.company === null || isString(customer.company)) &&
    (customer.phoneNumber === undefined || customer.phoneNumber === null || isString(customer.phoneNumber)) &&
    (customer.phoneNumberConfirmed === undefined || customer.phoneNumberConfirmed === null || isBoolean(customer.phoneNumberConfirmed)) &&
    (customer.taxNumber === undefined || customer.taxNumber === null || isString(customer.taxNumber)) &&
    (customer.locale === undefined || customer.locale === null || isString(customer.locale)) &&
    (customer.timezone === undefined || customer.timezone === null || isString(customer.timezone)) &&
    isString(customer.currency) &&
    isCustomerStatus(customer.status) &&
    isString(customer.signupDate) &&
    (customer.lastActivityDate === undefined || customer.lastActivityDate === null || isString(customer.lastActivityDate)) &&
    isBoolean(customer.portalAccess) &&
    isBoolean(customer.autoCollection) &&
    Array.isArray(customer.tags) &&
    isObject(customer.customFields) &&
    isString(customer.createdDate) &&
    isString(customer.modifiedDate) &&
    (customer.billingAddress === undefined || customer.billingAddress === null || isObject(customer.billingAddress)) &&
    (customer.shippingAddress === undefined || customer.shippingAddress === null || isObject(customer.shippingAddress)) &&
    Array.isArray(customer.allAddresses) &&
    Array.isArray(customer.notes)
  )
}

/**
 * Helper function to validate API response and throw error if invalid
 */
export function validateApiResponse<T>(
  data: unknown,
  guard: (data: unknown) => data is T,
  errorMessage: string
): T {
  if (!guard(data)) {
    throw new Error(`${errorMessage}: Invalid response structure`)
  }
  return data
}

/**
 * Helper function to safely validate API response without throwing
 */
export function safeValidateApiResponse<T>(
  data: unknown,
  guard: (data: unknown) => data is T
): { valid: true; data: T } | { valid: false; data: unknown } {
  if (guard(data)) {
    return { valid: true, data }
  }
  return { valid: false, data }
}
