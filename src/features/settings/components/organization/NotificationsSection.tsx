import { motion } from 'framer-motion'
import { Bell, Mail, MessageSquare, Smartphone, Settings } from 'lucide-react'

import { useOrganizationNotificationsController } from '../../hooks/useOrganizationNotificationsController'

import { Checkbox } from '@/shared/ui'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'


export const NotificationsSection: React.FC = () => {
  const { preferences, updatePreference } = useOrganizationNotificationsController()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-lg font-medium text-white mb-4">
          Notification{' '}
          <span className="text-primary">
            Settings
          </span>
        </h1>
        <p className="text-gray-500 dark:text-polar-500 leading-snug mb-3">
          Configure organization-wide notification preferences
        </p>
      </div>

      {/* Global Settings */}
      <Card animate={false} padding="lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Settings className="w-5 h-5 text-[#D417C8]" />
          </div>
          <div>
            <h3 className="text-sm font-normal tracking-tight text-white">Global Settings</h3>
            <p className="text-xs text-gray-400">Organization-wide notification preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/4 rounded-lg border border-white/8">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-normal tracking-tight text-white">Email Notifications</span>
            </div>
            <Checkbox
              checked={true}
              onCheckedChange={() => {}}
              label="Enable for organization"
              className="h-4 w-4"
              containerClassName="[&_label]:text-xs [&_label]:text-gray-300 [&_label]:ml-2"
            />
          </div>

          <div className="p-4 bg-white/4 rounded-lg border border-white/8">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-green-400" />
              <span className="text-xs font-normal tracking-tight text-white">Push Notifications</span>
            </div>
            <Checkbox
              checked={true}
              onCheckedChange={() => {}}
              label="Enable for organization"
              className="h-4 w-4"
              containerClassName="[&_label]:text-xs [&_label]:text-gray-300 [&_label]:ml-2"
            />
          </div>

          <div className="p-4 bg-white/4 rounded-lg border border-white/8">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-normal tracking-tight text-white">SMS Notifications</span>
            </div>
            <Checkbox
              checked={false}
              onCheckedChange={() => {}}
              label="Enable for organization"
              className="h-4 w-4"
              containerClassName="[&_label]:text-xs [&_label]:text-gray-300 [&_label]:ml-2"
            />
          </div>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card animate={false} padding="lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Bell className="w-5 h-5 text-[#32A1E4]" />
          </div>
          <div>
            <h3 className="text-sm font-normal tracking-tight text-white">Notification Types</h3>
            <p className="text-xs text-gray-400">Configure specific notification preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 pb-3 border-b border-white/10">
            <div className="text-xs font-normal tracking-tight text-gray-300">Notification Type</div>
            <div className="text-xs font-normal tracking-tight text-gray-300 text-center">Email</div>
            <div className="text-xs font-normal tracking-tight text-gray-300 text-center">Push</div>
            <div className="text-xs font-normal tracking-tight text-gray-300 text-center">SMS</div>
          </div>

          {preferences.map((pref) => (
            <div key={pref.id} className="grid grid-cols-4 gap-4 py-3 items-center">
              <div>
                <h4 className="text-xs font-normal tracking-tight text-white">{pref.title}</h4>
                <p className="text-xs text-gray-400 mt-1">{pref.description}</p>
              </div>
              <div className="flex justify-center">
                <Checkbox
                  checked={pref.email}
                  onCheckedChange={(checked) => updatePreference(pref.id, 'email', checked)}
                  className="h-4 w-4"
                  aria-label={`Enable email notifications for ${pref.title}`}
                />
              </div>
              <div className="flex justify-center">
                <Checkbox
                  checked={pref.push}
                  onCheckedChange={(checked) => updatePreference(pref.id, 'push', checked)}
                  className="h-4 w-4"
                  aria-label={`Enable push notifications for ${pref.title}`}
                />
              </div>
              <div className="flex justify-center">
                <Checkbox
                  checked={pref.sms}
                  onCheckedChange={(checked) => updatePreference(pref.id, 'sms', checked)}
                  className="h-4 w-4"
                  aria-label={`Enable SMS notifications for ${pref.title}`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <Button
            variant="primary"
            size="md"
          >
            Save Notification Settings
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
