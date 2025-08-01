import type { ValidationError } from '@/shared/utils/validation'
import type { 
  CreateProductFamilyRequest, 
  CreatePlanRequest, 
  CreateAddonRequest, 
  CreateChargeRequest, 
  CreateCouponRequest 
} from '../types/catalog.types'

interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

export const validateCreateProductFamily = (data: CreateProductFamilyRequest): ValidationResult => {
  const errors: ValidationError[] = []

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'Product family name is required',
      code: 'REQUIRED'
    })
  } else if (data.name.trim().length < 2) {
    errors.push({
      field: 'name',
      message: 'Product family name must be at least 2 characters',
      code: 'MIN_LENGTH'
    })
  } else if (data.name.trim().length > 100) {
    errors.push({
      field: 'name',
      message: 'Product family name cannot exceed 100 characters',
      code: 'MAX_LENGTH'
    })
  }

  // Description validation
  if (!data.description || data.description.trim().length === 0) {
    errors.push({
      field: 'description',
      message: 'Description is required',
      code: 'REQUIRED'
    })
  } else if (data.description.trim().length < 10) {
    errors.push({
      field: 'description',
      message: 'Description must be at least 10 characters',
      code: 'MIN_LENGTH'
    })
  } else if (data.description.trim().length > 500) {
    errors.push({
      field: 'description',
      message: 'Description cannot exceed 500 characters',
      code: 'MAX_LENGTH'
    })
  }

  // Category validation
  if (!data.category || data.category.trim().length === 0) {
    errors.push({
      field: 'category',
      message: 'Category is required',
      code: 'REQUIRED'
    })
  }

  // Settings validation
  if (data.settings?.defaultCurrency) {
    const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
    if (!validCurrencies.includes(data.settings.defaultCurrency)) {
      errors.push({
        field: 'settings.defaultCurrency',
        message: 'Invalid currency code',
        code: 'INVALID_CURRENCY'
      })
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateCreatePlan = (data: CreatePlanRequest): ValidationResult => {
  const errors: ValidationError[] = []

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'Plan name is required',
      code: 'REQUIRED'
    })
  } else if (data.name.trim().length < 2) {
    errors.push({
      field: 'name',
      message: 'Plan name must be at least 2 characters',
      code: 'MIN_LENGTH'
    })
  }

  // Description validation
  if (!data.description || data.description.trim().length === 0) {
    errors.push({
      field: 'description',
      message: 'Description is required',
      code: 'REQUIRED'
    })
  }

  // Product family validation
  if (!data.productFamilyId) {
    errors.push({
      field: 'productFamilyId',
      message: 'Product family is required',
      code: 'REQUIRED'
    })
  }

  // Billing period validation
  const validBillingPeriods = ['weekly', 'monthly', 'quarterly', 'yearly', 'custom']
  if (!validBillingPeriods.includes(data.billingPeriod)) {
    errors.push({
      field: 'billingPeriod',
      message: 'Invalid billing period',
      code: 'INVALID_BILLING_PERIOD'
    })
  }

  // Price points validation
  if (!data.pricePoints || data.pricePoints.length === 0) {
    errors.push({
      field: 'pricePoints',
      message: 'At least one price point is required',
      code: 'REQUIRED'
    })
  } else {
    data.pricePoints.forEach((pricePoint, index) => {
      if (!pricePoint.currency) {
        errors.push({
          field: `pricePoints.${index}.currency`,
          message: 'Currency is required for all price points',
          code: 'REQUIRED'
        })
      }
      if (pricePoint.price < 0) {
        errors.push({
          field: `pricePoints.${index}.price`,
          message: 'Price cannot be negative',
          code: 'INVALID_PRICE'
        })
      }
    })
  }

  // Trial period validation
  if (data.trialPeriod) {
    if (data.trialPeriod.duration <= 0) {
      errors.push({
        field: 'trialPeriod.duration',
        message: 'Trial duration must be positive',
        code: 'INVALID_DURATION'
      })
    }
    const validTrialUnits = ['days', 'weeks', 'months']
    if (!validTrialUnits.includes(data.trialPeriod.unit)) {
      errors.push({
        field: 'trialPeriod.unit',
        message: 'Invalid trial period unit',
        code: 'INVALID_TRIAL_UNIT'
      })
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateCreateAddon = (data: CreateAddonRequest): ValidationResult => {
  const errors: ValidationError[] = []

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'Addon name is required',
      code: 'REQUIRED'
    })
  }

  // Type validation
  const validAddonTypes = ['recurring', 'one_time', 'usage_based']
  if (!validAddonTypes.includes(data.type)) {
    errors.push({
      field: 'type',
      message: 'Invalid addon type',
      code: 'INVALID_ADDON_TYPE'
    })
  }

  // Charge model validation
  const validChargeModels = ['flat_fee', 'per_unit', 'tiered', 'volume', 'stairstep']
  if (!validChargeModels.includes(data.chargeModel)) {
    errors.push({
      field: 'chargeModel',
      message: 'Invalid charge model',
      code: 'INVALID_CHARGE_MODEL'
    })
  }

  // Price points validation
  if (!data.pricePoints || data.pricePoints.length === 0) {
    errors.push({
      field: 'pricePoints',
      message: 'At least one price point is required',
      code: 'REQUIRED'
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateCreateCharge = (data: CreateChargeRequest): ValidationResult => {
  const errors: ValidationError[] = []

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'Charge name is required',
      code: 'REQUIRED'
    })
  }

  // Type validation
  const validChargeTypes = ['one_time', 'recurring', 'usage_based', 'penalty']
  if (!validChargeTypes.includes(data.type)) {
    errors.push({
      field: 'type',
      message: 'Invalid charge type',
      code: 'INVALID_CHARGE_TYPE'
    })
  }

  // Price points validation
  if (!data.pricePoints || data.pricePoints.length === 0) {
    errors.push({
      field: 'pricePoints',
      message: 'At least one price point is required',
      code: 'REQUIRED'
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateCreateCoupon = (data: CreateCouponRequest): ValidationResult => {
  const errors: ValidationError[] = []

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'Coupon name is required',
      code: 'REQUIRED'
    })
  }

  // Coupon code validation
  if (!data.couponCode || data.couponCode.trim().length === 0) {
    errors.push({
      field: 'couponCode',
      message: 'Coupon code is required',
      code: 'REQUIRED'
    })
  } else if (!/^[A-Z0-9_-]+$/.test(data.couponCode)) {
    errors.push({
      field: 'couponCode',
      message: 'Coupon code can only contain uppercase letters, numbers, underscores, and hyphens',
      code: 'INVALID_COUPON_CODE'
    })
  }

  // Discount validation
  const validDiscountTypes = ['percentage', 'fixed_amount']
  if (!validDiscountTypes.includes(data.discountType)) {
    errors.push({
      field: 'discountType',
      message: 'Invalid discount type',
      code: 'INVALID_DISCOUNT_TYPE'
    })
  }

  if (data.discountValue <= 0) {
    errors.push({
      field: 'discountValue',
      message: 'Discount value must be positive',
      code: 'INVALID_DISCOUNT_VALUE'
    })
  }

  if (data.discountType === 'percentage' && data.discountValue > 100) {
    errors.push({
      field: 'discountValue',
      message: 'Percentage discount cannot exceed 100%',
      code: 'INVALID_PERCENTAGE'
    })
  }

  // Duration validation
  const validDurationTypes = ['one_time', 'forever', 'limited_period']
  if (!validDurationTypes.includes(data.durationType)) {
    errors.push({
      field: 'durationType',
      message: 'Invalid duration type',
      code: 'INVALID_DURATION_TYPE'
    })
  }

  if (data.durationType === 'limited_period' && (!data.duration || data.duration <= 0)) {
    errors.push({
      field: 'duration',
      message: 'Duration is required for limited period coupons',
      code: 'REQUIRED_DURATION'
    })
  }

  // Date validation
  if (data.validUntil && data.validUntil <= data.validFrom) {
    errors.push({
      field: 'validUntil',
      message: 'End date must be after start date',
      code: 'INVALID_DATE_RANGE'
    })
  }

  // Max redemptions validation
  if (data.maxRedemptions !== undefined && data.maxRedemptions <= 0) {
    errors.push({
      field: 'maxRedemptions',
      message: 'Max redemptions must be positive',
      code: 'INVALID_MAX_REDEMPTIONS'
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Utility functions for field validation
export const isValidCurrency = (currency: string): boolean => {
  const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY', 'INR']
  return validCurrencies.includes(currency)
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const formatCurrency = (amount: number, currency: string): string => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount)
