export interface Customer {
  id: string
  email: string
  firstName: string
  lastName: string
  displayName: string
  company?: string
  phone?: string
  taxNumber?: string
  locale?: string
  timezone?: string
  status: 'active' | 'inactive' | 'suspended' | 'cancelled'
  
  // Billing Information
  billingAddress: Address
  shippingAddress?: Address
  paymentMethod?: PaymentMethod
  currency: string
  
  // Subscription Information
  subscriptions: CustomerSubscription[]
  totalMRR: number
  totalLTV: number
  
  // Account Information
  accountBalance: number
  creditBalance: number
  unbilledCharges: number
  
  // Lifecycle
  signupDate: Date
  trialEndDate?: Date
  lastActivityDate?: Date
  churnRisk: 'low' | 'medium' | 'high'
  
  // Preferences
  emailPreferences: EmailPreferences
  portalAccess: boolean
  autoCollection: boolean
  
  // Metadata
  tags: string[]
  customFields: Record<string, unknown>
  notes: CustomerNote[]
  
  // Timestamps
  createdAt: Date
  updatedAt?: Date
}

export interface Address {
  line1: string
  line2?: string
  city: string
  state?: string
  country: string
  zip: string
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'bank_account' | 'paypal' | 'apple_pay' | 'google_pay'
  gateway: string
  status: 'valid' | 'expired' | 'invalid' | 'pending'
  
  // Card specific
  cardType?: 'visa' | 'mastercard' | 'amex' | 'discover'
  last4?: string
  expiryMonth?: number
  expiryYear?: number
  
  // Bank account specific
  bankName?: string
  accountType?: 'checking' | 'savings'
  routingNumber?: string
  
  isDefault: boolean
  createdAt: Date
}

export interface CustomerSubscription {
  id: string
  planId: string
  planName: string
  status: 'active' | 'trialing' | 'paused' | 'cancelled' | 'expired'
  currentTermStart: Date
  currentTermEnd: Date
  nextBillingDate?: Date
  mrr: number
  currency: string
  billingPeriod: 'monthly' | 'quarterly' | 'yearly'
  addons: SubscriptionAddon[]
  coupons: SubscriptionCoupon[]
  trialEnd?: Date
  pausedAt?: Date
  cancelledAt?: Date
  cancellationReason?: string
  createdAt: Date
}

export interface SubscriptionAddon {
  id: string
  addonId: string
  addonName: string
  quantity: number
  unitPrice: number
  amount: number
}

export interface SubscriptionCoupon {
  id: string
  couponId: string
  couponCode: string
  discountType: 'percentage' | 'fixed_amount'
  discountValue: number
  appliedAt: Date
  expiresAt?: Date
}

export interface EmailPreferences {
  invoices: boolean
  subscriptionUpdates: boolean
  marketingEmails: boolean
  paymentFailures: boolean
  trialReminders: boolean
}

export interface CustomerNote {
  id: string
  content: string
  author: string
  isInternal: boolean
  createdAt: Date
}

export interface CustomerUsage {
  customerId: string
  subscriptionId: string
  metricId: string
  metricName: string
  currentUsage: number
  allowedUsage: number
  overageAmount: number
  billingPeriodStart: Date
  billingPeriodEnd: Date
  lastUpdated: Date
}

export interface CustomerInvoice {
  id: string
  invoiceNumber: string
  status: 'draft' | 'open' | 'paid' | 'partially_paid' | 'voided' | 'overdue'
  amount: number
  amountPaid: number
  amountDue: number
  currency: string
  issueDate: Date
  dueDate: Date
  paidAt?: Date
  description?: string
  downloadUrl?: string
}

export interface CustomerPayment {
  id: string
  amount: number
  currency: string
  paymentMethod: string
  status: 'succeeded' | 'failed' | 'pending' | 'cancelled'
  invoiceId?: string
  failureReason?: string
  processedAt: Date
  gatewayTransactionId?: string
}

export interface CustomerCredit {
  id: string
  amount: number
  currency: string
  type: 'refund' | 'adjustment' | 'gift' | 'promotional'
  reason: string
  expiresAt?: Date
  appliedToInvoices: string[]
  createdAt: Date
}

// Customer Analytics
export interface CustomerMetrics {
  totalCustomers: number
  activeCustomers: number
  trialingCustomers: number
  churnedCustomers: number
  avgMRR: number
  avgLTV: number
  churnRate: number
  reactivationRate: number
  trialConversionRate: number
}

export interface CustomerSegment {
  id: string
  name: string
  description: string
  criteria: SegmentCriteria
  customerCount: number
  totalMRR: number
  createdAt: Date
}

export interface SegmentCriteria {
  plans?: string[]
  status?: string[]
  mrrRange?: { min?: number; max?: number }
  signupDateRange?: { start?: Date; end?: Date }
  country?: string[]
  hasFailedPayments?: boolean
  trialStatus?: string[]
  tags?: string[]
}

// Customer Actions
export type CustomerAction = 
  | 'view_profile'
  | 'edit_profile'
  | 'update_payment_method'
  | 'change_subscription'
  | 'pause_subscription'
  | 'cancel_subscription'
  | 'reactivate_subscription'
  | 'apply_coupon'
  | 'add_credit'
  | 'send_invoice'
  | 'record_payment'
  | 'add_note'
  | 'export_data'
  | 'delete_customer'

export interface CustomerFilters {
  status?: string[]
  plans?: string[]
  countries?: string[]
  mrrRange?: { min?: number; max?: number }
  signupDateRange?: { start?: Date; end?: Date }
  lastActivityRange?: { start?: Date; end?: Date }
  churnRisk?: string[]
  hasActiveSubscription?: boolean
  hasFailedPayments?: boolean
  tags?: string[]
  searchQuery?: string
}

export interface CustomerExport {
  format: 'csv' | 'xlsx' | 'json'
  filters: CustomerFilters
  fields: string[]
  includeSubscriptions: boolean
  includeInvoices: boolean
  includePayments: boolean
}
