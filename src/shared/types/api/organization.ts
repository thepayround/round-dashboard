/**
 * Organization API types
 */

export interface OrganizationRequest {
  organizationId?: string
  name: string
  description?: string
  website?: string
  size?: string
  revenue?: number
  category: string
  type: string
  registrationNumber: string
  currency: string
  timeZone: string
  country: string
  userId: string
  addressId?: string
  fiscalYearStart?: string
}

export interface OrganizationResponse {
  organizationId: string
  name: string
  description?: string
  website?: string
  size?: string
  revenue?: number
  category: string
  type: string
  registrationNumber: string
  currency: string
  timeZone: string
  country: string
  userId: string
  addressId?: string
  fiscalYearStart?: string
  createdDate: string
  modifiedDate: string
  address?: {
    addressId: string
    name: string
    addressLine1: string
    addressLine2?: string
    number: string
    city: string
    state: string
    zipCode: string
    country: string
    addressType: 'billing' | 'shipping' | 'business'
  } | null
}

export interface CreateOrganizationData {
  name: string
  description?: string
  website?: string
  size?: string
  revenue?: number
  category: string
  type: string
  registrationNumber: string
  currency: string
  timeZone: string
  country: string
  fiscalYearStart?: string
  userId: string
}

export interface UpdateOrganizationData {
  name?: string
  description?: string
  website?: string
  size?: string
  revenue?: number
  category?: string
  type?: string
  registrationNumber?: string
  currency?: string
  timeZone?: string
  country?: string
  fiscalYearStart?: string
}
