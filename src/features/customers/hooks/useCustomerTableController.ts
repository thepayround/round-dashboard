import { useCallback, useMemo } from 'react'

import { getStatusMeta, type StatusMeta } from '../utils'

import type { CustomerResponse } from '@/shared/services/api/customer.service'

interface UseCustomerTableControllerParams {
  customers: CustomerResponse[]
  selectable?: boolean
  selectedIds?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
}

interface UseCustomerTableControllerReturn {
  getStatusMeta: (status: number | string) => StatusMeta
  formatDate: (value: string) => string
  handleSelectAll: (checked: boolean) => void
  handleSelectRow: (customerId: string, checked: boolean) => void
  isAllSelected: boolean
  isIndeterminate: boolean
  hasSelection: boolean
  selectedCount: number
  selectionSummaryLabel: string
  clearSelection: () => void
}

export const useCustomerTableController = ({
  customers,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
}: UseCustomerTableControllerParams): UseCustomerTableControllerReturn => {
  const customerIds = useMemo(() => customers.map(customer => customer.id), [customers])

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (!selectable || !onSelectionChange) return
      onSelectionChange(checked ? customerIds : [])
    },
    [customerIds, onSelectionChange, selectable]
  )

  const handleSelectRow = useCallback(
    (customerId: string, checked: boolean) => {
      if (!selectable || !onSelectionChange) return

      const nextSelection = checked
        ? Array.from(new Set([...selectedIds, customerId]))
        : selectedIds.filter(id => id !== customerId)

      onSelectionChange(nextSelection)
    },
    [onSelectionChange, selectable, selectedIds]
  )

  const isAllSelected = useMemo(
    () => selectable && customerIds.length > 0 && selectedIds.length === customerIds.length,
    [customerIds.length, selectable, selectedIds.length]
  )

  const isIndeterminate = useMemo(
    () => selectable && selectedIds.length > 0 && selectedIds.length < customerIds.length,
    [customerIds.length, selectable, selectedIds.length]
  )

  const hasSelection = selectable && selectedIds.length > 0
  const selectedCount = selectedIds.length
  const selectionSummaryLabel = useMemo(
    () => `${selectedCount} customer${selectedCount === 1 ? '' : 's'} selected`,
    [selectedCount]
  )

  const clearSelection = useCallback(() => {
    if (!selectable || !onSelectionChange) return
    onSelectionChange([])
  }, [onSelectionChange, selectable])

  const formatDate = useCallback(
    (value: string) =>
      new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(value)),
    []
  )

  return {
    getStatusMeta,
    formatDate,
    handleSelectAll,
    handleSelectRow,
    isAllSelected,
    isIndeterminate,
    hasSelection,
    selectedCount,
    selectionSummaryLabel,
    clearSelection,
  }
}
