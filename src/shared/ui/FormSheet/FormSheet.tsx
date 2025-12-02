import * as React from 'react'

import { LoadingSpinner } from '@/shared/ui/LoadingSpinner'
import { Button } from '@/shared/ui/shadcn/button'
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/shadcn/sheet'

export type FormSheetSize = 'sm' | 'default' | 'lg' | 'xl' | 'full'

export interface FormSheetProps {
  /** Whether the sheet is open */
  open: boolean
  /** Callback when sheet should close */
  onOpenChange: (open: boolean) => void
  /** Sheet title */
  title: string
  /** Optional description below title */
  description?: string
  /** Sheet size - determines width */
  size?: FormSheetSize
  /** Content to render in the body */
  children: React.ReactNode
  /** Primary action button text */
  submitLabel?: string
  /** Cancel button text */
  cancelLabel?: string
  /** Called when submit button is clicked */
  onSubmit?: () => void | Promise<void>
  /** Called when cancel button is clicked (defaults to closing sheet) */
  onCancel?: () => void
  /** Whether the form is currently submitting */
  isSubmitting?: boolean
  /** Whether submit button should be disabled */
  isSubmitDisabled?: boolean
  /** Variant for submit button */
  submitVariant?: 'default' | 'destructive'
  /** Hide cancel button */
  hideCancelButton?: boolean
  /** Hide footer entirely (for custom footer) */
  hideFooter?: boolean
  /** Custom footer content (replaces default buttons) */
  customFooter?: React.ReactNode
}

/**
 * Reusable form sheet component for consistent side panel forms across the app.
 *
 * @example Simple form
 * ```tsx
 * <FormSheet
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Add Note"
 *   size="sm"
 *   onSubmit={handleSave}
 *   isSubmitting={saving}
 * >
 *   <div className="space-y-4">
 *     <Input value={note} onChange={setNote} />
 *   </div>
 * </FormSheet>
 * ```
 *
 * @example Complex form with custom labels
 * ```tsx
 * <FormSheet
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Edit Customer"
 *   description="Update customer information"
 *   size="lg"
 *   submitLabel="Save Changes"
 *   cancelLabel="Discard"
 *   onSubmit={handleUpdate}
 *   isSubmitting={updating}
 * >
 *   <CustomerForm data={customer} onChange={setCustomer} />
 * </FormSheet>
 * ```
 *
 * @example Destructive action
 * ```tsx
 * <FormSheet
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Delete Customer"
 *   description="This action cannot be undone."
 *   size="sm"
 *   submitLabel="Delete"
 *   submitVariant="destructive"
 *   onSubmit={handleDelete}
 * >
 *   <p>Are you sure you want to delete {customer.name}?</p>
 * </FormSheet>
 * ```
 */
export const FormSheet: React.FC<FormSheetProps> = ({
  open,
  onOpenChange,
  title,
  description,
  size = 'default',
  children,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  onSubmit,
  onCancel,
  isSubmitting = false,
  isSubmitDisabled = false,
  submitVariant = 'default',
  hideCancelButton = false,
  hideFooter = false,
  customFooter,
}) => {
  const handleClose = () => {
    onOpenChange(false)
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      handleClose()
    }
  }

  const handleSubmit = async () => {
    if (onSubmit) {
      await onSubmit()
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size={size}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>

        <SheetBody>{children}</SheetBody>

        {!hideFooter && (
          <SheetFooter>
            {customFooter ?? (
              <>
                {!hideCancelButton && (
                  <Button variant="secondary" onClick={handleCancel} disabled={isSubmitting}>
                    {cancelLabel}
                  </Button>
                )}
                <Button
                  variant={submitVariant}
                  onClick={handleSubmit}
                  disabled={isSubmitting || isSubmitDisabled}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" inline className="mr-2" />
                      {submitLabel}...
                    </>
                  ) : (
                    submitLabel
                  )}
                </Button>
              </>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
