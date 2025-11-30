# ApiDropdown Component - Complete Documentation

## Overview
**ApiDropdown** was a fully accessible dropdown component specifically designed for API-driven data with built-in loading, error states, and search functionality. It was deleted during the shadcn migration (Phase 1) and replaced with shadcn's Select component.

**Original Location:** `src/shared/ui/ApiDropdown/ApiDropdown.tsx` (deleted in commit 7987cfe)

**Purpose:** Dropdown for dynamic data fetched from APIs (vs UiDropdown for static client-side data)

---

## Table of Contents
1. [Component Architecture](#component-architecture)
2. [Type Definitions](#type-definitions)
3. [Core Functionality](#core-functionality)
4. [Visual States](#visual-states)
5. [UI Components](#ui-components)
6. [Accessibility Features](#accessibility-features)
7. [Styling System](#styling-system)
8. [Usage Examples](#usage-examples)
9. [Migration Guide](#migration-guide)

---

## Component Architecture

### Dependencies
```typescript
import { ChevronDown, Search, X, Check } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Button, IconButton } from '../Button'
import { dropdownStyles, getOptionClasses } from '../dropdown-styles.config'
import { useDropdownController } from '@/shared/ui/hooks/useDropdownController'
import { cn } from '@/shared/utils/cn'
```

### Key Features
✅ **API Integration** - Hook-based data fetching
✅ **Loading States** - Built-in spinner and loading text
✅ **Error Handling** - Error display + retry button + auto-retry
✅ **Search Functionality** - Real-time filtering with search input
✅ **Clear Button** - Optional X icon to clear selection
✅ **Icons & Descriptions** - Support for option icons and descriptions
✅ **Portal Rendering** - Rendered in document.body for z-index control
✅ **Full Accessibility** - ARIA support, keyboard navigation
✅ **Shared Styles** - Consistent styling with UiDropdown
✅ **TypeScript Generics** - Type-safe data handling

---

## Type Definitions

### 1. ApiDropdownOption
Represents a single option in the dropdown.

```typescript
export interface ApiDropdownOption {
  value: string          // Unique identifier for the option
  label: string          // Display text shown in the dropdown
  searchText?: string    // Optional custom text for search matching
  icon?: React.ReactNode // Optional icon displayed before label
  description?: string   // Optional secondary text shown below label
}
```

**Example:**
```typescript
{
  value: 'US',
  label: 'United States',
  searchText: 'United States US USA America',
  icon: <FlagIcon code="US" />,
  description: '+1'
}
```

---

### 2. ApiDropdownConfig<TData>
Configuration object that defines how the dropdown fetches and displays data.

```typescript
export interface ApiDropdownConfig<TData = Record<string, unknown>> {
  // Hook that fetches data from API
  useHook: () => {
    data: TData[]                        // Array of API response data
    isLoading: boolean                   // Loading state
    isError: boolean                     // Error state
    refetch: () => void | Promise<void>  // Function to retry fetch
  }

  // Function to transform API data into dropdown options
  mapToOptions: (data: TData[]) => ApiDropdownOption[]

  // UI Configuration
  icon: React.ReactNode        // Icon shown when no option is selected
  placeholder: string          // Text shown when no option is selected
  searchPlaceholder: string    // Placeholder for search input
  noResultsText: string        // Text shown when search has no results
  errorText: string            // Text shown when API request fails
}
```

**Example:**
```typescript
const countryConfig: ApiDropdownConfig<Country> = {
  useHook: () => useCountries(),
  mapToOptions: (countries) => countries.map(c => ({
    value: c.code,
    label: c.name,
    searchText: `${c.name} ${c.code}`,
    icon: <Flag code={c.code} />,
    description: c.code,
  })),
  icon: <Globe className="w-4 h-4" />,
  placeholder: "Select country",
  searchPlaceholder: "Search countries...",
  noResultsText: "No countries found",
  errorText: "Failed to load countries",
}
```

---

### 3. ApiDropdownProps<T>
Component props interface.

```typescript
interface ApiDropdownProps<T = unknown> {
  config: ApiDropdownConfig<T>           // Configuration object (required)
  value?: string                         // Currently selected value
  onSelect: (value: string) => void      // Callback when option selected
  onClear?: () => void                   // Callback when selection cleared
  disabled?: boolean                     // Disable the dropdown (default: false)
  error?: boolean                        // Show error styling (default: false)
  allowClear?: boolean                   // Show clear button (default: false)
  className?: string                     // Additional CSS classes
  id?: string                            // HTML id attribute
  label?: string                         // Accessibility label
}
```

---

## Core Functionality

### 1. API Integration

#### Data Fetching
The component uses a hook provided via `config.useHook()` to fetch data:

```typescript
const { data, isLoading, isError, refetch } = config.useHook()
```

#### Data Transformation
API data is transformed into options using `config.mapToOptions()`:

```typescript
const options = useMemo(() => {
  if (!data) return []
  return config.mapToOptions(data)
}, [config, data])
```

#### Auto-Retry on Error
Automatically retries failed requests after 2 seconds:

```typescript
useEffect(() => {
  if (!isError) return

  const timer = setTimeout(() => {
    refetch()
  }, 2000)

  return () => clearTimeout(timer)
}, [isError, refetch])
```

---

### 2. Search Functionality

#### Search Input
Built-in search bar at the top of the dropdown:

```typescript
<div className={dropdownStyles.search.container}>
  <div className="relative">
    <Search className={dropdownStyles.search.icon} />
    <input
      ref={searchInputRef}
      type="text"
      value={searchTerm}
      onChange={(event) => setSearchTerm(event.target.value)}
      placeholder={config.searchPlaceholder}
      className={dropdownStyles.search.input}
      aria-label={config.searchPlaceholder}
      disabled={disabled}
    />
    {searchTerm && (
      <IconButton
        onClick={() => setSearchTerm('')}
        variant="ghost"
        size="sm"
        icon={X}
        aria-label="Clear search"
        className={dropdownStyles.search.clearButton}
      />
    )}
  </div>
</div>
```

#### Search Filtering
- Real-time filtering as user types
- Searches through `label` and `searchText` properties
- Case-insensitive matching
- Handled by `useDropdownController` hook

---

### 3. Clear Button Functionality

#### Clear Button Display
When `allowClear={true}` and an option is selected, shows an X icon button:

```typescript
{allowClear && selectedOption && !isLoading && (
  <IconButton
    onClick={(event) => {
      event.stopPropagation()  // Prevent dropdown toggle
      handleClearSelection()
    }}
    icon={X}
    variant="ghost"
    size="sm"
    aria-label="Clear selection"
    className="w-5 h-5 p-0 text-fg-muted hover:text-fg"
  />
)}
```

#### Clear Button Behavior
- **Position:** Right side of trigger, before chevron icon
- **Icon:** X (from lucide-react)
- **Size:** `w-5 h-5` (20px × 20px)
- **Styling:** Ghost variant, muted text color
- **Hover:** Text color changes from muted to foreground
- **Click:** Stops event propagation, calls `handleClearSelection()`
- **Callback:** Triggers `onClear()` prop if provided
- **Visibility:** Only shown when:
  - `allowClear` is `true`
  - An option is selected (`selectedOption` exists)
  - Not in loading state (`!isLoading`)

---

### 4. Loading States

#### Initial Loading
When data is being fetched for the first time:

```typescript
<div className="p-6 flex flex-col items-center text-center space-y-4">
  <div className="w-6 h-6 border border-secondary/30 border-t-secondary rounded-full animate-spin" />
  <p className="text-fg-muted text-xs">Loading options...</p>
</div>
```

#### Loading Selected Value
When a value is selected but data hasn't loaded yet:

```typescript
if (isLoading && value && !selectedOption) {
  return <span className="text-fg-muted font-normal leading-none">Loading {value}...</span>
}
```

#### Loading Indicator in Trigger
Small spinner shown in the trigger button while loading:

```typescript
{isLoading && (
  <div className="w-4 h-4 border border-secondary/30 border-t-secondary rounded-full animate-spin" />
)}
```

---

### 5. Error Handling

#### Error Display
When API request fails:

```typescript
<div className="p-4 flex flex-col items-center text-center space-y-4">
  <p className="text-destructive text-sm">{config.errorText}</p>
  <Button size="md" variant="secondary" onClick={() => refetch()}>
    Retry
  </Button>
</div>
```

#### Error Features
- **Error message:** Custom text from `config.errorText`
- **Retry button:** Manually trigger `refetch()`
- **Auto-retry:** Automatic retry after 2 seconds
- **Error styling:** Red border when `error` prop is `true`

---

## Visual States

### 1. Empty State (No Results)
Shown when search returns no matching options:

```typescript
<div className={dropdownStyles.list.empty}>
  {config.noResultsText}
</div>
```

### 2. Loading State
Centered spinner with loading text:

```typescript
<div className="p-6 flex flex-col items-center text-center space-y-4">
  <div className="w-6 h-6 border border-secondary/30 border-t-secondary rounded-full animate-spin" />
  <p className="text-fg-muted text-xs">Loading options...</p>
</div>
```

### 3. Error State
Error message with retry button:

```typescript
<div className="p-4 flex flex-col items-center text-center space-y-4">
  <p className="text-destructive text-sm">{config.errorText}</p>
  <Button size="md" variant="secondary" onClick={() => refetch()}>
    Retry
  </Button>
</div>
```

### 4. Options List
Scrollable list of options with icons and descriptions:

```typescript
<div className={`${dropdownStyles.list.padding} ${dropdownStyles.list.spacing}`}>
  {filteredOptions.map((option, index) => (
    <div
      key={option.value}
      role="option"
      aria-selected={option.value === value}
      className={getOptionClasses(index === highlightedIndex, option.value === value)}
    >
      <div className="flex items-center gap-2 flex-1">
        {option.icon && <span className="w-4 h-4">{option.icon}</span>}
        <div className="flex-1">
          <div className={dropdownStyles.option.label}>{option.label}</div>
          {option.description && (
            <div className={dropdownStyles.option.description}>
              {option.description}
            </div>
          )}
        </div>
      </div>
      {option.value === value && <Check className={dropdownStyles.option.checkIcon} />}
    </div>
  ))}
</div>
```

---

## UI Components

### Trigger Button

#### Structure
```typescript
<div
  ref={triggerRef}
  id={triggerId}
  className={cn(
    'relative w-full h-10 rounded-lg border bg-input border-border text-fg',
    'flex items-center justify-between font-normal text-sm outline-none',
    'transition-all duration-200 hover:border-border-hover',
    'focus:border-ring focus:ring-1 focus:ring-ring/20',
    'pl-9 pr-4', // Icon left padding, controls right padding
    error && 'border-destructive focus:border-destructive',
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    isOpen && !error && 'border-ring ring-1 ring-ring/20',
    isOpen && error && 'border-destructive'
  )}
>
  {/* Left Icon */}
  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4">
    {selectedOption?.icon ?? config.icon}
  </div>

  {/* Display Text */}
  <div className="flex-1 text-left truncate">
    {isLoading && value && !selectedOption ? (
      <span className="text-fg-muted">Loading {value}...</span>
    ) : selectedOption ? (
      <span className="text-fg font-medium">{selectedOption.label}</span>
    ) : (
      <span className="text-fg-subtle">{config.placeholder}</span>
    )}
  </div>

  {/* Right Controls */}
  <div className="flex items-center space-x-1.5">
    {/* Loading Spinner */}
    {isLoading && (
      <div className="w-4 h-4 border border-secondary/30 border-t-secondary rounded-full animate-spin" />
    )}

    {/* Clear Button */}
    {allowClear && selectedOption && !isLoading && (
      <IconButton
        onClick={(event) => {
          event.stopPropagation()
          handleClearSelection()
        }}
        icon={X}
        variant="ghost"
        size="sm"
        aria-label="Clear selection"
        className="w-5 h-5 p-0 text-fg-muted hover:text-fg"
      />
    )}

    {/* Chevron */}
    <ChevronDown
      className={`w-4 h-4 text-fg-muted transition-transform duration-300 ${
        isOpen ? 'rotate-180' : ''
      }`}
    />
  </div>
</div>
```

#### Trigger Dimensions
- **Width:** `w-full` (100%)
- **Height:** `h-10` (40px)
- **Border radius:** `rounded-lg`
- **Padding left:** `pl-9` (36px, for icon)
- **Padding right:** `pr-4` (16px)

#### Trigger States
- **Default:** Border with hover effect
- **Focus:** Blue ring and border
- **Open:** Blue ring and border (or red if error)
- **Error:** Red border
- **Disabled:** 50% opacity, no pointer events
- **Loading:** Shows spinner icon

---

### Dropdown Portal

#### Portal Structure
```typescript
const dropdownPortal = isOpen ? createPortal(
  <>
    {/* Backdrop */}
    <div
      className={`${dropdownStyles.backdrop.base} ${dropdownStyles.backdrop.zIndex}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          event.stopPropagation()
          closeDropdown()
        }
      }}
      role="presentation"
    />

    {/* Dropdown Container */}
    <div
      ref={dropdownRef}
      className={dropdownStyles.container.positioning}
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
        zIndex: 9999,
      }}
    >
      <div className={`${dropdownStyles.container.base} ${dropdownStyles.container.maxHeight}`}>
        {/* Search Input */}
        {/* ... */}

        {/* Options List / Loading / Error */}
        {/* ... */}
      </div>
    </div>
  </>,
  document.body
) : null
```

#### Portal Features
- **Rendering:** `createPortal(content, document.body)`
- **Backdrop:** Semi-transparent overlay to close dropdown
- **Positioning:** Absolute positioning with dynamic calculation
- **z-index:** 9999 to appear above all other elements
- **Dynamic width:** Matches trigger button width
- **Dynamic position:** Calculates `top` and `left` from trigger bounds

---

### Option Rendering

#### Option Structure
```typescript
<div
  key={option.value}
  id={`${listboxId}-option-${index}`}
  role="option"
  aria-selected={option.value === value}
  tabIndex={0}
  className={getOptionClasses(index === highlightedIndex, option.value === value)}
  onMouseEnter={() => setHighlightedIndex(index)}
  onClick={() => handleOptionSelect(option)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleOptionSelect(option)
    }
  }}
>
  {/* Content */}
  <div className="flex items-center gap-2 flex-1 min-w-0">
    {/* Icon */}
    {option.icon && (
      <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-fg-muted">
        {option.icon}
      </span>
    )}

    {/* Label & Description */}
    <div className="flex-1 min-w-0">
      <div className={dropdownStyles.option.label}>{option.label}</div>
      {option.description && (
        <div className={dropdownStyles.option.description}>{option.description}</div>
      )}
    </div>
  </div>

  {/* Check Icon (if selected) */}
  {option.value === value && (
    <Check className={dropdownStyles.option.checkIcon} />
  )}
</div>
```

#### Option Features
- **Icon:** Optional, 16px × 16px, left-aligned
- **Label:** Primary text, truncated if too long
- **Description:** Secondary text, shown below label
- **Check icon:** Shown when option is selected
- **Hover:** Background color change
- **Keyboard highlight:** Different background for arrow key navigation
- **Click:** Selects the option
- **Enter/Space:** Keyboard selection

---

## Accessibility Features

### ARIA Attributes

#### Trigger (Combobox)
```typescript
role="combobox"
aria-expanded={isOpen}              // true when dropdown is open
aria-haspopup="listbox"             // Indicates it opens a listbox
aria-controls={listboxId}           // Links to the listbox element
aria-activedescendant={activeDescendantId}  // Currently focused option
aria-label={label || config.placeholder}    // Accessible name
aria-disabled={disabled}            // Disabled state
aria-invalid={error}                // Error state
aria-busy={isLoading}               // Loading state
tabIndex={disabled ? -1 : 0}        // Keyboard focus
```

#### Listbox
```typescript
role="listbox"
id={listboxId}
aria-activedescendant={activeDescendantId}
tabIndex={-1}
onKeyDown={handleListKeyDown}
```

#### Option
```typescript
role="option"
id={`${listboxId}-option-${index}`}
aria-selected={option.value === value}
tabIndex={0}
```

---

### Keyboard Navigation

#### Trigger Keyboard Support
Via `handleTriggerKeyDown`:
- **Enter:** Open/close dropdown
- **Space:** Open/close dropdown
- **Arrow Down:** Open dropdown and focus first option
- **Arrow Up:** Open dropdown and focus last option
- **Escape:** Close dropdown
- **Tab:** Move focus to next element (closes dropdown)

#### Listbox Keyboard Support
Via `handleListKeyDown`:
- **Arrow Down:** Move to next option
- **Arrow Up:** Move to previous option
- **Home:** Move to first option
- **End:** Move to last option
- **Enter:** Select highlighted option
- **Space:** Select highlighted option
- **Escape:** Close dropdown
- **Tab:** Close dropdown and move focus

#### Search Input Keyboard Support
- **Type:** Filter options in real-time
- **Escape:** Clear search and close dropdown
- **Tab:** Move focus to next element

---

### Focus Management

#### Focus Flow
1. **Trigger:** Initially focusable
2. **Open dropdown:** Focus moves to search input
3. **Arrow keys:** Highlight options (visual only, focus stays on search)
4. **Enter/Space:** Select highlighted option, close dropdown, return focus to trigger
5. **Escape:** Close dropdown, return focus to trigger
6. **Tab:** Close dropdown, move focus to next element

#### Focus Visible
- Focus ring on trigger: `focus:ring-1 focus:ring-ring/20`
- Highlighted option: Different background color
- No focus outline on options (uses highlighting instead)

---

## Styling System

### Shared Dropdown Styles Config

The component uses `dropdownStyles` from `dropdown-styles.config.ts`:

#### Backdrop
```typescript
dropdownStyles.backdrop.base       // Semi-transparent overlay
dropdownStyles.backdrop.zIndex     // z-index value
```

#### Container
```typescript
dropdownStyles.container.positioning  // Absolute positioning
dropdownStyles.container.base        // Base container styles
dropdownStyles.container.maxHeight   // Max height for scrolling
```

#### Search
```typescript
dropdownStyles.search.container     // Search section wrapper
dropdownStyles.search.icon          // Search icon styles
dropdownStyles.search.input         // Search input styles
dropdownStyles.search.clearButton   // Clear search button styles
```

#### List
```typescript
dropdownStyles.list.container       // Options list container
dropdownStyles.list.empty          // Empty state text styles
dropdownStyles.list.padding        // List padding
dropdownStyles.list.spacing        // Spacing between options
```

#### Option
```typescript
dropdownStyles.option.label        // Option label text
dropdownStyles.option.description  // Option description text
dropdownStyles.option.checkIcon    // Check icon when selected
```

### Option State Classes

Uses `getOptionClasses(isHighlighted, isSelected)`:

```typescript
function getOptionClasses(isHighlighted: boolean, isSelected: boolean): string {
  return cn(
    'px-3 py-2 cursor-pointer transition-colors',
    'hover:bg-accent hover:text-accent-foreground',
    isHighlighted && 'bg-accent/50',
    isSelected && 'bg-accent text-accent-foreground font-medium'
  )
}
```

---

## Usage Examples

### Example 1: Country Selector

#### Configuration
```typescript
import { Globe } from 'lucide-react'
import { useCountries } from '@/hooks/useCountries'

export const countryDropdownConfig: ApiDropdownConfig<Country> = {
  useHook: () => useCountries(),
  mapToOptions: (countries) => countries.map(c => ({
    value: c.code,
    label: c.name,
    searchText: `${c.name} ${c.code}`,
    icon: <span className={`fi fi-${c.code.toLowerCase()}`} />,
    description: `+${c.phoneCode}`,
  })),
  icon: <Globe className="w-4 h-4" />,
  placeholder: "Select country",
  searchPlaceholder: "Search countries...",
  noResultsText: "No countries found",
  errorText: "Failed to load countries. Retrying...",
}
```

#### Usage
```typescript
function AddressForm() {
  const [country, setCountry] = useState<string>()

  return (
    <div className="space-y-2">
      <Label htmlFor="country">Country</Label>
      <ApiDropdown
        id="country"
        config={countryDropdownConfig}
        value={country}
        onSelect={setCountry}
        allowClear
      />
    </div>
  )
}
```

---

### Example 2: Currency Selector with Error Handling

#### Configuration
```typescript
import { DollarSign } from 'lucide-react'
import { useCurrencies } from '@/hooks/useCurrencies'

export const currencyDropdownConfig: ApiDropdownConfig<Currency> = {
  useHook: () => useCurrencies(),
  mapToOptions: (currencies) => currencies.map(cur => ({
    value: cur.code,
    label: `${cur.code} - ${cur.name}`,
    searchText: `${cur.code} ${cur.name} ${cur.symbol}`,
    icon: <span className="font-bold">{cur.symbol}</span>,
    description: cur.name,
  })),
  icon: <DollarSign className="w-4 h-4" />,
  placeholder: "Select currency",
  searchPlaceholder: "Search currencies...",
  noResultsText: "No currencies found",
  errorText: "Failed to load currencies",
}
```

#### Usage with Validation
```typescript
function BillingForm() {
  const [currency, setCurrency] = useState<string>()
  const [errors, setErrors] = useState<Record<string, string>>({})

  return (
    <div className="space-y-2">
      <Label htmlFor="currency">
        Currency <span className="text-destructive">*</span>
      </Label>
      <ApiDropdown
        id="currency"
        config={currencyDropdownConfig}
        value={currency}
        onSelect={(value) => {
          setCurrency(value)
          setErrors(prev => ({ ...prev, currency: '' }))
        }}
        onClear={() => setCurrency(undefined)}
        allowClear
        error={!!errors.currency}
      />
      {errors.currency && (
        <p className="text-sm text-destructive">{errors.currency}</p>
      )}
    </div>
  )
}
```

---

### Example 3: Custom Data Mapper

#### Configuration with Complex Mapping
```typescript
import { Building2 } from 'lucide-react'
import { useOrganizations } from '@/hooks/useOrganizations'

export const organizationDropdownConfig: ApiDropdownConfig<Organization> = {
  useHook: () => useOrganizations(),
  mapToOptions: (orgs) => orgs.map(org => ({
    value: org.id,
    label: org.name,
    searchText: `${org.name} ${org.domain} ${org.industry}`,
    icon: org.logo ? (
      <img src={org.logo} alt="" className="w-4 h-4 rounded" />
    ) : (
      <Building2 className="w-4 h-4" />
    ),
    description: `${org.industry} • ${org.employeeCount} employees`,
  })),
  icon: <Building2 className="w-4 h-4" />,
  placeholder: "Select organization",
  searchPlaceholder: "Search organizations...",
  noResultsText: "No organizations found",
  errorText: "Failed to load organizations",
}
```

---

## Migration Guide

### From ApiDropdown to Shadcn Select

#### What Was Lost
1. **Built-in API integration** - No longer handles loading/error states automatically
2. **Search functionality** - Not built into shadcn Select by default
3. **Error retry logic** - Must implement manually
4. **Config-based approach** - More manual setup required
5. **Portal positioning** - Different positioning strategy
6. **Auto-retry** - Must implement separately
7. **Clear button** - Must implement separately
8. **Loading spinner in trigger** - Must implement separately

#### Migration Pattern

**OLD (ApiDropdown):**
```typescript
import { ApiDropdown, countryDropdownConfig } from '@/shared/ui/ApiDropdown'

function MyForm() {
  const [country, setCountry] = useState<string>()

  return (
    <ApiDropdown
      config={countryDropdownConfig}
      value={country}
      onSelect={setCountry}
      allowClear
      error={!!errors.country}
    />
  )
}
```

**NEW (Shadcn Select + Manual API Handling):**
```typescript
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/ui/shadcn/select'
import { useCountries } from '@/hooks/useCountries'
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner'

function MyForm() {
  const [country, setCountry] = useState<string>()
  const { data: countries, isLoading, isError, refetch } = useCountries()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-destructive">Failed to load countries</p>
        <Button onClick={refetch} size="sm">Retry</Button>
      </div>
    )
  }

  return (
    <Select value={country} onValueChange={setCountry}>
      <SelectTrigger className={errors.country ? 'border-destructive' : ''}>
        <SelectValue placeholder="Select country" />
      </SelectTrigger>
      <SelectContent>
        {countries?.map(c => (
          <SelectItem key={c.code} value={c.code}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

#### What Needs Manual Implementation
1. **Loading state:** Show LoadingSpinner component
2. **Error state:** Show error message and retry button
3. **Search:** Add Combobox component or custom search
4. **Clear button:** Add X button with conditional rendering
5. **Icons:** Add icons manually to SelectItem
6. **Descriptions:** Add secondary text manually

---

## Controller Hook Integration

The component used `useDropdownController` for state management:

### Controller Hook Return Values
```typescript
const {
  isOpen,                  // Dropdown open state
  searchTerm,              // Current search input
  setSearchTerm,           // Update search input
  filteredOptions,         // Options filtered by search
  highlightedIndex,        // Currently highlighted option index
  setHighlightedIndex,     // Update highlighted index
  triggerRef,              // Ref for trigger button
  dropdownRef,             // Ref for dropdown container
  searchInputRef,          // Ref for search input
  dropdownPosition,        // Calculated position {top, left, width}
  listboxId,               // Generated id for listbox
  activeDescendantId,      // Generated id for active option
  toggleDropdown,          // Toggle open/closed
  closeDropdown,           // Close dropdown
  handleOptionSelect,      // Handle option selection
  handleClearSelection,    // Handle clear button click
  handleTriggerKeyDown,    // Keyboard handler for trigger
  handleListKeyDown,       // Keyboard handler for list
  selectedOption,          // Currently selected option object
} = useDropdownController<ApiDropdownOption>({
  options,
  value,
  onSelect,
  onClear,
  allowClear,
  disabled,
  isLoading,
  allowSearch: true,
  id,
})
```

---

## Summary

### Key Strengths
✅ **Comprehensive API Integration** - Full loading/error/retry handling
✅ **Excellent UX** - Search, clear button, loading indicators
✅ **Full Accessibility** - ARIA, keyboard navigation, focus management
✅ **Type-Safe** - Generic TypeScript support
✅ **Consistent Styling** - Shared styles with UiDropdown
✅ **Portal Rendering** - Proper z-index layering
✅ **Config-Based** - Reusable configurations

### Why It Was Deleted
- **Over-engineered** for simple use cases
- **Tight coupling** to specific patterns
- **Shadcn Select** provides 80% of functionality
- **Migration goal:** Use native shadcn components
- **Maintenance burden:** Custom component to maintain

### When You Might Want Similar Functionality
- Implement PhoneInput-style pattern for API dropdowns
- Create custom Select wrapper with API integration
- Build Combobox component with search
- Use shadcn Combobox for search functionality

---

**Created:** 2025-01-29
**Original Component Deleted:** Commit 7987cfe
**Migration Phase:** Phase 1 - Component Deletion
