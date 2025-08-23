/**
 * API configuration
 */

import type { ApiConfig } from '@/shared/types/api'

export const API_CONFIG: ApiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 10000,
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
}

export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/identities/login',
    REGISTER: '/identities/register',
    REGISTER_BUSINESS: '/identities/register-business',
    LOGOUT: '/identities/logout',
    REFRESH_TOKEN: '/identities/refresh-token',
    CONFIRM_EMAIL: '/identities/confirm-email',
    CONFIRM_EMAIL_AND_LOGIN: '/identities/confirm-email-and-login',
    RESEND_CONFIRMATION: '/identities/resend',
    ME: '/identities/me',
  },
  // Organizations (addresses are included in organization responses)
  // RESTful resource-oriented design
  ORGANIZATIONS: {
    BASE: '/organizations',
    BY_ID: (id: string) => `/organizations/${id}`,
    // RESTful filtering via query parameters
    FILTERED_BY_ROUND_ACCOUNT: (roundAccountId: string) =>
      `/organizations?roundAccountId=${roundAccountId}`,
    // Legacy endpoint (deprecated)
    BY_ROUND_ACCOUNT_ID_LEGACY: (roundAccountId: string) =>
      `/organizations/round-account/${roundAccountId}`,
    // Organization addresses
    ADDRESSES: (organizationId: string) => `/organizations/${organizationId}/addresses`,
  },
  // Addresses
  ADDRESSES: {
    BASE: '/addresses',
    BY_ID: (id: string) => `/addresses/${id}`,
    BY_ORGANIZATION: (organizationId: string) => `/addresses?organizationId=${organizationId}`,
    DELETE_MANY: '/addresses/bulk-delete',
  },
  // User Settings
  USER_SETTINGS: {
    BASE: '/user-settings',
    NOTIFICATIONS: '/user-settings/notifications',
    NOTIFICATION_BY_TYPE: (notificationType: string) => `/user-settings/notifications/${notificationType}`,
    VALIDATE: '/user-settings/validate',
  },
  // Team Management (RESTful resource-based design)
  TEAM: {
    BASE: '/team',
    MEMBERS: '/team/members',
    MEMBER_BY_ID: (userId: string) => `/team/members/${userId}`,
    MEMBER_ROLE: (userId: string) => `/team/members/${userId}/role`,
    INVITATIONS: '/team/invitations',
    INVITATION_BY_ID: (invitationId: string) => `/team/invitations/${invitationId}`,
    INVITATION_RESEND: (invitationId: string) => `/team/invitations/${invitationId}/resend`,
    INVITE: '/team/invite',
  },
  // Users (deprecated - use AUTH.ME instead)
  // USERS: {
  //   SEARCH: '/users/search', // Deprecated: use ENDPOINTS.AUTH.ME instead
  // },
} as const
