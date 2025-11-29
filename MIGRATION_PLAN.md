# Aggressive Shadcn Migration Plan

## Goal
Force 100% Shadcn UI usage. Remove ALL custom wrappers except DataTable (TanStack integration) and PhoneInput (complex validation). Break everything and fix it with pure Shadcn.

## Components to DELETE (30+)

### Simple Wrappers - DELETE IMMEDIATELY
- `ActionButton` → Use `Button` from shadcn
- `Alert` → Use `Alert` from shadcn
- `Avatar` → Use `Avatar` from shadcn
- `Badge` → Use `Badge` from shadcn
- `Button` → Use `Button` from shadcn (remove wrapper)
- `Card` → Use `Card` from shadcn (remove stats/feature variants)
- `Checkbox` → Use `Checkbox` from shadcn
- `IconBox` → Delete, use inline icons
- `LoadingSpinner` → Use `Skeleton` from shadcn
- `RadioGroup` → Use `RadioGroup` from shadcn
- `SearchInput` → Use `Input` with search icon
- `SectionHeader` → Delete, use inline headings
- `Select` → Use `Select` from shadcn
- `Skeleton` → Use `Skeleton` from shadcn
- `Table` → Use `Table` from shadcn
- `Textarea` → Use `Textarea` from shadcn
- `Toggle` → Use `Switch` from shadcn
- `ViewModeToggle` → Delete, use inline buttons

### Input Wrappers - REPLACE WITH SHADCN FORM PATTERN
- `AuthInput` → Use `FormField` + `Input` from shadcn
- `FormInput` → Use `FormField` + `Input` from shadcn
- `Input` → Use `Input` from shadcn
- `DateInput` → Use `Input type="date"` from shadcn
- `TimeInput` → Use `Input type="time"` from shadcn
- `NumberInput` → Use `Input type="number"` from shadcn
- `MaskedInput` → Use `Input` with react-input-mask

### Dropdown Wrappers - REPLACE WITH SHADCN
- `ApiDropdown` → Use `Select` or `Combobox` from shadcn
- `UiDropdown` → Use `DropdownMenu` from shadcn
- `Autocomplete` → Use `Combobox` from shadcn (need to install)

### Layout Wrappers - DELETE
- `Modal` → Use `Dialog` from shadcn
- `AnimatedContainer` → Use framer-motion directly
- `EmptyState` → Use inline components
- `PageHeader` → Use inline layout

### Special Components - KEEP ONLY THESE
- `DataTable` ✅ KEEP - Complex TanStack integration
- `PhoneInput` ✅ KEEP - International validation logic
- `AuthLogo` ✅ KEEP - App branding
- `AddressFormGroup` ✅ KEEP - Complex multi-field logic
- `FileInput` ✅ KEEP - File upload handling
- `PasswordStrengthIndicator` ✅ KEEP - Security logic

## Migration Strategy

### Phase 1: Delete Simple Wrappers (NOW)
1. Delete wrapper directories
2. Find/replace all imports
3. Let things break
4. Fix with direct Shadcn imports

### Phase 2: Refactor Auth Pages
1. Remove all FormInput/AuthInput
2. Use React Hook Form + Zod + FormField pattern
3. Pure Shadcn components only

### Phase 3: Refactor All Pages
1. Customer pages
2. Onboarding wizard
3. Dashboard
4. Settings

### Phase 4: Cleanup
1. Delete all unused wrapper directories
2. Update component-strategy.md
3. Remove wrapper references from skill docs

## New Import Pattern

### Before (OLD - DELETE THIS)
```tsx
import { FormInput } from '@/shared/ui/Input/FormInput'
import { Button } from '@/shared/ui/Button/Button'
import { Card } from '@/shared/ui/Card/Card'
```

### After (NEW - FORCE THIS)
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/ui/shadcn/form'
import { Input } from '@/shared/ui/shadcn/input'
import { Button } from '@/shared/ui/shadcn/button'
import { Card, CardHeader, CardContent } from '@/shared/ui/shadcn/card'
```

## Form Pattern (ENFORCE THIS)

```tsx
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { email: '', password: '' }
})

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input {...field} type="email" placeholder="you@example.com" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Submit</Button>
  </form>
</Form>
```

## Breaking Changes - ACCEPTED
- All existing forms will break
- All buttons will break
- All cards will break
- All inputs will break
- All modals will break

## Fix Strategy
- Rewrite everything with pure Shadcn
- Use ui-ux-shadcn skill for guidance
- Follow SKILL.md hard rules
- Zero tolerance for wrappers
