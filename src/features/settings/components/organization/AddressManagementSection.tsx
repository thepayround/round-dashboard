import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Edit, X, MapPin } from 'lucide-react'
import React, { useCallback } from 'react'

import { useAddressManagementController } from '../../hooks/useAddressManagementController'

import { AddressStep } from '@/features/onboarding/components/steps/AddressStep'
import type { EnhancedAddressInfo } from '@/features/onboarding/types/onboarding'
import { ActionButton } from '@/shared/ui/ActionButton'
import { Card } from '@/shared/ui/Card'
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner'


export const AddressManagementSection: React.FC = () => {
  const {
    addressFormData,
    setAddressFormData,
    isLoading,
    isSaving,
    isEditing,
    apiError,
    buttonLabel,
    isFormValid,
    handleStartEdit,
    handleCancelEdit,
    handleSave,
  } = useAddressManagementController()

  const handleAddressFormDataChange = useCallback(
    (updated: EnhancedAddressInfo) => setAddressFormData(updated),
    [setAddressFormData]
  )

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <MapPin className="w-16 h-16 text-white/60 mx-auto mb-4" />
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

  const ReadOnlyAddressForm = () => {
    const billing = addressFormData.billingAddress

    if (!billing.name && !billing.addressLine1) {
      return renderEmptyState()
    }

    return (
      <div className="space-y-6">
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

        <AddressStep data={addressFormData} onChange={handleAddressFormDataChange} isPrePopulated readOnly />
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-lg font-medium text-white mb-4">
          Billing <span className="text-primary">Address</span>
        </h1>
        <p className="text-gray-500 dark:text-polar-500 leading-snug mb-4">
          Manage your organization&apos;s billing address for invoicing and tax purposes
        </p>
      </div>

      {apiError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-6"
        >
          <div className="flex items-center space-x-2 text-primary">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{apiError}</span>
          </div>
        </motion.div>
      )}

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
                  <LoadingSpinner size="lg" color="secondary" />
                  <span className="ml-3 text-white/60">Loading address data...</span>
                </div>
              )}

              {!isLoading && isEditing && (
                <AddressStep data={addressFormData} onChange={handleAddressFormDataChange} isPrePopulated />
              )}

              {!isLoading && !isEditing && <ReadOnlyAddressForm />}
            </motion.div>
          </AnimatePresence>
        </Card>
      </motion.div>

      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <ActionButton
            label="Cancel"
            onClick={handleCancelEdit}
            icon={X}
            variant="ghost"
            actionType="general"
            size="sm"
          />

          <ActionButton
            label={buttonLabel}
            onClick={handleSave}
            disabled={!isFormValid || isSaving}
            variant="primary"
            icon={CheckCircle}
            isLoading={isSaving}
            actionType="navigation"
            size="sm"
          />
        </motion.div>
      )}
    </div>
  )
}

