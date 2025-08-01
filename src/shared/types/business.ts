/**
 * Business-related type definitions for B2B authentication and billing
 */

export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY'

export type BusinessType =
  | 'corporation'
  | 'llc'
  | 'partnership'
  | 'sole_proprietorship'
  | 'nonprofit'

export type Industry =
  | 'technology'
  | 'healthcare'
  | 'finance'
  | 'education'
  | 'retail'
  | 'manufacturing'
  | 'consulting'
  | 'media'
  | 'real_estate'
  | 'other'

export interface CompanyInfo {
  companyName: string
  registrationNumber: string
  taxId?: string
  currency: Currency | undefined
  industry?: Industry
  businessType: BusinessType
  website?: string
  employeeCount?: number
  description?: string
}

export interface BillingAddress {
  street: string
  street2?: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface B2BRegistrationData {
  // Personal details
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  // Company details
  companyInfo: CompanyInfo
  billingAddress?: BillingAddress
}

export interface CompanyValidationResult {
  isValid: boolean
  errors: string[]
  suggestions?: string[]
}

export interface CountryInfo {
  code: string
  name: string
  currency: Currency
  taxIdFormat?: string
  registrationNumberFormat?: string
}

export const SUPPORTED_COUNTRIES: CountryInfo[] = [
  {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    taxIdFormat: 'XX-XXXXXXX',
    registrationNumberFormat: 'State-specific',
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    currency: 'GBP',
    taxIdFormat: 'GB XXX XXXX XX',
    registrationNumberFormat: 'XXXXXXXX',
  },
  {
    code: 'CA',
    name: 'Canada',
    currency: 'CAD',
    taxIdFormat: 'XXXXXXXXX',
    registrationNumberFormat: 'XXXXXXXXX',
  },
  {
    code: 'DE',
    name: 'Germany',
    currency: 'EUR',
    taxIdFormat: 'DE XXXXXXXXX',
    registrationNumberFormat: 'HRB XXXXX',
  },
  {
    code: 'FR',
    name: 'France',
    currency: 'EUR',
    taxIdFormat: 'FR XX XXXXXXXXX',
    registrationNumberFormat: 'XXX XXX XXX',
  },
  {
    code: 'AU',
    name: 'Australia',
    currency: 'AUD',
    taxIdFormat: 'XX XXX XXX XXX',
    registrationNumberFormat: 'XXX XXX XXX',
  },
]

export const INDUSTRY_OPTIONS: { value: Industry; label: string }[] = [
  { value: 'technology', label: 'Technology & Software' },
  { value: 'healthcare', label: 'Healthcare & Medical' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'education', label: 'Education & Training' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'manufacturing', label: 'Manufacturing & Industrial' },
  { value: 'consulting', label: 'Consulting & Services' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'real_estate', label: 'Real Estate & Property' },
  { value: 'other', label: 'Other' },
]

export const BUSINESS_TYPE_OPTIONS: { value: BusinessType; label: string; description: string }[] =
  [
    {
      value: 'corporation',
      label: 'Corporation',
      description: 'A legal entity separate from its owners',
    },
    {
      value: 'llc',
      label: 'Limited Liability Company (LLC)',
      description: 'Flexible business structure with liability protection',
    },
    {
      value: 'partnership',
      label: 'Partnership',
      description: 'Business owned by two or more people',
    },
    {
      value: 'sole_proprietorship',
      label: 'Sole Proprietorship',
      description: 'Business owned and operated by one person',
    },
    {
      value: 'nonprofit',
      label: 'Nonprofit Organization',
      description: 'Organization focused on social or charitable purposes',
    },
  ]

export const EMPLOYEE_COUNT_OPTIONS = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' },
]
