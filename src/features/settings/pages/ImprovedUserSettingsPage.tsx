import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/shared/components/DashboardLayout'
import { Card, SectionHeader } from '@/shared/components'
import { 
  User as UserIcon, 
  Shield, 
  Bell, 
  CreditCard, 
  Loader2, 
  AlertCircle
} from 'lucide-react'
import { useUserSettingsManager } from '@/shared/hooks/useUserSettingsManager'
import { useAuth } from '@/shared/hooks/useAuth'
import { usePhoneFormatting } from '@/shared/hooks/usePhoneFormatting'
import { usePreloadAllOptions } from '@/shared/hooks/api/useUserSettingsOptions'
import { 
  SettingsNavigation,
  ProfileSection,
  SecuritySection,
  NotificationsSection,
  BillingSection
} from '../components/improved'
import type { UserSettingsUpdateRequest } from '@/shared/services/api/userSettings.service'

interface UserSettingsPageProps {
  // Props can be added here if needed in the future
}

const UserSettingsPage: React.FC<UserSettingsPageProps> = () => {
  const [activeSection, setActiveSection] = useState('profile')
  const { state } = useAuth()
  const { user } = state
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
  
  // Handle phone formatting at the page level - single API call
  const _phoneFormatting = usePhoneFormatting(user?.phoneNumberFormatted ?? user?.phone)
    
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-24"
        >
          <Card animate={false} padding="xl" className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#D417C8] mx-auto mb-6" />
            <h3 className="text-lg font-semibold text-white mb-2">
              {isLoadingOptions ? 'Loading Settings...' : 'Initializing...'}
            </h3>
            <p className="text-gray-400">
              {isLoadingOptions ? 'Preparing your preferences' : 'Setting up your account'}
            </p>
          </Card>
        </motion.div>
      )
    }

    // Show error state
    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-24"
        >
          <Card animate={false} padding="xl" className="text-center max-w-md">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-full w-fit mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Settings Unavailable</h3>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={clearError}
              className="px-6 py-3 bg-[#D417C8] hover:bg-[#BD2CD0] text-white font-medium rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </Card>
        </motion.div>
      )
    }

    // Render section content
    const commonProps = {
      user,
      settings,
      updateSettings: async (updates: UserSettingsUpdateRequest) => {
        const result = await updateSettings(updates)
        return result
      },
      isSaving
    }

    switch (activeSection) {
      case 'profile':
        return (
          <ProfileSection 
            user={commonProps.user}
            settings={commonProps.settings}
            updateSettings={commonProps.updateSettings}
            isSaving={commonProps.isSaving}
          />
        )
      case 'security':
        return <SecuritySection />
      case 'notifications':
        return (
          <NotificationsSection 
            notifications={notifications} 
            updateNotificationPreference={updateNotificationPreference} 
          />
        )
      case 'billing':
        return <BillingSection />
      default:
        return (
          <ProfileSection 
            user={commonProps.user}
            settings={commonProps.settings}
            updateSettings={commonProps.updateSettings}
            isSaving={commonProps.isSaving}
          />
        )
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            title="Account Settings"
            subtitle="Manage your account preferences and security settings"
            size="main"
          />
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <SettingsNavigation
              sections={settingsSections}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default UserSettingsPage
