# Card Component - Glassmorphism Design System

The Card component has been updated to use a consistent glassmorphism design throughout the platform. All cards now feature:
- `bg-white/5` background with `backdrop-blur-xl`
- `border border-white/10` for subtle borders
- Smooth hover transitions
- Gradient icon badges with `rounded-xl`

## Variants

### 1. Default Card
Basic container for any content with glassmorphism styling.

```tsx
<Card>
  <h3 className="text-white font-semibold mb-2">Custom Content</h3>
  <p className="text-white/60">Any content goes here</p>
</Card>
```

### 2. Stats Card
Perfect for dashboard statistics with large numbers and trend indicators.

```tsx
<Card
  variant="stats"
  title="Monthly Revenue"
  value="$24,500"
  icon={DollarSign}
  color="success"
  trend={{ 
    value: "+12.5%", 
    direction: "up", 
    label: "from last month" 
  }}
/>
```

**Features:**
- Large value display (2xl font)
- Icon badge with gradient background (12x12, rounded-xl)
- Trend indicator with arrow icon
- Color-coded by status

**Colors available:** `primary`, `secondary`, `accent`, `success`, `warning`, `danger`, `neutral`

### 3. Navigation Card
For clickable navigation items with icons and descriptions.

```tsx
<Card
  variant="navigation"
  title="Customers"
  description="View and manage your customer accounts"
  icon={Users}
  color="primary"
  href="/customers"
/>
```

**Navigation Variant Options:**
- `default` - Vertical layout with icon on top
- `compact` - Horizontal layout with icon on left

### 4. Nested Card
For inner cards within a parent card (like invoice items, detail rows, etc.).

```tsx
<Card>
  <h2 className="text-white font-bold mb-4">Recent Items</h2>
  <div className="space-y-3">
    <Card variant="nested" padding="md">
      <div className="flex items-center justify-between">
        <span className="text-white">Item 1</span>
        <span className="text-white/60">$100</span>
      </div>
    </Card>
    <Card variant="nested" padding="md">
      <div className="flex items-center justify-between">
        <span className="text-white">Item 2</span>
        <span className="text-white/60">$200</span>
      </div>
    </Card>
  </div>
</Card>
```

**Use cases:**
- Invoice line items
- Transaction history items
- Detail information sections
- List items within a parent card

### 5. Compact Card
Smaller card with icon and value, good for sidebars or tight spaces.

```tsx
<Card
  variant="compact"
  title="Active Users"
  value="1,247"
  icon={Users}
  color="secondary"
  trend={{ value: "+8%", direction: "up" }}
/>
```

### 6. Feature Card
Centered layout with large icon, great for feature showcases.

```tsx
<Card
  variant="feature"
  title="Advanced Analytics"
  description="Get detailed insights into your business performance"
  icon={TrendingUp}
  color="accent"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'stats' \| 'navigation' \| 'nested' \| 'compact' \| 'feature'` | `'default'` | Card layout variant |
| `title` | `string` | - | Card title |
| `value` | `string \| number` | - | Primary value (for stats/compact) |
| `description` | `string` | - | Description text |
| `icon` | `LucideIcon` | - | Icon component |
| `color` | `'primary' \| 'secondary' \| 'accent' \| 'success' \| 'warning' \| 'danger' \| 'neutral'` | `'neutral'` | Color theme |
| `trend` | `{ value: string, direction: 'up' \| 'down' \| 'neutral', label?: string }` | - | Trend indicator |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Internal padding |
| `href` | `string` | - | Navigation URL (for navigation variant) |
| `external` | `boolean` | `false` | Open link in new tab |
| `onClick` | `() => void` | - | Click handler |
| `clickable` | `boolean` | `false` | Show pointer cursor |
| `animate` | `boolean` | `true` | Enable entrance animation |
| `delay` | `number` | `0` | Animation delay in seconds |
| `nested` | `boolean` | `false` | Use nested card styling |
| `className` | `string` | - | Additional CSS classes |

## Color Themes

Each color theme provides:
- Gradient background for icon badge
- Border color
- Icon color
- Hover color

### Available Colors:
- **primary** - Magenta gradient (#D417C8)
- **secondary** - Cyan/Blue gradient (#14BDEA, #7767DA)
- **accent** - Purple gradient (#7767DA, #BD2CD0)
- **success** - Green gradient (#42E695, #3BB2B8)
- **warning** - Orange/Yellow gradient (#FFC107, #FF8A00)
- **danger** - Red (#FF4E50)
- **neutral** - Gray

## Layout Examples

### Dashboard Stats Grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
  <Card variant="stats" title="Revenue" value="$24,500" icon={DollarSign} color="success" 
    trend={{ value: "+12.5%", direction: "up", label: "from last month" }} />
  <Card variant="stats" title="Users" value="1,247" icon={Users} color="secondary" 
    trend={{ value: "+8.2%", direction: "up", label: "from last month" }} />
  <Card variant="stats" title="Success Rate" value="96.8%" icon={CheckCircle} color="accent" 
    trend={{ value: "+2.1%", direction: "up", label: "from last month" }} />
  <Card variant="stats" title="Avg Time" value="3.2 days" icon={Clock} color="primary" 
    trend={{ value: "-0.5 days", direction: "up", label: "from last month" }} />
</div>
```

### Parent Card with Nested Items
```tsx
<Card padding="lg">
  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D417C8]/20 to-[#BD2CD0]/20 flex items-center justify-center">
      <FileText className="w-5 h-5 text-[#D417C8]" />
    </div>
    <h2 className="text-xl font-bold text-white">Recent Invoices</h2>
  </div>
  
  <div className="grid gap-3">
    <Card variant="nested">
      {/* Invoice item content */}
    </Card>
    <Card variant="nested">
      {/* Invoice item content */}
    </Card>
  </div>
</Card>
```

### Navigation Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card variant="navigation" title="Dashboard" description="Overview and analytics" 
    icon={Home} color="primary" href="/dashboard" />
  <Card variant="navigation" title="Customers" description="Manage customers" 
    icon={Users} color="secondary" href="/customers" />
  <Card variant="navigation" title="Invoices" description="Track invoices" 
    icon={FileText} color="accent" href="/invoices" />
</div>
```

## Migration Guide

### Old Pattern (Custom Divs)
```tsx
<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
  <div className="flex items-center justify-between mb-4">
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#42E695]/20 to-[#3BB2B8]/20 flex items-center justify-center">
      <DollarSign className="w-6 h-6 text-[#42E695]" />
    </div>
    <div className="flex items-center gap-1 text-[#42E695] text-sm font-medium">
      <ArrowUpRight className="w-4 h-4" />
      +12.5%
    </div>
  </div>
  <h3 className="text-2xl font-bold text-white mb-1">$24,500</h3>
  <p className="text-sm text-white/60">Monthly Revenue</p>
  <p className="text-xs text-white/60 mt-2">from last month</p>
</div>
```

### New Pattern (Card Component)
```tsx
<Card
  variant="stats"
  title="Monthly Revenue"
  value="$24,500"
  icon={DollarSign}
  color="success"
  trend={{ value: "+12.5%", direction: "up", label: "from last month" }}
/>
```

## Benefits

✅ **Consistency** - Same design across entire platform
✅ **Less Code** - Reusable component vs custom divs
✅ **Maintainability** - Update one component to change everywhere
✅ **Type Safety** - Full TypeScript support with IntelliSense
✅ **Accessibility** - Built-in hover states and focus management
✅ **Performance** - Memoized component with optimized re-renders
✅ **Animations** - Optional entrance animations with Framer Motion
