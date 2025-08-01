# Reusable Glassmorphism Components

This document outlines the reusable UI components created for consistent glassmorphism design across the Round platform.

## Components Overview

### 1. Modal Component (`/shared/components/Modal`)

**Purpose**: Reusable modal dialog with consistent glassmorphism styling

**Features**:
- Enhanced backdrop with blur effects
- Gradient glow effects
- Customizable sizes (sm, md, lg, xl, full)
- Keyboard navigation (Escape key)
- Click-outside-to-close functionality
- Smooth animations with Framer Motion

**Usage**:
```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Modal Title"
  subtitle="Optional subtitle"
  size="lg"
>
  {/* Modal content */}
</Modal>
```

### 2. StatsCard Component (`/shared/components/StatsCard`)

**Purpose**: Display statistics with trending information and brand colors

**Features**:
- Multiple color variants (primary, secondary, accent, success, warning, danger)
- Trend indicators with direction (up, down, neutral)
- Hover animations
- Gradient backgrounds and icon containers
- Clickable variant support

**Usage**:
```tsx
<StatsCard
  title="Total Revenue"
  value="$124.5K"
  icon={DollarSign}
  trend={{
    value: '+18% from last month',
    direction: 'up'
  }}
  color="success"
/>
```

### 3. NavigationCard Component (`/shared/components/NavigationCard`)

**Purpose**: Navigation cards for linking to different sections

**Features**:
- Two variants: default (vertical) and compact (horizontal)
- Multiple color schemes matching brand colors
- Hover animations and effects
- Internal routing (React Router) and external link support
- Consistent icon styling

**Usage**:
```tsx
<NavigationCard
  title="Manage Plans"
  description="View and manage all pricing plans"
  icon={Package}
  href="/catalog/plans"
  color="secondary"
  variant="default"
/>
```

### 4. SectionHeader Component (`/shared/components/SectionHeader`)

**Purpose**: Consistent section headers with gradient accents

**Features**:
- Gradient accent lines with color variants
- Optional subtitle support
- Action buttons/elements support
- Animated entrance option
- Consistent typography scaling

**Usage**:
```tsx
<SectionHeader
  title="Product Catalog"
  subtitle="Manage your products and pricing"
  accent="primary"
  actions={<Button>Create Product</Button>}
  animated={true}
/>
```

### 5. FormInput Component (`/shared/components/FormInput`)

**Purpose**: Enhanced form inputs with glassmorphism styling

**Features**:
- Multiple input types (input, textarea, select)
- Icon support (left/right positioning)
- Error handling with animations
- Hint text support
- Consistent focus states and animations
- Accessibility features

**Usage**:
```tsx
<FormInput
  label="Product Name"
  name="name"
  value={value}
  onChange={onChange}
  placeholder="Enter product name"
  icon={Package}
  error={errorMessage}
  hint="This will be displayed to customers"
  required
/>
```

### 6. Button Component (`/shared/components/Button`)

**Purpose**: Enhanced button with variants and animations

**Features**:
- Multiple variants (primary, secondary, ghost, danger, success)
- Size variants (sm, md, lg, xl)
- Icon support with positioning
- Loading state with spinner
- Hover and tap animations
- Full width option

**Usage**:
```tsx
<Button
  variant="primary"
  size="md"
  icon={Save}
  loading={isLoading}
  onClick={handleClick}
>
  Save Changes
</Button>
```

### 7. ViewModeToggle Component (`/shared/components/ViewModeToggle`)

**Purpose**: Reusable view mode switcher for table/grid/list layouts

**Features**:

- Support for table, grid, and list view modes
- Clean AddonsPage-style implementation with `bg-black/20 rounded-lg` styling
- Size variants (sm, md, lg)
- Optional label display
- Consistent glassmorphism styling
- TypeScript support with ViewMode union type
- Used across all catalog pages (Plans, Charges, Coupons, Add-ons, Product Catalog)

**Usage**:

```tsx
<ViewModeToggle 
  value={viewMode}
  onChange={setViewMode}
  options={[
    { value: 'table', icon: Table, label: 'Table' },
    { value: 'grid', icon: Grid3X3, label: 'Grid' },
    { value: 'list', icon: List, label: 'List' }
  ]}
  showLabels={false}
  size="md"
/>
```

**Implementation Notes**:

- Replaced custom toggle implementations across catalog pages for consistency
- Integrated into CustomersPage with table/grid view support
- Maintains the clean, minimal design from the AddonsPage pattern
- Supports dynamic option arrays for flexible view mode combinations
- Used across: ProductCatalog, Plans, Charges, Coupons, Add-ons, and Customers pages

## Design System Integration

### Brand Colors

All components use the consistent brand color palette:

- **Primary**: `#D417C8` (Accent Pink)
- **Secondary**: `#14BDEA` (Cyan Blue)
- **Accent**: `#7767DA` (Purple)
- **Success**: `green-500`
- **Warning**: `yellow-500`
- **Danger**: `red-500`

### Glassmorphism Effects

- Semi-transparent backgrounds (`bg-gray-900/90`)
- Backdrop blur effects (`backdrop-blur-xl`)
- Border styling (`border border-white/20`)
- Gradient overlays for hover states
- Consistent shadow and glow effects

### Animation Patterns

- Framer Motion for smooth transitions
- Hover effects: scale(1.02) and translateY(-4px)
- Entrance animations with staggered delays
- Loading spinners and state transitions

## Usage Guidelines

### Consistency Rules

1. Always use the provided color variants instead of custom colors
2. Maintain consistent spacing and sizing patterns
3. Use the same animation timing and easing across components
4. Follow the established typography hierarchy
5. Use ViewModeToggle component for all view switching functionality instead of custom implementations

### Accessibility

- All components include proper ARIA attributes
- Keyboard navigation support
- Focus management for modals and interactive elements
- Screen reader compatibility
- Color contrast compliance

### Performance

- Components are optimized with React.memo where appropriate
- Lazy loading for heavy components
- Efficient re-render prevention
- Proper prop dependency management

## Testing Requirements

Each component includes:

- Unit tests for all variants and props
- Accessibility testing
- Animation and interaction testing
- Error state testing
- Mobile responsiveness testing

## Future Enhancements

Planned improvements:

- Dark/light theme switching
- Additional size variants
- More animation options
- Extended color palette
- Advanced form validation features
- Internationalization support

### 6. CreateButton Component (`/shared/components/CreateButton`)

**Purpose**: Universal button for all add/create/new actions across the platform

**Features**:
- Consistent Plus icon + label pattern
- Multiple size variants (sm, md, lg)
- Primary/secondary variants
- Motion animations (optional)
- Custom icon support
- Disabled state handling

**Usage**:
```tsx
<CreateButton
  label="Add Customer"
  onClick={() => handleCreate()}
  size="md"
  icon={Plus} // Optional - defaults to Plus
  variant="primary"
  animated={true}
/>
```

**Migration Pattern for CLAUDE.md**:
Replace instances of:
```tsx
<button className="btn-primary space-x-2" onClick={handleClick}>
  <Plus className="w-5 h-5" />
  <span>Create Something</span>
</button>
```

With:
```tsx
<CreateButton
  label="Create Something"
  onClick={handleClick}
  size="md"
/>
```

---

*These components provide a solid foundation for building consistent, beautiful, and accessible UI across the Round platform while maintaining the modern glassmorphism aesthetic.*
