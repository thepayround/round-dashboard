import React from 'react'
import { motion } from 'framer-motion'
import { Search, Filter } from 'lucide-react'
import { Card } from '../Card'
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
  
  // Filter functionality
  showFilters: boolean
  onToggleFilters: () => void
  filterFields?: FilterField[]
  
  // View mode functionality (optional)
  viewMode?: ViewMode
  onViewModeChange?: (mode: ViewMode) => void
  viewModeOptions?: ViewModeOption[]
  
  // Animation props
  delay?: number
  className?: string
  
  // Additional actions (optional)
  additionalActions?: React.ReactNode
}

export const SearchFilterToolbar: React.FC<SearchFilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  showFilters,
  onToggleFilters,
  filterFields = [],
  viewMode,
  onViewModeChange,
  viewModeOptions,
  delay = 0.2,
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={className}
    >
      <Card animate={false}>
        <div className="flex flex-col gap-3 xs:gap-4">
          {/* Mobile-first layout */}
          <div className="flex flex-col xs:flex-row gap-3 xs:gap-4">
            {/* Search Section */}
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="auth-input pl-10 w-full"
                />
              </div>
            </div>
            
            {/* Actions Section - Mobile stacked, desktop inline */}
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 xs:gap-3 flex-shrink-0">
              {/* Additional Actions */}
              {additionalActions && (
                <div className="flex items-center justify-center xs:justify-start">
                  {additionalActions}
                </div>
              )}
              
              {/* Bottom row on mobile, inline on desktop */}
              <div className="flex items-center gap-2 xs:gap-3">
                {/* Filters Button */}
                {filterFields.length > 0 && (
                  <button
                    onClick={onToggleFilters}
                    className="btn-secondary flex items-center justify-center gap-2 flex-1 xs:flex-none touch-target"
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
        </div>

        {/* Advanced Filters - Mobile optimized */}
        {showFilters && filterFields.length > 0 && (
          <div className="mt-4 xs:mt-6 pt-4 xs:pt-6 border-t border-gray-700/50">
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4">
              {filterFields.map(renderFilterField)}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  )
}