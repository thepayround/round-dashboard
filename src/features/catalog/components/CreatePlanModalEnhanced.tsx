import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Package, 
  DollarSign, 
  Users, 
  Zap,
  Check,
  AlertCircle
} from 'lucide-react'
import { PricingModelBuilder } from './PricingModelBuilder'
import type { 
  PricePoint, 
  MeteredUsage,
  BillingFrequency,
  PlanFeature,
  Entitlement
} from '../types/catalog.types'

interface CreatePlanModalEnhancedProps {
  isOpen: boolean
  onClose: () => void
  productFamilies?: { id: string; name: string }[]
}

const billingFrequencies: { value: BillingFrequency; label: string; description: string }[] = [
  { value: 'weekly', label: 'Weekly', description: 'Charged every week' },
  { value: 'monthly', label: 'Monthly', description: 'Charged every month' },
  { value: 'quarterly', label: 'Quarterly', description: 'Charged every 3 months' },
  { value: 'semi_annual', label: 'Semi-Annual', description: 'Charged every 6 months' },
  { value: 'yearly', label: 'Yearly', description: 'Charged every year' }
]

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' }
]

export const CreatePlanModalEnhanced = ({ isOpen, onClose, productFamilies = [] }: CreatePlanModalEnhancedProps) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    productFamilyId: '',
    isMetered: false,
    billingCycles: undefined as number | undefined,
    customerPortal: {
      showInCheckout: true,
      showInPortal: true,
      allowUpgrade: true,
      allowDowngrade: true,
      allowCancellation: false
    }
  })

  const [currentPricePoint, setCurrentPricePoint] = useState<Partial<PricePoint>>({
    currency: 'USD',
    billingFrequency: 'monthly',
    pricingModel: 'flat_fee',
    price: 0,
    showInCheckout: true,
    showInPortal: true,
    tiers: [],
    trialPeriod: undefined
  })

  const [pricePoints, setPricePoints] = useState<Partial<PricePoint>[]>([])
  const [features, setFeatures] = useState<PlanFeature[]>([])
  const [_entitlements, _setEntitlements] = useState<Entitlement[]>([])
  const [meteredUsage, setMeteredUsage] = useState<MeteredUsage[]>([])

  const steps = [
    { number: 1, title: 'Basic Info', icon: Package },
    { number: 2, title: 'Pricing', icon: DollarSign },
    { number: 3, title: 'Features', icon: Zap },
    { number: 4, title: 'Portal Settings', icon: Users },
    { number: 5, title: 'Review', icon: Check }
  ]

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

  const _addPricePoint = () => {
    if (currentPricePoint.currency && currentPricePoint.billingFrequency) {
      setPricePoints([...pricePoints, { 
        ...currentPricePoint, 
        id: `pp_${Date.now()}`,
        displayName: `${formData.name} ${currentPricePoint.billingFrequency}`
      }])
      
      // Reset current price point
      setCurrentPricePoint({
        currency: 'USD',
        billingFrequency: 'monthly',
        pricingModel: 'flat_fee',
        price: 0,
        showInCheckout: true,
        showInPortal: true,
        tiers: []
      })
    }
  }

  const _addFeature = () => {
    const newFeature: PlanFeature = {
      id: `feature_${Date.now()}`,
      name: '',
      description: '',
      featureType: 'boolean',
      value: true,
      displayOrder: features.length
    }
    setFeatures([...features, newFeature])
  }

  const updateFeature = (index: number, updatedFeature: PlanFeature) => {
    const newFeatures = [...features]
    newFeatures[index] = updatedFeature
    setFeatures(newFeatures)
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const _handleSubmit = () => {
    // Here you would submit the plan data to your API
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-[#D417C8] to-[#14BDEA] rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold auth-text">Create New Plan</h2>
                <p className="auth-text-muted">Step {step} of {steps.length}: {steps[step - 1].title}</p>
              </div>
            </div>
            <button className="btn-secondary">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              {steps.map((stepItem, index) => {
                // Determine step styling
                let stepCircleStyle = '';
                if (step > stepItem.number) {
                  stepCircleStyle = 'bg-green-500 text-white';
                } else if (step === stepItem.number) {
                  stepCircleStyle = 'bg-gradient-to-r from-[#D417C8] to-[#14BDEA] text-white';
                } else {
                  stepCircleStyle = 'bg-white/10 text-white/50';
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
                    <span className="text-sm font-medium hidden sm:inline">
                      {stepItem.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      step > stepItem.number ? 'bg-green-500' : 'bg-white/20'
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
                <h3 className="text-xl font-semibold auth-text mb-4">Basic Plan Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="plan-name" className="block text-sm font-medium auth-text mb-2">
                      Plan Name *
                    </label>
                    <input
                      id="plan-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="auth-input w-full"
                      placeholder="Professional Plan"
                    />
                  </div>

                  <div>
                    <label htmlFor="product-family" className="block text-sm font-medium auth-text mb-2">
                      Product Family *
                    </label>
                    <select
                      id="product-family"
                      value={formData.productFamilyId}
                      onChange={(e) => setFormData({ ...formData, productFamilyId: e.target.value })}
                      className="auth-input w-full"
                    >
                      <option value="">Select a product family</option>
                      {productFamilies.map(family => (
                        <option key={family.id} value={family.id}>
                          {family.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="plan-description" className="block text-sm font-medium auth-text mb-2">
                    Description
                  </label>
                  <textarea
                    id="plan-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="auth-input w-full h-24 resize-none"
                    placeholder="Describe what this plan includes..."
                  />
                </div>

                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.isMetered}
                      onChange={(e) => setFormData({ ...formData, isMetered: e.target.checked })}
                      className="auth-checkbox"
                      aria-label="Metered Plan - Enable usage-based billing with real-time tracking"
                    />
                    <div>
                      <span className="text-sm font-medium auth-text">Metered Plan</span>
                      <p className="text-xs auth-text-muted">
                        Enable usage-based billing with real-time tracking
                      </p>
                    </div>
                  </label>

                  <div>
                    <label htmlFor="billing-cycles" className="block text-sm font-medium auth-text mb-2">
                      Billing Cycles
                    </label>
                    <input
                      id="billing-cycles"
                      type="number"
                      value={formData.billingCycles ?? ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        billingCycles: e.target.value ? Number(e.target.value) : undefined 
                      })}
                      className="auth-input w-full md:w-48"
                      placeholder="Leave empty for unlimited"
                      min="1"
                    />
                    <p className="text-xs auth-text-muted mt-1">
                      Number of billing cycles before subscription ends (leave empty for unlimited)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold auth-text">Pricing Configuration</h3>
                  {pricePoints.length > 0 && (
                    <button className="btn-primary">
                      Add Price Point
                    </button>
                  )}
                </div>

                {/* Current Price Point Builder */}
                <div className="glass-card p-6">
                  <h4 className="text-lg font-medium auth-text mb-4">
                    {pricePoints.length === 0 ? 'Primary Price Point' : 'New Price Point'}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="price-currency" className="block text-sm font-medium auth-text mb-2">
                        Currency
                      </label>
                      <select
                        id="price-currency"
                        value={currentPricePoint.currency}
                        onChange={(e) => setCurrentPricePoint({ 
                          ...currentPricePoint, 
                          currency: e.target.value 
                        })}
                        className="auth-input w-full"
                      >
                        {currencies.map(currency => (
                          <option key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.code} - {currency.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="billing-frequency" className="block text-sm font-medium auth-text mb-2">
                        Billing Frequency
                      </label>
                      <select
                        id="billing-frequency"
                        value={currentPricePoint.billingFrequency}
                        onChange={(e) => setCurrentPricePoint({ 
                          ...currentPricePoint, 
                          billingFrequency: e.target.value as BillingFrequency
                        })}
                        className="auth-input w-full"
                      >
                        {billingFrequencies.map(freq => (
                          <option key={freq.value} value={freq.value}>
                            {freq.label} - {freq.description}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <PricingModelBuilder
                    pricingModel={currentPricePoint.pricingModel ?? 'flat_fee'}
                    price={currentPricePoint.price ?? 0}
                    tiers={currentPricePoint.tiers ?? []}
                    meteredUsage={meteredUsage}
                    packageSize={currentPricePoint.packageSize}
                    freeQuantity={currentPricePoint.freeQuantity}
                    onPricingModelChange={(model) => setCurrentPricePoint({ 
                      ...currentPricePoint, 
                      pricingModel: model 
                    })}
                    onPriceChange={(price) => setCurrentPricePoint({ 
                      ...currentPricePoint, 
                      price 
                    })}
                    onTiersChange={(tiers) => setCurrentPricePoint({ 
                      ...currentPricePoint, 
                      tiers 
                    })}
                    onMeteredUsageChange={formData.isMetered ? setMeteredUsage : undefined}
                    onPackageSizeChange={(size) => setCurrentPricePoint({ 
                      ...currentPricePoint, 
                      packageSize: size 
                    })}
                    onFreeQuantityChange={(quantity) => setCurrentPricePoint({ 
                      ...currentPricePoint, 
                      freeQuantity: quantity 
                    })}
                  />

                  {pricePoints.length === 0 && (
                    <div className="mt-6">
                      <button className="btn-primary">
                        Save Price Point
                      </button>
                    </div>
                  )}
                </div>

                {/* Existing Price Points */}
                {pricePoints.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium auth-text">Configured Price Points</h4>
                    {pricePoints.map((pp, index) => (
                      <div key={index} className="glass-card p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium auth-text">
                                {currencies.find(c => c.code === pp.currency)?.symbol}{pp.price} 
                                {pp.currency} / {pp.billingFrequency}
                              </span>
                              <span className="px-2 py-1 bg-[#D417C8]/20 text-[#D417C8] text-xs rounded-full">
                                {pp.pricingModel?.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-sm auth-text-muted">
                              {pp.description ?? `${formData.name} - ${pp.billingFrequency} billing`}
                            </p>
                          </div>
                          <button
                            onClick={() => setPricePoints(pricePoints.filter((_, i) => i !== index))}
                            className="btn-secondary text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <button className="btn-secondary">
                      Add Another Price Point
                    </button>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold auth-text">Plan Features</h3>
                  <button className="btn-primary">
                    Add Feature
                  </button>
                </div>

                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={feature.id} className="glass-card p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor={`feature-name-${index}`} className="block text-sm font-medium auth-text mb-2">
                            Feature Name
                          </label>
                          <input
                            id={`feature-name-${index}`}
                            type="text"
                            value={feature.name}
                            onChange={(e) => updateFeature(index, { ...feature, name: e.target.value })}
                            className="auth-input w-full"
                            placeholder="Unlimited Storage"
                          />
                        </div>

                        <div>
                          <label htmlFor={`feature-type-${index}`} className="block text-sm font-medium auth-text mb-2">
                            Type
                          </label>
                          <select
                            id={`feature-type-${index}`}
                            value={feature.featureType}
                            onChange={(e) => updateFeature(index, { 
                              ...feature, 
                              featureType: e.target.value as 'boolean' | 'quantity' | 'text'
                            })}
                            className="auth-input w-full"
                          >
                            <option value="boolean">Yes/No</option>
                            <option value="quantity">Quantity</option>
                            <option value="text">Text</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor={`feature-value-${index}`} className="block text-sm font-medium auth-text mb-2">
                            Value
                          </label>
                          <div className="flex items-center space-x-2">
                            {(() => {
                              if (feature.featureType === 'boolean') {
                                return (
                                  <select
                                    id={`feature-value-${index}`}
                                    value={feature.value.toString()}
                                    onChange={(e) => updateFeature(index, { 
                                      ...feature, 
                                      value: e.target.value === 'true'
                                    })}
                                    className="auth-input w-full"
                                  >
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                  </select>
                                );
                              }
                              
                              if (feature.featureType === 'quantity') {
                                return (
                                  <input
                                    id={`feature-value-${index}`}
                                    type="number"
                                    value={feature.value as number}
                                    onChange={(e) => updateFeature(index, { 
                                      ...feature, 
                                      value: Number(e.target.value)
                                    })}
                                    className="auth-input w-full"
                                    min="0"
                                  />
                                );
                              }
                              
                              return (
                                <input
                                  id={`feature-value-${index}`}
                                  type="text"
                                  value={feature.value as string}
                                  onChange={(e) => updateFeature(index, { 
                                    ...feature, 
                                    value: e.target.value
                                  })}
                                  className="auth-input w-full"
                                />
                              );
                            })()}
                            <button
                              onClick={() => removeFeature(index)}
                              className="btn-secondary text-red-400 hover:text-red-300"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label htmlFor={`feature-description-${index}`} className="block text-sm font-medium auth-text mb-2">
                          Description
                        </label>
                        <input
                          id={`feature-description-${index}`}
                          type="text"
                          value={feature.description ?? ''}
                          onChange={(e) => updateFeature(index, { 
                            ...feature, 
                            description: e.target.value
                          })}
                          className="auth-input w-full"
                          placeholder="Optional description for this feature"
                        />
                      </div>
                    </div>
                  ))}

                  {features.length === 0 && (
                    <div className="text-center py-12 auth-text-muted">
                      <Zap className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <h4 className="text-lg font-medium mb-2">No features added yet</h4>
                      <p>Add features to highlight what&apos;s included in this plan</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold auth-text mb-4">Customer Portal Settings</h3>
                
                <div className="glass-card p-6">
                  <h4 className="text-lg font-medium auth-text mb-4">Visibility Settings</h4>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.customerPortal.showInCheckout}
                        onChange={(e) => setFormData({
                          ...formData,
                          customerPortal: {
                            ...formData.customerPortal,
                            showInCheckout: e.target.checked
                          }
                        })}
                        className="auth-checkbox"
                        aria-label="Show in Checkout - Allow customers to subscribe to this plan during checkout"
                      />
                      <div>
                        <span className="text-sm font-medium auth-text">Show in Checkout</span>
                        <p className="text-xs auth-text-muted">
                          Allow customers to subscribe to this plan during checkout
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.customerPortal.showInPortal}
                        onChange={(e) => setFormData({
                          ...formData,
                          customerPortal: {
                            ...formData.customerPortal,
                            showInPortal: e.target.checked
                          }
                        })}
                        className="auth-checkbox"
                        aria-label="Show in Customer Portal - Display this plan in the self-service customer portal"
                      />
                      <div>
                        <span className="text-sm font-medium auth-text">Show in Customer Portal</span>
                        <p className="text-xs auth-text-muted">
                          Display this plan in the self-service customer portal
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h4 className="text-lg font-medium auth-text mb-4">Plan Change Settings</h4>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.customerPortal.allowUpgrade}
                        onChange={(e) => setFormData({
                          ...formData,
                          customerPortal: {
                            ...formData.customerPortal,
                            allowUpgrade: e.target.checked
                          }
                        })}
                        className="auth-checkbox"
                        aria-label="Allow Upgrades - Customers can upgrade to this plan from lower-tier plans"
                      />
                      <div>
                        <span className="text-sm font-medium auth-text">Allow Upgrades</span>
                        <p className="text-xs auth-text-muted">
                          Customers can upgrade to this plan from lower-tier plans
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.customerPortal.allowDowngrade}
                        onChange={(e) => setFormData({
                          ...formData,
                          customerPortal: {
                            ...formData.customerPortal,
                            allowDowngrade: e.target.checked
                          }
                        })}
                        className="auth-checkbox"
                        aria-label="Allow Downgrades - Customers can downgrade from this plan to lower-tier plans"
                      />
                      <div>
                        <span className="text-sm font-medium auth-text">Allow Downgrades</span>
                        <p className="text-xs auth-text-muted">
                          Customers can downgrade from this plan to lower-tier plans
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.customerPortal.allowCancellation}
                        onChange={(e) => setFormData({
                          ...formData,
                          customerPortal: {
                            ...formData.customerPortal,
                            allowCancellation: e.target.checked
                          }
                        })}
                        className="auth-checkbox"
                        aria-label="Allow Self-Cancellation - Customers can cancel their subscription to this plan"
                      />
                      <div>
                        <span className="text-sm font-medium auth-text">Allow Self-Cancellation</span>
                        <p className="text-xs auth-text-muted">
                          Customers can cancel their subscription to this plan
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold auth-text mb-4">Review Plan Details</h3>
                
                {/* Plan Summary */}
                <div className="glass-card p-6">
                  <h4 className="text-lg font-medium auth-text mb-4">Plan Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm auth-text-muted">Name:</span>
                      <p className="font-medium auth-text">{formData.name || 'Untitled Plan'}</p>
                    </div>
                    <div>
                      <span className="text-sm auth-text-muted">Type:</span>
                      <p className="font-medium auth-text">
                        {formData.isMetered ? 'Metered Plan' : 'Standard Plan'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm auth-text-muted">Description:</span>
                      <p className="font-medium auth-text">
                        {formData.description || 'No description provided'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm auth-text-muted">Billing Cycles:</span>
                      <p className="font-medium auth-text">
                        {formData.billingCycles ? `${formData.billingCycles} cycles` : 'Unlimited'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price Points Summary */}
                <div className="glass-card p-6">
                  <h4 className="text-lg font-medium auth-text mb-4">
                    Price Points ({pricePoints.length})
                  </h4>
                  {pricePoints.length > 0 ? (
                    <div className="space-y-3">
                      {pricePoints.map((pp, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div>
                            <span className="font-medium auth-text">
                              {currencies.find(c => c.code === pp.currency)?.symbol}{pp.price} {pp.currency}
                            </span>
                            <span className="auth-text-muted"> / {pp.billingFrequency}</span>
                            <div className="text-xs auth-text-muted">
                              {pp.pricingModel?.replace('_', ' ').toUpperCase()}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {pp.showInCheckout && (
                              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                Checkout
                              </span>
                            )}
                            {pp.showInPortal && (
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                                Portal
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 auth-text-muted">
                      <AlertCircle className="w-12 h-12 mx-auto mb-2 text-yellow-500" />
                      <p>No price points configured</p>
                    </div>
                  )}
                </div>

                {/* Features Summary */}
                <div className="glass-card p-6">
                  <h4 className="text-lg font-medium auth-text mb-4">
                    Features ({features.length})
                  </h4>
                  {features.length > 0 ? (
                    <div className="space-y-2">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
                          <span className="font-medium auth-text">{feature.name}</span>
                          <span className="auth-text-muted">{feature.value.toString()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4 auth-text-muted">No features defined</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-white/10">
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
                  Create Plan
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
