# UI Redesign Tasks - Polar.sh Inspired

**Goal**: Transform the current UI to match polar.sh's clean, compact, modern aesthetic with premium feel and better information density.

## Design Principles from Polar.sh

1. **Compact & Dense**: Smaller padding, tighter rows, more information visible
2. **Clean & Minimal**: Less visual noise, subtle borders, refined typography
3. **Consistent Spacing**: Systematic use of smaller spacing scale (2px, 4px, 8px, 12px, 16px)
4. **Modern Typography**: Refined font sizes, better hierarchy, improved readability
5. **Professional Colors**: Muted backgrounds, subtle borders, refined status colors
6. **Fast & Responsive**: Lightweight feel, snappy interactions

---

## Phase 1: Design System Foundation ✅ **COMPLETED**

### TASK-DS-001: Update Spacing Scale ✅
**Priority**: Critical | **Effort**: Medium | **Status**: ✅ Completed
- [x] Reduce base spacing unit from current scale to tighter scale
- [x] Update design tokens:
  - `space-xs`: 2px (currently 4px)
  - `space-sm`: 4px (currently 8px)
  - `space-md`: 8px (currently 12px)
  - `space-lg`: 12px (currently 16px)
  - `space-xl`: 16px (currently 24px)
  - `space-2xl`: 24px (currently 32px)
- [x] Update `designTokens.ts` with new spacing values
- [x] Update Tailwind config to reflect new scale
- [x] Added compact spacing for tables, buttons, modals, inputs

### TASK-DS-002: Typography Refinement ✅
**Priority**: Critical | **Effort**: Medium | **Status**: ✅ Completed
- [x] Reduce font sizes across the board:
  - Headings: h1 (20px), h2 (18px), h3 (16px)
  - Body: 13px (text-sm)
  - Small: 11px (text-xs)
  - Tiny: 10px (text-tiny)
- [x] Adjust line heights for tighter text (1.5 → 1.4)
- [x] Improve font weights (more use of medium/500)
- [x] Added to Tailwind config with proper line heights

### TASK-DS-003: Color Palette Refinement ✅
**Priority**: High | **Effort**: Medium | **Status**: ✅ Completed
- [x] Introduce more subtle gray shades:
  - `gray-50`: #FAFAFA (very light backgrounds)
  - `gray-100`: #F5F5F5 (cards, hover states)
  - `gray-200`: #E5E5E5 (borders)
  - `gray-300`: #D4D4D4 (muted borders)
  - `gray-600`: #737373 (secondary text)
  - `gray-700`: #525252 (body text)
- [x] Refine status colors to be more muted:
  - Success: Less saturated green (#10B981 → #059669)
  - Error: Less saturated red (#EF4444 → #DC2626)
  - Warning: Less saturated yellow (#F59E0B → #D97706)
- [x] Added to both designTokens.ts and Tailwind config
- [x] Added subtle border colors (white/8)

### TASK-DS-004: Border & Shadow System ✅
**Priority**: Medium | **Effort**: Small | **Status**: ✅ Completed
- [x] Reduce border widths (2px → 1px everywhere)
- [x] Use more subtle border colors (white/10 → white/8)
- [x] Reduce shadow intensity
- [x] Remove unnecessary shadows
- [x] Update focus ring to be thinner (2px → 1px)
- [x] Added minimal shadow system (subtle, card, hover, modal)
- [x] Added thinner focus ring shadows

**Additional Achievements**:
- [x] Added 4 new pre-commit validation rules (warnings) for compact design
- [x] Updated VALIDATION_RULES.md with new guidance
- [x] Updated .component-rules.json (now 42 total rules)

---

## Phase 2: Tables & Data Display ✅ **COMPLETED**

### TASK-TABLE-001: Compact Table Rows ✅

**Priority**: Critical | **Effort**: High | **Status**: ✅ Completed

- [x] Reduce row height from 72px to 48px
- [x] Reduce cell padding (px-6 py-4 → px-4 py-3)
- [x] Make table text smaller (text-sm → text-xs for headers)
- [x] Tighten column spacing
- [x] Update all table components:
  - Base Table components (Table, TableHeader, TableBody, TableRow, TableHead, TableCell)
  - CustomerTable
  - TeamMembersTable
  - Updated spacing from space-x-3 to space-x-2
  - Updated borders from white/10 to white/8

**Files modified**:

- `src/shared/ui/Table/Table.tsx` ✅
- `src/features/customers/components/CustomerTable.tsx` ✅
- `src/features/settings/components/TeamMembersTable.tsx` ✅

### TASK-TABLE-002: Refined Table Styling ✅

**Priority**: High | **Effort**: Medium | **Status**: ✅ Completed

- [x] Simplify table borders (removed heavy borders)
- [x] Use subtle row separators (white/8)
- [x] Improve header styling (subtle background, smaller text-xs)
- [x] Better hover states (subtle transitions)
- [x] Updated all table borders to white/8 for consistency

### TASK-TABLE-003: Badge & Status Improvements ✅

**Priority**: Medium | **Effort**: Small | **Status**: ✅ Completed

- [x] Make badges smaller (md: px-2.5 py-1 → px-2 py-0.5)
- [x] Reduce badge font size (text-xs = 11px)
- [x] Use more muted badge colors (15% background, 25% border opacity)
- [x] Make badge corners slightly less rounded (rounded-full → rounded-md)
- [x] Updated all badge variants with muted colors

**Files modified**:

- `src/shared/ui/Badge/Badge.tsx` ✅

### TASK-TABLE-004: Avatar Refinement ✅

**Priority**: Low | **Effort**: Small | **Status**: ✅ Completed

- [x] Reduce avatar sizes (md: 40px → 32px for tables)
- [x] Tighter avatar + text spacing (gap-3 → gap-2 in tables)
- [x] Adjusted all avatar sizes proportionally:
  - xs: 24px → 20px
  - sm: 32px → 24px
  - md: 40px → 32px (default for tables)
  - lg: 48px → 40px
  - xl: 64px → 48px
- [x] Updated rounded corners (rounded-xl → rounded-lg)

**Files modified**:

- `src/shared/ui/Avatar/Avatar.tsx` ✅

---

## Phase 3: Forms & Inputs 🚧 **IN PROGRESS**

### TASK-FORM-001: Compact Form Inputs ✅ (Partial)

**Priority**: Critical | **Effort**: High | **Status**: 🚧 Partial Complete

- [x] Reduce input height (44px mobile/36px desktop → 36px consistent)
- [x] Update input padding (px-3 py-2 for md size)
- [x] Make input text size 13px (text-sm)
- [x] Tighten label spacing (mb-2 → mb-1.5)
- [x] Update core input components:
  - ✅ Input
  - ✅ Textarea
  - ⏸️ FormInput (to be done)
  - ⏸️ AuthInput (to be done)
  - ⏸️ SearchInput (to be done)
  - ⏸️ Select (to be done)
  - ⏸️ Dropdown (to be done)

**Files modified**:

- `src/shared/ui/Input/Input.tsx` ✅
- `src/shared/ui/Textarea/Textarea.tsx` ✅

### TASK-FORM-002: Form Layout Refinement ✅

**Priority**: High | **Effort**: Medium | **Status**: ✅ Completed

- [x] Compact field helper text (text-sm → text-xs)
- [x] Better error message styling (smaller icons, tighter spacing)
- [x] Implemented in Input and Textarea components

### TASK-FORM-003: Button Refinement ✅

**Priority**: High | **Effort**: Medium | **Status**: ✅ Completed

- [x] Reduce button heights (consistent sizes, no responsive breakpoints)
- [x] Reduce button padding across all sizes
- [x] Make button text size 13px (text-sm)
- [x] Tighter icon spacing in buttons (gap-2 → gap-1.5)
- [x] Update Button and IconButton components
- [x] Change border radius (rounded-lg → rounded-md)
- [x] Thinner focus rings (ring-2 → ring-1)

**Button sizes**:

- sm: 28px (h-7)
- md: 36px (h-9)
- lg: 40px (h-10)
- xl: 44px (h-11)

**IconButton sizes**:

- sm: 28px (h-7)
- md: 36px (h-9)
- lg: 40px (h-10)

**Files modified**:

- `src/shared/ui/Button/Button.tsx` ✅
- `src/shared/ui/Button/IconButton.tsx` ✅

### TASK-FORM-004: Dropdown & Select Polish ⏸️

**Priority**: Medium | **Effort**: Medium | **Status**: ⏸️ Pending

- [ ] Reduce dropdown item height (40px → 32px)
- [ ] Reduce dropdown item padding (px-4 py-2 → px-3 py-1.5)
- [ ] Make dropdown text smaller (14px → 13px)
- [ ] Tighter dropdown menu spacing
- [ ] Better selected state styling
- [ ] Compact multi-select chips

---

## Phase 4: Cards & Containers

### TASK-CARD-001: Compact Card Design
**Priority**: High | **Effort**: High
- [ ] Reduce card padding (p-6 → p-4)
- [ ] Reduce card border radius (rounded-lg → rounded-md)
- [ ] Simplify card borders (thinner, more subtle)
- [ ] Remove heavy shadows
- [ ] Update all card usages across dashboard
- [ ] Tighter spacing between card elements (space-y-4 → space-y-3)

### TASK-CARD-002: Section Headers
**Priority**: Medium | **Effort**: Medium
- [ ] Reduce section header size (text-xl → text-lg)
- [ ] Reduce section header margins (mb-6 → mb-4)
- [ ] Make section descriptions smaller (text-sm → text-xs)
- [ ] Tighter header spacing

### TASK-CARD-003: Empty States
**Priority**: Low | **Effort**: Small
- [ ] Reduce empty state icon size
- [ ] Make empty state text smaller
- [ ] Reduce empty state padding
- [ ] Update EmptyState component

**Files to modify**:
- `src/shared/ui/EmptyState/EmptyState.tsx`

---

## Phase 5: Modals & Overlays

### TASK-MODAL-001: Compact Modal Design
**Priority**: High | **Effort**: Medium
- [ ] Reduce modal padding (px-6 py-6 → px-5 py-4)
- [ ] Reduce modal header height (px-6 py-4 → px-5 py-3)
- [ ] Reduce modal footer padding (px-6 py-4 → px-5 py-3)
- [ ] Make modal title smaller (text-xl → text-lg)
- [ ] Tighter modal content spacing
- [ ] Update Modal component

**Files to modify**:
- `src/shared/ui/Modal/Modal.tsx`
- All modal implementations in features/

### TASK-MODAL-002: Modal Forms Optimization
**Priority**: Medium | **Effort**: Medium
- [ ] Apply compact form styles to all modals
- [ ] Reduce spacing between form fields in modals
- [ ] Update all modal forms:
  - AddCustomerModal
  - EditCustomerModal
  - EmailComposeModal
  - CustomerNotesModal
  - InviteMemberModal
  - EditMemberModal
  - All other modals

---

## Phase 6: Navigation & Layout

### TASK-NAV-001: Compact Sidebar
**Priority**: High | **Effort**: High
- [ ] Reduce sidebar width (256px → 220px)
- [ ] Reduce navigation item height (44px → 36px)
- [ ] Reduce navigation item padding (px-3 py-2.5 → px-3 py-2)
- [ ] Make navigation text smaller (14px → 13px)
- [ ] Tighter icon spacing (gap-3 → gap-2)
- [ ] Reduce sidebar padding
- [ ] Update NavigationItem component

**Files to modify**:
- `src/shared/layout/DashboardLayout/`
- `src/shared/layout/DashboardLayout/NavigationItem.tsx`

### TASK-NAV-002: Header Refinement
**Priority**: Medium | **Effort**: Medium
- [ ] Reduce header height (64px → 56px)
- [ ] Reduce header padding
- [ ] Make header elements smaller
- [ ] Tighter breadcrumb spacing
- [ ] Update header components

**Files to modify**:
- `src/shared/layout/DashboardLayout/DashboardLayout.tsx`
- `src/shared/layout/Breadcrumb/Breadcrumb.tsx`

### TASK-NAV-003: Mobile Header Optimization
**Priority**: Medium | **Effort**: Small
- [ ] Apply compact styles to mobile header
- [ ] Reduce mobile nav item sizes
- [ ] Update MobileHeader component

---

## Phase 7: Dashboard & Analytics

### TASK-DASH-001: Stat Cards Refinement
**Priority**: High | **Effort**: Medium
- [ ] Reduce stat card padding (p-6 → p-4)
- [ ] Make stat values slightly smaller
- [ ] Reduce stat label size (text-sm → text-xs)
- [ ] Tighter stat card spacing
- [ ] Update MetricCard/StatCard components

### TASK-DASH-002: Chart Optimization
**Priority**: Medium | **Effort**: Medium
- [ ] Reduce chart container padding
- [ ] Make chart legends smaller
- [ ] Tighter chart spacing
- [ ] Compact chart tooltips
- [ ] Update chart components

### TASK-DASH-003: Dashboard Grid Refinement
**Priority**: Medium | **Effort**: Small
- [ ] Reduce grid gap (gap-6 → gap-4)
- [ ] Tighter dashboard section spacing
- [ ] Update dashboard layouts

---

## Phase 8: Specific Page Optimizations

### TASK-PAGE-001: Products Page
**Priority**: High | **Effort**: High
- [ ] Compact product cards
- [ ] Smaller product form inputs
- [ ] Reduce create product modal size
- [ ] Tighter pricing section
- [ ] Update all product-related components

**Files to modify**:
- `src/features/products/`

### TASK-PAGE-002: Customers Page
**Priority**: High | **Effort**: High
- [ ] Compact customer table
- [ ] Smaller customer detail cards
- [ ] Reduce customer form spacing
- [ ] Update customer modals
- [ ] Tighter customer info display

**Files to modify**:
- `src/features/customers/`

### TASK-PAGE-003: Billing/Invoices Pages
**Priority**: High | **Effort**: High
- [ ] Compact invoice table
- [ ] Smaller invoice details
- [ ] Reduce billing cards padding
- [ ] Update invoice components

**Files to modify**:
- `src/features/billing/`

### TASK-PAGE-004: Usage Billing (Meters) Page
**Priority**: High | **Effort**: Medium
- [ ] Compact meter cards
- [ ] Smaller filter inputs
- [ ] Reduce preview table size
- [ ] Update meter creation form
- [ ] Tighter meter preview layout

**Files to modify**:
- `src/features/usage-billing/`

### TASK-PAGE-005: Sales Pages
**Priority**: Medium | **Effort**: High
- [ ] Compact orders/subscriptions tables
- [ ] Smaller order detail cards
- [ ] Reduce checkout display size
- [ ] Update sales components

**Files to modify**:
- `src/features/sales/`

### TASK-PAGE-006: Benefits Page
**Priority**: Low | **Effort**: Medium
- [ ] Compact benefit cards
- [ ] Smaller benefit forms
- [ ] Update benefit components

**Files to modify**:
- `src/features/benefits/`

### TASK-PAGE-007: Settings Page
**Priority**: Medium | **Effort**: Medium
- [ ] Compact settings forms
- [ ] Smaller settings cards
- [ ] Reduce settings sections spacing
- [ ] Update settings components

---

## Phase 9: Customer Portal

### TASK-PORTAL-001: Portal Layout Refinement
**Priority**: High | **Effort**: High
- [ ] Compact portal navigation
- [ ] Reduce portal card padding
- [ ] Smaller portal tables
- [ ] Tighter portal spacing
- [ ] Update customer portal layout

**Files to modify**:
- `src/features/customer-portal/`

### TASK-PORTAL-002: Portal Overview Optimization
**Priority**: Medium | **Effort**: Medium
- [ ] Compact subscription overview cards
- [ ] Smaller usage displays
- [ ] Reduce invoice preview size
- [ ] Update portal overview components

---

## Phase 10: Validation & Polish

### TASK-VAL-002: Update Component Validation Rules
**Priority**: High | **Effort**: Small
- [ ] Update `.component-rules.json` with new spacing rules
- [ ] Add validation for compact sizes
- [ ] Update validation for refined typography
- [ ] Test validation with new components

### TASK-POL-001: Cross-browser Testing
**Priority**: High | **Effort**: Medium
- [ ] Test all components in Chrome
- [ ] Test all components in Firefox
- [ ] Test all components in Safari
- [ ] Test all components in Edge
- [ ] Fix browser-specific issues

### TASK-POL-002: Responsive Testing
**Priority**: Critical | **Effort**: High
- [ ] Test all pages at mobile (375px, 428px)
- [ ] Test all pages at tablet (768px, 1024px)
- [ ] Test all pages at desktop (1280px, 1440px, 1920px)
- [ ] Fix responsive issues
- [ ] Ensure compact design works at all sizes

### TASK-POL-003: Accessibility Testing
**Priority**: Critical | **Effort**: High
- [ ] Verify all compact elements meet touch target size (44x44px minimum on mobile)
- [ ] Test keyboard navigation with smaller elements
- [ ] Test screen reader with new typography sizes
- [ ] Verify color contrast with new subtle colors
- [ ] Update accessibility checklist

### TASK-POL-004: Performance Testing
**Priority**: Medium | **Effort**: Medium
- [ ] Test page load times
- [ ] Verify no layout shifts with new sizing
- [ ] Check rendering performance with compact tables
- [ ] Optimize any performance issues

### TASK-POL-005: Dark Theme Refinement
**Priority**: High | **Effort**: Medium
- [ ] Verify all compact styles work in dark theme
- [ ] Adjust dark theme colors for better subtle borders
- [ ] Test dark theme contrast ratios
- [ ] Polish dark theme across all components

---

## Implementation Strategy

### Recommended Order:
1. **Phase 1** (Design System) - Foundation for everything else
2. **Phase 2** (Tables) - High visibility, high impact
3. **Phase 3** (Forms) - Used everywhere
4. **Phase 4** (Cards) - Common component
5. **Phase 5** (Modals) - Important for UX
6. **Phase 6** (Navigation) - Frame for content
7. **Phase 7** (Dashboard) - Main landing page
8. **Phase 8** (Pages) - Individual page optimization
9. **Phase 9** (Portal) - External-facing
10. **Phase 10** (Validation) - Final polish

### Estimated Timeline:
- **Phase 1**: 1-2 days
- **Phase 2**: 2-3 days
- **Phase 3**: 3-4 days
- **Phase 4**: 2-3 days
- **Phase 5**: 2 days
- **Phase 6**: 2 days
- **Phase 7**: 2 days
- **Phase 8**: 4-5 days
- **Phase 9**: 2 days
- **Phase 10**: 3-4 days

**Total**: ~23-30 days for complete redesign

### Priority Breakdown:
- **Critical**: Must do first (Foundation, Tables, Forms, Responsive)
- **High**: Do soon (Cards, Modals, Navigation, Key pages)
- **Medium**: Important but can wait (Analytics, Settings, Polish)
- **Low**: Nice to have (Empty states, Benefits page)

---

## Key Metrics to Track

After implementation, measure:
1. **Information Density**: More content visible without scrolling
2. **Visual Hierarchy**: Clear, clean, easy to scan
3. **Performance**: Load times, render performance
4. **User Feedback**: Cleaner, more modern feel
5. **Accessibility**: WCAG AA compliance maintained
6. **Consistency**: Unified design language across all pages

---

## Notes

- All spacing changes must be validated against the `.component-rules.json`
- Maintain WCAG 2.1 Level AA accessibility throughout
- Keep mobile touch targets at 44x44px minimum
- Test with real content at each stage
- Get user feedback after each major phase
- Document all breaking changes
- Update Storybook with new component sizes

---

**Created**: 2025-01-20
**Status**: Planning
**Target Completion**: 4-6 weeks
**Total Tasks**: 60+
