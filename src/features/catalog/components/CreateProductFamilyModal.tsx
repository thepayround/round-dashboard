import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save } from 'lucide-react'

import { Modal, Button, FormInput } from '@/shared/components'
import type { CreateProductFamilyRequest } from '../types/catalog.types'
import { validateCreateProductFamily } from '../utils/catalog.validation'
import type { ValidationError } from '@/shared/utils/validation'

interface CreateProductFamilyModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: CreateProductFamilyRequest) => Promise<void>
}

export const CreateProductFamilyModal = ({
  isOpen,
  onClose,
  onSubmit
}: CreateProductFamilyModalProps) => {
  const [formData, setFormData] = useState<CreateProductFamilyRequest>({
    name: '',
    description: '',
    category: '',
    settings: {
      allowCustomPricing: false,
      requireApproval: false,
      defaultCurrency: 'USD'
    }
  })
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (name.startsWith('settings.')) {
      const [, settingKey] = name.split('.')
      setFormData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          [settingKey]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }

    // Clear errors for this field
    if (errors.length > 0) {
      setErrors(prev => prev.filter(error => error.field !== name))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const validationResult = validateCreateProductFamily(formData)
    if (!validationResult.isValid) {
      setErrors(validationResult.errors || [])
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit?.(formData)
      onClose()
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        settings: {
          allowCustomPricing: false,
          requireApproval: false,
          defaultCurrency: 'USD'
        }
      })
      setErrors([])
    } catch (error) {
      console.error('Failed to create product family:', error)
      setErrors([{
        field: 'general',
        message: 'Failed to create product family. Please try again.',
        code: 'SUBMISSION_ERROR'
      }])
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFieldError = (fieldName: string) => errors.find(error => error.field === fieldName)?.message

  const generalError = errors.find(error => error.field === 'general')?.message

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Product Family"
      subtitle="Organize your products with a new family structure"
      size="lg"
    >
      <div className="relative">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Error */}
          {generalError && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm"
            >
              {generalError}
            </motion.div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium tracking-tight text-white mb-4">Basic Information</h3>
            
            <FormInput
              label="Product Family Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Core Platform, Analytics Suite"
              error={getFieldError('name')}
              required
            />

            <FormInput
              label="Description"
              inputType="textarea"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe what this product family includes..."
              rows={3}
              error={getFieldError('description')}
              required
            />

            <FormInput
              label="Category"
              inputType="select"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              error={getFieldError('category')}
              options={[
                { value: '', label: 'Select a category' },
                { value: 'SaaS Platform', label: 'SaaS Platform' },
                { value: 'Analytics', label: 'Analytics' },
                { value: 'Enterprise', label: 'Enterprise' },
                { value: 'API Services', label: 'API Services' },
                { value: 'Add-ons', label: 'Add-ons' },
                { value: 'Professional Services', label: 'Professional Services' }
              ]}
              required
            />
          </div>

          {/* Settings */}
          <div className="space-y-4 pt-6 border-t border-[#25262a]">
            <h3 className="text-lg font-medium tracking-tight text-white mb-4">Settings</h3>
            
            <FormInput
              label="Default Currency"
              inputType="select"
              name="settings.defaultCurrency"
              value={formData.settings?.defaultCurrency ?? 'USD'}
              onChange={handleInputChange}
              options={[
                { value: 'USD', label: 'USD - US Dollar' },
                { value: 'EUR', label: 'EUR - Euro' },
                { value: 'GBP', label: 'GBP - British Pound' },
                { value: 'CAD', label: 'CAD - Canadian Dollar' },
                { value: 'AUD', label: 'AUD - Australian Dollar' }
              ]}
            />

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="allowCustomPricing"
                  name="settings.allowCustomPricing"
                  checked={formData.settings?.allowCustomPricing ?? false}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-[#D417C8] bg-[#171719] border-white/20 rounded 
                           focus:ring-[#D417C8] focus:ring-2"
                />
                <div>
                  <label htmlFor="allowCustomPricing" className="text-white font-medium">
                    Allow custom pricing
                  </label>
                  <p className="text-gray-400 text-sm">
                    Enable flexible pricing for different customer segments
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="requireApproval"
                  name="settings.requireApproval"
                  checked={formData.settings?.requireApproval ?? false}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-[#D417C8] bg-[#171719] border-white/20 rounded 
                           focus:ring-[#D417C8] focus:ring-2"
                />
                <div>
                  <label htmlFor="requireApproval" className="text-white font-medium">
                    Require approval
                  </label>
                  <p className="text-gray-400 text-sm">
                    Add review workflow for new products
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-[#25262a]">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              icon={Save}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Create Product Family
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
