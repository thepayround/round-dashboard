import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import React from 'react'

import { cn } from '@/shared/utils/cn'

// Base Table Components
export const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  </div>
))
Table.displayName = 'Table'

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn('bg-[#171719] border-b border-white/10', className)}
    {...props}
  />
))
TableHeader.displayName = 'TableHeader'

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('divide-y divide-[#16171a]', className)}
    {...props}
  />
))
TableBody.displayName = 'TableBody'

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-[#16171a] bg-[#101011] hover:bg-[#171719] transition-colors',
      className
    )}
    {...props}
  />
))
TableRow.displayName = 'TableRow'

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn('px-6 py-4 text-left text-sm font-normal text-white/80', className)}
    {...props}
  />
))
TableHead.displayName = 'TableHead'

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('px-6 py-4 text-sm text-white/80', className)}
    {...props}
  />
))
TableCell.displayName = 'TableCell'

// Sortable Table Head
interface SortableTableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Field name for sorting */
  field: string
  /** Current sort configuration */
  sortConfig?: { field: string; direction: 'asc' | 'desc' }
  /** Callback when sort is requested */
  onSort?: (field: string) => void
  /** Label text */
  children: React.ReactNode
}

export const SortableTableHead: React.FC<SortableTableHeadProps> = ({
  field,
  sortConfig,
  onSort,
  children,
  className,
  ...props
}) => {
  const isSorted = sortConfig?.field === field
  const direction = sortConfig?.direction

  return (
    <TableHead className={className} {...props}>
      {onSort ? (
        <button
          onClick={() => onSort(field)}
          className="flex items-center space-x-2 hover:text-white transition-colors group w-full"
        >
          <span>{children}</span>
          {isSorted ? (
            direction === 'asc' ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )
          ) : (
            <ArrowUpDown className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
          )}
        </button>
      ) : (
        children
      )}
    </TableHead>
  )
}

