import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/shared/components/DashboardLayout'
import { Card } from '@/shared/components/Card'
import { SaveStatusIndicator, SaveButton } from '@/shared/components/SaveStatusIndicator'
import { User as UserIcon, Shield, Bell, CreditCard, Loader2, AlertTriangle } from 'lucide-react'
import { useUserSettingsManager } from '@/shared/hooks/useUserSettingsManager'
import { useAuth } from '@/shared/hooks/useAuth'
import { useAutoSave } from '@/shared/hooks/useAutoSave'
import type { UserSettingsUpdateRequest, UserSettings } from '@/shared/services/api/userSettings.service'
import type { User } from '@/shared/types/auth'

interface UserSettingsPageProps {}

const UserSettingsPage: React.FC<UserSettingsPageProps> = () => {
  const [activeSection, setActiveSection] = useState('profile')
  const { state } = useAuth()
  const {user} = state
  const {
    settings,
    notifications: _notifications,
    isLoading,
    isSaving: _isSaving,
    isInitialized,
    error,
    updateSettings,
    updateNotificationPreference: _updateNotificationPreference,
    clearError,
  } = useUserSettingsManager()

  // Track unsaved changes across all sections
  const [hasAnyUnsavedChanges, setHasAnyUnsavedChanges] = useState(false)

  const settingsSections = [
    { id: 'profile', label: 'Profile & Account', icon: UserIcon },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
  ]

  // Warn user about unsaved changes when leaving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasAnyUnsavedChanges) {
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasAnyUnsavedChanges])

  const renderSectionContent = () => {
    // Show loading state
    if (isLoading && !isInitialized) {
      return (
        <Card className="p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
            <span className="ml-3 text-gray-400">Loading settings...</span>
          </div>
        </Card>
      )
    }

    // Show error state
    if (error && !isLoading) {
      return (
        <Card className="p-6">
          <div className="flex items-center justify-center py-12 text-red-400">
            <AlertTriangle className="w-8 h-8 mr-3" />
            <div>
              <p className="font-medium">Failed to load settings</p>
              <p className="text-sm text-gray-400 mt-1">{error}</p>
              <button
                onClick={clearError}
                className="mt-2 text-pink-400 hover:text-pink-300 text-sm underline"
              >
                Try again
              </button>
            </div>
          </div>
        </Card>
      )
    }

    switch (activeSection) {
      case 'profile':
        return (
          <ProfileSection 
            user={user} 
            settings={settings} 
            updateSettings={updateSettings}
            onUnsavedChanges={setHasAnyUnsavedChanges}
          />
        )
      case 'security':
        return <SecuritySection settings={settings} updateSettings={updateSettings} />
      case 'notifications':
        return <NotificationsSection notifications={_notifications} updateNotificationPreference={_updateNotificationPreference} />
      case 'billing':
        return <BillingSection />
      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account preferences and configuration</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Settings Navigation */}
          <div className="lg:w-64">
            <Card className="p-4">
              <nav className="space-y-2">
                {settingsSections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-pink-500/20 to-cyan-500/20 text-white border border-pink-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  )
                })}
              </nav>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Enhanced Profile Section with Auto-save
interface ProfileSectionProps {
  user: User | null
  settings: UserSettings | null
  updateSettings: (updates: UserSettingsUpdateRequest) => Promise<boolean>
  onUnsavedChanges: (hasChanges: boolean) => void
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ 
  user, 
  settings, 
  updateSettings, 
  onUnsavedChanges 
}) => {
  const [formData, setFormData] = useState({
    timezone: 'UTC',
    language: 'en',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12h'
  })

  // Auto-save hook
  const {
    saveStatus,
    triggerSave,
    hasUnsavedChanges
  } = useAutoSave(formData, {
    onSave: async (data) => {
      const settingsUpdate: UserSettingsUpdateRequest = {
        timezone: data.timezone,
        language: data.language,
        dateFormat: data.dateFormat,
        timeFormat: data.timeFormat
      }
      return await updateSettings(settingsUpdate)
    },
    delay: 1500, // Wait 1.5 seconds after user stops typing
    enabled: true
  })

  // Update parent about unsaved changes
  useEffect(() => {
    onUnsavedChanges(hasUnsavedChanges)
  }, [hasUnsavedChanges, onUnsavedChanges])

  // Initialize form data
  useEffect(() => {
    if (settings) {
      setFormData({
        timezone: settings.timezone || 'UTC',
        language: settings.language || 'en',
        dateFormat: settings.dateFormat || 'MM/dd/yyyy',
        timeFormat: settings.timeFormat || '12h'
      })
    }
  }, [settings])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Profile & Account</h2>
        <div className="flex items-center space-x-4">
          <SaveStatusIndicator status={saveStatus} />
          <SaveButton
            onClick={triggerSave}
            status={saveStatus}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-medium text-white mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
              <input
                id="firstName"
                type="text"
                value={user?.firstName ?? ''}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50"
                placeholder="Enter first name"
                disabled
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
              <input
                id="lastName"
                type="text"
                value={user?.lastName ?? ''}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50"
                placeholder="Enter last name"
                disabled
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                id="email"
                type="email"
                value={user?.email ?? ''}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50"
                placeholder="Enter email"
                disabled
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
              <input
                id="phone"
                type="tel"
                value={user?.phone ?? ''}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50"
                placeholder="+1 (555) 123-4567"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Preferences - These will auto-save */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Preferences</h3>
            {hasUnsavedChanges && (
              <div className="text-sm text-amber-400 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Changes will be saved automatically
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
              <select
                id="timezone" 
                value={formData.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </select>
            </div>
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">Language</label>
              <select
                id="language" 
                value={formData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
              </select>
            </div>
            <div>
              <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-300 mb-2">Date Format</label>
              <select
                id="dateFormat" 
                value={formData.dateFormat}
                onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50"
              >
                <option value="MM/dd/yyyy">MM/dd/yyyy</option>
                <option value="dd/MM/yyyy">dd/MM/yyyy</option>
                <option value="yyyy-MM-dd">yyyy-MM-dd</option>
                <option value="MMM dd, yyyy">MMM dd, yyyy</option>
                <option value="dd MMM yyyy">dd MMM yyyy</option>
              </select>
            </div>
            <div>
              <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-300 mb-2">Time Format</label>
              <select
                id="timeFormat" 
                value={formData.timeFormat}
                onChange={(e) => handleInputChange('timeFormat', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50"
              >
                <option value="12h">12 Hour</option>
                <option value="24h">24 Hour</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

// Placeholder sections
const SecuritySection: React.FC<Record<string, unknown>> = () => (
  <Card className="p-6">
    <h2 className="text-xl font-semibold text-white mb-6">Security & Privacy</h2>
    <p className="text-gray-400">Security settings coming soon...</p>
  </Card>
)

const NotificationsSection: React.FC<Record<string, unknown>> = () => (
  <Card className="p-6">
    <h2 className="text-xl font-semibold text-white mb-6">Notifications</h2>
    <p className="text-gray-400">Notification settings coming soon...</p>
  </Card>
)

const BillingSection: React.FC<Record<string, unknown>> = () => (
  <Card className="p-6">
    <h2 className="text-xl font-semibold text-white mb-6">Billing & Payments</h2>
    <p className="text-gray-400">Billing settings coming soon...</p>
  </Card>
)

export default UserSettingsPage
