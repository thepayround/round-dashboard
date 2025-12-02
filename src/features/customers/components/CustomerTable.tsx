import type { ColumnDef } from '@tanstack/react-table'
import { Edit, Trash2, MoreHorizontal, Copy } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useCustomerTableController } from '../hooks/useCustomerTableController'

import type { CustomerResponse } from '@/shared/services/api/customer.service'
import {
  DataTable,
  DataTableSelectColumn,
  SortableHeader,
  type VisibilityState
} from '@/shared/ui/DataTable/DataTable'
import { Avatar, AvatarFallback } from '@/shared/ui/shadcn/avatar'
import { Badge } from '@/shared/ui/shadcn/badge'
import { Button } from '@/shared/ui/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/dropdown-menu'

interface CustomerTableProps {
  customers: CustomerResponse[]
  isLoading?: boolean
  selectable?: boolean
  onSelectionChange?: (selectedIds: string[]) => void
  selectedIds?: string[]
  onDelete?: (customer: CustomerResponse) => void
  onDuplicate?: (customer: CustomerResponse) => void
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (visibility: VisibilityState) => void
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
  isLoading = false,
  selectable = false,
  onSelectionChange,
  selectedIds = [],
  onDelete,
  onDuplicate,
  columnVisibility,
  onColumnVisibilityChange,
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
    // Selection column (only if selectable)
    ...(selectable ? [DataTableSelectColumn<CustomerResponse>()] : []),
    // Customer ID - first column, fully visible, non-hideable
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <SortableHeader column={column}>ID</SortableHeader>
      ),
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="text-sm text-muted-foreground font-mono">
            {customer.id}
          </div>
        )
      },
      enableHiding: false,
    },
    {
      accessorKey: 'displayName',
      header: ({ column }) => (
        <SortableHeader column={column}>Customer</SortableHeader>
      ),
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
                <div className="font-normal text-foreground tracking-tight truncate">
                  {customer.effectiveDisplayName ?? customer.displayName}
                </div>
                {customer.isBusinessCustomer && (
                  <Badge variant="secondary" className="flex-shrink-0">
                    Business
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground truncate">
                {customer.firstName} {customer.lastName}
              </div>
            </div>
          </div>
        )
      },
      enableHiding: false,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <SortableHeader column={column}>Email</SortableHeader>
      ),
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="text-sm text-foreground truncate">{customer.email}</div>
        )
      }
    },
    {
      accessorKey: 'company',
      header: ({ column }) => (
        <SortableHeader column={column}>Company</SortableHeader>
      ),
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="text-sm text-foreground truncate">
            {customer.company ?? '-'}
          </div>
        )
      }
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <SortableHeader column={column}>Status</SortableHeader>
      ),
      cell: ({ row }) => {
        const customer = row.original
        const statusMeta = getStatusMeta(customer.status)
        return (
          <Badge variant={statusMeta.variant}>
            {statusMeta.label}
          </Badge>
        )
      }
    },
    {
      accessorKey: 'currency',
      header: ({ column }) => (
        <SortableHeader column={column}>Currency</SortableHeader>
      ),
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="text-sm text-foreground">{customer.currency}</div>
        )
      }
    },
    {
      accessorKey: 'signupDate',
      header: ({ column }) => (
        <SortableHeader column={column}>Joined</SortableHeader>
      ),
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="text-sm text-foreground">{formatDate(customer.signupDate)}</div>
        )
      }
    },
    {
      accessorKey: 'phoneNumber',
      header: ({ column }) => (
        <SortableHeader column={column}>Phone</SortableHeader>
      ),
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="text-sm text-foreground">
            {customer.phoneNumber ?? '-'}
          </div>
        )
      }
    },
    {
      accessorKey: 'portalAccess',
      header: ({ column }) => (
        <SortableHeader column={column}>Portal Access</SortableHeader>
      ),
      cell: ({ row }) => {
        const customer = row.original
        return (
          <Badge variant={customer.portalAccess ? 'default' : 'secondary'}>
            {customer.portalAccess ? 'Enabled' : 'Disabled'}
          </Badge>
        )
      }
    },
    {
      accessorKey: 'autoCollection',
      header: ({ column }) => (
        <SortableHeader column={column}>Auto Collection</SortableHeader>
      ),
      cell: ({ row }) => {
        const customer = row.original
        return (
          <Badge variant={customer.autoCollection ? 'default' : 'secondary'}>
            {customer.autoCollection ? 'On' : 'Off'}
          </Badge>
        )
      }
    },
    {
      accessorKey: 'locale',
      header: ({ column }) => (
        <SortableHeader column={column}>Locale</SortableHeader>
      ),
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="text-sm text-foreground">
            {customer.locale ?? '-'}
          </div>
        )
      }
    },
    {
      accessorKey: 'timezone',
      header: ({ column }) => (
        <SortableHeader column={column}>Timezone</SortableHeader>
      ),
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="text-sm text-foreground">
            {customer.timezone ?? '-'}
          </div>
        )
      }
    },
    {
      accessorKey: 'taxNumber',
      header: ({ column }) => (
        <SortableHeader column={column}>Tax Number</SortableHeader>
      ),
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="text-sm text-foreground font-mono">
            {customer.taxNumber ?? '-'}
          </div>
        )
      }
    },
    {
      accessorKey: 'tags',
      header: ({ column }) => (
        <SortableHeader column={column}>Tags</SortableHeader>
      ),
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="flex gap-1 flex-wrap">
            {customer.tags && customer.tags.length > 0 ? (
              customer.tags.map((tag, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">-</span>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: 'lastActivityDate',
      header: ({ column }) => (
        <SortableHeader column={column}>Last Activity</SortableHeader>
      ),
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="text-sm text-foreground">
            {customer.lastActivityDate ? formatDate(customer.lastActivityDate) : '-'}
          </div>
        )
      }
    },
    {
      accessorKey: 'createdDate',
      header: ({ column }) => (
        <SortableHeader column={column}>Created</SortableHeader>
      ),
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="text-sm text-foreground">
            {formatDate(customer.createdDate)}
          </div>
        )
      }
    },
    {
      accessorKey: 'modifiedDate',
      header: ({ column }) => (
        <SortableHeader column={column}>Modified</SortableHeader>
      ),
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="text-sm text-foreground">
            {formatDate(customer.modifiedDate)}
          </div>
        )
      }
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/customers/${customer.id}?mode=edit`)
                  }}
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onDuplicate?.(customer)
                  }}
                >
                  <Copy className="h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete?.(customer)
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
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
      showColumnVisibility={false}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
      pageSize={12}
    />
  )
}

export default CustomerTable
export type { VisibilityState } from '@/shared/ui/DataTable/DataTable'

