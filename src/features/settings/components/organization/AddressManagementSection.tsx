import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, X, MapPin } from 'lucide-react'
import React, { useCallback } from 'react'

import { useAddressManagementController } from '../../hooks/useAddressManagementController'

import { AddressStep } from '@/features/onboarding/components/steps/AddressStep'
import type { EnhancedAddressInfo } from '@/features/onboarding/types/onboarding'
import { DetailCard } from '@/shared/ui/DetailCard'
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner'
import { Alert, AlertDescription } from '@/shared/ui/shadcn/alert'
import { Button } from '@/shared/ui/shadcn/button'

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
      <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
      <h3 className="text-sm font-medium text-foreground mb-2">
        No billing address found
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Add your billing address for invoicing and tax purposes
      </p>
      <Button onClick={handleStartEdit} variant="default" size="sm">
        <MapPin className="h-4 w-4 mr-2" />
        Add Billing Address
      </Button>
    </div>
  )

  const ReadOnlyAddressForm = () => {
    const billing = addressFormData.billingAddress

    if (!billing.name && !billing.addressLine1) {
      return renderEmptyState()
    }

    return (
      <AddressStep
        data={addressFormData}
        onChange={handleAddressFormDataChange}
        isPrePopulated
        readOnly
      />
    )
  }

  return (
    <div className="space-y-6">
      {apiError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}

      <DetailCard
        title="Billing Address"
        icon={<MapPin className="h-4 w-4" />}
        onEdit={!isEditing ? handleStartEdit : undefined}
      >
        <p className="text-sm text-muted-foreground mb-6">
          Manage your organization&apos;s billing address for invoicing and tax
          purposes
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={isEditing ? 'editing' : 'readonly'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-muted-foreground">
                  Loading address data...
                </span>
              </div>
            )}

            {!isLoading && isEditing && (
              <AddressStep
                data={addressFormData}
                onChange={handleAddressFormDataChange}
                isPrePopulated
              />
            )}

            {!isLoading && !isEditing && <ReadOnlyAddressForm />}
          </motion.div>
        </AnimatePresence>

        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between pt-6 mt-6 border-t border-border"
          >
            <Button onClick={handleCancelEdit} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              disabled={!isFormValid || isSaving}
              variant="default"
              size="sm"
            >
              {!isSaving && <CheckCircle className="h-4 w-4 mr-2" />}
              {buttonLabel}
            </Button>
          </motion.div>
        )}
      </DetailCard>
    </div>
  )
}
