/**
 * Shared types for Combobox component
 *
 * Follows ui-ux-shadcn standards:
 * - TypeScript strict mode
 * - Generic types for flexibility
 * - Clear naming conventions
 */

export interface ComboboxOption<T = string> {
  value: T
  label: string
  description?: string
  icon?: React.ReactNode
  disabled?: boolean
  searchText?: string // Custom search text for flexible matching
}

export interface ComboboxPosition {
  top: number
  left: number
  width: number
}

export interface ComboboxCallbacks<T = string> {
  onChange: (value: T | undefined) => void
  onSearch?: (searchTerm: string) => void | Promise<void>
  onClear?: () => void
  onOpen?: () => void
  onClose?: () => void
}
