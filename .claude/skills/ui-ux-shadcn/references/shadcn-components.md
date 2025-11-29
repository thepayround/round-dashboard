# Shadcn Components Reference

## Installed Components

All Shadcn components are located in `src/shared/ui/shadcn/`

### Form Components

- `checkbox.tsx` - Checkbox inputs
- `form.tsx` - Form field wrappers
- `input.tsx` - Text inputs
- `label.tsx` - Form labels
- `radio-group.tsx` - Radio button groups
- `select.tsx` - Dropdown select
- `slider.tsx` - Range sliders
- `switch.tsx` - Toggle switches
- `textarea.tsx` - Multi-line text inputs

### Layout Components

- `accordion.tsx` - Collapsible sections
- `card.tsx` - Cards
- `separator.tsx` - Divider lines
- `tabs.tsx` - Tab navigation

### Feedback Components

- `alert-dialog.tsx` - Confirmation dialogs
- `alert.tsx` - Alert messages
- `dialog.tsx` - Modal dialogs
- `popover.tsx` - Popovers
- `skeleton.tsx` - Loading skeletons
- `tooltip.tsx` - Hover tooltips

### Navigation Components

- `dropdown-menu.tsx` - Dropdown menus
- `table.tsx` - Data tables

### Display Components

- `avatar.tsx` - User avatars
- `badge.tsx` - Status badges
- `button.tsx` - Buttons

## Custom Wrapper Components

### Button Wrapper
Location: `@/shared/ui/Button/Button.tsx`
Provides backward compatibility with variant mapping.

### Card Wrapper
Location: `@/shared/ui/Card/Card.tsx`
Supports stats, feature, navigation, compact variants.

### DataTable Component
Location: `@/shared/ui/DataTable/DataTable.tsx`
Features: pagination, sorting, filtering, row selection, search.

## Import Patterns

Direct Shadcn imports:
```tsx
import { Dialog } from '@/shared/ui/shadcn/dialog'
import { Form, FormField } from '@/shared/ui/shadcn/form'
import { Input } from '@/shared/ui/shadcn/input'
```

Wrapper imports:
```tsx
import { Button } from '@/shared/ui/Button/Button'
import { Card } from '@/shared/ui/Card/Card'
import { DataTable } from '@/shared/ui/DataTable/DataTable'
```

## Best Practices

1. Always import from correct path (shadcn vs wrappers)
2. Use semantic variants (destructive for dangerous actions)
3. Leverage Form components for all forms
4. Use consistent sizing (default is sufficient for most cases)
5. All components support accessibility features
