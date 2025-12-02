# UI/UX Standards for Round Dashboard

**Last Updated:** November 29, 2025

This document outlines the UI/UX standards for all pages in the Round Dashboard application. Following these standards ensures consistency, performance, and quality across the entire application.

---

## Authentication Pages Standards

### Layout Requirements

#### Container Dimensions
All authentication pages (login, signup, password reset, etc.) must use:

```tsx
// ✅ STANDARD: AuthLayout container
<div className="h-screen w-screen flex items-center justify-center p-6 overflow-hidden">
  {/* Content */}
</div>
```

**Requirements:**
- Use `h-screen` (not `min-h-screen`) to prevent scrollbars
- Use `w-screen` for full viewport width
- Add `overflow-hidden` to prevent any scrolling
- Padding: `p-6` for consistent spacing

#### Form Card Width

```tsx
// ✅ STANDARD: Form card width
<motion.div className="w-full max-w-sm">
  <Card>{/* Form content */}</Card>
</motion.div>
```

**Requirements:**
- Maximum width: `max-w-sm` (384px)
- NOT `max-w-md` or `max-w-lg`
- Ensures consistent, compact form layout

### Logo Standards

#### Logo Positioning

```tsx
// ✅ STANDARD: Fixed logo in top-left corner
<div className="fixed top-6 left-6 md:top-10 md:left-10 z-50">
  <Link to="/" className="inline-block transition-opacity hover:opacity-80">
    <img
      src={WhiteLogo}
      alt="Round Logo"
      className="h-10 w-10"
      loading="eager"
      fetchPriority="high"
    />
  </Link>
</div>
```

**Requirements:**
- Position: `fixed` (not `absolute`)
- Location: Top-left corner with responsive padding
- Z-index: `z-50`
- Size: `h-10 w-10` (40px × 40px)
- **Must be outside framer-motion wrapper**

#### Logo Performance

**Image Attributes:**
```tsx
<img
  loading="eager"          // Load immediately
  fetchPriority="high"     // High priority in loading queue
/>
```

**HTML Preload (in index.html):**
```html
<link rel="preload" href="/src/assets/logos/white-logo.svg" as="image" type="image/svg+xml" />
```

**Requirements:**
- Preload logo in HTML `<head>`
- No entrance animations on logo
- Logo appears immediately on page load

---

## Component Height Standards

### Form Elements

All form elements must use consistent heights:

```tsx
// ✅ STANDARD: h-9 (36px) for all form elements
<Input className="h-9" />
<Button className="h-9" />
<Select className="h-9" />
<CommandInput className="h-9" />
```

**Applies to:**
- Input
- Button
- Select (SelectTrigger)
- Command (CommandInput)
- Combobox

**Exception:** Mobile touch targets can be `h-11` (44px) for accessibility

---

## Form Spacing Standards

### Field Spacing

```tsx
// ✅ STANDARD: Form field spacing
<form onSubmit={handleSubmit}>
  <div className="flex flex-col gap-8">
    {/* Form fields with 32px vertical spacing */}
    <div className="grid gap-2">
      <Label>Email</Label>
      <Input />
    </div>

    <div className="grid gap-2">
      <Label>Password</Label>
      <Input />
    </div>

    {/* Action buttons grouped with less spacing */}
    <div className="flex flex-col gap-4">
      <Button>Login</Button>
      <SocialLoginButton />
    </div>
  </div>
</form>
```

**Requirements:**
- Form fields: `gap-8` (32px vertical spacing)
- Within field group: `gap-2` (8px between label and input)
- Action buttons: `gap-4` (16px between buttons)

---

## Border Styling Standards

### Universal Border Color

```css
/* ✅ STANDARD: Global border color in index.css */
*,
::before,
::after {
  border-color: hsl(var(--border));
}
```

**Requirements:**
- Use `hsl(var(--border))` format (not just `var(--border)`)
- Ensures consistent borders across all components
- Prevents Tailwind's default white borders

---

## Card Styling Standards

### Border Radius

```tsx
// ✅ STANDARD: Card border radius
<Card className="rounded-xl border bg-card text-card-foreground shadow-sm">
```

**Requirements:**
- Border radius: `rounded-xl` (12px)
- Consistent across all cards
- Matches shadcn design system

---

## Animation Standards

### Form Card Animation

```tsx
// ✅ STANDARD: Framer Motion entrance animation
<motion.div
  initial={{ opacity: 0, y: 30, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{
    duration: 0.8,
    delay: 0.3,
    ease: 'easeOut',
  }}
  className="w-full max-w-sm"
>
  <Card>{/* Content */}</Card>
</motion.div>
```

**Requirements:**
- Duration: 0.8s
- Delay: 0.3s (gives time for logo to appear first)
- Easing: `easeOut`
- **Logo must NOT be inside this wrapper**

---

## Architecture Pattern

### AuthLayout Component

```tsx
// ✅ STANDARD: AuthLayout structure
export const AuthLayout = ({ children }: AuthLayoutProps = {}) => (
  <div className="h-screen w-screen flex items-center justify-center p-6 overflow-hidden">
    {/* Logo - outside motion.div */}
    <div className="fixed top-6 left-6 md:top-10 md:left-10 z-50">
      <Link to="/" className="inline-block transition-opacity hover:opacity-80">
        <img src={WhiteLogo} alt="Round Logo" className="h-10 w-10" loading="eager" fetchPriority="high" />
      </Link>
    </div>

    {/* Main Content - with animation */}
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
      className="w-full max-w-sm"
    >
      {children ?? <Outlet />}
    </motion.div>
  </div>
)
```

**Requirements:**
- Logo rendered in AuthLayout (not individual pages)
- Logo outside motion.div for instant display
- All auth pages wrapped with `withAuthLayout()` helper

---

## Text Color Hierarchy

### Muted vs Primary Text

```tsx
// ✅ STANDARD: Text color usage
<p className="text-muted-foreground">
  Don't have an account?{' '}
  <Link to="/signup" className="text-primary underline-offset-4 hover:underline">
    Sign up
  </Link>
</p>
```

**Requirements:**
- Question/prompt text: `text-muted-foreground`
- Link text: `text-primary`
- Creates clear visual hierarchy

---

## Checklist for New Auth Pages

When creating new authentication pages:

- [ ] Use AuthLayout wrapper (logo already included)
- [ ] Form card max width is `max-w-sm`
- [ ] All form elements use `h-9` height
- [ ] Form fields have `gap-8` spacing
- [ ] Action buttons have `gap-4` spacing
- [ ] Card uses `rounded-xl` border radius
- [ ] Page container uses `h-screen` (not `min-h-screen`)
- [ ] No scrollbars appear (`overflow-hidden`)
- [ ] Logo is NOT duplicated in page component
- [ ] Responsive breakpoints tested (mobile, tablet, desktop)
- [ ] Focus states visible on all interactive elements
- [ ] ARIA attributes for accessibility
- [ ] Loading states for async actions

---

## Data Table Standards

### DataTable Component

All data tables in the application must use the standardized `DataTable` component.

**Location:** `src/shared/ui/DataTable/`

```tsx
import { DataTable, SortableHeader } from '@/shared/ui/DataTable/DataTable'
```

**Requirements:**
- Use `DataTable` for all tabular data display
- Use `SortableHeader` for all sortable columns
- Mark essential columns as `enableHiding: false` (ID, Name, Actions)
- Default page size: `12` rows
- Enable pagination for datasets > 12 rows
- Use minimal scrollbar styling (automatically applied)

### Column Visibility

For tables with many columns:

```tsx
// ✅ STANDARD: External column visibility management
const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
  id: true,              // Essential - always visible
  name: true,            // Essential - always visible
  email: true,           // Important - visible by default
  phoneNumber: false,    // Optional - hidden by default
  createdDate: false,    // Optional - hidden by default
})
```

**Requirements:**
- Essential columns (ID, Name, Actions): `enableHiding: false`
- Important columns: Visible by default
- Optional columns: Hidden by default (user can show them)
- Integrate column toggle with `SearchFilterToolbar` when available

### Sortable Headers

```tsx
// ✅ STANDARD: Sortable column header
{
  accessorKey: 'name',
  header: ({ column }) => (
    <SortableHeader column={column}>Name</SortableHeader>
  ),
  cell: ({ row }) => row.original.name,
}
```

**Requirements:**
- All data columns should be sortable
- Actions column: `enableSorting: false`
- Use `SortableHeader` component (shows arrow indicators)

### Actions Column

```tsx
// ✅ STANDARD: Actions dropdown
{
  id: 'actions',
  header: () => <div className="text-right">Actions</div>,
  cell: ({ row }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Menu items */}
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  enableSorting: false,
  enableHiding: false,
}
```

**Requirements:**
- Right-aligned header and content
- Use `MoreHorizontal` icon (3 dots)
- Button: `variant="ghost"`, `size="icon"`, `h-8 w-8`
- Stop propagation: `onClick={(e) => e.stopPropagation()}`
- Actions: `enableSorting: false`, `enableHiding: false`

### Custom Cell Rendering

```tsx
// ✅ STANDARD: Badge for status
{
  accessorKey: 'status',
  header: ({ column }) => (
    <SortableHeader column={column}>Status</SortableHeader>
  ),
  cell: ({ row }) => {
    const status = row.original.status
    return (
      <Badge variant={status === 'active' ? 'default' : 'secondary'}>
        {status}
      </Badge>
    )
  }
}

// ✅ STANDARD: Monospace font for IDs/codes
{
  accessorKey: 'id',
  header: ({ column }) => (
    <SortableHeader column={column}>ID</SortableHeader>
  ),
  cell: ({ row }) => (
    <div className="text-sm text-muted-foreground font-mono">
      {row.original.id}
    </div>
  ),
  enableHiding: false,
}
```

### Horizontal Scrollbar

DataTable automatically applies minimal scrollbar styling:

```css
/* Applied via scrollbar-thin class */
.scrollbar-thin::-webkit-scrollbar {
  height: 6px;  /* Thin scrollbar */
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: hsl(var(--border));
  border-radius: 3px;
}
```

**Requirements:**
- Scrollbar: 6px height/width
- Color: Matches `--border` theme color
- Rounded corners: 3px
- Transparent track

### Loading States

```tsx
// ✅ STANDARD: Pass loading state to DataTable
<DataTable
  data={items}
  columns={columns}
  isLoading={loading || fetchingMore}
/>
```

**Requirements:**
- Always pass `isLoading` prop
- Show loading during initial fetch
- Show loading during refresh/refetch
- Built-in loading UI provided by DataTable

### Empty States

```tsx
// ✅ STANDARD: Custom empty message
<DataTable
  data={items}
  columns={columns}
  emptyMessage="No customers found. Try adjusting your filters."
/>
```

**Requirements:**
- Provide context-specific empty message
- Suggest next action when applicable
- Use `emptyMessage` prop

### Reference Implementation

See `src/features/customers/components/CustomerTable.tsx` for a complete production example demonstrating:
- 17 columns with smart visibility defaults
- Sortable headers on all data columns
- Row actions dropdown (Edit, Duplicate, Delete)
- Integration with SearchFilterToolbar
- External column visibility management
- Custom cell rendering (Badges, Avatars, Tags)

**Full Documentation:** See [DataTable Guide](./DATATABLE_GUIDE.md) for comprehensive usage examples.

---

## Sheet (Side Panel) Standards

### When to Use Sheet vs Dialog

| Use Case | Component | Reason |
|----------|-----------|--------|
| Quick actions (notes, tags) | Sheet (`size="sm"`) | Easy side access, doesn't block view |
| Form editing (customer, plan) | Sheet (`size="lg"` or `xl`) | More space for complex forms |
| Detail views | Sheet (`size="full"`) | Full detail without leaving page |
| Confirmations (delete, archive) | Dialog | Focused decision, blocks action |
| Alerts/Warnings | Dialog | Critical attention required |

### Sheet Component Structure

```tsx
// ✅ STANDARD: Proper Sheet structure
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from '@/shared/ui/shadcn/sheet'

<Sheet open={isOpen} onOpenChange={onClose}>
  <SheetContent size="lg">
    <SheetHeader>
      <SheetTitle>Edit Customer</SheetTitle>
      <SheetDescription>Update customer information</SheetDescription>
    </SheetHeader>

    <SheetBody>
      {/* Scrollable content area */}
      <form className="space-y-6">
        {/* Form fields */}
      </form>
    </SheetBody>

    <SheetFooter>
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button type="submit">Save Changes</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

### Size Variants

| Size | Width | Use Case |
|------|-------|----------|
| `sm` | 384px | Simple forms (notes, quick actions) |
| `default` | 448px | Standard forms |
| `lg` | 512px | Complex forms (customer details) |
| `xl` | 576px | Large forms with multiple sections |
| `full` | 672px | Full detail views |

```tsx
// ✅ STANDARD: Size prop usage
<SheetContent size="sm">   {/* Notes, tags */}
<SheetContent size="lg">   {/* Customer edit, plan edit */}
<SheetContent size="full"> {/* Full detail views */}
```

### Layout Requirements

**Structure:**
- Use `SheetHeader` → `SheetBody` → `SheetFooter` structure
- `SheetHeader`: Fixed at top with border separator
- `SheetBody`: Scrollable content area with overflow handling
- `SheetFooter`: Fixed at bottom with border separator

**Spacing:**
- Header: `px-6 pt-6 pb-4` with bottom border
- Body: `px-6 py-6` with `flex-1 overflow-y-auto`
- Footer: `px-6 py-4` with top border

### Footer Button Patterns

```tsx
// ✅ STANDARD: Single action
<SheetFooter>
  <Button>Save</Button>
</SheetFooter>

// ✅ STANDARD: Cancel + Primary action
<SheetFooter>
  <Button variant="secondary" onClick={onClose}>Cancel</Button>
  <Button>Save Changes</Button>
</SheetFooter>

// ✅ STANDARD: Destructive action
<SheetFooter>
  <Button variant="secondary" onClick={onClose}>Cancel</Button>
  <Button variant="destructive">Delete Customer</Button>
</SheetFooter>
```

### FormSheet - Reusable Wrapper Component

For consistent form sheets across the app, use the `FormSheet` wrapper component:

**Location:** `src/shared/ui/FormSheet/`

```tsx
import { FormSheet } from '@/shared/ui/FormSheet'

// Simple form
<FormSheet
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Add Note"
  size="sm"
  submitLabel="Save Note"
  onSubmit={handleSave}
  isSubmitting={saving}
  hideCancelButton
>
  <div className="space-y-4">
    <Textarea value={note} onChange={setNote} />
  </div>
</FormSheet>

// Complex form with cancel button
<FormSheet
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Edit Customer"
  description="Update customer information"
  size="lg"
  submitLabel="Save Changes"
  cancelLabel="Discard"
  onSubmit={handleUpdate}
  isSubmitting={updating}
>
  <CustomerForm data={customer} onChange={setCustomer} />
</FormSheet>

// Destructive action
<FormSheet
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Delete Customer"
  size="sm"
  submitLabel="Delete"
  submitVariant="destructive"
  onSubmit={handleDelete}
>
  <p>Are you sure you want to delete {customer.name}?</p>
</FormSheet>
```

**FormSheet Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | boolean | required | Whether sheet is open |
| `onOpenChange` | function | required | Close handler |
| `title` | string | required | Sheet title |
| `description` | string | - | Optional subtitle |
| `size` | sm/default/lg/xl/full | default | Sheet width |
| `submitLabel` | string | "Save" | Submit button text |
| `cancelLabel` | string | "Cancel" | Cancel button text |
| `onSubmit` | function | - | Submit handler |
| `isSubmitting` | boolean | false | Show loading state |
| `isSubmitDisabled` | boolean | false | Disable submit |
| `submitVariant` | default/destructive | default | Button variant |
| `hideCancelButton` | boolean | false | Hide cancel button |
| `hideFooter` | boolean | false | Hide entire footer |
| `customFooter` | ReactNode | - | Custom footer content |

### Production Example

See `src/features/customers/components/CustomerNotesModal.tsx` for a production example using FormSheet.

---

## File References

**Key Files:**
- `src/features/auth/components/AuthLayout.tsx` - Base layout with logo
- `src/features/auth/pages/PersonalLoginPage.tsx` - Reference implementation
- `src/features/customers/components/CustomerTable.tsx` - DataTable reference implementation
- `src/shared/ui/DataTable/` - Reusable DataTable components
- `index.html` - Logo preload configuration
- `src/shared/ui/shadcn/button.tsx` - Button heights and variants
- `src/shared/ui/shadcn/input.tsx` - Input heights and styling
- `src/shared/ui/shadcn/card.tsx` - Card border radius
- `src/index.css` - Scrollbar styles (`scrollbar-thin`)

---

## Why These Standards Matter

1. **Consistency**: Users encounter predictable layouts across all flows
2. **Performance**: Logo preloading and optimization prevent visual jumps
3. **Accessibility**: Standardized heights and spacing improve usability
4. **Maintainability**: Clear patterns make it easy to add new pages
5. **Quality**: Prevents common mistakes (scrollbars, misaligned logos, inconsistent spacing)
