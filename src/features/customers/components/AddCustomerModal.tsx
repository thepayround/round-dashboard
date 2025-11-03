import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Building2, MapPin, Globe, Settings, Tag, Save, Loader2, Hash, Truck, Languages, AlertCircle } from 'lucide-react'
import React, { useState } from 'react'

import { PhoneInput } from '@/shared/components'
import { ApiDropdown, countryDropdownConfig, currencyDropdownConfig, timezoneDropdownConfig } from '@/shared/components/ui/ApiDropdown'
import { languageDropdownConfig } from '@/shared/components/ui/ApiDropdown/configs'
import { FormInput } from '@/shared/components/ui/FormInput'
import { useGlobalToast } from '@/shared/contexts/ToastContext'
import type { CustomerCreateRequest } from '@/shared/services/api/customer.service'
import { customerService } from '@/shared/services/api/customer.service'
import type { CountryPhoneInfo } from '@/shared/services/api/phoneValidation.service'
import { phoneValidationService } from '@/shared/services/api/phoneValidation.service'
import { CustomerType } from '@/shared/types/customer.types'
import { phoneValidator } from '@/shared/utils/phoneValidation'
import type { ValidationError } from '@/shared/utils/validation'

interface AddCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  onCustomerAdded: () => void
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  onCustomerAdded
}) => {
  const { showSuccess, showError } = useGlobalToast()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<ValidationError[]>([])
  
  // Helper functions for error handling (matching registration pattern)
  const hasFieldError = (field: string) => errors.some(error => error.field === field)

  const getFieldError = (field: string) => {
    const error = errors.find(error => error.field === field)
    return error?.message ?? ''
  }

  // Form validation helper (matching registration pattern)
  const isFormValid = () => {
    // Check if all required fields are filled
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim()
    ) {
      return false
    }

    // Business customers must have a company name
    if (formData.type === CustomerType.Business && !formData.company?.trim()) {
      return false
    }

    // Simple phone check - use client-side validation (same as registration)
    if (formData.phoneNumber?.trim() && !phoneValidator.hasMinimumContent(formData.phoneNumber)) {
      return false
    }

    // Check if there are any validation errors from other fields
    const nonPhoneErrors = errors.filter(error => error.field !== 'phoneNumber')
    if (nonPhoneErrors.length > 0) {
      return false
    }

    return true
  }
  
  const [formData, setFormData] = useState<CustomerCreateRequest>({
    type: CustomerType.Individual, // Default to Individual
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    phoneNumber: '',
    countryPhoneCode: '',
    taxNumber: '',
    locale: 'en',
    timezone: '',
    currency: '',
    portalAccess: true,
    autoCollection: true,
    tags: [],
    customFields: {},
    billingAddress: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    shippingAddress: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  })

  const [currentTag, setCurrentTag] = useState('')
  const [sameAsBinding, setSameAsBinding] = useState(true)

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear field error when user starts typing (matching registration pattern)
    if (hasFieldError(field)) {
      setErrors(prev => prev.filter(error => error.field !== field))
    }
  }

  const handleAddressChange = (addressType: 'billingAddress' | 'shippingAddress', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [addressType]: {
        ...prev[addressType],
        [field]: value
      }
    }))

    // If same as billing is checked, update shipping address too
    if (addressType === 'billingAddress' && sameAsBinding) {
      setFormData(prev => ({
        ...prev,
        shippingAddress: {
          line1: field === 'line1' ? value : prev.billingAddress?.line1 ?? '',
          line2: field === 'line2' ? value : prev.billingAddress?.line2 ?? '',
          city: field === 'city' ? value : prev.billingAddress?.city ?? '',
          state: field === 'state' ? value : prev.billingAddress?.state ?? '',
          country: field === 'country' ? value : prev.billingAddress?.country ?? '',
          zipCode: field === 'zipCode' ? value : prev.billingAddress?.zipCode ?? ''
        }
      }))
    }
  }

  const handleAddTag = () => {
    if (currentTag.trim() && !(formData.tags ?? []).includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags ?? []), currentTag.trim()]
      }))
      setCurrentTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags ?? []).filter(tag => tag !== tagToRemove)
    }))
  }

  const handlePhoneChange = (phoneNumber: string) => {
    setFormData(prev => ({ ...prev, phoneNumber }))
    
    // Clear phone error when user starts typing (same as registration pattern)
    if (hasFieldError('phoneNumber')) {
      setErrors(prev => prev.filter(error => error.field !== 'phoneNumber'))
    }
  }

  const handlePhoneBlur = async (phoneNumber: string, countryInfo: CountryPhoneInfo | null) => {
    // Store the country phone code for backend submission
    if (countryInfo?.phoneCode) {
      setFormData(prev => ({ ...prev, countryPhoneCode: countryInfo.phoneCode }))
    }

    // Validate phone when user leaves the field (same pattern as registration)
    if (!phoneNumber?.trim()) {
      return // Don't validate empty fields on blur
    }

    try {
      // Use the provided phone number and country info
      const countryCode = countryInfo?.countryCode ?? 'GR'

      // Call backend API for validation using proper service (consistent with platform pattern)
      const result = await phoneValidationService.validatePhoneNumber({
        phoneNumber: phoneNumber.trim(),
        countryCode
      })
      
      if (!result.isValid && result.error) {
        setErrors(prev => [
          ...prev.filter(error => error.field !== 'phoneNumber'),
          { field: 'phoneNumber', message: result.error ?? 'Phone number is invalid', code: 'INVALID_PHONE' }
        ])
      }
    } catch (error) {
      console.error('Phone validation failed:', error)
      // Don't show error for network issues, just log them
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Final validation check before submission (matching registration pattern)
    if (!isFormValid()) {
      showError('Please fill in all required fields correctly')
      setLoading(false)
      return
    }

    // Check for any existing validation errors
    if (errors.length > 0) {
      showError('Please fix the validation errors before submitting')
      setLoading(false)
      return
    }

    try {
      
      // Clean up the data before sending to API - using camelCase as configured in backend
      const cleanCustomerData: CustomerCreateRequest = {
        type: formData.type,
        email: formData.email.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        company: formData.company?.trim() ?? undefined,
        phoneNumber: formData.phoneNumber?.trim() ?? undefined,
        countryPhoneCode: formData.countryPhoneCode ?? undefined,
        taxNumber: formData.taxNumber?.trim() ?? undefined,
        locale: formData.locale ?? 'en-US',
        timezone: formData.timezone ?? 'UTC',
        currency: formData.currency ?? 'USD',
        portalAccess: formData.portalAccess,
        autoCollection: formData.autoCollection,
        tags: formData.tags && formData.tags.length > 0 ? formData.tags : [],
        customFields: formData.customFields ?? {},
      }

      // Only add addresses if they have all required fields
      // Transform billing address to backend format if present
      if (formData.billingAddress?.line1?.trim() && 
          formData.billingAddress.city?.trim() && 
          formData.billingAddress.country?.trim() && 
          formData.billingAddress.zipCode?.trim()) {
        cleanCustomerData.billingAddress = {
          type: 'billing',
          isPrimary: true,
          name: 'Billing Address',
          line1: formData.billingAddress.line1.trim(),
          line2: formData.billingAddress.line2?.trim() ?? undefined,
          number: '1', // Required field for backend
          city: formData.billingAddress.city.trim(),
          state: formData.billingAddress.state?.trim() ?? undefined,
          country: formData.billingAddress.country.trim(),
          zipCode: formData.billingAddress.zipCode.trim(),
        }

        // Transform shipping address to backend format if present
        if (sameAsBinding) {
          // Copy billing address for shipping
          cleanCustomerData.shippingAddress = {
            ...cleanCustomerData.billingAddress,
            type: 'shipping',
            isPrimary: false,
            name: 'Shipping Address',
          }
        }
      }

      // Add separate shipping address if not same as billing
      if (!sameAsBinding && formData.shippingAddress?.line1?.trim() && 
          formData.shippingAddress.city?.trim() && 
          formData.shippingAddress.country?.trim() && 
          formData.shippingAddress.zipCode?.trim()) {
        cleanCustomerData.shippingAddress = {
          type: 'shipping',
          isPrimary: false,
          name: 'Shipping Address',
          line1: formData.shippingAddress.line1.trim(),
          line2: formData.shippingAddress.line2?.trim() ?? undefined,
          number: '1', // Required field for backend
          city: formData.shippingAddress.city.trim(),
          state: formData.shippingAddress.state?.trim() ?? undefined,
          country: formData.shippingAddress.country.trim(),
          zipCode: formData.shippingAddress.zipCode.trim(),
        }
      }

      await customerService.create(cleanCustomerData)
      showSuccess('Customer created successfully')
      onCustomerAdded()
      onClose()
      
      // Reset form
      setFormData({
        type: CustomerType.Individual, // Reset to Individual
        email: '',
        firstName: '',
        lastName: '',
        company: '',
        phoneNumber: '',
        countryPhoneCode: '',
        taxNumber: '',
        locale: 'en',
        timezone: '',
        currency: '',
        portalAccess: true,
        autoCollection: true,
        tags: [],
        customFields: {},
        billingAddress: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        shippingAddress: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      })
    } catch (error) {
      if (error instanceof Error) {
        showError(`Failed to create customer: ${error.message}`)
      } else if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } }
        if (apiError.response?.data?.message) {
          showError(`Failed to create customer: ${apiError.response.data.message}`)
        } else {
          showError('Failed to create customer: API Error')
        }
      } else {
        showError('Failed to create customer: Unknown error')
      }
    } finally {
      setLoading(false)
    }
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
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            <div className="bg-[#101011] border border-[#333333] rounded-lg shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#333333]">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium tracking-tight text-white">Add New Customer</h2>
                    <p className="text-sm text-white/70">Create a new customer profile</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium tracking-tight text-white flex items-center space-x-2">
                    <User className="w-5 h-5 text-[#D417C8]" />
                    <span>Basic Information</span>
                  </h3>
                  
                  {/* Customer Type Selection */}
                  <div className="space-y-3">
                    <span className="auth-label block">Customer Type</span>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: CustomerType.Individual }))}
                        className={`p-4 rounded-xl border transition-all duration-200 flex items-center space-x-3 ${
                          formData.type === CustomerType.Individual
                            ? 'border-[#D417C8] bg-[#D417C8]/10 text-white'
                            : 'border-white/20 hover:border-white/40 text-white/70 hover:text-white'
                        }`}
                      >
                        <User className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-medium">Individual</div>
                          <div className="text-sm opacity-75">Personal customer</div>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: CustomerType.Business }))}
                        className={`p-4 rounded-xl border transition-all duration-200 flex items-center space-x-3 ${
                          formData.type === CustomerType.Business
                            ? 'border-[#14BDEA] bg-[#14BDEA]/10 text-white'
                            : 'border-white/20 hover:border-white/40 text-white/70 hover:text-white'
                        }`}
                      >
                        <Building2 className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-medium">Business</div>
                          <div className="text-sm opacity-75">Company customer</div>
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  {/* Name and Email Row - Symmetric 3-column */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="firstName" className="auth-label">
                        First Name <span className="text-[#D417C8]">*</span>
                      </label>
                      <div className="input-container">
                        <User className="input-icon-left auth-icon-primary" />
                        <input
                          id="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="John"
                          className="auth-input input-with-icon-left"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="auth-label">
                        Last Name <span className="text-[#D417C8]">*</span>
                      </label>
                      <div className="input-container">
                        <User className="input-icon-left auth-icon-primary" />
                        <input
                          id="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Doe"
                          className="auth-input input-with-icon-left"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="auth-label">
                        Email Address <span className="text-[#D417C8]">*</span>
                      </label>
                      <div className="input-container">
                        <Mail className="input-icon-left auth-icon-primary" />
                        <input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="john@example.com"
                          className="auth-input input-with-icon-left"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Phone, Company, Tax Number Row - Symmetric 3-column */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <PhoneInput
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handlePhoneChange}
                        onBlur={handlePhoneBlur}
                        validateOnBlur={false}
                        label="Phone Number"
                        placeholder="Phone number"
                        defaultCountry="US"
                        showValidation={false}
                        error={hasFieldError('phoneNumber') ? getFieldError('phoneNumber') : undefined}
                      />
                      <AnimatePresence>
                        {hasFieldError('phoneNumber') && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 flex items-center space-x-2 auth-validation-error text-sm"
                          >
                            <AlertCircle className="w-4 h-4" />
                            <span>{getFieldError('phoneNumber')}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    {/* Company field - only for business customers */}
                    {formData.type === CustomerType.Business && (
                      <div>
                        <label htmlFor="company" className="auth-label">
                          Company <span className="text-[#D417C8]">*</span>
                        </label>
                        <div className="input-container">
                          <Building2 className="input-icon-left auth-icon-primary" />
                          <input
                            id="company"
                            type="text"
                            value={formData.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            placeholder="Acme Corporation"
                            className="auth-input input-with-icon-left"
                            required={formData.type === CustomerType.Business}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Tax Number field - only for business customers */}
                    {formData.type === CustomerType.Business && (
                      <div>
                        <label htmlFor="taxNumber" className="auth-label">
                          Tax Number
                        </label>
                        <div className="input-container">
                          <Hash className="input-icon-left auth-icon-primary" />
                          <input
                            id="taxNumber"
                            type="text"
                            value={formData.taxNumber}
                            onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                            placeholder="Enter tax number"
                            className="auth-input input-with-icon-left"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preferences */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium tracking-tight text-white flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-[#14BDEA]" />
                    <span>Preferences</span>
                  </h3>
                  
                  {/* Symmetric 3-column layout */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="space-y-2">
                        <span className="auth-label">Currency</span>
                        <ApiDropdown
                          config={currencyDropdownConfig}
                          value={formData.currency}
                          onSelect={(value) => handleInputChange('currency', value)}
                          allowClear
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="space-y-2">
                        <span className="auth-label flex items-center space-x-2">
                          <Languages className="w-4 h-4" />
                          <span>Language</span>
                        </span>
                        <ApiDropdown
                          config={languageDropdownConfig}
                          value={formData.locale}
                          onSelect={(value) => handleInputChange('locale', value)}
                          allowClear
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="space-y-2">
                        <span className="auth-label">Timezone</span>
                        <ApiDropdown
                          config={timezoneDropdownConfig}
                          value={formData.timezone}
                          onSelect={(value) => handleInputChange('timezone', value)}
                          allowClear
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium tracking-tight text-white flex items-center space-x-2">
                    <Tag className="w-5 h-5 text-[#7767DA]" />
                    <span>Tags</span>
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(formData.tags ?? []).map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#7767DA]/20 text-[#7767DA] border border-[#7767DA]/30 rounded-full text-sm flex items-center space-x-2"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-[#7767DA]/70 hover:text-[#7767DA]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#7767DA]/50 focus:border-[#7767DA]/50 transition-all duration-200"
                      placeholder="Add a tag..."
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-3 bg-[#7767DA]/20 text-[#7767DA] border border-[#7767DA]/30 rounded-lg hover:bg-[#7767DA]/30 transition-all duration-200"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Billing Address */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium tracking-tight text-white flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-[#42E695]" />
                    <span>Billing Address</span>
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Address Lines - Symmetric 2-column */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <FormInput
                          label="Address Line 1"
                          value={formData.billingAddress?.line1 ?? ''}
                          onChange={(e) => handleAddressChange('billingAddress', 'line1', e.target.value)}
                          placeholder="123 Main Street, Suite 100"
                          leftIcon={MapPin}
                        />
                      </div>
                      
                      <div>
                        <FormInput
                          label="Address Line 2"
                          value={formData.billingAddress?.line2 ?? ''}
                          onChange={(e) => handleAddressChange('billingAddress', 'line2', e.target.value)}
                          placeholder="Apartment, floor, etc. (optional)"
                          leftIcon={MapPin}
                        />
                      </div>
                    </div>
                    
                    {/* City, State, ZIP, Country - Symmetric 4-column */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <FormInput
                          label="City"
                          value={formData.billingAddress?.city ?? ''}
                          onChange={(e) => handleAddressChange('billingAddress', 'city', e.target.value)}
                          placeholder="San Francisco"
                        />
                      </div>
                      
                      <div>
                        <FormInput
                          label="State / Province"
                          value={formData.billingAddress?.state ?? ''}
                          onChange={(e) => handleAddressChange('billingAddress', 'state', e.target.value)}
                          placeholder="CA"
                        />
                      </div>
                      
                      <div>
                        <FormInput
                          label="ZIP / Postal"
                          value={formData.billingAddress?.zipCode ?? ''}
                          onChange={(e) => handleAddressChange('billingAddress', 'zipCode', e.target.value)}
                          placeholder="94102"
                          leftIcon={Hash}
                        />
                      </div>
                      
                      <div>
                        <div className="space-y-2">
                          <span className="auth-label">Country</span>
                          <ApiDropdown
                            config={countryDropdownConfig}
                            value={formData.billingAddress?.country ?? ''}
                            onSelect={(value) => handleAddressChange('billingAddress', 'country', value)}
                            allowClear
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Address Section */}
                <div className="space-y-4">
                  {/* Header with Toggle */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium tracking-tight text-white flex items-center space-x-2">
                      <Truck className="w-5 h-5 text-[#00BCD4]" />
                      <span>Shipping Address</span>
                    </h3>
                    
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <span className="text-sm text-white/70">Same as billing</span>
                      <div className="relative inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={sameAsBinding}
                          onChange={(e) => setSameAsBinding(e.target.checked)}
                          className="sr-only peer"
                          aria-label="Use Billing as Shipping Address"
                        />
                        <div className="relative w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00BCD4]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00BCD4]" />
                      </div>
                    </label>
                  </div>
                  
                  {/* Address Fields or Same as Billing Message */}
                  {sameAsBinding ? (
                    <div className="p-4 bg-[#00BCD4]/10 border border-[#00BCD4]/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[#00BCD4]/20 flex items-center justify-center">
                          <Truck className="w-4 h-4 text-[#00BCD4]" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">Shipping address will be same as billing address</p>
                          <p className="text-white/60 text-xs">Turn off the toggle above to enter a different shipping address</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    
                    <div className="space-y-4">
                      {/* Address Lines - Symmetric 2-column */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <FormInput
                            label="Address Line 1"
                            value={formData.shippingAddress?.line1 ?? ''}
                            onChange={(e) => handleAddressChange('shippingAddress', 'line1', e.target.value)}
                            placeholder="123 Main Street, Suite 100"
                            leftIcon={MapPin}
                          />
                        </div>
                        
                        <div>
                          <FormInput
                            label="Address Line 2"
                            value={formData.shippingAddress?.line2 ?? ''}
                            onChange={(e) => handleAddressChange('shippingAddress', 'line2', e.target.value)}
                            placeholder="Apartment, floor, etc. (optional)"
                            leftIcon={MapPin}
                          />
                        </div>
                      </div>
                      
                      {/* City, State, ZIP, Country - Symmetric 4-column */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <FormInput
                            label="City"
                            value={formData.shippingAddress?.city ?? ''}
                            onChange={(e) => handleAddressChange('shippingAddress', 'city', e.target.value)}
                            placeholder="San Francisco"
                          />
                        </div>
                        
                        <div>
                          <FormInput
                            label="State/Province"
                            value={formData.shippingAddress?.state ?? ''}
                            onChange={(e) => handleAddressChange('shippingAddress', 'state', e.target.value)}
                            placeholder="CA"
                          />
                        </div>
                        
                        <div>
                          <FormInput
                            label="ZIP/Postal"
                            value={formData.shippingAddress?.zipCode ?? ''}
                            onChange={(e) => handleAddressChange('shippingAddress', 'zipCode', e.target.value)}
                            placeholder="94105"
                          />
                        </div>
                        
                        <div>
                          <div className="space-y-2">
                            <span className="auth-label">Country</span>
                            <ApiDropdown
                              config={countryDropdownConfig}
                              value={formData.shippingAddress?.country ?? ''}
                              onSelect={(value) => handleAddressChange('shippingAddress', 'country', value)}
                              allowClear
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Customer Settings */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium tracking-tight text-white flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-[#FFC107]" />
                    <span>Customer Settings</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {/* Portal Access Setting */}
                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/8 transition-all duration-200">
                      <label htmlFor="portalAccess" className="flex items-center space-x-3 cursor-pointer flex-1">
                        <div className="w-10 h-10 rounded-lg bg-[#42E695]/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-[#42E695]" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">Customer Portal Access</h4>
                          <p className="text-white/60 text-sm" id="portal-access-description">Allow customer to access their portal dashboard</p>
                        </div>
                      </label>
                      <div className="relative inline-flex items-center">
                        <input
                          id="portalAccess"
                          type="checkbox"
                          checked={formData.portalAccess}
                          onChange={(e) => handleInputChange('portalAccess', e.target.checked)}
                          className="sr-only peer"
                          aria-describedby="portal-access-description"
                        />
                        <div className="relative w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#42E695]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#42E695]" />
                      </div>
                    </div>

                    {/* Auto Collection Setting */}
                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/8 transition-all duration-200">
                      <label htmlFor="autoCollection" className="flex items-center space-x-3 cursor-pointer flex-1">
                        <div className="w-10 h-10 rounded-lg bg-[#14BDEA]/20 flex items-center justify-center">
                          <Settings className="w-5 h-5 text-[#14BDEA]" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">Automatic Payment Collection</h4>
                          <p className="text-white/60 text-sm" id="auto-collection-description">Automatically collect payments when invoices are due</p>
                        </div>
                      </label>
                      <div className="relative inline-flex items-center">
                        <input
                          id="autoCollection"
                          type="checkbox"
                          checked={formData.autoCollection}
                          onChange={(e) => handleInputChange('autoCollection', e.target.checked)}
                          className="sr-only peer"
                          aria-describedby="auto-collection-description"
                        />
                        <div className="relative w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#14BDEA]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#14BDEA]" />
                      </div>
                    </div>
                  </div>
                </div>
              </form>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Create Customer</span>
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
