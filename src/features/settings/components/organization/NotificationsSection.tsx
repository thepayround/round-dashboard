import { motion } from 'framer-motion'
import { Bell, Mail, MessageSquare, Smartphone, Settings } from 'lucide-react'

import { useOrganizationNotificationsController } from '../../hooks/useOrganizationNotificationsController'

import { Button } from '@/shared/ui/shadcn/button'
import { Card } from '@/shared/ui/shadcn/card'
import { Checkbox } from '@/shared/ui/shadcn/checkbox'
import { Label } from '@/shared/ui/shadcn/label'


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
        <p className="text-gray-500 dark:text-polar-500 leading-snug mb-4">
          Configure organization-wide notification preferences
        </p>
      </div>

      {/* Global Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-normal tracking-tight text-white">Global Settings</h3>
            <p className="text-xs text-gray-400">Organization-wide notification preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/4 rounded-lg border border-white/8">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-normal tracking-tight text-white">Email Notifications</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="email-global"
                checked={true}
                onCheckedChange={() => {}}
                className="h-4 w-4"
              />
              <Label htmlFor="email-global" className="text-xs text-gray-300 cursor-pointer">
                Enable for organization
              </Label>
            </div>
          </div>

          <div className="p-4 bg-white/4 rounded-lg border border-white/8">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-success" />
              <span className="text-xs font-normal tracking-tight text-white">Push Notifications</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="push-global"
                checked={true}
                onCheckedChange={() => {}}
                className="h-4 w-4"
              />
              <Label htmlFor="push-global" className="text-xs text-gray-300 cursor-pointer">
                Enable for organization
              </Label>
            </div>
          </div>

          <div className="p-4 bg-white/4 rounded-lg border border-white/8">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-normal tracking-tight text-white">SMS Notifications</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="sms-global"
                checked={false}
                onCheckedChange={() => {}}
                className="h-4 w-4"
              />
              <Label htmlFor="sms-global" className="text-xs text-gray-300 cursor-pointer">
                Enable for organization
              </Label>
            </div>
          </div>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Bell className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h3 className="text-sm font-normal tracking-tight text-white">Notification Types</h3>
            <p className="text-xs text-gray-400">Configure specific notification preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 pb-3 border-b border-border">
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
                  id={`${pref.id}-email`}
                  checked={pref.email}
                  onCheckedChange={(checked) => updatePreference(pref.id, 'email', checked === true)}
                  className="h-4 w-4"
                  aria-label={`Enable email notifications for ${pref.title}`}
                />
              </div>
              <div className="flex justify-center">
                <Checkbox
                  id={`${pref.id}-push`}
                  checked={pref.push}
                  onCheckedChange={(checked) => updatePreference(pref.id, 'push', checked === true)}
                  className="h-4 w-4"
                  aria-label={`Enable push notifications for ${pref.title}`}
                />
              </div>
              <div className="flex justify-center">
                <Checkbox
                  id={`${pref.id}-sms`}
                  checked={pref.sms}
                  onCheckedChange={(checked) => updatePreference(pref.id, 'sms', checked === true)}
                  className="h-4 w-4"
                  aria-label={`Enable SMS notifications for ${pref.title}`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <Button variant="default" size="default">
            Save Notification Settings
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
