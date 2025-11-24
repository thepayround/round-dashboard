import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import React from 'react'

import { FilterChip } from '../FilterChip'

import { Button } from '@/shared/ui/Button'

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
        <Button
          onClick={onClearAll}
          variant="danger"
          size="md"
          icon={RotateCcw}
          iconPosition="left"
          className="ml-2"
          aria-label="Clear all filters"
        >
          Clear All
        </Button>
      )}
    </motion.div>
  )
}
