import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  Mail,
  Monitor,
  Smartphone,
  MessageCircle,
  CreditCard,
  Shield,
} from 'lucide-react'
import React from 'react'

import { useAdvancedNotificationsController } from '../../../hooks/useAdvancedNotificationsController'

import { DetailCard } from '@/shared/ui/DetailCard'
import { Switch } from '@/shared/ui/shadcn/switch'

interface NotificationPreference {
  notificationType: string
  emailEnabled: boolean
  inAppEnabled: boolean
  pushEnabled: boolean
  smsEnabled: boolean
}

interface NotificationsSectionProps {
  notifications: NotificationPreference[]
  updateNotificationPreference: (
    type: string,
    enabled: boolean,
    channel?: 'email' | 'inApp' | 'push' | 'sms'
  ) => Promise<boolean>
}

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  notifications,
  updateNotificationPreference,
}) => {
  const { getNotificationSetting, handleToggleChange } =
    useAdvancedNotificationsController({
      notifications,
      updateNotificationPreference,
    })

  const notificationTypes = [
    {
      id: 'billing',
      label: 'Billing & Payments',
      description:
        'Payment confirmations, invoice reminders, and billing updates',
      icon: CreditCard,
    },
    {
      id: 'security',
      label: 'Security Alerts',
      description: 'Login attempts, password changes, and account security',
      icon: Shield,
    },
    {
      id: 'product',
      label: 'Product Updates',
      description: 'New features, improvements, and platform announcements',
      icon: Bell,
    },
    {
      id: 'marketing',
      label: 'Marketing Communications',
      description:
        'Newsletters, promotional content, and educational resources',
      icon: Mail,
    },
  ]

  const channels = [
    {
      id: 'email',
      label: 'Email',
      icon: Mail,
      description: 'Receive notifications via email',
    },
    {
      id: 'inApp',
      label: 'In-App',
      icon: Monitor,
      description: 'Show notifications in the dashboard',
    },
    {
      id: 'push',
      label: 'Push',
      icon: Smartphone,
      description: 'Browser push notifications',
    },
    {
      id: 'sms',
      label: 'SMS',
      icon: MessageCircle,
      description: 'Text message notifications',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      <AnimatePresence>
        {notificationTypes.map((type, index) => (
          <motion.div
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <DetailCard
              title={type.label}
              icon={<type.icon className="h-4 w-4" />}
            >
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {type.description}
                </p>

                {/* Channel Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {channels.map((channel) => (
                    <div
                      key={`${type.id}-${channel.id}`}
                      className="p-3 bg-muted/50 border border-border rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <channel.icon className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            {channel.label}
                          </span>
                        </div>
                        <Switch
                          checked={getNotificationSetting(
                            type.id,
                            channel.id as 'email' | 'inApp' | 'push' | 'sms'
                          )}
                          onCheckedChange={(checked) =>
                            handleToggleChange(
                              type.id,
                              channel.id as 'email' | 'inApp' | 'push' | 'sms',
                              checked
                            )
                          }
                          aria-label={`Enable ${channel.label} notifications for ${type.label}`}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {channel.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </DetailCard>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
