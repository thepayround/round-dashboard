import { motion } from 'framer-motion'
import {
  User as UserIcon,
  Shield,
  Bell,
  CreditCard,
  AlertCircle
} from 'lucide-react'
import React, { useState } from 'react'

import {
  SettingsNavigation,
  ProfileSection,
  SecuritySection,
  NotificationsSection,
  BillingSection
} from '../components/improved'

import { usePreloadAllOptions } from '@/shared/hooks/api/useUserSettingsOptions'
import { useAuth } from '@/shared/hooks/useAuth'
import { usePhoneFormatting } from '@/shared/hooks/usePhoneFormatting'
import { useUserSettingsManager } from '@/shared/hooks/useUserSettingsManager'
import { DashboardLayout } from '@/shared/layout/DashboardLayout'
import type { UserSettingsUpdateRequest } from '@/shared/services/api/userSettings.service'
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner'
import { Button } from '@/shared/ui/shadcn/button'
import { Card } from '@/shared/ui/shadcn/card'

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
      label: 'Password',
      icon: Shield,
      description: 'Password management and security'
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
          className="flex items-center justify-center py-12"
        >
          <Card className="p-6 text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <h3 className="text-sm font-medium tracking-tight text-foreground mb-2">
              {isLoadingOptions ? 'Loading Settings...' : 'Initializing...'}
            </h3>
            <p className="text-xs text-muted-foreground">
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
          <Card className="p-8 text-center max-w-md">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-full w-fit mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Settings Unavailable</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button
              onClick={clearError}
              variant="default"
              size="default"
              className="px-6"
            >
              Try Again
            </Button>
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
      <div className="space-y-4 md:space-y-6">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 lg:sticky lg:top-6 lg:self-start">
            <SettingsNavigation
              sections={settingsSections}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>

          {/* Content Area */}
          <div className="lg:col-span-4">
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default UserSettingsPage

