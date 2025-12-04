# Round Dashboard UI/UX Rules

## Design System Overview

Round Dashboard uses **Shadcn UI with Zinc Dark Theme** as the foundation for all UI components.

## Color System

### Theme Variables (HSL format)

Always use CSS variables from `src/index.css`. Never hardcode colors.

**Primary Colors (Dark Mode):**
- `--background` - Root background, sidebar (0 0% 3.9%) - **darkest**
- `--foreground` - Main text color (0 0% 98%)
- `--card` - Card/main content background (0 0% 7%) - **middle**
- `--card-foreground` - Card text (0 0% 98%)
- `--popover` - Dropdown/popover background (0 0% 9%) - **lightest (elevated)**
- `--popover-foreground` - Popover text (0 0% 98%)
- `--primary` - Primary accent (0 0% 98%)
- `--primary-foreground` - Primary text (240 5.9% 10%)

**Dark Mode Elevation Hierarchy:**
```
Background (3.9%) < Card (7%) < Popover (9%)
     ↓              ↓            ↓
  Sidebar     Main content   Dropdowns/Menus
```

This creates a subtle "lift" effect where floating elements (dropdowns, popovers, context menus) appear elevated above the content they overlay.

**Semantic Colors:**
- `--muted` / `--muted-foreground` - Muted/subtle elements
- `--accent` / `--accent-foreground` - Accent elements
- `--destructive` / `--destructive-foreground` - Errors/dangerous actions
- `--border` - Default borders
- `--input` - Form inputs
- `--ring` - Focus rings

**Legacy Colors (for backward compatibility):**
- `--bg`, `--bg-subtle`, `--bg-raised`, `--bg-hover`
- `--fg`, `--fg-muted`, `--fg-subtle`

### Usage in Components

```tsx
// ✅ Correct - Use Tailwind classes with CSS variables
<div className="bg-card text-foreground border-border">
  <p className="text-muted-foreground">Secondary text</p>
</div>

// ❌ Wrong - Never hardcode colors
<div style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
```

### Semantic Color Token Mapping

**CRITICAL:** Never use raw Tailwind color classes. Always use semantic tokens.

| Intent | Semantic Token | ❌ Do NOT Use |
|--------|---------------|---------------|
| Success/Active | `text-success`, `bg-success/10` | `text-emerald-*`, `text-green-*` |
| Error/Danger | `text-destructive`, `bg-destructive/10` | `text-red-*` |
| Warning | `text-warning`, `bg-warning/10` | `text-yellow-*`, `text-amber-*` |
| Primary brand | `text-primary`, `bg-primary/10` | `text-blue-*` |
| Secondary | `text-secondary`, `bg-secondary/10` | `text-cyan-*`, `text-sky-*` |
| Accent | `text-accent`, `bg-accent/10` | `text-purple-*`, `text-violet-*` |
| Muted/Disabled | `text-muted-foreground` | `text-gray-*`, `text-zinc-*` |
| Borders | `border-border` | `border-white/*`, `border-zinc-*` |

```tsx
// ✅ Correct - Semantic tokens
<span className="text-success">Active</span>
<span className="text-destructive">Error</span>
<div className="border-border">Content</div>

// ❌ Wrong - Raw Tailwind colors
<span className="text-emerald-500">Active</span>
<span className="text-red-500">Error</span>
<div className="border-white/10">Content</div>
```

## Typography

### Font Family
- Primary: `Inter` (imported from Google Fonts)
- System fallback: `system-ui, -apple-system, sans-serif`

### Font Sizes
- `text-xs` - 0.75rem (12px)
- `text-sm` - 0.875rem (14px) - **Base size**
- `text-base` - 0.875rem (14px)
- `text-lg` - 1rem (16px)
- `text-xl` - 1.125rem (18px)
- `text-2xl` - 1.25rem (20px)

### Font Weights
- `font-normal` - 400 (body text)
- `font-medium` - 500 (labels, emphasized text, **maximum weight for UI**)

**IMPORTANT:** Do NOT use `font-semibold` or `font-bold` in UI components. The maximum font weight is `font-medium` (500) for visual consistency. This applies to:

- Card titles and headers
- Modal titles
- Section headings
- Labels and emphasized text
- KPI values and metrics

### Letter Spacing
- `tracking-tight` - -0.01em (default for headings)
- `tracking-tighter` - -0.02em (large headings)

## Spacing & Layout

### Container Width
```tsx
// Page container
<div className="max-w-6xl mx-auto px-6 py-6">
  {/* content */}
</div>
```

### Vertical Spacing
- Use `space-y-{n}` on parent containers instead of `mt-*` on children
- Common values: `space-y-4`, `space-y-6`, `space-y-8`

### Horizontal Spacing
- Form fields: `space-x-4`
- Button groups: `space-x-2`

### Padding
- Cards: `p-6`
- Modals/Dialogs: `p-6`
- Inputs: `px-3 py-2`

## Component Patterns

### Cards

```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/shared/ui/shadcn/card'

<Card className="rounded-lg border border-border bg-card shadow-sm">
  <CardHeader>
    <h3 className="text-base font-medium text-foreground">Title</h3>
  </CardHeader>
  <CardContent>
    {/* content */}
  </CardContent>
</Card>
```

### Forms

Always use React Hook Form + Zod + Shadcn Form components:

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/shadcn/form'
import { Input } from '@/shared/ui/shadcn/input'
import { Button } from '@/shared/ui/shadcn/button'

const schema = z.object({
  email: z.string().email('Invalid email address')
})

const form = useForm({
  resolver: zodResolver(schema),
  mode: 'onSubmit',  // Validate on submit, not on blur
  reValidateMode: 'onChange'
})
```

### Buttons

```tsx
import { Button } from '@/shared/ui/shadcn/button'

// Primary action
<Button variant="default" size="default">Save</Button>

// Secondary action
<Button variant="secondary">Cancel</Button>

// Dangerous action
<Button variant="destructive">Delete</Button>

// Ghost/minimal
<Button variant="ghost">Close</Button>
```

**Button Sizing Standards:**

| Context | Size | Height | Usage |
|---------|------|--------|-------|
| Form submit buttons | `default` | h-9 (36px) | Save, Submit, Change Password |
| Page actions | `default` | h-9 (36px) | Create, Export, primary CTA |
| Inline/compact | `sm` | h-8 (32px) | Table row actions, inline edits |
| Icon-only | `icon` | h-9 w-9 | Toggle buttons, close buttons |

**IMPORTANT:** Do NOT use `size="sm"` for form submit buttons. Form actions should use default size for better accessibility and visual hierarchy.

**Button Group Spacing:**

```tsx
// ✅ Correct - gap-2 for button groups
<div className="flex justify-end gap-2">
  <Button variant="outline">Cancel</Button>
  <Button>Save</Button>
</div>

// ❌ Wrong - gap-3 is too wide
<div className="flex justify-end gap-3">
```

### Inputs

All input components use shared styles from `input-styles.ts` for consistency.

```tsx
import { Input } from '@/shared/ui/shadcn/input'
import { PasswordInput } from '@/shared/ui/shadcn/password-input'
import { Textarea } from '@/shared/ui/shadcn/textarea'

// Standard text input
<Input
  type="email"
  placeholder="Enter email"
  className="pl-10" // Only add position/spacing overrides
/>

// Password input with show/hide toggle
<PasswordInput
  placeholder="Enter password"
  autoComplete="current-password"
/>

// Multi-line text input
<Textarea
  placeholder="Enter description"
  rows={4}
/>
```

**Creating custom input components:**

```tsx
import { inputStyles, textareaStyles } from '@/shared/ui/shadcn/input-styles'
import { cn } from '@/shared/utils/cn'

// Use inputStyles for single-line inputs, textareaStyles for multi-line
<input className={cn(inputStyles, 'pr-10', className)} />
```

### Phone Input

```tsx
import { PhoneInput } from '@/shared/ui/PhoneInput'

<PhoneInput
  label="Phone Number"
  value={phone}
  onChange={setPhone}
  defaultCountry="US"
  validateOnBlur={true}
  error={serverError}
/>
```

### Tables

Use the comprehensive DataTable component with TanStack Table:

```tsx
import { DataTable } from '@/shared/ui/DataTable/DataTable'

<DataTable
  columns={columns}
  data={data}
  searchKey="email"
  pageSize={10}
  showPagination={true}
  showSearch={true}
/>
```

### Modals/Dialogs

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/shadcn/dialog'

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    {/* content */}
    <DialogFooter>
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm}>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Error Messages

Use the standard error state pattern with `AlertCircle` icon:

```tsx
import { AlertCircle } from 'lucide-react'

// Standard error message pattern
{error && (
  <div className="flex items-center gap-2 text-sm text-destructive">
    <AlertCircle className="h-4 w-4" />
    <span>{error}</span>
  </div>
)}

// Required field indicator
<Label>
  Email <span className="text-destructive">*</span>
</Label>
```

**Important:**

- ✅ Always use `text-destructive` for error text
- ✅ Use `AlertCircle` icon (h-4 w-4) before error message
- ✅ Use `flex items-center gap-2 text-sm` layout
- ❌ Never use `text-red-*` hardcoded colors
- ❌ Never use `text-primary` for errors

## Scrollbar Styling

All scrollable containers MUST use the custom scrollbar styling for visual consistency.

### Standard Scrollbar Classes

```tsx
// For vertical scrollbars (most common)
className={cn(
  "overflow-y-auto",
  "[&::-webkit-scrollbar]:w-2",
  "[&::-webkit-scrollbar-track]:bg-transparent",
  "[&::-webkit-scrollbar-thumb]:bg-muted-foreground/20",
  "[&::-webkit-scrollbar-thumb]:rounded-full",
  "[&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/40"
)}

// For horizontal scrollbars (tables, etc.)
className={cn(
  "overflow-x-auto",
  "[&::-webkit-scrollbar]:h-2",
  "[&::-webkit-scrollbar-track]:bg-transparent",
  "[&::-webkit-scrollbar-thumb]:bg-muted-foreground/20",
  "[&::-webkit-scrollbar-thumb]:rounded-full",
  "[&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/40"
)}
```

### Where to Apply

| Component Type | Location | Notes |
|----------------|----------|-------|
| Main content area | `DashboardLayout.tsx` | Inner scrollable div |
| Sheet/Drawer body | `SheetBody`, `DialogBody` | Already styled in shadcn components |
| Dropdown lists | `Combobox`, `Select`, `PhoneInput` | Already styled |
| Tables | `Table` wrapper div | Horizontal scroll |
| Command palette | `CommandList` | Already styled |

### Components with Built-in Scrollbar Styling

These shadcn components already include proper scrollbar styling:

- `SheetBody` - Sheet/drawer content area
- `DialogBody` - Dialog content area
- `SelectContent` - Select dropdown
- `CommandList` - Command palette list
- `Table` - Table wrapper (horizontal)

### Rules

✅ **ALWAYS** use the custom scrollbar classes on scrollable containers
✅ **ALWAYS** use `w-2` for vertical scrollbars, `h-2` for horizontal
✅ **ALWAYS** use `bg-muted-foreground/20` for thumb color
✅ **ALWAYS** use `rounded-full` for thumb shape
❌ **NEVER** use default browser scrollbars
❌ **NEVER** use the legacy `scrollbar-thin` class (deprecated)
❌ **NEVER** mix scrollbar styles (all must be consistent)

### Preventing Double Scrollbars

When creating scrollable containers, ensure only ONE element has scroll:

```tsx
// ✅ Correct - Only inner div scrolls
<div className="h-screen overflow-hidden">
  <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 ...">
    {content}
  </div>
</div>

// ❌ Wrong - Both containers can scroll
<div className="min-h-screen overflow-auto">
  <div className="overflow-y-auto">
    {content}
  </div>
</div>
```

## Don't Do This

❌ Inline styles (except rare edge cases)
❌ Hardcoded hex/rgb colors
❌ Multiple CSS frameworks (no MUI, Chakra, etc.)
❌ Inconsistent spacing (use space-y-* pattern)
❌ Missing dark theme support
❌ Non-semantic HTML
❌ Form validation on blur (use onSubmit)
❌ Default browser scrollbars (use custom styling)
