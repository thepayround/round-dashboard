# Phase 4: Manual Migration Guide

## Quick Reference for ui-ux-shadcn Patterns

### 1. Modal → Dialog Pattern

**Find & Replace:**
```tsx
// OLD import
import { Modal } from '@/shared/ui/Modal'

// NEW import
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/shadcn/dialog'
```

**Component Migration:**
```tsx
// OLD
<Modal isOpen={isOpen} onClose={onClose} title="Title" subtitle="Subtitle" icon={Icon}>
  <form>...</form>
  <div className="footer">
    <Button onClick={onClose}>Cancel</Button>
    <Button onClick={onSubmit}>Submit</Button>
  </div>
</Modal>

// NEW
<Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <p className="text-sm text-muted-foreground">Subtitle</p>
    </DialogHeader>
    <form className="space-y-6">...</form>
    <DialogFooter>
      <Button variant="ghost" onClick={onClose}>Cancel</Button>
      <Button onClick={onSubmit}>Submit</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### 2. Toggle → Switch Pattern

**Find & Replace:**
```tsx
// OLD import
import { Toggle } from '@/shared/ui'

// NEW import
import { Switch } from '@/shared/ui/shadcn/switch'
import { Label } from '@/shared/ui/shadcn/label'
```

**Component Migration:**
```tsx
// OLD
<Toggle
  label="Same as billing"
  checked={sameAsBilling}
  onChange={(e) => setSameAsBilling(e.target.checked)}
/>

// NEW
<div className="flex items-center space-x-2">
  <Switch
    id="same-billing"
    checked={sameAsBilling}
    onCheckedChange={setSameAsBilling}
  />
  <Label htmlFor="same-billing">Same as billing</Label>
</div>
```

### 3. Input with Custom Props → Pure Shadcn

**Find & Replace:**
```tsx
// OLD import
import { Input } from '@/shared/ui'

// NEW imports
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
```

**Component Migration:**
```tsx
// OLD
<Input
  id="email"
  label="Email Address"
  leftIcon={Mail}
  value={formData.email}
  onChange={(e) => handleChange('email', e.target.value)}
  error={errors.email}
  required
/>

// NEW
<div className="space-y-2">
  <Label htmlFor="email">Email Address</Label>
  <div className="relative">
    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
    <Input
      id="email"
      type="email"
      value={formData.email}
      onChange={(e) => handleChange('email', e.target.value)}
      className="pl-10"
      required
    />
  </div>
  {errors.email && (
    <p className="text-sm text-destructive">{errors.email}</p>
  )}
</div>
```

### 4. ApiDropdown → Select Pattern

**Find & Replace:**
```tsx
// OLD import
import { ApiDropdown, countryDropdownConfig } from '@/shared/ui/ApiDropdown'

// NEW import
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/ui/shadcn/select'
import { Label } from '@/shared/ui/shadcn/label'
```

**Component Migration:**
```tsx
// OLD
<div className="space-y-2">
  <span className="block text-sm font-normal text-white/90">Currency</span>
  <ApiDropdown
    config={currencyDropdownConfig}
    value={formData.currency}
    onSelect={(value) => handleChange('currency', value)}
    allowClear
  />
</div>

// NEW
<div className="space-y-2">
  <Label htmlFor="currency">Currency</Label>
  <Select
    value={formData.currency}
    onValueChange={(value) => handleChange('currency', value)}
  >
    <SelectTrigger id="currency">
      <SelectValue placeholder="Select currency" />
    </SelectTrigger>
    <SelectContent>
      {currencies.map((currency) => (
        <SelectItem key={currency.code} value={currency.code}>
          {currency.symbol} {currency.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
```

**Note:** You'll need to extract the data from the config objects. Example:
```tsx
// Extract from ApiDropdown config
const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  // ... more
]
```

### 5. Badge → Direct Shadcn

**Already works!** Badge is re-exported from barrel:
```tsx
import { Badge } from '@/shared/ui'
// This now imports from '@/shared/ui/shadcn/badge'
```

### 6. Button Props

**Shadcn Button doesn't support:**
- `label` prop (use children)
- `icon` + `iconPosition` props (use inline)
- `isLoading` prop (manual implementation)

**Migration:**
```tsx
// OLD
<Button
  label="Save Customer"
  icon={Save}
  iconPosition="left"
  isLoading={loading}
  variant="primary"
/>

// NEW
<Button variant="default" disabled={loading}>
  {loading ? (
    <>
      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      Saving...
    </>
  ) : (
    <>
      <Save className="mr-2 h-4 w-4" />
      Save Customer
    </>
  )}
</Button>
```

## File-by-File Migration Checklist

### Modal Files (Priority 1)
- [ ] AddCustomerModal.tsx
- [ ] EditCustomerModal.tsx  
- [ ] DangerousActionsModal.tsx
- [ ] EmailComposeModal.tsx
- [ ] ChangePasswordModal.tsx
- [ ] EditMemberModal.tsx
- [ ] InviteMemberModal.tsx

### Files with Multiple Component Issues (Priority 2)
- [ ] BillingAddressForm.tsx (Toggle, Input, ApiDropdown)
- [ ] CompanyDetailsForm.tsx (Input, ApiDropdown)
- [ ] BusinessRegisterPage.tsx (FormInput)
- [ ] PersonalRegisterPage.tsx (FormInput)

### Simple Input Migrations (Priority 3)
- [ ] All remaining files with Input custom props

## Migration Commands

### Check specific file errors:
```bash
npm run type-check 2>&1 | grep "AddCustomerModal"
```

### Count errors by type:
```bash
npm run type-check 2>&1 | grep "Modal" | wc -l
npm run type-check 2>&1 | grep "Toggle" | wc -l  
npm run type-check 2>&1 | grep "ApiDropdown" | wc -l
```

### Find files using specific component:
```bash
grep -r "import.*Modal" src/features --include="*.tsx"
grep -r "import.*Toggle" src/features --include="*.tsx"
grep -r "import.*ApiDropdown" src/features --include="*.tsx"
```

## Testing After Migration

After migrating each file:
1. Run `npm run type-check` to verify no errors
2. Run `npm run lint:fix` to auto-format
3. Visually check the component still works
4. Verify theme colors are correct (no hardcoded colors)

## Common Pitfalls

❌ **Don't** use `className` on form groups without proper structure
❌ **Don't** forget to change `onChange` → `onCheckedChange` for Switch
❌ **Don't** use `isOpen` with Dialog (use `open`)
❌ **Don't** keep Button `label` prop (use children)
❌ **Don't** hardcode colors (use theme variables)

✅ **Do** use `space-y-*` for vertical spacing
✅ **Do** use `Label` with all form inputs
✅ **Do** show error messages with `text-destructive`
✅ **Do** use relative positioning for icons inside inputs
✅ **Do** follow ui-ux-shadcn SKILL.md patterns
