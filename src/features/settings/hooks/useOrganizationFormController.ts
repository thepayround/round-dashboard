import { useCallback, useEffect, useMemo, useState } from 'react'

import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { useOrganization } from '@/shared/hooks/api/useOrganization'
import { organizationService } from '@/shared/services/api/organization.service'
import type { OrganizationRequest, OrganizationResponse } from '@/shared/types/api'
import type { OrganizationFormData } from '@/shared/widgets/forms/OrganizationForm'

const defaultFormData: OrganizationFormData = {
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
  fiscalYearStart: 'January',
}

const mapOrganizationToForm = (org: OrganizationResponse | null): OrganizationFormData => ({
  companyName: org?.name ?? '',
  industry: org?.category ?? '',
  companySize: org?.size ?? '',
  organizationType: org?.type ?? '',
  website: org?.website ?? '',
  description: org?.description ?? '',
  revenue: org?.revenue ? String(org.revenue) : '',
  country: org?.country ?? '',
  currency: org?.currency ?? 'USD',
  timeZone: org?.timeZone ?? 'UTC',
  fiscalYearStart: org?.fiscalYearStart ?? 'January',
})

const mapFormToRequest = (
  formData: OrganizationFormData,
  fallback: OrganizationResponse | null
): OrganizationRequest => ({
  name: formData.companyName,
  description: formData.description,
  website: formData.website,
  size: formData.companySize,
  revenue: formData.revenue ? parseFloat(formData.revenue) : 0,
  category: formData.industry,
  type: formData.organizationType,
  registrationNumber: fallback?.registrationNumber ?? `REG-${Date.now()}`,
  currency: formData.currency,
  timeZone: formData.timeZone,
  country: formData.country,
  userId: fallback?.userId ?? '',
  fiscalYearStart: formData.fiscalYearStart,
})

export const useOrganizationFormController = () => {
  const { getCurrentOrganization } = useOrganization()
  const { showSuccess, showError } = useGlobalToast()

  const [formData, setFormData] = useState<OrganizationFormData>(defaultFormData)
  const [initialData, setInitialData] = useState<OrganizationFormData>(defaultFormData)
  const [organizationMeta, setOrganizationMeta] = useState<OrganizationResponse | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const loadOrganization = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await getCurrentOrganization()

      if (response.success && response.data) {
        const mapped = mapOrganizationToForm(response.data)
        setFormData(mapped)
        setInitialData(mapped)
        setOrganizationMeta(response.data)
        setErrors({})
      }
    } catch (error) {
      showError('Failed to load organization data')
    } finally {
      setIsLoading(false)
    }
  }, [getCurrentOrganization, showError])

  useEffect(() => {
    loadOrganization()
  }, [loadOrganization])

  const handleFormChange = useCallback((updated: OrganizationFormData) => {
    setFormData(updated)
  }, [])

  const validateForm = useCallback(
    (data: OrganizationFormData = formData) => {
      const nextErrors: Record<string, string> = {}

      if (!data.companyName.trim()) {
        nextErrors.companyName = 'Company name is required'
      }
      if (!data.industry) {
        nextErrors.industry = 'Industry is required'
      }
      if (!data.companySize) {
        nextErrors.companySize = 'Company size is required'
      }
      if (!data.organizationType) {
        nextErrors.organizationType = 'Organization type is required'
      }
      if (!data.country) {
        nextErrors.country = 'Country is required'
      }

      if (data.website?.trim()) {
        try {
          new URL(data.website)
        } catch {
          nextErrors.website = 'Please enter a valid URL'
        }
      }

      if (data.revenue?.trim()) {
        const parsed = Number(data.revenue)
        if (Number.isNaN(parsed) || parsed < 0) {
          nextErrors.revenue = 'Please enter a valid revenue amount'
        }
      }

      setErrors(nextErrors)
      return Object.keys(nextErrors).length === 0
    },
    [formData]
  )

  const isDirty = useMemo(() => JSON.stringify(formData) !== JSON.stringify(initialData), [formData, initialData])

  const handleReset = useCallback(() => {
    setFormData(initialData)
    setErrors({})
  }, [initialData])

  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      showError('Please fix the errors in the form')
      return
    }

    try {
      setIsSaving(true)
      const payload = mapFormToRequest(formData, organizationMeta)
      const organizationId = organizationMeta?.organizationId
      if (organizationId) {
        const response = await organizationService.update(organizationId, payload)
        if (!response.success) {
          throw new Error(response.error ?? 'Failed to save organization settings')
        }

        const updatedMeta = organizationMeta
          ? ({
              ...organizationMeta,
              name: payload.name,
              description: payload.description,
              website: payload.website,
              size: payload.size,
              revenue: payload.revenue,
              category: payload.category,
              type: payload.type,
              registrationNumber: payload.registrationNumber,
              currency: payload.currency,
              timeZone: payload.timeZone,
              country: payload.country,
              fiscalYearStart: payload.fiscalYearStart,
            } satisfies OrganizationResponse)
          : null

        if (updatedMeta) {
          const mapped = mapOrganizationToForm(updatedMeta)
          setFormData(mapped)
          setInitialData(mapped)
          setOrganizationMeta(updatedMeta)
        } else {
          setInitialData(formData)
        }

        showSuccess('Organization settings saved successfully')
        return
      }

      const response = await organizationService.create(payload)

      if (response.success && response.data) {
        const mapped = mapOrganizationToForm(response.data)
        setFormData(mapped)
        setInitialData(mapped)
        setOrganizationMeta(response.data)
        showSuccess('Organization settings saved successfully')
      } else {
        throw new Error(response.error ?? 'Failed to save organization settings')
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to save organization settings')
    } finally {
      setIsSaving(false)
    }
  }, [formData, organizationMeta, showError, showSuccess, validateForm])

  return {
    formData,
    errors,
    isLoading,
    isSaving,
    isDirty,
    handleFormChange,
    handleSave,
    handleReset,
  }
}

