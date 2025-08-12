/**
 * Country Currency API types
 */

export interface CountryCurrencyResponse {
  countryName: string
  countryCodeAlpha2: string
  countryCodeNumeric: string
  currencyName: string
  currencyCodeAlpha: string
  currencyCodeNumeric: string
  decimalPrecision: number
  currencySymbol: string
  unicodeDecimal?: number[]
  unicodeHex?: string[]
}

export interface CurrencyResponse {
  currencyName: string
  currencyCodeAlpha: string
  currencyCodeNumeric: string
  decimalPrecision: number
  currencySymbol: string
  unicodeDecimal?: number[]
  unicodeHex?: string[]
  countries: Array<{
    countryName: string
    countryCodeAlpha2: string
  }>
}

export interface CountryResponse {
  countryName: string
  countryCodeAlpha2: string
  countryCodeNumeric: string
  currencyName: string
  currencyCodeAlpha: string
  currencyCodeNumeric: string
  decimalPrecision: number
  currencySymbol: string
  unicodeDecimal?: number[]
  unicodeHex?: string[]
}

export interface TimeZone {
  value: string
  label: string
}

export interface Month {
  value: string
  label: string
}

export interface Role {
  value: string
  label: string
  description: string
}