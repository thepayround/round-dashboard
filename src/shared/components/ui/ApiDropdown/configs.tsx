import { Globe, DollarSign, Clock, Calendar, Users, Building, User, MapPin } from 'lucide-react'
import { useCountries, useCurrencies } from '@/shared/hooks/api/useCountryCurrency'
import { useIndustries } from '@/shared/hooks/api/useIndustry'
import { useCompanySizes } from '@/shared/hooks/api/useCompanySize'
import { useAddressTypes } from '@/shared/hooks/api/useAddressType'
import { useOrganizationTypes } from '@/shared/hooks/api/useOrganizationType'
import type { ApiDropdownConfig } from './ApiDropdown'
import { useMemo } from 'react'
import type { CurrencyResponse } from '@/shared/types/api/countryCurrency'
import type { TimeZone, Month, Role } from '@/shared/types/api/countryCurrency'
import type { IndustryResponse } from '@/shared/types/api/industry'
import type { CompanySizeResponse } from '@/shared/types/api/companySize'
import type { AddressTypeResponse } from '@/shared/types/api/addressType'
import type { OrganizationTypeResponse } from '@/shared/types/api/organizationType'



// Legacy fallback currency symbols (now replaced by backend data)
// Only used as fallback if backend doesn't provide symbol
const _fallbackCurrencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  CHF: 'CHF',
  CNY: '¥',
  SEK: 'kr',
  NOK: 'kr',
  MXN: '$',
  INR: '₹',
  KRW: '₩',
  SGD: 'S$',
  HKD: 'HK$',
  NZD: 'NZ$',
  ZAR: 'R',
  BRL: 'R$',
  RUB: '₽',
  TRY: '₺',
}

// Country dropdown configuration
export const countryDropdownConfig: ApiDropdownConfig<Record<string, string>> = {
  useHook: useCountries as unknown as () => {
    data: Record<string, string>[]
    isLoading: boolean
    isError: boolean
    refetch: () => Promise<void>
  },
  mapToOptions: (countries) => {
    // Deduplicate countries by countryCodeAlpha2 (ISO country code)
    const uniqueCountries = countries.reduce((acc, country) => {
      const key = country.countryCodeAlpha2
      if (!acc.has(key)) {
        acc.set(key, country)
      }
      return acc
    }, new Map())

    // Sort countries alphabetically by name
    return Array.from(uniqueCountries.values())
      .sort((a, b) => a.countryName.localeCompare(b.countryName))
      .map(country => ({
        value: country.countryName,
        label: country.countryName,
        searchText: `${country.countryName} ${country.countryCodeAlpha2} ${country.currencyCodeAlpha}`,
        description: `${country.countryCodeAlpha2} • ${country.currencyCodeAlpha}`,
        icon: (
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#14BDEA]/20 to-[#7767DA]/20 border border-white/20 flex items-center justify-center">
            <span className="text-xs font-semibold text-white/80">
              {country.countryCodeAlpha2}
            </span>
          </div>
        ),
      }))
  },
  icon: <Globe size={20} />,
  placeholder: 'Select country',
  searchPlaceholder: 'Search countries...',
  noResultsText: 'No countries found',
  errorText: 'Failed to load countries',
}

// Currency dropdown configuration
export const currencyDropdownConfig: ApiDropdownConfig<CurrencyResponse> = {
  useHook: useCurrencies,
  mapToOptions: (currencies) =>
    // Sort currencies alphabetically by name (same as country dropdown)
    currencies
      .sort((a, b) => a.currencyName.localeCompare(b.currencyName))
      .map(currency => {
        // Use backend currency symbol first, then fallback to currency code only if no symbol
        const symbol = currency.currencySymbol || currency.currencyCodeAlpha
        
        return {
          value: currency.currencyCodeAlpha,
          label: currency.currencyName,
          searchText: `${currency.currencyName} ${currency.currencyCodeAlpha} ${symbol} ${currency.countries.map((c: { countryName: string }) => c.countryName).join(', ')}`,
          description: `${currency.currencyCodeAlpha} • Used in ${currency.countries.length} ${
            currency.countries.length === 1 ? 'country' : 'countries'
          }`,
          icon: (
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#D417C8]/20 to-[#14BDEA]/20 border border-white/20 flex items-center justify-center">
              <span className="text-xs font-semibold text-white/80">
                {symbol}
              </span>
            </div>
          ),
        }
      }),
  icon: <DollarSign size={20} />,
  placeholder: 'Select currency',
  searchPlaceholder: 'Search currencies...',
  noResultsText: 'No currencies found',
  errorText: 'Failed to load currencies',
}

// Organization Type dropdown configuration
export const organizationTypeDropdownConfig: ApiDropdownConfig<OrganizationTypeResponse> = {
  useHook: useOrganizationTypes,
  mapToOptions: (organizationTypes) =>
    // Sort organization types alphabetically by name
    organizationTypes
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(orgType => ({
        value: orgType.code,
        label: orgType.name,
        searchText: `${orgType.name} ${orgType.description}`,
        description: orgType.description,
        icon: (
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#32A1E4]/20 to-[#7767DA]/20 border border-white/20 flex items-center justify-center">
            <Building size={12} className="text-white/80" />
          </div>
        ),
      })),
  icon: <Building size={20} />,
  placeholder: 'Select organization type',
  searchPlaceholder: 'Search organization types...',
  noResultsText: 'No organization types found',
  errorText: 'Failed to load organization types',
}

// Static data hooks for non-API dropdowns
const useTimezones = () => {
  const data = useMemo(() => [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'America/New_York', label: 'Eastern Time (EST/EDT)' },
    { value: 'America/Chicago', label: 'Central Time (CST/CDT)' },
    { value: 'America/Denver', label: 'Mountain Time (MST/MDT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PST/PDT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
  ], [])

  return {
    data,
    isLoading: false,
    isError: false,
    refetch: () => {},
  }
}

const useFiscalYearMonths = () => {
  const data = useMemo(() => [
    { value: 'January', label: 'January' },
    { value: 'February', label: 'February' },
    { value: 'March', label: 'March' },
    { value: 'April', label: 'April' },
    { value: 'May', label: 'May' },
    { value: 'June', label: 'June' },
    { value: 'July', label: 'July' },
    { value: 'August', label: 'August' },
    { value: 'September', label: 'September' },
    { value: 'October', label: 'October' },
    { value: 'November', label: 'November' },
    { value: 'December', label: 'December' },
  ], [])

  return {
    data,
    isLoading: false,
    isError: false,
    refetch: () => {},
  }
}

// Timezone dropdown configuration
export const timezoneDropdownConfig: ApiDropdownConfig<TimeZone> = {
  useHook: useTimezones,
  mapToOptions: (timezones) =>
    timezones.map(timezone => ({
      value: timezone.value,
      label: timezone.label,
      searchText: timezone.label,
      icon: (
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#7767DA]/20 to-[#14BDEA]/20 border border-white/20 flex items-center justify-center">
          <Clock className="w-3 h-3 text-white/80" />
        </div>
      ),
    })),
  icon: <Clock size={20} />,
  placeholder: 'Select timezone',
  searchPlaceholder: 'Search timezones...',
  noResultsText: 'No timezones found',
  errorText: 'Failed to load timezones',
}

// Fiscal year dropdown configuration
export const fiscalYearDropdownConfig: ApiDropdownConfig<Month> = {
  useHook: useFiscalYearMonths,
  mapToOptions: (months) =>
    months.map(month => ({
      value: month.value,
      label: month.label,
      searchText: month.label,
      icon: (
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#D417C8]/20 to-[#7767DA]/20 border border-white/20 flex items-center justify-center">
          <Calendar className="w-3 h-3 text-white/80" />
        </div>
      ),
    })),
  icon: <Calendar size={20} />,
  placeholder: 'Select fiscal year start month',
  searchPlaceholder: 'Search months...',
  noResultsText: 'No months found',
  errorText: 'Failed to load months',
}

// Team roles hook
const useTeamRoles = () => {
  const data = useMemo(() => [
    { value: 'member', label: 'Member', description: 'Basic access to team features' },
    { value: 'manager', label: 'Manager', description: 'Can manage team members and settings' },
    { value: 'admin', label: 'Admin', description: 'Full administrative access' },
  ], [])

  return {
    data,
    isLoading: false,
    isError: false,
    refetch: () => {},
  }
}

// Team role dropdown configuration
export const teamRoleDropdownConfig: ApiDropdownConfig<Role> = {
  useHook: useTeamRoles,
  mapToOptions: (roles) =>
    roles.map(role => {
      const getRoleColor = (roleValue: string) => {
        switch (roleValue) {
          case 'admin':
            return { bg: '#D417C8', text: '#D417C8' }
          case 'manager':
            return { bg: '#7767DA', text: '#7767DA' }
          case 'member':
            return { bg: '#14BDEA', text: '#14BDEA' }
          default:
            return { bg: '#6B7280', text: '#6B7280' }
        }
      }

      const colors = getRoleColor(role.value)
      
      return {
        value: role.value,
        label: role.label,
        searchText: `${role.label} ${role.description}`,
        description: role.description,
        icon: (
          <div 
            className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center"
            style={{ backgroundColor: `${colors.bg}20` }}
          >
            <Users className="w-3 h-3" style={{ color: colors.text }} />
          </div>
        ),
      }
    }),
  icon: <Users size={20} />,
  placeholder: 'Select role',
  searchPlaceholder: 'Search roles...',
  noResultsText: 'No roles found',
  errorText: 'Failed to load roles',
}

// Industry dropdown configuration
export const industryDropdownConfig: ApiDropdownConfig<IndustryResponse> = {
  useHook: useIndustries,
  mapToOptions: (industries) =>
    industries.map(industry => ({
      value: industry.code,
      label: industry.name,
      searchText: `${industry.name} ${industry.code} ${industry.description}`,
      description: industry.description,
      icon: (
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#7767DA]/20 to-[#D417C8]/20 border border-white/20 flex items-center justify-center">
          <Building className="w-3 h-3 text-white/80" />
        </div>
      ),
    })),
  icon: <Building size={20} />,
  placeholder: 'Select industry',
  searchPlaceholder: 'Search industries...',
  noResultsText: 'No industries found',
  errorText: 'Failed to load industries',
}

// Company size dropdown configuration
export const companySizeDropdownConfig: ApiDropdownConfig<CompanySizeResponse> = {
  useHook: useCompanySizes,
  mapToOptions: (companySizes) =>
    companySizes.map(size => {
      const getEmployeeCount = () => {
        if (size.maxEmployees === null) {
          return `${size.minEmployees}+ employees`
        }
        if (size.minEmployees === size.maxEmployees) {
          return size.minEmployees === 1 ? '1 employee' : `${size.minEmployees} employees`
        }
        return `${size.minEmployees}-${size.maxEmployees} employees`
      }

      return {
        value: size.code,
        label: size.name,
        searchText: `${size.name} ${size.code} ${size.description} ${getEmployeeCount()}`,
        description: size.description,
        icon: (
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#14BDEA]/20 to-[#7767DA]/20 border border-white/20 flex items-center justify-center">
            <User className="w-3 h-3 text-white/80" />
          </div>
        ),
      }
    }),
  icon: <User size={20} />,
  placeholder: 'Select company size',
  searchPlaceholder: 'Search company sizes...',
  noResultsText: 'No company sizes found',
  errorText: 'Failed to load company sizes',
}

// Address type dropdown configuration
export const addressTypeDropdownConfig: ApiDropdownConfig<AddressTypeResponse> = {
  useHook: useAddressTypes,
  mapToOptions: (addressTypes) =>
    addressTypes
      .filter(type => type.isActive)
      .map(type => ({
        value: type.code,
        label: type.name,
        searchText: `${type.name} ${type.code} ${type.description}`,
        description: type.description,
        icon: (
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#32A1E4]/20 to-[#7767DA]/20 border border-white/20 flex items-center justify-center">
            <MapPin className="w-3 h-3 text-white/80" />
          </div>
        ),
      })),
  icon: <MapPin size={20} />,
  placeholder: 'Select address type',
  searchPlaceholder: 'Search address types...',
  noResultsText: 'No address types found',
  errorText: 'Failed to load address types',
}