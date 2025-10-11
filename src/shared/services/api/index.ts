/**
 * API services export barrel
 */

// Base client
export { httpClient } from './base/client'
export { API_CONFIG, ENDPOINTS } from './base/config'

// Services
export { authService } from './auth.service'
export { organizationService } from './organization.service'
export { addressService } from './address.service'
export { countryCurrencyService } from './countryCurrency.service'
export { teamService } from './team.service'
export { roundAccountService } from './roundAccount.service'
export { organizationTypeService } from './organizationType.service'
export { userSettingsService } from './userSettings.service'
export { customerService } from './customer.service'

// Re-export service classes for testing/mocking
export { AuthService } from './auth.service'
export { OrganizationService } from './organization.service'
export { AddressService } from './address.service'
export { CountryCurrencyService } from './countryCurrency.service'
export { TeamService } from './team.service'
export { CustomerService } from './customer.service'

// Re-export types
export type { 
  InviteUserRequest,
  RegisterWithInvitationRequest,
  ValidateInvitationResponse,
  InvitationResponse,
  UserRole
} from './team.service'
export { OrganizationTypeService } from './organizationType.service'
export { RoundAccountService } from './roundAccount.service'
export { UserSettingsService } from './userSettings.service'
