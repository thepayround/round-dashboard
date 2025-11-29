# UI/UX Standards for Round Dashboard

**Last Updated:** November 29, 2025

This document outlines the UI/UX standards for all pages in the Round Dashboard application. Following these standards ensures consistency, performance, and quality across the entire application.

---

## Authentication Pages Standards

### Layout Requirements

#### Container Dimensions
All authentication pages (login, signup, password reset, etc.) must use:

```tsx
// ✅ STANDARD: AuthLayout container
<div className="h-screen w-screen flex items-center justify-center p-6 overflow-hidden">
  {/* Content */}
</div>
```

**Requirements:**
- Use `h-screen` (not `min-h-screen`) to prevent scrollbars
- Use `w-screen` for full viewport width
- Add `overflow-hidden` to prevent any scrolling
- Padding: `p-6` for consistent spacing

#### Form Card Width

```tsx
// ✅ STANDARD: Form card width
<motion.div className="w-full max-w-sm">
  <Card>{/* Form content */}</Card>
</motion.div>
```

**Requirements:**
- Maximum width: `max-w-sm` (384px)
- NOT `max-w-md` or `max-w-lg`
- Ensures consistent, compact form layout

### Logo Standards

#### Logo Positioning

```tsx
// ✅ STANDARD: Fixed logo in top-left corner
<div className="fixed top-6 left-6 md:top-10 md:left-10 z-50">
  <Link to="/" className="inline-block transition-opacity hover:opacity-80">
    <img
      src={WhiteLogo}
      alt="Round Logo"
      className="h-10 w-10"
      loading="eager"
      fetchPriority="high"
    />
  </Link>
</div>
```

**Requirements:**
- Position: `fixed` (not `absolute`)
- Location: Top-left corner with responsive padding
- Z-index: `z-50`
- Size: `h-10 w-10` (40px × 40px)
- **Must be outside framer-motion wrapper**

#### Logo Performance

**Image Attributes:**
```tsx
<img
  loading="eager"          // Load immediately
  fetchPriority="high"     // High priority in loading queue
/>
```

**HTML Preload (in index.html):**
```html
<link rel="preload" href="/src/assets/logos/white-logo.svg" as="image" type="image/svg+xml" />
```

**Requirements:**
- Preload logo in HTML `<head>`
- No entrance animations on logo
- Logo appears immediately on page load

---

## Component Height Standards

### Form Elements

All form elements must use consistent heights:

```tsx
// ✅ STANDARD: h-9 (36px) for all form elements
<Input className="h-9" />
<Button className="h-9" />
<Select className="h-9" />
<CommandInput className="h-9" />
```

**Applies to:**
- Input
- Button
- Select (SelectTrigger)
- Command (CommandInput)
- Combobox

**Exception:** Mobile touch targets can be `h-11` (44px) for accessibility

---

## Form Spacing Standards

### Field Spacing

```tsx
// ✅ STANDARD: Form field spacing
<form onSubmit={handleSubmit}>
  <div className="flex flex-col gap-8">
    {/* Form fields with 32px vertical spacing */}
    <div className="grid gap-2">
      <Label>Email</Label>
      <Input />
    </div>

    <div className="grid gap-2">
      <Label>Password</Label>
      <Input />
    </div>

    {/* Action buttons grouped with less spacing */}
    <div className="flex flex-col gap-4">
      <Button>Login</Button>
      <SocialLoginButton />
    </div>
  </div>
</form>
```

**Requirements:**
- Form fields: `gap-8` (32px vertical spacing)
- Within field group: `gap-2` (8px between label and input)
- Action buttons: `gap-4` (16px between buttons)

---

## Border Styling Standards

### Universal Border Color

```css
/* ✅ STANDARD: Global border color in index.css */
*,
::before,
::after {
  border-color: hsl(var(--border));
}
```

**Requirements:**
- Use `hsl(var(--border))` format (not just `var(--border)`)
- Ensures consistent borders across all components
- Prevents Tailwind's default white borders

---

## Card Styling Standards

### Border Radius

```tsx
// ✅ STANDARD: Card border radius
<Card className="rounded-xl border bg-card text-card-foreground shadow-sm">
```

**Requirements:**
- Border radius: `rounded-xl` (12px)
- Consistent across all cards
- Matches shadcn design system

---

## Animation Standards

### Form Card Animation

```tsx
// ✅ STANDARD: Framer Motion entrance animation
<motion.div
  initial={{ opacity: 0, y: 30, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{
    duration: 0.8,
    delay: 0.3,
    ease: 'easeOut',
  }}
  className="w-full max-w-sm"
>
  <Card>{/* Content */}</Card>
</motion.div>
```

**Requirements:**
- Duration: 0.8s
- Delay: 0.3s (gives time for logo to appear first)
- Easing: `easeOut`
- **Logo must NOT be inside this wrapper**

---

## Architecture Pattern

### AuthLayout Component

```tsx
// ✅ STANDARD: AuthLayout structure
export const AuthLayout = ({ children }: AuthLayoutProps = {}) => (
  <div className="h-screen w-screen flex items-center justify-center p-6 overflow-hidden">
    {/* Logo - outside motion.div */}
    <div className="fixed top-6 left-6 md:top-10 md:left-10 z-50">
      <Link to="/" className="inline-block transition-opacity hover:opacity-80">
        <img src={WhiteLogo} alt="Round Logo" className="h-10 w-10" loading="eager" fetchPriority="high" />
      </Link>
    </div>

    {/* Main Content - with animation */}
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
      className="w-full max-w-sm"
    >
      {children ?? <Outlet />}
    </motion.div>
  </div>
)
```

**Requirements:**
- Logo rendered in AuthLayout (not individual pages)
- Logo outside motion.div for instant display
- All auth pages wrapped with `withAuthLayout()` helper

---

## Text Color Hierarchy

### Muted vs Primary Text

```tsx
// ✅ STANDARD: Text color usage
<p className="text-muted-foreground">
  Don't have an account?{' '}
  <Link to="/signup" className="text-primary underline-offset-4 hover:underline">
    Sign up
  </Link>
</p>
```

**Requirements:**
- Question/prompt text: `text-muted-foreground`
- Link text: `text-primary`
- Creates clear visual hierarchy

---

## Checklist for New Auth Pages

When creating new authentication pages:

- [ ] Use AuthLayout wrapper (logo already included)
- [ ] Form card max width is `max-w-sm`
- [ ] All form elements use `h-9` height
- [ ] Form fields have `gap-8` spacing
- [ ] Action buttons have `gap-4` spacing
- [ ] Card uses `rounded-xl` border radius
- [ ] Page container uses `h-screen` (not `min-h-screen`)
- [ ] No scrollbars appear (`overflow-hidden`)
- [ ] Logo is NOT duplicated in page component
- [ ] Responsive breakpoints tested (mobile, tablet, desktop)
- [ ] Focus states visible on all interactive elements
- [ ] ARIA attributes for accessibility
- [ ] Loading states for async actions

---

## File References

**Key Files:**
- `src/features/auth/components/AuthLayout.tsx` - Base layout with logo
- `src/features/auth/pages/PersonalLoginPage.tsx` - Reference implementation
- `index.html` - Logo preload configuration
- `src/shared/ui/shadcn/button.tsx` - Button heights and variants
- `src/shared/ui/shadcn/input.tsx` - Input heights and styling
- `src/shared/ui/shadcn/card.tsx` - Card border radius

---

## Why These Standards Matter

1. **Consistency**: Users encounter predictable layouts across all flows
2. **Performance**: Logo preloading and optimization prevent visual jumps
3. **Accessibility**: Standardized heights and spacing improve usability
4. **Maintainability**: Clear patterns make it easy to add new pages
5. **Quality**: Prevents common mistakes (scrollbars, misaligned logos, inconsistent spacing)
