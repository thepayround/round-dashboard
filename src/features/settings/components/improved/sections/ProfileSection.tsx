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
  Info,
} from 'lucide-react'
import React from 'react'

import { useProfileSectionController } from '../../../hooks/useProfileSectionController'

import type {
  UserSettingsUpdateRequest,
  UserSettings,
} from '@/shared/services/api/userSettings.service'
import type { User } from '@/shared/types/auth'
import { DetailCard, InfoList, InfoItem } from '@/shared/ui/DetailCard'
import { PhoneDisplay } from '@/shared/ui/PhoneDisplay'
import { SimpleSelect } from '@/shared/ui/SimpleSelect'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/shadcn/alert'
import { Button } from '@/shared/ui/shadcn/button'
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
  isSaving,
}) => {
  const { formData, hasChanges, handleInputChange, handleSubmit } =
    useProfileSectionController({
      user,
      settings,
      updateSettings,
    })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      {/* Personal Information Section */}
      <DetailCard
        title="User Information"
        icon={<UserIcon className="h-4 w-4" />}
      >
        <div className="space-y-4">
          {/* Info Notice */}
          <Alert variant="default" className="bg-primary/5 border-primary/20">
            <Info className="h-4 w-4" />
            <AlertTitle>Protected Information</AlertTitle>
            <AlertDescription>
              User information fields are protected for security. Contact
              support to update your name, email, or phone number.
            </AlertDescription>
          </Alert>

          {/* Read-only user info displayed as InfoList */}
          <InfoList>
            <InfoItem
              label="Full Name"
              icon={<UserIcon className="h-3.5 w-3.5 text-muted-foreground" />}
            >
              {formData.firstName} {formData.lastName}
            </InfoItem>
            <InfoItem
              label="Email"
              icon={<Mail className="h-3.5 w-3.5 text-muted-foreground" />}
            >
              {formData.email || (
                <span className="text-muted-foreground">Not provided</span>
              )}
            </InfoItem>
            <InfoItem
              label="Phone"
              icon={<Phone className="h-3.5 w-3.5 text-muted-foreground" />}
            >
              {user?.phoneNumberFormatted ?? user?.phone ? (
                <PhoneDisplay
                  phoneNumber={user?.phoneNumberFormatted ?? user?.phone ?? ''}
                  showCopyButton
                  showCountryFlag={false}
                />
              ) : (
                <span className="text-muted-foreground">
                  No phone number provided
                </span>
              )}
            </InfoItem>
          </InfoList>
        </div>
      </DetailCard>

      {/* Display Preferences Section */}
      <DetailCard
        title="Display & Localization"
        icon={<Globe className="h-4 w-4" />}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="timezone-dropdown"
                className="flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <Globe className="h-3 w-3" />
                Timezone
              </Label>
              <SimpleSelect
                id="timezone-dropdown"
                options={timezones}
                value={formData.timezone}
                onChange={(value: string) =>
                  handleInputChange('timezone', value)
                }
                placeholder="Select timezone"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="language-dropdown"
                className="flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <Languages className="h-3 w-3" />
                Language
              </Label>
              <SimpleSelect
                id="language-dropdown"
                options={languages}
                value={formData.language}
                onChange={(value: string) =>
                  handleInputChange('language', value)
                }
                placeholder="Select language"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="date-format-dropdown"
                className="flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <Calendar className="h-3 w-3" />
                Date Format
              </Label>
              <SimpleSelect
                id="date-format-dropdown"
                options={dateFormats}
                value={formData.dateFormat}
                onChange={(value: string) =>
                  handleInputChange('dateFormat', value)
                }
                placeholder="Select date format"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="time-format-dropdown"
                className="flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <Clock className="h-3 w-3" />
                Time Format
              </Label>
              <SimpleSelect
                id="time-format-dropdown"
                options={timeFormats}
                value={formData.timeFormat}
                onChange={(value: string) =>
                  handleInputChange('timeFormat', value)
                }
                placeholder="Select time format"
                className="w-full"
              />
            </div>
          </div>

          {/* Save Section */}
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <div className="flex items-center">
              {hasChanges && (
                <div className="flex items-center gap-1.5 text-warning">
                  <div className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />
                  <span className="text-xs font-medium">Unsaved changes</span>
                </div>
              )}
            </div>
            <Button
              type="submit"
              variant="default"
              disabled={isSaving || !hasChanges}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DetailCard>
    </motion.div>
  )
}
