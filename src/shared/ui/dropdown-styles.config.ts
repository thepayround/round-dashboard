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
    base: 'bg-[#101011] border border-white/20 rounded-lg shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10',
    maxHeight: 'max-h-80',
    positioning: 'fixed z-[9999]',
    minWidth: 'min-w-[280px]',
  },

  // Backdrop overlay
  backdrop: {
    base: 'fixed inset-0 bg-black/5',
    zIndex: 'z-[9998]',
  },

  // Search input section
  search: {
    container: 'p-2.5 border-b border-white/10',
    input: 'w-full pl-9 pr-8 py-1.5 bg-[#171719] border border-[#333333] rounded-lg text-white/95 placeholder-[#737373] text-xs focus:border-[#14bdea] focus:outline-none',
    icon: 'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60',
    clearButton: 'absolute right-2.5 top-1/2 transform -translate-y-1/2 p-0.5 hover:bg-white/10 rounded-lg',
    clearIcon: 'w-3 h-3 text-white/60 hover:text-white/90',
  },

  // Options list section
  list: {
    container: 'flex-1 overflow-y-auto',
    padding: 'p-1.5',
    spacing: 'space-y-0.5',
    empty: 'p-3 text-center text-white/60 text-xs',
  },

  // Individual option item
  option: {
    base: 'px-2.5 py-3 lg:py-2 min-h-[44px] lg:min-h-0 rounded-lg cursor-pointer flex items-center justify-between',
    spacing: 'space-x-2.5',

    // States
    highlighted: 'bg-[#14BDEA]/20 border border-[#14BDEA]/30',
    selected: 'bg-[#14BDEA]/20 border-[#14BDEA]/30',
    default: 'hover:bg-white/10 border border-transparent',

    // Content
    label: 'text-white/95 font-light truncate text-xs',
    description: 'text-white/60 text-xs truncate',
    checkIcon: 'w-4 h-4 text-[#14BDEA] flex-shrink-0',
  },

  // Colors
  colors: {
    primary: '#14BDEA',      // Cyan - for selection/highlight
    accent: '#D417C8',       // Magenta - for accents (not used in dropdowns)
    background: '#101011',   // Dropdown background
    inputBg: '#171719',      // Input background
    border: '#333333',       // Input border
    borderLight: 'white/20', // Dropdown border
    text: 'white/95',        // Primary text
    textMuted: 'white/60',   // Muted text
    placeholder: '#737373',  // Placeholder text
  },

  // Typography
  typography: {
    fontWeight: 'font-light',
    fontSize: 'text-xs',
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
