import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useCustomerTableController } from '../hooks/useCustomerTableController'

import type { CustomerResponse } from '@/shared/services/api/customer.service'
import {
  Badge,
  Avatar
} from '@/shared/ui'
import { DataTable, type Column } from '@/shared/ui/DataTable/DataTable'

interface SortConfig {
  field: string
  direction: 'asc' | 'desc'
}

interface CustomerTableProps {
  customers: CustomerResponse[]
  sortConfig: SortConfig
  onSort: (field: string) => void
  isLoading?: boolean
  selectable?: boolean
  onSelectionChange?: (selectedIds: string[]) => void
  selectedIds?: string[]
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  sortConfig,
  onSort,
  isLoading = false,
  selectable = false,
  onSelectionChange,
  selectedIds = []
}) => {
  const navigate = useNavigate()
  const {
    getStatusMeta,
    formatDate,
    clearSelection,
  } = useCustomerTableController({
    customers,
    selectable,
    selectedIds,
    onSelectionChange,
  })

  const columns: Column<CustomerResponse>[] = [
    {
      header: 'Customer',
      accessorKey: 'displayName',
      sortable: true,
      cell: (customer) => (
        <div className="flex items-center space-x-2">
          <Avatar name={customer.displayName} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <div className="font-normal text-white tracking-tight truncate">
                {customer.effectiveDisplayName ?? customer.displayName}
              </div>
              {customer.isBusinessCustomer && (
                <span className="px-2 py-1 bg-white/5 text-white/80 border border-white/10 rounded text-xs font-normal tracking-tight flex-shrink-0">
                  Business
                </span>
              )}
            </div>
            <div className="text-sm text-white/60 truncate">
              {customer.firstName} {customer.lastName}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Contact',
      accessorKey: 'email',
      sortable: true,
      cell: (customer) => (
        <div className="space-y-1">
          <div className="text-sm text-white/80 truncate">{customer.email}</div>
          {customer.phoneNumber && (
            <div className="text-sm text-white/60 truncate">{customer.phoneNumber}</div>
          )}
        </div>
      )
    },
    {
      header: 'Company',
      accessorKey: 'company',
      sortable: true,
      cell: (customer) => (
        <div className="text-sm text-white/80 truncate">
          {customer.company ?? '-'}
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (customer) => {
        const statusMeta = getStatusMeta(customer.status)
        return (
          <div className="flex items-center space-x-2">
            <Badge variant={statusMeta.variant} size="md">
              {statusMeta.label}
            </Badge>
            {customer.portalAccess && (
              <div className="w-2 h-2 bg-white/50 rounded-full" title="Portal Access Enabled" />
            )}
          </div>
        )
      }
    },
    {
      header: 'Currency',
      accessorKey: 'currency',
      sortable: true,
      cell: (customer) => (
        <div className="text-sm text-white/80">{customer.currency}</div>
      )
    },
    {
      header: 'Joined',
      accessorKey: 'signupDate',
      sortable: true,
      cell: (customer) => (
        <div className="text-sm text-white/80">{formatDate(customer.signupDate)}</div>
      )
    }
  ]

  return (
    <DataTable
      data={customers}
      columns={columns}
      keyField="id"
      sortConfig={sortConfig}
      onSort={onSort}
      isLoading={isLoading}
      selectable={selectable}
      selectedIds={selectedIds}
      onSelectionChange={onSelectionChange}
      onRowClick={(customer) => navigate(`/customers/${customer.id}`)}
      selectionSummaryLabel="selected"
      onClearSelection={clearSelection}
    />
  )
}

export default CustomerTable

