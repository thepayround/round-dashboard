import { useCallback } from 'react'

import type { BillingSettings } from '../types/onboarding'

interface UseBillingStepControllerParams {
  data: BillingSettings
  onChange: (data: BillingSettings) => void
}

interface UseBillingStepControllerReturn {
  isConnected: boolean
  provider?: string
  handleConnect: () => void
}

export const useBillingStepController = ({
  data,
  onChange,
}: UseBillingStepControllerParams): UseBillingStepControllerReturn => {
  const handleConnect = useCallback(() => {
    onChange({
      ...data,
      isConnected: true,
      provider: 'stripe',
    })
  }, [data, onChange])

  return {
    isConnected: data.isConnected,
    provider: data.provider,
    handleConnect,
  }
}
