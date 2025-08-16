import { motion, AnimatePresence } from 'framer-motion'
import { X, Ticket, Save, AlertCircle, Calendar, Percent, DollarSign } from 'lucide-react'
import { useState } from 'react'

import type { CreateCouponRequest } from '../types/catalog.types'
import { validateCreateCoupon } from '../utils/catalog.validation'
import type { ValidationError } from '@/shared/utils/validation'

interface CreateCouponModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: CreateCouponRequest) => Promise<void>
}

export const CreateCouponModal = ({
  isOpen,
  onClose,
  onSubmit
}: CreateCouponModalProps) => {
  const [formData, setFormData] = useState<CreateCouponRequest>({
    name: '',
    couponCode: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    durationType: 'one_time',
    validFrom: new Date()
  })
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    let processedValue: string | number | Date = value
    
    if (type === 'number') {
      processedValue = parseFloat(value) || 0
    } else if (type === 'date') {
      processedValue = new Date(value)
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }))

    // Clear field-specific errors
    if (errors.some(error => error.field === name)) {
      setErrors(prev => prev.filter(error => error.field !== name))
    }
  }

  const _generateCouponCode = () => {
    const prefix = formData.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8)
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    const generated = `${prefix}${random}`
    setFormData(prev => ({ ...prev, couponCode: generated }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    const validation = validateCreateCoupon(formData)
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
        couponCode: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        durationType: 'one_time',
        validFrom: new Date()
      })
      setErrors([])
    } catch (error) {
      console.error('Failed to create coupon:', error)
      setErrors([{
        field: 'general',
        message: 'Failed to create coupon. Please try again.',
        code: 'CREATION_FAILED'
      }])
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFieldError = (fieldName: string) => errors.find(error => error.field === fieldName)

  const formatDate = (date: Date) => date.toISOString().split('T')[0]

  const showDuration = formData.durationType === 'limited_period'
  const showValidUntil = formData.durationType !== 'forever'

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
                    <Ticket className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold auth-text">Create Coupon</h2>
                    <p className="text-sm auth-text-muted">Create discount coupons for your customers</p>
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
                      className="p-4 rounded-lg bg-red-500/10 border border-red-500/20"
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
                          Coupon Name *
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g., Black Friday Sale, New Customer Discount"
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
                        <label htmlFor="couponCode" className="auth-label">
                          Coupon Code *
                        </label>
                        <div className="flex space-x-2">
                          <input
                            id="couponCode"
                            name="couponCode"
                            type="text"
                            value={formData.couponCode}
                            onChange={handleInputChange}
                            placeholder="e.g., SAVE20, WELCOME50"
                            className={`auth-input flex-1 ${getFieldError('couponCode') ? 'auth-input-error' : ''}`}
                            required
                          />
                          <button className="btn-secondary">
                            Generate
                          </button>
                        </div>
                        {getFieldError('couponCode') && (
                          <div className="mt-2 flex items-center space-x-2 auth-validation-error text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{getFieldError('couponCode')?.message}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="description" className="auth-label">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Optional description for internal use..."
                          rows={3}
                          className={`auth-input resize-none ${getFieldError('description') ? 'auth-input-error' : ''}`}
                        />
                        {getFieldError('description') && (
                          <div className="mt-2 flex items-center space-x-2 auth-validation-error text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{getFieldError('description')?.message}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold auth-text">Discount Configuration</h3>
                      
                      <div>
                        <label htmlFor="discountType" className="auth-label">
                          Discount Type *
                        </label>
                        <select
                          id="discountType"
                          name="discountType"
                          value={formData.discountType}
                          onChange={handleInputChange}
                          className="auth-input"
                          required
                        >
                          <option value="percentage">Percentage - % off</option>
                          <option value="fixed_amount">Fixed Amount - $ off</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="discountValue" className="auth-label">
                          Discount Value *
                        </label>
                        <div className="relative">
                          {formData.discountType === 'percentage' ? (
                            <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 auth-icon" />
                          ) : (
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 auth-icon" />
                          )}
                          <input
                            id="discountValue"
                            name="discountValue"
                            type="number"
                            min="0"
                            max={formData.discountType === 'percentage' ? 100 : undefined}
                            step={formData.discountType === 'percentage' ? '0.1' : '0.01'}
                            value={formData.discountValue}
                            onChange={handleInputChange}
                            className={`auth-input input-with-icon-left ${getFieldError('discountValue') ? 'auth-input-error' : ''}`}
                            placeholder={formData.discountType === 'percentage' ? '20' : '10.00'}
                            required
                          />
                        </div>
                        {getFieldError('discountValue') && (
                          <div className="mt-2 flex items-center space-x-2 auth-validation-error text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{getFieldError('discountValue')?.message}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="durationType" className="auth-label">
                          Duration Type *
                        </label>
                        <select
                          id="durationType"
                          name="durationType"
                          value={formData.durationType}
                          onChange={handleInputChange}
                          className="auth-input"
                          required
                        >
                          <option value="one_time">One-time use</option>
                          <option value="forever">Valid forever</option>
                          <option value="limited_period">Limited period</option>
                        </select>
                        <p className="text-xs auth-text-muted mt-1">
                          {formData.durationType === 'one_time' && 'Coupon expires after first use'}
                          {formData.durationType === 'forever' && 'Coupon never expires'}
                          {formData.durationType === 'limited_period' && 'Coupon expires after specified time'}
                        </p>
                      </div>

                      {showDuration && (
                        <div>
                          <label htmlFor="duration" className="auth-label">
                            Duration (months) *
                          </label>
                          <input
                            id="duration"
                            name="duration"
                            type="number"
                            min="1"
                            value={formData.duration ?? ''}
                            onChange={handleInputChange}
                            className="auth-input"
                            placeholder="3"
                            required
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Validity & Usage */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold auth-text">Validity Period</h3>
                      
                      <div>
                        <label htmlFor="validFrom" className="auth-label">
                          Valid From *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 auth-icon" />
                          <input
                            id="validFrom"
                            name="validFrom"
                            type="date"
                            value={formatDate(formData.validFrom)}
                            onChange={handleInputChange}
                            className={`auth-input input-with-icon-left ${getFieldError('validFrom') ? 'auth-input-error' : ''}`}
                            required
                          />
                        </div>
                        {getFieldError('validFrom') && (
                          <div className="mt-2 flex items-center space-x-2 auth-validation-error text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{getFieldError('validFrom')?.message}</span>
                          </div>
                        )}
                      </div>

                      {showValidUntil && (
                        <div>
                          <label htmlFor="validUntil" className="auth-label">
                            Valid Until {formData.durationType === 'limited_period' ? '*' : '(Optional)'}
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 auth-icon" />
                            <input
                              id="validUntil"
                              name="validUntil"
                              type="date"
                              value={formData.validUntil ? formatDate(formData.validUntil) : ''}
                              onChange={handleInputChange}
                              className={`auth-input input-with-icon-left ${getFieldError('validUntil') ? 'auth-input-error' : ''}`}
                              required={formData.durationType === 'limited_period'}
                            />
                          </div>
                          {getFieldError('validUntil') && (
                            <div className="mt-2 flex items-center space-x-2 auth-validation-error text-sm">
                              <AlertCircle className="w-4 h-4" />
                              <span>{getFieldError('validUntil')?.message}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold auth-text">Usage Limits</h3>
                      
                      <div>
                        <label htmlFor="maxRedemptions" className="auth-label">
                          Maximum Redemptions (Optional)
                        </label>
                        <input
                          id="maxRedemptions"
                          name="maxRedemptions"
                          type="number"
                          min="1"
                          value={formData.maxRedemptions ?? ''}
                          onChange={handleInputChange}
                          className="auth-input"
                          placeholder="Leave empty for unlimited"
                        />
                        <p className="text-xs auth-text-muted mt-1">
                          Total number of times this coupon can be used
                        </p>
                      </div>
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
                      <span>Create Coupon</span>
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
