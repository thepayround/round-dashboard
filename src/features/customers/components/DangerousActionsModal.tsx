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
                  <div className="bg-white/5 border border-border rounded-xl p-6 hover:bg-white/10 transition-all duration-200">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-2 bg-orange-500/20 rounded-lg border border-orange-500/30">
                        <UserX className="w-5 h-5 text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium tracking-tight text-white mb-2">Deactivate Customer</h3>
                        <p className="text-sm text-muted-foreground">
                          Suspend the account. They won&apos;t access services but data is preserved.
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={startDeactivate}
                      variant="secondary"
                      className="w-full bg-orange-500/20 border-orange-500/30 text-orange-400 hover:bg-orange-500/30 hover:text-white"
                    >
                      <UserX className="mr-2 h-4 w-4" />
                      Deactivate Account
                    </Button>
                  </div>
                )}

                <div className="bg-white/5 border border-border rounded-xl p-6 hover:bg-white/10 transition-all duration-200">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-red-500/20 rounded-lg border border-red-500/30">
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium tracking-tight text-white mb-2">Delete Customer</h3>
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
              <Alert className="bg-amber-500/10 border-amber-500/30">
                <UserX className="h-4 w-4 text-amber-400" />
                <AlertTitle className="text-amber-50">Confirm Deactivation</AlertTitle>
                <AlertDescription className="text-amber-50">
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
                  className="bg-orange-500/20 border-orange-500/30 text-orange-400 hover:bg-orange-500/30 hover:text-white"
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
