/**
 * Test for UserSettings Notifications Toggle Fix
 * Verifies that clicking the Push toggle doesn't affect the In-App toggle
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useUserSettingsManager } from '@/shared/hooks/useUserSettingsManager'

// Mock the dependencies
vi.mock('@/shared/hooks/api', () => ({
  useUserSettings: () => ({
    getUserSettings: vi.fn().mockResolvedValue({
      success: false,
      error: 'API not implemented'
    }),
    getNotificationPreferences: vi.fn().mockResolvedValue({
      success: false,
      error: 'API not implemented'
    }),
    updateNotificationPreferences: vi.fn().mockImplementation((type, request) => Promise.resolve({
        success: true,
        data: {
          id: `${type}-updated`,
          userId: 'test-user',
          notificationType: type,
          ...request,
          createdDate: new Date().toISOString(),
          modifiedDate: new Date().toISOString(),
          status: 'active'
        }
      }))
  })
}))

vi.mock('@/shared/hooks/useToast', () => ({
  useToast: () => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showWarning: vi.fn()
  })
}))

describe('UserSettings Notifications Toggle Fix', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not affect In-App toggle when Push toggle is clicked', async () => {
    const { result } = renderHook(() => useUserSettingsManager())

    // Wait for initialization
    await act(async () => {
      await result.current.fetchSettings()
    })

    // Get initial state - should have default notifications
    const initialNotifications = result.current.notifications
    const billingNotification = initialNotifications.find(n => n.notificationType === 'billing')
    
    // Initial state: billing should have inApp enabled by default, push disabled
    expect(billingNotification?.inAppEnabled).toBe(true)
    expect(billingNotification?.pushEnabled).toBe(false)

    // Click the Push toggle to enable it
    await act(async () => {
      await result.current.updateNotificationPreference('billing', true, 'push')
    })

    // After updating push preference, inApp should remain unchanged
    const updatedNotifications = result.current.notifications
    const updatedBillingNotification = updatedNotifications.find(n => n.notificationType === 'billing')
    
    expect(updatedBillingNotification?.pushEnabled).toBe(true) // Push should be enabled
    expect(updatedBillingNotification?.inAppEnabled).toBe(true) // InApp should remain unchanged
    expect(updatedBillingNotification?.emailEnabled).toBe(true) // Email should remain unchanged
    expect(updatedBillingNotification?.smsEnabled).toBe(false) // SMS should remain unchanged
  })

  it('should not affect other toggles when any single toggle is clicked', async () => {
    const { result } = renderHook(() => useUserSettingsManager())

    // Wait for initialization
    await act(async () => {
      await result.current.fetchSettings()
    })

    // Test clicking In-App toggle doesn't affect Push
    await act(async () => {
      await result.current.updateNotificationPreference('security', false, 'inApp')
    })

    const securityNotification = result.current.notifications.find(n => n.notificationType === 'security')
    expect(securityNotification?.inAppEnabled).toBe(false) // Should be updated
    expect(securityNotification?.pushEnabled).toBe(false) // Should remain unchanged
    expect(securityNotification?.emailEnabled).toBe(true) // Should remain unchanged
    expect(securityNotification?.smsEnabled).toBe(false) // Should remain unchanged
  })

  it('should handle new notification preferences correctly', async () => {
    const { result } = renderHook(() => useUserSettingsManager())

    // Wait for initialization
    await act(async () => {
      await result.current.fetchSettings()
    })

    // Update a notification type that might not have existing preferences
    await act(async () => {
      await result.current.updateNotificationPreference('marketing', true, 'push')
    })

    const marketingNotification = result.current.notifications.find(n => n.notificationType === 'marketing')
    expect(marketingNotification?.pushEnabled).toBe(true) // Should be enabled
    expect(marketingNotification?.inAppEnabled).toBe(false) // Should use default (false)
    expect(marketingNotification?.emailEnabled).toBe(false) // Should use default (false)
    expect(marketingNotification?.smsEnabled).toBe(false) // Should use default (false)
  })
})
