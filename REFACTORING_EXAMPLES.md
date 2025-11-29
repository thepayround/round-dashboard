# Shadcn Refactoring Examples

## Import Replacements

### OLD (Deleted Wrappers)
```tsx
import { ActionButton } from '@/shared/ui/ActionButton'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { FormInput } from '@/shared/ui/FormInput'
import { AuthInput } from '@/shared/ui/AuthInput'
import { Modal } from '@/shared/ui/Modal'
import { ApiDropdown } from '@/shared/ui/ApiDropdown'
```

### NEW (Direct Shadcn)
```tsx
import { Button } from '@/shared/ui/shadcn/button'
import { Card, CardHeader, CardContent, CardFooter } from '@/shared/ui/shadcn/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/shadcn/dialog'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/ui/shadcn/select'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/ui/shadcn/form'
import { Input } from '@/shared/ui/shadcn/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
```

## Form Pattern Migration

### OLD (FormInput wrapper)
```tsx
<FormInput
  name="email"
  label="Email"
  type="email"
  value={values.email}
  onChange={handleChange}
  onBlur={handleBlur}
  error={errors.email}
  placeholder="you@example.com"
/>
```

### NEW (React Hook Form + Shadcn)
```tsx
const schema = z.object({
  email: z.string().email('Invalid email address')
})

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { email: '' }
})

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input {...field} type="email" placeholder="you@example.com" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

## Button Size Migration

### OLD
```tsx
<Button size="md">Click Me</Button>  // ❌ "md" doesn't exist
<ActionButton>Submit</ActionButton>  // ❌ Component deleted
```

### NEW
```tsx
<Button size="default">Click Me</Button>  // ✅ Valid sizes: default, sm, lg, icon
<Button type="submit">Submit</Button>    // ✅ Just use Button
```

## Modal Migration

### OLD
```tsx
import { Modal } from '@/shared/ui/Modal'

<Modal isOpen={isOpen} onClose={onClose} title="My Modal">
  <p>Content</p>
</Modal>
```

### NEW
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/shadcn/dialog'

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>My Modal</DialogTitle>
    </DialogHeader>
    <p>Content</p>
  </DialogContent>
</Dialog>
```

## ApiDropdown Migration

### OLD
```tsx
import { ApiDropdown } from '@/shared/ui/ApiDropdown'

<ApiDropdown
  value={selectedCountry}
  onChange={handleCountryChange}
  options={countries}
  placeholder="Select country"
/>
```

### NEW
```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/ui/shadcn/select'

<Select value={selectedCountry} onValueChange={handleCountryChange}>
  <SelectTrigger>
    <SelectValue placeholder="Select country" />
  </SelectTrigger>
  <SelectContent>
    {countries.map((country) => (
      <SelectItem key={country.code} value={country.code}>
        {country.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

## Quick Fix Guide

1. **Replace all Button imports:**
   - Find: `@/shared/ui/Button`
   - Replace: `@/shared/ui/shadcn/button`

2. **Replace all size="md" with size="default":**
   - Find: `size="md"`
   - Replace: `size="default"`

3. **Replace all variant="primary" with variant="default":**
   - Find: `variant="primary"`
   - Replace: `variant="default"`

4. **Delete ActionButton, use Button:**
   - Find: `<ActionButton`
   - Replace: `<Button`
   - Find: `</ActionButton>`
   - Replace: `</Button>`

5. **Replace Modal with Dialog:**
   - Complex - requires manual refactoring

6. **Replace FormInput with Form + FormField:**
   - Complex - requires React Hook Form setup
