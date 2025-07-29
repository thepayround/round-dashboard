import { Globe, DollarSign, Clock, Calendar, Users } from 'lucide-react'
import { useCountries, useCurrencies } from '@/shared/hooks/api/useCountryCurrency'
import type { ApiDropdownConfig } from './ApiDropdown'
import { useMemo } from 'react'
import type { CurrencyResponse } from '@/shared/types/api/countryCurrency'
import type { TimeZone, Month, Role } from '@/shared/types/countryCurrency'



// Currency symbol mapping
const currencySymbols: Record<string, string> = {
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
  icon: <Globe />,
  placeholder: 'Select country',
  searchPlaceholder: 'Search countries...',
  noResultsText: 'No countries found',
  errorText: 'Failed to load countries',
}

// Currency dropdown configuration
export const currencyDropdownConfig: ApiDropdownConfig<CurrencyResponse> = {
  useHook: useCurrencies,
  mapToOptions: (currencies) =>
    currencies.map(currency => {
      const symbol = currencySymbols[currency.currencyCodeAlpha] || currency.currencyCodeAlpha
      
      return {
        value: currency.currencyCodeAlpha,
        label: `${symbol} ${currency.currencyName}`,
        searchText: `${currency.currencyName} ${currency.currencyCodeAlpha} ${currency.countries.map((c: { countryName: string }) => c.countryName).join(', ')}`,
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
  icon: <DollarSign />,
  placeholder: 'Select currency',
  searchPlaceholder: 'Search currencies...',
  noResultsText: 'No currencies found',
  errorText: 'Failed to load currencies',
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
  icon: <Clock />,
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
  icon: <Calendar />,
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
  icon: <Users />,
  placeholder: 'Select role',
  searchPlaceholder: 'Search roles...',
  noResultsText: 'No roles found',
  errorText: 'Failed to load roles',
}