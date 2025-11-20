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

## Phase 3: Forms & Inputs ✅ **COMPLETED**

### TASK-FORM-001: Compact Form Inputs ✅

**Priority**: Critical | **Effort**: High | **Status**: ✅ Completed

- [x] Reduce input height (44px mobile/36px desktop → 36px consistent)
- [x] Update input padding (px-3 → px-4 for standardized spacing)
- [x] Make input text size 13px (text-sm → text-xs for compact)
- [x] Tighten label spacing (mb-2 → mb-1.5)
- [x] Update core input components:
  - ✅ Input
  - ✅ Textarea
  - ✅ FormInput
  - ✅ AuthInput
  - ⏸️ SearchInput (future work)
  - ⏸️ Select (future work)
  - ✅ Dropdown (UiDropdown, ApiDropdown)

**Files modified**:

- `src/shared/ui/Input/Input.tsx` ✅
- `src/shared/ui/Textarea/Textarea.tsx` ✅
- `src/shared/ui/FormInput.tsx` ✅
- `src/shared/ui/AuthInput/AuthInput.tsx` ✅
- `src/shared/ui/UiDropdown/UiDropdown.tsx` ✅
- `src/shared/ui/ApiDropdown/ApiDropdown.tsx` ✅

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

### TASK-FORM-004: Dropdown & Select Polish ✅

**Priority**: Medium | **Effort**: Medium | **Status**: ✅ Completed

- [x] Update dropdown trigger height (h-11 lg:h-9 → h-9 consistent)
- [x] Update dropdown padding (px-3 → px-4 for standardized spacing)
- [x] Update border radius (rounded-lg → rounded-md)
- [x] Update focus rings (ring-2 → ring-1 for compact design)
- [x] Tighter dropdown menu spacing
- [x] Better selected state styling
- [x] Applied to both UiDropdown and ApiDropdown components

**Files modified**:

- `src/shared/ui/UiDropdown/UiDropdown.tsx` ✅
- `src/shared/ui/ApiDropdown/ApiDropdown.tsx` ✅

---

## Phase 4: Cards & Containers ✅ **COMPLETED**

### TASK-CARD-001: Compact Card Design ✅

**Priority**: High | **Effort**: High | **Status**: ✅ Completed

- [x] Reduce card padding (p-6 → p-4 consistent, simplified responsive variants)
- [x] Reduce card border radius (rounded-lg → rounded-md)
- [x] Simplify card borders (thinner, more subtle - already using border-[#1e1f22])
- [x] Remove heavy shadows (already minimal in design)
- [x] Update all card usages across dashboard (Card component updated)
- [x] Tighter spacing between card elements (mb-4 → mb-3, space-x-4 → space-x-3, gap-4 → gap-3)
- [x] Update icon sizes (w-12/h-12 → w-10/h-10, w-16/h-16 → w-12/h-12)
- [x] Update icon border radius (rounded-xl → rounded-md)
- [x] Update text sizes for all card variants (text-2xl → text-xl, text-base → text-sm, text-sm → text-xs)

**Files modified**:

- `src/shared/ui/Card/Card.tsx` ✅
- `src/shared/ui/Card/Card.Header.tsx` ✅
- `src/shared/ui/Card/Card.Content.tsx` ✅
- `src/shared/ui/Card/Card.Footer.tsx` ✅

### TASK-CARD-002: Section Headers ✅

**Priority**: Medium | **Effort**: Medium | **Status**: ✅ Completed

- [x] Reduce section header size (text-xl → text-lg in CardHeader)
- [x] Reduce section header margins (mb-4 → mb-3)
- [x] Make section descriptions smaller (text-sm → text-xs)
- [x] Tighter header spacing (space-x-3 → space-x-2, space-x-2 → space-x-1.5)

### TASK-CARD-003: Empty States ✅

**Priority**: Low | **Effort**: Small | **Status**: ✅ Completed

- [x] Reduce empty state icon size (w-12/h-12 → w-10/h-10)
- [x] Make empty state text smaller (text-base → text-sm, text-sm → text-xs)
- [x] Reduce empty state padding (py-12 → py-8)
- [x] Tighter margins (mb-4 → mb-3, mb-6 → mb-4)
- [x] Update EmptyState component

**Files modified**:

- `src/shared/ui/EmptyState/EmptyState.tsx` ✅

---

## Phase 5: Modals & Overlays ✅ **COMPLETED**

### TASK-MODAL-001: Compact Modal Design ✅

**Priority**: High | **Effort**: Medium | **Status**: ✅ Completed

- [x] Reduce modal padding (px-6 py-6 → px-6 py-4)
- [x] Keep modal header padding at px-6 py-4 (standardized vertical padding)
- [x] Make modal title smaller (text-xl → text-lg)
- [x] Make modal subtitle smaller (text-sm → text-xs)
- [x] Update modal border radius (rounded-lg → rounded-md)
- [x] Update modal icon container (rounded-xl → rounded-md, w-10 h-10 → w-8 h-8)
- [x] Update modal icon size (w-5 h-5 → w-4 h-4)
- [x] Tighter modal header spacing (space-x-3 → space-x-2)
- [x] Update Modal component

**Files modified**:

- `src/shared/ui/Modal/Modal.tsx` ✅

### TASK-MODAL-002: ConfirmDialog Optimization ✅

**Priority**: Medium | **Effort**: Medium | **Status**: ✅ Completed

- [x] Update icon container (w-12 h-12 rounded-full → w-10 h-10 rounded-md)
- [x] Update icon size (w-6 h-6 → w-5 h-5)
- [x] Reduce spacing (space-y-6 → space-y-4)
- [x] Tighter icon and message spacing (space-x-4 → space-x-2)
- [x] Tighter action buttons spacing (space-x-3 → space-x-2)
- [x] Reduce action padding (pt-4 → pt-2)
- [x] Update ConfirmDialog component

**Files modified**:

- `src/shared/widgets/ConfirmDialog.tsx` ✅

---

## Phase 6: Navigation & Layout ✅ **COMPLETED**

### TASK-NAV-001: Compact Sidebar ✅

**Priority**: High | **Effort**: High | **Status**: ✅ Completed

- [x] Reduce sidebar width (280px → 220px in constants and DashboardLayout)
- [x] Navigation item height already at 36px (h-9)
- [x] Update navigation item padding (removed responsive variants, standardized to px-4)
- [x] Make navigation text smaller (text-sm md:text-base lg:text-sm → text-xs)
- [x] Tighter icon spacing (mr-2.5 md:mr-3 lg:mr-2.5 → mr-2)
- [x] Reduce sidebar padding (removed responsive variants)
- [x] Update NavigationItem component with compact design
- [x] Update icon sizes (w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 → w-4 h-4)

**Files modified**:

- `src/shared/layout/DashboardLayout/NavigationItem.tsx` ✅
- `src/shared/layout/DashboardLayout.tsx` ✅
- `src/shared/layout/DashboardLayout/constants.ts` ✅

### TASK-NAV-002: Header Refinement ✅

**Priority**: Medium | **Effort**: Medium | **Status**: ✅ Completed

- [x] Reduce mobile header height (h-16/64px → h-14/56px)
- [x] Update main content margin (mt-16 → mt-14)
- [x] Reduce breadcrumb text size (text-base → text-sm)
- [x] Tighter breadcrumb spacing (mx-2 → mx-1.5, mb-4 → mb-2)
- [x] Update gradient header margin (mb-4 → mb-2)
- [x] Update header components

**Files modified**:

- `src/shared/layout/DashboardLayout.tsx` ✅
- `src/shared/layout/Breadcrumb/Breadcrumb.tsx` ✅

### TASK-NAV-003: Mobile Header Optimization ✅

**Priority**: Medium | **Effort**: Small | **Status**: ✅ Completed

- [x] Apply compact styles to mobile header (h-16 → h-14)
- [x] Mobile nav items use same compact styling as desktop
- [x] Updated MobileHeader component within DashboardLayout

**Files modified**:

- `src/shared/layout/DashboardLayout.tsx` ✅

---

## Phase 7: Dashboard & Analytics ✅ **COMPLETED**

### TASK-DASH-001: Stat Cards Refinement ✅

**Priority**: High | **Effort**: Medium | **Status**: ✅ Completed

- [x] Reduce stat card padding (padding="lg" → padding="md", p-6 → p-4)
- [x] Make stat values slightly smaller (text-2xl → text-xl)
- [x] Reduce stat label size (already text-xs, kept compact)
- [x] Tighter stat card spacing (mb-6 → mb-4, gap-4 → gap-2)
- [x] Update all stat/metric card components in DashboardPage
- [x] Update KPI cards with compact padding and text sizes
- [x] Update quick stats cards with compact icon containers (p-3 → p-2, rounded-lg → rounded-md)

**Files modified**:

- `src/features/dashboard/pages/DashboardPage.tsx` ✅

### TASK-DASH-002: Chart Optimization ✅

**Priority**: Medium | **Effort**: Medium | **Status**: ✅ Completed

- [x] Reduce chart container padding (padding="lg" → padding="md")
- [x] Make chart heading smaller (text-lg → text-base)
- [x] Tighter chart spacing (maintained compact design)
- [x] Update chart card component in DashboardPage

**Files modified**:

- `src/features/dashboard/pages/DashboardPage.tsx` ✅

### TASK-DASH-003: Dashboard Grid Refinement ✅

**Priority**: Medium | **Effort**: Small | **Status**: ✅ Completed

- [x] Reduce grid gap (gap-6 → gap-4)
- [x] Tighter dashboard section spacing (mb-6 → mb-4, gap-4 → gap-2)
- [x] Update dashboard layouts (Account Details, Organization Details sections)
- [x] Update icon containers (p-3 → p-2, rounded-xl → rounded-md, w-10/h-10 → w-8/h-8)
- [x] Update heading sizes (text-xl → text-lg)
- [x] Update all nested card spacing (space-y-4 → space-y-2)
- [x] Update Addresses and Users sections with compact design

**Files modified**:

- `src/features/dashboard/pages/DashboardPage.tsx` ✅

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
