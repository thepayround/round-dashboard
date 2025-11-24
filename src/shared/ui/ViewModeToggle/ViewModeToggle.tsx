import { Table, Grid3X3, List } from 'lucide-react'

import { PlainButton } from '@/shared/ui/Button'

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
  disabled?: boolean
  ariaLabel?: string
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
  size: _size = 'md',
  className = '',
  disabled = false,
  ariaLabel = 'View mode toggle'
}: ViewModeToggleProps) => {
  return (
    <div
      className={`flex items-center bg-black/20 rounded-lg p-1.5 h-10 ${className}`}
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const IconComponent = option.icon
        const isActive = value === option.value
        return (
          <PlainButton
            key={option.value}
            onClick={() => onChange(option.value)}
            disabled={disabled}
            aria-pressed={isActive}
            aria-label={option.label}
            className={`
              h-full
              ${showLabels ? 'px-3' : 'w-7 px-0'}
              rounded-md
              transition-all
              duration-200
              flex
              items-center
              justify-center
              focus-visible:outline-none
              focus-visible:ring-1
              focus-visible:ring-primary
              focus-visible:ring-offset-2
              focus-visible:ring-offset-[#0A0A0A]
              disabled:opacity-50
              disabled:cursor-not-allowed
              ${isActive
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/5'
              }
            `}
            title={option.label}
            unstyled
          >
            <IconComponent className="w-4 h-4 flex-shrink-0" />
            {showLabels && <span className="ml-2 text-sm font-medium">{option.label}</span>}
          </PlainButton>
        )
      })}
    </div>
  )
}

