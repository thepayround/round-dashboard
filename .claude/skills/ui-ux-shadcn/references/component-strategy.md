# Component Strategy Guide

## UPDATED: Aggressive Shadcn Migration Complete

**All custom wrappers have been deleted.** This guide now shows migration patterns from old wrappers to pure Shadcn.

## When to Use Direct Shadcn vs Custom Wrappers

## ✅ Use Direct Shadcn Imports

Use these components directly from `@/shared/ui/shadcn/` without wrappers:

### Layout Components
```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/shared/ui/shadcn/card'
import { Separator } from '@/shared/ui/shadcn/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/shadcn/tabs'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/ui/shadcn/accordion'
```

**Why?** These are pure layout primitives with no business logic needed.

### Feedback Components
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/shadcn/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel } from '@/shared/ui/shadcn/alert-dialog'
import { Popover, PopoverTrigger, PopoverContent } from '@/shared/ui/shadcn/popover'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/shared/ui/shadcn/tooltip'
import { Skeleton } from '@/shared/ui/shadcn/skeleton'
```

**Why?** One-off usage patterns with composition-based APIs.

### Display Components
```tsx
import { Badge } from '@/shared/ui/shadcn/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui/shadcn/avatar'
```

**Why?** Simple display components with no complex state.

## ✅ Use Custom Wrappers

Use these from `@/shared/ui/` for enhanced functionality:

### Form Components - ALWAYS USE WRAPPERS
```tsx
import { FormInput } from '@/shared/ui/Input/FormInput'
import { AuthInput } from '@/shared/ui/Input/AuthInput'
import { SearchInput } from '@/shared/ui/Input/SearchInput'
import { NumberInput } from '@/shared/ui/Input/NumberInput'
import { DateInput } from '@/shared/ui/Input/DateInput'
import { TimeInput } from '@/shared/ui/Input/TimeInput'
import { PhoneInput } from '@/shared/ui/Input/PhoneInput'
import { MaskedInput } from '@/shared/ui/Input/MaskedInput'
```

**Why?**
- Built-in label + error message handling
- Password visibility toggle
- Auto-save functionality
- Input masking & formatting
- International phone validation
- Number formatting (currency, percentages)
- Autofill security fixes

**Don't do this:**
```tsx
// ❌ Don't use raw Shadcn Input for forms
import { Input } from '@/shared/ui/shadcn/input'
<Input type="email" />
```

**Do this:**
```tsx
// ✅ Use FormInput wrapper
import { FormInput } from '@/shared/ui/Input/FormInput'
<FormInput name="email" label="Email" type="email" />
```

### Button Components - USE WRAPPERS FOR LOADING STATES
```tsx
import { Button } from '@/shared/ui/Button/Button'
import { IconButton } from '@/shared/ui/Button/IconButton'
import { RoundButton } from '@/shared/ui/Button/RoundButton'
```

**Why?**
- Built-in loading spinner
- Icon positioning (left/right)
- Variant mapping for legacy code
- Consistent sizing across app

**Example:**
```tsx
<Button loading={isSubmitting} icon={<Save />} iconPosition="left">
  Save Changes
</Button>
```

### Dropdown Components - USE WRAPPERS FOR COMPLEX DATA
```tsx
import { UiDropdown } from '@/shared/ui/Dropdown/UiDropdown'
import { ApiDropdown } from '@/shared/ui/Dropdown/ApiDropdown'
import { Select } from '@/shared/ui/Select/Select'
```

**Why?**
- Portal rendering (z-index management)
- Search/filter functionality
- Async data loading
- Multi-select support
- Virtual scrolling for large lists
- Keyboard navigation

**Use ApiDropdown when:**
- Data comes from an API endpoint
- Need async loading states
- Need search/filter with debouncing

**Use UiDropdown when:**
- Static data
- Need custom portal positioning
- Complex dropdown layouts

### Table Components - ALWAYS USE WRAPPER
```tsx
import { DataTable } from '@/shared/ui/DataTable/DataTable'
```

**Why?**
- TanStack Table integration
- Built-in pagination
- Sorting & filtering
- Row selection
- Search functionality
- Column visibility toggle
- Export functionality

**Don't do this:**
```tsx
// ❌ Don't build tables from scratch
import { Table, TableHeader, TableBody } from '@/shared/ui/shadcn/table'
```

**Do this:**
```tsx
// ✅ Use DataTable wrapper
import { DataTable } from '@/shared/ui/DataTable/DataTable'
<DataTable columns={columns} data={data} searchKey="email" />
```

### Modal Component - USE WRAPPER
```tsx
import { Modal } from '@/shared/ui/Modal/Modal'
```

**Why?**
- Sidebar-aware positioning
- Close button included
- Proper z-index layering
- Escape key handling
- Click-outside handling

### Specialized Components
```tsx
import { PageHeader } from '@/shared/ui/PageHeader'
import { PasswordStrengthIndicator } from '@/shared/ui/PasswordStrengthIndicator'
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Pagination } from '@/shared/ui/Pagination'
```

**Why?** App-specific business logic and consistent UX patterns.

## Component Decision Tree

```
Need a component?
│
├─ Is it a FORM INPUT?
│  └─ ✅ Use FormInput/AuthInput wrapper
│
├─ Is it a TABLE?
│  └─ ✅ Use DataTable wrapper
│
├─ Is it a DROPDOWN with data?
│  └─ ✅ Use ApiDropdown/UiDropdown wrapper
│
├─ Is it a BUTTON with loading/icons?
│  └─ ✅ Use Button/IconButton wrapper
│
├─ Is it a LAYOUT primitive? (Card, Tabs, Accordion)
│  └─ ✅ Use direct Shadcn import
│
├─ Is it a one-off DIALOG/MODAL?
│  └─ ✅ Use direct Shadcn Dialog
│
└─ Need sidebar-aware modal?
   └─ ✅ Use Modal wrapper
```

## Migration Strategy

### For New Features
1. Always use FormInput/AuthInput for forms
2. Always use DataTable for tables
3. Use direct Shadcn for dialogs/popovers
4. Use Button wrapper when you need loading states

### For Existing Pages
1. Keep current wrappers (they add value)
2. Only migrate if refactoring anyway
3. Update imports to use consistent patterns
4. Test accessibility after migration

## Anti-Patterns to Avoid

❌ **Don't create new wrappers** for components that don't need logic:
```tsx
// ❌ Bad
export const MyBadge = ({ children }: Props) => {
  return <Badge>{children}</Badge>
}
```

❌ **Don't bypass form wrappers** to use raw Shadcn inputs:
```tsx
// ❌ Bad - missing label, error handling
<Input name="email" />

// ✅ Good
<FormInput name="email" label="Email" />
```

❌ **Don't build tables manually** when DataTable exists:
```tsx
// ❌ Bad - reinventing the wheel
<Table>
  <TableHeader>...</TableHeader>
  <TableBody>
    {data.map(row => <TableRow>...</TableRow>)}
  </TableBody>
</Table>

// ✅ Good
<DataTable columns={columns} data={data} />
```

## Summary

**Golden Rule:** Use wrappers for **stateful, interactive, or form-related** components. Use direct Shadcn for **simple layout and display** components.

Our custom wrappers exist because they provide real value:
- Form integration (labels, validation, errors)
- Accessibility (ARIA, focus management)
- Complex interactions (async data, search, filtering)
- Loading states and animations
- Business logic (phone validation, formatting)
- Consistent UX patterns across the app
