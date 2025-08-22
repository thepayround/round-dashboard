import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/shared/components/DashboardLayout'
import { Card, SectionHeader, ActionButton } from '@/shared/components'
import { FormInput } from '@/shared/components/ui/FormInput'
import { 
  User as UserIcon, 
  Shield, 
  Bell, 
  CreditCard, 
  Loader2, 
  Save, 
  AlertCircle,
  Info,
  Mail,
  Phone,
  Globe,
  Calendar,
  Clock,
  Languages,
  Settings,
  Lock,
  ChevronRight
} from 'lucide-react'
import { useUserSettingsManager } from '@/shared/hooks/useUserSettingsManager'
import { useAuth } from '@/shared/hooks/useAuth'
import { usePreloadAllOptions } from '@/shared/hooks/api/useUserSettingsOptions'
import { ApiDropdown } from '@/shared/components/ui/ApiDropdown'
import { 
  timezoneDropdownConfig,
  languageDropdownConfig,
  dateFormatDropdownConfig,
  timeFormatDropdownConfig
} from '@/shared/components/ui/ApiDropdown/configs'
import { ChangePasswordForm } from '../components'
import type { UserSettingsUpdateRequest, UserSettings } from '@/shared/services/api/userSettings.service'
import type { User } from '@/shared/types/auth'

interface UserSettingsPageProps {}

const UserSettingsPage: React.FC<UserSettingsPageProps> = () => {
  const [activeSection, setActiveSection] = useState('profile')
  const { state } = useAuth()
  const {user} = state
  const {
    settings,
    notifications,
    isLoading,
    isSaving,
    isInitialized,
    error,
    updateSettings,
    updateNotificationPreference,
    clearError,
  } = useUserSettingsManager()
  
  // Preload all dropdown options once when page loads
  const { isLoading: isLoadingOptions } = usePreloadAllOptions()

  const settingsSections = [
    { 
      id: 'profile', 
      label: 'Profile & Display', 
      icon: UserIcon,
      description: 'Personal information and display preferences'
    },
    { 
      id: 'security', 
      label: 'Security & Privacy', 
      icon: Shield,
      description: 'Password and user security settings'
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: Bell,
      description: 'Communication and alert preferences'
    },
    { 
      id: 'billing', 
      label: 'Billing & Payments', 
      icon: CreditCard,
      description: 'Payment methods and billing information'
    },
  ]

  const renderSectionContent = () => {
    // Show loading state
    if ((isLoading && !isInitialized) || isLoadingOptions) {
      return (
        <Card animate={false} padding="lg">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#D417C8] mx-auto mb-4" />
              <p className="text-gray-400 text-sm">
                {isLoadingOptions ? 'Loading options...' : 'Loading settings...'}
              </p>
            </div>
          </div>
        </Card>
      )
    }

    // Show error state
    if (error && !isLoading) {
      return (
        <Card animate={false} padding="lg">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 border border-red-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Failed to Load Settings</h3>
              <p className="text-gray-400 mb-6 max-w-md">{error}</p>
              <ActionButton
                label="Try Again"
                onClick={clearError}
                variant="primary"
                size="sm"
              />
            </div>
          </div>
        </Card>
      )
    }

    // Render section content
    switch (activeSection) {
      case 'profile':
        return <ProfileSection user={user} settings={settings} updateSettings={updateSettings} isSaving={isSaving} />
      case 'security':
        return <SecuritySection 
          settings={settings} 
          updateSettings={updateSettings} 
          isSaving={isSaving} 
        />
      case 'notifications':
        return <NotificationsSection notifications={notifications} updateNotificationPreference={updateNotificationPreference} />
      case 'billing':
        return <BillingSection />
      default:
        return <ProfileSection user={user} settings={settings} updateSettings={updateSettings} isSaving={isSaving} />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <SectionHeader
          title="User Settings"
          subtitle="Manage your personal preferences and profile settings"
          size="main"
        />

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card animate={false} padding="md">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-300">Settings</span>
                </div>
                <nav className="space-y-1">
                  {settingsSections.map((section) => {
                    const IconComponent = section.icon
                    const isActive = activeSection === section.id
                    return (
                      <motion.button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 group text-left ${
                          isActive
                            ? 'bg-gradient-to-r from-[#D417C8]/20 to-[#14BDEA]/20 text-white border border-[#D417C8]/30 shadow-lg shadow-[#D417C8]/10'
                            : 'text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/10 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <IconComponent className={`w-4 h-4 flex-shrink-0 transition-all duration-200 ${
                            isActive 
                              ? 'text-[#D417C8]' 
                              : 'group-hover:text-white'
                          }`} />
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{section.label}</p>
                            <p className="text-xs text-gray-500 truncate">{section.description}</p>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-all duration-200 ${
                          isActive 
                            ? 'text-[#D417C8] rotate-90' 
                            : 'text-gray-500 group-hover:text-gray-300'
                        }`} />
                      </motion.button>
                    )
                  })}
                </nav>
              </div>
            </Card>
          </motion.div>

          {/* Settings Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            {renderSectionContent()}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Profile Section Component
interface ProfileSectionProps {
  user: User | null
  settings: UserSettings | null
  updateSettings: (updates: UserSettingsUpdateRequest) => Promise<boolean>
  isSaving: boolean
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user, settings, updateSettings, isSaving }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    timezone: 'UTC',
    language: 'en',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12h'
  })
  
  const [hasChanges, setHasChanges] = useState(false)
  const [originalSettings, setOriginalSettings] = useState<UserSettingsUpdateRequest | null>(null)

  useEffect(() => {
    if (user && settings) {
      const initialData = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        timezone: settings.timezone || 'UTC',
        language: settings.language || 'en',
        dateFormat: settings.dateFormat || 'MM/dd/yyyy',
        timeFormat: settings.timeFormat || '12h'
      }
      setFormData(initialData)
      
      // Store original settings for comparison
      const originalSettingsData = {
        timezone: settings.timezone || 'UTC',
        language: settings.language || 'en',
        dateFormat: settings.dateFormat || 'MM/dd/yyyy',
        timeFormat: settings.timeFormat || '12h'
      }
      setOriginalSettings(originalSettingsData)
      setHasChanges(false)
    }
  }, [user, settings])

  // Separate effect to update user fields as soon as user data is available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      }))
    }
  }, [user])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    const settingsUpdate: UserSettingsUpdateRequest = {
      timezone: formData.timezone,
      language: formData.language,
      dateFormat: formData.dateFormat,
      timeFormat: formData.timeFormat
    }
    
    const success = await updateSettings(settingsUpdate)
    if (success) {
      setOriginalSettings(settingsUpdate)
      setHasChanges(false)
    }
  }

  const handleButtonClick = () => {
    handleSubmit()
  }

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      // Check if this change affects settings fields
      if (['timezone', 'language', 'dateFormat', 'timeFormat'].includes(field) && originalSettings) {
        const currentSettings = {
          timezone: newData.timezone,
          language: newData.language,
          dateFormat: newData.dateFormat,
          timeFormat: newData.timeFormat
        }
        
        // Check if any setting has changed from original
        const hasChanged = Object.keys(currentSettings).some(
          key => {
            const settingKey = key as keyof typeof currentSettings
            return currentSettings[settingKey] !== originalSettings[settingKey]
          }
        )
        setHasChanges(hasChanged)
      }
      
      return newData
    })
  }, [originalSettings])

  return (
    <div className="space-y-6">
      {/* Personal Information Card */}
      <Card animate={false} padding="lg">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-10 h-10 bg-gradient-to-br from-[#D417C8]/20 to-[#14BDEA]/20 rounded-lg flex items-center justify-center border border-[#D417C8]/30">
              <UserIcon className="w-5 h-5 text-[#D417C8]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Personal Information</h2>
              <p className="text-sm text-gray-400">Your user details and contact information</p>
            </div>
          </div>

          {/* Info Notice */}
          <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-100 mb-1">Protected Information</h4>
                <p className="text-xs text-blue-200/80">
                  Personal information fields are protected for security. Contact support to update your name, email, or phone number.
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="First Name"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="John"
                disabled
                leftIcon={UserIcon}
                variant="auth"
                className="opacity-50 cursor-not-allowed"
              />
              <FormInput
                label="Last Name"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Doe"
                disabled
                leftIcon={UserIcon}
                variant="auth"
                className="opacity-50 cursor-not-allowed"
              />
              <FormInput
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john.doe@example.com"
                disabled
                leftIcon={Mail}
                variant="auth"
                className="opacity-50 cursor-not-allowed"
              />
              <FormInput
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                disabled
                leftIcon={Phone}
                variant="auth"
                className="opacity-50 cursor-not-allowed"
              />
            </div>
          </form>
        </div>
      </Card>

      {/* Display Preferences Card */}
      <Card animate={false} padding="lg">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-10 h-10 bg-gradient-to-br from-[#7767DA]/20 to-[#D417C8]/20 rounded-lg flex items-center justify-center border border-[#7767DA]/30">
              <Globe className="w-5 h-5 text-[#7767DA]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Display & Localization</h2>
              <p className="text-sm text-gray-400">Customize how dates, times, and content are displayed</p>
            </div>
          </div>

          {/* Preferences Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-300">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Timezone
                  </div>
                </label>
                <ApiDropdown
                  config={timezoneDropdownConfig}
                  value={formData.timezone}
                  onSelect={(value: string) => handleInputChange('timezone', value)}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="language" className="block text-sm font-medium text-gray-300">
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4" />
                    Language
                  </div>
                </label>
                <ApiDropdown
                  config={languageDropdownConfig}
                  value={formData.language}
                  onSelect={(value: string) => handleInputChange('language', value)}
                  className="w-full"
                  disabled // Disabled since only English is available
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date Format
                  </div>
                </label>
                <ApiDropdown
                  config={dateFormatDropdownConfig}
                  value={formData.dateFormat}
                  onSelect={(value: string) => handleInputChange('dateFormat', value)}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Time Format
                  </div>
                </label>
                <ApiDropdown
                  config={timeFormatDropdownConfig}
                  value={formData.timeFormat}
                  onSelect={(value: string) => handleInputChange('timeFormat', value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-white/10">
              <ActionButton
                label={isSaving ? 'Saving...' : 'Save Changes'}
                onClick={handleButtonClick}
                icon={Save}
                variant="primary"
                size="md"
                disabled={isSaving || !hasChanges}
                loading={isSaving}
                actionType="general"
              />
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}

// Security Section Component
interface SecuritySectionProps {
  settings: UserSettings | null
  updateSettings: (updates: UserSettingsUpdateRequest) => Promise<boolean>
  isSaving: boolean
}

const SecuritySection: React.FC<SecuritySectionProps> = ({ settings: _settings, updateSettings: _updateSettings, isSaving: _isSaving }) => (
    <Card animate={false} padding="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF4E50]/20 to-[#F44336]/20 rounded-lg flex items-center justify-center border border-[#FF4E50]/30">
            <Lock className="w-5 h-5 text-[#FF4E50]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Password & Security</h2>
            <p className="text-sm text-gray-400">Manage your user password and security settings</p>
          </div>
        </div>

        {/* Password Change Form */}
        <div>
          <ChangePasswordForm />
        </div>
      </div>
    </Card>
  )

// Notifications Section Component
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

const NotificationsSection: React.FC<NotificationsSectionProps> = ({ notifications, updateNotificationPreference }) => {
  // Local state to prevent full reloads and provide immediate feedback
  const [localNotifications, setLocalNotifications] = useState(notifications)
  
  // Update local state when props change
  useEffect(() => {
    setLocalNotifications(notifications)
  }, [notifications])

  const notificationTypes = [
    { 
      id: 'billing', 
      label: 'Billing & Payments', 
      description: 'Payment confirmations, invoice reminders, and billing updates',
      icon: CreditCard,
      color: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400'
    },
    { 
      id: 'security', 
      label: 'Security Alerts', 
      description: 'Login attempts, password changes, and user security',
      icon: Shield,
      color: 'from-red-500/20 to-pink-500/20 border-red-500/30 text-red-400'
    },
    { 
      id: 'product', 
      label: 'Product Updates', 
      description: 'New features, improvements, and platform announcements',
      icon: Bell,
      color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400'
    },
    { 
      id: 'marketing', 
      label: 'Marketing Communications', 
      description: 'Newsletters, promotional content, and educational resources',
      icon: Mail,
      color: 'from-purple-500/20 to-violet-500/20 border-purple-500/30 text-purple-400'
    }
  ]

  const channels = [
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'inApp', label: 'In-App', icon: Bell },
    { id: 'push', label: 'Push', icon: Bell },
    { id: 'sms', label: 'SMS', icon: Bell }
  ]

  const getNotificationSetting = (type: string, channel: 'email' | 'inApp' | 'push' | 'sms') => {
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

  const handleToggleChange = useCallback(async (type: string, channel: 'email' | 'inApp' | 'push' | 'sms', enabled: boolean) => {
    // Update local state immediately for responsive UI
    setLocalNotifications(prev => 
      prev.map(notification => {
        if (notification.notificationType === type) {
          return {
            ...notification,
            [`${channel}Enabled`]: enabled
          }
        }
        return notification
      })
    )

    // Update backend asynchronously
    try {
      await updateNotificationPreference(type, enabled, channel)
    } catch (error) {
      // Revert local state on error
      setLocalNotifications(notifications)
      console.error('Failed to update notification preference:', error)
    }
  }, [notifications, updateNotificationPreference])

  return (
    <Card animate={false} padding="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="w-10 h-10 bg-gradient-to-br from-[#14BDEA]/20 to-[#7767DA]/20 rounded-lg flex items-center justify-center border border-[#14BDEA]/30">
            <Bell className="w-5 h-5 text-[#14BDEA]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Notification Preferences</h2>
            <p className="text-sm text-gray-400">Control how and when you receive notifications</p>
          </div>
        </div>

        {/* Notification Types */}
        <div className="space-y-6">
          {notificationTypes.map((type) => (
            <motion.div 
              key={type.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Notification Type Header */}
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 bg-gradient-to-br ${type.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <type.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white mb-1">{type.label}</h3>
                  <p className="text-sm text-gray-400">{type.description}</p>
                </div>
              </div>

              {/* Channel Toggles */}
              <div className="ml-14">
                <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex flex-wrap gap-6">
                    {channels.map((channel) => (
                      <div key={`${type.id}-${channel.id}`} className="flex items-center gap-3 min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <channel.icon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-300">{channel.label}</span>
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
                          <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D417C8]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#D417C8] peer-checked:to-[#14BDEA]" />
                        </motion.label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Settings */}
        <div className="pt-6 border-t border-white/10">
          <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-100 mb-1">Notification Preferences</h4>
                <p className="text-xs text-yellow-200/80">
                  You can unsubscribe from marketing emails at any time. Security and billing notifications are required for user safety.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

// Billing Section Component  
const BillingSection = () => (
    <div className="space-y-6">
      {/* Payment Methods Card */}
      <Card animate={false} padding="lg">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-10 h-10 bg-gradient-to-br from-[#42E695]/20 to-[#3BB2B8]/20 rounded-lg flex items-center justify-center border border-[#42E695]/30">
              <CreditCard className="w-5 h-5 text-[#42E695]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Payment Methods</h2>
              <p className="text-sm text-gray-400">Manage your payment methods and billing preferences</p>
            </div>
          </div>

          {/* Payment Methods List */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/8 hover:border-white/20 transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gradient-to-r from-[#D417C8] to-[#14BDEA] rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">VISA</span>
                </div>
                <div>
                  <p className="text-white font-medium">•••• •••• •••• 4242</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Expires 12/24</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/20 border border-green-400/30 rounded text-green-400 text-xs">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      Primary
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-[#D417C8] hover:text-[#BD2CD0] text-sm font-medium transition-colors duration-200">
                  Edit
                </button>
                <button className="text-gray-400 hover:text-gray-300 text-sm font-medium transition-colors duration-200">
                  Remove
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/30 transition-colors duration-200"
            >
              <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <h3 className="text-white font-medium mb-2">Add New Payment Method</h3>
              <p className="text-gray-400 text-sm mb-4">Add a credit card, debit card, or bank account</p>
              <ActionButton
                label="Add Payment Method"
                onClick={() => { /* Add payment method clicked */ }}
                variant="secondary"
                size="sm"
              />
            </motion.div>
          </div>
        </div>
      </Card>

      {/* Billing Information Card */}
      <Card animate={false} padding="lg">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-10 h-10 bg-gradient-to-br from-[#7767DA]/20 to-[#D417C8]/20 rounded-lg flex items-center justify-center border border-[#7767DA]/30">
              <Mail className="w-5 h-5 text-[#7767DA]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Billing Information</h2>
              <p className="text-sm text-gray-400">Your billing address and invoice preferences</p>
            </div>
          </div>

          {/* Billing Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Billing Address</h4>
                <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div className="space-y-1 text-sm text-gray-300">
                    <p className="text-white font-medium">Acme Corporation</p>
                    <p>123 Business Street</p>
                    <p>Suite 100</p>
                    <p>San Francisco, CA 94105</p>
                    <p>United States</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Invoice Preferences</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                    <label htmlFor="email-invoices" className="text-sm text-gray-300 cursor-pointer">Email invoices</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input id="email-invoices" type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D417C8]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#D417C8] peer-checked:to-[#14BDEA]" />
                      <span className="sr-only">Toggle email invoices</span>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                    <label htmlFor="payment-reminders" className="text-sm text-gray-300 cursor-pointer">Payment reminders</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input id="payment-reminders" type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D417C8]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#D417C8] peer-checked:to-[#14BDEA]" />
                      <span className="sr-only">Toggle payment reminders</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
            <ActionButton
              label="Update Billing Address"
              onClick={() => { /* Update billing address */ }}
              variant="secondary"
              size="sm"
            />
            <ActionButton
              label="Download Invoice"
              onClick={() => { /* Download invoice */ }}
              variant="secondary"
              size="sm"
            />
          </div>
        </div>
      </Card>
    </div>
  )


export default UserSettingsPage