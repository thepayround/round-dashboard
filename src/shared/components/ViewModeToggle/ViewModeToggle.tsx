import { Table, Grid3X3, List } from 'lucide-react'

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

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  return (
    <div className={`flex items-center space-x-2 bg-black/20 rounded-lg p-1 ${className}`}>
      {options.map((option) => {
        const IconComponent = option.icon
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`${sizeClasses[size]} rounded-md transition-all flex items-center space-x-2 ${
              value === option.value
                ? 'bg-white/10 text-white' 
                : 'text-white/60 hover:text-white'
            }`}
            title={option.label}
          >
            <IconComponent className={iconSizeClasses[size]} />
            {showLabels && (
              <span className="text-sm font-medium">{option.label}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
