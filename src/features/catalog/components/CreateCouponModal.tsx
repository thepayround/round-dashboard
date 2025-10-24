import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Tag, 
  Percent, 
  DollarSign, 
  Users, 
  Gift,
  Shield,
  Zap,
  Check,
  Plus,
  Trash2
} from 'lucide-react'
import { UiDropdown, type UiDropdownOption } from '@/shared/components/ui/UiDropdown'
import type {
  DiscountType,
  DurationType
} from '../types/catalog.types'

interface CreateCouponModalProps {
  isOpen: boolean
  onClose: () => void
  plans?: { id: string; name: string }[]
  addons?: { id: string; name: string }[]
}

const discountTypes: { value: DiscountType; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { 
    value: 'percentage', 
    label: 'Percentage', 
    description: 'Discount as a percentage of the total', 
    icon: Percent 
  },
  { 
    value: 'fixed_amount', 
    label: 'Fixed Amount', 
    description: 'Fixed dollar amount discount', 
    icon: DollarSign 
  }
]

const durationTypeOptions: UiDropdownOption[] = [
  { value: 'one_time', label: 'One-time', description: 'Applied only to the first billing cycle' },
  { value: 'forever', label: 'Forever', description: 'Applied to all billing cycles' },
  { value: 'limited_period', label: 'Limited Period', description: 'Applied for a specific number of billing cycles' }
]

export const CreateCouponModal = ({ 
  isOpen, 
  onClose, 
  plans = [], 
  addons: _addons = [] 
}: CreateCouponModalProps) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    couponCode: '',
    description: '',
    discountType: 'percentage' as DiscountType,
    discountValue: 0,
    durationType: 'one_time' as DurationType,
    duration: undefined as number | undefined,
    maxRedemptions: undefined as number | undefined,
    maxRedemptionsPerCustomer: undefined as number | undefined,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: undefined as string | undefined,
    restrictions: {
      minimumOrderValue: undefined as number | undefined,
      maximumDiscountAmount: undefined as number | undefined,
      firstTimeCustomersOnly: false,
      applicablePlans: [] as string[],
      applicableAddons: [] as string[],
      excludePlans: [] as string[],
      excludeAddons: [] as string[]
    },
    customerEligibility: {
      allCustomers: true,
      customerIds: [] as string[],
      customerSegments: [] as string[]
    },
    stackable: false,
    autoApply: false
  })

  const [customCustomerId, setCustomCustomerId] = useState('')
  const [customSegment, setCustomSegment] = useState('')

  const steps = [
    { number: 1, title: 'Basic Info', icon: Tag },
    { number: 2, title: 'Discount Rules', icon: Percent },
    { number: 3, title: 'Restrictions', icon: Shield },
    { number: 4, title: 'Customer Eligibility', icon: Users },
    { number: 5, title: 'Review', icon: Check }
  ]

  const _generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData({ ...formData, couponCode: code })
  }

  const _handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1)
    }
  }

  const _handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const addCustomCustomer = () => {
    if (customCustomerId.trim()) {
      setFormData({
        ...formData,
        customerEligibility: {
          ...formData.customerEligibility,
          customerIds: [...formData.customerEligibility.customerIds, customCustomerId.trim()]
        }
      })
      setCustomCustomerId('')
    }
  }

  const removeCustomCustomer = (index: number) => {
    setFormData({
      ...formData,
      customerEligibility: {
        ...formData.customerEligibility,
        customerIds: formData.customerEligibility.customerIds.filter((_, i) => i !== index)
      }
    })
  }

  const addCustomSegment = () => {
    if (customSegment.trim()) {
      setFormData({
        ...formData,
        customerEligibility: {
          ...formData.customerEligibility,
          customerSegments: [...formData.customerEligibility.customerSegments, customSegment.trim()]
        }
      })
      setCustomSegment('')
    }
  }

  const removeCustomSegment = (index: number) => {
    setFormData({
      ...formData,
      customerEligibility: {
        ...formData.customerEligibility,
        customerSegments: formData.customerEligibility.customerSegments.filter((_, i) => i !== index)
      }
    })
  }

  const togglePlanRestriction = (planId: string, type: 'applicable' | 'exclude') => {
    const field = type === 'applicable' ? 'applicablePlans' : 'excludePlans'
    const otherField = type === 'applicable' ? 'excludePlans' : 'applicablePlans'
    
    const currentList = formData.restrictions[field]
    const otherList = formData.restrictions[otherField]
    
    // Remove from other list if it exists there
    const newOtherList = otherList.filter(id => id !== planId)
    
    // Toggle in current list
    const newCurrentList = currentList.includes(planId)
      ? currentList.filter(id => id !== planId)
      : [...currentList, planId]
    
    setFormData({
      ...formData,
      restrictions: {
        ...formData.restrictions,
        [field]: newCurrentList,
        [otherField]: newOtherList
      }
    })
  }

  const _handleSubmit = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#25262a]">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-secondary rounded-lg">
                <Tag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-medium tracking-tight auth-text">Create New Coupon</h2>
                <p className="auth-text-muted">Step {step} of {steps.length}: {steps[step - 1].title}</p>
              </div>
            </div>
            <button className="btn-secondary">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b border-[#25262a]">
            <div className="flex items-center justify-between">
              {steps.map((stepItem, index) => {
                // Determine step styling
                let stepCircleStyle = '';
                if (step > stepItem.number) {
                  stepCircleStyle = 'bg-green-500 text-white';
                } else if (step === stepItem.number) {
                  stepCircleStyle = 'bg-secondary text-white';
                } else {
                  stepCircleStyle = 'bg-[#1d1d20] text-white/50';
                }

                return (
                  <div key={stepItem.number} className="flex items-center">
                    <div className={`flex items-center space-x-2 ${
                      step >= stepItem.number ? 'text-white' : 'text-white/50'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stepCircleStyle}`}>
                      {step > stepItem.number ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <stepItem.icon className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-sm font-normal tracking-tight hidden sm:inline">
                      {stepItem.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      step > stepItem.number ? 'bg-green-500' : 'bg-[#25262a]'
                    }`} />
                  )}
                </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-medium tracking-tight auth-text mb-4">Basic Coupon Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="coupon-name" className="block text-sm font-normal tracking-tight auth-text mb-2">
                      Coupon Name *
                    </label>
                    <input
                      id="coupon-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="auth-input w-full"
                      placeholder="Spring Sale 2024"
                    />
                  </div>

                  <div>
                    <label htmlFor="coupon-code" className="block text-sm font-normal tracking-tight auth-text mb-2">
                      Coupon Code *
                    </label>
                    <div className="flex space-x-2">
                      <input
                        id="coupon-code"
                        type="text"
                        value={formData.couponCode}
                        onChange={(e) => setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })}
                        className="auth-input flex-1"
                        placeholder="SPRING2024"
                        style={{ textTransform: 'uppercase' }}
                      />
                      <button className="btn-secondary">
                        Generate
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="coupon-description" className="block text-sm font-normal tracking-tight auth-text mb-2">
                    Description
                  </label>
                  <textarea
                    id="coupon-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="auth-input w-full h-24 resize-none"
                    placeholder="Describe this coupon and its purpose..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="coupon-valid-from" className="block text-sm font-normal tracking-tight auth-text mb-2">
                      Valid From *
                    </label>
                    <input
                      id="coupon-valid-from"
                      type="date"
                      value={formData.validFrom}
                      onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                      className="auth-input w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="coupon-valid-until" className="block text-sm font-normal tracking-tight auth-text mb-2">
                      Valid Until
                    </label>
                    <input
                      id="coupon-valid-until"
                      type="date"
                      value={formData.validUntil ?? ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        validUntil: e.target.value || undefined 
                      })}
                      className="auth-input w-full"
                      placeholder="Leave empty for no expiration"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.stackable}
                      onChange={(e) => setFormData({ ...formData, stackable: e.target.checked })}
                      className="auth-checkbox"
                      aria-label="Stackable with other coupons - Allow this coupon to be combined with other active coupons"
                    />
                    <div>
                      <span className="text-sm font-normal tracking-tight auth-text">Stackable with other coupons</span>
                      <p className="text-xs auth-text-muted">
                        Allow this coupon to be combined with other active coupons
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.autoApply}
                      onChange={(e) => setFormData({ ...formData, autoApply: e.target.checked })}
                      className="auth-checkbox"
                      aria-label="Auto-apply for eligible customers - Automatically apply this coupon for customers who meet the criteria"
                    />
                    <div>
                      <span className="text-sm font-normal tracking-tight auth-text">Auto-apply for eligible customers</span>
                      <p className="text-xs auth-text-muted">
                        Automatically apply this coupon for customers who meet the criteria
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-medium tracking-tight auth-text mb-4">Discount Configuration</h3>
                
                {/* Discount Type Selection */}
                <div className="space-y-4">
                  <div className="block text-sm font-normal tracking-tight auth-text mb-2">
                    Discount Type *
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {discountTypes.map(type => (
                      <motion.button
                        key={type.value}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, discountType: type.value })}
                        className={`p-4 rounded-lg border text-left transition-all ${
                          formData.discountType === type.value
                            ? 'border-[#D417C8] bg-[#D417C8]/10 text-white'
                            : 'border-[#25262a] bg-[#171719] text-white/70 hover:text-white hover:border-[#2c2d31]'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <type.icon className="w-5 h-5" />
                          <span className="font-medium">{type.label}</span>
                        </div>
                        <p className="text-sm opacity-70">{type.description}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Discount Value */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="discount-value" className="block text-sm font-normal tracking-tight auth-text mb-2">
                      {formData.discountType === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount ($)'} *
                    </label>
                    <input
                      id="discount-value"
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                      className="auth-input w-full"
                      min="0"
                      max={formData.discountType === 'percentage' ? '100' : undefined}
                      step={formData.discountType === 'percentage' ? '0.01' : '0.01'}
                      placeholder={formData.discountType === 'percentage' ? '25.00' : '10.00'}
                    />
                  </div>

                  <div>
                    <div className="block text-sm font-normal tracking-tight auth-text mb-2">
                      Duration Type *
                    </div>
                    <UiDropdown
                      options={durationTypeOptions}
                      value={formData.durationType}
                      onSelect={(value) => setFormData({
                        ...formData,
                        durationType: value as DurationType
                      })}
                      placeholder="Select duration type"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Duration Period (if limited) */}
                {formData.durationType === 'limited_period' && (
                  <div>
                    <label htmlFor="duration-cycles" className="block text-sm font-normal tracking-tight auth-text mb-2">
                      Number of Billing Cycles *
                    </label>
                    <input
                      id="duration-cycles"
                      type="number"
                      value={formData.duration ?? ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        duration: e.target.value ? Number(e.target.value) : undefined 
                      })}
                      className="auth-input w-full md:w-48"
                      min="1"
                      placeholder="3"
                    />
                    <p className="text-xs auth-text-muted mt-1">
                      Number of billing cycles this discount will be applied
                    </p>
                  </div>
                )}

                {/* Redemption Limits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="max-redemptions" className="block text-sm font-normal tracking-tight auth-text mb-2">
                      Maximum Total Redemptions
                    </label>
                    <input
                      id="max-redemptions"
                      type="number"
                      value={formData.maxRedemptions ?? ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        maxRedemptions: e.target.value ? Number(e.target.value) : undefined 
                      })}
                      className="auth-input w-full"
                      min="1"
                      placeholder="Leave empty for unlimited"
                    />
                  </div>

                  <div>
                    <label htmlFor="max-redemptions-per-customer" className="block text-sm font-normal tracking-tight auth-text mb-2">
                      Maximum Redemptions per Customer
                    </label>
                    <input
                      id="max-redemptions-per-customer"
                      type="number"
                      value={formData.maxRedemptionsPerCustomer ?? ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        maxRedemptionsPerCustomer: e.target.value ? Number(e.target.value) : undefined 
                      })}
                      className="auth-input w-full"
                      min="1"
                      placeholder="1"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-medium tracking-tight auth-text mb-4">Coupon Restrictions</h3>
                
                {/* Order Value Restrictions */}
                <div className="glass-card p-6">
                  <h4 className="text-lg font-medium auth-text mb-4">Order Value Restrictions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="min-order-value" className="block text-sm font-normal tracking-tight auth-text mb-2">
                        Minimum Order Value ($)
                      </label>
                      <input
                        id="min-order-value"
                        type="number"
                        value={formData.restrictions.minimumOrderValue ?? ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          restrictions: {
                            ...formData.restrictions,
                            minimumOrderValue: e.target.value ? Number(e.target.value) : undefined
                          }
                        })}
                        className="auth-input w-full"
                        min="0"
                        step="0.01"
                        placeholder="50.00"
                      />
                    </div>

                    <div>
                      <label htmlFor="max-discount-amount" className="block text-sm font-normal tracking-tight auth-text mb-2">
                        Maximum Discount Amount ($)
                      </label>
                      <input
                        id="max-discount-amount"
                        type="number"
                        value={formData.restrictions.maximumDiscountAmount ?? ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          restrictions: {
                            ...formData.restrictions,
                            maximumDiscountAmount: e.target.value ? Number(e.target.value) : undefined
                          }
                        })}
                        className="auth-input w-full"
                        min="0"
                        step="0.01"
                        placeholder="100.00"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.restrictions.firstTimeCustomersOnly}
                        onChange={(e) => setFormData({
                          ...formData,
                          restrictions: {
                            ...formData.restrictions,
                            firstTimeCustomersOnly: e.target.checked
                          }
                        })}
                        className="auth-checkbox"
                        aria-label="First-time customers only - Restrict this coupon to customers making their first purchase"
                      />
                      <div>
                        <span className="text-sm font-normal tracking-tight auth-text">First-time customers only</span>
                        <p className="text-xs auth-text-muted">
                          Restrict this coupon to customers making their first purchase
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Plan Restrictions */}
                <div className="glass-card p-6">
                  <h4 className="text-lg font-medium auth-text mb-4">Applicable Plans</h4>
                  {plans.length > 0 ? (
                    <div className="space-y-3">
                      {plans.map(plan => (
                        <div key={plan.id} className="flex items-center justify-between p-3 bg-[#171719] rounded-lg">
                          <span className="auth-text">{plan.name}</span>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              className={formData.restrictions.applicablePlans.includes(plan.id) ? 'btn-primary' : 'btn-secondary'}
                              onClick={() => togglePlanRestriction(plan.id, 'applicable')}
                            >
                              {formData.restrictions.applicablePlans.includes(plan.id) ? 'Included' : 'Include'}
                            </button>
                            <button
                              type="button"
                              className={formData.restrictions.excludePlans.includes(plan.id) ? 'btn-primary bg-red-500 hover:bg-red-600' : 'btn-secondary'}
                              onClick={() => togglePlanRestriction(plan.id, 'exclude')}
                            >
                              {formData.restrictions.excludePlans.includes(plan.id) ? 'Excluded' : 'Exclude'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4 auth-text-muted">No plans available</p>
                  )}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-medium tracking-tight auth-text mb-4">Customer Eligibility</h3>
                
                <div className="glass-card p-6">
                  <h4 className="text-lg font-medium auth-text mb-4">Eligibility Settings</h4>
                  
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="eligibility"
                        checked={formData.customerEligibility.allCustomers}
                        onChange={() => setFormData({
                          ...formData,
                          customerEligibility: {
                            ...formData.customerEligibility,
                            allCustomers: true
                          }
                        })}
                        className="auth-radio"
                        aria-label="All customers - Make this coupon available to all customers"
                      />
                      <div>
                        <span className="text-sm font-normal tracking-tight auth-text">All customers</span>
                        <p className="text-xs auth-text-muted">
                          Make this coupon available to all customers
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="eligibility"
                        checked={!formData.customerEligibility.allCustomers}
                        onChange={() => setFormData({
                          ...formData,
                          customerEligibility: {
                            ...formData.customerEligibility,
                            allCustomers: false
                          }
                        })}
                        className="auth-radio"
                        aria-label="Specific customers - Limit this coupon to specific customer segments or individual customers"
                      />
                      <div>
                        <span className="text-sm font-normal tracking-tight auth-text">Specific customers or segments</span>
                        <p className="text-xs auth-text-muted">
                          Restrict to specific customer IDs or segments
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {!formData.customerEligibility.allCustomers && (
                  <div className="space-y-6">
                    {/* Specific Customer IDs */}
                    <div className="glass-card p-6">
                      <h4 className="text-lg font-medium auth-text mb-4">Specific Customer IDs</h4>
                      
                      <div className="flex space-x-2 mb-4">
                        <input
                          type="text"
                          value={customCustomerId}
                          onChange={(e) => setCustomCustomerId(e.target.value)}
                          className="auth-input flex-1"
                          placeholder="Enter customer ID"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addCustomCustomer()
                            }
                          }}
                        />
                        <button className="btn-primary">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        {formData.customerEligibility.customerIds.map((customerId, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-[#171719] rounded">
                            <span className="auth-text text-sm">{customerId}</span>
                            <button
                              type="button"
                              onClick={() => removeCustomCustomer(index)}
                              className="btn-secondary text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {formData.customerEligibility.customerIds.length === 0 && (
                          <p className="text-center py-4 auth-text-muted text-sm">No specific customers added</p>
                        )}
                      </div>
                    </div>

                    {/* Customer Segments */}
                    <div className="glass-card p-6">
                      <h4 className="text-lg font-medium auth-text mb-4">Customer Segments</h4>
                      
                      <div className="flex space-x-2 mb-4">
                        <input
                          type="text"
                          value={customSegment}
                          onChange={(e) => setCustomSegment(e.target.value)}
                          className="auth-input flex-1"
                          placeholder="Enter segment name (e.g., Premium, Enterprise)"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addCustomSegment()
                            }
                          }}
                        />
                        <button className="btn-primary">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        {formData.customerEligibility.customerSegments.map((segment, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-[#171719] rounded">
                            <span className="auth-text text-sm">{segment}</span>
                            <button
                              type="button"
                              onClick={() => removeCustomSegment(index)}
                              className="btn-secondary text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {formData.customerEligibility.customerSegments.length === 0 && (
                          <p className="text-center py-4 auth-text-muted text-sm">No segments added</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <h3 className="text-xl font-medium tracking-tight auth-text mb-4">Review Coupon Details</h3>
                
                {/* Coupon Summary */}
                <div className="glass-card p-6">
                  <h4 className="text-lg font-medium auth-text mb-4">Coupon Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm auth-text-muted">Name:</span>
                      <p className="font-medium auth-text">{formData.name || 'Untitled Coupon'}</p>
                    </div>
                    <div>
                      <span className="text-sm auth-text-muted">Code:</span>
                      <p className="font-medium auth-text font-mono">{formData.couponCode || 'No code set'}</p>
                    </div>
                    <div>
                      <span className="text-sm auth-text-muted">Discount:</span>
                      <p className="font-medium auth-text">
                        {formData.discountType === 'percentage' 
                          ? `${formData.discountValue}%` 
                          : `$${formData.discountValue}`
                        } ({formData.durationType})
                      </p>
                    </div>
                    <div>
                      <span className="text-sm auth-text-muted">Valid Period:</span>
                      <p className="font-medium auth-text">
                        {formData.validFrom} {formData.validUntil ? `to ${formData.validUntil}` : '(no end date)'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Restrictions Summary */}
                <div className="glass-card p-6">
                  <h4 className="text-lg font-medium auth-text mb-4">Restrictions</h4>
                  <div className="space-y-3">
                    {formData.restrictions.minimumOrderValue && (
                      <div className="flex items-center justify-between p-2 bg-[#171719] rounded">
                        <span className="text-sm auth-text">Minimum Order Value</span>
                        <span className="text-sm auth-text-muted">${formData.restrictions.minimumOrderValue}</span>
                      </div>
                    )}
                    {formData.restrictions.maximumDiscountAmount && (
                      <div className="flex items-center justify-between p-2 bg-[#171719] rounded">
                        <span className="text-sm auth-text">Maximum Discount</span>
                        <span className="text-sm auth-text-muted">${formData.restrictions.maximumDiscountAmount}</span>
                      </div>
                    )}
                    {formData.restrictions.firstTimeCustomersOnly && (
                      <div className="flex items-center p-2 bg-blue-500/20 rounded">
                        <Users className="w-4 h-4 text-blue-400 mr-2" />
                        <span className="text-sm text-blue-400">First-time customers only</span>
                      </div>
                    )}
                    {formData.stackable && (
                      <div className="flex items-center p-2 bg-green-500/20 rounded">
                        <Zap className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-sm text-green-400">Stackable with other coupons</span>
                      </div>
                    )}
                    {formData.autoApply && (
                      <div className="flex items-center p-2 bg-purple-500/20 rounded">
                        <Gift className="w-4 h-4 text-purple-400 mr-2" />
                        <span className="text-sm text-purple-400">Auto-apply for eligible customers</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Eligibility Summary */}
                <div className="glass-card p-6">
                  <h4 className="text-lg font-medium auth-text mb-4">Customer Eligibility</h4>
                  {formData.customerEligibility.allCustomers ? (
                    <p className="auth-text">Available to all customers</p>
                  ) : (
                    <div className="space-y-2">
                      {formData.customerEligibility.customerIds.length > 0 && (
                        <div>
                          <span className="text-sm auth-text-muted">Specific Customers:</span>
                          <p className="text-sm auth-text">{formData.customerEligibility.customerIds.join(', ')}</p>
                        </div>
                      )}
                      {formData.customerEligibility.customerSegments.length > 0 && (
                        <div>
                          <span className="text-sm auth-text-muted">Customer Segments:</span>
                          <p className="text-sm auth-text">{formData.customerEligibility.customerSegments.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-[#25262a]">
            <div>
              {step > 1 && (
                <button className="btn-secondary">
                  Previous
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="btn-secondary">
                Cancel
              </button>
              {step < steps.length ? (
                <button className="btn-primary">
                  Next
                </button>) : (
<button className="btn-primary">
                  Create Coupon
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
