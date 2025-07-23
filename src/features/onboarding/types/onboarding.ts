export interface UserInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface OrganizationInfo {
  companyName: string
  industry: string
  companySize: string
  website: string
  description?: string
  timeZone?: string
  revenue?: string
}

export interface BusinessSettings {
  currency: string
  timezone: string
  fiscalYearStart: string
}

export interface ProductInfo {
  hasProducts: boolean
  products: Array<{
    id: string
    name: string
    description: string
    price: number
  }>
}

export interface BillingSettings {
  isConnected: boolean
  provider: string
}

export interface AddressInfo {
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  addressType: 'billing' | 'shipping' | 'business'
}

export interface TeamSettings {
  invitations: Array<{
    id: string
    email: string
    role: string
    status: 'pending' | 'sent' | 'accepted'
  }>
}

export interface OnboardingData {
  userInfo: UserInfo
  organization: OrganizationInfo
  businessSettings: BusinessSettings
  address: AddressInfo
  products: ProductInfo
  billing: BillingSettings
  team: TeamSettings
}

export type OnboardingStep =
  | 'userInfo'
  | 'organization'
  | 'businessSettings'
  | 'address'
  | 'products'
  | 'billing'
  | 'team'
