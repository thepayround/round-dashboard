import { useCallback, useEffect, useState } from 'react'

import { useGlobalToast } from '@/shared/contexts/ToastContext'
import type { CustomerNoteCreateRequest, CustomerNoteResponse } from '@/shared/services/api/customer.service'
import { customerService } from '@/shared/services/api/customer.service'

interface UseCustomerNotesModalControllerParams {
  customerId: string
  customerName: string
  initialNotes: CustomerNoteResponse[]
  initialEditingNoteId?: string | null
}

interface UseCustomerNotesModalControllerReturn {
  noteContent: string
  isInternal: boolean
  isLoading: boolean
  handleNoteContentChange: (value: string) => void
  toggleInternal: () => void
  handleSave: () => Promise<void>
}

export const useCustomerNotesModalController = ({
  customerId,
  customerName: _customerName,
  initialNotes,
  initialEditingNoteId,
}: UseCustomerNotesModalControllerParams): UseCustomerNotesModalControllerReturn => {
  const { showSuccess, showError } = useGlobalToast()
  
  const [noteContent, setNoteContent] = useState('')
  const [isInternal, setIsInternal] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize state based on mode (Add vs Edit)
  useEffect(() => {
    if (initialEditingNoteId) {
      const noteToEdit = initialNotes.find(n => n.id === initialEditingNoteId)
      if (noteToEdit) {
        setNoteContent(noteToEdit.content)
        setIsInternal(noteToEdit.isInternal)
      }
    } else {
      setNoteContent('')
      setIsInternal(true)
    }
  }, [initialNotes, initialEditingNoteId])

  const handleSave = useCallback(async () => {
    if (!noteContent.trim()) {
      showError('Note content cannot be empty')
      return
    }

    setIsLoading(true)
    try {
      const request: CustomerNoteCreateRequest = {
        content: noteContent,
        isInternal,
        createdBy: 'Current User', // TODO: use auth context
      }

      if (initialEditingNoteId) {
        await customerService.updateNote(customerId, initialEditingNoteId, request)
        showSuccess('Note updated successfully')
      } else {
        await customerService.createNote(customerId, request)
        showSuccess('Note added successfully')
      }
      
      // Close modal is handled by parent via onSuccess or just close
      // But here we just return success, the parent component (Modal/Drawer) usually calls onClose after success?
      // The controller doesn't have access to onClose.
      // We should probably return a success status or let the component handle it.
      // For now, we just rely on the user closing it or we can add an onSuccess callback to props if needed.
      // Wait, the user said "when you close the drawer you should reload the page".
      // The parent reloads on close. So we just need to save.
      // Ideally we should close the drawer automatically on save.
      // I'll add an `onSuccess` callback to the params later if needed, but for now let's stick to the requested scope.
      // Actually, standard UX is to close on save.
      // I'll leave it as is for now, the component calls this.
      
    } catch (error) {
      console.error('Failed to save note:', error)
      showError('Failed to save note')
    } finally {
      setIsLoading(false)
    }
  }, [customerId, initialEditingNoteId, noteContent, isInternal, showError, showSuccess])

  return {
    noteContent,
    isInternal,
    isLoading,
    handleNoteContentChange: setNoteContent,
    toggleInternal: () => setIsInternal(prev => !prev),
    handleSave,
  }
}
