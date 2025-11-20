import { motion } from 'framer-motion'
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Globe, 
  Calendar, 
  Clock, 
  Languages, 
  Save,
  Info
} from 'lucide-react'
import React from 'react'

import { useProfileSectionController } from '../../../hooks/useProfileSectionController'

import type { UserSettingsUpdateRequest, UserSettings } from '@/shared/services/api/userSettings.service'
import type { User } from '@/shared/types/auth'
import { ActionButton } from '@/shared/ui/ActionButton'
import { ApiDropdown } from '@/shared/ui/ApiDropdown'
import {
  timezoneDropdownConfig,
  languageDropdownConfig,
  dateFormatDropdownConfig,
  timeFormatDropdownConfig,
} from '@/shared/ui/ApiDropdown/configs'
import { Card } from '@/shared/ui/Card'
import { FormInput } from '@/shared/ui/FormInput'
import { PhoneDisplay } from '@/shared/ui/PhoneDisplay'


interface ProfileSectionProps {
  user: User | null
  settings: UserSettings | null
  updateSettings: (updates: UserSettingsUpdateRequest) => Promise<boolean>
  isSaving: boolean
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ 
  user, 
  settings, 
  updateSettings, 
  isSaving 
}) => {
  const { formData, hasChanges, handleInputChange, handleSubmit } = useProfileSectionController({
    user,
    settings,
    updateSettings,
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-4"
    >
      {/* Personal Information Section */}
      <Card animate={false} padding="md" className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-primary/15 rounded-lg border border-primary/20">
            <UserIcon className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-normal tracking-tight text-white mb-1">User Information</h2>
            <p className="text-xs text-gray-400 mb-3">
              Your user details and contact information
            </p>
            
            {/* Info Notice */}
            <div className="p-3 bg-primary/5 border border-blue-500/10 rounded-lg mb-4">
              <div className="flex items-start gap-2">
                <Info className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-normal text-blue-100 mb-0.5">Protected Information</h4>
                  <p className="text-sm text-blue-200/70 leading-relaxed">
                    User information fields are protected for security. Contact support to update your name, email, or phone number.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Info Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="First Name"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="John"
            disabled
            leftIcon={UserIcon}
            className="opacity-60 cursor-not-allowed h-7 md:h-9 text-xs"
          />
          <FormInput
            label="Last Name"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Doe"
            disabled
            leftIcon={UserIcon}
            className="opacity-60 cursor-not-allowed h-7 md:h-9 text-xs"
          />
          <FormInput
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="john.doe@example.com"
            disabled
            leftIcon={Mail}
            className="opacity-60 cursor-not-allowed h-7 md:h-9 text-xs"
          />
          <div className="relative">
            <FormInput
              label="Phone Number"
              type="tel"
              value={user?.phoneNumberFormatted ?? user?.phone ?? ""}
              onChange={() => {}}
              placeholder="No phone number provided"
              disabled
              leftIcon={Phone}
              className="opacity-60 cursor-not-allowed h-7 md:h-9 text-xs"
            />
            {(user?.phoneNumberFormatted ?? user?.phone) && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-3 z-10">
                <PhoneDisplay
                  phoneNumber={user?.phoneNumberFormatted ?? user?.phone ?? ''}
                  copyButtonOnly
                  showCopyButton
                  showCountryFlag={false}
                  className="opacity-70 hover:opacity-100"
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Display Preferences Section */}
      <Card animate={false} padding="md">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-2 bg-primary/15 rounded-lg border border-accent/20">
            <Globe className="w-3.5 h-3.5 text-accent" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-normal tracking-tight text-white mb-1">Display & Localization</h2>
            <p className="text-xs text-gray-400">
              Customize how dates, times, and content are displayed
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label htmlFor="timezone-dropdown" className="flex items-center gap-1.5 text-sm font-normal text-white/90 tracking-tight">
                <Globe className="w-3 h-3" />
                Timezone
              </label>
              <ApiDropdown
                config={timezoneDropdownConfig}
                value={formData.timezone}
                onSelect={(value: string) => handleInputChange('timezone', value)}
                className="w-full h-7 md:h-9"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="language-dropdown" className="flex items-center gap-1.5 text-sm font-normal text-white/90 tracking-tight">
                <Languages className="w-3 h-3" />
                Language
              </label>
              <ApiDropdown
                config={languageDropdownConfig}
                value={formData.language}
                onSelect={(value: string) => handleInputChange('language', value)}
                className="w-full h-7 md:h-9"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="date-format-dropdown" className="flex items-center gap-1.5 text-sm font-normal text-white/90 tracking-tight">
                <Calendar className="w-3 h-3" />
                Date Format
              </label>
              <ApiDropdown
                config={dateFormatDropdownConfig}
                value={formData.dateFormat}
                onSelect={(value: string) => handleInputChange('dateFormat', value)}
                className="w-full h-7 md:h-9"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="time-format-dropdown" className="flex items-center gap-1.5 text-sm font-normal text-white/90 tracking-tight">
                <Clock className="w-3 h-3" />
                Time Format
              </label>
              <ApiDropdown
                config={timeFormatDropdownConfig}
                value={formData.timeFormat}
                onSelect={(value: string) => handleInputChange('timeFormat', value)}
                className="w-full h-7 md:h-9"
              />
            </div>
          </div>

          {/* Save Section */}
          <div className="flex justify-between items-center pt-4 border-t border-white/8">
            <div className="flex items-center">
              {hasChanges && (
                <div className="flex items-center gap-1.5 text-orange-400">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
                  <span className="text-xs font-medium">Unsaved changes</span>
                </div>
              )}
            </div>
            <ActionButton
              label={isSaving ? 'Saving...' : 'Save Changes'}
              onClick={() => handleSubmit()}
              icon={Save}
              variant="primary"
              size="sm"
              disabled={isSaving || !hasChanges}
              isLoading={isSaving}
              actionType="general"
              className="h-8 md:h-9 px-4 text-xs"
            />
          </div>
        </form>
      </Card>
    </motion.div>
  )
}

