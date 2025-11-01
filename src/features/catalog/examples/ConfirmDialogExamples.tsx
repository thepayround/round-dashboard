/**
 * ConfirmDialog Integration Examples
 * 
 * This file demonstrates how to integrate ConfirmDialog into various
 * catalog pages following industry best practices.
 */

import { Archive, AlertTriangle } from 'lucide-react'
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog'
import { useGlobalToast } from '@/shared/contexts/ToastContext'
import type { Plan, Addon, Charge, Coupon } from '../types/catalog.types'

/**
 * Example 1: Plans Page with Delete Confirmation
 */
export const PlansPageExample = () => {
  const confirmDelete = useConfirmDialog()
  const { showSuccess, showError } = useGlobalToast()

  const _handleDeletePlan = (plan: Plan) => {
    confirmDelete.show({
      title: 'Delete Plan',
      message: `Are you sure you want to delete "${plan.name}"? This action cannot be undone and will affect any active subscriptions using this plan.`,
      confirmLabel: 'Delete Plan',
      variant: 'danger',
      onConfirm: async () => {
        try {
          // await planService.delete(plan.id)
          showSuccess(`${plan.name} has been deleted`)
          // Refresh plans list
        } catch (error) {
          showError(error instanceof Error ? error.message : 'Failed to delete plan')
        }
      }
    })
  }

  const _handleArchivePlan = (plan: Plan) => {
    confirmDelete.show({
      title: 'Archive Plan',
      message: `Archive "${plan.name}"? Archived plans won't be available for new subscriptions but existing subscriptions will continue.`,
      confirmLabel: 'Archive',
      variant: 'warning',
      icon: Archive,
      onConfirm: async () => {
        try {
          // await planService.archive(plan.id)
          showSuccess(`${plan.name} has been archived`)
        } catch (error) {
          showError(error instanceof Error ? error.message : 'Failed to archive plan')
        }
      }
    })
  }

  return (
    <>
      {/* Your plans list/grid */}
      {/* <PlanCard onDelete={handleDeletePlan} onArchive={handleArchivePlan} /> */}
      
      {/* Dialog component */}
      <confirmDelete.Dialog />
    </>
  )
}

/**
 * Example 2: Addons Page with Multiple Actions
 */
export const AddonsPageExample = () => {
  const confirmAction = useConfirmDialog()
  const { showSuccess, showError } = useGlobalToast()

  const _handleDeleteAddon = (addon: Addon) => {
    confirmAction.show({
      title: 'Delete Add-on',
      message: `Delete "${addon.name}"? This will remove it from all plans and affect active subscriptions.`,
      confirmLabel: 'Delete Add-on',
      variant: 'danger',
      onConfirm: async () => {
        try {
          // await addonService.delete(addon.id)
          showSuccess(`${addon.name} has been deleted`)
        } catch (error) {
          showError(error instanceof Error ? error.message : 'Failed to delete add-on')
        }
      }
    })
  }

  return (
    <>
      {/* Your addons list */}
      <confirmAction.Dialog />
    </>
  )
}

/**
 * Example 3: Charges Page with Warning
 */
export const ChargesPageExample = () => {
  const confirmDelete = useConfirmDialog()
  const { showSuccess, showError } = useGlobalToast()

  const _handleDeleteCharge = (charge: Charge) => {
    // Check if charge is in use
    const isInUse = charge.status === 'active' // Example check
    
    confirmDelete.show({
      title: isInUse ? 'Warning: Charge In Use' : 'Delete Charge',
      message: isInUse 
        ? `"${charge.name}" is currently in use. Deleting it will affect active subscriptions. Are you sure?`
        : `Delete "${charge.name}"? This action cannot be undone.`,
      confirmLabel: 'Delete Charge',
      variant: isInUse ? 'warning' : 'danger',
      icon: isInUse ? AlertTriangle : undefined,
      onConfirm: async () => {
        try {
          // await chargeService.delete(charge.id)
          showSuccess(`${charge.name} has been deleted`)
        } catch (error) {
          showError(error instanceof Error ? error.message : 'Failed to delete charge')
        }
      }
    })
  }

  return (
    <>
      {/* Your charges list */}
      <confirmDelete.Dialog />
    </>
  )
}

/**
 * Example 4: Coupons Page with Neutral Confirmation
 */
export const CouponsPageExample = () => {
  const confirmAction = useConfirmDialog()
  const { showSuccess, showError } = useGlobalToast()

  const _handleExpireCoupon = (coupon: Coupon) => {
    confirmAction.show({
      title: 'Expire Coupon',
      message: `Mark "${coupon.name}" as expired? Users will no longer be able to apply this coupon.`,
      confirmLabel: 'Expire Coupon',
      cancelLabel: 'Keep Active',
      variant: 'neutral',
      onConfirm: async () => {
        try {
          // await couponService.expire(coupon.id)
          showSuccess(`Coupon ${coupon.name} has been expired`)
        } catch (error) {
          showError(error instanceof Error ? error.message : 'Failed to expire coupon')
        }
      }
    })
  }

  const _handleDeleteCoupon = (coupon: Coupon) => {
    confirmAction.show({
      title: 'Delete Coupon',
      message: `Delete "${coupon.name}"? This will remove it permanently from the system.`,
      confirmLabel: 'Delete Coupon',
      variant: 'danger',
      onConfirm: async () => {
        try {
          // await couponService.delete(coupon.id)
          showSuccess(`Coupon ${coupon.name} has been deleted`)
        } catch (error) {
          showError(error instanceof Error ? error.message : 'Failed to delete coupon')
        }
      }
    })
  }

  return (
    <>
      {/* Your coupons list */}
      <confirmAction.Dialog />
    </>
  )
}

/**
 * Example 5: Success Variant Usage
 */
export const SuccessConfirmationExample = () => {
  const confirmAction = useConfirmDialog()
  const { showSuccess } = useGlobalToast()

  const _handlePublishPlan = (plan: Plan) => {
    confirmAction.show({
      title: 'Publish Plan',
      message: `Publish "${plan.name}"? It will become available for new subscriptions immediately.`,
      confirmLabel: 'Publish Now',
      variant: 'success',
      onConfirm: async () => {
        try {
          // await planService.publish(plan.id)
          showSuccess(`${plan.name} is now published`)
        } catch (error) {
          // Handle error
        }
      }
    })
  }

  return null /* Implementation */
}

/**
 * Example 6: Custom Icon Usage
 */
export const CustomIconExample = () => {
  const confirmAction = useConfirmDialog()

  const _handleArchive = (_item: Plan | Addon | Charge | Coupon) => {
    confirmAction.show({
      title: 'Archive Item',
      message: 'Move this item to the archive?',
      confirmLabel: 'Archive',
      variant: 'warning',
      icon: Archive, // Custom icon override
      onConfirm: async () => {
        // Handle archive
      }
    })
  }

  return null /* Implementation */
}
