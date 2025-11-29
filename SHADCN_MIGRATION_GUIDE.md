# Shadcn UI Migration Guide
## Round Dashboard Integration Plan

**Date:** November 26, 2025
**Goal:** Integrate Shadcn UI components while preserving existing functionality
**Timeline:** 2-3 weeks

---

## Phase 1: Setup & Configuration (Day 1)

### ✅ Step 1: MCP Configuration Created

**Location:** `.claude/mcp.json`

This enables Claude Code to use the Shadcn MCP server for intelligent component suggestions.

### ✅ Step 2: Shadcn Configuration Created

**Location:** `components.json`

This configures Shadcn to work with your existing project structure:
- Components will be installed to: `src/shared/ui/shadcn/`
- Uses your existing Tailwind config
- Respects your path aliases (`@/`)
- CSS variables enabled (matches your design system)

### 📋 Step 3: Install Shadcn CLI

```bash
cd round-dashboard
npx shadcn@latest init
```

**When prompted:**
- ✅ TypeScript: **Yes**
- ✅ Style: **Default**
- ✅ Base color: **Slate** (closest to your dark theme)
- ✅ CSS variables: **Yes**
- ✅ Tailwind config: Use existing `tailwind.config.js`
- ✅ Components path: `@/shared/ui/shadcn`
- ✅ Utils path: `@/shared/utils`

### 📋 Step 4: Update Tailwind Config

Shadcn will add its own CSS variables. We need to **merge** them with your existing ones.

**File:** `src/index.css`

Add Shadcn's base styles (will be auto-added by init):
```css
@layer base {
  :root {
    /* Shadcn defaults - we'll customize these */
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;

    /* Your existing variables - KEEP THESE */
    --bg: 0 0% 0%;
    --bg-subtle: 0 0% 4%;
    /* ... rest of your variables */
  }
}
```

**Strategy:** We'll map Shadcn's variables to your existing ones in Phase 2.

---

## Phase 2: Component Installation & Customization (Days 2-4)

### Core Components to Install

```bash
# Install components you'll use immediately
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add form
npx shadcn@latest add table
npx shadcn@latest add toast
npx shadcn@latest add alert
npx shadcn@latest add skeleton
```

This installs to: `src/shared/ui/shadcn/`

### Component Customization Strategy

#### Example: Button Component

**Shadcn default** (installed to `src/shared/ui/shadcn/button.tsx`):
```tsx
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

**Your customization:**
```tsx
// 1. Adjust to your design system
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-lg font-normal tracking-tight transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-[#14bdea] disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-contrast hover:bg-primary-hover shadow-sm", // Your primary
        destructive: "bg-transparent text-destructive border border-destructive/30 hover:bg-destructive/10",
        outline: "bg-bg-raised text-fg border border-border hover:bg-bg-hover",
        secondary: "bg-bg-raised text-fg border border-border hover:bg-bg-hover shadow-sm",
        ghost: "bg-transparent text-fg-muted border border-transparent hover:bg-bg-hover hover:text-fg",
        link: "bg-transparent text-primary border border-transparent hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm", // Your standard 40px
        sm: "h-8 px-3 py-1.5 text-xs",
        lg: "h-12 px-6 py-2.5 text-base",
        xl: "h-14 px-8 py-3 text-lg",
        icon: "h-10 w-10", // Keep for icon buttons
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### CSS Variables Mapping

**File:** `src/index.css`

Map Shadcn variables to your existing design tokens:

```css
@layer base {
  :root {
    /* Shadcn variables mapped to your tokens */
    --background: var(--bg); /* 0 0% 0% */
    --foreground: var(--fg); /* 0 0% 93% */

    --card: var(--bg-raised); /* 0 0% 8% */
    --card-foreground: var(--fg);

    --popover: var(--bg-raised);
    --popover-foreground: var(--fg);

    --primary: 316 88% 46%; /* Your pink #D417C8 */
    --primary-foreground: 0 0% 100%;

    --secondary: 191 86% 50%; /* Your cyan #14BDEA */
    --secondary-foreground: 0 0% 100%;

    --muted: var(--bg-subtle); /* 0 0% 4% */
    --muted-foreground: var(--fg-muted); /* 0 0% 64% */

    --accent: 248 52% 64%; /* Your purple #7767DA */
    --accent-foreground: 0 0% 100%;

    --destructive: var(--destructive); /* Keep yours */
    --destructive-foreground: 0 0% 100%;

    --border: var(--border); /* 0 0% 12% */
    --input: var(--input); /* 0 0% 6% */
    --ring: 191 86% 50%; /* Cyan for focus ring */

    --radius: 0.5rem; /* 8px - your default */
  }
}
```

---

## Phase 3: Gradual Migration (Days 5-10)

### Migration Strategy: Coexistence First

**Don't replace everything at once.** Run old and new components side-by-side:

```tsx
// Old component (keep for now)
import { Button as OldButton } from '@/shared/ui/Button'

// New Shadcn component
import { Button } from '@/shared/ui/shadcn/button'

export const MyComponent = () => {
  return (
    <>
      <OldButton variant="primary">Old Button</OldButton>
      <Button variant="default">New Shadcn Button</Button>
    </>
  )
}
```

### Priority Migration Order

#### Week 1: Non-Critical Pages
1. ✅ **Settings Pages** (low traffic)
   - User Settings → Use Shadcn Form + Input
   - Organization Settings → Use Shadcn Tabs + Card

2. ✅ **Onboarding Flow** (controlled environment)
   - Replace custom multi-step form with Shadcn Form
   - Add Shadcn Stepper component

#### Week 2: Core Features
3. ✅ **Customer Management**
   - CustomerTable → Shadcn Table + Skeleton
   - Modals → Shadcn Dialog
   - Forms → Shadcn Form (with React Hook Form)

4. ✅ **Dashboard** (last - most critical)
   - Cards → Shadcn Card
   - Charts → Keep custom (Shadcn doesn't have charts)
   - KPIs → Shadcn Card variants

### Migration Checklist Per Component

For each component you migrate:

- [ ] Install Shadcn component: `npx shadcn@latest add [component]`
- [ ] Customize variants to match design system
- [ ] Update CSS variables if needed
- [ ] Create parallel component (keep old one)
- [ ] Test in Storybook
- [ ] Test accessibility (keyboard, screen reader)
- [ ] Migrate one page/feature
- [ ] Test in production
- [ ] Remove old component once confident

---

## Phase 4: Auth Pages Refactor (Days 11-14)

This is your **biggest pain point** - auth pages bypass the component system.

### Before (Current - Hardcoded):
```tsx
// ❌ BusinessLoginPage.tsx - BAD
<button className="w-full bg-auth-magenta text-white font-medium h-9 px-4 rounded-lg hover:bg-auth-magenta-hover transition-colors">
  Sign In
</button>

<input className="w-full h-9 bg-auth-bg border border-auth-border rounded-lg px-3 text-white" />
```

### After (Shadcn):
```tsx
// ✅ BusinessLoginPage.tsx - GOOD
import { Button } from '@/shared/ui/shadcn/button'
import { Input } from '@/shared/ui/shadcn/input'
import { Form, FormField, FormControl, FormLabel, FormMessage } from '@/shared/ui/shadcn/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

export const BusinessLoginPage = () => {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  })

  const onSubmit = (data) => {
    // Login logic
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@company.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
    </Form>
  )
}
```

**Benefits:**
- ✅ **50-70% less code** (React Hook Form handles validation)
- ✅ Uses design system components
- ✅ Consistent with rest of app
- ✅ Accessible by default
- ✅ Type-safe with Zod

### Auth Pages Migration Order

1. **Day 11:** `PersonalLoginPage.tsx` + `BusinessLoginPage.tsx`
2. **Day 12:** `PersonalRegisterPage.tsx` + `BusinessRegisterPage.tsx`
3. **Day 13:** `ForgotPasswordPage.tsx` + `ResetPasswordPage.tsx`
4. **Day 14:** `EmailConfirmationPage.tsx` + remaining auth pages

---

## Phase 5: Color Token Cleanup (Days 15-16)

### Automated Color Migration

**Create script:** `scripts/migrate-colors.js`

```javascript
import { readFileSync, writeFileSync } from 'fs'
import { globSync } from 'glob'

const colorMappings = {
  // Hardcoded colors → Design tokens
  'bg-\\[#000000\\]': 'bg-background',
  'bg-\\[#141414\\]': 'bg-card',
  'bg-\\[#1c1c1e\\]': 'bg-card',
  'bg-\\[#212124\\]': 'bg-muted',
  'bg-\\[#0F1115\\]': 'bg-input',
  'text-\\[#a3a3a3\\]': 'text-muted-foreground',
  'text-\\[#ededed\\]': 'text-foreground',
  'border-\\[#1f1f1f\\]': 'border-border',
  'bg-\\[#635BFF\\]': 'bg-accent', // Stripe purple
  // Add more mappings
}

const files = globSync('src/**/*.{tsx,ts}')

files.forEach(file => {
  let content = readFileSync(file, 'utf-8')
  let changed = false

  Object.entries(colorMappings).forEach(([pattern, replacement]) => {
    const regex = new RegExp(pattern, 'g')
    if (regex.test(content)) {
      content = content.replace(regex, replacement)
      changed = true
    }
  })

  if (changed) {
    writeFileSync(file, content, 'utf-8')
    console.log(`✅ Migrated: ${file}`)
  }
})

console.log('✅ Color migration complete!')
```

**Run:**
```bash
node scripts/migrate-colors.js
```

**Review changes:**
```bash
git diff
```

### Manual Review Required

Some colors need context-aware decisions:
- `bg-[#371b1d]` - Danger surface → `bg-destructive/10`?
- Custom gradients → Keep as-is or rebuild?

---

## Phase 6: Form Library Integration (Days 17-18)

### Install React Hook Form + Zod

```bash
npm install react-hook-form @hookform/resolvers zod
```

### Shadcn Form Component

```bash
npx shadcn@latest add form
```

This installs:
- `Form` wrapper
- `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`
- Integrated with React Hook Form

### Migration Example: AddCustomerModal

**Before (280 lines):**
```tsx
const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [nameError, setNameError] = useState('')
const [emailError, setEmailError] = useState('')

const handleNameChange = (e) => setName(e.target.value)
const handleEmailChange = (e) => setEmail(e.target.value)

const handleNameBlur = () => {
  if (!name) setNameError('Name is required')
}

const handleSubmit = async (e) => {
  e.preventDefault()
  // Validation logic...
  // API call...
}

return (
  <Modal>
    <Input
      label="Name"
      value={name}
      onChange={handleNameChange}
      onBlur={handleNameBlur}
      error={nameError}
    />
    <Input
      label="Email"
      value={email}
      onChange={handleEmailChange}
      error={emailError}
    />
  </Modal>
)
```

**After (80 lines):**
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormField, FormControl, FormLabel, FormMessage } from '@/shared/ui/shadcn/form'
import { Input } from '@/shared/ui/shadcn/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/shadcn/dialog'

const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
})

export const AddCustomerModal = ({ isOpen, onClose }) => {
  const form = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: '', email: '', phone: '' }
  })

  const onSubmit = async (data) => {
    try {
      await customerService.create(data)
      showSuccess('Customer created!')
      onClose()
      form.reset()
    } catch (error) {
      showError(error.message)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Customer</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Add Customer</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
```

**Reduction:** 280 lines → 80 lines = **71% less code**

---

## Phase 7: React Query Integration (Days 19-20)

### Install TanStack Query

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

### Setup QueryClient

**File:** `src/main.tsx`

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
      retry: 1
    }
  }
})

root.render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
)
```

### Migration Example: CustomersPage

**Before:**
```tsx
const [customers, setCustomers] = useState([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

useEffect(() => {
  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const response = await customerService.getAll()
      setCustomers(response.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  fetchCustomers()
}, [])
```

**After:**
```tsx
import { useQuery } from '@tanstack/react-query'

const { data: customers, isLoading, error } = useQuery({
  queryKey: ['customers'],
  queryFn: () => customerService.getAll()
})
```

**Benefits:**
- ✅ Automatic caching
- ✅ Background refetching
- ✅ Optimistic updates
- ✅ 60% less code

---

## Phase 8: Final Cleanup & Documentation (Days 21)

### Remove Old Components

Once Shadcn components are fully integrated:

```bash
# Backup old components
mkdir -p archive/old-components
mv src/shared/ui/Button archive/old-components/
mv src/shared/ui/Input archive/old-components/
# ... etc
```

### Update Documentation

1. **Update REUSABLE_COMPONENTS.md** → Point to Shadcn docs
2. **Create SHADCN_CUSTOMIZATION.md** → Document your customizations
3. **Update Storybook** → Add Shadcn component stories

### Add ESLint Rule

Prevent hardcoded colors going forward:

```javascript
// .eslintrc.cjs
module.exports = {
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Literal[value=/bg-\\[#/]',
        message: 'Use design tokens instead of hardcoded hex colors (e.g., bg-background, bg-primary)'
      }
    ]
  }
}
```

---

## Success Metrics

### Before Shadcn:
- ❌ 30+ hardcoded colors
- ❌ Auth pages bypass components
- ❌ 280-line forms with manual validation
- ❌ Manual API state management
- ❌ 13 font-weight violations
- ❌ Inconsistent error handling

### After Shadcn (Target):
- ✅ 0 hardcoded colors (all use tokens)
- ✅ 100% component system usage
- ✅ 70% less form code (React Hook Form)
- ✅ Automatic caching (React Query)
- ✅ Consistent typography
- ✅ Standardized error patterns
- ✅ Accessible by default (Radix UI)
- ✅ Fully themeable (CSS variables)

---

## Troubleshooting

### Issue: Shadcn styles conflict with existing styles

**Solution:** Use CSS layers to control precedence

```css
/* src/index.css */
@layer base, shadcn, components, utilities;

@layer base {
  /* Your existing base styles */
}

@layer shadcn {
  /* Shadcn component styles */
}
```

### Issue: Type errors after migration

**Solution:** Ensure `@/` path alias is configured

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Next Steps

1. ✅ **Run Shadcn init:** `npx shadcn@latest init`
2. ✅ **Install core components:** Button, Input, Card, Dialog, Form
3. ✅ **Customize first component:** Match Button to your design system
4. ✅ **Migrate one page:** Start with Settings page (low risk)
5. ✅ **Expand gradually:** Follow priority order above

---

## Support Resources

- **Shadcn UI Docs:** https://ui.shadcn.com
- **Component Examples:** https://ui.shadcn.com/examples
- **GitHub:** https://github.com/shadcn-ui/ui
- **Discord:** https://discord.gg/shadcn

---

**Ready to start? Run:**
```bash
npx shadcn@latest init
```
