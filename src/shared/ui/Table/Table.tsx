/**
 * Table Component
 * 
 * A comprehensive table system with sortable headers and proper accessibility.
 * Used for data tables throughout the platform (customers, team members, etc.)
 * 
 * @example
 * // Basic table
 * <div className="border border-white/10 rounded-lg overflow-hidden">
 *   <div className="overflow-x-auto">
 *     <Table>
 *       <TableHeader>
 *         <tr>
 *           <SortableTableHead field="name" sortConfig={sortConfig} onSort={handleSort}>
 *             Name
 *           </SortableTableHead>
 *           <TableHead>Email</TableHead>
 *         </tr>
 *       </TableHeader>
 *       <TableBody>
 *         <TableRow>
 *           <TableCell>John Doe</TableCell>
 *           <TableCell>john@example.com</TableCell>
 *         </TableRow>
 *       </TableBody>
 *     </Table>
 *   </div>
 * </div>
 * 
 * @accessibility
 * - SortableTableHead includes aria-sort for screen readers
 * - Semantic table structure with proper roles
 * - Keyboard navigation support
 * - Focus indicators on interactive elements
 */
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import React from 'react'

import { PlainButton } from '@/shared/ui/Button'
import { cn } from '@/shared/utils/cn'

// Base Table Components
export const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table
    ref={ref}
    className={cn('w-full caption-bottom text-sm', className)}
    role="table"
    {...props}
  />
))
Table.displayName = 'Table'

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn('bg-bg-raised border-b border-border', className)}
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
    className={cn('divide-y divide-border', className)}
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
      'border-b border-border transition-colors',
      // Only apply background and hover styles in tbody, not in thead
      '[tbody_&]:hover:bg-bg-hover',
      className
    )}
    role="row"
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
    className={cn('px-4 py-3 text-left text-xs font-medium text-fg-muted tracking-tight', className)}
    role="columnheader"
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
    className={cn('px-4 py-3 text-sm text-fg', className)}
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

  // Determine aria-sort value for accessibility
  const ariaSort = isSorted
    ? direction === 'asc'
      ? 'ascending' as const
      : 'descending' as const
    : 'none' as const

  return (
    <TableHead
      className={className}
      aria-sort={ariaSort}
      {...props}
    >
      {onSort ? (
        <PlainButton
          onClick={() => onSort(field)}
          className="flex items-center space-x-2 hover:text-white transition-colors group w-full text-left"
          aria-label={`Sort by ${children}${isSorted ? ` (currently sorted ${direction === 'asc' ? 'ascending' : 'descending'})` : ''}`}
          unstyled
        >
          <span>{children}</span>
          {isSorted ? (
            direction === 'asc' ? (
              <ArrowUp className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ArrowDown className="w-4 h-4" aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" aria-hidden="true" />
          )}
        </PlainButton>
      ) : (
        children
      )}
    </TableHead>
  )
}


