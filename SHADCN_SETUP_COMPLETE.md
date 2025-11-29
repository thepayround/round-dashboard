# ✅ Shadcn UI Setup Complete!

## What's Been Configured

### 1. MCP Configuration
**Location:** `.claude/mcp.json`

The MCP server is configured to enable Claude Code to provide intelligent Shadcn component suggestions.

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
```

### 2. Shadcn Configuration
**Location:** `components.json`

Configures Shadcn to integrate with your existing project structure:
- Components install to: `src/shared/ui/shadcn/`
- Uses existing Tailwind config
- Respects path aliases (`@/`)
- CSS variables enabled

### 3. CSS Variables Added
**Location:** `src/index.css`

Shadcn-specific variables have been mapped to your existing design tokens:

```css
/* Shadcn UI Variables - Mapped to Design Tokens */
--background: var(--bg);                    /* Pure black */
--foreground: var(--fg);                    /* Off-white */
--card-background: var(--card);
--card-foreground: var(--fg);
--popover: var(--bg-raised);
--popover-foreground: var(--fg);
--primary-foreground: var(--accent-contrast);
--secondary-foreground: var(--accent-contrast);
--muted: var(--bg-subtle);
--muted-foreground: var(--fg-muted);
--accent-foreground: var(--accent-contrast);
--destructive-foreground: 0 0% 100%;
--radius: 0.5rem;
```

### 4. First Component Installed
**Location:** `src/shared/ui/shadcn/button.tsx`

Your first Shadcn component is ready to use! It's configured to use your design tokens.

---

## Quick Start Guide

### Install More Components

```bash
# Core UI components
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add form
npx shadcn@latest add table
npx shadcn@latest add toast
npx shadcn@latest add alert
npx shadcn@latest add skeleton
npx shadcn@latest add tabs
npx shadcn@latest add select
npx shadcn@latest add checkbox

# Form components (for React Hook Form integration)
npx shadcn@latest add label
npx shadcn@latest add textarea

# Navigation
npx shadcn@latest add navigation-menu
npx shadcn@latest add breadcrumb

# Data display
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add separator

# Feedback
npx shadcn@latest add progress
npx shadcn@latest add spinner
```

All components will be installed to `src/shared/ui/shadcn/`.

---

## Usage Examples

### Using Shadcn Button

```tsx
import { Button } from '@/shared/ui/shadcn/button'

export const MyComponent = () => {
  return (
    <div className="space-y-4">
      <Button variant="default">Primary Button</Button>
      <Button variant="secondary">Secondary Button</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link Button</Button>

      {/* Sizes */}
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <Icon className="h-4 w-4" />
      </Button>
    </div>
  )
}
```

### Coexistence with Old Components

You can run both old and new components side-by-side:

```tsx
// Old component (keeping for now)
import { Button as OldButton } from '@/shared/ui/Button'

// New Shadcn component
import { Button } from '@/shared/ui/shadcn/button'

export const MigrationExample = () => {
  return (
    <div className="flex gap-4">
      <OldButton variant="primary">Old Button</OldButton>
      <Button variant="default">New Shadcn Button</Button>
    </div>
  )
}
```

---

## Next Steps

### Phase 1: Install Core Components (Today)

```bash
# Run these commands to install essential components
npx shadcn@latest add input
npx shadcn@latest add form
npx shadcn@latest add dialog
npx shadcn@latest add card
```

### Phase 2: Set Up React Hook Form (Tomorrow)

```bash
npm install react-hook-form @hookform/resolvers zod
```

Then migrate one form:

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormField, FormControl, FormLabel, FormMessage } from '@/shared/ui/shadcn/form'
import { Input } from '@/shared/ui/shadcn/input'
import { Button } from '@/shared/ui/shadcn/button'

const formSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2)
})

export const ExampleForm = () => {
  const form = useForm({
    resolver: zodResolver(formSchema)
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

### Phase 3: Migrate Settings Page (Week 1)

Start with low-traffic pages:
- User Settings
- Organization Settings

### Phase 4: Refactor Auth Pages (Week 2)

Replace hardcoded buttons/inputs with Shadcn components:
- BusinessLoginPage
- PersonalLoginPage
- Registration pages

---

## Testing Your Setup

Create a test page to verify everything works:

**File:** `src/features/test/ShadcnDemo.tsx`

```tsx
import { Button } from '@/shared/ui/shadcn/button'

export const ShadcnDemo = () => {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-medium">Shadcn UI Components</h1>

      <div className="space-y-4">
        <h2 className="text-lg">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg">Sizes</h2>
        <div className="flex items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>
    </div>
  )
}
```

Add to your routes:
```tsx
<Route path="/shadcn-demo" element={<ShadcnDemo />} />
```

Then visit: `http://localhost:3000/shadcn-demo`

---

## Resources

- **Shadcn UI Documentation:** https://ui.shadcn.com
- **Component Examples:** https://ui.shadcn.com/examples
- **Themes:** https://ui.shadcn.com/themes
- **Migration Guide:** See `SHADCN_MIGRATION_GUIDE.md`
- **Full Audit Report:** See `UI_UX_AUDIT_REPORT.md`

---

## Troubleshooting

### TypeScript errors with imports

**Problem:** `Cannot find module '@/shared/ui/shadcn/button'`

**Solution:** Restart TypeScript server in VSCode:
- `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
- Type "TypeScript: Restart TS Server"

### Components not using design tokens

**Problem:** Colors look wrong

**Solution:** Ensure CSS variables are loaded:
1. Check `src/index.css` has Shadcn variables
2. Verify `@tailwind base` is imported
3. Check browser DevTools → Computed styles for `--background`, `--primary`, etc.

### MCP server not working

**Problem:** Claude Code doesn't suggest Shadcn components

**Solution:**
1. Restart Claude Code
2. Verify `.claude/mcp.json` exists
3. Check MCP server status in Claude Code settings

---

## What's Next?

You have **3 options** for proceeding:

### Option 1: Install Core Components Now (Recommended)
```bash
# Install the 10 most useful components
npx shadcn@latest add input card dialog form table toast alert skeleton badge avatar
```

### Option 2: Migrate One Page as Proof of Concept
Pick a low-risk page (like Settings) and fully migrate it to Shadcn components.

### Option 3: Follow Full Migration Guide
See `SHADCN_MIGRATION_GUIDE.md` for the complete 3-week migration plan.

---

**Ready to continue?** Let me know which option you'd like to pursue!
