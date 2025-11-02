import { Plus, MessageSquare, User, Calendar, Edit3, Trash2, Save, RotateCcw, Loader2 } from 'lucide-react'
import React, { useState, useEffect } from 'react'

import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { Modal } from '@/shared/components/Modal'
import { useGlobalToast } from '@/shared/contexts/ToastContext'
import type { CustomerNoteResponse, CustomerNoteCreateRequest } from '@/shared/services/api/customer.service'
import { customerService } from '@/shared/services/api/customer.service'

interface CustomerNotesModalProps {
  isOpen: boolean
  onClose: () => void
  customerId: string
  customerName: string
  initialNotes: CustomerNoteResponse[]
}

interface NewNote {
  content: string
  isInternal: boolean
}

export const CustomerNotesModal: React.FC<CustomerNotesModalProps> = ({
  isOpen,
  onClose,
  customerId,
  customerName,
  initialNotes
}) => {
  const { showSuccess, showError } = useGlobalToast()
  const [notes, setNotes] = useState<CustomerNoteResponse[]>(initialNotes)
  const [newNote, setNewNote] = useState<NewNote>({ content: '', isInternal: true })
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null)

  useEffect(() => {
    setNotes(initialNotes)
  }, [initialNotes])

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

  const handleAddNote = async () => {
    if (!newNote.content.trim()) {
      showError('Please enter a note')
      return
    }

    setIsAdding(true)
    try {
      const request: CustomerNoteCreateRequest = {
        content: newNote.content,
        isInternal: newNote.isInternal,
        createdBy: 'Current User' // TODO: Get from auth context
      }

      const createdNote = await customerService.createNote(customerId, request)
      setNotes(prev => [createdNote, ...prev])
      setNewNote({ content: '', isInternal: true })
      showSuccess('Note added successfully')
    } catch (error) {
      console.error('Failed to add note:', error)
      showError('Failed to add note')
    } finally {
      setIsAdding(false)
    }
  }

  const handleEditNote = async (noteId: string) => {
    if (!editContent.trim()) {
      showError('Note content cannot be empty')
      return
    }

    setIsLoading(true)
    try {
      const currentNote = notes.find(note => note.id === noteId)
      if (!currentNote) {
        showError('Note not found')
        return
      }

      const request: CustomerNoteCreateRequest = {
        content: editContent,
        isInternal: currentNote.isInternal,
        createdBy: 'Current User' // TODO: Get from auth context
      }

      const updatedNote = await customerService.updateNote(customerId, noteId, request)
      setNotes(prev => prev.map(note => 
        note.id === noteId ? updatedNote : note
      ))
      setEditingNoteId(null)
      setEditContent('')
      showSuccess('Note updated successfully')
    } catch (error) {
      console.error('Failed to update note:', error)
      showError('Failed to update note')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteNote = (noteId: string) => {
    setNoteToDelete(noteId)
    setShowConfirmDelete(true)
  }

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return

    setIsLoading(true)
    try {
      await customerService.deleteNote(customerId, noteToDelete)
      setNotes(prev => prev.filter(note => note.id !== noteToDelete))
      showSuccess('Note deleted successfully')
      setShowConfirmDelete(false)
      setNoteToDelete(null)
    } catch (error) {
      console.error('Failed to delete note:', error)
      showError('Failed to delete note')
    } finally {
      setIsLoading(false)
    }
  }

  const startEditing = (note: CustomerNoteResponse) => {
    setEditingNoteId(note.id)
    setEditContent(note.content)
  }

  const cancelEditing = () => {
    setEditingNoteId(null)
    setEditContent('')
  }

  return (
    <>
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Customer Notes"
      subtitle={`${customerName} - ${notes.length} notes`}
      size="lg"
    >
      {/* Add New Note */}
            <div className="border-b border-white/10 pb-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-3">
                  <Plus className="w-4 h-4 text-[#14BDEA]" />
                  <span className="text-sm font-normal tracking-tight text-white">Add New Note</span>
                </div>
                
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                  rows={3}
                  className="auth-input textarea resize-none"
                  placeholder="Add a note about this customer..."
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isInternal"
                      checked={newNote.isInternal}
                      onChange={(e) => setNewNote(prev => ({ ...prev, isInternal: e.target.checked }))}
                      className="w-4 h-4 text-[#14BDEA] bg-white/5 border-white/20 rounded focus:ring-[#14BDEA]/20"
                    />
                    <label htmlFor="isInternal" className="text-sm text-white/70">
                      Internal note (not visible to customer)
                    </label>
                  </div>
                  
                  <button
                    onClick={handleAddNote}
                    disabled={isAdding || !newNote.content.trim()}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:shadow-lg hover:shadow-[#D417C8]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAdding ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add Note</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Notes List */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {notes.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-white/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white/70 mb-2">No notes yet</h3>
                    <p className="text-sm text-white/50">Add your first note about this customer above.</p>
                  </div>
                ) : (
                  notes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-white/5 border border-white/10 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-white/10 rounded-full">
                            <User className="w-3 h-3 text-white/70" />
                          </div>
                          <div>
                            <span className="text-sm font-normal tracking-tight text-white">{note.author}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-3 h-3 text-white/50" />
                              <span className="text-xs text-white/50">{formatDate(note.createdDate)}</span>
                              {note.isInternal && (
                                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">
                                  Internal
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEditing(note)}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200"
                            disabled={isLoading}
                          >
                            <Edit3 className="w-3.5 h-3.5 text-white/70" />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-1.5 hover:bg-red-500/20 hover:text-[#D417C8] rounded-lg transition-colors"
                            disabled={isLoading}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-white/70" />
                          </button>
                        </div>
                      </div>
                      
                      {editingNoteId === note.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={3}
                            className="auth-input textarea resize-none text-sm focus:border-[#14BDEA]/50 focus:ring-1 focus:ring-[#14BDEA]/20"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditNote(note.id)}
                              disabled={isLoading}
                              className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-all disabled:opacity-50"
                            >
                              <Save className="w-3 h-3" />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={cancelEditing}
                              disabled={isLoading}
                              className="flex items-center space-x-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-all duration-200 disabled:opacity-50"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                          {note.content}
                        </p>
                      )}

                    </div>
                  ))
                )}
            </div>
    </Modal>

    {/* Delete Confirmation Dialog */}
    <ConfirmDialog
      isOpen={showConfirmDelete}
      onClose={() => {
        setShowConfirmDelete(false)
        setNoteToDelete(null)
      }}
      onConfirm={confirmDeleteNote}
      title="Delete Note"
      message="Are you sure you want to delete this note? This action cannot be undone."
      confirmLabel="Delete Note"
      variant="danger"
      isLoading={isLoading}
    />
  </>
  )
}