/**
 * Centralized API endpoint constants
 * Eliminates magic strings and provides a single source of truth for all API routes
 */

export const API_ENDPOINTS = {
  /**
   * Authentication & Identity Management endpoints
   */
  AUTH: {
    LOGIN: '/identities/login',
    REGISTER: '/identities/register',
    LOGOUT: '/identities/logout',
    REFRESH_TOKEN: '/identities/refresh-token',
    CONFIRM_EMAIL: '/identities/confirm-email',
    CONFIRM_EMAIL_AND_LOGIN: '/identities/confirm-email-and-login',
    RESEND_CONFIRMATION: '/identities/resend',
    FORGOT_PASSWORD: '/identities/forgot-password',
    RESET_PASSWORD: '/identities/reset-password',
    CHANGE_PASSWORD: '/identities/change-password',
    CURRENT_USER: '/identities/me',
  },

  /**
   * Customer Management endpoints
   */
  CUSTOMERS: {
    BASE: '/customers',
    BY_ID: (id: string) => `/customers/${id}`,
    SEARCH: '/customers/search',
  },

  /**
   * Organization Management endpoints
   */
  ORGANIZATIONS: {
    BASE: '/organizations',
    BY_ID: (id: string) => `/organizations/${id}`,
    CURRENT: '/organizations/current',
  },

  /**
   * User Settings endpoints
   */
  USER_SETTINGS: {
    BASE: '/user-settings',
    NOTIFICATIONS: '/user-settings/notifications',
  },

  /**
   * Team Management endpoints
   */
  TEAM: {
    MEMBERS: '/team/members',
    INVITATIONS: '/team/invitations',
    INVITE: '/team/invite',
    MEMBER_BY_ID: (userId: string) => `/team/members/${userId}`,
    MEMBER_ROLE: (userId: string) => `/team/members/${userId}/role`,
    INVITATION_BY_ID: (invitationId: string) => `/team/invitations/${invitationId}`,
    INVITATION_RESEND: (invitationId: string) => `/team/invitations/${invitationId}/resend`,
  },

  /**
   * Round Account endpoints
   */
  ROUND_ACCOUNTS: {
    BASE: '/round-accounts',
    BY_ID: (id: string) => `/round-accounts/${id}`,
    ADDRESSES: (id: string) => `/round-accounts/${id}/addresses`,
  },

  /**
   * Phone Validation endpoints
   */
  PHONE: {
    VALIDATE: '/phone/validate',
    PARSE: '/phone/parse',
    COUNTRIES: '/phone/countries',
  },

  /**
   * Reference Data endpoints
   */
  REFERENCE: {
    ORGANIZATION_TYPES: '/organization-types',
    CURRENCIES: '/currencies',
    TIMEZONES: '/timezones',
    COUNTRIES: '/countries',
  },
} as const

/**
 * Helper function to build query string from params object
 */
export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  })
  
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}
