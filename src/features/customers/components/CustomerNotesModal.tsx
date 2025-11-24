import { useCustomerNotesModalController } from '../hooks/useCustomerNotesModalController'

import type { CustomerNoteResponse } from '@/shared/services/api/customer.service'
import { Button, PlainButton } from '@/shared/ui/Button'
import { Textarea } from '@/shared/ui/Textarea'
import { Drawer } from '@/shared/widgets/Drawer'


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
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className="md:w-[550px] lg:w-[550px]"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="note-content" className="text-sm font-medium text-white/80">
                Note
              </label>
              <Textarea
                id="note-content"
                value={noteContent}
                onChange={event => handleNoteContentChange(event.target.value)}
                placeholder="Write a note..."
                rows={8}
                className="resize-none bg-white/5 border-white/10 focus:border-primary/50 focus:ring-0 focus:bg-white/5 rounded-lg text-white placeholder:text-white/60"
              />
            </div>

            <div className="flex items-center space-x-3">
              <PlainButton
                onClick={toggleInternal}
                className="flex items-center space-x-3 cursor-pointer group"
                unstyled
              >
                <div className={`w-10 h-6 rounded-full relative transition-colors duration-200 border border-transparent ${isInternal ? 'bg-primary' : 'bg-white/10 group-hover:bg-white/20'}`}>
                  <div className={`absolute top-1 left-1 w-3.5 h-3.5 rounded-full bg-white transition-transform duration-200 ${isInternal ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white/90 select-none">Internal Note</span>
                  <span className="text-xs text-white/50 select-none">Only visible to team members</span>
                </div>
              </PlainButton>
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
            variant="primary"
            isLoading={isLoading}
            size="md"
            className="w-full sm:w-auto"
          >
            {isEditMode ? 'Save Changes' : 'Save Note'}
          </Button>
        </div>
      </div>
    </Drawer>
  )
}
