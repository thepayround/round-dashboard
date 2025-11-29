import { useCustomerNotesModalController } from '../hooks/useCustomerNotesModalController'

import type { CustomerNoteResponse } from '@/shared/services/api/customer.service'
import { Button } from '@/shared/ui/shadcn/button'
import { Label } from '@/shared/ui/shadcn/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/ui/shadcn/sheet'
import { Switch } from '@/shared/ui/shadcn/switch'
import { Textarea } from '@/shared/ui/shadcn/textarea'

interface CustomerNotesModalProps {
  isOpen: boolean
  onClose: () => void
  customerId: string
  customerName: string
  initialNotes: CustomerNoteResponse[]
  initialEditingNoteId?: string | null
}

export const CustomerNotesModal = ({
  isOpen,
  onClose,
  customerId,
  customerName,
  initialNotes,
  initialEditingNoteId,
}: CustomerNotesModalProps) => {
  const {
    noteContent,
    isInternal,
    isLoading,
    handleNoteContentChange,
    toggleInternal,
    handleSave,
  } = useCustomerNotesModalController({
    customerId,
    customerName,
    initialNotes,
    initialEditingNoteId,
  })

  const isEditMode = !!initialEditingNoteId
  const title = isEditMode ? 'Edit Note' : 'Add Note'

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-[550px]">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full pt-6">
          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="note-content">Note</Label>
                <Textarea
                  id="note-content"
                  value={noteContent}
                  onChange={event => handleNoteContentChange(event.target.value)}
                  placeholder="Write a note..."
                  rows={8}
                  className="resize-none"
                />
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  id="internal-note"
                  checked={isInternal}
                  onCheckedChange={toggleInternal}
                />
                <div className="flex flex-col">
                  <Label htmlFor="internal-note" className="font-medium cursor-pointer">
                    Internal Note
                  </Label>
                  <span className="text-xs text-muted-foreground">Only visible to team members</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-auto">
            <Button
              onClick={async () => {
                await handleSave()
                onClose()
              }}
              disabled={isLoading}
              variant="default"
              size="default"
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>{isEditMode ? 'Save Changes' : 'Save Note'}</>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
