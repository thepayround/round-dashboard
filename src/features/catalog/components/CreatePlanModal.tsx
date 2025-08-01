import { motion, AnimatePresence } from 'framer-motion'
import { X, Package, Save, AlertCircle, Plus, Minus, DollarSign } from 'lucide-react'
import { useState } from 'react'

import type { CreatePlanRequest, PricePoint, PlanFeature, TrialPeriod } from '../types/catalog.types'
import { validateCreatePlan } from '../utils/catalog.validation'
import type { ValidationError } from '@/shared/utils/validation'

interface CreatePlanModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: CreatePlanRequest) => Promise<void>
}

export const CreatePlanModal = ({
  isOpen,
  onClose,
  onSubmit
}: CreatePlanModalProps) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<CreatePlanRequest>({
    name: '',
    description: '',
    productFamilyId: '',
    billingPeriod: 'monthly',
    pricePoints: [
      {
        currency: 'USD',
        price: 0,
        billingFrequency: 'monthly',
        pricingModel: 'flat_fee',
        showInCheckout: true,
        showInPortal: true
      }
    ],
    features: []
  })
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const productFamilies = [
    { id: '1', name: 'Core Platform' },
    { id: '2', name: 'Analytics Suite' },
    { id: '3', name: 'Enterprise Add-ons' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name.startsWith('trialPeriod.')) {
      const trialKey = name.split('.')[1] as keyof TrialPeriod
      setFormData(prev => ({
        ...prev,
        trialPeriod: {
          ...prev.trialPeriod,
          [trialKey]: trialKey === 'duration' ? parseInt(value) || 0 : value
        } as TrialPeriod
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }

    // Clear field-specific errors
    if (errors.some(error => error.field === name)) {
      setErrors(prev => prev.filter(error => error.field !== name))
    }
  }

  const handlePricePointChange = (index: number, field: keyof PricePoint, value: string | number) => {
    const newPricePoints = [...formData.pricePoints]
    newPricePoints[index] = {
      ...newPricePoints[index],
      [field]: field === 'price' ? parseFloat(value as string) || 0 : value
    }
    setFormData(prev => ({ ...prev, pricePoints: newPricePoints }))
  }

  const _addPricePoint = () => {
    setFormData(prev => ({
      ...prev,
      pricePoints: [
        ...prev.pricePoints,
        {
          currency: 'USD',
          price: 0,
          billingFrequency: 'monthly',
          pricingModel: 'flat_fee',
          showInCheckout: true,
          showInPortal: true
        }
      ]
    }))
  }

  const removePricePoint = (index: number) => {
    if (formData.pricePoints.length > 1) {
      const newPricePoints = formData.pricePoints.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, pricePoints: newPricePoints }))
    }
  }

  const handleFeatureChange = (index: number, field: keyof PlanFeature, value: string | number | boolean) => {
    const newFeatures = [...(formData.features ?? [])]
    newFeatures[index] = {
      ...newFeatures[index],
      [field]: value
    } as PlanFeature
    setFormData(prev => ({ ...prev, features: newFeatures }))
  }

  const _addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [
        ...(prev.features ?? []),
        {
          id: `feature-${Date.now()}`,
          name: '',
          featureType: 'boolean',
          value: true,
          displayOrder: (prev.features?.length ?? 0) + 1
        }
      ]
    }))
  }

  const removeFeature = (index: number) => {
    const newFeatures = (formData.features ?? []).filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, features: newFeatures }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    const validation = validateCreatePlan(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      setIsSubmitting(false)
      return
    }

    try {
      await onSubmit?.(formData)
      onClose()
      // Reset form
      setFormData({
        name: '',
        description: '',
        productFamilyId: '',
        billingPeriod: 'monthly',
        pricePoints: [{ 
          currency: 'USD', 
          price: 0, 
          billingFrequency: 'monthly',
          pricingModel: 'flat_fee',
          showInCheckout: true,
          showInPortal: true
        }],
        features: []
      })
      setErrors([])
      setCurrentStep(1)
    } catch (error) {
      console.error('Failed to create plan:', error)
      setErrors([{
        field: 'general',
        message: 'Failed to create plan. Please try again.',
        code: 'CREATION_FAILED'
      }])
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFieldError = (fieldName: string) => errors.find(error => error.field === fieldName)

  const _nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const _prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            <div className="glass-card">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                    <Package className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold auth-text">Create Plan</h2>
                    <p className="text-sm auth-text-muted">Step {currentStep} of 3</p>
                  </div>
                </div>
                <button className="btn-secondary">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-center p-4 border-b border-white/10">
                <div className="flex items-center space-x-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep >= step 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white/10 text-white/60'
                      }`}>
                        {step}
                      </div>
                      <span className={`text-sm ${
                        currentStep >= step ? 'text-white' : 'text-white/60'
                      }`}>
                        {(() => {
                          if (step === 1) return 'Basic Info';
                          if (step === 2) return 'Pricing';
                          return 'Features';
                        })()}
                      </span>
                      {step < 3 && (
                        <div className={`w-8 h-0.5 ${
                          currentStep > step ? 'bg-blue-500' : 'bg-white/20'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* General Error */}
                  {getFieldError('general') && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                    >
                      <div className="flex items-center space-x-2 text-red-400">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm">{getFieldError('general')?.message}</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <label htmlFor="name" className="auth-label">
                          Plan Name *
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g., Starter Plan, Professional"
                          className={`auth-input ${getFieldError('name') ? 'auth-input-error' : ''}`}
                          required
                        />
                        {getFieldError('name') && (
                          <div className="mt-2 flex items-center space-x-2 auth-validation-error text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{getFieldError('name')?.message}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="description" className="auth-label">
                          Description *
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Describe what this plan includes..."
                          rows={3}
                          className={`auth-input resize-none ${getFieldError('description') ? 'auth-input-error' : ''}`}
                          required
                        />
                        {getFieldError('description') && (
                          <div className="mt-2 flex items-center space-x-2 auth-validation-error text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{getFieldError('description')?.message}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="productFamilyId" className="auth-label">
                          Product Family *
                        </label>
                        <select
                          id="productFamilyId"
                          name="productFamilyId"
                          value={formData.productFamilyId}
                          onChange={handleInputChange}
                          className={`auth-input ${getFieldError('productFamilyId') ? 'auth-input-error' : ''}`}
                          required
                        >
                          <option value="">Select a product family</option>
                          {productFamilies.map(family => (
                            <option key={family.id} value={family.id}>
                              {family.name}
                            </option>
                          ))}
                        </select>
                        {getFieldError('productFamilyId') && (
                          <div className="mt-2 flex items-center space-x-2 auth-validation-error text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{getFieldError('productFamilyId')?.message}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="billingPeriod" className="auth-label">
                          Billing Period *
                        </label>
                        <select
                          id="billingPeriod"
                          name="billingPeriod"
                          value={formData.billingPeriod}
                          onChange={handleInputChange}
                          className="auth-input"
                          required
                        >
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="yearly">Yearly</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>

                      {/* Trial Period */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="hasTrialPeriod"
                            checked={!!formData.trialPeriod}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData(prev => ({
                                  ...prev,
                                  trialPeriod: { duration: 14, unit: 'days' }
                                }))
                              } else {
                                setFormData(prev => {
                                  const { trialPeriod: _trialPeriod, ...rest } = prev
                                  return rest
                                })
                              }
                            }}
                            className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                          />
                          <label htmlFor="hasTrialPeriod" className="auth-label !mb-0">
                            Include trial period
                          </label>
                        </div>

                        {formData.trialPeriod && (
                          <div className="grid grid-cols-2 gap-4 ml-7">
                            <div>
                              <label htmlFor="trialPeriod.duration" className="auth-label">
                                Duration
                              </label>
                              <input
                                id="trialPeriod.duration"
                                name="trialPeriod.duration"
                                type="number"
                                min="1"
                                value={formData.trialPeriod.duration}
                                onChange={handleInputChange}
                                className="auth-input"
                              />
                            </div>
                            <div>
                              <label htmlFor="trialPeriod.unit" className="auth-label">
                                Unit
                              </label>
                              <select
                                id="trialPeriod.unit"
                                name="trialPeriod.unit"
                                value={formData.trialPeriod.unit}
                                onChange={handleInputChange}
                                className="auth-input"
                              >
                                <option value="days">Days</option>
                                <option value="weeks">Weeks</option>
                                <option value="months">Months</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Pricing */}
                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold auth-text">Price Points</h3>
                        <button className="btn-secondary">
                          <Plus className="w-4 h-4" />
                          <span>Add Price Point</span>
                        </button>
                      </div>

                      <div className="space-y-4">
                        {formData.pricePoints.map((pricePoint, index) => (
                          <div key={index} className="glass-card p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium auth-text">Price Point {index + 1}</h4>
                              {formData.pricePoints.length > 1 && (
                                <button className="btn-secondary" onClick={() => removePricePoint(index)}>
                                  <Minus className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label htmlFor={`plan-currency-${index}`} className="auth-label">Currency</label>
                                <select
                                  id={`plan-currency-${index}`}
                                  value={pricePoint.currency}
                                  onChange={(e) => handlePricePointChange(index, 'currency', e.target.value)}
                                  className="auth-input"
                                >
                                  <option value="USD">USD</option>
                                  <option value="EUR">EUR</option>
                                  <option value="GBP">GBP</option>
                                  <option value="CAD">CAD</option>
                                </select>
                              </div>
                              
                              <div>
                                <label htmlFor={`plan-price-${index}`} className="auth-label">Price</label>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 auth-icon" />
                                  <input
                                    id={`plan-price-${index}`}
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={pricePoint.price}
                                    onChange={(e) => handlePricePointChange(index, 'price', e.target.value)}
                                    className="auth-input input-with-icon-left"
                                    placeholder="0.00"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label htmlFor={`billing-frequency-${index}`} className="auth-label">Billing Frequency</label>
                                <select
                                  id={`billing-frequency-${index}`}
                                  value={pricePoint.billingFrequency}
                                  onChange={(e) => handlePricePointChange(index, 'billingFrequency', e.target.value)}
                                  className="auth-input"
                                >
                                  <option value="weekly">Weekly</option>
                                  <option value="monthly">Monthly</option>
                                  <option value="quarterly">Quarterly</option>
                                  <option value="semi_annual">Semi-Annual</option>
                                  <option value="yearly">Yearly</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Features */}
                  {currentStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold auth-text">Plan Features</h3>
                        <button className="btn-secondary">
                          <Plus className="w-4 h-4" />
                          <span>Add Feature</span>
                        </button>
                      </div>

                      <div className="space-y-4">
                        {formData.features?.map((feature, index) => (
                          <div key={index} className="glass-card p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium auth-text">Feature {index + 1}</h4>
                              <button className="btn-secondary" onClick={() => removeFeature(index)}>
                                <Minus className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label htmlFor={`feature-name-${index}`} className="auth-label">Feature Name</label>
                                <input
                                  id={`feature-name-${index}`}
                                  type="text"
                                  value={feature.name}
                                  onChange={(e) => handleFeatureChange(index, 'name', e.target.value)}
                                  className="auth-input"
                                  placeholder="e.g., API Access, Support Level"
                                />
                              </div>
                              
                              <div>
                                <label htmlFor={`feature-type-${index}`} className="auth-label">Type</label>
                                <select
                                  id={`feature-type-${index}`}
                                  value={feature.featureType}
                                  onChange={(e) => handleFeatureChange(index, 'featureType', e.target.value)}
                                  className="auth-input"
                                >
                                  <option value="boolean">Yes/No</option>
                                  <option value="quantity">Quantity</option>
                                  <option value="text">Text</option>
                                </select>
                              </div>
                            </div>

                            <div className="mt-4">
                              <label htmlFor={`feature-value-${index}`} className="auth-label">Value</label>
                              {(() => {
                                if (feature.featureType === 'boolean') {
                                  return (
                                    <select
                                      id={`feature-value-${index}`}
                                      value={feature.value ? 'true' : 'false'}
                                      onChange={(e) => handleFeatureChange(index, 'value', e.target.value === 'true')}
                                      className="auth-input"
                                    >
                                      <option value="true">Included</option>
                                      <option value="false">Not Included</option>
                                    </select>
                                  );
                                }
                                
                                if (feature.featureType === 'quantity') {
                                  return (
                                    <input
                                      id={`feature-value-${index}`}
                                      type="number"
                                      min="0"
                                      value={feature.value as number}
                                      onChange={(e) => handleFeatureChange(index, 'value', parseInt(e.target.value) || 0)}
                                      className="auth-input"
                                      placeholder="0"
                                    />
                                  );
                                }
                                
                                return (
                                  <input
                                    id={`feature-value-${index}`}
                                    type="text"
                                    value={feature.value as string}
                                    onChange={(e) => handleFeatureChange(index, 'value', e.target.value)}
                                    className="auth-input"
                                    placeholder="Feature description"
                                  />
                                );
                              })()}
                            </div>
                          </div>
                        ))}

                        {(!formData.features || formData.features.length === 0) && (
                          <div className="text-center py-8 auth-text-muted">
                            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No features added yet</p>
                            <p className="text-sm">Click &quot;Add Feature&quot; to get started</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </form>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-white/10">
                <div className="flex space-x-4">
                  {currentStep > 1 && (
                    <button className="btn-secondary">
                      Previous
                    </button>
                  )}
                </div>
                
                <div className="flex space-x-4">
                  <button className="btn-secondary">
                    Cancel
                  </button>
                  
                  {currentStep < 3 ? (
                    <button className="btn-primary">
                      Next
                    </button>) : (
<button className="btn-primary">
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Creating...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Create Plan</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
