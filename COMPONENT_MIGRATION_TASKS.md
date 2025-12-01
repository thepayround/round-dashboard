# Component Migration & Enhancement Tasks

Comprehensive task list for migrating **PhoneInput** and **ApiDropdown** to full **shadcn UI** standards while maintaining all functionality.

---

## 📋 Task Categories

1. [PhoneInput Migration to Shadcn UI](#phoneinput-migration-to-shadcn-ui)
2. [ApiDropdown to Combobox Migration](#apidropdown-to-combobox-migration)
3. [Storybook Integration](#storybook-integration)

---

## ✅ Dropdown Component Standards

### When to Use Which Component

| Component | Use Case | Features |
|-----------|----------|----------|
| **SimpleSelect** | Fixed options, simple dropdowns | No search, lightweight, h-9 height |
| **Combobox** | API data, searchable, many options | Search, icons, descriptions, loading states |
| **PhoneInput** | Phone numbers with country selection | Validation, flags, phone codes |

### ⚠️ Important: Always use SimpleSelect for simple dropdowns

**DO NOT use shadcn Select directly.** Use `SimpleSelect` instead for consistent UI/UX:

```tsx
// ✅ CORRECT - Use SimpleSelect
import { SimpleSelect } from '@/shared/ui/SimpleSelect'

<SimpleSelect
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]}
  value={selected}
  onChange={setSelected}
  label="Choose option"
/>

// ❌ WRONG - Don't use shadcn Select directly
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/ui/shadcn/select'
```

**SimpleSelect features:**

- Matches Combobox styling exactly
- Portal rendering (no z-index issues)
- Keyboard navigation
- h-9 (36px) standard height
- Consistent focus ring styling

---

## 🔧 PhoneInput Migration to Shadcn UI

### Overview
Migrate PhoneInput to use **shadcn** styling while keeping all functionality:
- ✅ Country selection dropdown
- ✅ Phone number validation
- ✅ Flag icons
- ✅ Country search
- ✅ Phone code display

### Current Issues to Fix
- ❌ Uses custom styling classes (not shadcn)
- ❌ Height is `h-10` (40px) instead of `h-9` (36px)
- ❌ Custom colors (text-white/95, bg-input, border-[#333333])
- ❌ Custom label rendering instead of shadcn Label component
- ❌ Not following shadcn focus ring pattern

---

### TASK-PHONE-001: Update PhoneInput Trigger Styling
**Priority:** High
**Effort:** 2 hours

**Current Code:**
```tsx
// src/shared/ui/PhoneInput/PhoneInput.tsx (lines 255-278)
<div className={cn(
  "relative flex w-full rounded-lg overflow-hidden transition-all duration-300",
  "h-10",
  "bg-input border transition-[border-color] duration-200",
  // Custom border colors
  isFocused && "border-[#14bdea]",
  hasError && "border-[#ef4444]",
  "border-[#333333]"
)}>
```

**Target Code:**
```tsx
<div className={cn(
  "relative flex w-full rounded-md overflow-hidden transition-colors",
  "h-9",  // ✅ Shadcn standard height
  "bg-background border border-input",
  // ✅ Shadcn focus pattern
  isFocused && "border-ring ring-2 ring-ring/50",
  hasError && "border-destructive",
  disabled && "opacity-50 cursor-not-allowed"
)}>
```

**Changes Required:**
1. Replace `h-10` with `h-9` (36px - shadcn standard)
2. Replace `bg-input` with `bg-background`
3. Replace custom border colors with design tokens:
   - `border-[#14bdea]` → `border-ring ring-2 ring-ring/50`
   - `border-[#ef4444]` → `border-destructive`
   - `border-[#333333]` → `border-input`
4. Replace `rounded-lg` with `rounded-md` (shadcn standard)
5. Remove `transition-[border-color]` (use `transition-colors`)

**Acceptance Criteria:**
- [x] Height matches shadcn Input: `h-9` (36px)
- [x] Focus ring matches shadcn pattern: blue ring
- [x] Error border uses `border-destructive`
- [x] Border radius is `rounded-md`
- [x] All colors use design tokens (no hex values)

**Status:** ✅ COMPLETED

---

### TASK-PHONE-002: Update Country Selector Styling
**Priority:** High
**Effort:** 1.5 hours

**Current Code:**
```tsx
// src/shared/ui/PhoneInput/PhoneInput.tsx (lines 280-307)
<div
  className={cn(
    'relative gap-2 h-full min-w-[120px] border-r cursor-pointer',
    'px-3',
    'text-white/95 text-xs font-light outline-none',
    'border-[#333333]',
    hasError && 'bg-[rgba(239,68,68,0.12)]',
    'bg-transparent hover:bg-white/[0.08]'
  )}
>
```

**Target Code:**
```tsx
<button
  className={cn(
    'relative flex items-center gap-2 h-9 min-w-[120px] px-3',
    'border-r border-input cursor-pointer',
    'text-foreground text-sm font-normal',
    'bg-transparent hover:bg-accent/50',
    'transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
    hasError && 'bg-destructive/10',
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
  )}
>
```

**Changes Required:**
1. Change from `div` to `button` (semantic HTML)
2. Replace `text-white/95` with `text-foreground`
3. Replace `text-xs font-light` with `text-sm font-normal`
4. Replace `hover:bg-white/[0.08]` with `hover:bg-accent/50`
5. Replace `border-[#333333]` with `border-input`
6. Add `focus-visible` styles for keyboard navigation
7. Add `disabled` state styling

**Acceptance Criteria:**
- [ ] Uses semantic `button` element
- [ ] Text color uses `text-foreground` token
- [ ] Font size matches shadcn: `text-sm`
- [ ] Hover state uses `bg-accent/50`
- [ ] Focus ring visible on keyboard navigation
- [ ] Disabled state properly styled

---

### TASK-PHONE-003: Update Phone Input Field Styling
**Priority:** High
**Effort:** 1 hour

**Current Code:**
```tsx
// src/shared/ui/PhoneInput/PhoneInput.tsx (lines 356-414)
<input
  className={cn(
    'w-full bg-transparent focus:outline-none',
    'px-3',
    isFocused ? 'text-white' : 'text-white/95',
    'text-xs font-light',
    'placeholder:text-white/60 placeholder:font-light',
    // Long webkit autofill styles...
  )}
/>
```

**Target Code:**
```tsx
<input
  className={cn(
    'flex-1 h-9 w-full px-3 text-sm',
    'bg-transparent border-0',
    'text-foreground placeholder:text-muted-foreground',
    'focus-visible:outline-none',
    'disabled:cursor-not-allowed disabled:opacity-50',
    className
  )}
/>
```

**Changes Required:**
1. Replace `text-white/95` with `text-foreground`
2. Replace `text-xs font-light` with `text-sm` (shadcn standard)
3. Replace `placeholder:text-white/60` with `placeholder:text-muted-foreground`
4. Remove custom webkit autofill styles (use shadcn defaults)
5. Add `disabled` state styling
6. Set explicit `h-9` height

**Acceptance Criteria:**
- [ ] Text color uses `text-foreground`
- [ ] Font size is `text-sm` (14px)
- [ ] Placeholder uses `text-muted-foreground`
- [ ] Height is `h-9`
- [ ] No custom webkit styles
- [ ] Disabled state works correctly

---

### TASK-PHONE-004: Replace Custom Label with Shadcn Label
**Priority:** Medium
**Effort:** 30 minutes

**Current Code:**
```tsx
// src/shared/ui/PhoneInput/PhoneInput.tsx (lines 243-252)
{label && (
  <label
    id={labelId}
    htmlFor={inputId}
    className="auth-label"
  >
    {label}
    {required && <span className="text-primary ml-1">*</span>}
  </label>
)}
```

**Target Code:**
```tsx
import { Label } from '@/shared/ui/shadcn/label'

{label && (
  <Label htmlFor={inputId}>
    {label}
    {required && <span className="text-destructive ml-1">*</span>}
  </Label>
)}
```

**Changes Required:**
1. Import shadcn `Label` component
2. Replace custom `label` element with `Label` component
3. Remove `id={labelId}` (not needed)
4. Remove `className="auth-label"`
5. Change asterisk color from `text-primary` to `text-destructive`

**Acceptance Criteria:**
- [ ] Uses shadcn `Label` component
- [ ] Required asterisk uses `text-destructive`
- [ ] Styling matches other form labels
- [ ] No custom classes

---

### TASK-PHONE-005: Update Dropdown Portal Styling
**Priority:** Medium
**Effort:** 2 hours

**Current Code:**
```tsx
// src/shared/ui/PhoneInput/PhoneInput.tsx (lines 154-238)
<div
  ref={dropdownRef}
  className={dropdownStyles.container.positioning}
  style={{...}}
>
  <div className={`${dropdownStyles.container.base} ${dropdownStyles.container.maxHeight}`}>
```

**Target Code:**
```tsx
<div
  ref={dropdownRef}
  className="fixed z-50 rounded-md border border-input bg-popover shadow-lg"
  style={{...}}
>
  <div className="overflow-hidden">
```

**Changes Required:**
1. Replace `dropdownStyles.container.base` with shadcn classes:
   - `bg-popover` (instead of custom background)
   - `border border-input`
   - `rounded-md`
   - `shadow-lg`
2. Update `z-index` to `z-50` (shadcn standard)
3. Remove `dropdownStyles` imports
4. Use inline shadcn classes instead of config

**Acceptance Criteria:**
- [ ] Background uses `bg-popover`
- [ ] Border uses `border-input`
- [ ] Border radius is `rounded-md`
- [ ] Shadow is `shadow-lg`
- [ ] z-index is `z-50`
- [ ] No `dropdownStyles` config used

---

### TASK-PHONE-006: Update Search Input Styling
**Priority:** Medium
**Effort:** 1 hour

**Current Code:**
```tsx
// src/shared/ui/PhoneInput/PhoneInput.tsx (lines 188-198)
<input
  ref={searchInputRef}
  type="text"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  placeholder="Search countries..."
  className={dropdownStyles.search.input}
/>
```

**Target Code:**
```tsx
<input
  ref={searchInputRef}
  type="text"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  placeholder="Search countries..."
  className={cn(
    "h-8 w-full pl-8 pr-8 rounded-md text-sm",
    "border border-input bg-background",
    "placeholder:text-muted-foreground",
    "focus:outline-none focus:ring-2 focus:ring-ring/50"
  )}
/>
```

**Changes Required:**
1. Remove `dropdownStyles.search.input`
2. Add explicit height: `h-8`
3. Add border: `border border-input`
4. Add background: `bg-background`
5. Add focus ring: `focus:ring-2 focus:ring-ring/50`
6. Add placeholder color: `placeholder:text-muted-foreground`

**Acceptance Criteria:**
- [ ] Height is `h-8` (32px)
- [ ] Uses `border-input` for border
- [ ] Focus ring is visible
- [ ] Placeholder uses muted color
- [ ] No config styles used

---

### TASK-PHONE-007: Update Country Option Styling
**Priority:** Medium
**Effort:** 1.5 hours

**Current Code:**
```tsx
// src/shared/ui/PhoneInput/PhoneInput.tsx (lines 451-485)
<div
  onClick={onClick}
  className={getOptionClasses(isHighlighted, isSelected)}
>
```

**Target Code:**
```tsx
<div
  onClick={onClick}
  onKeyDown={handleKeyDown}
  className={cn(
    "relative flex items-center gap-2 px-3 py-2 cursor-pointer",
    "text-sm transition-colors select-none",
    "hover:bg-accent hover:text-accent-foreground",
    isHighlighted && "bg-accent text-accent-foreground",
    isSelected && "font-medium",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  )}
  role="option"
  aria-selected={isSelected}
  tabIndex={0}
>
  {/* Content */}
  {isSelected && (
    <Check className="h-4 w-4 flex-shrink-0 text-primary" />
  )}
</div>
```

**Changes Required:**
1. Remove `getOptionClasses` function
2. Use inline shadcn classes:
   - `hover:bg-accent hover:text-accent-foreground`
   - `text-sm` for font size
   - `px-3 py-2` for padding
3. Add check icon for selected option
4. Add `focus-visible` styles
5. Add keyboard navigation handler

**Acceptance Criteria:**
- [ ] Hover state uses `bg-accent`
- [ ] Selected option shows check icon
- [ ] Font size is `text-sm`
- [ ] Focus ring visible on keyboard nav
- [ ] Padding matches shadcn: `px-3 py-2`

---

### TASK-PHONE-008: Update Error Message Styling
**Priority:** Low
**Effort:** 30 minutes

**Current Code:**
```tsx
// src/shared/ui/PhoneInput/PhoneInput.tsx (lines 419-429)
{showValidation && hasError && displayError && (
  <p
    id={errorId}
    className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
    role="alert"
  >
    <AlertCircle className="w-4 h-4" />
    <span>{displayError}</span>
  </p>
)}
```

**Target Code:**
```tsx
{showValidation && hasError && displayError && (
  <p
    id={errorId}
    className="mt-2 text-sm text-destructive flex items-center gap-1"
    role="alert"
    aria-live="polite"
  >
    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
    {displayError}
  </p>
)}
```

**Changes Required:**
1. Remove `auth-validation-error` class
2. Replace `space-x-2` with `gap-1`
3. Add `text-destructive` for color
4. Resize icon to `h-3.5 w-3.5`
5. Add `aria-live="polite"`
6. Add `flex-shrink-0` to icon

**Acceptance Criteria:**
- [ ] Uses `text-destructive` for color
- [ ] Icon size is `3.5` (14px)
- [ ] Gap is `gap-1` (4px)
- [ ] Has `aria-live="polite"`
- [ ] No custom classes

---

### TASK-PHONE-009: Remove dropdown-styles.config Dependency
**Priority:** High
**Effort:** 2 hours

**Files to Update:**
- `src/shared/ui/PhoneInput/PhoneInput.tsx`
- Remove import: `import { dropdownStyles, getOptionClasses } from '../dropdown-styles.config'`

**Changes Required:**
1. Replace all `dropdownStyles.backdrop.*` with inline classes
2. Replace all `dropdownStyles.container.*` with inline classes
3. Replace all `dropdownStyles.search.*` with inline classes
4. Replace all `dropdownStyles.list.*` with inline classes
5. Replace all `dropdownStyles.option.*` with inline classes
6. Remove `getOptionClasses` function usage
7. Delete import statement

**Acceptance Criteria:**
- [ ] No `dropdownStyles` imports
- [ ] No `getOptionClasses` usage
- [ ] All styles use inline shadcn classes
- [ ] Component still works correctly
- [ ] No visual regressions

---

### TASK-PHONE-010: Add Mobile Responsive Heights (WCAG AAA)
**Priority:** Medium
**Effort:** 1 hour

**Current Code:**
```tsx
className="h-10"
```

**Target Code:**
```tsx
className="h-11 lg:h-9"  // 44px mobile, 36px desktop
```

**Changes Required:**
1. Update trigger height: `h-11 lg:h-9`
2. Update country selector height: `h-11 lg:h-9`
3. Update phone input height: `h-11 lg:h-9`
4. Update search input height: `h-10 lg:h-8`
5. Test on mobile devices (touch target minimum 44px)

**Acceptance Criteria:**
- [ ] Mobile height is 44px (WCAG AAA)
- [ ] Desktop height is 36px (shadcn standard)
- [ ] Responsive breakpoint is `lg:`
- [ ] Touch targets work on mobile
- [ ] Desktop UI matches shadcn

---

## 🔄 ApiDropdown to Combobox Migration

### Overview
Migrate all ApiDropdown usages to the new Combobox component while maintaining functionality.

---

### TASK-API-001: Identify All ApiDropdown Usages
**Priority:** High
**Effort:** 1 hour

**Actions:**
1. Search codebase for `ApiDropdown` imports
2. Search for `ApiDropdownConfig` usages
3. List all files using ApiDropdown
4. Document each usage pattern
5. Create migration checklist

**Command:**
```bash
# Find all ApiDropdown usages
grep -r "import.*ApiDropdown" src/
grep -r "ApiDropdownConfig" src/
grep -r "<ApiDropdown" src/
```

**Deliverable:**
Create file: `APIDROPDOWN_USAGE_AUDIT.md` with:
- List of all files using ApiDropdown
- Usage patterns for each instance
- Priority order for migration
- Estimated effort per file

**Acceptance Criteria:**
- [ ] All ApiDropdown usages documented
- [ ] Files listed with line numbers
- [ ] Usage patterns identified
- [ ] Migration order prioritized

---

### TASK-API-002: Create Migration Helper Hook
**Priority:** High
**Effort:** 2 hours

**File:** `src/shared/ui/Combobox/hooks/useApiCombobox.ts`

**Target Code:**
```tsx
/**
 * useApiCombobox Hook
 *
 * Helper hook to migrate from ApiDropdown config pattern to Combobox
 * Handles data fetching, transforming, and state management
 */

import { useState, useEffect } from 'react'
import type { ComboboxOption } from '../types'

interface UseApiComboboxOptions<TData, TValue = string> {
  /** Data fetching hook (React Query, SWR, etc) */
  useDataHook: () => {
    data: TData[] | undefined
    isLoading: boolean
    isError: boolean
    refetch?: () => void
  }
  /** Transform API data to Combobox options */
  mapToOptions: (data: TData[]) => ComboboxOption<TValue>[]
  /** Error message to display */
  errorText?: string
}

export function useApiCombobox<TData, TValue = string>({
  useDataHook,
  mapToOptions,
  errorText = 'Failed to load options',
}: UseApiComboboxOptions<TData, TValue>) {
  const { data, isLoading, isError, refetch } = useDataHook()
  const [error, setError] = useState<string>()

  // Map data to options
  const options = data ? mapToOptions(data) : []

  // Handle error state
  useEffect(() => {
    if (isError) {
      setError(errorText)
      // Auto-retry after 2 seconds (matching old ApiDropdown behavior)
      const timer = setTimeout(() => {
        refetch?.()
      }, 2000)
      return () => clearTimeout(timer)
    } else {
      setError(undefined)
    }
  }, [isError, errorText, refetch])

  return {
    options,
    isLoading,
    error,
    refetch,
  }
}
```

**Acceptance Criteria:**
- [ ] Hook accepts `useDataHook` function
- [ ] Hook accepts `mapToOptions` transformer
- [ ] Returns `options`, `isLoading`, `error`, `refetch`
- [ ] Auto-retries on error (2 second delay)
- [ ] TypeScript generics for type safety
- [ ] Well documented with JSDoc

---

### TASK-API-003: Create Country Selector Example
**Priority:** High
**Effort:** 1.5 hours

**File:** `src/shared/ui/Combobox/examples/CountryCombobox.tsx`

**Target Code:**
```tsx
/**
 * CountryCombobox Example
 *
 * Drop-in replacement for ApiDropdown with country config
 */

import { Combobox } from '../Combobox'
import { useApiCombobox } from '../hooks/useApiCombobox'
import { useCountries } from '@/shared/hooks/useCountries'

interface CountryComboboxProps {
  value?: string
  onChange: (value: string | undefined) => void
  label?: string
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export function CountryCombobox({
  value,
  onChange,
  label = 'Country',
  error,
  required,
  disabled,
  className,
}: CountryComboboxProps) {
  const { options, isLoading, error: apiError } = useApiCombobox({
    useDataHook: useCountries,
    mapToOptions: (countries) =>
      countries.map((c) => ({
        value: c.code,
        label: c.name,
        description: `+${c.phoneCode}`,
        icon: <span className={`fi fi-${c.code.toLowerCase()}`} />,
        searchText: `${c.name} ${c.code}`,
      })),
    errorText: 'Failed to load countries',
  })

  return (
    <Combobox
      options={options}
      value={value}
      onChange={onChange}
      label={label}
      error={error || apiError}
      required={required}
      disabled={disabled}
      isLoading={isLoading}
      placeholder="Select country..."
      clearable
      searchable
      className={className}
    />
  )
}
```

**Acceptance Criteria:**
- [ ] Component created and exported
- [ ] Uses `useApiCombobox` hook
- [ ] Accepts same props as old ApiDropdown usage
- [ ] Shows flag icons
- [ ] Shows phone codes as descriptions
- [ ] Loading state works
- [ ] Error handling works

---

### TASK-API-004: Create Currency Selector Example
**Priority:** Medium
**Effort:** 1 hour

**File:** `src/shared/ui/Combobox/examples/CurrencyCombobox.tsx`

**Similar to TASK-API-003** but for currencies

**Acceptance Criteria:**
- [ ] Component created
- [ ] Uses currency API hook
- [ ] Shows currency symbols
- [ ] Shows currency names
- [ ] Searchable by code and name

---

### TASK-API-005: Migrate First ApiDropdown Usage
**Priority:** High
**Effort:** 1 hour per file

**Process:**
1. Find file with ApiDropdown usage
2. Replace `ApiDropdown` import with `Combobox`
3. Extract data fetching to separate hook or use existing
4. Transform options using `mapToOptions`
5. Replace component usage
6. Test functionality
7. Remove ApiDropdown config

**Example Migration:**

**BEFORE:**
```tsx
import { ApiDropdown, countryDropdownConfig } from '@/shared/ui/ApiDropdown'

<ApiDropdown
  config={countryDropdownConfig}
  value={country}
  onSelect={setCountry}
  allowClear
  error={!!errors.country}
/>
```

**AFTER:**
```tsx
import { CountryCombobox } from '@/shared/ui/Combobox/examples'

<CountryCombobox
  value={country}
  onChange={setCountry}
  error={errors.country}
  required
/>
```

**Acceptance Criteria:**
- [ ] Import updated
- [ ] Config removed
- [ ] Props migrated correctly
- [ ] Functionality preserved
- [ ] No console errors
- [ ] Visual appearance matches

---

### TASK-API-006: Delete ApiDropdown Component
**Priority:** Low (after all migrations)
**Effort:** 30 minutes

**Actions:**
1. Ensure all ApiDropdown usages migrated
2. Delete `src/shared/ui/ApiDropdown/` folder
3. Remove from `src/shared/ui/index.ts` exports
4. Update `.component-rules.json` (remove ApiDropdown exclusions)
5. Run linter to ensure no broken imports
6. Commit with descriptive message

**Acceptance Criteria:**
- [ ] ApiDropdown folder deleted
- [ ] No import errors
- [ ] All tests pass
- [ ] Linter passes
- [ ] Git commit created

---

## 📚 Storybook Integration

### Overview
Create comprehensive Storybook stories for both PhoneInput and Combobox components.

---

### TASK-STORY-001: Setup Storybook Configuration
**Priority:** High
**Effort:** 1 hour

**File:** `.storybook/preview.tsx`

**Actions:**
1. Ensure Storybook is installed and configured
2. Add global styles import
3. Add React Query provider decorator
4. Add theme decorator
5. Configure viewport settings

**Target Code:**
```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Preview } from '@storybook/react'
import '../src/index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
})

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1440px', height: '900px' },
        },
      },
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div className="p-8">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
}

export default preview
```

**Acceptance Criteria:**
- [ ] Storybook runs without errors
- [ ] Global styles loaded
- [ ] React Query provider added
- [ ] Viewports configured
- [ ] Decorators working

---

### TASK-STORY-002: Create Combobox Stories
**Priority:** High
**Effort:** 3 hours

**File:** `src/shared/ui/Combobox/Combobox.stories.tsx`

**Target Code:**
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Globe, DollarSign, User } from 'lucide-react'
import { Combobox } from './Combobox'

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Advanced dropdown component with search, loading states, and full accessibility support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    clearable: { control: 'boolean' },
    searchable: { control: 'boolean' },
    isLoading: { control: 'boolean' },
  },
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

// Sample data
const countries = [
  { value: 'US', label: 'United States', description: '+1', icon: <Globe className="w-4 h-4" /> },
  { value: 'GB', label: 'United Kingdom', description: '+44', icon: <Globe className="w-4 h-4" /> },
  { value: 'CA', label: 'Canada', description: '+1', icon: <Globe className="w-4 h-4" /> },
  { value: 'AU', label: 'Australia', description: '+61', icon: <Globe className="w-4 h-4" /> },
  { value: 'GR', label: 'Greece', description: '+30', icon: <Globe className="w-4 h-4" /> },
]

const currencies = [
  { value: 'USD', label: 'US Dollar', description: '$', icon: <DollarSign className="w-4 h-4" /> },
  { value: 'EUR', label: 'Euro', description: '€', icon: <DollarSign className="w-4 h-4" /> },
  { value: 'GBP', label: 'British Pound', description: '£', icon: <DollarSign className="w-4 h-4" /> },
  { value: 'JPY', label: 'Japanese Yen', description: '¥', icon: <DollarSign className="w-4 h-4" /> },
]

// Default story
export const Default: Story = {
  args: {
    options: countries,
    placeholder: 'Select country...',
    label: 'Country',
  },
  render: (args) => {
    const [value, setValue] = useState<string>()
    return <Combobox {...args} value={value} onChange={setValue} />
  },
}

// With icons and descriptions
export const WithIconsAndDescriptions: Story = {
  args: {
    options: countries,
    placeholder: 'Select country...',
    label: 'Country',
    clearable: true,
    searchable: true,
  },
  render: (args) => {
    const [value, setValue] = useState<string>()
    return <Combobox {...args} value={value} onChange={setValue} />
  },
}

// Required field
export const Required: Story = {
  args: {
    options: currencies,
    placeholder: 'Select currency...',
    label: 'Currency',
    required: true,
    clearable: true,
  },
  render: (args) => {
    const [value, setValue] = useState<string>()
    return <Combobox {...args} value={value} onChange={setValue} />
  },
}

// With error
export const WithError: Story = {
  args: {
    options: countries,
    placeholder: 'Select country...',
    label: 'Country',
    error: 'Country is required',
    required: true,
  },
  render: (args) => {
    const [value, setValue] = useState<string>()
    return <Combobox {...args} value={value} onChange={setValue} />
  },
}

// Loading state
export const Loading: Story = {
  args: {
    options: [],
    placeholder: 'Loading...',
    label: 'Country',
    isLoading: true,
  },
  render: (args) => {
    const [value, setValue] = useState<string>()
    return <Combobox {...args} value={value} onChange={setValue} />
  },
}

// Disabled
export const Disabled: Story = {
  args: {
    options: countries,
    placeholder: 'Select country...',
    label: 'Country',
    disabled: true,
  },
  render: (args) => {
    const [value, setValue] = useState<string>('US')
    return <Combobox {...args} value={value} onChange={setValue} />
  },
}

// Not searchable
export const NotSearchable: Story = {
  args: {
    options: countries,
    placeholder: 'Select country...',
    label: 'Country',
    searchable: false,
  },
  render: (args) => {
    const [value, setValue] = useState<string>()
    return <Combobox {...args} value={value} onChange={setValue} />
  },
}

// Not clearable
export const NotClearable: Story = {
  args: {
    options: countries,
    placeholder: 'Select country...',
    label: 'Country',
    clearable: false,
  },
  render: (args) => {
    const [value, setValue] = useState<string>('US')
    return <Combobox {...args} value={value} onChange={setValue} />
  },
}

// Server-side search simulation
export const ServerSideSearch: Story = {
  render: () => {
    const [value, setValue] = useState<string>()
    const [options, setOptions] = useState(countries)
    const [isSearching, setIsSearching] = useState(false)

    const handleSearch = async (searchTerm: string) => {
      setIsSearching(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      const filtered = countries.filter((c) =>
        c.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setOptions(filtered)
      setIsSearching(false)
    }

    return (
      <Combobox
        options={options}
        value={value}
        onChange={setValue}
        onSearch={handleSearch}
        label="Search Countries"
        placeholder="Type to search..."
        isLoading={isSearching}
        searchable
      />
    )
  },
}
```

**Acceptance Criteria:**
- [ ] All stories render correctly
- [ ] Interactive controls work
- [ ] Default story shows basic usage
- [ ] Error state story shows validation
- [ ] Loading state story shows spinner
- [ ] Server-side search story works
- [ ] Autodocs generated
- [ ] All props documented

---

### TASK-STORY-003: Create PhoneInput Stories
**Priority:** High
**Effort:** 2 hours

**File:** `src/shared/ui/PhoneInput/PhoneInput.stories.tsx`

**Target Code:**
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { PhoneInput } from './PhoneInput'
import { Label } from '@/shared/ui/shadcn/label'

const meta = {
  title: 'Components/PhoneInput',
  component: PhoneInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'International phone number input with country selection and validation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    validateOnBlur: { control: 'boolean' },
    showValidation: { control: 'boolean' },
    defaultCountry: { control: 'text' },
  },
} satisfies Meta<typeof PhoneInput>

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  args: {
    label: 'Phone Number',
    placeholder: 'Enter phone number',
    defaultCountry: 'GR',
  },
  render: (args) => {
    const [phone, setPhone] = useState('')
    return (
      <div className="w-[400px]">
        <PhoneInput {...args} value={phone} onChange={setPhone} />
      </div>
    )
  },
}

// Required field
export const Required: Story = {
  args: {
    label: 'Phone Number',
    required: true,
    defaultCountry: 'US',
  },
  render: (args) => {
    const [phone, setPhone] = useState('')
    return (
      <div className="w-[400px]">
        <Label htmlFor="phone">
          Phone Number <span className="text-destructive">*</span>
        </Label>
        <PhoneInput {...args} id="phone" value={phone} onChange={setPhone} />
      </div>
    )
  },
}

// With error
export const WithError: Story = {
  args: {
    label: 'Phone Number',
    error: 'Invalid phone number',
    defaultCountry: 'GB',
  },
  render: (args) => {
    const [phone, setPhone] = useState('123')
    return (
      <div className="w-[400px]">
        <PhoneInput {...args} value={phone} onChange={setPhone} />
      </div>
    )
  },
}

// With validation
export const WithValidation: Story = {
  args: {
    label: 'Phone Number',
    validateOnBlur: true,
    showValidation: true,
    defaultCountry: 'GR',
  },
  render: (args) => {
    const [phone, setPhone] = useState('')
    const [error, setError] = useState<string>()

    const handleValidation = (isValid: boolean, validationError?: string) => {
      setError(validationError)
    }

    return (
      <div className="w-[400px]">
        <PhoneInput
          {...args}
          value={phone}
          onChange={setPhone}
          onValidationChange={handleValidation}
          error={error}
        />
      </div>
    )
  },
}

// Disabled
export const Disabled: Story = {
  args: {
    label: 'Phone Number',
    disabled: true,
    defaultCountry: 'US',
  },
  render: (args) => {
    const [phone, setPhone] = useState('+1234567890')
    return (
      <div className="w-[400px]">
        <PhoneInput {...args} value={phone} onChange={setPhone} />
      </div>
    )
  },
}

// Different default countries
export const Greece: Story = {
  args: {
    label: 'Greek Phone Number',
    defaultCountry: 'GR',
  },
  render: (args) => {
    const [phone, setPhone] = useState('')
    return (
      <div className="w-[400px]">
        <PhoneInput {...args} value={phone} onChange={setPhone} />
      </div>
    )
  },
}

export const UnitedKingdom: Story = {
  args: {
    label: 'UK Phone Number',
    defaultCountry: 'GB',
  },
  render: (args) => {
    const [phone, setPhone] = useState('')
    return (
      <div className="w-[400px]">
        <PhoneInput {...args} value={phone} onChange={setPhone} />
      </div>
    )
  },
}

export const Japan: Story = {
  args: {
    label: 'Japanese Phone Number',
    defaultCountry: 'JP',
  },
  render: (args) => {
    const [phone, setPhone] = useState('')
    return (
      <div className="w-[400px]">
        <PhoneInput {...args} value={phone} onChange=({setPhone} />
      </div>
    )
  },
}
```

**Acceptance Criteria:**
- [ ] All stories render correctly
- [ ] Country selector works
- [ ] Phone validation works
- [ ] Error display works
- [ ] Disabled state works
- [ ] Different countries work
- [ ] Flag icons display
- [ ] Autodocs generated

---

### TASK-STORY-004: Create Form Integration Story
**Priority:** Medium
**Effort:** 2 hours

**File:** `src/shared/ui/Combobox/Combobox.formintegration.stories.tsx`

**Shows React Hook Form integration**

**Acceptance Criteria:**
- [ ] React Hook Form example
- [ ] Validation example
- [ ] Multiple comboboxes in form
- [ ] Submit handler example
- [ ] Error handling example

---

### TASK-STORY-005: Add Accessibility Testing to Stories
**Priority:** Medium
**Effort:** 1.5 hours

**Install:**
```bash
npm install --save-dev @storybook/addon-a11y
```

**File:** `.storybook/main.ts`

**Add addon:**
```ts
addons: [
  '@storybook/addon-a11y',
  // ... other addons
]
```

**Acceptance Criteria:**
- [ ] a11y addon installed
- [ ] Violations panel shows
- [ ] All stories pass accessibility
- [ ] ARIA attributes validated
- [ ] Keyboard navigation tested
- [ ] Color contrast checked

---

## 📊 Progress Tracking

### PhoneInput Migration Progress
- [x] TASK-PHONE-001: Update trigger styling ✅
- [x] TASK-PHONE-002: Update country selector styling ✅
- [x] TASK-PHONE-003: Update phone input field styling ✅
- [x] TASK-PHONE-004: Replace custom label with shadcn Label ✅
- [x] TASK-PHONE-005: Update dropdown portal styling ✅
- [x] TASK-PHONE-006: Update search input styling ✅
- [x] TASK-PHONE-007: Update country option styling ✅
- [x] TASK-PHONE-008: Update error message styling ✅
- [x] TASK-PHONE-009: Remove dropdown-styles.config dependency ✅
- [x] TASK-PHONE-010: Add mobile responsive heights ✅

**Total: 10 tasks, ~14.5 hours** ✅ **COMPLETED**

### ApiDropdown Migration Progress
- [ ] TASK-API-001: Identify all ApiDropdown usages
- [ ] TASK-API-002: Create migration helper hook
- [ ] TASK-API-003: Create Country Selector example
- [ ] TASK-API-004: Create Currency Selector example
- [ ] TASK-API-005: Migrate first ApiDropdown usage
- [ ] TASK-API-006: Delete ApiDropdown component

**Total: 6 tasks, ~7.5 hours**

### Storybook Integration Progress
- [ ] TASK-STORY-001: Setup Storybook configuration
- [ ] TASK-STORY-002: Create Combobox stories
- [ ] TASK-STORY-003: Create PhoneInput stories
- [ ] TASK-STORY-004: Create form integration story
- [ ] TASK-STORY-005: Add accessibility testing

**Total: 5 tasks, ~9.5 hours**

---

## 🎯 Summary

**Total Tasks:** 21
**Total Estimated Effort:** ~31.5 hours
**Priority Distribution:**
- High: 12 tasks (~21 hours)
- Medium: 7 tasks (~9 hours)
- Low: 2 tasks (~1.5 hours)

**Recommended Order:**
1. PhoneInput styling migration (TASK-PHONE-001 through TASK-PHONE-010)
2. Storybook setup and stories (TASK-STORY-001, 002, 003)
3. ApiDropdown migration prep (TASK-API-001, 002, 003)
4. ApiDropdown usage migration (TASK-API-004, 005, 006)
5. Remaining Storybook (TASK-STORY-004, 005)

---

**Last Updated:** 2025-01-29
**Status:** Ready for Implementation
