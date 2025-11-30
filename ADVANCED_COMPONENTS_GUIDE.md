# Advanced Components Implementation Guide

Complete guide for using the new **Combobox** and existing **PhoneInput** components following **ui-ux-shadcn** standards.

---

## 📦 What's Included

### 1. **Combobox Component** (NEW)
Advanced dropdown with all ApiDropdown features + shadcn standards
- ✅ Search with debounce
- ✅ Clear button
- ✅ Loading states
- ✅ Error handling
- ✅ Portal rendering
- ✅ Full accessibility
- ✅ Icons & descriptions
- ✅ Keyboard navigation
- ✅ TypeScript generics
- ✅ Height: `h-9` (36px) - matches shadcn

**Location:** `src/shared/ui/Combobox/`

### 2. **PhoneInput Component** (EXISTING)
International phone number input (already follows standards)
- ✅ Country selection dropdown
- ✅ Phone validation
- ✅ Search countries
- ✅ Full accessibility
- ✅ Portal rendering
- ✅ Height: `h-10` (40px) - responsive

**Location:** `src/shared/ui/PhoneInput/`

---

## 🎯 Design Principles

### Composition Over Configuration

**❌ OLD (ApiDropdown - Configuration):**
```tsx
<ApiDropdown config={countryDropdownConfig} value={value} onSelect={setValue} />
```

**✅ NEW (Combobox - Composition):**
```tsx
// Separate data fetching
const { data: countries, isLoading } = useCountries()

// Separate UI
<Combobox
  options={countries?.map(toOption) || []}
  value={value}
  onChange={setValue}
  isLoading={isLoading}
/>
```

**Benefits:**
- Testable (hooks and UI separate)
- Reusable (hooks can be used anywhere)
- Flexible (easy to customize)
- Maintainable (clear separation of concerns)

---

## 🚀 Quick Start

### Install Dependencies (if needed)

```bash
npm install lucide-react react-dom
```

### Import Components

```tsx
import { Combobox } from '@/shared/ui/Combobox'
import { PhoneInput } from '@/shared/ui/PhoneInput'
```

---

## 📖 Usage Examples

### Example 1: Simple Country Selector

```tsx
import { useState } from 'react'
import { Combobox } from '@/shared/ui/Combobox'
import { Globe } from 'lucide-react'

function CountrySelector() {
  const [country, setCountry] = useState<string>()

  const countries = [
    {
      value: 'US',
      label: 'United States',
      description: '+1',
      icon: <Globe className="w-4 h-4" />,
    },
    {
      value: 'GB',
      label: 'United Kingdom',
      description: '+44',
      icon: <Globe className="w-4 h-4" />,
    },
    {
      value: 'CA',
      label: 'Canada',
      description: '+1',
      icon: <Globe className="w-4 h-4" />,
    },
  ]

  return (
    <Combobox
      options={countries}
      value={country}
      onChange={setCountry}
      label="Country"
      placeholder="Select your country..."
      required
      clearable
      searchable
    />
  )
}
```

---

### Example 2: With API Data (React Query)

```tsx
import { useQuery } from '@tanstack/react-query'
import { Combobox } from '@/shared/ui/Combobox'

interface Currency {
  code: string
  name: string
  symbol: string
}

function CurrencySelector() {
  const [currency, setCurrency] = useState<string>()

  // Fetch data with React Query
  const { data: currencies, isLoading, isError } = useQuery({
    queryKey: ['currencies'],
    queryFn: async () => {
      const res = await fetch('/api/currencies')
      return res.json() as Promise<Currency[]>
    },
  })

  // Transform to options
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
      error={isError ? 'Failed to load currencies' : undefined}
      required
      clearable
      searchable
    />
  )
}
```

---

### Example 3: Server-Side Search

```tsx
import { useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { Combobox } from '@/shared/ui/Combobox'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

function UserSearch() {
  const [userId, setUserId] = useState<string>()
  const [users, setUsers] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm) {
      setUsers([])
      return
    }

    setIsSearching(true)
    try {
      const res = await fetch(`/api/users/search?q=${searchTerm}`)
      const data = await res.json()
      setUsers(data)
    } finally {
      setIsSearching(false)
    }
  }

  const options = users.map(u => ({
    value: u.id,
    label: u.name,
    description: u.email,
    icon: u.avatar ? (
      <img src={u.avatar} alt="" className="w-4 h-4 rounded-full" />
    ) : undefined,
  }))

  return (
    <Combobox
      options={options}
      value={userId}
      onChange={setUserId}
      onSearch={handleSearch}
      label="Assign to User"
      placeholder="Search users..."
      isLoading={isSearching}
      searchable
      clearable
    />
  )
}
```

---

### Example 4: Form Integration (React Hook Form)

```tsx
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Combobox } from '@/shared/ui/Combobox'
import { PhoneInput } from '@/shared/ui/PhoneInput'
import { Button } from '@/shared/ui/shadcn/button'

const schema = z.object({
  country: z.string().min(1, 'Country is required'),
  phone: z.string().min(1, 'Phone number is required'),
  currency: z.string().optional(),
})

type FormData = z.infer<typeof schema>

function RegistrationForm() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      country: '',
      phone: '',
      currency: '',
    },
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Country Selector */}
      <Controller
        name="country"
        control={control}
        render={({ field, fieldState }) => (
          <Combobox
            options={countryOptions}
            value={field.value}
            onChange={field.onChange}
            label="Country"
            error={fieldState.error?.message}
            required
            clearable
            searchable
          />
        )}
      />

      {/* Phone Input */}
      <Controller
        name="phone"
        control={control}
        render={({ field, fieldState }) => (
          <PhoneInput
            value={field.value}
            onChange={field.onChange}
            label="Phone Number"
            error={fieldState.error?.message}
            required
            defaultCountry="GR"
          />
        )}
      />

      {/* Currency Selector */}
      <Controller
        name="currency"
        control={control}
        render={({ field, fieldState }) => (
          <Combobox
            options={currencyOptions}
            value={field.value}
            onChange={field.onChange}
            label="Preferred Currency"
            error={fieldState.error?.message}
            clearable
            searchable
          />
        )}
      />

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  )
}
```

---

### Example 5: PhoneInput Usage

```tsx
import { PhoneInput } from '@/shared/ui/PhoneInput'
import { Label } from '@/shared/ui/shadcn/label'

function PhoneInputExample() {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string>()

  const handlePhoneChange = (value: string) => {
    setPhone(value)
    setError(undefined)
  }

  const handleValidation = (isValid: boolean, validationError?: string) => {
    if (!isValid) {
      setError(validationError)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="phone">
        Phone Number <span className="text-destructive">*</span>
      </Label>
      <PhoneInput
        id="phone"
        value={phone}
        onChange={handlePhoneChange}
        onValidationChange={handleValidation}
        error={error}
        defaultCountry="GR"
        validateOnBlur
        showValidation={false}
        placeholder="Phone number"
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
```

---

## 🎨 Styling & Theming

### Height Standards

Both components follow consistent height standards:

```tsx
// Combobox
<Combobox className="h-9" />  // 36px (shadcn standard)

// PhoneInput
<PhoneInput className="h-10" />  // 40px (includes country selector)
```

### Responsive Touch Targets (WCAG AAA)

For mobile accessibility, use responsive heights:

```tsx
<Combobox className="h-11 lg:h-9" />  // 44px mobile, 36px desktop
<PhoneInput className="h-12 lg:h-10" />  // 48px mobile, 40px desktop
```

### Custom Styling

```tsx
<Combobox
  className="w-full max-w-md"  // Custom width
  maxHeight="400px"            // Custom dropdown height
  ...
/>
```

---

## ♿ Accessibility

### Keyboard Navigation

Both components support full keyboard navigation:

| Key | Action |
|-----|--------|
| `Tab` | Move focus |
| `Enter` / `Space` | Open/close dropdown |
| `Arrow Down` | Next option |
| `Arrow Up` | Previous option |
| `Home` | First option |
| `End` | Last option |
| `Escape` | Close dropdown |
| Type to search | Filter options |

### ARIA Support

- ✅ `role="combobox"` on trigger
- ✅ `aria-expanded` for open state
- ✅ `aria-controls` linking
- ✅ `aria-invalid` for errors
- ✅ `aria-describedby` for errors
- ✅ `aria-required` for required fields
- ✅ `role="alert"` for error messages

### Screen Reader Testing

Test with:
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

---

## 🔧 Advanced Patterns

### Pattern 1: Dependent Dropdowns

```tsx
function AddressForm() {
  const [country, setCountry] = useState<string>()
  const [state, setState] = useState<string>()

  // Fetch states based on selected country
  const { data: states } = useQuery({
    queryKey: ['states', country],
    queryFn: () => fetchStates(country),
    enabled: !!country,
  })

  return (
    <>
      <Combobox
        options={countryOptions}
        value={country}
        onChange={(value) => {
          setCountry(value)
          setState(undefined)  // Reset state when country changes
        }}
        label="Country"
      />

      <Combobox
        options={states?.map(toOption) || []}
        value={state}
        onChange={setState}
        label="State/Province"
        disabled={!country}  // Disabled until country selected
      />
    </>
  )
}
```

### Pattern 2: Multi-Step Form with Validation

```tsx
function MultiStepForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    country: '',
    phone: '',
    currency: '',
  })

  const isStep1Valid = formData.country && formData.phone
  const isStep2Valid = formData.currency

  return (
    <div>
      {step === 1 && (
        <>
          <Combobox
            value={formData.country}
            onChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
            label="Country"
            required
          />
          <PhoneInput
            value={formData.phone}
            onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
            label="Phone"
            required
          />
          <Button
            onClick={() => setStep(2)}
            disabled={!isStep1Valid}
          >
            Next
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <Combobox
            value={formData.currency}
            onChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
            label="Currency"
            required
          />
          <Button onClick={() => setStep(1)}>Back</Button>
          <Button
            onClick={() => console.log('Submit', formData)}
            disabled={!isStep2Valid}
          >
            Submit
          </Button>
        </>
      )}
    </div>
  )
}
```

### Pattern 3: Reusable Hooks

```tsx
// useCountrySelect.ts
export function useCountrySelect() {
  const { data: countries, isLoading } = useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
  })

  const options = countries?.map(c => ({
    value: c.code,
    label: c.name,
    description: `+${c.phoneCode}`,
    icon: <span className={`fi fi-${c.code.toLowerCase()}`} />,
    searchText: `${c.name} ${c.code}`,
  })) || []

  return { options, isLoading }
}

// Usage
function MyForm() {
  const [country, setCountry] = useState<string>()
  const { options, isLoading } = useCountrySelect()

  return (
    <Combobox
      options={options}
      value={country}
      onChange={setCountry}
      isLoading={isLoading}
      label="Country"
    />
  )
}
```

---

## 📊 Performance

### Optimization Tips

1. **Memoize Options**
```tsx
const options = useMemo(() =>
  data?.map(toOption) || [],
  [data]
)
```

2. **Debounce Search**
```tsx
<Combobox searchDebounceMs={500} />  // Increase for slower networks
```

3. **Virtual Scrolling** (for 1000+ items)
```tsx
// Use react-window or react-virtuoso
import { FixedSizeList } from 'react-window'
```

4. **Server-Side Filtering**
```tsx
<Combobox
  onSearch={async (term) => {
    const results = await api.search(term)
    setOptions(results)
  }}
/>
```

---

## 🧪 Testing

### Unit Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Combobox } from '@/shared/ui/Combobox'

describe('Combobox', () => {
  it('opens dropdown on click', () => {
    render(
      <Combobox
        options={[{ value: '1', label: 'Option 1' }]}
        value={undefined}
        onChange={() => {}}
      />
    )

    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)

    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('selects option', () => {
    const handleChange = jest.fn()
    render(
      <Combobox
        options={[{ value: '1', label: 'Option 1' }]}
        value={undefined}
        onChange={handleChange}
      />
    )

    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.click(screen.getByText('Option 1'))

    expect(handleChange).toHaveBeenCalledWith('1')
  })
})
```

---

## 🚨 Troubleshooting

### Issue: Dropdown not visible
**Solution:** Check z-index and portal rendering. Dropdown uses `z-50` and renders in `document.body`.

### Issue: Search not working
**Solution:** Ensure `searchable={true}` and options have `label` or `searchText` properties.

### Issue: Icons not showing
**Solution:** Make sure you're importing icons from `lucide-react` or using valid React nodes.

### Issue: TypeScript errors
**Solution:** Use TypeScript generics: `Combobox<string>` or `Combobox<number>`

### Issue: Height inconsistent
**Solution:** Both components follow height standards. Use `h-9` for Combobox, `h-10` for PhoneInput.

---

## 📚 Related Documentation

- [Combobox README](./src/shared/ui/Combobox/README.md)
- [PhoneInput Component](./src/shared/ui/PhoneInput/PhoneInput.tsx)
- [ApiDropdown Documentation](./APIDROPDOWN_COMPONENT_DOCUMENTATION.md) (old component reference)
- [UI/UX Standards](./CLAUDE.md)

---

## ✅ Best Practices Summary

### DO:
- ✅ Use React Query/SWR for API data
- ✅ Memoize options array
- ✅ Provide clear labels and placeholders
- ✅ Show loading states
- ✅ Display validation errors
- ✅ Use TypeScript generics
- ✅ Test keyboard navigation
- ✅ Test with screen readers

### DON'T:
- ❌ Fetch data inside components
- ❌ Mutate options array
- ❌ Skip labels (accessibility)
- ❌ Render 1000+ items without virtualization
- ❌ Ignore error states
- ❌ Disable without explanation

---

**Happy Coding!** 🎉

For questions or issues, refer to the component READMEs or check the implementation files.
