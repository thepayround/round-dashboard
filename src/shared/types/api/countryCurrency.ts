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
}

export interface CurrencyResponse {
  currencyName: string
  currencyCodeAlpha: string
  currencyCodeNumeric: string
  decimalPrecision: number
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
}