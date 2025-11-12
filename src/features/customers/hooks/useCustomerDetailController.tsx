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
  isEditModalOpen: boolean
  isDangerousActionsModalOpen: boolean
  openEmailModal: () => void
  closeEmailModal: () => void
  openNotesModal: () => void
  closeNotesModal: () => void
  openEditModal: () => void
  closeEditModal: () => void
  openDangerousActionsModal: () => void
  closeDangerousActionsModal: () => void
  handleRetry: () => void
  handleStatusChanged: (newStatus: string) => void
  handleCustomerUpdated: (updatedCustomer: CustomerResponse) => void
  handleCustomerDeleted: () => void
}

export const useCustomerDetailController = (customerId?: string): UseCustomerDetailControllerResult => {
  const navigate = useNavigate()
  const { showError } = useGlobalToast()

  const [customer, setCustomer] = useState<CustomerResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentTab, setCurrentTab] = useState<CustomerDetailTab>('overview')
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDangerousActionsModalOpen, setIsDangerousActionsModalOpen] = useState(false)

  const loadCustomer = useCallback(async () => {
    if (!customerId) {
      setError('Customer ID is missing')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await customerService.get(customerId)
      setCustomer(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load customer details'
      setError(message)
      showError(message)
    } finally {
      setLoading(false)
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

  const openNotesModal = useCallback(() => setIsNotesModalOpen(true), [])
  const closeNotesModal = useCallback(() => {
    setIsNotesModalOpen(false)
    void loadCustomer()
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

  return {
    customer,
    loading,
    error,
    currentTab,
    setCurrentTab,
    isEmailModalOpen,
    isNotesModalOpen,
    isEditModalOpen,
    isDangerousActionsModalOpen,
    openEmailModal,
    closeEmailModal,
    openNotesModal,
    closeNotesModal,
    openEditModal,
    closeEditModal,
    openDangerousActionsModal,
    closeDangerousActionsModal,
    handleRetry,
    handleStatusChanged,
    handleCustomerUpdated,
    handleCustomerDeleted,
  }
}

