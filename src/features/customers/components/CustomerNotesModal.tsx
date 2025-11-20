import {
  Plus,
  MessageSquare,
  User,
  Calendar,
  Edit3,
  Trash2,
  Save,
  RotateCcw,
} from 'lucide-react'

import { useCustomerNotesModalController } from '../hooks/useCustomerNotesModalController'

import type { CustomerNoteResponse } from '@/shared/services/api/customer.service'
import { EmptyState, IconBox } from '@/shared/ui'
import { Button, IconButton } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { Textarea } from '@/shared/ui/Textarea'
import { cn } from '@/shared/utils/cn'
import { ConfirmDialog } from '@/shared/widgets/ConfirmDialog'


interface CustomerNotesModalProps {
  isOpen: boolean
  onClose: () => void
  customerId: string
  customerName: string
  initialNotes: CustomerNoteResponse[]
}

export const CustomerNotesModal = ({
  isOpen,
  onClose,
  customerId,
  customerName,
  initialNotes,
}: CustomerNotesModalProps) => {
  const {
    notes,
    newNoteContent,
    isInternal,
    editingNoteId,
    editContent,
    isLoading,
    isAdding,
    showConfirmDelete,
    formatDate,
    handleNewNoteChange,
    toggleInternal,
    handleAddNote,
    startEditing,
    cancelEditing,
    handleEditContentChange,
    handleSaveEdit,
    requestDeleteNote,
    confirmDeleteNote,
    cancelDelete,
  } = useCustomerNotesModalController({
    customerId,
    customerName,
    initialNotes,
  })

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Customer Notes"
        subtitle={`Notes for ${customerName}`}
        icon={MessageSquare}
        size="lg"
      >
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex items-start space-x-3">
              <IconBox icon={MessageSquare} color="primary" className="border border-primary/30 rounded-xl bg-primary/10" />
              <div>
                <h3 className="text-sm font-normal tracking-tight text-white mb-1">
                  Add a new internal note
                </h3>
                <p className="text-xs text-white/60">Share context with your team. Customers cannot see internal notes.</p>
              </div>
            </div>

            <div className="space-y-4">
              <Textarea
                value={newNoteContent}
                onChange={event => handleNewNoteChange(event.target.value)}
                placeholder="Write an internal note..."
                rows={3}
                size="sm"
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={toggleInternal}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium border transition-all',
                      isInternal
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-white/60'
                    )}
                  >
                    Internal Note
                  </Button>
                  <span className="text-xs text-white/60">Only your team can see internal notes</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={RotateCcw}
                    onClick={() => {
                      handleNewNoteChange('')
                      if (!isInternal) {
                        toggleInternal()
                      }
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={handleAddNote}
                    disabled={isAdding}
                    variant="primary"
                    icon={Plus}
                    iconPosition="left"
                    loading={isAdding}
                  >
                    {isAdding ? 'Adding...' : 'Add Note'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
            {notes.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="No notes yet"
                description={`Start documenting important updates and interactions about ${customerName}.`}
              />
            ) : (
              notes.map(note => (
                <div key={note.id} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <IconBox icon={User} color="info" className="border border-secondary/30" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-white">{note.author || 'Team member'}</p>
                          {note.isInternal && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/30">
                              Internal
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-white/50">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(note.createdDate)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <IconButton
                        icon={Edit3}
                        aria-label="Edit note"
                        size="sm"
                        onClick={() => startEditing(note.id, note.content)}
                      />
                      <IconButton
                        icon={Trash2}
                        aria-label="Delete note"
                        variant="danger"
                        size="sm"
                        onClick={() => requestDeleteNote(note.id)}
                      />
                    </div>
                  </div>

                  {editingNoteId === note.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editContent}
                        onChange={event => handleEditContentChange(event.target.value)}
                        rows={4}
                        size="sm"
                      />
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={cancelEditing}>
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={Save}
                          loading={isLoading}
                          disabled={isLoading}
                          onClick={() => handleSaveEdit(note.id)}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-white/80 whitespace-pre-wrap">{note.content}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>

      {showConfirmDelete && (
        <ConfirmDialog
          isOpen={showConfirmDelete}
          onClose={cancelDelete}
          onConfirm={confirmDeleteNote}
          title="Delete Note"
          message="Are you sure you want to delete this note? This action cannot be undone."
          confirmLabel="Delete Note"
          variant="danger"
        />
      )}
    </>
  )
}
