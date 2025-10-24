// Customer type enums - Use string values to match backend validation
export enum CustomerType {
  Individual = 'Individual',
  Business = 'Business'
}

// Customer status enum - Use string values to match backend validation
export enum CustomerStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Suspended = 'Suspended',
  Cancelled = 'Cancelled'
}

// Mapping utilities for backward compatibility with numeric values
export const CustomerTypeNumericMap = {
  1: CustomerType.Individual,
  2: CustomerType.Business
} as const;

export const CustomerTypeToNumeric = {
  [CustomerType.Individual]: 1,
  [CustomerType.Business]: 2
} as const;

export const CustomerStatusNumericMap = {
  1: CustomerStatus.Active,
  2: CustomerStatus.Inactive,
  3: CustomerStatus.Suspended,
  4: CustomerStatus.Cancelled
} as const;

export const CustomerStatusToNumeric = {
  [CustomerStatus.Active]: 1,
  [CustomerStatus.Inactive]: 2,
  [CustomerStatus.Suspended]: 3,
  [CustomerStatus.Cancelled]: 4
} as const;

// Deprecated: Use CustomerStatus enum instead
export const statusToString = (status: CustomerStatus): string => status.toLowerCase()

// Deprecated: Use CustomerStatus enum values directly
export const stringToStatus = (status: string): CustomerStatus => {
  switch (status.toLowerCase()) {
    case 'active':
      return CustomerStatus.Active
    case 'inactive':
      return CustomerStatus.Inactive
    case 'suspended':
      return CustomerStatus.Suspended
    case 'cancelled':
      return CustomerStatus.Cancelled
    default:
      return CustomerStatus.Active
  }
}

export interface CustomerAddressResponse {
  id: string
  type: string
  isPrimary: boolean
  name?: string
  line1: string
  line2?: string
  city: string
  state?: string
  country: string
  zipCode: string
}

export interface CustomerNoteResponse {
  id: string
  content: string
  author: string
  isInternal: boolean
  createdDate: string
}

// Update CustomerResponse interface
export interface CustomerResponse {
  id: string
  type: CustomerType
  effectiveDisplayName: string
  isBusinessCustomer: boolean
  email: string
  firstName: string
  lastName: string
  displayName: string
  company?: string
  phoneNumber?: string
  phoneNumberConfirmed?: boolean
  taxNumber?: string
  locale?: string
  timezone?: string
  currency: string
  status: CustomerStatus // Changed from string to enum
  signupDate: string
  lastActivityDate?: string
  portalAccess: boolean
  autoCollection: boolean
  tags: string[]
  customFields: Record<string, string>
  createdDate: string
  modifiedDate: string
  billingAddress?: CustomerAddressResponse
  shippingAddress?: CustomerAddressResponse
  allAddresses: CustomerAddressResponse[]
  notes: CustomerNoteResponse[]
}