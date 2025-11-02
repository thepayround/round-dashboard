import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  Mail, 
  Monitor, 
  Smartphone, 
  MessageCircle,
  CreditCard,
  Shield
} from 'lucide-react'
import React, { useState, useEffect } from 'react'

import { Card } from '@/shared/components'


interface NotificationPreference {
  notificationType: string
  emailEnabled: boolean
  inAppEnabled: boolean
  pushEnabled: boolean
  smsEnabled: boolean
}

interface NotificationsSectionProps {
  notifications: NotificationPreference[]
  updateNotificationPreference: (type: string, enabled: boolean, channel?: 'email' | 'inApp' | 'push' | 'sms') => Promise<boolean>
}

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({ 
  notifications, 
  updateNotificationPreference 
}) => {
  const [localNotifications, setLocalNotifications] = useState(notifications)
  
  useEffect(() => {
    setLocalNotifications(notifications)
  }, [notifications])

  const notificationTypes = [
    { 
      id: 'billing', 
      label: 'Billing & Payments', 
      description: 'Payment confirmations, invoice reminders, and billing updates',
      icon: CreditCard,
      iconColor: 'text-green-400',
      bgColor: 'from-green-500/15 to-emerald-500/15',
      borderColor: 'border-green-500/20'
    },
    { 
      id: 'security', 
      label: 'Security Alerts', 
      description: 'Login attempts, password changes, and account security',
      icon: Shield,
      iconColor: 'text-red-400',
      bgColor: 'from-red-500/15 to-pink-500/15',
      borderColor: 'border-red-500/20'
    },
    { 
      id: 'product', 
      label: 'Product Updates', 
      description: 'New features, improvements, and platform announcements',
      icon: Bell,
      iconColor: 'text-blue-400',
      bgColor: 'from-blue-500/15 to-cyan-500/15',
      borderColor: 'border-blue-500/20'
    },
    { 
      id: 'marketing', 
      label: 'Marketing Communications', 
      description: 'Newsletters, promotional content, and educational resources',
      icon: Mail,
      iconColor: 'text-purple-400',
      bgColor: 'from-purple-500/15 to-violet-500/15',
      borderColor: 'border-purple-500/20'
    }
  ]

  const channels = [
    { id: 'email', label: 'Email', icon: Mail, description: 'Receive notifications via email' },
    { id: 'inApp', label: 'In-App', icon: Monitor, description: 'Show notifications in the dashboard' },
    { id: 'push', label: 'Push', icon: Smartphone, description: 'Browser push notifications' },
    { id: 'sms', label: 'SMS', icon: MessageCircle, description: 'Text message notifications' }
  ]

  const getNotificationSetting = (type: string, channel: 'email' | 'inApp' | 'push' | 'sms'): boolean => {
    const notification = localNotifications.find(n => n.notificationType === type)
    if (!notification) return false
    
    switch (channel) {
      case 'email': return notification.emailEnabled
      case 'inApp': return notification.inAppEnabled
      case 'push': return notification.pushEnabled
      case 'sms': return notification.smsEnabled
      default: return false
    }
  }

  const handleToggleChange = async (type: string, channel: 'email' | 'inApp' | 'push' | 'sms', enabled: boolean) => {
    // Optimistic update
    setLocalNotifications(prev => 
      prev.map(notification => 
        notification.notificationType === type 
          ? { ...notification, [`${channel}Enabled`]: enabled }
          : notification
      )
    )
    
    await updateNotificationPreference(type, enabled, channel)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-3"
    >
      {/* Notification Types */}
      <div className="space-y-3">
        <AnimatePresence>
          {notificationTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card animate={false} padding="md" className="bg-white/5 border border-white/10">
                <div className="space-y-4">
                  {/* Type Header */}
                  <div className="flex items-start gap-3">
                    <div className={`p-2 bg- ${type.bgColor} rounded-lg border ${type.borderColor}`}>
                      <type.icon className={`w-3.5 h-3.5 ${type.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-normal tracking-tight text-white mb-1">{type.label}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">{type.description}</p>
                    </div>
                  </div>

                  {/* Channel Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {channels.map((channel) => (
                      <div key={`${type.id}-${channel.id}`} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <channel.icon className="w-3 h-3 text-gray-300" />
                            <span className="text-xs font-normal tracking-tight text-white">{channel.label}</span>
                          </div>
                          <motion.label 
                            className="relative inline-flex items-center cursor-pointer"
                            whileTap={{ scale: 0.95 }}
                          >
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={getNotificationSetting(type.id, channel.id as 'email' | 'inApp' | 'push' | 'sms')}
                              onChange={(e) => handleToggleChange(type.id, channel.id as 'email' | 'inApp' | 'push' | 'sms', e.target.checked)}
                            />
                            <div className="w-8 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D417C8]/20 rounded-full peer peer-checked:after:translate-x-3 peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                          </motion.label>
                        </div>
                        <p className="text-xs text-gray-400">{channel.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
