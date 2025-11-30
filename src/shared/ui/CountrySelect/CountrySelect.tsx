import { useCountries } from '@/shared/hooks/api/useCountryCurrency'
import { Combobox } from '@/shared/ui/Combobox'
import type { ComboboxOption } from '@/shared/ui/Combobox/types'

export interface CountrySelectProps {
  /** Selected country code (ISO Alpha-2) */
  value?: string
  /** Change handler */
  onChange: (countryCode: string | undefined) => void
  /** Label text (optional - if not provided, no label will be shown) */
  label?: string
  /** Placeholder text */
  placeholder?: string
  /** Error message */
  error?: string
  /** Disabled state */
  disabled?: boolean
  /** Required field indicator */
  required?: boolean
  /** Show clear button */
  clearable?: boolean
  /** Enable search */
  searchable?: boolean
  /** Additional class names */
  className?: string
  /** HTML id */
  id?: string
}

export const CountrySelect = ({
  value,
  onChange,
  label,
  placeholder = 'Select country',
  error,
  disabled = false,
  required = false,
  clearable = true,
  searchable = true,
  className,
  id,
}: CountrySelectProps) => {
  const { data: countries, isLoading } = useCountries()

  // Transform countries to ComboboxOption format
  const options: ComboboxOption<string>[] = countries.map(country => ({
    value: country.countryCodeAlpha2,
    label: country.countryName,
  }))

  return (
    <Combobox
      id={id}
      options={options}
      value={value}
      onChange={onChange}
      label={label}
      placeholder={placeholder}
      error={error}
      disabled={disabled || isLoading}
      required={required}
      clearable={clearable}
      searchable={searchable}
      isLoading={isLoading}
      className={className}
    />
  )
}
