import { useCallback, useMemo } from 'react'

import type { CustomerResponse } from '@/shared/services/api/customer.service'

interface UseCustomerTableControllerParams {
  customers: CustomerResponse[]
  selectable?: boolean
  selectedIds?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
}

interface StatusMeta {
  label: string
  className: string
}

interface UseCustomerTableControllerReturn {
  getStatusMeta: (status: number | string) => StatusMeta
  formatDate: (value: string) => string
  getInitials: (displayName: string) => string
  handleSelectAll: (checked: boolean) => void
  handleSelectRow: (customerId: string, checked: boolean) => void
  isAllSelected: boolean
  isIndeterminate: boolean
  hasSelection: boolean
  selectedCount: number
  selectionSummaryLabel: string
  clearSelection: () => void
}

const STATUS_MAP: Record<number, StatusMeta> = {
  1: { label: 'Active', className: 'bg-green-500/20 text-green-400 border border-green-500/30' },
  2: { label: 'Inactive', className: 'bg-gray-500/20 text-gray-400 border border-gray-500/30' },
  3: { label: 'Suspended', className: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' },
  4: { label: 'Cancelled', className: 'bg-red-500/20 text-[#D417C8] border border-red-500/30' },
}

const defaultStatus: StatusMeta = STATUS_MAP[1]

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

  const getStatusMeta = useCallback((status: number | string) => {
    const statusValue = typeof status === 'string' ? parseInt(status, 10) : status
    return STATUS_MAP[statusValue] ?? defaultStatus
  }, [])

  const formatDate = useCallback(
    (value: string) =>
      new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(value)),
    []
  )

  const getInitials = useCallback((displayName: string) => {
    if (!displayName) return ''
    return displayName
      .split(' ')
      .filter(Boolean)
      .map(name => name[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }, [])

  return {
    getStatusMeta,
    formatDate,
    getInitials,
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
