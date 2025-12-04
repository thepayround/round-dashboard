import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import React from 'react'

import { Button } from '@/shared/ui/shadcn/button'

export interface FilterChipProps {
  label: string
  value: string
  onRemove: () => void
}

/**
 * Filter chip component to display active filters
 * Shows as a removable badge with label and value
 */
export const FilterChip = React.forwardRef<HTMLDivElement, FilterChipProps>(
  ({ label, value, onRemove }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.15 }}
        className="inline-flex items-center gap-2 px-3 py-1.5
                 bg-secondary/10
                 border border-secondary/20
                 rounded-lg text-sm text-foreground
                 hover:bg-secondary/15 hover:border-secondary/30 transition-all group"
      >
        <span className="font-medium text-muted-foreground">{label}:</span>
        <span className="text-foreground">{value}</span>
        <Button
          onClick={onRemove}
          variant="ghost"
          size="icon"
          className="p-0.5 hover:bg-muted rounded transition-colors ml-1 h-5 w-5"
          aria-label={`Remove ${label} filter`}
        >
          <X className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </Button>
      </motion.div>
    )
  }
)

FilterChip.displayName = 'FilterChip'

