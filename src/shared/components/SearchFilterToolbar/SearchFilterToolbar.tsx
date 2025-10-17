import React, { useMemo } from 'react'
import { Filter } from 'lucide-react'
import { SearchInput } from '../SearchInput/SearchInput'
import { ViewModeToggle } from '../ViewModeToggle'
import { UiDropdown, type UiDropdownOption } from '../ui/UiDropdown'
import type { ViewMode, ViewModeOption } from '../ViewModeToggle'
import { FilterPanel } from '../FilterPanel'
import { FilterChipsBar, type ActiveFilter } from '../FilterChipsBar'

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
            <label className="block text-sm font-medium text-white/80 mb-2">
              {field.label}
            </label>
            <UiDropdown
              options={field.options?.map((option): UiDropdownOption => ({
                value: option.value ?? option.id,
                label: option.name
              })) ?? []}
              value={String(field.value)}
              onSelect={(value) => field.onChange(value)}
              onClear={field.onClear}
              placeholder={field.placeholder ?? `Select ${field.label.toLowerCase()}`}
              allowClear
            />
          </div>
        )

      case 'input':
        return (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-white/80 mb-2">
              {field.label}
            </label>
            <input
              id={field.id}
              type="text"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              placeholder={field.placeholder}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#D417C8]/50 focus:border-[#D417C8]/50 transition-all"
            />
          </div>
        )

      case 'date':
        return (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-white/80 mb-2">
              {field.label}
            </label>
            <input
              id={field.id}
              type="date"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D417C8]/50 focus:border-[#D417C8]/50 transition-all"
            />
          </div>
        )

      case 'custom':
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-white/80 mb-2">
              {field.label}
            </label>
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

  // Count active filters for badge
  const activeFilterCount = activeFilters.length

  return (
    <>
      <div className={className}>
        {/* Enhanced search toolbar with consistent styling */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
          <div className="flex flex-col gap-3">
            {/* Main toolbar - aligned row */}
            <div className="flex flex-col xs:flex-row gap-3 xs:items-center">
              {/* Search Input - fixed height container */}
              <div className="flex-1 min-w-0">
                <SearchInput
                  value={searchQuery}
                  onChange={onSearchChange}
                  onClear={onClearSearch}
                  placeholder={searchPlaceholder}
                  isSearching={isSearching}
                  className="w-full"
                />
              </div>
              
              {/* Actions Section - Mobile stacked, desktop inline */}
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 flex-shrink-0">
                {/* Additional Actions */}
                {additionalActions && (
                  <div className="flex items-center justify-center xs:justify-start">
                    {additionalActions}
                  </div>
                )}
                
                {/* Bottom row on mobile, inline on desktop */}
                <div className="flex items-center gap-2">
                  {/* Filters Button */}
                  {filterFields.length > 0 && (
                    <button
                      onClick={onToggleFilters}
                      className="btn-secondary flex items-center justify-center gap-2 flex-1 xs:flex-none"
                    >
                      <Filter className="w-4 h-4" />
                      <span className="xs:inline">Filters</span>
                    </button>
                  )}
                  
                  {/* View Mode Toggle */}
                  {viewMode && onViewModeChange && viewModeOptions && (
                    <div className="flex-shrink-0">
                      <ViewModeToggle
                        value={viewMode}
                        onChange={onViewModeChange}
                        options={viewModeOptions}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Search Results Info - Enhanced styling */}
            {searchResults && (searchQuery || searchResults.filtered < searchResults.total) && (
              <div className="flex items-center gap-3 text-sm -mt-2 px-2">
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
          <div className="mt-6 pt-6 border-t border-white/10">
            <button
              onClick={onClearFilters}
              className="w-full px-6 py-3 text-sm 
                       bg-gradient-to-r from-red-500/20 to-red-600/20 
                       hover:from-red-500/30 hover:to-red-600/30 
                       border border-red-500/30 hover:border-red-400/40 
                       rounded-lg text-red-300 hover:text-red-200 
                       transition-all duration-200"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </FilterPanel>
    </>
  )
}