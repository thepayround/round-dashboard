export { AuthProvider } from './AuthContext'
export { useAuth } from '../hooks/useAuth'
export { ToastProvider, useGlobalToast } from './ToastContext'

// Reference Data Context - Centralized static/reference data management
export {
  ReferenceDataProvider,
  useReferenceData,
  useAllReferenceData,
  useCountries,
  useCurrencies,
  useOrganizationTypes,
  useIndustries,
  useCompanySizes,
  useAddressTypes,
  useTeamRoles as useReferenceTeamRoles,
  useTimezones as useReferenceTimezones,
  useLanguages,
  useDateFormats,
  useTimeFormats,
} from './ReferenceDataContext'

export type {
  ReferenceData,
  ReferenceDataType,
  RoleOption,
  TimezoneOption,
  LanguageOption,
  DateFormatOption,
  TimeFormatOption,
} from './ReferenceDataContext'