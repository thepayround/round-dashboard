# Round - AI Agent Context Guide

**Last Updated:** November 2025  
**Documentation:** See `/docs` folder for detailed guides

---

## 📁 Documentation Structure

**All detailed documentation is in `/docs`:**
- `/docs/UI_ARCHITECTURE_IMPROVEMENTS.md` - Component migration status & roadmap
- `/docs/COMPONENT_VALIDATION.md` - Pre-commit validation rules
- `/docs/DEVELOPMENT_GUIDE.md` - Code standards & best practices
- `/docs/REUSABLE_COMPONENTS.md` - Component usage guide
- `/docs/BACKEND_INTEGRATION.md` - API integration patterns
- `/docs/EMAIL_CONFIRMATION_FLOW.md` - Auth flow documentation

**Read these docs for detailed information. This file contains only CRITICAL context for AI agents.**

---

## ⚠️ CRITICAL RULES (MUST FOLLOW)

### 1. Backend as Source of Truth
**NEVER** use frontend fallbacks for backend data. Always:
- Use backend data directly
- Show loading states while waiting
- Handle errors properly (no fallback masks)
- Trust backend structure

### 2. Component Usage (ENFORCED)
**MANDATORY:** Use reusable components from `@/shared/ui`:

```tsx
// ✅ CORRECT
import { Button, Input, Checkbox, Toggle } from '@/shared/ui'

// ❌ WRONG - Pre-commit will BLOCK
<button>...</button>
<input type="text" />
<select>...</select>
<textarea>...</textarea>
```

**Pre-commit validation BLOCKS raw HTML elements.** Use:
- `Button`, `IconButton`, `ActionButton` (not `<button>`)
- `Input`, `FormInput`, `AuthInput` (not `<input>`)
- `Textarea` (not `<textarea>`)
- `UiDropdown`, `ApiDropdown` (not `<select>`)
- `Checkbox`, `Toggle`, `RadioGroup` (not `<input type="checkbox">`)
- `FileInput` (not `<input type="file">`)

### 3. Global Toast System
**MANDATORY:** Always use global toast for notifications:

```tsx
import { useGlobalToast } from '@/shared/contexts/ToastContext'

const { showSuccess, showError, showWarning, showInfo } = useGlobalToast()
```

**NEVER** create local toast state or components.

### 4. Google OAuth Flow
Google OAuth creates **BUSINESS accounts** → Redirects to `/get-started` for onboarding.

---

## 🎨 Design System (Polar.sh-Inspired)

### Core Principles
1. **Zero Animations on Interactive Components** - Instant interactions
2. **Solid Backgrounds** - No glassmorphism (`#171719`)
3. **Lighter Typography** - Inter font, baseline weight 300
4. **Instant Feedback** - No delays, no transitions

### Colors
```css
/* Backgrounds */
--bg-primary: #171719    /* Cards, dropdowns, inputs */
--bg-page: #0a0a0a       /* Page background */

/* Borders */
--border-default: #333333
--border-hover: #404040
--border-focus: #14bdea   /* Cyan - 1px solid, NO ring */

/* Brand */
--primary: #D417C8        /* Pink */
--secondary: #14BDEA      /* Cyan */
--accent: #7767DA         /* Purple */

/* Status */
--success: #38D39F
--warning: #FF9F0A
--error: #FF3B30
--info: #32A1E4
```

### Typography
```css
/* Font: Inter, weight 300 baseline */
--text-main-title: text-base font-normal      /* 16px/400 */
--text-section: text-sm font-normal           /* 14px/400 */
--text-body: text-sm font-light               /* 14px/300 */
--text-label: text-xs font-normal             /* 12px/400 */
--letter-spacing: -0.01em                     /* Tighter */
```

**NEVER use `font-semibold` or `font-bold` - max is `font-medium` (500)**

### Spacing & Sizing
```css
/* Touch Targets (WCAG AAA) */
Mobile: min 44x44px
Desktop: 36-40px (optimized)

/* Responsive Sizing Pattern */
h-11 lg:h-9   /* Inputs/Buttons on mobile→desktop */
```

### Button Sizing Standards

**IMPORTANT:** Use consistent button sizes across the app:

| Context | Size Prop | Height | Usage |
|---------|-----------|--------|-------|
| Header/toolbar actions | `default` (or omit) | 36px (h-9) | "Send Email", "Edit", "Save", "Add Customer" |
| Form submit buttons | `default` (or omit) | 36px (h-9) | Primary form actions |
| Full-width card actions | `default` (or omit) | 36px (h-9) | Settings cards, modal actions |
| Navigation buttons | `default` (or omit) | 36px (h-9) | "Back", "Next", "Continue" |
| Icon-only buttons | `size="icon"` | 36x36px (h-9 w-9) | Toolbar icons, row actions |
| Compact toolbar toggles | `size="sm"` | 32px (h-8) | Text formatting, filter toggles |

```tsx
// ✅ CORRECT - Standard action button (36px)
<Button variant="default" onClick={handleSave}>Save</Button>
<Button variant="secondary" onClick={openEmail}>Send Email</Button>

// ✅ CORRECT - Icon button (36x36px)
<Button variant="ghost" size="icon">
  <Bold className="h-4 w-4" />
</Button>

// ✅ CORRECT - Compact toolbar toggle (32px)
<Button variant="outline" size="sm">
  <Type className="h-3.5 w-3.5" />
  HTML
</Button>

// ❌ WRONG - Don't override icon button size
<Button size="icon" className="h-8 w-8">...</Button>

// ❌ WRONG - Don't use size="sm" for primary actions
<Button size="sm" onClick={handleSubmit}>Save Changes</Button>
```

### Portal Components in Sheets/Modals (CRITICAL)

**IMPORTANT:** When creating dropdown/popover components that use `createPortal`, they MUST include:

1. **High z-index:** `z-[9999]` to appear above Radix overlays
2. **Pointer events:** `pointer-events-auto` to override Radix's `pointer-events: none` on body
3. **Scroll containment:** `overscroll-contain` + event handlers to prevent scroll propagation

```tsx
// ✅ CORRECT - Portal dropdown that works inside Sheet/Modal
createPortal(
  <div className="fixed z-[9999] pointer-events-auto ...">
    <div
      className="overflow-y-auto overscroll-contain ..."
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* dropdown content */}
    </div>
  </div>,
  document.body
)

// ❌ WRONG - Will NOT be clickable inside Sheet/Modal
createPortal(
  <div className="fixed z-50 ...">
    {/* dropdown content - blocked by Radix pointer-events: none */}
  </div>,
  document.body
)
```

**Why?**
- Radix UI (Sheet, Dialog, Modal) sets `pointer-events: none` on `document.body` to trap focus
- Radix also locks body scroll, so dropdown scroll events propagate to the Sheet
- `overscroll-contain` + `onWheel`/`onTouchMove` handlers prevent scroll leaking

**Components already fixed:** `Combobox`, `PhoneInput`, `SimpleSelect`, `CurrencySelect`

---

## 🏗️ Architecture Patterns

### File Organization
```
src/features/[feature]/
├── components/
├── hooks/
├── pages/
└── types/
```

### Component Pattern
```tsx
// ✅ GOOD: Composable
<Card>
  <Card.Header><Card.Title>Title</Card.Title></Card.Header>
  <Card.Content>Content</Card.Content>
</Card>

// ❌ BAD: Monolithic props
<Card title="Title" content="Content" />
```

### Custom Hooks (Extract Logic)
- `useUIState`, `useErrorHandler`, `usePagination`
- `useFormChangeDetection`, `useDebouncedUpdate`
- `useResponsive`, `useIsMobile`, `useIsTablet`

---

## 🔧 Tech Stack (Key Libraries)

### Frontend
- React 18.2.0 + TypeScript 5.3.3
- Vite 5.4.19 + React Router 7.5.2
- Tailwind CSS 3.4.3
- **Radix UI** (Checkbox, Switch, Dialog, Select) - Accessibility built-in
- Framer Motion 12.12.1 (**NOT** on interactive components)

### State Management
- Zustand 5.0.4 (global state)
- React Context (auth/account)
- Local state (component interactions)

### Development
- ESLint + Prettier + Husky
- Vitest + Testing Library
- **Storybook** (component documentation)

---

## ✅ Code Standards

### TypeScript
- Use `??` not `||` for null checks
- Avoid `any`, use `unknown` or specific types
- All strict flags enabled

### React
- Avoid `useEffect` anti-patterns (prefer derived state, inline calculations)
- Extract complex logic to custom hooks
- Test user behavior, not implementation

### HTML Entities in JSX
```tsx
// ✅ CORRECT
Don&apos;t
Acme&apos;s

// ❌ WRONG
Don't
Acme's
```

### API Integration
**CRITICAL:** Use **camelCase** for all API properties (backend auto-converts PascalCase→camelCase in JSON)

---

## 🧪 Testing Requirements

### Mandatory
- **80% coverage minimum** (lines, functions, branches, statements)
- Tests MUST accompany all code changes
- Pre-commit hook runs tests (coverage check)

### Test Structure
```tsx
describe('ComponentName', () => {
  describe('Rendering', () => {})
  describe('Interactions', () => {})
  describe('Accessibility', () => {})
})
```

---

## 🔐 Accessibility (WCAG 2.1 AA/AAA)

### Current Status: ✅ Compliant
- 131+ ARIA attributes across 23 components
- Focus trap in modals
- Focus return on close
- Loading state announcements
- Error announcements (aria-atomic)
- 44px touch targets on mobile (AAA)

### Requirements for New Components
```tsx
// ✅ Required ARIA attributes
<button aria-label="Close" />  // Icon-only buttons
<input aria-describedby="error-id" aria-invalid={hasError} />
<div role="alert" aria-live="polite" aria-atomic="true">{error}</div>
<button aria-busy={loading} />
```

### Focus Management
- All buttons: `focus-visible:ring-2 focus-visible:ring-[#14bdea]`
- Modals: Focus trap + focus return (built into Modal component)
- Keyboard nav: Tab/Shift+Tab/Escape/Arrow keys

---

## 📦 Available Components (`@/shared/ui`)

### Inputs
`Input`, `FormInput`, `AuthInput`, `SearchInput`, `PhoneInput`, `FileInput`, `NumberInput` ✨, `DateInput` ✨, `TimeInput` ✨, `MaskedInput` ✨, `Autocomplete` ✨

### Forms  
`Checkbox`, `Toggle`, `RadioGroup`, `Textarea`

### Dropdowns
`UiDropdown` (static data), `ApiDropdown` (API data), `Select`

### Buttons
`Button`, `IconButton`, `ActionButton`, `PlainButton` (internal only)

### Layout
`Card`, `Modal`, `Table`, `Pagination`

### Feedback
`Toast` (via useGlobalToast), `PasswordStrengthIndicator`

### Other
`ViewModeToggle`, `SectionHeader`, `PhoneDisplay`, `AuthLogo`, `AnimatedContainer`

✨ **New:** NumberInput, DateInput, TimeInput recently added

**See `/docs/REUSABLE_COMPONENTS.md` for full documentation  
Run `npm run storybook` for interactive component library**

---

## 🚨 Pre-Commit Validation

**Automatic checks on every commit:**
1. Component validation (blocks raw HTML elements)
2. Code formatting (Prettier)
3. Linting (ESLint auto-fix)
4. Type checking (TypeScript)
5. Test coverage (80% minimum)

**Configuration:** `.component-rules.json`  
**Documentation:** `/docs/COMPONENT_VALIDATION.md`

---

## 📱 Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1023px
- Desktop: ≥ 1024px

### Touch Targets
- **Mobile:** min 44x44px (WCAG AAA)
- **Desktop:** 36-40px (optimized)

Components handle responsive sizing automatically with `h-11 lg:h-9` pattern.

---

## 🎯 Component Documentation

### Interactive Storybook (Primary Reference)
**Location:** `http://localhost:6006` (when running)  
**Command:** `npm run storybook`

**13 component types with interactive stories:**
- Buttons (Button, IconButton)
- Inputs (Input, FormInput, Textarea, FileInput)
- Forms (Checkbox, Toggle, RadioGroup)
- Dropdowns (UiDropdown)
- Layout (Card, Table, Modal)

**Features:**
- ✅ Live component previews
- ✅ Interactive prop controls
- ✅ Accessibility testing (WCAG violations)
- ✅ Responsive viewport testing
- ✅ Copy-paste code snippets
- ✅ All variants and states

### Documentation Folder (`/docs`)
**Comprehensive guides for all aspects:**
- UI Architecture & roadmap
- Component usage patterns
- Code quality standards
- Backend integration
- Testing guidelines

**Index:** `/docs/README.md`

---

## 📝 When Making Changes

### ALWAYS:
1. ✅ Use reusable components (pre-commit validates)
2. ✅ Add proper ARIA attributes
3. ✅ Include TypeScript types
4. ✅ Write tests (80% coverage)
5. ✅ Use global toast for notifications
6. ✅ Follow design system colors/typography
7. ✅ Ensure 44px touch targets on mobile
8. ✅ Update documentation if changing architecture

### NEVER:
1. ❌ Use raw HTML form elements (`<input>`, `<button>`, `<select>`, etc.)
2. ❌ Create local toast implementations
3. ❌ Add animations to dropdowns/interactive components
4. ❌ Use `font-semibold` or `font-bold`
5. ❌ Add frontend fallbacks for backend data
6. ❌ Use `||` instead of `??` for null checks
7. ❌ Skip tests or drop coverage below 80%
8. ❌ Use apostrophes directly (use `&apos;`)

---

## 🔍 Quick Reference

### Add New Feature
1. Create in `src/features/[feature-name]/`
2. Use components from `@/shared/ui`
3. Extract logic to hooks
4. Add tests (80%+ coverage)
5. Create Storybook story (if new component)
6. Update `/docs/UI_ARCHITECTURE_IMPROVEMENTS.md` if architectural change

### Add New Component
1. Create in `src/shared/ui/ComponentName/`
2. Export from `src/shared/ui/index.ts`
3. Add ARIA attributes
4. Add 44px touch targets (mobile)
5. Add focus indicators
6. Create `.stories.tsx` file
7. Add to `.component-rules.json` excludePaths
8. Write tests

### Debug Pre-Commit Failure
```bash
npm run validate:components  # Check component usage
npm run lint:fix            # Fix linting
npm run type-check          # Check TypeScript
npm test -- --run          # Run tests
```

---

## 🎓 Learning Resources

- **Component Usage:** `/docs/REUSABLE_COMPONENTS.md`
- **Validation Rules:** `/docs/COMPONENT_VALIDATION.md`
- **Architecture Tasks:** `/docs/UI_ARCHITECTURE_IMPROVEMENTS.md`
- **Development Standards:** `/docs/DEVELOPMENT_GUIDE.md`
- **Backend Integration:** `/docs/BACKEND_INTEGRATION.md`
- **Component Showcase:** Run `npm run storybook` (interactive)

---

## 📊 Current Status

### Architecture Quality
- ✅ Component Usage: **100%**
- ✅ WCAG 2.1 AA: **Compliant**
- ✅ WCAG 2.1 AAA (Touch): **Compliant**
- ✅ TypeScript: **0 errors**
- ✅ ESLint: **0 errors**
- ✅ Test Coverage: **80%+**

### UI Improvements Progress
- **Completed:** 49/120+ tasks (41%)
- **Current Focus:** Component Documentation
- **See:** `/docs/UI_ARCHITECTURE_IMPROVEMENTS.md`

---

## 🚀 Getting Started (For AI Agents)

When you start working on this project:

1. **Read this file first** (essential context)
2. **Check `/docs/UI_ARCHITECTURE_IMPROVEMENTS.md`** (current tasks)
3. **Reference `/docs/REUSABLE_COMPONENTS.md`** (component usage)
4. **Use components from `@/shared/ui`** (enforced by validation)
5. **Run `npm run storybook`** (see all components visually)
6. **Follow WCAG guidelines** (44px touch, ARIA, focus management)

**Remember:** Pre-commit validation will catch most mistakes automatically!

---

*This file contains only CRITICAL context. See `/docs` folder for comprehensive documentation.*
