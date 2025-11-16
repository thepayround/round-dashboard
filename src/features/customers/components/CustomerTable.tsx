import {
  Eye,
  Edit,
  MoreHorizontal,
  X
} from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

import { useCustomerTableController } from '../hooks/useCustomerTableController'

import type { CustomerResponse } from '@/shared/services/api/customer.service'
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow,
  TableHead, 
  TableCell,
  SortableTableHead,
  Checkbox
} from '@/shared/ui'
import { Button, IconButton } from '@/shared/ui/Button'

interface SortConfig {
  field: string
  direction: 'asc' | 'desc'
}

interface CustomerTableProps {
  customers: CustomerResponse[]
  sortConfig: SortConfig
  onSort: (field: string) => void
  loading?: boolean
  selectable?: boolean
  onSelectionChange?: (selectedIds: string[]) => void
  selectedIds?: string[]
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  sortConfig,
  onSort,
  loading = false,
  selectable = false,
  onSelectionChange,
  selectedIds = []
}) => {
  const {
    getStatusMeta,
    formatDate,
    getInitials,
    handleSelectAll,
    handleSelectRow,
    isAllSelected,
    isIndeterminate,
    hasSelection,
    selectionSummaryLabel,
    clearSelection,
  } = useCustomerTableController({
    customers,
    selectable,
    selectedIds,
    onSelectionChange,
  })

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      {/* Bulk actions bar - appears above table when items are selected */}
      {hasSelection && (
        <div className="bg-[#D417C8]/10 border-b border-[#D417C8]/30 backdrop-blur-sm">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-white">
                  {selectionSummaryLabel}
                </span>
                {/* Add bulk action buttons here in the future */}
              </div>
              <IconButton
                onClick={clearSelection}
                icon={X}
                aria-label="Clear selection"
                title="Clear selection"
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <div className="flex items-center">
                    <div
                      className={`
                        flex items-center justify-center
                        w-9 h-9 rounded-lg
                        transition-all duration-200
                        ${isAllSelected || isIndeterminate
                          ? 'bg-[#D417C8]/10 border border-[#D417C8]'
                          : 'border border-white/10 hover:bg-white/5 hover:border-white/20'
                        }
                      `}
                    >
                      <Checkbox
                        checked={isIndeterminate && !isAllSelected ? 'indeterminate' : isAllSelected}
                        onCheckedChange={(checked) => handleSelectAll(!!checked)}
                        aria-label="Select all customers"
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                </TableHead>
              )}
              <SortableTableHead field="displayName" sortConfig={sortConfig} onSort={onSort}>
                Customer
              </SortableTableHead>
              <SortableTableHead field="email" sortConfig={sortConfig} onSort={onSort}>
                Contact
              </SortableTableHead>
              <SortableTableHead field="company" sortConfig={sortConfig} onSort={onSort}>
                Company
              </SortableTableHead>
              <SortableTableHead field="status" sortConfig={sortConfig} onSort={onSort}>
                Status
              </SortableTableHead>
              <SortableTableHead field="currency" sortConfig={sortConfig} onSort={onSort}>
                Currency
              </SortableTableHead>
              <SortableTableHead field="signupDate" sortConfig={sortConfig} onSort={onSort}>
                Joined
              </SortableTableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map(customer => {
              const statusMeta = getStatusMeta(customer.status)

              return (
              <TableRow
                key={customer.id}
                className={`transition-colors duration-150 ${(() => {
                  if (selectedIds.includes(customer.id)) return 'bg-[#D417C8]/5'
                  return ''
                })()}`}
              >
                  {selectable && (
                    <TableCell>
                      <div
                        className={`
                          flex items-center justify-center
                          w-9 h-9 rounded-lg
                          transition-all duration-200
                          ${selectedIds.includes(customer.id)
                            ? 'bg-[#D417C8]/10 border border-[#D417C8]'
                            : 'border border-white/10 hover:bg-white/5 hover:border-white/20'
                          }
                        `}
                      >
                        <Checkbox
                          checked={selectedIds.includes(customer.id)}
                          onCheckedChange={(checked) => handleSelectRow(customer.id, !!checked)}
                          aria-label={`Select customer ${customer.displayName}`}
                          className="w-4 h-4"
                        />
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-medium text-xs tracking-tight">
                        {getInitials(customer.displayName)}
                      </div>
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
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm text-white/80 truncate">{customer.email}</div>
                      {customer.phoneNumber && (
                        <div className="text-sm text-white/60 truncate">{customer.phoneNumber}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-white/80 truncate">
                      {customer.company ?? '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-normal tracking-tight ${statusMeta.className}`}>
                        {statusMeta.label}
                      </span>
                      {customer.portalAccess && (
                        <div className="w-2 h-2 bg-white/50 rounded-full" title="Portal Access Enabled" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-white/80">{customer.currency}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-white/80">{formatDate(customer.signupDate)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/customers/${customer.id}`}
                        className="inline-flex items-center justify-center p-1.5 w-8 h-8 text-white/50 rounded-lg transition-all duration-150 hover:opacity-90"
                        title="View customer"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/customers/${customer.id}?mode=edit`}
                        className="inline-flex items-center justify-center p-1.5 w-8 h-8 text-white/50 rounded-lg transition-all duration-150 hover:opacity-90"
                        title="Edit customer"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <IconButton
                        icon={MoreHorizontal}
                        aria-label="More actions"
                        size="md"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Selection Info Bar */}
      {hasSelection && (
        <div className="border-t border-white/10 px-6 py-3 bg-[#171719]">
          <div className="flex items-center justify-between">
            <div className="text-sm text-[#a3a3a3]">
              {selectionSummaryLabel}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white"
              >
                Export Selected
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white"
              >
                Bulk Edit
              </Button>
              <IconButton
                onClick={clearSelection}
                icon={X}
                variant="ghost"
                size="sm"
                aria-label="Clear selection"
              />
            </div>
          </div>
        </div>
      )}
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="text-white/60">Loading...</div>
        </div>
      )}
    </div>
  )
}

export default CustomerTable

