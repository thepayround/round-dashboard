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
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search Section */}
          <div className="flex-1 max-w-md">
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
          
          {/* Actions Section */}
          <div className="flex items-center gap-3">
            {/* Additional Actions */}
            {additionalActions}
            
            {/* Filters Button */}
            {filterFields.length > 0 && (
              <button
                onClick={onToggleFilters}
                className="btn-secondary flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            )}
            
            {/* View Mode Toggle */}
            {viewMode && onViewModeChange && viewModeOptions && (
              <ViewModeToggle
                value={viewMode}
                onChange={onViewModeChange}
                options={viewModeOptions}
              />
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && filterFields.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-700/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filterFields.map(renderFilterField)}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  )
}