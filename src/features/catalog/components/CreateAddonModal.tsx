import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, Save, AlertCircle, Plus, Minus, DollarSign } from 'lucide-react'
import { useState } from 'react'

import type { CreateAddonRequest, PricePoint, PricingModel } from '../types/catalog.types'
import { validateCreateAddon } from '../utils/catalog.validation'
import type { ValidationError } from '@/shared/utils/validation'

interface CreateAddonModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: CreateAddonRequest) => Promise<void>
}

export const CreateAddonModal = ({
  isOpen,
  onClose,
  onSubmit
}: CreateAddonModalProps) => {
  const [formData, setFormData] = useState<CreateAddonRequest>({
    name: '',
    description: '',
    productFamilyId: '',
    type: 'recurring',
    chargeModel: 'flat_fee',
    pricePoints: [
      {
        currency: 'USD',
        price: 0,
        billingFrequency: 'monthly',
        pricingModel: 'flat_fee',
        showInCheckout: true,
        showInPortal: true
      }
    ]
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear field-specific errors
    if (errors.some(error => error.field === name)) {
      setErrors(prev => prev.filter(error => error.field !== name))
    }
  }

  const handlePricePointChange = (index: number, field: keyof PricePoint, value: string | number) => {
    const newPricePoints = [...formData.pricePoints]
    newPricePoints[index] = {
      ...newPricePoints[index],
      [field]: field === 'price' || field === 'unitPrice' ? parseFloat(value as string) || 0 : value
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
          pricingModel: formData.chargeModel as PricingModel,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    const validation = validateCreateAddon(formData)
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
        type: 'recurring',
        chargeModel: 'flat_fee',
        pricePoints: [{ 
          currency: 'USD', 
          price: 0, 
          billingFrequency: 'monthly',
          pricingModel: 'flat_fee',
          showInCheckout: true,
          showInPortal: true
        }]
      })
      setErrors([])
    } catch (error) {
      console.error('Failed to create addon:', error)
      setErrors([{
        field: 'general',
        message: 'Failed to create add-on. Please try again.',
        code: 'CREATION_FAILED'
      }])
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFieldError = (fieldName: string) => errors.find(error => error.field === fieldName)

  const getChargeModelOptions = () => {
    switch (formData.type) {
      case 'recurring':
        return [
          { value: 'flat_fee', label: 'Flat Fee' },
          { value: 'per_unit', label: 'Per Unit' },
          { value: 'tiered', label: 'Tiered Pricing' },
          { value: 'volume', label: 'Volume Pricing' }
        ]
      case 'one_time':
        return [
          { value: 'flat_fee', label: 'Flat Fee' },
          { value: 'per_unit', label: 'Per Unit' }
        ]
      case 'usage_based':
        return [
          { value: 'per_unit', label: 'Per Unit' },
          { value: 'tiered', label: 'Tiered Pricing' },
          { value: 'volume', label: 'Volume Pricing' },
          { value: 'stairstep', label: 'Stairstep Pricing' }
        ]
      default:
        return [{ value: 'flat_fee', label: 'Flat Fee' }]
    }
  }

  const showBillingFrequency = formData.type !== 'one_time'

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
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <Zap className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold auth-text">Create Add-on</h2>
                    <p className="text-sm auth-text-muted">Add additional services and features</p>
                  </div>
                </div>
                <button className="btn-secondary">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
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

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold auth-text">Basic Information</h3>
                      
                      <div>
                        <label htmlFor="name" className="auth-label">
                          Add-on Name *
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g., Advanced Analytics, Priority Support"
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
                          placeholder="Describe what this add-on provides..."
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
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold auth-text">Add-on Configuration</h3>
                      
                      <div>
                        <label htmlFor="type" className="auth-label">
                          Add-on Type *
                        </label>
                        <select
                          id="type"
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          className="auth-input"
                          required
                        >
                          <option value="recurring">Recurring - Charged regularly</option>
                          <option value="one_time">One-time - Single charge</option>
                          <option value="usage_based">Usage-based - Based on consumption</option>
                        </select>
                        <p className="text-xs auth-text-muted mt-1">
                          {formData.type === 'recurring' && 'Charged on a regular billing cycle'}
                          {formData.type === 'one_time' && 'Charged once when added to subscription'}
                          {formData.type === 'usage_based' && 'Charged based on usage or consumption'}
                        </p>
                      </div>

                      <div>
                        <label htmlFor="chargeModel" className="auth-label">
                          Charge Model *
                        </label>
                        <select
                          id="chargeModel"
                          name="chargeModel"
                          value={formData.chargeModel}
                          onChange={handleInputChange}
                          className="auth-input"
                          required
                        >
                          {getChargeModelOptions().map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs auth-text-muted mt-1">
                          How the pricing is calculated for this add-on
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold auth-text">Pricing</h3>
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
                          
                          <div className={`grid gap-4 ${showBillingFrequency ? 'grid-cols-3' : 'grid-cols-2'}`}>
                            <div>
                              <label htmlFor={`currency-${index}`} className="auth-label">Currency</label>
                              <select
                                id={`currency-${index}`}
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
                              <label htmlFor={`price-${index}`} className="auth-label">
                                {formData.chargeModel === 'per_unit' ? 'Price per Unit' : 'Price'}
                              </label>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 auth-icon" />
                                <input
                                  id={`price-${index}`}
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={pricePoint.price ?? ''}
                                  onChange={(e) => handlePricePointChange(index, 'price', e.target.value)}
                                  className="auth-input input-with-icon-left"
                                  placeholder="0.00"
                                />
                              </div>
                            </div>
                            
                            {showBillingFrequency && (
                              <div>
                                <label htmlFor={`billingFrequency-${index}`} className="auth-label">Billing Frequency</label>
                                <select
                                  id={`billingFrequency-${index}`}
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
                            )}
                          </div>

                          {/* Additional fields for specific charge models */}
                          {formData.chargeModel === 'per_unit' && (
                            <div className="mt-4 grid grid-cols-2 gap-4">
                              <div>
                                <label htmlFor={`setupFee-${index}`} className="auth-label">Setup Fee (Optional)</label>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 auth-icon" />
                                  <input
                                    id={`setupFee-${index}`}
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={pricePoint.setupFee ?? ''}
                                    onChange={(e) => handlePricePointChange(index, 'setupFee', e.target.value)}
                                    className="auth-input input-with-icon-left"
                                    placeholder="0.00"
                                  />
                                </div>
                              </div>
                              <div>
                                <label htmlFor="addon-description" className="auth-label">Free Quantity (Optional)</label>
                                <input
                                  id="addon-description"
                                  type="number"
                                  min="0"
                                  value={pricePoint.freeQuantity ?? ''}
                                  onChange={(e) => handlePricePointChange(index, 'freeQuantity', e.target.value)}
                                  className="auth-input"
                                  placeholder="0"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-4 p-6 border-t border-white/10">
                <button className="btn-secondary">
                  Cancel
                </button>
                <button className="btn-primary">
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Create Add-on</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
