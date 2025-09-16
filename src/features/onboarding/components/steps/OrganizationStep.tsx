import { useMemo } from 'react'
import type { OrganizationFormData } from '@/shared/components/forms/OrganizationForm';
import { OrganizationForm } from '@/shared/components/forms/OrganizationForm'
import type { OrganizationInfo, BusinessSettings } from '../../types/onboarding'

interface OrganizationStepProps {
  data: OrganizationInfo
  onChange: (data: OrganizationInfo) => void
  errors?: Record<string, string>
  isPrePopulated?: boolean
  businessSettings?: BusinessSettings
}





export const OrganizationStep = ({
  data,
  onChange,
  errors = {},
  isPrePopulated = false,
  businessSettings,
}: OrganizationStepProps) => {
  // Convert onboarding data format to shared form format
  const formData = useMemo((): OrganizationFormData => ({
    companyName: data.companyName,
    industry: data.industry,
    companySize: data.companySize,
    organizationType: data.organizationType ?? '',
    website: data.website,
    description: data.description ?? '',
    revenue: data.revenue ?? '',
    country: data.country,
    currency: data.currency ?? '',
    timeZone: businessSettings?.timezone ?? '',
    fiscalYearStart: businessSettings?.fiscalYearStart ?? '',
    registrationNumber: data.registrationNumber ?? '',
    taxId: data.taxId ?? ''
  }), [data, businessSettings])

  // Handle form changes and convert back to onboarding format
  const handleFormChange = (formData: OrganizationFormData) => {
    onChange({
      companyName: formData.companyName,
      industry: formData.industry,
      companySize: formData.companySize,
      organizationType: formData.organizationType,
      website: formData.website,
      description: formData.description,
      revenue: formData.revenue,
      country: formData.country,
      currency: formData.currency,
      registrationNumber: formData.registrationNumber,
      taxId: formData.taxId
    })
  }

  return (
    <div className="max-w-5xl mx-auto">
      <OrganizationForm
        data={formData}
        onChange={handleFormChange}
        errors={errors}
        showHeader
        headerTitle="Organization"
        headerSubtitle={isPrePopulated
          ? 'Review and complete your company profile'
          : 'Complete your company profile'}
        showFinancialSettings
        showRegionalSettings
      />
    </div>
  )
}
