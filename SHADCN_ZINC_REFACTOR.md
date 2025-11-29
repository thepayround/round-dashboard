# Shadcn Zinc Theme - Complete Frontend Refactor

**Goal:** Refactor entire frontend to use pure Shadcn UI with Zinc theme, following best practices

**Started:** 2025-11-26

---

## Phase 1: Foundation Setup

### 1.1 Theme Application
- [ ] Apply official Zinc dark theme CSS variables
- [ ] Remove all custom color tokens
- [ ] Test theme consistency

### 1.2 Component Installation
- [x] button
- [x] input
- [x] label
- [x] form
- [x] card
- [x] dialog
- [x] select
- [x] textarea
- [x] table
- [x] alert
- [x] skeleton
- [x] badge
- [x] avatar
- [x] dropdown-menu
- [x] separator
- [ ] checkbox
- [ ] radio-group
- [ ] switch
- [ ] slider
- [ ] tabs
- [ ] tooltip
- [ ] popover
- [ ] accordion
- [ ] alert-dialog
- [ ] aspect-ratio
- [ ] calendar
- [ ] command
- [ ] context-menu
- [ ] hover-card
- [ ] menubar
- [ ] navigation-menu
- [ ] progress
- [ ] scroll-area
- [ ] sheet
- [ ] toast
- [ ] toggle
- [ ] toggle-group

---

## Phase 2: Component Audit - COMPLETE ✅

**Summary:**
- **100+ components** identified for refactoring
- **21 pages** across 8 features
- **37 shared UI components** to deprecate/refactor
- **42 feature-specific components** to update
- **Timeline:** 4-5 weeks (120-160 hours)

### 2.1 Auth Feature (`src/features/auth/`)
- [x] `pages/BusinessLoginPage.tsx` - ✅ MIGRATED TO SHADCN
- [ ] `pages/PersonalLoginPage.tsx` - ✅ Already using Shadcn (audit shows it's done)
- [ ] `pages/BusinessRegisterPage.tsx` - ❌ Uses AuthInput, needs migration
- [ ] `pages/PersonalRegisterPage.tsx` - ❌ Multi-step form, needs migration
- [ ] `pages/ForgotPasswordPage.tsx` - ❌ Uses AuthInput, needs migration
- [ ] `pages/ResetPasswordPage.tsx` - ❌ Uses AuthInput, needs migration
- [ ] `pages/EmailConfirmationPage.tsx` - ❌ Custom inputs
- [ ] `pages/ResendConfirmationPage.tsx` - ❌ Uses AuthInput
- [ ] `pages/InvitationAcceptancePage.tsx` - ❌ Uses old Input
- [ ] `pages/WelcomePage.tsx` - ⚠️ Landing page, minimal forms
- [ ] `pages/ConfirmationPendingPage.tsx` - ⚠️ Status page
- [x] `components/SocialLoginButton.tsx` - ✅ MIGRATED TO SHADCN
- [ ] `components/AuthInput.tsx` - ❌ DEPRECATED (replace with Shadcn Input)
- [ ] `components/ActionButton.tsx` - ❌ DEPRECATED (replace with Shadcn Button)

### 2.2 Customers Feature (`src/features/customers/`)
- [ ] `pages/CustomersPage.tsx` - ❌ Uses custom Button, Card, Checkbox, Badge, Modal
- [ ] `pages/CustomerDetailPage.tsx` - ❌ Uses custom Input, Button, Card, Modal
- [ ] `components/AddCustomerModal.tsx` - ❌ CRITICAL - Custom form state
- [ ] `components/EditCustomerModal.tsx` - ❌ CRITICAL - Custom form state
- [ ] `components/CustomerTable.tsx` - ❌ Custom table implementation
- [ ] `components/CustomerNotesModal.tsx` - ❌ Custom form
- [ ] `components/EmailComposeModal.tsx` - ❌ Custom form
- [ ] `components/DangerousActionsModal.tsx` - ⚠️ Confirmation dialog

### 2.3 Onboarding Feature (`src/features/onboarding/`)
- [ ] `pages/GetStartedPage.tsx` - ❌ CRITICAL - 7-step wizard
- [ ] `components/TabNavigation.tsx` - ❌ Custom navigation
- [ ] `components/steps/OrganizationStep.tsx` - ❌ React Hook Form
- [ ] `components/steps/UserInfoStep.tsx` - ❌ React Hook Form
- [ ] `components/steps/AddressStep.tsx` - ❌ React Hook Form
- [ ] `components/steps/BillingStep.tsx` - ❌ React Hook Form
- [ ] `components/steps/TeamStep.tsx` - ❌ React Hook Form
- [ ] `components/steps/ProductsStep.tsx` - ❌ React Hook Form
- [ ] `components/steps/BusinessSettingsStep.tsx` - ❌ React Hook Form

### 2.4 Dashboard Feature (`src/features/dashboard/`)
- [ ] `pages/DashboardPage.tsx` - ❌ Uses custom Button, Card, Alert
- [ ] `components/StatCard.tsx` - ❌ Custom card variant
- [ ] `components/RevenueChart.tsx` - ⚠️ Chart component

### 2.5 Settings Feature (`src/features/settings/`)
- [ ] `pages/OrganizationSettingsPage.tsx` - ❌ 8 settings sections
- [ ] `pages/TeamManagementPage.tsx` - ❌ Team member management
- [ ] `pages/UserSettingsPage.tsx` - ❌ 4 settings sections
- [ ] 20+ sub-components - ❌ All need refactoring

### 2.6 Shared UI Components (`src/shared/ui/`)
**CRITICAL (Week 1-2):**
- [ ] `Button/Button.tsx` - ❌ CRITICAL - Used 800+ times
- [ ] `Modal/Modal.tsx` - ❌ CRITICAL - Used 15+ places
- [ ] `Card/Card.tsx` - ❌ CRITICAL - Complex variants
- [ ] `Input/Input.tsx` - ❌ HIGH - Used 100+ times

**HIGH (Week 2-3):**
- [ ] `Table/Table.tsx` - ❌ Complex data table
- [ ] `DataTable/DataTable.tsx` - ❌ Generic table
- [ ] `ApiDropdown/ApiDropdown.tsx` - ❌ API-driven dropdown
- [ ] `UiDropdown/UiDropdown.tsx` - ❌ Static dropdown

**MEDIUM/LOW:**
- [ ] 25+ other components - See comprehensive audit report

---

## Phase 3: Refactor Strategy

### 3.1 Principles
1. **Component Reusability** - Every UI element should be a reusable component
2. **Pure Shadcn** - Use only Shadcn components, no custom CSS
3. **Zinc Theme** - Follow Zinc color palette exactly
4. **Type Safety** - Full TypeScript types for all components
5. **Accessibility** - WCAG 2.1 AA compliance
6. **Composition** - Build complex components from simple Shadcn primitives

### 3.2 Refactor Order (Priority)
1. ✅ Auth pages (Business Login completed)
2. Auth pages (Personal Login, Signup, etc.)
3. Shared UI components
4. Dashboard
5. Customers
6. Settings
7. Team Management
8. Analytics

### 3.3 Before/After Pattern
**Before (Old):**
```tsx
<AuthInput
  label="Email"
  type="email"
  value={email}
  onChange={handleChange}
  error={error}
/>
```

**After (Shadcn):**
```tsx
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input type="email" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## Phase 4: File-by-File Refactor

### Auth Pages
- [x] `src/features/auth/pages/BusinessLoginPage.tsx`
- [ ] `src/features/auth/pages/PersonalLoginPage.tsx`
- [ ] `src/features/auth/pages/BusinessSignupPage.tsx`
- [ ] `src/features/auth/pages/PersonalSignupPage.tsx`
- [ ] `src/features/auth/pages/ForgotPasswordPage.tsx`
- [ ] `src/features/auth/pages/ResetPasswordPage.tsx`
- [ ] `src/features/auth/pages/EmailConfirmationPage.tsx`

### Dashboard
- [ ] `src/features/dashboard/pages/DashboardPage.tsx`
- [ ] `src/features/dashboard/components/StatCard.tsx`
- [ ] `src/features/dashboard/components/RevenueChart.tsx`
- [ ] `src/features/dashboard/components/RecentActivity.tsx`

### Customers
- [ ] `src/features/customers/pages/CustomersPage.tsx`
- [ ] `src/features/customers/pages/CustomerDetailsPage.tsx`
- [ ] `src/features/customers/components/CustomerTable.tsx`
- [ ] `src/features/customers/components/CustomerNotesModal.tsx`

### Settings
- [ ] `src/features/settings/pages/AccountSettingsPage.tsx`
- [ ] `src/features/settings/pages/SecuritySettingsPage.tsx`

### Team
- [ ] `src/features/team/pages/TeamManagementPage.tsx`

---

## Phase 5: Component Deprecation

### Components to Deprecate (Replace with Shadcn)
- [ ] `src/shared/ui/Button.tsx` → `shadcn/button`
- [ ] `src/shared/ui/Input.tsx` → `shadcn/input`
- [ ] `src/shared/ui/Card.tsx` → `shadcn/card`
- [ ] `src/shared/ui/Modal.tsx` → `shadcn/dialog`
- [ ] `src/features/auth/components/AuthInput.tsx` → `shadcn/form` + `shadcn/input`
- [ ] `src/features/auth/components/ActionButton.tsx` → `shadcn/button`

---

## Phase 6: Quality Checks

### 6.1 Visual Consistency
- [ ] All components use Zinc theme colors
- [ ] Consistent spacing (use Tailwind spacing scale)
- [ ] Consistent typography
- [ ] Consistent border radius
- [ ] Consistent shadows

### 6.2 Accessibility
- [ ] All forms have proper labels
- [ ] All interactive elements are keyboard accessible
- [ ] Proper focus states
- [ ] ARIA attributes where needed
- [ ] Color contrast meets WCAG AA

### 6.3 Functionality
- [ ] All existing features work
- [ ] Forms validate correctly
- [ ] API calls work
- [ ] Navigation works
- [ ] Authentication works
- [ ] Data fetching works

### 6.4 Performance
- [ ] No unnecessary re-renders
- [ ] Proper memoization
- [ ] Lazy loading where appropriate
- [ ] Optimized images

---

## Progress Tracking

### Completed
- ✅ BusinessLoginPage migrated to Shadcn
- ✅ SocialLoginButton migrated to Shadcn
- ✅ Input component updated for dark theme
- ✅ Autofill styles fixed

### In Progress
- 🔄 Zinc theme application
- 🔄 Installing remaining Shadcn components

### Blocked
- None

### Notes
- Keep all existing functionality working
- Test after each major refactor
- Document any breaking changes
- Update storybook/documentation if exists

---

## Migration Checklist Per Component

For each component being migrated:
- [ ] Identify current implementation
- [ ] Choose appropriate Shadcn component(s)
- [ ] Create new implementation
- [ ] Test functionality
- [ ] Test accessibility
- [ ] Update imports in parent components
- [ ] Remove old component (or mark deprecated)
- [ ] Update documentation

---

## Resources

- Shadcn UI: https://ui.shadcn.com
- Zinc Theme: https://ui.shadcn.com/themes
- Radix UI: https://www.radix-ui.com
- React Hook Form: https://react-hook-form.com
- Zod: https://zod.dev

---

## Timeline Estimate

- **Phase 1 (Foundation):** 1-2 hours
- **Phase 2 (Audit):** 1 hour
- **Phase 3 (Auth Pages):** 3-4 hours
- **Phase 4 (Dashboard):** 3-4 hours
- **Phase 5 (Customers):** 3-4 hours
- **Phase 6 (Settings/Team):** 2-3 hours
- **Phase 7 (QA/Testing):** 2-3 hours

**Total Estimate:** 15-21 hours of focused work

---

## Daily Log

### Day 1 - 2025-11-26
- ✅ Installed 15 core Shadcn components
- ✅ Migrated BusinessLoginPage to Shadcn
- ✅ Migrated SocialLoginButton to Shadcn
- ✅ Fixed Input component dark theme
- ✅ Fixed autofill styles
- 🔄 Starting Zinc theme application
