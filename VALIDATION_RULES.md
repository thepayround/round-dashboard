# Component Validation Rules

This document explains all pre-commit validation rules that enforce UI consistency and prevent regression of completed tasks.

## Overview

The [.component-rules.json](.component-rules.json) file contains **38 validation rules** that automatically enforce:
- Component usage patterns
- Color token consistency
- Spacing standardization
- Grid layout patterns
- Accessibility requirements
- Prop naming conventions

These rules run automatically on **every commit** via the pre-commit hook at [.husky/pre-commit](.husky/pre-commit).

## How It Works

### Pre-Commit Flow
1. **Component Validation** - Runs first to catch issues early
2. **Code Formatting** - Auto-formats with Prettier
3. **Lint Fixing** - Auto-fixes ESLint issues
4. **Type Checking** - Verifies TypeScript types
5. **Re-staging** - Adds formatted files back to commit

### Severity Levels
- **Error** (✖) - Blocks commit until fixed
- **Warning** (⚠) - Allows commit but shows notice

### Manual Validation
```bash
# Validate staged files
npm run validate:components

# Check specific file
node scripts/validate-components.js path/to/file.tsx
```

## Rule Categories

### 1. Component Usage Rules (9 rules)

Enforce reusable components instead of raw HTML elements.

#### ✖ No Raw Button Elements
```tsx
// ❌ Bad
<button onClick={handleClick}>Click me</button>

// ✅ Good
<Button onClick={handleClick}>Click me</Button>
<IconButton icon={Save} aria-label="Save changes" onClick={handleClick} />
```

#### ✖ No Raw Input Elements
```tsx
// ❌ Bad
<input type="text" placeholder="Enter name" />

// ✅ Good
<Input placeholder="Enter name" />
<FormInput label="Name" value={name} onChange={setName} />
<AuthInput inputType="text" placeholder="Email" />
```

#### ✖ No Raw Textarea Elements
```tsx
// ❌ Bad
<textarea placeholder="Enter description" />

// ✅ Good
<Textarea placeholder="Enter description" />
<AuthInput inputType="textarea" placeholder="Description" />
```

#### ✖ No Raw Select Elements
```tsx
// ❌ Bad
<select><option>Option 1</option></select>

// ✅ Good
<UiDropdown options={options} value={selected} onChange={setSelected} />
<ApiDropdown endpoint="/api/options" value={selected} onChange={setSelected} />
```

#### ✖ Use Badge Component
```tsx
// ❌ Bad
<span className="px-2 py-1 rounded-full text-xs bg-green-500/10">Active</span>

// ✅ Good
<Badge variant="success">Active</Badge>
```

#### ✖ Use Avatar Component
```tsx
// ❌ Bad
<div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
  <span>JD</span>
</div>

// ✅ Good
<Avatar name="John Doe" />
<Avatar name="Jane Smith" src="/avatar.jpg" />
```

#### ✖ Use LoadingSpinner Component
```tsx
// ❌ Bad
<div className="animate-spin">⏳</div>

// ✅ Good
<LoadingSpinner size="md" />
<LoadingOverlay isVisible={isLoading} />
```

#### ✖ Use Alert Component
```tsx
// ❌ Bad
<div className="bg-red-500/10 border border-red-500/30 p-4">Error occurred</div>

// ✅ Good
<Alert type="error" message="Error occurred" />
<Alert type="success" message="Saved successfully" />
```

#### ✖ Use AddressFormGroup Component
```tsx
// ❌ Bad
<FormInput label="Address Line 1" />
<FormInput label="City" />
<FormInput label="State" />

// ✅ Good
<AddressFormGroup
  value={address}
  onChange={setAddress}
/>
```

### 2. Color Token Rules (6 rules)

Prevent hardcoded colors - use design tokens instead.

#### ✖ No Hardcoded Colors
```tsx
// ❌ Bad - Hardcoded colors
color: #D417C8  // primary
color: #14BDEA  // secondary
color: #7767DA  // accent
color: #42E695  // success
color: #00BCD4  // undocumented teal
color: #32A1E4  // undocumented blue

// ✅ Good - Design tokens
className="text-primary bg-primary border-primary"
className="text-secondary bg-secondary border-secondary"
className="text-accent bg-accent border-accent"
className="text-success bg-success border-success"
```

**Allowed locations for hex colors:**
- `tailwind.config.ts` - Theme configuration
- `src/shared/config/constants.ts` - Design token definitions
- `src/shared/constants/designTokens.ts` - Token exports
- `*.md` - Documentation
- `*.svg` - Icons and graphics

### 3. Spacing Standardization Rules (14 rules)

Enforce consistent spacing using Tailwind's spacing scale.

#### ✖ No mb-3 or mb-5 (Margin Bottom)
```tsx
// ❌ Bad
className="mb-3"  // Non-standard
className="mb-5"  // Non-standard

// ✅ Good
className="mb-2"  // Tight spacing
className="mb-4"  // Standard spacing
className="mb-6"  // Section spacing
className="mb-8"  // Large spacing
```

#### ✖ No p-3, p-5, or p-7 (Padding)
```tsx
// ❌ Bad
className="p-3"   // Non-standard
className="p-5"   // Non-standard
className="p-7"   // Non-standard

// ✅ Good
className="p-2"   // Tight padding
className="p-4"   // Standard padding
className="p-6"   // Card padding
className="p-8"   // Large section padding
```

#### ✖ No px-3 or px-5 (Horizontal Padding)
```tsx
// ❌ Bad
className="px-3"  // Non-standard
className="px-5"  // Non-standard

// ✅ Good
className="px-2"  // Tight
className="px-4"  // Standard
className="px-6"  // Cards
```

#### ✖ No py-3 or py-5 (Vertical Padding)
```tsx
// ❌ Bad
className="py-3"  // Non-standard
className="py-5"  // Non-standard

// ✅ Good
className="py-2"  // Tight
className="py-4"  // Standard
className="py-6"  // Cards
```

#### ✖ No space-y-3 or space-y-5 (Vertical Spacing)
```tsx
// ❌ Bad
<div className="space-y-3">  {/* Non-standard */}
<div className="space-y-5">  {/* Non-standard */}

// ✅ Good
<div className="space-y-2">  {/* Tight */}
<div className="space-y-4">  {/* Standard */}
<div className="space-y-6">  {/* Sections */}
<div className="space-y-8">  {/* Large */}
```

#### ✖ No space-x-3 or space-x-5 (Horizontal Spacing)
```tsx
// ❌ Bad
<div className="space-x-3">  {/* Non-standard */}
<div className="space-x-5">  {/* Non-standard */}

// ✅ Good
<div className="space-x-2">  {/* Tight */}
<div className="space-x-4">  {/* Standard */}
<div className="space-x-6">  {/* Sections */}
```

#### ✖ No gap-3
```tsx
// ❌ Bad
<div className="flex gap-3">

// ✅ Good
<div className="flex gap-2">  {/* Tight spacing */}
<div className="flex gap-4">  {/* Layout spacing */}
<div className="flex gap-6">  {/* Section spacing */}
```

#### ✖ No Responsive Padding Patterns
```tsx
// ❌ Bad - Multiple responsive padding values
className="p-5 md:p-6 lg:p-7"

// ✅ Good - Single padding value
className="p-6"  // Works at all breakpoints
```

### 4. Grid Layout Rules (2 rules)

Enforce consistent grid patterns.

#### ✖ No sm: Breakpoint in Grid
```tsx
// ❌ Bad
className="grid-cols-1 sm:grid-cols-2"  // sm: too small

// ✅ Good
className="grid-cols-1 md:grid-cols-2"  // md: standard breakpoint
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

#### ✖ Gap Placement After grid-cols
```tsx
// ❌ Bad - Gap before grid-cols
className="gap-4 grid-cols-1 md:grid-cols-2"

// ✅ Good - Gap after grid-cols
className="grid-cols-1 md:grid-cols-2 gap-4"
```

### 5. Modal Pattern Rules (2 rules - Warning Level)

Prevent redundant padding/overflow in Modal children.

#### ⚠ No Custom Padding in Modal Children
```tsx
// ⚠ Warning
<Modal isOpen={isOpen}>
  <form className="p-6">  {/* Modal provides padding */}
    {/* content */}
  </form>
</Modal>

// ✅ Good
<Modal isOpen={isOpen}>
  <form className="space-y-6">  {/* No padding needed */}
    {/* content */}
  </form>
</Modal>
```

The Modal component automatically provides:
- Header: `px-6 py-4`
- Body: `px-6 py-6`
- Footer: `px-6 py-4`

#### ⚠ No Custom Overflow in Modal Children
```tsx
// ⚠ Warning
<Modal isOpen={isOpen}>
  <div className="max-h-[70vh] overflow-y-auto">  {/* Modal handles this */}
    {/* content */}
  </div>
</Modal>

// ✅ Good
<Modal isOpen={isOpen}>
  <div>  {/* Modal handles overflow automatically */}
    {/* content */}
  </div>
</Modal>
```

The Modal body has automatic overflow handling with `max-h-[calc(90vh-88px)] overflow-y-auto`.

### 6. Accessibility Rules (2 rules)

Enforce WCAG 2.1 Level AA compliance.

#### ✖ No Low-Contrast Text
```tsx
// ❌ Bad - Fails WCAG AA (< 4.5:1 contrast)
className="text-white/40"  // Too dim
className="text-white/30"  // Too dim
className="text-white/20"  // Too dim

// ✅ Good - Passes WCAG AA (≥ 4.5:1 contrast)
className="text-white/60"      // Secondary text (minimum)
className="text-white/70"      // Readable text
className="text-white"         // Primary text
```

**Other accessibility enforcement:**
- IconButton: TypeScript enforces required `aria-label` prop
- Modal: Proper ARIA dialog pattern built-in
- Toast: aria-live regions built-in
- Navigation: ARIA landmarks enforced

### 7. Prop Naming Rules (1 rule)

Enforce consistent prop naming conventions.

#### ✖ Use isLoading Instead of loading
```tsx
// ❌ Bad
<Button loading={isSubmitting}>Save</Button>

// ✅ Good
<Button isLoading={isSubmitting}>Save</Button>
```

**Naming convention for boolean props:**
- `isLoading`, `isDisabled`, `isVisible` - State flags
- `hasError`, `hasChanges` - Possession checks
- `canEdit`, `canDelete` - Permission checks
- `shouldShow`, `shouldValidate` - Conditional logic

## Rule Exclusions

All rules exclude the following paths:
- `src/shared/ui/` - Component library source
- `*.test.tsx`, `*.test.ts` - Test files
- `*.spec.tsx`, `*.spec.ts` - Spec files
- `*.stories.tsx`, `*.stories.ts` - Storybook files
- `*.md` - Documentation

Component-specific exclusions apply where needed (e.g., Button component source excluded from "No raw button" rule).

## Task Coverage

These 38 rules enforce all **31 completed UI consistency tasks**:

### Spacing Tasks (TASK-SPC-001 to 006) ✅
- ✅ gap-3 standardization
- ✅ mb-3, mb-5 standardization
- ✅ p-3, p-5, p-7 standardization
- ✅ space-y-3, space-y-5 standardization
- ✅ Responsive padding patterns
- ✅ Modal padding standardization

### Grid Tasks (TASK-GRID-001 to 002) ✅
- ✅ sm: breakpoint usage
- ✅ Gap placement

### Accessibility Tasks (TASK-A11Y-001 to 010) ✅
- ✅ Modal ARIA attributes
- ✅ Color contrast (text-white/60 minimum)
- ✅ IconButton aria-label (TypeScript enforced)
- ✅ Other ARIA patterns built into components

### Color Tasks (TASK-COL-001 to 006) ✅
- ✅ #D417C8 → primary
- ✅ #14BDEA → secondary
- ✅ #7767DA → accent
- ✅ #42E695 → success
- ✅ #00BCD4 forbidden
- ✅ #32A1E4 forbidden

### Component Tasks (TASK-CMP-001 to 007) ✅
- ✅ Button component usage
- ✅ Input component usage
- ✅ Textarea component usage
- ✅ Select/Dropdown usage
- ✅ Badge component usage
- ✅ Avatar component usage
- ✅ LoadingSpinner usage

### Property Tasks (TASK-PROP-001) ✅
- ✅ isLoading prop naming

### Validation Tasks (TASK-VAL-001) ✅
- ✅ Component validation rules system

## Bypassing Validation (Emergency Only)

In rare cases where validation must be bypassed:

```bash
# Skip pre-commit hooks (use with caution!)
git commit --no-verify -m "Emergency fix"

# Or set environment variable
SKIP_PRE_COMMIT=1 git commit -m "Emergency fix"
```

**⚠️ Warning:** Bypassing validation can reintroduce inconsistencies. Only use for:
- Emergency hotfixes
- Intentional exceptions approved by team
- Temporary workarounds (create ticket to fix properly)

## Maintenance

### Adding New Rules
1. Edit [.component-rules.json](.component-rules.json)
2. Add rule with pattern, message, suggestion, severity
3. Test: `npm run validate:components`
4. Document in this file

### Updating Rules
1. Modify pattern/message in [.component-rules.json](.component-rules.json)
2. Run validation: `npm run validate:components`
3. Fix any new violations found
4. Update documentation

### Rule Template
```json
{
  "name": "Rule name",
  "pattern": "regex-pattern",
  "message": "Error message explaining what's wrong",
  "suggestion": "How to fix it",
  "severity": "error",
  "excludePaths": ["path/to/exclude/", "*.test.tsx"]
}
```

## Related Documentation

- [ACCESSIBILITY_TESTING_CHECKLIST.md](ACCESSIBILITY_TESTING_CHECKLIST.md) - Accessibility testing guide
- [.component-rules.json](.component-rules.json) - Rule definitions
- [scripts/validate-components.js](scripts/validate-components.js) - Validation script
- [.husky/pre-commit](.husky/pre-commit) - Pre-commit hook

---

**Last Updated**: 2025-01-20
**Total Rules**: 38
**Coverage**: All 31 completed UI consistency tasks
