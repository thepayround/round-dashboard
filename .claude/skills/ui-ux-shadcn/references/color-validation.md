# Color & Background Validation Rules

This document defines the validation rules for ensuring consistent color usage across the Round Dashboard.

## 4-Tier Background Hierarchy

### Required Values (Dark Mode)

| Tier | CSS Variable | HSL Value | Tailwind Class |
|------|--------------|-----------|----------------|
| 1 (darkest) | `--sidebar` | `0 0% 2%` | `bg-sidebar` |
| 2 | `--background` | `0 0% 3.9%` | `bg-background` |
| 3 | `--table-row` | `0 0% 5.5%` | `bg-table-row` |
| 4 (lightest) | `--card` | `0 0% 7%` | `bg-card` |

### Validation Checklist

#### ❌ FORBIDDEN Patterns (will cause contrast issues)

```regex
# Hardcoded hex colors
bg-\[#[0-9a-fA-F]+\]
text-\[#[0-9a-fA-F]+\]

# Raw color values
bg-black
bg-white (without opacity)
text-white (without opacity)
text-black

# Raw Tailwind palette colors
zinc-\d+
slate-\d+
gray-\d+
neutral-\d+
emerald-\d+
red-\d+
blue-\d+
yellow-\d+
amber-\d+
green-\d+

# Direct RGB/HSL
style=.*background.*#
style=.*color.*#
```

#### ✅ REQUIRED Patterns (semantic tokens)

| Intent | Use This | NOT This |
|--------|----------|----------|
| Success/Active | `text-success`, `bg-success/10` | `text-emerald-*`, `text-green-*` |
| Error/Danger | `text-destructive`, `bg-destructive/10` | `text-red-*` |
| Warning | `text-warning`, `bg-warning/10` | `text-yellow-*`, `text-amber-*` |
| Primary | `text-primary`, `bg-primary/10` | `text-blue-*` |
| Muted text | `text-muted-foreground` | `text-gray-*`, `text-zinc-*` |
| Borders | `border-border` | `border-white/*`, `border-zinc-*` |
| Icons | `text-muted-foreground`, `text-secondary` | Hardcoded colors |

## Typography Validation

### Font Weight Rules

| Weight | Class | Allowed Usage |
|--------|-------|---------------|
| 400 | `font-normal` | Body text, descriptions |
| 500 | `font-medium` | **Maximum** - headings, labels, emphasized text |
| 600 | `font-semibold` | **ONLY** in shadcn badge/menu components |
| 700 | `font-bold` | **FORBIDDEN** in UI components |

### Validation Regex

```regex
# Should flag for review (allowed only in shadcn components)
font-semibold
font-bold
```

## Background Usage by Component

### Layout Components

| Component | Expected Background |
|-----------|---------------------|
| `DashboardLayout` outer | `bg-sidebar` |
| `DashboardLayout` main content | `bg-background` |
| Sidebar | `bg-sidebar` |
| Mobile header | `bg-sidebar` |

### Content Components

| Component | Expected Background |
|-----------|---------------------|
| Cards | `bg-card` |
| Modals/Dialogs | `bg-card` or `bg-popover` |
| Sheets/Drawers | `bg-card` |
| Dropdowns/Popovers | `bg-popover` |
| Table wrapper | `bg-card` |
| Table header | inherits from card |
| Table body rows | `bg-table-row` (via TableBody) |

### Form Components

| Component | Expected Background |
|-----------|---------------------|
| Input fields | `bg-transparent dark:bg-input/30` |
| Select triggers | `bg-transparent dark:bg-input/30` |
| Textarea | `bg-transparent dark:bg-input/30` |

## Automated Validation

### Pre-commit Hook Example

```bash
#!/bin/bash
# Check for forbidden color patterns

FORBIDDEN_PATTERNS=(
  "bg-\[#"
  "text-\[#"
  "bg-black[^/]"
  "bg-white[^/]"
  "text-white[^/]"
  "text-black"
  "zinc-[0-9]"
  "slate-[0-9]"
  "gray-[0-9]"
  "neutral-[0-9]"
)

for pattern in "${FORBIDDEN_PATTERNS[@]}"; do
  if grep -r -E "$pattern" --include="*.tsx" src/; then
    echo "ERROR: Found forbidden color pattern: $pattern"
    exit 1
  fi
done

echo "Color validation passed!"
```

### ESLint Rule (Custom)

For projects using ESLint, add a custom rule to `eslint.config.js`:

```javascript
// Custom rule to check for hardcoded colors
{
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Literal[value=/bg-\\[#|text-\\[#|zinc-|slate-|gray-/]',
        message: 'Use semantic color tokens instead of hardcoded colors'
      }
    ]
  }
}
```

## Manual Review Checklist

When reviewing PRs, check:

- [ ] No hardcoded hex colors (`#xxx`, `#xxxxxx`)
- [ ] No raw Tailwind palette colors (`zinc-*`, `slate-*`, etc.)
- [ ] Background hierarchy follows 4-tier system
- [ ] Font weights don't exceed `font-medium` (except shadcn badges/menus)
- [ ] Icons use `text-muted-foreground` or `text-secondary`
- [ ] Error states use `text-destructive`
- [ ] Success states use `text-success`
- [ ] Borders use `border-border` or semantic variants

## Quick Reference

### Correct Examples

```tsx
// Backgrounds
<div className="bg-sidebar">          {/* Tier 1 */}
<main className="bg-background">      {/* Tier 2 */}
<TableBody>                           {/* Tier 3 - automatic */}
<Card className="bg-card">            {/* Tier 4 */}

// Text colors
<p className="text-foreground">Main text</p>
<p className="text-muted-foreground">Secondary text</p>
<span className="text-destructive">Error</span>
<span className="text-success">Success</span>

// Icons
<Icon className="text-muted-foreground" />
<Icon className="text-secondary" />

// Typography
<h1 className="font-medium">Heading</h1>
<p className="font-normal">Body text</p>
```

### Incorrect Examples

```tsx
// ❌ WRONG - Hardcoded colors
<div className="bg-[#1a1a1a]">
<p className="text-white">
<span className="text-zinc-500">
<Icon className="text-gray-400" />

// ❌ WRONG - Font weights
<h1 className="font-bold">
<span className="font-semibold">

// ❌ WRONG - Background hierarchy
<main className="bg-card">  {/* Should be bg-background */}
<Card className="bg-background">  {/* Should be bg-card */}
```
