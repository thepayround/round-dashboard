import { useCallback, useMemo } from 'react'

import type { OrganizationInfo, BusinessSettings } from '../types/onboarding'

import type { OrganizationFormData } from '@/shared/widgets/forms/OrganizationForm'

interface UseOrganizationStepControllerParams {
  data: OrganizationInfo
  onChange: (data: OrganizationInfo) => void
  businessSettings?: BusinessSettings
  onBusinessSettingsChange?: (settings: BusinessSettings) => void
}

interface UseOrganizationStepControllerReturn {
  formData: OrganizationFormData
  handleFormChange: (formData: OrganizationFormData) => void
}

export const useOrganizationStepController = ({
  data,
  onChange,
  businessSettings,
  onBusinessSettingsChange,
}: UseOrganizationStepControllerParams): UseOrganizationStepControllerReturn => {
  const formData = useMemo<OrganizationFormData>(
    () => ({
      companyName: data.companyName,
      industry: data.industry,
      companySize: data.companySize,
      organizationType: data.organizationType ?? '',
      website: data.website,
      description: data.description ?? '',
      revenue: data.revenue ?? '',
      country: data.country,
      currency: data.currency ?? 'USD',
      timeZone: businessSettings?.timezone ?? data.timeZone ?? 'UTC',
      fiscalYearStart: businessSettings?.fiscalYearStart ?? 'January',
    }),
    [businessSettings?.fiscalYearStart, businessSettings?.timezone, data]
  )

  const handleFormChange = useCallback(
    (updatedForm: OrganizationFormData) => {
      onChange({
        ...data,
        companyName: updatedForm.companyName,
        industry: updatedForm.industry,
        companySize: updatedForm.companySize,
        organizationType: updatedForm.organizationType,
        website: updatedForm.website,
        description: updatedForm.description,
        revenue: updatedForm.revenue,
        country: updatedForm.country,
        currency: updatedForm.currency,
        timeZone: updatedForm.timeZone,
      })

      onBusinessSettingsChange?.({
        timezone: updatedForm.timeZone,
        fiscalYearStart: updatedForm.fiscalYearStart,
      })
    },
    [data, onChange, onBusinessSettingsChange]
  )

  return {
    formData,
    handleFormChange,
  }
}
