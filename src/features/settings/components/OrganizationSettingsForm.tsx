import { Save } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'

import { Button } from '@/shared/components/Button'
import type { OrganizationFormData } from '@/shared/components/forms/OrganizationForm';
import { OrganizationForm } from '@/shared/components/forms/OrganizationForm'
import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { useOrganization } from '@/shared/hooks/api/useOrganization'
import { organizationService } from '@/shared/services/api/organization.service'
import type { OrganizationResponse, OrganizationRequest } from '@/shared/types/api'

interface OrganizationSettingsFormProps {
  className?: string
}

export const OrganizationSettingsForm = ({ className = '' }: OrganizationSettingsFormProps) => {
  const { getCurrentOrganization } = useOrganization()
  const { showSuccess, showError } = useGlobalToast()

  // State
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [organizationData, setOrganizationData] = useState<OrganizationFormData>({
    companyName: '',
    industry: '',
    companySize: '',
    organizationType: '',
    website: '',
    description: '',
    revenue: '',
    country: '',
    currency: 'USD',
    timeZone: 'UTC',
    fiscalYearStart: 'January'
  })
  const [cachedOrgData, setCachedOrgData] = useState<OrganizationResponse | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load organization data
  const loadOrganizationData = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await getCurrentOrganization()
      
      if (response.success && response.data) {
        const org = response.data
        setCachedOrgData(org)
        
        setOrganizationData({
          companyName: org.name ?? '',
          industry: org.category ?? '',
          companySize: org.size ?? '',
          organizationType: org.type ?? '',
          website: org.website ?? '',
          description: org.description ?? '',
          revenue: org.revenue?.toString() ?? '',
          country: org.country ?? '',
          currency: org.currency ?? 'USD',
          timeZone: org.timeZone ?? 'UTC',
          fiscalYearStart: org.fiscalYearStart ?? 'January'
        })
      }
    } catch (error) {
      console.error('Failed to load organization data:', error)
      showError('Failed to load organization data')
    } finally {
      setIsLoading(false)
    }
  }, [getCurrentOrganization, showError])

  // Load data on mount
  useEffect(() => {
    loadOrganizationData()
  }, [loadOrganizationData])

  // Form validation
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {}

    if (!organizationData.companyName.trim()) {
      newErrors.companyName = 'Company name is required'
    }
    if (!organizationData.industry) {
      newErrors.industry = 'Industry is required'
    }
    if (!organizationData.companySize) {
      newErrors.companySize = 'Company size is required'
    }
    if (!organizationData.organizationType) {
      newErrors.organizationType = 'Organization type is required'
    }
    if (!organizationData.country) {
      newErrors.country = 'Country is required'
    }

    // Validate website URL if provided
    if (organizationData.website?.trim()) {
      try {
        new URL(organizationData.website)
      } catch {
        newErrors.website = 'Please enter a valid URL'
      }
    }

    // Validate revenue if provided
    if (organizationData.revenue?.trim()) {
      const revenue = parseFloat(organizationData.revenue)
      if (isNaN(revenue) || revenue < 0) {
        newErrors.revenue = 'Please enter a valid revenue amount'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [organizationData])

  // Save organization data
  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      showError('Please fix the errors in the form')
      return
    }

    try {
      setIsSaving(true)
      
      const orgRequest: OrganizationRequest = {
        name: organizationData.companyName,
        description: organizationData.description,
        website: organizationData.website,
        size: organizationData.companySize,
        revenue: organizationData.revenue ? parseFloat(organizationData.revenue) : 0,
        category: organizationData.industry,
        type: organizationData.organizationType,
        registrationNumber: cachedOrgData?.registrationNumber ?? `REG-${Date.now()}`,
        currency: organizationData.currency,
        timeZone: organizationData.timeZone,
        country: organizationData.country,
        userId: cachedOrgData?.userId ?? '',
        fiscalYearStart: organizationData.fiscalYearStart
      }

      let result
      if (cachedOrgData?.organizationId) {
        // Update existing organization
        result = await organizationService.update(cachedOrgData.organizationId, orgRequest)
      } else {
        // Create new organization (shouldn't happen in settings, but handle it)
        result = await organizationService.create(orgRequest)
      }

      if (result?.success) {
        showSuccess('Organization settings saved successfully')
        
        // Update cached data
        if (result.data) {
          setCachedOrgData(result.data)
        }
      } else {
        throw new Error(result?.error ?? 'Failed to save organization')
      }
    } catch (error) {
      console.error('Save error:', error)
      showError(error instanceof Error ? error.message : 'Failed to save organization settings')
    } finally {
      setIsSaving(false)
    }
  }, [validateForm, organizationData, cachedOrgData, showError, showSuccess])

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
        
        <Button
          onClick={handleSave}
          disabled={isSaving}
          loading={isSaving}
          icon={Save}
          iconPosition="left"
          variant="primary"
          size="sm"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Organization Form */}
      <OrganizationForm
        data={organizationData}
        onChange={setOrganizationData}
        errors={errors}
        showHeader={false}
        showFinancialSettings
        showRegionalSettings
      />

    </div>
  )
}
