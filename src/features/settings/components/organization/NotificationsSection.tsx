import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/shared/components'
import { Bell, Mail, MessageSquare, Smartphone, Settings } from 'lucide-react'

interface NotificationPreference {
  id: string
  title: string
  description: string
  email: boolean
  push: boolean
  sms: boolean
}

export const NotificationsSection: React.FC = () => {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: 'billing',
      title: 'Billing Notifications',
      description: 'Payment confirmations, failed payments, and subscription changes',
      email: true,
      push: false,
      sms: false
    },
    {
      id: 'security',
      title: 'Security Alerts',
      description: 'Login attempts, suspicious activity, and security policy changes',
      email: true,
      push: true,
      sms: true
    },
    {
      id: 'team',
      title: 'Team Activities',
      description: 'New member invitations, role changes, and team updates',
      email: true,
      push: false,
      sms: false
    },
    {
      id: 'system',
      title: 'System Updates',
      description: 'Maintenance notifications, feature releases, and service updates',
      email: false,
      push: true,
      sms: false
    },
    {
      id: 'usage',
      title: 'Usage Alerts',
      description: 'API limit warnings, quota notifications, and usage reports',
      email: true,
      push: true,
      sms: false
    }
  ])

  const updatePreference = (id: string, channel: 'email' | 'push' | 'sms', value: boolean) => {
    setPreferences(prev => prev.map(pref =>
      pref.id === id ? { ...pref, [channel]: value } : pref
    ))
  }

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
          <span className="bg-gradient-to-r from-[#D417C8] via-[#7767DA] to-[#14BDEA] bg-clip-text text-transparent">
            Settings
          </span>
        </h1>
        <p className="text-sm text-gray-400 mb-3">
          Configure organization-wide notification preferences
        </p>
      </div>

      {/* Global Settings */}
      <Card animate={false} padding="lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-[#D417C8]/20 to-[#14BDEA]/20 rounded-lg">
            <Settings className="w-5 h-5 text-[#D417C8]" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">Global Settings</h3>
            <p className="text-xs text-gray-400">Organization-wide notification preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/4 rounded-lg border border-white/8">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-medium text-white">Email Notifications</span>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-[#D417C8] bg-white/10 border-white/20 rounded focus:ring-[#D417C8] focus:ring-2"
              />
              <span className="text-xs text-gray-300">Enable for organization</span>
            </label>
          </div>

          <div className="p-4 bg-white/4 rounded-lg border border-white/8">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-green-400" />
              <span className="text-xs font-medium text-white">Push Notifications</span>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-[#D417C8] bg-white/10 border-white/20 rounded focus:ring-[#D417C8] focus:ring-2"
              />
              <span className="text-xs text-gray-300">Enable for organization</span>
            </label>
          </div>

          <div className="p-4 bg-white/4 rounded-lg border border-white/8">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-medium text-white">SMS Notifications</span>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-[#D417C8] bg-white/10 border-white/20 rounded focus:ring-[#D417C8] focus:ring-2"
              />
              <span className="text-xs text-gray-300">Enable for organization</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card animate={false} padding="lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-[#32A1E4]/20 to-[#14BDEA]/20 rounded-lg">
            <Bell className="w-5 h-5 text-[#32A1E4]" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">Notification Types</h3>
            <p className="text-xs text-gray-400">Configure specific notification preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 pb-3 border-b border-white/10">
            <div className="text-xs font-medium text-gray-300">Notification Type</div>
            <div className="text-xs font-medium text-gray-300 text-center">Email</div>
            <div className="text-xs font-medium text-gray-300 text-center">Push</div>
            <div className="text-xs font-medium text-gray-300 text-center">SMS</div>
          </div>

          {preferences.map((pref) => (
            <div key={pref.id} className="grid grid-cols-4 gap-4 py-3 items-center">
              <div>
                <h4 className="text-xs font-medium text-white">{pref.title}</h4>
                <p className="text-xs text-gray-400 mt-1">{pref.description}</p>
              </div>
              <div className="text-center">
                <input
                  type="checkbox"
                  checked={pref.email}
                  onChange={(e) => updatePreference(pref.id, 'email', e.target.checked)}
                  className="w-4 h-4 text-[#D417C8] bg-white/10 border-white/20 rounded focus:ring-[#D417C8] focus:ring-2"
                />
              </div>
              <div className="text-center">
                <input
                  type="checkbox"
                  checked={pref.push}
                  onChange={(e) => updatePreference(pref.id, 'push', e.target.checked)}
                  className="w-4 h-4 text-[#D417C8] bg-white/10 border-white/20 rounded focus:ring-[#D417C8] focus:ring-2"
                />
              </div>
              <div className="text-center">
                <input
                  type="checkbox"
                  checked={pref.sms}
                  onChange={(e) => updatePreference(pref.id, 'sms', e.target.checked)}
                  className="w-4 h-4 text-[#D417C8] bg-white/10 border-white/20 rounded focus:ring-[#D417C8] focus:ring-2"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <button className="px-6 py-3 bg-[#D417C8] hover:bg-[#BD2CD0] text-white text-sm font-medium rounded-lg transition-colors duration-200">
            Save Notification Settings
          </button>
        </div>
      </Card>
    </motion.div>
  )
}