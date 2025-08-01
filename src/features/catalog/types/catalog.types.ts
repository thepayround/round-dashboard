// Core Product Catalog Types
export interface ProductFamily {
  id: string
  name: string
  description: string
  productCount: number
  status: 'active' | 'inactive' | 'draft'
  category: string
  createdAt: Date
  updatedAt?: Date
  revenue: number
  settings?: ProductFamilySettings
}

export interface ProductFamilySettings {
  allowCustomPricing: boolean
  requireApproval: boolean
  defaultCurrency: string
  taxConfiguration?: TaxConfiguration
}

export interface Plan {
  id: string
  name: string
  description: string
  productFamilyId: string
  status: 'active' | 'inactive' | 'archived'
  billingPeriod: BillingPeriod
  isMetered: boolean
  meteredUsage?: MeteredUsage[]
  pricePoints: PricePoint[]
  features: PlanFeature[]
  entitlements: Entitlement[]
  billingCycles?: number // Number of billing cycles (undefined = forever)
  trialPeriod?: number // Trial period in days
  setupCharges?: Charge[]
  applicableAddons?: string[] // Addon IDs that can be applied to this plan
  applicableCoupons?: string[] // Coupon IDs that can be applied to this plan
  customerPortal: {
    showInCheckout: boolean
    showInPortal: boolean
    allowUpgrade: boolean
    allowDowngrade: boolean
    allowCancellation: boolean
  }
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt?: Date
}

export interface PricePoint {
  id: string
  currency: string
  price: number
  billingFrequency: BillingFrequency
  pricingModel: PricingModel
  setupFee?: number
  freeQuantity?: number
  unitPrice?: number
  percentage?: number
  packageSize?: number
  tiers?: PricingTier[]
  trialPeriod?: TrialPeriod
  taxConfiguration?: TaxConfiguration
  accounting?: AccountingInfo
  displayName?: string
  description?: string
  invoiceNotes?: string
  showInCheckout: boolean
  showInPortal: boolean
  redirectUrl?: string
}

export interface PricingTier {
  startingUnit: number
  endingUnit?: number
  price: number
  flatFee?: number
}

export interface Addon {
  id: string
  name: string
  description: string
  productFamilyId: string
  type: AddonType
  status: 'active' | 'inactive' | 'archived'
  pricePoints: PricePoint[]
  chargeModel: ChargeModel
  isOptional: boolean
  isQuantityBasedCharge: boolean
  applicablePlans?: string[] // Plan IDs this addon can be applied to
  billingCycles?: number // For recurring addons
  meteredUsage?: MeteredUsage[]
  customerPortal: {
    showInCheckout: boolean
    showInPortal: boolean
    allowSelfSubscribe: boolean
    allowSelfRemove: boolean
  }
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt?: Date
}

export interface Charge {
  id: string
  name: string
  description: string
  productFamilyId: string
  chargeType: ChargeType
  status: 'active' | 'inactive' | 'archived'
  chargeModel: ChargeModel
  amount: number
  currency: string
  period?: ChargePeriod
  unitName?: string
  unitPrice?: number
  percentageOf?: string
  percentageValue?: number
  isProrated?: boolean
  taxable?: boolean
  pricePoints: PricePoint[]
  applicability?: ChargeApplicability
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt?: Date
}

export interface Coupon {
  id: string
  name: string
  couponCode: string
  description?: string
  discountType: DiscountType
  discountValue: number
  durationType: DurationType
  duration?: number
  maxRedemptions?: number
  maxRedemptionsPerCustomer?: number
  currentRedemptions: number
  status: 'active' | 'expired' | 'archived'
  validFrom: Date
  validUntil?: Date
  applicableItems?: ApplicableItem[]
  restrictions: {
    minimumOrderValue?: number
    maximumDiscountAmount?: number
    firstTimeCustomersOnly?: boolean
    applicablePlans?: string[]
    applicableAddons?: string[]
    excludePlans?: string[]
    excludeAddons?: string[]
  }
  customerEligibility: {
    allCustomers: boolean
    customerIds?: string[]
    customerSegments?: string[]
  }
  stackable: boolean
  autoApply: boolean
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt?: Date
}

// Enums and Supporting Types
export type BillingPeriod = 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom'
export type BillingFrequency = 'weekly' | 'monthly' | 'quarterly' | 'semi_annual' | 'yearly'
export type AddonType = 'recurring' | 'one_time' | 'usage_based'
export type ChargeType = 'one_time' | 'recurring' | 'usage_based' | 'penalty'
export type ChargeModel = 'flat_fee' | 'per_unit' | 'tiered' | 'volume' | 'stairstep' | 'package' | 'percentage'
export type ChargePeriod = 'weekly' | 'monthly' | 'quarterly' | 'semi_annually' | 'annually'
export type PricingModel = 'flat_fee' | 'per_unit' | 'tiered' | 'volume' | 'stairstep' | 'package' | 'percentage' | 'metered'
export type DiscountType = 'percentage' | 'fixed_amount'
export type DurationType = 'one_time' | 'forever' | 'limited_period'

export interface TrialPeriod {
  duration: number
  unit: 'days' | 'weeks' | 'months'
}

export interface PlanFeature {
  id: string
  name: string
  description?: string
  featureType: 'boolean' | 'quantity' | 'text'
  value: string | number | boolean
  displayOrder: number
}

export interface ChargeApplicability {
  subscriptions: boolean
  customers: boolean
  invoices: boolean
}

export interface ApplicableItem {
  type: 'plan' | 'addon' | 'charge'
  id: string
}

export interface TaxConfiguration {
  taxIncluded: boolean
  taxCode?: string
  exemptFromTax: boolean
  taxProfile?: string
}

export interface AccountingInfo {
  sku?: string
  accountingCode: string
  accountingCategory?: string
  revenueAccount?: string
  deferredRevenueAccount?: string
}

export interface MeteredUsage {
  metricId: string
  metricName: string
  unit: string
  aggregation: 'sum' | 'max' | 'last_value' | 'unique_count'
  pricePerUnit: number
  includedQuantity?: number
  overage?: boolean
}

export interface Entitlement {
  id: string
  featureId: string
  featureName: string
  featureType: 'boolean' | 'quantity' | 'text'
  value: string | number | boolean
  isOverridable: boolean
}

// API Response Types
export interface CatalogStats {
  totalProducts: number
  activeProducts: number
  totalRevenue: number
  monthlyGrowth: number
  planCount: number
  addonCount: number
  chargeCount: number
  couponCount: number
}

// Form Types
export interface CreateProductFamilyRequest {
  name: string
  description: string
  category: string
  settings?: Partial<ProductFamilySettings>
}

export interface CreatePlanRequest {
  name: string
  description: string
  productFamilyId: string
  billingPeriod: BillingPeriod
  trialPeriod?: TrialPeriod
  pricePoints: Omit<PricePoint, 'id'>[]
  features?: Omit<PlanFeature, 'id'>[]
}

export interface CreateAddonRequest {
  name: string
  description: string
  productFamilyId: string
  type: AddonType
  chargeModel: ChargeModel
  pricePoints: Omit<PricePoint, 'id'>[]
}

export interface CreateChargeRequest {
  name: string
  description: string
  productFamilyId: string
  type: ChargeType
  chargeModel: ChargeModel
  pricePoints: Omit<PricePoint, 'id'>[]
  applicability?: ChargeApplicability
}

export interface CreateCouponRequest {
  name: string
  couponCode: string
  description?: string
  discountType: DiscountType
  discountValue: number
  durationType: DurationType
  duration?: number
  maxRedemptions?: number
  validFrom: Date
  validUntil?: Date
  applicableItems?: ApplicableItem[]
}

// View Types
export type CatalogViewMode = 'grid' | 'list'
export type CatalogSortBy = 'name' | 'created' | 'revenue' | 'status'
export type CatalogFilterBy = 'status' | 'category' | 'revenue'
