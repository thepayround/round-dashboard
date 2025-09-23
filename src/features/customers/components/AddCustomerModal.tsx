import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Building2, MapPin, Globe, Settings, Tag, Save, Loader2, Hash, Truck, Languages } from 'lucide-react'
import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { customerService } from '@/shared/services/api/customer.service'
import type { CustomerCreateRequest } from '@/shared/services/api/customer.service'
import { PhoneInput } from '@/shared/components'
import { FormInput } from '@/shared/components/ui/FormInput'
import { ApiDropdown, countryDropdownConfig, currencyDropdownConfig, timezoneDropdownConfig } from '@/shared/components/ui/ApiDropdown'
import { languageDropdownConfig } from '@/shared/components/ui/ApiDropdown/configs'
import type { CountryPhoneInfo } from '@/shared/services/api/phoneValidation.service'
import { phoneValidationService } from '@/shared/services/api/phoneValidation.service'

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
  
  const [formData, setFormData] = useState<CustomerCreateRequest>({
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
  }

  const handlePhoneBlur = async (cleanPhoneNumber: string, countryInfo: CountryPhoneInfo | null) => {
    // Store the country phone code for backend submission
    if (countryInfo?.phoneCode) {
      setFormData(prev => ({ ...prev, countryPhoneCode: countryInfo.phoneCode }))
    }

    // Validate phone when user leaves the field if needed
    if (!cleanPhoneNumber?.trim()) {
      return // Don't validate empty fields on blur
    }

    try {
      // Use the provided clean phone number and country info
      const countryCode = countryInfo?.countryCode ?? 'US'

      // Call backend API for validation using the proper service pattern
      const result = await phoneValidationService.validatePhoneNumber({
        phoneNumber: cleanPhoneNumber,
        countryCode
      })
      
      if (!result.isValid && result.error) {
        showError(`Phone validation: ${result.error}`)
      }
    } catch (error) {
      // Don't show error for network issues, just log them
      console.error('Phone validation error:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.firstName || !formData.lastName) {
      showError('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      
      // Clean up the data before sending to API - using camelCase as configured in backend
      const cleanCustomerData: CustomerCreateRequest = {
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
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D417C8] to-[#14BDEA] flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Add New Customer</h2>
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
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <User className="w-5 h-5 text-[#D417C8]" />
                    <span>Basic Information</span>
                  </h3>
                  
                  {/* Name and Email Row - Symmetric 3-column */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="firstName" className="auth-label">
                        First Name <span className="text-red-400">*</span>
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
                        Last Name <span className="text-red-400">*</span>
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
                        Email Address <span className="text-red-400">*</span>
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
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="company" className="auth-label">
                        Company
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
                        />
                      </div>
                    </div>
                    
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
                  </div>
                </div>

                {/* Preferences */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
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
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
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
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
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

                {/* Shipping Address - only show when not same as billing */}
                {!sameAsBinding && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <Truck className="w-5 h-5 text-[#00BCD4]" />
                      <span>Shipping Address</span>
                    </h3>
                    
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
                          <div className="auth-label">
                            Country <span className="text-red-400">*</span>
                          </div>
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

                {/* Customer Settings */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-[#FFC107]" />
                    <span>Customer Settings</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {/* Portal Access Setting */}
                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/8 transition-all duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-[#42E695]/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-[#42E695]" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">Customer Portal Access</h4>
                          <p className="text-white/60 text-sm">Allow customer to access their portal dashboard</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer" aria-label="Customer Portal Access">
                        <input
                          type="checkbox"
                          checked={formData.portalAccess}
                          onChange={(e) => handleInputChange('portalAccess', e.target.checked)}
                          className="sr-only peer"
                          aria-describedby="portal-access-description"
                        />
                        <div className="relative w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#42E695]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#42E695]" />
                      </label>
                    </div>

                    {/* Auto Collection Setting */}
                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/8 transition-all duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-[#14BDEA]/20 flex items-center justify-center">
                          <Settings className="w-5 h-5 text-[#14BDEA]" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">Automatic Payment Collection</h4>
                          <p className="text-white/60 text-sm">Automatically collect payments when invoices are due</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer" aria-label="Automatic Payment Collection">
                        <input
                          type="checkbox"
                          checked={formData.autoCollection}
                          onChange={(e) => handleInputChange('autoCollection', e.target.checked)}
                          className="sr-only peer"
                          aria-describedby="auto-collection-description"
                        />
                        <div className="relative w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#14BDEA]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#14BDEA]" />
                      </label>
                    </div>

                    {/* Same Address Setting */}
                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/8 transition-all duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-[#00BCD4]/20 flex items-center justify-center">
                          <Truck className="w-5 h-5 text-[#00BCD4]" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">Use Billing as Shipping Address</h4>
                          <p className="text-white/60 text-sm">Shipping address will be same as billing address</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer" aria-label="Use Billing as Shipping Address">
                        <input
                          type="checkbox"
                          checked={sameAsBinding}
                          onChange={(e) => setSameAsBinding(e.target.checked)}
                          className="sr-only peer"
                          aria-describedby="same-address-description"
                        />
                        <div className="relative w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00BCD4]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00BCD4]" />
                      </label>
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
                  className="px-6 py-3 bg-gradient-to-r from-[#D417C8] to-[#14BDEA] text-white rounded-lg hover:opacity-90 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
