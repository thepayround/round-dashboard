import { Trash2, UserX, AlertTriangle } from 'lucide-react'

import { useDangerousActionsModalController } from '../hooks/useDangerousActionsModalController'

import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/shadcn/alert'
import { Button } from '@/shared/ui/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/shadcn/dialog'
import { Input } from '@/shared/ui/shadcn/input'


interface DangerousActionsModalProps {
  isOpen: boolean
  onClose: () => void
  customerId: string
  customerName: string
  currentStatus: string
  onStatusChanged: (newStatus: string) => void
  onCustomerDeleted: () => void
}

export const DangerousActionsModal = ({
  isOpen,
  onClose,
  customerId,
  customerName,
  currentStatus,
  onStatusChanged,
  onCustomerDeleted,
}: DangerousActionsModalProps) => {
  const {
    isDeactivating,
    isDeleting,
    confirmText,
    actionType,
    canDelete,
    startDeactivate,
    startDelete,
    handleConfirmTextChange,
    handleDeactivate,
    handleDelete,
    handleClose,
    reset,
  } = useDangerousActionsModalController({
    customerId,
    customerName,
    currentStatus,
    onStatusChanged,
    onCustomerDeleted,
    onClose,
  })

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Dangerous Actions</span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Irreversible customer actions</p>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {!actionType ? (
            <div className="space-y-6">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  These actions are permanent and cannot be undone. Please proceed with caution.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {currentStatus === 'active' && (
                  <div className="bg-muted/50 border border-border rounded-xl p-6 hover:bg-muted transition-all duration-200">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-2 bg-warning/20 rounded-lg border border-warning/30">
                        <UserX className="w-5 h-5 text-warning" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium tracking-tight text-foreground mb-2">Deactivate Customer</h3>
                        <p className="text-sm text-muted-foreground">
                          Suspend the account. They won&apos;t access services but data is preserved.
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={startDeactivate}
                      variant="secondary"
                      className="w-full bg-warning/20 border-warning/30 text-warning hover:bg-warning/30 hover:text-foreground"
                    >
                      <UserX className="mr-2 h-4 w-4" />
                      Deactivate Account
                    </Button>
                  </div>
                )}

                <div className="bg-muted/50 border border-border rounded-xl p-6 hover:bg-muted transition-all duration-200">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-destructive/20 rounded-lg border border-destructive/30">
                      <Trash2 className="w-5 h-5 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium tracking-tight text-foreground mb-2">Delete Customer</h3>
                      <p className="text-sm text-muted-foreground">
                        Permanently remove all data associated with {customerName}.
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={startDelete}
                    variant="destructive"
                    className="w-full"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Customer
                  </Button>
                </div>
              </div>
            </div>
          ) : actionType === 'deactivate' ? (
            <div className="space-y-6">
              <Alert className="bg-warning/10 border-warning/30">
                <UserX className="h-4 w-4 text-warning" />
                <AlertTitle className="text-foreground">Confirm Deactivation</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  {customerName} will be unable to access services until reactivated.
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-end space-x-3">
                <Button type="button" onClick={reset} variant="ghost">
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleDeactivate}
                  variant="secondary"
                  disabled={isDeactivating}
                  className="bg-warning/20 border-warning/30 text-warning hover:bg-warning/30 hover:text-foreground"
                >
                  {isDeactivating ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Deactivating...
                    </>
                  ) : (
                    <>
                      <UserX className="mr-2 h-4 w-4" />
                      Confirm Deactivation
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <Alert variant="destructive">
                <Trash2 className="h-4 w-4" />
                <AlertTitle>Confirm Deletion</AlertTitle>
                <AlertDescription>
                  Type {customerName} to confirm permanent deletion.
                </AlertDescription>
              </Alert>

              <Input
                type="text"
                value={confirmText}
                onChange={event => handleConfirmTextChange(event.target.value)}
                placeholder={customerName}
                className="w-full"
              />

              <div className="flex items-center justify-end space-x-3">
                <Button type="button" onClick={reset} variant="ghost">
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleDelete}
                  variant="destructive"
                  disabled={isDeleting || !canDelete}
                >
                  {isDeleting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Permanently Delete
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
