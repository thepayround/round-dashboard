/**
 * User Settings hook for managing user preferences and settings
 */

import { useState, useCallback } from 'react'

import { userSettingsService } from '@/shared/services/api'
import type {
  UserSettings,
  UserSettingsUpdateRequest,
  NotificationPreferences,
  NotificationPreferencesRequest,
} from '@/shared/services/api/userSettings.service'
import type { ApiResponse } from '@/shared/types/api'

export const useUserSettings = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Get current user settings
   */
  const getUserSettings = useCallback(async (): Promise<ApiResponse<UserSettings>> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await userSettingsService.getUserSettings()
      if (!result.success) {
        setError(result.error ?? 'Failed to fetch user settings')
      }
      return result
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while fetching user settings'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Update user settings
   */
  const updateUserSettings = useCallback(async (settings: UserSettingsUpdateRequest): Promise<ApiResponse<UserSettings>> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await userSettingsService.updateUserSettings(settings)
      if (!result.success) {
        setError(result.error ?? 'Failed to update user settings')
      }
      return result
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while updating user settings'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Get notification preferences
   */
  const getNotificationPreferences = useCallback(async (): Promise<ApiResponse<NotificationPreferences[]>> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await userSettingsService.getNotificationPreferences()
      if (!result.success) {
        setError(result.error ?? 'Failed to fetch notification preferences')
      }
      return result
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while fetching notification preferences'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Update notification preferences
   */
  const updateNotificationPreferences = useCallback(async (
    notificationType: string,
    preferences: NotificationPreferencesRequest
  ): Promise<ApiResponse<NotificationPreferences>> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await userSettingsService.updateNotificationPreferences(notificationType, preferences)
      if (!result.success) {
        setError(result.error ?? 'Failed to update notification preferences')
      }
      return result
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while updating notification preferences'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Validate settings
   */
  const validateSettings = useCallback(async (settings: UserSettingsUpdateRequest): Promise<ApiResponse<{ message: string } | { errors: string[] }>> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await userSettingsService.validateSettings(settings)
      if (!result.success) {
        setError(result.error ?? 'Failed to validate settings')
      }
      return result
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while validating settings'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    getUserSettings,
    updateUserSettings,
    getNotificationPreferences,
    updateNotificationPreferences,
    validateSettings,
    isLoading,
    error,
  }
}