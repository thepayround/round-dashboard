import { RotateCcw, Save } from 'lucide-react'

import { useOrganizationFormController } from '../hooks/useOrganizationFormController'

import { Button } from '@/shared/ui/Button'
import { OrganizationForm } from '@/shared/widgets/forms/OrganizationForm'

interface OrganizationSettingsFormProps {
  className?: string
}

export const OrganizationSettingsForm = ({ className = '' }: OrganizationSettingsFormProps) => {
  const {
    formData,
    errors,
    isLoading,
    isSaving,
    isDirty,
    handleFormChange,
    handleSave,
    handleReset,
  } = useOrganizationFormController()

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Organization Settings</h2>
          <p className="text-gray-400 text-sm mt-1">
            Manage your organization&apos;s basic information and settings
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={handleReset}
            disabled={isSaving || !isDirty}
            icon={RotateCcw}
            variant="ghost"
            size="sm"
          >
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            loading={isSaving}
            icon={Save}
            iconPosition="left"
            variant="primary"
            size="sm"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <OrganizationForm
        data={formData}
        onChange={handleFormChange}
        errors={errors}
        showHeader={false}
        showFinancialSettings
        showRegionalSettings
      />
    </div>
  )
}

