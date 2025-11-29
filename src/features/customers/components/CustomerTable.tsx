import type { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useCustomerTableController } from '../hooks/useCustomerTableController'

import type { CustomerResponse } from '@/shared/services/api/customer.service'
import { DataTable } from '@/shared/ui/DataTable/DataTable'
import { Avatar, AvatarFallback } from '@/shared/ui/shadcn/avatar'
import { Badge } from '@/shared/ui/shadcn/badge'

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

// Helper function to generate initials from name
const getInitials = (name: string): string => {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  sortConfig: _sortConfig,
  onSort: _onSort,
  isLoading = false,
  selectable = false,
  onSelectionChange,
  selectedIds = []
}) => {
  const navigate = useNavigate()
  const {
    getStatusMeta,
    formatDate,
  } = useCustomerTableController({
    customers,
    selectable,
    selectedIds,
    onSelectionChange,
  })

  const columns: ColumnDef<CustomerResponse, unknown>[] = [
    {
      header: 'Customer',
      accessorKey: 'displayName',
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(customer.displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <div className="font-normal text-white tracking-tight truncate">
                  {customer.effectiveDisplayName ?? customer.displayName}
                </div>
                {customer.isBusinessCustomer && (
                  <span className="px-2 py-1 bg-white/5 text-white/80 border border-border rounded text-xs font-normal tracking-tight flex-shrink-0">
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
      }
    },
    {
      header: 'Contact',
      accessorKey: 'email',
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="space-y-1">
            <div className="text-sm text-white/80 truncate">{customer.email}</div>
            {customer.phoneNumber && (
              <div className="text-sm text-white/60 truncate">{customer.phoneNumber}</div>
            )}
          </div>
        )
      }
    },
    {
      header: 'Company',
      accessorKey: 'company',
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="text-sm text-white/80 truncate">
            {customer.company ?? '-'}
          </div>
        )
      }
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => {
        const customer = row.original
        const statusMeta = getStatusMeta(customer.status)
        return (
          <div className="flex items-center space-x-2">
            <Badge variant={statusMeta.variant}>
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
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="text-sm text-white/80">{customer.currency}</div>
        )
      }
    },
    {
      header: 'Joined',
      accessorKey: 'signupDate',
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="text-sm text-white/80">{formatDate(customer.signupDate)}</div>
        )
      }
    }
  ]

  return (
    <DataTable
      data={customers}
      columns={columns}
      isLoading={isLoading}
      enableRowSelection={selectable}
      onRowClick={(customer) => navigate(`/customers/${customer.id}`)}
      showPagination={true}
      showSearch={false}
      pageSize={12}
    />
  )
}

export default CustomerTable

