/**
 * User Settings service
 */

import axios from 'axios'
import type { ApiResponse } from '@/shared/types/api'
import { httpClient } from './base/client'
import { ENDPOINTS } from './base/config'

// User Settings Types
export interface UserSettings {
  id: string
  userId: string
  timezone: string
  language: string
  dateFormat: string
  timeFormat: string
  emailNotifications: boolean
  securityAlerts: boolean
  billingNotifications: boolean
  productUpdates: boolean
  marketingEmails: boolean
  invoiceDeliveryMethod: string
  paymentReminders: string
  advancedSettings?: string
  createdDate: string
  modifiedDate: string
  status: string
}

export interface UserSettingsUpdateRequest {
  timezone?: string
  language?: string
  dateFormat?: string
  timeFormat?: string
  emailNotifications?: boolean
  securityAlerts?: boolean
  billingNotifications?: boolean
  productUpdates?: boolean
  marketingEmails?: boolean
  invoiceDeliveryMethod?: string
  paymentReminders?: string
  advancedSettings?: string
}

export interface NotificationPreferences {
  id: string
  userId: string
  notificationType: string
  emailEnabled: boolean
  inAppEnabled: boolean
  pushEnabled: boolean
  smsEnabled: boolean
  frequency: string
  customSettings?: string
  createdDate: string
  modifiedDate: string
  status: string
}

export interface NotificationPreferencesRequest {
  notificationType: string
  emailEnabled: boolean
  inAppEnabled: boolean
  pushEnabled: boolean
  smsEnabled: boolean
  frequency: string
  customSettings?: string
}

export class UserSettingsService {
  private client = httpClient.getClient()

  /**
   * Get current user settings
   */
  async getUserSettings(): Promise<ApiResponse<UserSettings>> {
    try {
      const response = await this.client.get<UserSettings>(ENDPOINTS.USER_SETTINGS.BASE)
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to fetch user settings')
    }
  }

  /**
   * Update user settings
   */
  async updateUserSettings(settings: UserSettingsUpdateRequest): Promise<ApiResponse<UserSettings>> {
    try {
      const response = await this.client.put<UserSettings>(ENDPOINTS.USER_SETTINGS.BASE, settings)
      return {
        success: true,
        data: response.data,
        message: 'User settings updated successfully',
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to update user settings')
    }
  }

  /**
   * Get notification preferences
   */
  async getNotificationPreferences(): Promise<ApiResponse<NotificationPreferences[]>> {
    try {
      const response = await this.client.get<NotificationPreferences[]>(ENDPOINTS.USER_SETTINGS.NOTIFICATIONS)
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to fetch notification preferences')
    }
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(
    notificationType: string,
    preferences: NotificationPreferencesRequest
  ): Promise<ApiResponse<NotificationPreferences>> {
    try {
      const response = await this.client.put<NotificationPreferences>(
        ENDPOINTS.USER_SETTINGS.NOTIFICATION_BY_TYPE(notificationType),
        preferences
      )
      return {
        success: true,
        data: response.data,
        message: 'Notification preferences updated successfully',
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to update notification preferences')
    }
  }

  /**
   * Validate settings
   */
  async validateSettings(settings: UserSettingsUpdateRequest): Promise<ApiResponse<{ message: string } | { errors: string[] }>> {
    try {
      const response = await this.client.post<{ message: string } | { errors: string[] }>(
        ENDPOINTS.USER_SETTINGS.VALIDATE,
        settings
      )
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return this.handleApiError(error, 'Failed to validate settings')
    }
  }

  private handleApiError(error: unknown, defaultMessage: string): ApiResponse<never> {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data?.message || error.response.data?.error || defaultMessage
      return {
        success: false,
        error: errorMessage,
      }
    }

    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

// Export singleton instance
export const userSettingsService = new UserSettingsService()