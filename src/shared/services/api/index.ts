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

// Re-export service classes for testing/mocking
export { AuthService } from './auth.service'
export { OrganizationService } from './organization.service'
export { AddressService } from './address.service'
