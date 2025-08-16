import React from 'react'
import { Filter } from 'lucide-react'
import { SearchInput } from '../SearchInput/SearchInput'
import { ViewModeToggle } from '../ViewModeToggle'
import type { ViewMode, ViewModeOption } from '../ViewModeToggle'

export interface FilterField {
  id: string
  label: string
  type: 'select' | 'input' | 'date' | 'custom'
  value: string | number
  onChange: (value: string) => void
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
            <label className="block text-sm font-medium auth-text-muted mb-2">
              {field.label}
            </label>
            <select
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              className="auth-input w-full"
            >
              {field.options?.map((option) => (
                <option key={option.id} value={option.value ?? option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        )
      
      case 'input':
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium auth-text-muted mb-2">
              {field.label}
            </label>
            <input
              type="text"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              placeholder={field.placeholder}
              className="auth-input w-full"
            />
          </div>
        )
      
      case 'date':
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium auth-text-muted mb-2">
              {field.label}
            </label>
            <input
              type="date"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              className="auth-input w-full"
            />
          </div>
        )
      
      case 'custom':
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium auth-text-muted mb-2">
              {field.label}
            </label>
            {field.component}
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className={className}>
      {/* Focus-stable toolbar using plain div instead of animated Card component */}
      <div className="auth-card relative overflow-hidden p-3 md:p-4 lg:p-3.5">
        <div className="flex flex-col gap-2.5 md:gap-3 lg:gap-2.5">
          {/* Main toolbar - aligned row */}
          <div className="flex flex-col xs:flex-row gap-2.5 md:gap-3 lg:gap-2.5 xs:items-center">
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
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 md:gap-2.5 lg:gap-2 flex-shrink-0">
              {/* Additional Actions */}
              {additionalActions && (
                <div className="flex items-center justify-center xs:justify-start">
                  {additionalActions}
                </div>
              )}
              
              {/* Bottom row on mobile, inline on desktop */}
              <div className="flex items-center gap-2 md:gap-2.5 lg:gap-2">
                {/* Filters Button */}
                {filterFields.length > 0 && (
                  <button
                    onClick={onToggleFilters}
                    className="btn-secondary flex items-center justify-center gap-2 flex-1 xs:flex-none touch-target"
                  >
                    <Filter className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-3.5 lg:h-3.5" />
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

          {/* Search Results Info - separate row to avoid layout shift */}
          {searchResults && (searchQuery || searchResults.filtered < searchResults.total) && (
            <div className="flex items-center gap-2 text-xs md:text-xs lg:text-xs -mt-0.5 px-1">
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-[#14BDEA]" />
                <span className="text-gray-400">
                  {searchResults.filtered === searchResults.total 
                    ? `${searchResults.total} result${searchResults.total !== 1 ? 's' : ''}`
                    : `${searchResults.filtered} of ${searchResults.total} result${searchResults.total !== 1 ? 's' : ''}`
                  }
                </span>
              </div>
              {searchQuery && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500">for</span>
                  <span className="text-[#14BDEA] font-medium bg-[#14BDEA]/10 px-2 py-0.5 rounded-md border border-[#14BDEA]/20">
                    &quot;{searchQuery}&quot;
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Advanced Filters - Mobile optimized */}
        {showFilters && filterFields.length > 0 && (
          <div className="mt-3 md:mt-4 lg:mt-3.5 pt-3 md:pt-4 lg:pt-3.5 border-t border-gray-700/50">
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-3 lg:gap-2.5">
              {filterFields.map(renderFilterField)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}