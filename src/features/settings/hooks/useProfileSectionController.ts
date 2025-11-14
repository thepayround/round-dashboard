import { useCallback, useEffect, useMemo, useState } from 'react'

import type { UserSettingsUpdateRequest, UserSettings } from '@/shared/services/api/userSettings.service'
import type { User } from '@/shared/types/auth'

interface UseProfileSectionControllerParams {
  user: User | null
  settings: UserSettings | null
  updateSettings: (updates: UserSettingsUpdateRequest) => Promise<boolean>
}

interface UseProfileSectionControllerReturn {
  formData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    timezone: string
    language: string
    dateFormat: string
    timeFormat: string
  }
  hasChanges: boolean
  handleInputChange: (field: string, value: string) => void
  handleSubmit: (event?: React.FormEvent) => Promise<void>
}

const DEFAULT_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  timezone: 'UTC',
  language: 'en',
  dateFormat: 'MM/dd/yyyy',
  timeFormat: '12h',
}

export const useProfileSectionController = ({
  user,
  settings,
  updateSettings,
}: UseProfileSectionControllerParams): UseProfileSectionControllerReturn => {
  const [formData, setFormData] = useState(DEFAULT_FORM)
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
        timeFormat: settings.timeFormat || '12h',
      }
      setFormData(initialData)
      setOriginalSettings({
        timezone: initialData.timezone,
        language: initialData.language,
        dateFormat: initialData.dateFormat,
        timeFormat: initialData.timeFormat,
      })
    }
  }, [settings, user])

  const hasChanges = useMemo(() => {
    if (!originalSettings) return false
    return (
      originalSettings.timezone !== formData.timezone ||
      originalSettings.language !== formData.language ||
      originalSettings.dateFormat !== formData.dateFormat ||
      originalSettings.timeFormat !== formData.timeFormat
    )
  }, [formData.dateFormat, formData.language, formData.timeFormat, formData.timezone, originalSettings])

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleSubmit = useCallback(
    async (event?: React.FormEvent) => {
      event?.preventDefault()
      const settingsUpdate: UserSettingsUpdateRequest = {
        timezone: formData.timezone,
        language: formData.language,
        dateFormat: formData.dateFormat,
        timeFormat: formData.timeFormat,
      }

      const success = await updateSettings(settingsUpdate)
      if (success) {
        setOriginalSettings(settingsUpdate)
      }
    },
    [formData, updateSettings]
  )

  return {
    formData,
    hasChanges,
    handleInputChange,
    handleSubmit,
  }
}
