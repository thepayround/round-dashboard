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
  createdDate: string
  modifiedDate: string
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
}
