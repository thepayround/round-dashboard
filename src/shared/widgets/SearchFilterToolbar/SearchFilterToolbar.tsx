import { Filter, RotateCcw, Search, X } from 'lucide-react'
import React from 'react'

import { Button } from '../../ui/shadcn/button'
import { Input } from '../../ui/shadcn/input'
import { Drawer } from '../Drawer'
import { FilterChipsBar } from '../FilterChipsBar'

import { useSearchFilterToolbarController } from './useSearchFilterToolbarController'

export type ViewMode = 'grid' | 'list' | 'table'

export interface ViewModeOption {
  value: ViewMode
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export interface FilterField {
  id: string
  label: string
  type: 'select' | 'input' | 'date' | 'custom'
  value: string | number
  onChange: (value: string) => void
  onClear?: () => void
  options?: Array<{ id: string; name: string; value?: string }>
  placeholder?: string
  component?: React.ReactNode
}


export interface SearchFilterToolbarProps {
  // Search functionality
  searchQuery: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string

  // Enhanced search features
  isSearching?: boolean
  onClearSearch?: () => void
  searchResults?: {
    total: number
    filtered: number
  }

  // Filter functionality
  showFilters: boolean
  onToggleFilters: () => void
  filterFields?: FilterField[]
  onClearFilters?: () => void

  // View mode functionality (optional)
  viewMode?: ViewMode
  onViewModeChange?: (mode: ViewMode) => void
  viewModeOptions?: ViewModeOption[]

  // Styling
  className?: string

  // Additional actions (optional)
  additionalActions?: React.ReactNode
}

export const SearchFilterToolbar: React.FC<SearchFilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  isSearching = false,
  onClearSearch,
  searchResults,
  showFilters,
  onToggleFilters,
  filterFields = [],
  onClearFilters,
  viewMode,
  onViewModeChange,
  viewModeOptions,
  className = '',
  additionalActions
}) => {
  const {
    activeFilters,
    hasActiveFilters,
    renderFilterField,
    shouldShowSearchSummary,
    searchSummaryLabel,
  } = useSearchFilterToolbarController({
    filterFields,
    searchQuery,
    searchResults,
  })

  return (
    <>
      <div className={className}>
        {/* All-in-one toolbar - everything in a single row */}
        <div>
          <div className="flex flex-col gap-4">
            {/* Main toolbar - single row with all tools */}
            <div className="flex items-center justify-between gap-2">
              {/* Left Section - View Mode, Search, Filters */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {/* View Mode Toggle - First on left */}
                {viewMode && onViewModeChange && viewModeOptions && (
                  <div className="flex-shrink-0 inline-flex rounded-md border border-border bg-input p-1">
                    {viewModeOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <Button
                          key={option.value}
                          type="button"
                          onClick={() => onViewModeChange(option.value)}
                          variant={viewMode === option.value ? 'default' : 'ghost'}
                          size="sm"
                          className="gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          {option.label}
                        </Button>
                      )
                    })}
                  </div>
                )}

                {/* Search Input - Flexible middle section */}
                <div className="flex-1 min-w-[200px] max-w-md relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="pl-10 pr-10"
                  />
                  {searchQuery && onClearSearch && (
                    <Button
                      type="button"
                      onClick={onClearSearch}
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    </div>
                  )}
                </div>

                {/* Filters Button */}
                {filterFields.length > 0 && (
                  <Button
                    type="button"
                    onClick={onToggleFilters}
                    variant="secondary"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                )}
              </div>

              {/* Right Section - Additional Actions stay at far right */}
              {additionalActions && (
                <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                  {additionalActions}
                </div>
              )}
            </div>

            {/* Search Results Info - Enhanced styling */}
            {shouldShowSearchSummary && (
              <div className="flex items-center gap-4 text-sm -mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="text-white/70">
                    {searchSummaryLabel}
                  </span>
                </div>
                {searchQuery && (
                  <div className="flex items-center gap-2">
                    <span className="text-white/50">•</span>
                    <span className="text-white/50">for</span>
                    <span className="text-secondary font-medium bg-secondary/20 px-3 py-1 rounded-lg border border-secondary/30">
                      &quot;{searchQuery}&quot;
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="mt-4">
            <FilterChipsBar
              filters={activeFilters}
              onClearAll={onClearFilters}
            />
          </div>
        )}
      </div>

      {/* Slide-out Filter Panel */}
      <Drawer
        isOpen={showFilters}
        onClose={onToggleFilters}
        title="Filters"
      >
        {filterFields.map(renderFilterField)}

        {/* Clear All Button inside panel */}
        {onClearFilters && hasActiveFilters && (
          <div className="mt-6 pt-6 border-t border-[#1e1f22]">
            <Button
              type="button"
              onClick={onClearFilters}
              variant="destructive"
              className="w-full"
              aria-label="Clear all filters"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear All Filters
            </Button>
          </div>
        )}
      </Drawer>
    </>
  )
}
