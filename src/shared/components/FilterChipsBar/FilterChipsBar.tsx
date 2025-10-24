import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FilterChip } from '../FilterChip'

export interface ActiveFilter {
  id: string
  label: string
  value: string
  displayValue: string
  onRemove: () => void
}

export interface FilterChipsBarProps {
  filters: ActiveFilter[]
  onClearAll?: () => void
  className?: string
}

/**
 * Container component to display all active filter chips
 * Shows chips in a flex wrap layout with optional "Clear All" button
 */
export const FilterChipsBar: React.FC<FilterChipsBarProps> = ({
  filters,
  onClearAll,
  className = ''
}) => {
  // Don't render if no active filters
  if (filters.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex flex-wrap items-center gap-2 p-4
                 bg-[#171719] border border-[#1e1f22] rounded-lg
                 ${className}`}
    >
      <span className="text-sm text-white/60 mr-1">Active filters:</span>
      
      <AnimatePresence mode="popLayout">
        {filters.map((filter) => (
          <FilterChip
            key={filter.id}
            label={filter.label}
            value={filter.displayValue}
            onRemove={filter.onRemove}
          />
        ))}
      </AnimatePresence>

      {onClearAll && filters.length > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={onClearAll}
          className="ml-2 px-3 py-1.5 text-sm
                   bg-destructive/20 
                   hover:bg-destructive/30 
                   border border-red-500/30 hover:border-red-400/40 
                   rounded-lg text-red-300 hover:text-red-200 
                   transition-all duration-200"
        >
          Clear All
        </motion.button>
      )}
    </motion.div>
  )
}
