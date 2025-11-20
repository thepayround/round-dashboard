import type { ApiDropdownConfig } from '../ApiDropdown'
import { ApiDropdown } from '../ApiDropdown'
import { FormInput } from '../FormInput'

import type { Address } from './types'

export interface AddressFormGroupProps {
  label?: string
  value: Address
  onChange: (address: Address) => void
  errors?: Partial<Record<keyof Address, string>>
  required?: boolean
  disabled?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  countryDropdownConfig: ApiDropdownConfig<any>
}

export const AddressFormGroup = ({
  label,
  value,
  onChange,
  errors,
  required = false,
  disabled = false,
  countryDropdownConfig,
}: AddressFormGroupProps) => {
  const handleFieldChange = (field: keyof Address, fieldValue: string) => {
    onChange({
      ...value,
      [field]: fieldValue,
    })
  }

  return (
    <div className="space-y-4">
      {label && (
        <h4 className="text-sm font-medium text-white">{label}</h4>
      )}

      {/* Address Lines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Address Line 1"
          value={value.line1}
          onChange={(e) => handleFieldChange('line1', e.target.value)}
          error={errors?.line1}
          required={required}
          disabled={disabled}
        />
        <FormInput
          label="Address Line 2"
          value={value.line2 ?? ''}
          onChange={(e) => handleFieldChange('line2', e.target.value)}
          error={errors?.line2}
          disabled={disabled}
          placeholder="Apt, suite, unit, etc. (optional)"
        />
      </div>

      {/* City, State, ZIP, Country */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FormInput
          label="City"
          value={value.city}
          onChange={(e) => handleFieldChange('city', e.target.value)}
          error={errors?.city}
          required={required}
          disabled={disabled}
        />
        <FormInput
          label="State / Province"
          value={value.state ?? ''}
          onChange={(e) => handleFieldChange('state', e.target.value)}
          error={errors?.state}
          disabled={disabled}
        />
        <FormInput
          label="ZIP / Postal Code"
          value={value.zipCode}
          onChange={(e) => handleFieldChange('zipCode', e.target.value)}
          error={errors?.zipCode}
          required={required}
          disabled={disabled}
        />
        <div>
          <div className="space-y-2">
            <span className="auth-label">Country{required && <span className="text-primary"> *</span>}</span>
            <ApiDropdown
              config={countryDropdownConfig}
              value={value.country}
              onSelect={(country) => handleFieldChange('country', country)}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
