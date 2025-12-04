import { RotateCcw, Save, Loader2, Building2 } from 'lucide-react'

import { useOrganizationFormController } from '../hooks/useOrganizationFormController'

import { DetailCard } from '@/shared/ui/DetailCard'
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner'
import { Button } from '@/shared/ui/shadcn/button'
import { cn } from '@/shared/utils/cn'
import { OrganizationForm } from '@/shared/widgets/forms/OrganizationForm'

interface OrganizationSettingsFormProps {
  className?: string
}

export const OrganizationSettingsForm = ({
  className = '',
}: OrganizationSettingsFormProps) => {
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
      <div className={cn('space-y-6', className)}>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" color="primary" />
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      <DetailCard
        title="Organization Settings"
        icon={<Building2 className="h-4 w-4" />}
        actions={
          <div className="flex items-center gap-2">
            <Button
              onClick={handleReset}
              disabled={isSaving || !isDirty}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              variant="default"
              size="sm"
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
        }
      >
        <p className="text-sm text-muted-foreground mb-6">
          Manage your organization&apos;s basic information and settings
        </p>

        <OrganizationForm
          data={formData}
          onChange={handleFormChange}
          errors={errors}
          showHeader={false}
          showFinancialSettings
          showRegionalSettings
        />
      </DetailCard>
    </div>
  )
}
