import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import React from 'react'

export interface SortableHeaderProps {
  column: {
    toggleSorting: (desc: boolean) => void
    getIsSorted: () => false | 'asc' | 'desc'
  }
  children: React.ReactNode
  className?: string
}

/**
 * Reusable sortable header component for data tables
 *
 * @example
 * ```tsx
 * {
 *   accessorKey: 'name',
 *   header: ({ column }) => (
 *     <SortableHeader column={column}>Name</SortableHeader>
 *   ),
 *   cell: ({ row }) => row.original.name
 * }
 * ```
 */
export const SortableHeader: React.FC<SortableHeaderProps> = ({
  column,
  children,
  className = ''
}) => {
  const sorted = column.getIsSorted()

  const handleClick = () => column.toggleSorting(sorted === 'asc')

  return (
    <button
      type="button"
      className={`flex items-center gap-1 cursor-pointer select-none bg-transparent border-none p-0 font-inherit text-inherit ${className}`}
      onClick={handleClick}
      aria-label={`Sort by ${typeof children === 'string' ? children : 'column'}`}
    >
      {children}
      {sorted === 'asc' ? (
        <ArrowUp className="h-3 w-3 text-foreground" />
      ) : sorted === 'desc' ? (
        <ArrowDown className="h-3 w-3 text-foreground" />
      ) : (
        <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
      )}
    </button>
  )
}
