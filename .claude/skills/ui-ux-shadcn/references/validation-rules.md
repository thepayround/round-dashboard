# UI/UX Validation Rules

These rules should be checked when reviewing or creating UI components.

## Scrollbar Validation

### Required Pattern

All elements with `overflow-y-auto`, `overflow-x-auto`, or `overflow-auto` MUST include custom scrollbar styling:

```tsx
// Vertical scrollbar
"[&::-webkit-scrollbar]:w-2"
"[&::-webkit-scrollbar-track]:bg-transparent"
"[&::-webkit-scrollbar-thumb]:bg-muted-foreground/20"
"[&::-webkit-scrollbar-thumb]:rounded-full"
"[&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/40"

// Horizontal scrollbar (use h-2 instead of w-2)
"[&::-webkit-scrollbar]:h-2"
```

### Validation Checklist

- [ ] No default browser scrollbars visible
- [ ] All scrollable containers use custom styling
- [ ] No double scrollbars (parent and child both scrolling)
- [ ] Consistent thumb color (`muted-foreground/20`)
- [ ] Hover state present (`muted-foreground/40`)

### Files to Check

When auditing scrollbar consistency, check these files:

| File | Component | Scroll Type |
|------|-----------|-------------|
| `src/shared/layout/DashboardLayout.tsx` | Main content | Vertical |
| `src/shared/ui/shadcn/sheet.tsx` | SheetBody | Vertical |
| `src/shared/ui/shadcn/dialog.tsx` | DialogBody | Vertical |
| `src/shared/ui/shadcn/select.tsx` | SelectContent | Vertical |
| `src/shared/ui/shadcn/command.tsx` | CommandList | Vertical |
| `src/shared/ui/shadcn/table.tsx` | Table wrapper | Horizontal |
| `src/shared/ui/shadcn/dropdown-menu.tsx` | DropdownMenuContent | Vertical |
| `src/shared/ui/shadcn/context-menu.tsx` | ContextMenuContent | Vertical |
| `src/shared/ui/Combobox/Combobox.tsx` | Options list | Vertical |
| `src/shared/ui/SimpleSelect/SimpleSelect.tsx` | Options list | Vertical |
| `src/shared/ui/PhoneInput/PhoneInput.tsx` | Countries list | Vertical |
| `src/shared/widgets/Drawer/Drawer.tsx` | Content area | Vertical |

### Anti-Patterns

```tsx
// BAD: Missing scrollbar styling
<div className="overflow-y-auto">
  {content}
</div>

// BAD: Using deprecated scrollbar-thin class
<div className="overflow-y-auto scrollbar-thin">
  {content}
</div>

// BAD: Using default scrollbar colors
<div className="overflow-y-auto [&::-webkit-scrollbar]:w-2">
  {content}
</div>

// BAD: Double scrollbars
<div className="min-h-screen overflow-auto">
  <div className="overflow-y-auto">
    {content}
  </div>
</div>
```

### Correct Pattern

```tsx
// GOOD: Complete scrollbar styling
<div className={cn(
  "overflow-y-auto",
  "[&::-webkit-scrollbar]:w-2",
  "[&::-webkit-scrollbar-track]:bg-transparent",
  "[&::-webkit-scrollbar-thumb]:bg-muted-foreground/20",
  "[&::-webkit-scrollbar-thumb]:rounded-full",
  "[&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/40"
)}>
  {content}
</div>

// GOOD: Preventing double scrollbars
<div className="h-screen overflow-hidden">
  <div className={cn(
    "h-full overflow-y-auto",
    "[&::-webkit-scrollbar]:w-2",
    // ... rest of scrollbar styles
  )}>
    {content}
  </div>
</div>
```

## Color Theme Validation

### Dark Mode Elevation Hierarchy

The elevation hierarchy creates a subtle "lift" effect where floating elements appear elevated:

| Variable | Value | Lightness | Usage |
|----------|-------|-----------|-------|
| `--background` | `0 0% 3.9%` | Darkest | Root background, sidebar |
| `--card` | `0 0% 7%` | Middle | Card/main content background |
| `--popover` | `0 0% 9%` | Lightest | Dropdown/popover background (elevated) |

### Visual Hierarchy

```text
Background (3.9%) < Card (7%) < Popover (9%)
       ↓              ↓            ↓
   Sidebar      Main content   Dropdowns/Menus
```

### Why This Pattern?

- **Accessibility** - Better contrast for text readability in dark mode
- **Visual hierarchy** - Popovers feel like they're floating above the content
- **Consistency** - Matches modern dark mode patterns (VS Code, GitHub, Figma)

### Components That Must Use `bg-popover`

| Component | File |
|-----------|------|
| DropdownMenuContent | `src/shared/ui/shadcn/dropdown-menu.tsx` |
| ContextMenuContent | `src/shared/ui/shadcn/context-menu.tsx` |
| SelectContent | `src/shared/ui/shadcn/select.tsx` |
| PopoverContent | `src/shared/ui/shadcn/popover.tsx` |
| TooltipContent | `src/shared/ui/shadcn/tooltip.tsx` |
| CommandDialog | `src/shared/ui/shadcn/command.tsx` |
| Combobox dropdown | `src/shared/ui/Combobox/Combobox.tsx` |
| SimpleSelect dropdown | `src/shared/ui/SimpleSelect/SimpleSelect.tsx` |
| PhoneInput countries list | `src/shared/ui/PhoneInput/PhoneInput.tsx` |

### Color Validation Checklist

- [ ] Popovers/dropdowns use `bg-popover` (9% lightness - elevated)
- [ ] Main content areas use `bg-card` (7% lightness)
- [ ] Root/sidebar uses `bg-background` (3.9% lightness - darkest)
- [ ] No hardcoded colors (hex, rgb, etc.)
- [ ] `--popover` CSS variable is set to `0 0% 9%` in index.css

### Color Anti-Patterns

```tsx
// BAD: Popover same color as background (no elevation)
--popover: 0 0% 3.9%;  // Same as --background

// BAD: Popover darker than card (inverted hierarchy)
--popover: 0 0% 5%;    // Darker than --card (7%)

// BAD: Hardcoded colors
<div className="bg-[#1a1a1a]">  // Use bg-popover instead

// BAD: Using wrong semantic color
<DropdownMenuContent className="bg-card">  // Should use bg-popover (default)
```

### Color Correct Pattern

```tsx
// GOOD: Proper elevation hierarchy in index.css
.dark {
  --background: 0 0% 3.9%;  // Darkest
  --card: 0 0% 7%;          // Middle
  --popover: 0 0% 9%;       // Lightest (elevated)
}

// GOOD: Components use semantic colors (bg-popover is default for these)
<DropdownMenuContent>...</DropdownMenuContent>
<SelectContent>...</SelectContent>
<PopoverContent>...</PopoverContent>
```

## Sidebar User Profile Button

### User Profile Button Pattern

The sidebar user profile button in `DashboardLayout.tsx` must follow this exact pattern:

```tsx
<button className="w-full flex items-center gap-2 px-2 py-2">
  <div className="rounded-full bg-muted flex items-center justify-center h-8 w-8">
    {userAvatar}
  </div>
  <div className="flex-1 min-w-0 text-left">
    <p className="text-sm font-medium text-foreground truncate">{userName}</p>
    <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
  </div>
  <ChevronUp className="h-4 w-4 text-muted-foreground" />
</button>
```

### Rules

| Element | Value | Reason |
|---------|-------|--------|
| Button hover | None | Dropdown trigger, not action button |
| Name text | `text-sm` (14px) | Standard readable size |
| Email text | `text-xs` (12px) | Secondary info, smaller but readable |
| Name color | `text-foreground` | Primary text semantic color |
| Email color | `text-muted-foreground` | Secondary text semantic color |
| Avatar size | `h-8 w-8` | Consistent, visible size |
| Avatar bg | `bg-muted` | Semantic color, not hardcoded |
| Chevron size | `h-4 w-4` | Standard icon size |
| Border above | `border-border` | Semantic color |

### User Profile Anti-Patterns

```tsx
// BAD: Hover effect on dropdown trigger
<button className="hover:bg-zinc-800/30">

// BAD: Text too small
<p className="text-xs">Name</p>        // Should be text-sm
<p className="text-[10px]">Email</p>   // Should be text-xs

// BAD: Hardcoded colors
<p className="text-zinc-200">          // Should be text-foreground
<p className="text-zinc-500">          // Should be text-muted-foreground
<div className="bg-zinc-800">          // Should be bg-muted
<div className="border-zinc-800/50">   // Should be border-border
```

## Accessibility Validation

### Focus States

All interactive elements MUST have visible focus states:

```tsx
"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

### Color Contrast

- Text on `bg-card`: Use `text-foreground` or `text-muted-foreground`
- Text on `bg-popover`: Use `text-popover-foreground`
- Error text: Use `text-destructive`

### ARIA Labels

- All icon-only buttons MUST have `aria-label`
- Form inputs MUST have associated labels
- Dialogs MUST have `aria-labelledby` or title

## Semantic Color Token Validation

### Required Token Usage

All color usage MUST use semantic tokens. Run validation before commit.

| Pattern to Find | Replace With | Severity |
|-----------------|--------------|----------|
| `text-emerald-*` | `text-success` | Error |
| `text-green-*` | `text-success` | Error |
| `text-red-*` | `text-destructive` | Error |
| `text-yellow-*`, `text-amber-*` | `text-warning` | Error |
| `text-blue-*` | `text-primary` or `text-secondary` | Error |
| `text-purple-*`, `text-violet-*` | `text-accent` | Error |
| `bg-emerald-*` | `bg-success` or `bg-success/10` | Error |
| `bg-red-*` | `bg-destructive` or `bg-destructive/10` | Error |
| `border-white/*` | `border-border` or `border-primary/20` | Error |

### Semantic Token Checklist

- [ ] No raw Tailwind color classes (emerald, blue, red, yellow, green, purple)
- [ ] All success states use `text-success` / `bg-success`
- [ ] All error states use `text-destructive` / `bg-destructive`
- [ ] All warning states use `text-warning` / `bg-warning`
- [ ] All borders use `border-border` or semantic variants
- [ ] No `border-white/*` patterns

## Typography Validation

### Font Weight Rules

- [ ] No `font-semibold` usage (use `font-medium` instead)
- [ ] No `font-bold` usage (use `font-medium` instead)
- [ ] Maximum font weight is `font-medium` (500)

### Where Font Weight Issues Commonly Occur

| Component Type | Common Issue | Correct Value |
|----------------|--------------|---------------|
| Card titles | `font-semibold` | `font-medium` |
| Modal titles | `font-semibold` | `font-medium` |
| KPI/Metric values | `font-bold` | `font-medium` |
| Section headers | `font-semibold` | `font-medium` |

## Component-Specific Validation

### Buttons

- [ ] Uses `Button` from `@/shared/ui/shadcn/button`
- [ ] Correct variant for context (default, secondary, destructive, ghost)
- [ ] Loading state shows spinner, not just disabled
- [ ] Form submit buttons use `size="default"` (NOT `size="sm"`)
- [ ] Button groups use `gap-2` spacing (NOT `gap-3`)

### Forms

- [ ] Uses React Hook Form + Zod
- [ ] Validation mode is `onSubmit`, not `onBlur`
- [ ] Error messages use `text-destructive` with `AlertCircle` icon
- [ ] Required fields marked with red asterisk

### Modals/Sheets

- [ ] Uses `DialogBody` or `SheetBody` for scrollable content
- [ ] Has proper header with title
- [ ] Footer has Cancel and primary action buttons
- [ ] Closes on overlay click and Escape key
