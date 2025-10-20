import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, ActionButton, PhoneDisplay } from '@/shared/components'
import { FormInput } from '@/shared/components/ui/FormInput'
import { ApiDropdown } from '@/shared/components/ui/ApiDropdown'
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
import { 
  timezoneDropdownConfig,
  languageDropdownConfig,
  dateFormatDropdownConfig,
  timeFormatDropdownConfig
} from '@/shared/components/ui/ApiDropdown/configs'
import type { UserSettingsUpdateRequest, UserSettings } from '@/shared/services/api/userSettings.service'
import type { User } from '@/shared/types/auth'

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

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      if (['timezone', 'language', 'dateFormat', 'timeFormat'].includes(field) && originalSettings) {
        const currentSettings = {
          timezone: newData.timezone,
          language: newData.language,
          dateFormat: newData.dateFormat,
          timeFormat: newData.timeFormat
        }
        
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-4"
    >
      {/* Personal Information Section */}
      <Card animate={false} padding="md" className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gradient-to-br from-[#D417C8]/15 to-[#14BDEA]/15 rounded-lg border border-[#D417C8]/20">
            <UserIcon className="w-3.5 h-3.5 text-[#D417C8]" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-normal tracking-tight text-white mb-1">User Information</h2>
            <p className="text-xs text-gray-400 mb-3">
              Your user details and contact information
            </p>
            
            {/* Info Notice */}
            <div className="p-3 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-blue-500/10 rounded-lg mb-4">
              <div className="flex items-start gap-2">
                <Info className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[11px] font-medium text-blue-100 mb-0.5">Protected Information</h4>
                  <p className="text-[11px] text-blue-200/70 leading-relaxed">
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
            variant="auth"
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
            variant="auth"
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
            variant="auth"
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
              variant="auth"
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
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-[#7767DA]/15 to-[#D417C8]/15 rounded-lg border border-[#7767DA]/20">
            <Globe className="w-3.5 h-3.5 text-[#7767DA]" />
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
              <label htmlFor="timezone-dropdown" className="flex items-center gap-1.5 text-[11px] font-medium text-gray-300">
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
              <label htmlFor="language-dropdown" className="flex items-center gap-1.5 text-[11px] font-medium text-gray-300">
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
              <label htmlFor="date-format-dropdown" className="flex items-center gap-1.5 text-[11px] font-medium text-gray-300">
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
              <label htmlFor="time-format-dropdown" className="flex items-center gap-1.5 text-[11px] font-medium text-gray-300">
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
              loading={isSaving}
              actionType="general"
              className="h-8 md:h-9 px-4 text-xs"
            />
          </div>
        </form>
      </Card>
    </motion.div>
  )
}
