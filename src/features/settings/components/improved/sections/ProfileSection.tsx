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
import { PhoneDisplay } from '@/shared/ui/PhoneDisplay'
import { SimpleSelect } from '@/shared/ui/SimpleSelect'
import { Button } from '@/shared/ui/shadcn/button'
import { Card, CardContent } from '@/shared/ui/shadcn/card'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'

// Dropdown options
const timezones = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  { value: 'UTC', label: 'UTC' },
]

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
]

const dateFormats = [
  { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY' },
  { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY' },
  { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD' },
  { value: 'dd.MM.yyyy', label: 'DD.MM.YYYY' },
]

const timeFormats = [
  { value: '12h', label: '12 Hour' },
  { value: '24h', label: '24 Hour' },
]


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
      <Card className="bg-[#171719] border-[#333333]">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/15 rounded-lg border border-primary/20">
              <UserIcon className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-normal tracking-tight text-white mb-1">User Information</h2>
              <p className="text-xs text-gray-400 mb-4">
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
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-1.5 text-sm font-normal text-white/90 tracking-tight">
                <UserIcon className="w-3 h-3" />
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="John"
                disabled
                className="opacity-60 cursor-not-allowed text-xs bg-[#171719] border-[#333333]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="flex items-center gap-1.5 text-sm font-normal text-white/90 tracking-tight">
                <UserIcon className="w-3 h-3" />
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Doe"
                disabled
                className="opacity-60 cursor-not-allowed text-xs bg-[#171719] border-[#333333]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1.5 text-sm font-normal text-white/90 tracking-tight">
                <Mail className="w-3 h-3" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john.doe@example.com"
                disabled
                className="opacity-60 cursor-not-allowed text-xs bg-[#171719] border-[#333333]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1.5 text-sm font-normal text-white/90 tracking-tight">
                <Phone className="w-3 h-3" />
                Phone Number
              </Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  value={user?.phoneNumberFormatted ?? user?.phone ?? ""}
                  onChange={() => {}}
                  placeholder="No phone number provided"
                  disabled
                  className="opacity-60 cursor-not-allowed text-xs bg-[#171719] border-[#333333]"
                />
                {(user?.phoneNumberFormatted ?? user?.phone) && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
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
          </div>
        </CardContent>
      </Card>

      {/* Display Preferences Section */}
      <Card className="bg-[#171719] border-[#333333]">
        <CardContent className="p-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timezone-dropdown" className="flex items-center gap-1.5 text-sm font-normal text-white/90 tracking-tight">
                  <Globe className="w-3 h-3" />
                  Timezone
                </Label>
                <SimpleSelect
                  id="timezone-dropdown"
                  options={timezones}
                  value={formData.timezone}
                  onChange={(value: string) => handleInputChange('timezone', value)}
                  placeholder="Select timezone"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language-dropdown" className="flex items-center gap-1.5 text-sm font-normal text-white/90 tracking-tight">
                  <Languages className="w-3 h-3" />
                  Language
                </Label>
                <SimpleSelect
                  id="language-dropdown"
                  options={languages}
                  value={formData.language}
                  onChange={(value: string) => handleInputChange('language', value)}
                  placeholder="Select language"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-format-dropdown" className="flex items-center gap-1.5 text-sm font-normal text-white/90 tracking-tight">
                  <Calendar className="w-3 h-3" />
                  Date Format
                </Label>
                <SimpleSelect
                  id="date-format-dropdown"
                  options={dateFormats}
                  value={formData.dateFormat}
                  onChange={(value: string) => handleInputChange('dateFormat', value)}
                  placeholder="Select date format"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time-format-dropdown" className="flex items-center gap-1.5 text-sm font-normal text-white/90 tracking-tight">
                  <Clock className="w-3 h-3" />
                  Time Format
                </Label>
                <SimpleSelect
                  id="time-format-dropdown"
                  options={timeFormats}
                  value={formData.timeFormat}
                  onChange={(value: string) => handleInputChange('timeFormat', value)}
                  placeholder="Select time format"
                  className="w-full"
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
              <Button
                type="submit"
                variant="default"
                size="sm"
                disabled={isSaving || !hasChanges}
                className="h-10 px-4 text-xs"
              >
                {isSaving ? (
                  <>
                    <Save className="w-3.5 h-3.5 mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

