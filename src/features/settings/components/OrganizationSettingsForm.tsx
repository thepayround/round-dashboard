import { RotateCcw, Save, Loader2 } from 'lucide-react'

import { useOrganizationFormController } from '../hooks/useOrganizationFormController'

import { LoadingSpinner } from '@/shared/ui/LoadingSpinner'
import { Button } from '@/shared/ui/shadcn/button'
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
          <LoadingSpinner size="lg" color="primary" />
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
            variant="ghost"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            variant="default"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
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

