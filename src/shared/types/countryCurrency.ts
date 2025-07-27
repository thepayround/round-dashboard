export interface CountryCurrencyResponse {
  countryName: string
  countryCodeAlpha2: string
  currencyCodeAlpha: string
  [key: string]: string | unknown
}

export interface CurrencyResponse {
  currencyName: string
  currencyCodeAlpha: string
  countries: CountryItem[]
  [key: string]: string | CountryItem[] | unknown
}

export interface CountryItem {
  countryName: string
  [key: string]: string | unknown
}

export interface TimeZone {
  value: string
  label: string
  [key: string]: string | unknown
}

export interface Month {
  value: string
  label: string
  [key: string]: string | unknown
}

export interface Role {
  value: string
  label: string
  description: string
  [key: string]: string | unknown
}
