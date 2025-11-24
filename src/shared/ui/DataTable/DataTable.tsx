import { X } from 'lucide-react'
import React from 'react'

import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    SortableTableHead,
    Checkbox,
} from '@/shared/ui'
import { IconButton } from '@/shared/ui/Button'

export interface Column<T> {
    header: string
    accessorKey?: keyof T
    cell?: (item: T) => React.ReactNode
    sortable?: boolean
    className?: string
}

interface SortConfig {
    field: string
    direction: 'asc' | 'desc'
}

interface DataTableProps<T> {
    data: T[]
    columns: Column<T>[]
    keyField: keyof T
    sortConfig?: SortConfig
    onSort?: (field: string) => void
    isLoading?: boolean
    selectable?: boolean
    selectedIds?: string[]
    onSelectionChange?: (selectedIds: string[]) => void
    onRowClick?: (item: T) => void
    selectionSummaryLabel?: string
    onClearSelection?: () => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<T extends Record<string, any>>({
    data,
    columns,
    keyField,
    sortConfig,
    onSort,
    isLoading = false,
    selectable = false,
    selectedIds = [],
    onSelectionChange,
    onRowClick,
    selectionSummaryLabel = 'Selected items',
    onClearSelection,
}: DataTableProps<T>) {
    const hasSelection = selectedIds.length > 0
    const isAllSelected = data.length > 0 && selectedIds.length === data.length
    const isIndeterminate = selectedIds.length > 0 && selectedIds.length < data.length

    const handleSelectAll = (checked: boolean) => {
        if (onSelectionChange) {
            onSelectionChange(checked ? data.map((item) => item[keyField]) : [])
        }
    }

    const handleSelectRow = (id: string, checked: boolean) => {
        if (onSelectionChange) {
            if (checked) {
                onSelectionChange([...selectedIds, id])
            } else {
                onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id))
            }
        }
    }

    return (
        <div className="border border-border bg-[#101011] rounded-xl overflow-hidden">
            {/* Bulk actions bar */}
            {hasSelection && (
                <div className="bg-primary/10 border-b border-primary/30 backdrop-blur-sm">
                    <div className="px-6 py-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-white">
                                    {selectedIds.length} {selectionSummaryLabel}
                                </span>
                            </div>
                            {onClearSelection && (
                                <IconButton
                                    onClick={onClearSelection}
                                    icon={X}
                                    aria-label="Clear selection"
                                    title="Clear selection"
                                    variant="ghost"
                                    size="sm"
                                    className="text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                                />
                            )}
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
                        w-8 h-8 rounded-md
                        transition-all duration-200
                        ${isAllSelected || isIndeterminate
                                                    ? 'bg-primary/10 border border-primary'
                                                    : 'border border-white/8 hover:bg-white/5 hover:border-white/20'
                                                }
                      `}
                                        >
                                            <Checkbox
                                                checked={isIndeterminate && !isAllSelected ? 'indeterminate' : isAllSelected}
                                                onCheckedChange={(checked) => handleSelectAll(!!checked)}
                                                aria-label="Select all"
                                                className="w-4 h-4"
                                            />
                                        </div>
                                    </div>
                                </TableHead>
                            )}
                            {columns.map((column, index) => (
                                column.sortable && column.accessorKey && onSort ? (
                                    <SortableTableHead
                                        key={index}
                                        field={column.accessorKey as string}
                                        sortConfig={sortConfig}
                                        onSort={onSort}
                                        className={column.className}
                                    >
                                        {column.header}
                                    </SortableTableHead>
                                ) : (
                                    <TableHead key={index} className={column.className}>
                                        {column.header}
                                    </TableHead>
                                )
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => {
                            const id = item[keyField]
                            const isSelected = selectedIds.includes(id)

                            return (
                                <TableRow
                                    key={id}
                                    className={`transition-colors duration-150 ${isSelected ? 'bg-primary/5' : ''} ${onRowClick ? 'cursor-pointer hover:bg-white/5' : ''}`}
                                    onClick={() => onRowClick?.(item)}
                                >
                                    {selectable && (
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <div
                                                className={`
                          flex items-center justify-center
                          w-8 h-8 rounded-md
                          transition-all duration-200
                          ${isSelected
                                                        ? 'bg-primary/10 border border-primary'
                                                        : 'border border-white/8 hover:bg-white/5 hover:border-white/20'
                                                    }
                        `}
                                            >
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={(checked) => handleSelectRow(id, !!checked)}
                                                    aria-label="Select row"
                                                    className="w-4 h-4"
                                                />
                                            </div>
                                        </TableCell>
                                    )}
                                    {columns.map((column, index) => (
                                        <TableCell key={index} className={column.className}>
                                            {column.cell ? column.cell(item) : (column.accessorKey ? item[column.accessorKey] : null)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Loading overlay */}
            {isLoading && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="text-white/60">Loading...</div>
                </div>
            )}
        </div>
    )
}
