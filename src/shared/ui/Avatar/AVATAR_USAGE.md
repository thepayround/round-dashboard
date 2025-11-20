# Avatar Component Usage Guide

## Overview
The Avatar component provides a consistent way to display user avatars across the application. It supports both images and initials, with multiple size and shape variants.

## Import
```tsx
import { Avatar } from '@/shared/ui'
// or
import { Avatar } from '@/shared/ui/Avatar'
```

## Basic Usage

### With Initials (Default)
```tsx
<Avatar name="Dimitris Petas" />
```

### With Image
```tsx
<Avatar name="Dimitris Petas" src="/path/to/avatar.jpg" />
```

## Size Variants

```tsx
<Avatar name="John Doe" size="xs" />   {/* 20px - w-5 h-5 */}
<Avatar name="John Doe" size="sm" />   {/* 24px - w-6 h-6 */}
<Avatar name="John Doe" size="md" />   {/* 32px - w-8 h-8 (default) */}
<Avatar name="John Doe" size="lg" />   {/* 40px - w-10 h-10 */}
<Avatar name="John Doe" size="xl" />   {/* 48px - w-12 h-12 */}
```

## Shape Variants

```tsx
<Avatar name="John Doe" shape="circle" />    {/* rounded-full (default) */}
<Avatar name="John Doe" shape="rounded" />   {/* rounded-lg */}
<Avatar name="John Doe" shape="square" />    {/* rounded-none */}
```

## Recommended Usage Patterns

### User Profile (Large)
```tsx
<Avatar name="Dimitris Petas" size="xl" shape="circle" />
```

### Navigation/Header (Medium)
```tsx
<Avatar name="Dimitris Petas" size="md" shape="circle" />
```

### Lists/Tables (Small)
```tsx
<Avatar name="Dimitris Petas" size="sm" shape="circle" />
```

### Inline Mentions (Extra Small)
```tsx
<Avatar name="Dimitris Petas" size="xs" shape="circle" />
```

## Replace Inconsistent Implementations

### ❌ Old (Inconsistent)
```tsx
// DON'T DO THIS
<div className="w-6 h-6 text-[10px] rounded-full bg-primary flex items-center justify-center text-white font-medium tracking-tight">
  D
</div>
```

### ✅ New (Consistent)
```tsx
// DO THIS INSTEAD
<Avatar name="Dimitris" size="sm" />
```

## TypeScript Types

```tsx
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type AvatarShape = 'circle' | 'rounded' | 'square'

export interface AvatarProps {
  name: string
  src?: string
  size?: AvatarSize
  shape?: AvatarShape
  className?: string
}
```

## Custom Styling

You can add custom classes using the `className` prop:

```tsx
<Avatar
  name="Dimitris Petas"
  size="md"
  className="ring-2 ring-primary ring-offset-2"
/>
```

## Best Practices

1. **Always use the Avatar component** instead of custom div implementations
2. **Use 'circle' shape** for user avatars (default)
3. **Use 'rounded' shape** for organization/group avatars
4. **Provide meaningful names** for proper initials generation and accessibility
5. **Default size is 'md' (32px)** - use this unless you have a specific need
6. **Smallest recommended size is 'sm' (24px)** - 'xs' should only be used in very compact UIs
