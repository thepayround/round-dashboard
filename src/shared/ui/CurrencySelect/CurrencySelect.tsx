import { useCurrency } from '@/shared/hooks/useCurrency'
import { Combobox } from '@/shared/ui/Combobox'
import type { ComboboxOption } from '@/shared/ui/Combobox/types'

export interface CurrencySelectProps {
  /** Selected currency code */
  value?: string
  /** Change handler */
  onChange: (currencyCode: string | undefined) => void
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

export const CurrencySelect = ({
  value,
  onChange,
  label,
  placeholder = 'Select currency',
  error,
  disabled = false,
  required = false,
  clearable = true,
  searchable = true,
  className,
  id,
}: CurrencySelectProps) => {
  const { currencies, isLoading } = useCurrency()

  // Transform currencies to ComboboxOption format
  const options: ComboboxOption<string>[] = currencies.map(currency => ({
    value: currency.code,
    label: `${currency.code} - ${currency.name} (${currency.symbol})`,
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
