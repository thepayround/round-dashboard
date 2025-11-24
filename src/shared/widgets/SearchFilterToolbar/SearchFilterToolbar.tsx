import { Filter, RotateCcw } from 'lucide-react'
import React from 'react'

import { Button } from '../../ui/Button'
import { SearchInput } from '../../ui/SearchInput'
import { ViewModeToggle } from '../../ui/ViewModeToggle'
import type { ViewMode, ViewModeOption } from '../../ui/ViewModeToggle'
import { Drawer } from '../Drawer'
import { FilterChipsBar } from '../FilterChipsBar'

import { useSearchFilterToolbarController } from './useSearchFilterToolbarController'

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
                  <div className="flex-shrink-0">
                    <ViewModeToggle
                      value={viewMode}
                      onChange={onViewModeChange}
                      options={viewModeOptions}
                    />
                  </div>
                )}
                
                {/* Search Input - Flexible middle section */}
                <div className="flex-1 min-w-[200px] max-w-md">
                  <SearchInput
                    value={searchQuery}
                    onChange={onSearchChange}
                    onClear={onClearSearch}
                    placeholder={searchPlaceholder}
                    isSearching={isSearching}
                    className="w-full"
                  />
                </div>
                
                {/* Filters Button */}
                {filterFields.length > 0 && (
                  <Button
                    onClick={onToggleFilters}
                    variant="secondary"
                    size="md"
                    icon={Filter}
                    iconPosition="left"
                  >
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
              onClick={onClearFilters}
              variant="danger"
              size="md"
              icon={RotateCcw}
              iconPosition="left"
              fullWidth
              aria-label="Clear all filters"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </Drawer>
    </>
  )
}
