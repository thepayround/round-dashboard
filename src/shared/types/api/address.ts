/**
 * Address API types
 */

export interface AddressRequest {
  addressId?: string
  name: string
  addressLine1: string
  addressLine2?: string
  number: string
  city: string
  state?: string
  country: string
  zipCode: string
  addressType: 'billing' | 'shipping' | 'business'
  isPrimary: boolean
}

export interface AddressResponse {
  addressId: string
  name: string
  addressLine1: string
  addressLine2?: string
  number: string
  city: string
  state?: string
  country: string
  zipCode: string
  addressType: 'billing' | 'shipping' | 'business'
  isPrimary: boolean
  createdDate: string
  modifiedDate: string
}

export interface CreateAddressData {
  name: string
  addressLine1: string
  addressLine2?: string
  number: string
  city: string
  state?: string
  country: string
  zipCode: string
  addressType: 'billing' | 'shipping' | 'business'
  isPrimary: boolean
}

export interface UpdateAddressData {
  name?: string
  addressLine1?: string
  addressLine2?: string
  number?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
  addressType?: string
  isPrimary?: boolean
}
