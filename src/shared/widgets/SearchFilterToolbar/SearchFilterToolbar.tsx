import { Filter, RotateCcw } from 'lucide-react'
import React, { useMemo } from 'react'

import { Button } from '../../ui/Button'
import { SearchInput } from '../../ui/SearchInput'
import { UiDropdown, type UiDropdownOption } from '../../ui/UiDropdown'
import { ViewModeToggle } from '../../ui/ViewModeToggle'
import type { ViewMode, ViewModeOption } from '../../ui/ViewModeToggle'
import { FilterChipsBar, type ActiveFilter } from '../FilterChipsBar'
import { FilterPanel } from '../FilterPanel'

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
  const renderFilterField = (field: FilterField) => {
    switch (field.type) {
      case 'select':
        return (
          <div key={field.id}>
            <span className="block text-sm font-normal text-white/80 tracking-tight mb-2">
              {field.label}
            </span>
            <UiDropdown
              options={field.options?.map((option): UiDropdownOption => ({
                value: option.value ?? option.id,
                label: option.name
              })) ?? []}
              value={String(field.value)}
              onSelect={(selectedValue: string) => field.onChange(selectedValue)}
              onClear={field.onClear}
              placeholder={field.placeholder ?? `Select ${field.label.toLowerCase()}`}
              allowClear
            />
          </div>
        )

      case 'input':
        return (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-normal text-white/80 tracking-tight mb-2">
              {field.label}
            </label>
            <input
              id={field.id}
              type="text"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              placeholder={field.placeholder}
              className="w-full bg-[#171719] border border-[#333333] rounded-lg px-3 py-2 text-white placeholder-[#737373] focus:outline-none focus:border-[#14bdea] transition-all"
            />
          </div>
        )

      case 'date':
        return (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-normal text-white/80 tracking-tight mb-2">
              {field.label}
            </label>
            <input
              id={field.id}
              type="date"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              className="w-full bg-[#171719] border border-[#333333] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#14bdea] transition-all"
            />
          </div>
        )

      case 'custom':
        return (
          <div key={field.id}>
            <span className="block text-sm font-normal text-white/80 tracking-tight mb-2">
              {field.label}
            </span>
            {field.component}
          </div>
        )
      
      default:
        return null
    }
  }

  // Calculate active filters for chips
  const activeFilters: ActiveFilter[] = useMemo(() => filterFields
      .filter(field => {
        const {value} = field
        return value !== '' && value !== null && value !== undefined
      })
      .map(field => {
        // Find display value from options if available
        let displayValue = String(field.value)
        if (field.options && field.type === 'select') {
          const option = field.options.find(opt => 
            (opt.value ?? opt.id) === String(field.value)
          )
          if (option) {
            displayValue = option.name
          }
        }

        return {
          id: field.id,
          label: field.label,
          value: String(field.value),
          displayValue,
          onRemove: () => {
            if (field.onClear) {
              field.onClear()
            } else {
              field.onChange('')
            }
          }
        }
      }), [filterFields])

  return (
    <>
      <div className={className}>
        {/* All-in-one toolbar - everything in a single row */}
        <div>
          <div className="flex flex-col gap-3">
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
            {searchResults && (searchQuery || searchResults.filtered < searchResults.total) && (
              <div className="flex items-center gap-3 text-sm -mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#14BDEA]" />
                  <span className="text-white/70">
                    {searchResults.filtered === searchResults.total 
                      ? `${searchResults.total} result${searchResults.total !== 1 ? 's' : ''}`
                      : `${searchResults.filtered} of ${searchResults.total} result${searchResults.total !== 1 ? 's' : ''}`
                    }
                  </span>
                </div>
                {searchQuery && (
                  <div className="flex items-center gap-2">
                    <span className="text-white/50">•</span>
                    <span className="text-white/50">for</span>
                    <span className="text-[#14BDEA] font-medium bg-[#14BDEA]/20 px-3 py-1 rounded-lg border border-[#14BDEA]/30">
                      &quot;{searchQuery}&quot;
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFilters.length > 0 && (
          <div className="mt-4">
            <FilterChipsBar
              filters={activeFilters}
              onClearAll={onClearFilters}
            />
          </div>
        )}
      </div>

      {/* Slide-out Filter Panel */}
      <FilterPanel
        isOpen={showFilters}
        onClose={onToggleFilters}
        title="Filters"
      >
        {filterFields.map(renderFilterField)}
        
        {/* Clear All Button inside panel */}
        {onClearFilters && activeFilters.length > 0 && (
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
      </FilterPanel>
    </>
  )
}
