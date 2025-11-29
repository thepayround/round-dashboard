/**
 * User Settings Manager Hook
 * Comprehensive hook for managing user settings with state management, 
 * following the established patterns in the codebase
 */

import { useState, useEffect, useCallback } from 'react'

import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { useUserSettings as useUserSettingsAPI } from '@/shared/hooks/api'
import type {
  UserSettings,
  UserSettingsUpdateRequest,
  NotificationPreferences,
  NotificationPreferencesRequest,
} from '@/shared/services/api/userSettings.service'

interface UseUserSettingsManagerReturn {
  // Data state
  settings: UserSettings | null
  notifications: NotificationPreferences[]
  
  // Loading states
  isLoading: boolean
  isSaving: boolean
  isInitialized: boolean
  
  // Error state
  error: string | null
  
  // Actions
  fetchSettings: () => Promise<void>
  updateSettings: (updates: UserSettingsUpdateRequest) => Promise<boolean>
  updateNotificationPreference: (
    notificationType: string,
    enabled: boolean,
    channel?: 'email' | 'inApp' | 'push' | 'sms'
  ) => Promise<boolean>
  validateSettings: (settings: UserSettingsUpdateRequest) => Promise<boolean>
  clearError: () => void
  refetch: () => Promise<void>
}

export const useUserSettingsManager = (): UseUserSettingsManagerReturn => {
  // State management
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [notifications, setNotifications] = useState<NotificationPreferences[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // API hooks and utilities
  const userSettingsAPI = useUserSettingsAPI()
  const { showSuccess, showError } = useGlobalToast()

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  /**
   * Fetch user settings and notification preferences
   */
  const fetchSettings = useCallback(async () => {
    // Don't fetch if already loading or if already have data and not explicitly refetching
    if (isLoading) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const [settingsResponse, notificationsResponse] = await Promise.all([
        userSettingsAPI.getUserSettings(),
        userSettingsAPI.getNotificationPreferences(),
      ])

      // console.log('UserSettings: Received responses', { settingsResponse, notificationsResponse })

      // Handle settings response
      if (settingsResponse.success && settingsResponse.data) {
        // console.log('UserSettings: Using server settings')
        setSettings(settingsResponse.data)
      } else {
        // API failed - use default settings for development/demo
        // console.log('UserSettings: API failed, using default settings. Error:', settingsResponse.error)
        const defaultSettings: UserSettings = {
          id: 'default',
          userId: 'current-user',
          timezone: 'UTC',
          language: 'en',
          dateFormat: 'MM/dd/yyyy',
          timeFormat: '12h',
          emailNotifications: true,
          securityAlerts: true,
          billingNotifications: true,
          productUpdates: false,
          marketingEmails: false,
          invoiceDeliveryMethod: 'email',
          paymentReminders: 'auto',
          createdDate: new Date().toISOString(),
          modifiedDate: new Date().toISOString(),
          status: 'active'
        }
        // console.log('UserSettings: Using default settings')
        setSettings(defaultSettings)
        // console.info('Using default user settings - API endpoint not yet implemented')
      }

      // Handle notifications response (non-critical)
      if (notificationsResponse.success && notificationsResponse.data) {
        // console.log('UserSettings: Using server notifications')
        setNotifications(notificationsResponse.data)
      } else {
        // console.log('UserSettings: API failed for notifications, using defaults')
        // Create default notification preferences
        const defaultNotifications: NotificationPreferences[] = [
          {
            id: 'billing-default',
            userId: 'current-user',
            notificationType: 'billing',
            emailEnabled: true,
            inAppEnabled: true,
            pushEnabled: false,
            smsEnabled: false,
            frequency: 'instant',
            createdDate: new Date().toISOString(),
            modifiedDate: new Date().toISOString(),
            status: 'active'
          },
          {
            id: 'security-default',
            userId: 'current-user',
            notificationType: 'security',
            emailEnabled: true,
            inAppEnabled: true,
            pushEnabled: false,
            smsEnabled: false,
            frequency: 'instant',
            createdDate: new Date().toISOString(),
            modifiedDate: new Date().toISOString(),
            status: 'active'
          },
          {
            id: 'product-default',
            userId: 'current-user',
            notificationType: 'product',
            emailEnabled: false,
            inAppEnabled: true,
            pushEnabled: false,
            smsEnabled: false,
            frequency: 'weekly',
            createdDate: new Date().toISOString(),
            modifiedDate: new Date().toISOString(),
            status: 'active'
          },
          {
            id: 'marketing-default',
            userId: 'current-user',
            notificationType: 'marketing',
            emailEnabled: false,
            inAppEnabled: false,
            pushEnabled: false,
            smsEnabled: false,
            frequency: 'monthly',
            createdDate: new Date().toISOString(),
            modifiedDate: new Date().toISOString(),
            status: 'active'
          }
        ]
        setNotifications(defaultNotifications)
        // console.info('Using default notification preferences as none were found on server')
      }

      // console.log('UserSettings: Successfully initialized')
      setIsInitialized(true)
    } catch (err) {
      const errorMsg = 'An unexpected error occurred while loading settings'
      // console.error('UserSettings: Unexpected error', err)
      setError(errorMsg)
      showError(errorMsg)
      // console.error('Error fetching user settings:', err)
    } finally {
      // console.log('UserSettings: Finished loading')
      setIsLoading(false)
    }
  }, [userSettingsAPI, showError, isLoading])

  /**
   * Update user settings
   */
  const updateSettings = useCallback(async (updates: UserSettingsUpdateRequest): Promise<boolean> => {
    if (!settings) return false

    setIsSaving(true)
    setError(null)

    try {
      // console.log('UserSettings: Attempting to update settings', updates)
      
      // Validate settings first
      const validationResponse = await userSettingsAPI.validateSettings(updates)
      if (!validationResponse.success) {
        const errorMsg = validationResponse.error ?? 'Settings validation failed'
        setError(errorMsg)
        showError(`Validation failed: ${errorMsg}`)
        return false
      }

      // Check for validation errors in response data
      if (validationResponse.data && 'errors' in validationResponse.data) {
        const {errors} = validationResponse.data
        const errorMsg = `Validation failed: ${errors.join(', ')}`
        setError(errorMsg)
        showError(errorMsg)
        return false
      }

      // Update settings
      const updateResponse = await userSettingsAPI.updateUserSettings(updates)
      if (updateResponse.success && updateResponse.data) {
        setSettings(updateResponse.data)
        const message = updateResponse.message ?? 'Settings updated successfully'
        showSuccess(message)
        return true
      } else {
        const errorMsg = updateResponse.error ?? 'Failed to update settings'
        setError(errorMsg)
        showError(errorMsg)
        return false
      }
    } catch (err) {
      const errorMsg = 'An unexpected error occurred while updating settings'
      setError(errorMsg)
      showError(errorMsg)
      // console.error('Error updating user settings:', err)
      return false
    } finally {
      setIsSaving(false)
    }
  }, [settings, userSettingsAPI, showSuccess, showError])

  /**
   * Update notification preferences
   */
  const updateNotificationPreference = useCallback(async (
    notificationType: string,
    enabled: boolean,
    channel: 'email' | 'inApp' | 'push' | 'sms' = 'email'
  ): Promise<boolean> => {
    try {
      // console.log('UserSettings: Updating notification preference', { notificationType, enabled, channel })

      const existing = notifications.find(n => n.notificationType === notificationType)
      
      const request: NotificationPreferencesRequest = {
        notificationType,
        emailEnabled: channel === 'email' ? enabled : existing?.emailEnabled ?? false,
        inAppEnabled: channel === 'inApp' ? enabled : existing?.inAppEnabled ?? false,
        pushEnabled: channel === 'push' ? enabled : existing?.pushEnabled ?? false,
        smsEnabled: channel === 'sms' ? enabled : existing?.smsEnabled ?? false,
        frequency: existing?.frequency ?? 'instant'
      }

      const response = await userSettingsAPI.updateNotificationPreferences(notificationType, request)
      
      if (response.success && response.data) {
        setNotifications(prev => {
          const index = prev.findIndex(n => n.notificationType === notificationType)
          if (index >= 0) {
            const newNotifications = [...prev]
            newNotifications[index] = response.data!
            return newNotifications
          } else {
            return [...prev, response.data!]
          }
        })

        const message = response.message ?? 'Notification preferences updated'
        showSuccess(message)
        return true
      } else {
        const errorMsg = response.error ?? 'Failed to update notification preferences'
        showError(errorMsg)
        return false
      }
    } catch (err) {
      const errorMsg = 'An unexpected error occurred while updating notification preferences'
      showError(errorMsg)
      // console.error('Error updating notification preferences:', err)
      return false
    }
  }, [notifications, userSettingsAPI, showSuccess, showError])

  /**
   * Validate settings without updating
   */
  const validateSettings = useCallback(async (settingsToValidate: UserSettingsUpdateRequest): Promise<boolean> => {
    try {
      // console.log('UserSettings: Validating settings', settingsToValidate)
      
      const validationResponse = await userSettingsAPI.validateSettings(settingsToValidate)
      if (!validationResponse.success) {
        const errorMsg = validationResponse.error ?? 'Settings validation failed'
        showError(`Validation failed: ${errorMsg}`)
        return false
      }

      if (validationResponse.data && 'errors' in validationResponse.data) {
        const {errors} = validationResponse.data
        showError(`Validation failed: ${errors.join(', ')}`)
        return false
      }

      return true
    } catch (err) {
      showError('An unexpected error occurred during validation')
      // console.error('Error validating settings:', err)
      return false
    }
  }, [userSettingsAPI, showError])

  /**
   * Refetch settings (alias for fetchSettings)
   */
  const refetch = useCallback(() => fetchSettings(), [fetchSettings])

  // Load settings on mount
  useEffect(() => {
    // console.log('UserSettings: useEffect triggered', { isInitialized, isLoading })
    if (!isInitialized && !isLoading) {
      // console.log('UserSettings: Triggering fetchSettings from useEffect')
      fetchSettings()
    }
  }, [isInitialized, isLoading, fetchSettings])


  return {
    // Data state
    settings,
    notifications,
    
    // Loading states  
    isLoading: isLoading || userSettingsAPI.isLoading,
    isSaving,
    isInitialized,
    
    // Error state
    error: error ?? userSettingsAPI.error,
    
    // Actions
    fetchSettings,
    updateSettings,
    updateNotificationPreference,
    validateSettings,
    clearError,
    refetch,
  }
}