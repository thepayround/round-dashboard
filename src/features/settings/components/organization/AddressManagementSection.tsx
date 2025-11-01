import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Edit, X, MapPin } from 'lucide-react'
import { ActionButton, Card } from '@/shared/components'
import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { AddressStep } from '@/features/onboarding/components/steps/AddressStep'
import { useOrganization } from '@/shared/hooks/api/useOrganization'
import { organizationService } from '@/shared/services/api/organization.service'
import type { EnhancedAddressInfo } from '@/features/onboarding/types/onboarding'
import type { CreateAddressData, UpdateAddressData } from '@/shared/types/api'


export const AddressManagementSection: React.FC = () => {
  const { showSuccess } = useGlobalToast()
  const { getCurrentOrganization } = useOrganization()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const [apiError, setApiError] = useState('')
  const [originalFormData, setOriginalFormData] = useState<EnhancedAddressInfo | null>(null)
  const [addressFormData, setAddressFormData] = useState<EnhancedAddressInfo>({
    billingAddress: {
      name: '',
      street: '',
      addressLine1: '',
      addressLine2: '',
      number: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      addressType: 'billing',
      isPrimary: true,
    },
    shippingAddress: {
      name: '',
      street: '',
      addressLine1: '',
      addressLine2: '',
      number: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      addressType: 'shipping',
      isPrimary: false,
    },
    sameAsBilling: true,
  })

  const loadOrganizationAndAddresses = useCallback(async () => {
    setIsLoading(true)
    setApiError('')
    try {
      const orgResponse = await getCurrentOrganization()

      if (orgResponse.success && orgResponse.data) {
        const org = orgResponse.data
        const orgId = org.organizationId
        setOrganizationId(orgId)

        // Prefill form with organization address data
        if (org.address) {
          const formData = {
            billingAddress: {
              name: org.address.name,
              street: org.address.addressLine1,
              addressLine1: org.address.addressLine1,
              addressLine2: org.address.addressLine2 ?? '',
              number: org.address.number ?? '',
              city: org.address.city,
              state: org.address.state,
              zipCode: org.address.zipCode,
              country: org.address.country,
              addressType: 'billing' as const,
              isPrimary: true,
            },
            shippingAddress: {
              name: '',
              street: '',
              addressLine1: '',
              addressLine2: '',
              number: '',
              city: '',
              state: '',
              zipCode: '',
              country: '',
              addressType: 'shipping' as const,
              isPrimary: false,
            },
            sameAsBilling: true,
          }
          setAddressFormData(formData)
          setOriginalFormData(formData) // Store original for cancel
        }
      } else {
        setApiError('Failed to load organization data')
      }
    } catch (error) {
      setApiError('Failed to load organization data')
    } finally {
      setIsLoading(false)
    }
  }, [getCurrentOrganization])

  // Load organization and addresses
  useEffect(() => {
    loadOrganizationAndAddresses()
  }, [loadOrganizationAndAddresses])

  // Edit mode handlers
  const handleStartEdit = () => {
    setIsEditing(true)
    setApiError('')
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setApiError('')
    // Restore original data
    if (originalFormData) {
      setAddressFormData(originalFormData)
    }
  }

  const handleSaveAddress = async () => {
    setIsSaving(true)
    setApiError('')
    try {
      const {billingAddress} = addressFormData

      // Validate required fields
      if (!billingAddress.name || !billingAddress.addressLine1 || !billingAddress.city || !billingAddress.country) {
        setApiError('Please fill in all required fields')
        return
      }

      if (!organizationId) {
        setApiError('Organization not found')
        return
      }

      // Check if organization already has an address
      const orgResponse = await getCurrentOrganization()
      const hasExistingAddress = orgResponse.success && orgResponse.data?.address

      if (hasExistingAddress) {
        // Update existing organization address
        const updateData: UpdateAddressData = {
          name: billingAddress.name,
          addressLine1: billingAddress.addressLine1,
          addressLine2: billingAddress.addressLine2 ?? '',
          number: billingAddress.number ?? '',
          city: billingAddress.city,
          state: billingAddress.state,
          zipCode: billingAddress.zipCode,
          country: billingAddress.country,
          addressType: 'billing',
          isPrimary: true
        }

        const updateResponse = await organizationService.updateOrganizationAddress(organizationId, updateData)
        if (updateResponse.success) {
          await loadOrganizationAndAddresses()
          setIsEditing(false) // Exit edit mode on success
          showSuccess('Billing address updated successfully')
        } else {
          setApiError('Failed to update billing address')
        }
      } else {
        // Create new organization address
        const createData: CreateAddressData = {
          name: billingAddress.name,
          addressLine1: billingAddress.addressLine1,
          addressLine2: billingAddress.addressLine2 ?? '',
          number: billingAddress.number ?? '',
          city: billingAddress.city,
          state: billingAddress.state,
          zipCode: billingAddress.zipCode,
          country: billingAddress.country,
          addressType: 'billing',
          isPrimary: true,
          organizationId
        }

        const createResponse = await organizationService.createOrganizationAddress(organizationId, createData)
        if (createResponse.success) {
          await loadOrganizationAndAddresses()
          setIsEditing(false) // Exit edit mode on success
          showSuccess('Billing address created successfully')
        } else {
          setApiError('Failed to create billing address')
        }
      }
    } catch (error) {
      setApiError('Failed to save billing address')
    } finally {
      setIsSaving(false)
    }
  }

  // Validation function like in get-started
  const isFormValid = (): boolean => {
    const billing = addressFormData.billingAddress
    return (
      billing.name?.trim() !== '' &&
      billing.addressLine1?.trim() !== '' &&
      billing.number?.trim() !== '' &&
      billing.city?.trim() !== '' &&
      billing.state?.trim() !== '' &&
      billing.zipCode?.trim() !== '' &&
      billing.country !== ''
    )
  }

  const getButtonText = (): string => {
    if (isSaving) return 'Saving...'
    return 'Save Address'
  }

  // Read-only form component with edit header
  const ReadOnlyAddressForm = () => {
    const billing = addressFormData.billingAddress

    if (!billing.name && !billing.addressLine1) {
      return (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white/80 mb-2">No billing address found</h3>
          <p className="text-white/60 mb-6">Add your billing address for invoicing and tax purposes</p>
          <ActionButton
            label="Add Billing Address"
            onClick={handleStartEdit}
            icon={MapPin}
            variant="primary"
            actionType="general"
            size="sm"
          />
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {/* Edit Button */}
        <div className="flex justify-end">
          <ActionButton
            label="Edit Address"
            onClick={handleStartEdit}
            icon={Edit}
            variant="secondary"
            actionType="general"
            size="sm"
          />
        </div>

        {/* Read-only Address Step */}
        <AddressStep
          data={addressFormData}
          onChange={setAddressFormData}
          isPrePopulated
          readOnly
        />
      </div>
    )
  }


  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-medium text-white mb-4">
          Billing{' '}
          <span className="text-primary">
            Address
          </span>
        </h1>
        <p className="text-gray-500 dark:text-polar-500 leading-snug mb-3">
          Manage your organization&apos;s billing address for invoicing and tax purposes
        </p>
      </div>

      {/* API Error Message - Same as get-started */}
      {apiError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-6"
        >
          <div className="flex items-center space-x-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{apiError}</span>
          </div>
        </motion.div>
      )}

      {/* Step Content - Same as get-started */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
        <Card padding="lg">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-[#14BDEA]/30 border-t-[#14BDEA] rounded-full animate-spin" />
                  <span className="ml-3 text-white/60">Loading address data...</span>
                </div>
              )}
              {!isLoading && isEditing && (
                <AddressStep
                  data={addressFormData}
                  onChange={setAddressFormData}
                  isPrePopulated
                />
              )}
              {!isLoading && !isEditing && (
                <ReadOnlyAddressForm />
              )}
            </motion.div>
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Navigation Buttons - Show only in edit mode */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
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
            onClick={handleSaveAddress}
            disabled={!isFormValid() || isSaving}
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