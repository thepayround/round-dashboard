import type { StepComponentProps } from '../../config/types'
import { useOrganizationStepController } from '../../hooks/useOrganizationStepController'
import type { OrganizationInfo, BusinessSettings } from '../../types/onboarding'

import { OrganizationForm } from '@/shared/widgets/forms/OrganizationForm'

interface OrganizationStepProps extends StepComponentProps<OrganizationInfo> {
  errors?: Record<string, string>
  businessSettings?: BusinessSettings
  onBusinessSettingsChange?: (settings: BusinessSettings) => void
}

export const OrganizationStep = ({
  data,
  onChange,
  errors = {},
  isPrePopulated = false,
  businessSettings,
  onBusinessSettingsChange,
}: OrganizationStepProps) => {
  const { formData, handleFormChange } = useOrganizationStepController({
    data,
    onChange,
    businessSettings,
    onBusinessSettingsChange,
  })

  return (
    <div className="max-w-5xl mx-auto">
      <OrganizationForm
        data={formData}
        onChange={handleFormChange}
        errors={errors}
        showHeader
        headerTitle="Organization"
        headerSubtitle={
          isPrePopulated
            ? 'Review and complete your company profile'
            : 'Complete your company profile'
        }
        showFinancialSettings
        showRegionalSettings={false}
      />
    </div>
  )
}
