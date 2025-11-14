import { useCallback, useEffect, useState } from 'react'

interface NotificationPreference {
  notificationType: string
  emailEnabled: boolean
  inAppEnabled: boolean
  pushEnabled: boolean
  smsEnabled: boolean
}

interface UseAdvancedNotificationsControllerParams {
  notifications: NotificationPreference[]
  updateNotificationPreference: (
    type: string,
    enabled: boolean,
    channel?: 'email' | 'inApp' | 'push' | 'sms'
  ) => Promise<boolean>
}

export const useAdvancedNotificationsController = ({
  notifications,
  updateNotificationPreference,
}: UseAdvancedNotificationsControllerParams) => {
  const [localNotifications, setLocalNotifications] = useState(notifications)

  useEffect(() => {
    setLocalNotifications(notifications)
  }, [notifications])

  const getNotificationSetting = useCallback(
    (type: string, channel: 'email' | 'inApp' | 'push' | 'sms') => {
      const notification = localNotifications.find(n => n.notificationType === type)
      if (!notification) return false

      switch (channel) {
        case 'email':
          return notification.emailEnabled
        case 'inApp':
          return notification.inAppEnabled
        case 'push':
          return notification.pushEnabled
        case 'sms':
          return notification.smsEnabled
        default:
          return false
      }
    },
    [localNotifications]
  )

  const handleToggleChange = useCallback(
    async (type: string, channel: 'email' | 'inApp' | 'push' | 'sms', enabled: boolean) => {
      setLocalNotifications(prev =>
        prev.map(notification =>
          notification.notificationType === type
            ? { ...notification, [`${channel}Enabled`]: enabled }
            : notification
        )
      )

      await updateNotificationPreference(type, enabled, channel)
    },
    [updateNotificationPreference]
  )

  return {
    localNotifications,
    getNotificationSetting,
    handleToggleChange,
  }
}
