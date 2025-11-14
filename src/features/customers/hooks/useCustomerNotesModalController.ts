import { useCallback, useEffect, useState } from 'react'

import { useGlobalToast } from '@/shared/contexts/ToastContext'
import type { CustomerNoteCreateRequest, CustomerNoteResponse } from '@/shared/services/api/customer.service'
import { customerService } from '@/shared/services/api/customer.service'

interface UseCustomerNotesModalControllerParams {
  customerId: string
  customerName: string
  initialNotes: CustomerNoteResponse[]
}

interface UseCustomerNotesModalControllerReturn {
  notes: CustomerNoteResponse[]
  newNoteContent: string
  isInternal: boolean
  editingNoteId: string | null
  editContent: string
  isLoading: boolean
  isAdding: boolean
  showConfirmDelete: boolean
  noteToDelete: string | null
  formatDate: (value: string) => string
  handleNewNoteChange: (value: string) => void
  toggleInternal: () => void
  handleAddNote: () => Promise<void>
  startEditing: (noteId: string, content: string) => void
  cancelEditing: () => void
  handleEditContentChange: (value: string) => void
  handleSaveEdit: (noteId: string) => Promise<void>
  requestDeleteNote: (noteId: string) => void
  confirmDeleteNote: () => Promise<void>
  cancelDelete: () => void
}

export const useCustomerNotesModalController = ({
  customerId,
  customerName: _customerName,
  initialNotes,
}: UseCustomerNotesModalControllerParams): UseCustomerNotesModalControllerReturn => {
  const { showSuccess, showError } = useGlobalToast()
  const [notes, setNotes] = useState<CustomerNoteResponse[]>(initialNotes)
  const [newNoteContent, setNewNoteContent] = useState('')
  const [isInternal, setIsInternal] = useState(true)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null)

  useEffect(() => {
    setNotes(initialNotes)
  }, [initialNotes])

  const formatDate = useCallback(
    (value: string) =>
      new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    []
  )

  const handleAddNote = useCallback(async () => {
    if (!newNoteContent.trim()) {
      showError('Please enter a note')
      return
    }

    setIsAdding(true)
    try {
      const request: CustomerNoteCreateRequest = {
        content: newNoteContent,
        isInternal,
        createdBy: 'Current User', // TODO: use auth context
      }

      const createdNote = await customerService.createNote(customerId, request)
      setNotes(prev => [createdNote, ...prev])
      setNewNoteContent('')
      setIsInternal(true)
      showSuccess('Note added successfully')
    } catch (error) {
      console.error('Failed to add note:', error)
      showError('Failed to add note')
    } finally {
      setIsAdding(false)
    }
  }, [customerId, isInternal, newNoteContent, showError, showSuccess])

  const handleSaveEdit = useCallback(
    async (noteId: string) => {
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
          createdBy: currentNote.author ?? 'Current User',
        }

        const updatedNote = await customerService.updateNote(customerId, noteId, request)
        setNotes(prev => prev.map(note => (note.id === noteId ? updatedNote : note)))
        setEditingNoteId(null)
        setEditContent('')
        showSuccess('Note updated successfully')
      } catch (error) {
        console.error('Failed to update note:', error)
        showError('Failed to update note')
      } finally {
        setIsLoading(false)
      }
    },
    [customerId, editContent, notes, showError, showSuccess]
  )

  const requestDeleteNote = useCallback((noteId: string) => {
    setNoteToDelete(noteId)
    setShowConfirmDelete(true)
  }, [])

  const confirmDeleteNote = useCallback(async () => {
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
  }, [customerId, noteToDelete, showError, showSuccess])

  const cancelDelete = useCallback(() => {
    setShowConfirmDelete(false)
    setNoteToDelete(null)
  }, [])

  const startEditing = useCallback((noteId: string, content: string) => {
    setEditingNoteId(noteId)
    setEditContent(content)
  }, [])

  const cancelEditing = useCallback(() => {
    setEditingNoteId(null)
    setEditContent('')
  }, [])

  return {
    notes,
    newNoteContent,
    isInternal,
    editingNoteId,
    editContent,
    isLoading,
    isAdding,
    showConfirmDelete,
    noteToDelete,
    formatDate,
    handleNewNoteChange: setNewNoteContent,
    toggleInternal: () => setIsInternal(prev => !prev),
    handleAddNote,
    startEditing,
    cancelEditing,
    handleEditContentChange: setEditContent,
    handleSaveEdit,
    requestDeleteNote,
    confirmDeleteNote,
    cancelDelete,
  }
}
