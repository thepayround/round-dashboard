import { useMemo } from 'react'

import { Combobox } from '../Combobox'
import type { ComboboxOption } from '../Combobox/types'
import { Input } from '../shadcn/input'
import { Label } from '../shadcn/label'

import type { Address } from './types'

export interface CountryOption {
  code: string
  name: string
}

export interface AddressFormGroupProps {
  label?: string
  value: Address
  onChange: (address: Address) => void
  errors?: Partial<Record<keyof Address, string>>
  required?: boolean
  disabled?: boolean
  countries?: CountryOption[]
}

export const AddressFormGroup = ({
  label,
  value,
  onChange,
  errors,
  required = false,
  disabled = false,
  countries = [],
}: AddressFormGroupProps) => {
  const handleFieldChange = (field: keyof Address, fieldValue: string) => {
    onChange({
      ...value,
      [field]: fieldValue,
    })
  }

  // Transform countries to ComboboxOption format
  const countryOptions: ComboboxOption<string>[] = useMemo(
    () => countries.map(c => ({ value: c.code, label: c.name })),
    [countries]
  )

  return (
    <div className="space-y-4">
      {label && <h4 className="text-sm font-medium text-foreground">{label}</h4>}

      <div className="space-y-1.5">
        <Label htmlFor="name">Address Name</Label>
        <Input
          id="name"
          value={value.name ?? ''}
          onChange={e => handleFieldChange('name', e.target.value)}
          disabled={disabled}
          placeholder="e.g., Home, Office, Warehouse"
        />
        {errors?.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="line1">
          Address Line 1{required && <span className="text-destructive"> *</span>}
        </Label>
        <Input
          id="line1"
          value={value.line1}
          onChange={e => handleFieldChange('line1', e.target.value)}
          disabled={disabled}
          placeholder="Street address"
        />
        {errors?.line1 && <p className="text-sm text-destructive">{errors.line1}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="line2">Address Line 2</Label>
        <Input
          id="line2"
          value={value.line2 ?? ''}
          onChange={e => handleFieldChange('line2', e.target.value)}
          disabled={disabled}
          placeholder="Apt, suite, unit, etc. (optional)"
        />
        {errors?.line2 && <p className="text-sm text-destructive">{errors.line2}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="city">
          City{required && <span className="text-destructive"> *</span>}
        </Label>
        <Input
          id="city"
          value={value.city}
          onChange={e => handleFieldChange('city', e.target.value)}
          disabled={disabled}
          placeholder="City"
        />
        {errors?.city && <p className="text-sm text-destructive">{errors.city}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="state">State / Province</Label>
        <Input
          id="state"
          value={value.state ?? ''}
          onChange={e => handleFieldChange('state', e.target.value)}
          disabled={disabled}
          placeholder="State or province"
        />
        {errors?.state && <p className="text-sm text-destructive">{errors.state}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="zipCode">
          ZIP / Postal Code{required && <span className="text-destructive"> *</span>}
        </Label>
        <Input
          id="zipCode"
          value={value.zipCode}
          onChange={e => handleFieldChange('zipCode', e.target.value)}
          disabled={disabled}
          placeholder="ZIP or postal code"
        />
        {errors?.zipCode && <p className="text-sm text-destructive">{errors.zipCode}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="country">
          Country{required && <span className="text-destructive"> *</span>}
        </Label>
        <Combobox
          id="country"
          options={countryOptions}
          value={value.country}
          onChange={country => handleFieldChange('country', country ?? '')}
          placeholder="Select country"
          disabled={disabled}
          error={errors?.country}
          searchable={true}
          clearable={true}
        />
      </div>
    </div>
  )
}
