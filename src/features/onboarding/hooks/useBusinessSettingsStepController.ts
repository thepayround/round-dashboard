import { useCallback } from 'react'

import type { BusinessSettings } from '../types/onboarding'

interface UseBusinessSettingsStepControllerParams {
  data: BusinessSettings
  onChange: (data: BusinessSettings) => void
}

interface UseBusinessSettingsStepControllerReturn {
  handleSelectChange: (field: keyof BusinessSettings, value: string) => void
}

export const useBusinessSettingsStepController = ({
  data,
  onChange,
}: UseBusinessSettingsStepControllerParams): UseBusinessSettingsStepControllerReturn => {
  const handleSelectChange = useCallback(
    (field: keyof BusinessSettings, value: string) => {
      onChange({
        ...data,
        [field]: value,
      })
    },
    [data, onChange]
  )

  return { handleSelectChange }
}
