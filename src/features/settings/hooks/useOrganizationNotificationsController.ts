import { useCallback, useState } from 'react'

export interface OrganizationNotificationPreference {
  id: string
  title: string
  description: string
  email: boolean
  push: boolean
  sms: boolean
}

const DEFAULT_PREFERENCES: OrganizationNotificationPreference[] = [
  {
    id: 'billing',
    title: 'Billing Notifications',
    description: 'Payment confirmations, failed payments, and subscription changes',
    email: true,
    push: false,
    sms: false,
  },
  {
    id: 'security',
    title: 'Security Alerts',
    description: 'Login attempts, suspicious activity, and security policy changes',
    email: true,
    push: true,
    sms: true,
  },
  {
    id: 'team',
    title: 'Team Activities',
    description: 'New member invitations, role changes, and team updates',
    email: true,
    push: false,
    sms: false,
  },
  {
    id: 'system',
    title: 'System Updates',
    description: 'Maintenance notifications, feature releases, and service updates',
    email: false,
    push: true,
    sms: false,
  },
  {
    id: 'usage',
    title: 'Usage Alerts',
    description: 'API limit warnings, quota notifications, and usage reports',
    email: true,
    push: true,
    sms: false,
  },
]

interface UseOrganizationNotificationsControllerReturn {
  preferences: OrganizationNotificationPreference[]
  updatePreference: (id: string, channel: 'email' | 'push' | 'sms', value: boolean) => void
}

export const useOrganizationNotificationsController =
  (): UseOrganizationNotificationsControllerReturn => {
    const [preferences, setPreferences] = useState<OrganizationNotificationPreference[]>(DEFAULT_PREFERENCES)

    const updatePreference = useCallback(
      (id: string, channel: 'email' | 'push' | 'sms', value: boolean) => {
        setPreferences(prev =>
          prev.map(pref => (pref.id === id ? { ...pref, [channel]: value } : pref))
        )
      },
      []
    )

    return {
      preferences,
      updatePreference,
    }
  }
