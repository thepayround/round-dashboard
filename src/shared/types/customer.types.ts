// Customer type enums
export enum CustomerType {
  Individual = 1,
  Business = 2
}

// Fix status type mapping between backend and frontend
export enum CustomerStatus {
  Active = 1,
  Inactive = 2,
  Suspended = 3,
  Cancelled = 4
}

export const statusToString = (status: CustomerStatus): string => {
  switch (status) {
    case CustomerStatus.Active:
      return 'active'
    case CustomerStatus.Inactive:
      return 'inactive'
    case CustomerStatus.Suspended:
      return 'suspended'
    case CustomerStatus.Cancelled:
      return 'cancelled'
    default:
      return 'unknown'
  }
}

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