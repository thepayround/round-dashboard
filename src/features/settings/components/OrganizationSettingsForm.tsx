import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Edit, X } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'

import { ActionButton } from '@/shared/components'
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
  const [isEditing, setIsEditing] = useState(false)
  const [organizationData, setOrganizationData] = useState<OrganizationFormData>({
    companyName: '',
    industry: '',
    companySize: '',
    organizationType: '',
    website: '',
    description: '',
    revenue: '',
    country: '',
    currency: '',
    timeZone: 'UTC',
    fiscalYearStart: '',
    registrationNumber: '',
    taxId: ''
  })
  const [originalFormData, setOriginalFormData] = useState<OrganizationFormData | null>(null)
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

        const formData: OrganizationFormData = {
          companyName: org.name ?? '',
          industry: org.category ?? '',
          companySize: org.size ?? '',
          organizationType: org.type ?? '',
          website: org.website ?? '',
          description: org.description ?? '',
          revenue: org.revenue?.toString() ?? '',
          country: org.country ?? '',
          currency: org.currency ?? '',
          timeZone: org.timeZone ?? 'UTC',
          fiscalYearStart: org.fiscalYearStart ?? '',
          registrationNumber: org.registrationNumber ?? '',
          taxId: org.taxId ?? ''
        }

        setOrganizationData(formData)
        setOriginalFormData(formData) // Store original for cancel
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

  // Edit mode handlers
  const handleStartEdit = () => {
    setIsEditing(true)
    setErrors({})
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setErrors({})
    // Restore original data
    if (originalFormData) {
      setOrganizationData(originalFormData)
    }
  }

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
        // Add Industry field as backend expects it (capital I)
        Industry: organizationData.industry,
        type: organizationData.organizationType,
        registrationNumber: cachedOrgData?.registrationNumber ?? `REG-${Date.now()}`,
        currency: organizationData.currency,
        timeZone: organizationData.timeZone,
        country: organizationData.country,
        userId: cachedOrgData?.userId ?? '',
        fiscalYearStart: organizationData.fiscalYearStart
      } as OrganizationRequest & { Industry: string }

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

        // Reload data and exit edit mode
        await loadOrganizationData()
        setIsEditing(false)
      } else {
        throw new Error(result?.error ?? 'Failed to save organization')
      }
    } catch (error) {
      console.error('Save error:', error)
      showError(error instanceof Error ? error.message : 'Failed to save organization settings')
    } finally {
      setIsSaving(false)
    }
  }, [validateForm, organizationData, cachedOrgData, showError, showSuccess, loadOrganizationData])

  const getButtonText = (): string => {
    if (isSaving) return 'Saving...'
    return 'Save Changes'
  }

  // Read-only form component with edit header
  const ReadOnlyForm = () => (
      <div className="space-y-6">
        {/* Edit Button */}
        <div className="flex justify-end">
          <ActionButton
            label="Edit Settings"
            onClick={handleStartEdit}
            icon={Edit}
            variant="secondary"
            actionType="general"
            size="sm"
          />
        </div>

        {/* Read-only Organization Form */}
        <OrganizationForm
          data={organizationData}
          onChange={setOrganizationData}
          errors={errors}
          showHeader={false}
          showFinancialSettings
          showRegionalSettings
          readOnly
        />
      </div>
    )

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border border-[#14BDEA]/30 border-t-[#14BDEA] rounded-full animate-spin" />
          <span className="ml-3 text-white/60">Loading organization data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Error Message */}
      {Object.keys(errors).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-red-500/10 border border-red-500/20"
        >
          <div className="flex items-center space-x-2 text-[#D417C8]">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-normal">Please fix the errors in the form</span>
          </div>
        </motion.div>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {isEditing ? (
            <OrganizationForm
              data={organizationData}
              onChange={setOrganizationData}
              errors={errors}
              showHeader={false}
              showFinancialSettings
              showRegionalSettings
            />
          ) : (
            <ReadOnlyForm />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons - Show only in edit mode */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between pt-4"
        >
          {/* Cancel Button */}
          <ActionButton
            label="Cancel"
            onClick={handleCancelEdit}
            icon={X}
            variant="ghost"
            actionType="general"
            size="sm"
          />

          {/* Save Button */}
          <ActionButton
            label={getButtonText()}
            onClick={handleSave}
            disabled={isSaving}
            variant="primary"
            icon={CheckCircle}
            loading={isSaving}
            actionType="navigation"
            size="sm"
          />
        </motion.div>
      )}
    </div>
  )
}
