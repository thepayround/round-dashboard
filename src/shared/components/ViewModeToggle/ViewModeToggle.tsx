import { Table, Grid3X3, List } from 'lucide-react'

import { Button } from '@/shared/components/Button'

export type ViewMode = 'table' | 'grid' | 'list'

export interface ViewModeOption {
  value: ViewMode
  icon: typeof Table
  label: string
}

interface ViewModeToggleProps {
  value: ViewMode
  onChange: (mode: ViewMode) => void
  options?: ViewModeOption[]
  showLabels?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const defaultOptions: ViewModeOption[] = [
  { value: 'table', icon: Table, label: 'Table' },
  { value: 'grid', icon: Grid3X3, label: 'Grid' },
  { value: 'list', icon: List, label: 'List' }
]

export const ViewModeToggle = ({
  value,
  onChange,
  options = defaultOptions,
  showLabels = false,
  size = 'md',
  className = ''
}: ViewModeToggleProps) => {
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  }

  return (
    <div className={`flex items-center space-x-2 bg-black/20 rounded-lg p-1 ${className}`}>
      {options.map((option) => {
        const IconComponent = option.icon
        return (
          <Button
            key={option.value}
            onClick={() => onChange(option.value)}
            variant={value === option.value ? 'primary' : 'ghost'}
            size="sm"
            icon={IconComponent}
            iconPosition="left"
            className={`${sizeClasses[size]} ${value === option.value ? 'bg-white/10' : ''}`}
            title={option.label}
          >
            {showLabels && option.label}
          </Button>
        )
      })}
    </div>
  )
}
