import { motion } from 'framer-motion'
import { Bell, Mail, MessageSquare, Smartphone, Settings, Save } from 'lucide-react'
import React from 'react'

import { useOrganizationNotificationsController } from '../../hooks/useOrganizationNotificationsController'

import { DetailCard } from '@/shared/ui/DetailCard'
import { Button } from '@/shared/ui/shadcn/button'
import { Checkbox } from '@/shared/ui/shadcn/checkbox'
import { Label } from '@/shared/ui/shadcn/label'

export const NotificationsSection: React.FC = () => {
  const { preferences, updatePreference } = useOrganizationNotificationsController()

  const globalChannels = [
    {
      id: 'email',
      label: 'Email Notifications',
      icon: Mail,
      iconColor: 'text-primary',
      enabled: true,
    },
    {
      id: 'push',
      label: 'Push Notifications',
      icon: MessageSquare,
      iconColor: 'text-success',
      enabled: true,
    },
    {
      id: 'sms',
      label: 'SMS Notifications',
      icon: Smartphone,
      iconColor: 'text-secondary',
      enabled: false,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Global Settings */}
      <DetailCard
        title="Global Settings"
        icon={<Settings className="h-4 w-4" />}
      >
        <p className="text-sm text-muted-foreground mb-6">
          Organization-wide notification preferences
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {globalChannels.map((channel) => (
            <div
              key={channel.id}
              className="p-4 bg-muted/50 rounded-lg border border-border"
            >
              <div className="flex items-center gap-2 mb-4">
                <channel.icon className={`h-4 w-4 ${channel.iconColor}`} />
                <span className="text-sm font-medium text-foreground">
                  {channel.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`${channel.id}-global`}
                  checked={channel.enabled}
                  onCheckedChange={() => {}}
                  className="h-4 w-4"
                />
                <Label
                  htmlFor={`${channel.id}-global`}
                  className="text-xs text-muted-foreground cursor-pointer"
                >
                  Enable for organization
                </Label>
              </div>
            </div>
          ))}
        </div>
      </DetailCard>

      {/* Notification Preferences */}
      <DetailCard
        title="Notification Types"
        icon={<Bell className="h-4 w-4" />}
        actions={
          <Button variant="default" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        }
      >
        <p className="text-sm text-muted-foreground mb-6">
          Configure specific notification preferences
        </p>

        <div className="space-y-4">
          {/* Header row */}
          <div className="grid grid-cols-4 gap-4 pb-3 border-b border-border">
            <div className="text-xs font-medium text-muted-foreground">
              Notification Type
            </div>
            <div className="text-xs font-medium text-muted-foreground text-center">
              Email
            </div>
            <div className="text-xs font-medium text-muted-foreground text-center">
              Push
            </div>
            <div className="text-xs font-medium text-muted-foreground text-center">
              SMS
            </div>
          </div>

          {/* Preference rows */}
          {preferences.map((pref) => (
            <div
              key={pref.id}
              className="grid grid-cols-4 gap-4 py-3 items-center"
            >
              <div>
                <h4 className="text-sm font-medium text-foreground">
                  {pref.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {pref.description}
                </p>
              </div>
              <div className="flex justify-center">
                <Checkbox
                  id={`${pref.id}-email`}
                  checked={pref.email}
                  onCheckedChange={(checked) =>
                    updatePreference(pref.id, 'email', checked === true)
                  }
                  className="h-4 w-4"
                  aria-label={`Enable email notifications for ${pref.title}`}
                />
              </div>
              <div className="flex justify-center">
                <Checkbox
                  id={`${pref.id}-push`}
                  checked={pref.push}
                  onCheckedChange={(checked) =>
                    updatePreference(pref.id, 'push', checked === true)
                  }
                  className="h-4 w-4"
                  aria-label={`Enable push notifications for ${pref.title}`}
                />
              </div>
              <div className="flex justify-center">
                <Checkbox
                  id={`${pref.id}-sms`}
                  checked={pref.sms}
                  onCheckedChange={(checked) =>
                    updatePreference(pref.id, 'sms', checked === true)
                  }
                  className="h-4 w-4"
                  aria-label={`Enable SMS notifications for ${pref.title}`}
                />
              </div>
            </div>
          ))}
        </div>
      </DetailCard>
    </motion.div>
  )
}
