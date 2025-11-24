import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { customerService } from '@/shared/services/api/customer.service'
import type { CustomerResponse } from '@/shared/services/api/customer.service'

export type CustomerDetailTab = 'overview' | 'notes' | 'invoices'

interface UseCustomerDetailControllerResult {
  customer: CustomerResponse | null
  loading: boolean
  error: string | null
  currentTab: CustomerDetailTab
  setCurrentTab: (tab: CustomerDetailTab) => void
  isEmailModalOpen: boolean
  isNotesModalOpen: boolean
  editingNoteId: string | null
  isEditModalOpen: boolean
  isDangerousActionsModalOpen: boolean
  isDeleteNoteConfirmOpen: boolean
  noteToDelete: string | null
  openEmailModal: () => void
  closeEmailModal: () => void
  openNotesModal: (noteId?: string) => void
  closeNotesModal: () => void
  openEditModal: () => void
  closeEditModal: () => void
  openDangerousActionsModal: () => void
  closeDangerousActionsModal: () => void
  requestDeleteNote: (noteId: string) => void
  confirmDeleteNote: () => Promise<void>
  cancelDeleteNote: () => void
  handleRetry: () => void
  handleStatusChanged: (newStatus: string) => void
  handleCustomerUpdated: (updatedCustomer: CustomerResponse) => void
  handleCustomerDeleted: () => void
}

export const useCustomerDetailController = (customerId?: string): UseCustomerDetailControllerResult => {
  const navigate = useNavigate()
  const { showError, showSuccess } = useGlobalToast()

  const [customer, setCustomer] = useState<CustomerResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentTab, setCurrentTab] = useState<CustomerDetailTab>('overview')
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDangerousActionsModalOpen, setIsDangerousActionsModalOpen] = useState(false)
  const [isDeleteNoteConfirmOpen, setIsDeleteNoteConfirmOpen] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null)

  const loadCustomer = useCallback(async (options?: { silent?: boolean }) => {
    if (!customerId) {
      setError('Customer ID is missing')
      setLoading(false)
      return
    }

    try {
      if (!options?.silent) {
        setLoading(true)
      }
      setError(null)
      const data = await customerService.get(customerId)
      setCustomer(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load customer details'
      setError(message)
      showError(message)
    } finally {
      if (!options?.silent) {
        setLoading(false)
      }
    }
  }, [customerId, showError])

  useEffect(() => {
    void loadCustomer()
  }, [loadCustomer])

  const handleRetry = useCallback(() => {
    void loadCustomer()
  }, [loadCustomer])

  const handleStatusChanged = useCallback((newStatus: string) => {
    setCustomer(prev => (prev ? { ...prev, status: newStatus as CustomerResponse['status'] } : prev))
  }, [])

  const handleCustomerUpdated = useCallback((updatedCustomer: CustomerResponse) => {
    setCustomer(updatedCustomer)
  }, [])

  const handleCustomerDeleted = useCallback(() => {
    navigate('/customers')
  }, [navigate])

  const openEmailModal = useCallback(() => setIsEmailModalOpen(true), [])
  const closeEmailModal = useCallback(() => setIsEmailModalOpen(false), [])

  const openNotesModal = useCallback((noteId?: string) => {
    if (noteId) {
      setEditingNoteId(noteId)
    } else {
      setEditingNoteId(null)
    }
    setIsNotesModalOpen(true)
  }, [])

  const closeNotesModal = useCallback(() => {
    setIsNotesModalOpen(false)
    setEditingNoteId(null)
    void loadCustomer({ silent: true })
  }, [loadCustomer])

  const openEditModal = useCallback(() => setIsEditModalOpen(true), [])
  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false)
    void loadCustomer()
  }, [loadCustomer])

  const openDangerousActionsModal = useCallback(() => setIsDangerousActionsModalOpen(true), [])
  const closeDangerousActionsModal = useCallback(() => {
    setIsDangerousActionsModalOpen(false)
    void loadCustomer()
  }, [loadCustomer])

  const requestDeleteNote = useCallback((noteId: string) => {
    setNoteToDelete(noteId)
    setIsDeleteNoteConfirmOpen(true)
  }, [])

  const confirmDeleteNote = useCallback(async () => {
    if (!customerId || !noteToDelete) return

    try {
      await customerService.deleteNote(customerId, noteToDelete)
      showSuccess('Note deleted successfully')
      setIsDeleteNoteConfirmOpen(false)
      setNoteToDelete(null)
      void loadCustomer()
    } catch (error) {
      console.error('Failed to delete note:', error)
      showError('Failed to delete note')
    }
  }, [customerId, noteToDelete, loadCustomer, showError, showSuccess])

  const cancelDeleteNote = useCallback(() => {
    setIsDeleteNoteConfirmOpen(false)
    setNoteToDelete(null)
  }, [])

  return {
    customer,
    loading,
    error,
    currentTab,
    setCurrentTab,
    isEmailModalOpen,
    isNotesModalOpen,
    editingNoteId,
    isEditModalOpen,
    isDangerousActionsModalOpen,
    isDeleteNoteConfirmOpen,
    noteToDelete,
    openEmailModal,
    closeEmailModal,
    openNotesModal,
    closeNotesModal,
    openEditModal,
    closeEditModal,
    openDangerousActionsModal,
    closeDangerousActionsModal,
    requestDeleteNote,
    confirmDeleteNote,
    cancelDeleteNote,
    handleRetry,
    handleStatusChanged,
    handleCustomerUpdated,
    handleCustomerDeleted,
  }
}

