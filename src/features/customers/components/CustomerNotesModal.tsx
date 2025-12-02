import { useCustomerNotesModalController } from '../hooks/useCustomerNotesModalController'

import type { CustomerNoteResponse } from '@/shared/services/api/customer.service'
import { FormSheet } from '@/shared/ui/FormSheet'
import { Label } from '@/shared/ui/shadcn/label'
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

  const handleSubmit = async () => {
    await handleSave()
    onClose()
  }

  return (
    <FormSheet
      open={isOpen}
      onOpenChange={onClose}
      title={isEditMode ? 'Edit Note' : 'Add Note'}
      size="sm"
      submitLabel={isEditMode ? 'Save Changes' : 'Save Note'}
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
      hideCancelButton
    >
      <div className="space-y-6">
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
          <Switch id="internal-note" checked={isInternal} onCheckedChange={toggleInternal} />
          <div className="flex flex-col">
            <Label htmlFor="internal-note" className="font-medium cursor-pointer">
              Internal Note
            </Label>
            <span className="text-xs text-muted-foreground">Only visible to team members</span>
          </div>
        </div>
      </div>
    </FormSheet>
  )
}
