import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import React from 'react'

import { Button } from './shadcn/button'
import { Label } from './shadcn/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './shadcn/select'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (items: number) => void
  className?: string
  showItemsPerPage?: boolean
  showGoToFirst?: boolean
  showGoToLast?: boolean
  pageSizeOptions?: number[]
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  className = '',
  showItemsPerPage = true,
  showGoToFirst = true,
  showGoToLast = true,
  pageSizeOptions = [6, 12, 24, 48, 100]
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  // Generate page numbers to show
  const generatePageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 7

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage <= 4) {
        // Show pages 1-5 with ellipsis
        for (let i = 2; i <= 5; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        // Show ellipsis with last 5 pages
        pages.push('...')
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Show ellipsis, current page with neighbors, ellipsis
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = generatePageNumbers()

  if (totalPages <= 1 && !showItemsPerPage) {
    return null
  }

  return (
    <div className={`flex items-center justify-between border-t border-border px-6 py-4 ${className}`}>
      {/* Items info and per-page selector */}
      <div className="flex items-center space-x-6">
        <div className="text-sm text-white/70">
          Showing <span className="text-white font-normal tracking-tight">{startItem}-{endItem}</span> of{' '}
          <span className="text-white font-normal tracking-tight">{totalItems}</span> items
        </div>

        {showItemsPerPage && (
          <div className="flex items-center space-x-2">
            <Label htmlFor="items-per-page" className="text-sm text-white/70 whitespace-nowrap">Items per page:</Label>
            <Select value={String(itemsPerPage)} onValueChange={(value) => onItemsPerPageChange(Number(value))}>
              <SelectTrigger id="items-per-page" className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map(size => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center space-x-2">
          <div className="text-sm text-white/70 mr-4">
            Page {currentPage} of {totalPages}
          </div>

          {/* First page button */}
          {showGoToFirst && (
            <Button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              variant="ghost"
              size="icon"
              aria-label="First page"
            >
              <ChevronsLeft />
            </Button>
          )}

          {/* Previous page button */}
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="ghost"
            size="sm"
            className="px-3"
          >
            <ChevronLeft />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          {/* Page numbers */}
          <div className="flex items-center space-x-1">
            {pageNumbers.map((page, index) => (
              <div key={index}>
                {page === '...' ? (
                  <span className="px-2 py-2 text-white/60" aria-label="More pages">...</span>
                ) : (
                  <Button
                    onClick={() => onPageChange(page as number)}
                    variant={currentPage === page ? 'default' : 'ghost'}
                    size="sm"
                    className="w-10 px-0"
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Next page button */}
          <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="ghost"
            size="sm"
            className="px-3"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight />
          </Button>

          {/* Last page button */}
          {showGoToLast && (
            <Button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              variant="ghost"
              size="icon"
              aria-label="Last page"
            >
              <ChevronsRight />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export { Pagination }