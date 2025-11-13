import { useCallback } from 'react'
import type { ChangeEvent } from 'react'

import type { UserInfo } from '../types/onboarding'

interface UseUserInfoStepControllerParams {
  data: UserInfo
  onChange: (data: UserInfo) => void
}

interface UseUserInfoStepControllerReturn {
  handleInputChange: (field: keyof UserInfo) => (event: ChangeEvent<HTMLInputElement>) => void
}

export const useUserInfoStepController = ({
  data,
  onChange,
}: UseUserInfoStepControllerParams): UseUserInfoStepControllerReturn => {
  const handleInputChange = useCallback(
    (field: keyof UserInfo) => (event: ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...data,
        [field]: event.target.value,
      })
    },
    [data, onChange]
  )

  return {
    handleInputChange,
  }
}
