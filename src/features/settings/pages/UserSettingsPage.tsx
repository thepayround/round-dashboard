import { useState, useEffect, useCallback } from 'react'
import { DashboardLayout } from '@/shared/components/DashboardLayout'
import { Card } from '@/shared/components/Card'
import { ActionButton } from '@/shared/components/ActionButton'
import { User as UserIcon, Shield, Bell, CreditCard, Loader2, Save, AlertCircle } from 'lucide-react'
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
    { id: 'profile', label: 'Profile & Display', icon: UserIcon },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
  ]

  const renderSectionContent = () => {
    // Show loading state
    if ((isLoading && !isInitialized) || isLoadingOptions) {
      return (
        <Card className="p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
            <span className="ml-3 text-gray-400">
              {isLoadingOptions ? 'Loading options...' : 'Loading settings...'}
            </span>
          </div>
        </Card>
      )
    }

    // Show error state
    if (error && !isLoading) {
      return (
        <Card className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Failed to Load Settings</h3>
              <p className="text-gray-400 mb-4">{error}</p>
              <button
                onClick={clearError}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-cyan-500 text-white rounded-lg hover:from-pink-600 hover:to-cyan-600 transition-all duration-200"
              >
                Dismiss
              </button>
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
        return <SecuritySection settings={settings} updateSettings={updateSettings} isSaving={isSaving} />
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
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">User Settings</h1>
          <p className="text-gray-400">Manage your account preferences and configuration</p>
        </div>

        {/* Horizontal Navigation */}
        <div className="mb-8">
          <Card className="p-6">
            <nav className="flex flex-wrap gap-2">
              {settingsSections.map((section) => {
                const IconComponent = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-[#D417C8]/20 to-[#14BDEA]/20 text-white border border-white/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm font-medium hidden sm:inline">{section.label}</span>
                    <span className="text-sm font-medium sm:hidden">{section.label.split(' ')[0]}</span>
                  </button>
                )
              })}
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div>
          {renderSectionContent()}
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
    <form onSubmit={handleSubmit}>
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Profile & Display Settings</h2>
        <div className="space-y-6">
          {/* Contact Support Notice */}
          <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-cyan-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-cyan-100 mb-1">Need to Update Personal Information?</h4>
                <p className="text-xs text-cyan-200/80">
                  Personal information fields are protected for security. Please contact our support team to update your name, email, or phone number.
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50"
                  placeholder="John"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50"
                  placeholder="Doe"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50"
                  placeholder="john.doe@example.com"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50"
                  placeholder="+1 (555) 123-4567"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Display & Localization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                <ApiDropdown
                  config={timezoneDropdownConfig}
                  value={formData.timezone}
                  onSelect={(value: string) => handleInputChange('timezone', value)}
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                <ApiDropdown
                  config={languageDropdownConfig}
                  value={formData.language}
                  onSelect={(value: string) => handleInputChange('language', value)}
                  className="w-full"
                  disabled // Disabled since only English is available
                />
              </div>
              <div>
                <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-300 mb-2">Date Format</label>
                <ApiDropdown
                  config={dateFormatDropdownConfig}
                  value={formData.dateFormat}
                  onSelect={(value: string) => handleInputChange('dateFormat', value)}
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-300 mb-2">Time Format</label>
                <ApiDropdown
                  config={timeFormatDropdownConfig}
                  value={formData.timeFormat}
                  onSelect={(value: string) => handleInputChange('timeFormat', value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
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
        </div>
      </Card>
    </form>
  )
}

// Security Section Component
interface SecuritySectionProps {
  settings: UserSettings | null
  updateSettings: (updates: UserSettingsUpdateRequest) => Promise<boolean>
  isSaving: boolean
}

const SecuritySection: React.FC<SecuritySectionProps> = ({ settings: _settings, updateSettings: _updateSettings, isSaving: _isSaving }) => (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Security & Privacy</h2>
      <div className="space-y-6">
        {/* Password */}
        <div>
          <h3 className="text-lg font-medium text-white mb-4">Password</h3>
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all duration-200">
            Change Password
          </button>
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
  // Removed unused function
  const notificationTypes = [
    { 
      id: 'billing', 
      label: 'Billing Notifications', 
      description: 'Updates about payments and invoices' 
    },
    { 
      id: 'security', 
      label: 'Security Alerts', 
      description: 'Get notified about security events' 
    },
    { 
      id: 'product', 
      label: 'Product Updates', 
      description: 'Learn about new features and improvements' 
    },
    { 
      id: 'marketing', 
      label: 'Marketing Emails', 
      description: 'Promotional content and newsletters' 
    }
  ]

  const getNotificationSetting = (type: string, channel: 'email' | 'inApp' | 'push' | 'sms') => {
    const notification = notifications.find(n => n.notificationType === type)
    if (!notification) return false
    
    switch (channel) {
      case 'email': return notification.emailEnabled
      case 'inApp': return notification.inAppEnabled
      case 'push': return notification.pushEnabled
      case 'sms': return notification.smsEnabled
      default: return false
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Notifications</h2>
      <div className="space-y-6">
        {notificationTypes.map((type) => (
          <div key={type.id} className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white font-medium">{type.label}</p>
                <p className="text-gray-400 text-sm">{type.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['email', 'inApp', 'push', 'sms'].map((channel) => (
                <div key={channel} className="flex items-center space-x-2">
                  <label htmlFor={`${type.id}-${channel}`} className="relative inline-flex items-center cursor-pointer">
                    <input 
                      id={`${type.id}-${channel}`}
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={getNotificationSetting(type.id, channel as 'email' | 'inApp' | 'push' | 'sms')}
                      onChange={(e) => updateNotificationPreference(type.id, e.target.checked, channel as 'email' | 'inApp' | 'push' | 'sms')}
                    />
                    <div className="w-8 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-500/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:to-cyan-500" />
                    <span className="sr-only">Enable {channel === 'inApp' ? 'In-App' : channel} notifications for {type.label}</span>
                  </label>
                  <span className="text-sm text-gray-300 capitalize">{channel === 'inApp' ? 'In-App' : channel}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// Billing Section Component  
const BillingSection = () => (
  <Card className="p-6">
    <h2 className="text-xl font-semibold text-white mb-6">Billing & Payments</h2>
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Payment Methods</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-6 bg-gradient-to-r from-pink-500 to-cyan-500 rounded" />
              <div>
                <p className="text-white font-medium">•••• •••• •••• 4242</p>
                <p className="text-gray-400 text-sm">Expires 12/24</p>
              </div>
            </div>
            <button className="text-pink-400 hover:text-pink-300 text-sm">Edit</button>
          </div>
        </div>
        <button className="mt-3 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all duration-200">
          Add Payment Method
        </button>
      </div>
    </div>
  </Card>
)


export default UserSettingsPage