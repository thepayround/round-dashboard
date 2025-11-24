/**
 * Shared Dropdown Styling Configuration
 * 
 * This configuration ensures visual consistency across all dropdown components:
 * - ApiDropdown ✅ (Refactored)
 * - UiDropdown ✅ (Refactored)
 * - PhoneInput (country selector) ✅ (Refactored)
 * 
 * ## Usage:
 *
 * ```tsx
 * import { dropdownStyles, getOptionClasses } from '../dropdown-styles.config'
 * import { Input } from '@/shared/ui'
 *
 * // Container
 * <div className={`${dropdownStyles.container.base} ${dropdownStyles.container.maxHeight}`}>
 *
 * // Search input (using Input component)
 * <Input className={dropdownStyles.search.input} />
 *
 * // Option with state
 * <div className={getOptionClasses(isHighlighted, isSelected)}>
 *
 * // Option content
 * <div className={dropdownStyles.option.label}>{label}</div>
 * <div className={dropdownStyles.option.description}>{description}</div>
 * ```
 * 
 * ## Why This Exists:
 * 
 * Before this config, each dropdown had hardcoded Tailwind classes. When we needed to
 * change dropdown styling, we had to update 3+ files (ApiDropdown, UiDropdown, PhoneInput).
 * 
 * Now: **Change once here, apply everywhere** ✨
 * 
 * ## Maintenance:
 * 
 * When updating dropdown styles:
 * 1. Update values in this file
 * 2. Changes automatically cascade to all components using it
 * 3. Visual consistency guaranteed across the platform
 * 
 * All dropdown components have been successfully refactored to use this shared configuration.
 * Any future dropdown styling changes should be made here for platform-wide consistency.
 */

export const dropdownStyles = {
  // Container (dropdown menu)
  container: {
    base: 'bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-ring/10',
    maxHeight: 'max-h-80',
    positioning: 'fixed z-[9999]',
    minWidth: 'min-w-[280px]',
  },

  // Backdrop overlay
  backdrop: {
    base: 'fixed inset-0 bg-black/20 backdrop-blur-[1px]',
    zIndex: 'z-[9998]',
  },

  // Search input section
  search: {
    container: 'p-2 border-b border-border',
    input: 'w-full pl-9 pr-8 py-2 bg-input border border-border rounded-lg text-fg placeholder-fg-subtle text-sm focus:border-ring focus:ring-1 focus:ring-ring/20 focus:outline-none transition-all duration-200',
    icon: 'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-fg-muted',
    clearButton: 'absolute right-2.5 top-1/2 transform -translate-y-1/2 p-0.5 hover:bg-bg-hover rounded-lg transition-colors',
    clearIcon: 'w-3 h-3 text-fg-muted hover:text-fg',
  },

  // Options list section
  list: {
    container: 'flex-1 overflow-y-auto',
    padding: 'p-1.5',
    spacing: 'space-y-0.5',
    empty: 'p-4 text-center text-fg-muted text-sm',
  },

  // Individual option item
  option: {
    base: 'px-3 py-2.5 rounded-lg cursor-pointer flex items-center justify-between transition-all duration-150',
    spacing: 'space-x-3',

    // States
    highlighted: 'bg-bg-hover border border-border-hover',
    selected: 'bg-primary/10 border border-primary/20',
    default: 'border border-transparent hover:border-border-hover hover:bg-bg-hover',

    // Content
    label: 'text-fg font-normal truncate text-sm',
    description: 'text-fg-muted text-xs truncate',
    checkIcon: 'w-4 h-4 text-primary flex-shrink-0',
  },

  // Colors (Reference only, styles use Tailwind classes)
  colors: {
    primary: 'hsl(var(--primary))',
    accent: 'hsl(var(--accent))',
    background: 'hsl(var(--card))',
    inputBg: 'hsl(var(--input))',
    border: 'hsl(var(--border))',
    borderLight: 'hsl(var(--border))',
    text: 'hsl(var(--fg))',
    textMuted: 'hsl(var(--fg-muted))',
    placeholder: 'hsl(var(--fg-subtle))',
  },

  // Typography
  typography: {
    fontWeight: 'font-normal',
    fontSize: 'text-sm',
  },
} as const

/**
 * Generate option classes based on state
 * Ensures consistent option styling across all dropdowns
 */
export const getOptionClasses = (isHighlighted: boolean, isSelected: boolean): string => {
  const { option } = dropdownStyles
  
  const classes: string[] = [option.base]
  
  if (isHighlighted) {
    classes.push(option.highlighted)
  } else if (isSelected) {
    classes.push(option.selected)
  } else {
    classes.push(option.default)
  }
  
  return classes.join(' ')
}
