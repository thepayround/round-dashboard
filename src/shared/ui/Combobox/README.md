# Combobox Component

Advanced dropdown component following **ui-ux-shadcn** standards with search, clear, loading states, and full accessibility support.

## Features

✅ **Search with Debounce** - Client-side or server-side search
✅ **Clear Button** - Optional clear functionality
✅ **Loading States** - Built-in loading spinner
✅ **Error Handling** - Display validation errors
✅ **Keyboard Navigation** - Arrow keys, Enter, Escape, Home, End
✅ **Full ARIA Support** - WCAG AA/AAA compliant
✅ **Portal Rendering** - No z-index issues
✅ **Icon Support** - Per-option icons
✅ **Description Support** - Secondary text for options
✅ **Disabled Options** - Support for disabled states
✅ **Custom Search Text** - Flexible search matching
✅ **Height: h-9 (36px)** - Matches shadcn Input standard

---

## Basic Usage

```tsx
import { Combobox } from '@/shared/ui/Combobox'

function MyForm() {
  const [country, setCountry] = useState<string>()

  const countries = [
    { value: 'US', label: 'United States' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
  ]

  return (
    <Combobox
      options={countries}
      value={country}
      onChange={setCountry}
      label="Country"
      placeholder="Select country..."
      clearable
      searchable
    />
  )
}
```

---

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `ComboboxOption<T>[]` | **required** | List of options |
| `value` | `T \| undefined` | `undefined` | Selected value |
| `onChange` | `(value: T \| undefined) => void` | **required** | Change handler |
| `onSearch` | `(searchTerm: string) => void \| Promise<void>` | `undefined` | Async search handler |
| `onClear` | `() => void` | `undefined` | Clear handler |
| `label` | `string` | `undefined` | Label text |
| `placeholder` | `string` | `'Select option...'` | Placeholder text |
| `error` | `string` | `undefined` | Error message |
| `disabled` | `boolean` | `false` | Disabled state |
| `required` | `boolean` | `false` | Required field indicator |
| `clearable` | `boolean` | `true` | Show clear button |
| `searchable` | `boolean` | `true` | Enable search |
| `isLoading` | `boolean` | `false` | Loading state |
| `searchDebounceMs` | `number` | `300` | Search debounce delay |
| `maxHeight` | `string` | `'300px'` | Max dropdown height |
| `className` | `string` | `undefined` | Additional classes |
| `id` | `string` | auto-generated | HTML id |

### ComboboxOption<T>

```typescript
interface ComboboxOption<T = string> {
  value: T                    // Unique identifier
  label: string              // Display text
  description?: string       // Secondary text
  icon?: React.ReactNode     // Option icon
  disabled?: boolean         // Disabled state
  searchText?: string        // Custom search text
}
```

---

## Examples

### 1. Simple Dropdown

```tsx
<Combobox
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ]}
  value={selected}
  onChange={setSelected}
  placeholder="Choose an option"
/>
```

### 2. With Icons and Descriptions

```tsx
import { Globe, Flag } from 'lucide-react'

const countries = [
  {
    value: 'US',
    label: 'United States',
    description: '+1',
    icon: <Flag className="w-4 h-4" />,
  },
  {
    value: 'GB',
    label: 'United Kingdom',
    description: '+44',
    icon: <Flag className="w-4 h-4" />,
  },
]

<Combobox
  options={countries}
  value={country}
  onChange={setCountry}
  label="Country"
  required
/>
```

### 3. With Validation Error

```tsx
<Combobox
  options={currencies}
  value={currency}
  onChange={setCurrency}
  label="Currency"
  error={errors.currency}
  required
/>
```

### 4. With API Data & Loading

```tsx
function CurrencySelect() {
  const [currency, setCurrency] = useState<string>()
  const { data: currencies, isLoading } = useQuery({
    queryKey: ['currencies'],
    queryFn: fetchCurrencies,
  })

  const options = currencies?.map(c => ({
    value: c.code,
    label: `${c.code} - ${c.name}`,
    description: c.symbol,
  })) || []

  return (
    <Combobox
      options={options}
      value={currency}
      onChange={setCurrency}
      label="Currency"
      placeholder="Select currency..."
      isLoading={isLoading}
      clearable
      searchable
    />
  )
}
```

### 5. Server-Side Search

```tsx
function UserSearch() {
  const [userId, setUserId] = useState<string>()
  const [users, setUsers] = useState<User[]>([])

  const handleSearch = async (searchTerm: string) => {
    const results = await searchUsers(searchTerm)
    setUsers(results)
  }

  const options = users.map(u => ({
    value: u.id,
    label: u.name,
    description: u.email,
    icon: <Avatar src={u.avatar} />,
  }))

  return (
    <Combobox
      options={options}
      value={userId}
      onChange={setUserId}
      onSearch={handleSearch}
      label="Assign to"
      placeholder="Search users..."
      searchable
    />
  )
}
```

### 6. Disabled Options

```tsx
<Combobox
  options={[
    { value: '1', label: 'Available Option' },
    { value: '2', label: 'Disabled Option', disabled: true },
    { value: '3', label: 'Another Available' },
  ]}
  value={selected}
  onChange={setSelected}
/>
```

### 7. Custom Search Text

```tsx
const countries = [
  {
    value: 'US',
    label: 'United States',
    searchText: 'United States US USA America',
  },
  {
    value: 'GB',
    label: 'United Kingdom',
    searchText: 'United Kingdom GB UK Britain England',
  },
]

<Combobox
  options={countries}
  value={country}
  onChange={setCountry}
  searchable
/>
```

---

## Form Integration

### React Hook Form

```tsx
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  country: z.string().min(1, 'Country is required'),
})

function MyForm() {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="country"
        control={control}
        render={({ field, fieldState }) => (
          <Combobox
            options={countries}
            value={field.value}
            onChange={field.onChange}
            label="Country"
            error={fieldState.error?.message}
            required
          />
        )}
      />
    </form>
  )
}
```

---

## Accessibility

### ARIA Attributes

- `role="combobox"` on trigger
- `aria-expanded` indicates open/closed state
- `aria-controls` links to listbox
- `aria-haspopup="listbox"` indicates dropdown
- `aria-invalid` for error states
- `aria-describedby` links to error message
- `aria-disabled` for disabled state
- `role="listbox"` on dropdown
- `role="option"` on each option
- `aria-selected` on selected option

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Open/close dropdown |
| `Arrow Down` | Move to next option |
| `Arrow Up` | Move to previous option |
| `Home` | Move to first option |
| `End` | Move to last option |
| `Escape` | Close dropdown |
| `Tab` | Close dropdown and move focus |

### Screen Reader Support

- Announces selected value
- Announces search results count
- Announces error messages with `role="alert"`
- Proper labeling for all interactive elements

---

## Styling

### Customization

```tsx
<Combobox
  className="w-full max-w-md"
  options={options}
  value={value}
  onChange={setValue}
/>
```

### Height Standard

The component follows shadcn's `h-9` (36px) height standard to match other form inputs:

```tsx
// Trigger button
className="h-9"  // 36px

// For mobile accessibility (WCAG AAA)
className="h-11 lg:h-9"  // 44px mobile, 36px desktop
```

---

## Performance

### Debounced Search

Search is debounced by default (300ms). Customize:

```tsx
<Combobox
  searchDebounceMs={500}  // 500ms delay
  onSearch={handleSearch}
  ...
/>
```

### Large Lists

For lists with 100+ items, use virtualization or server-side filtering:

```tsx
<Combobox
  onSearch={async (searchTerm) => {
    // Only fetch matching results from server
    const results = await api.search(searchTerm)
    setOptions(results)
  }}
  ...
/>
```

---

## Comparison with Old ApiDropdown

| Feature | ApiDropdown | Combobox |
|---------|-------------|----------|
| Search | ✅ Built-in | ✅ Built-in |
| Clear Button | ✅ | ✅ |
| Loading States | ✅ | ✅ |
| Error Handling | ✅ | ✅ |
| API Integration | ✅ Coupled | ✅ Composable |
| Icons | ✅ | ✅ |
| Descriptions | ✅ | ✅ |
| Portal Rendering | ✅ | ✅ |
| Accessibility | ✅ | ✅ Enhanced |
| Auto-retry | ✅ | ❌ Use React Query |
| Config-based | ✅ | ❌ Prop-based |
| Height | `h-10` (40px) | `h-9` (36px) ✅ |
| Type Safety | Partial | Full Generic ✅ |
| Bundle Size | Large | Small ✅ |

### Migration Guide

**OLD (ApiDropdown):**
```tsx
<ApiDropdown
  config={countryDropdownConfig}
  value={country}
  onSelect={setCountry}
  allowClear
/>
```

**NEW (Combobox):**
```tsx
const { data: countries, isLoading } = useCountries()

<Combobox
  options={countries?.map(c => ({
    value: c.code,
    label: c.name,
    description: `+${c.phoneCode}`,
  })) || []}
  value={country}
  onChange={setCountry}
  isLoading={isLoading}
  clearable
/>
```

---

## Best Practices

### ✅ DO

- Use `React Query` or `SWR` for API data fetching
- Keep options array in a `useMemo` hook
- Use TypeScript generics for type-safe values
- Provide clear labels and placeholders
- Show loading states during async operations
- Display validation errors inline
- Use server-side search for large datasets

### ❌ DON'T

- Don't fetch data inside the component
- Don't mutate the options array
- Don't use without labels (accessibility)
- Don't render 1000+ options without virtualization
- Don't forget error states
- Don't disable without explanation

---

## Related Components

- **PhoneInput** - International phone number input with country selection
- **SimpleSelect** - Simple dropdown for fixed options (use instead of shadcn Select)
- **Command** - Command palette-style search

---

## License

Part of the Round Dashboard component library.
