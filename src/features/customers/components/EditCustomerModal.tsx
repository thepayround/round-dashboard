import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, User, Building2, Mail, MapPin, Plus, Loader2, Languages, CreditCard, Globe, Settings, Truck, Hash } from 'lucide-react'
import { PhoneInput } from '@/shared/components/ui/PhoneInput/PhoneInput'
import { FormInput } from '@/shared/components/ui/FormInput'
import { ApiDropdown, currencyDropdownConfig, timezoneDropdownConfig, countryDropdownConfig } from '@/shared/components/ui/ApiDropdown'
import { languageDropdownConfig } from '@/shared/components/ui/ApiDropdown/configs'
import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { customerService } from '@/shared/services/api/customer.service'
import type { CustomerResponse, CustomerUpdateRequest, CustomerAddressCreateRequest } from '@/shared/services/api/customer.service'

interface EditCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  customer: CustomerResponse
  onCustomerUpdated: (updatedCustomer: CustomerResponse) => void
}

export const EditCustomerModal: React.FC<EditCustomerModalProps> = ({
  isOpen,
  onClose,
  customer,
  onCustomerUpdated
}) => {
  const { showSuccess, showError } = useGlobalToast()
  const [formData, setFormData] = useState<CustomerUpdateRequest>({
    type: customer.type,
    email: customer.email,
    firstName: customer.firstName,
    lastName: customer.lastName,
    company: customer.company ?? '',
    phoneNumber: customer.phoneNumber ?? '',
    countryPhoneCode: '',
    taxNumber: customer.taxNumber ?? '',
    locale: customer.locale ?? 'en',
    timezone: customer.timezone ?? '',
    currency: customer.currency,
    portalAccess: customer.portalAccess,
    autoCollection: customer.autoCollection,
    tags: customer.tags,
    customFields: customer.customFields
  })
  
  const [billingAddress, setBillingAddress] = useState<CustomerAddressCreateRequest>({
    type: 'billing',
    isPrimary: true,
    line1: customer.billingAddress?.line1 ?? '',
    line2: customer.billingAddress?.line2 ?? '',
    city: customer.billingAddress?.city ?? '',
    state: customer.billingAddress?.state ?? '',
    country: customer.billingAddress?.country ?? '',
    zipCode: customer.billingAddress?.zipCode ?? ''
  })
  
  const [shippingAddress, setShippingAddress] = useState<CustomerAddressCreateRequest>({
    type: 'shipping',
    isPrimary: false,
    line1: customer.shippingAddress?.line1 ?? '',
    line2: customer.shippingAddress?.line2 ?? '',
    city: customer.shippingAddress?.city ?? '',
    state: customer.shippingAddress?.state ?? '',
    country: customer.shippingAddress?.country ?? '',
    zipCode: customer.shippingAddress?.zipCode ?? ''
  })
  
  const [newTag, setNewTag] = useState('')
  const [isSaving, setIsSaving] = useState(false)



  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }))
  }

  const handleAddressChange = (addressType: 'billing' | 'shipping', field: string, value: string) => {
    const setter = addressType === 'billing' ? setBillingAddress : setShippingAddress
    setter(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCopyBillingToShipping = () => {
    setShippingAddress({
      ...billingAddress,
      type: 'shipping',
      isPrimary: false
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Helper function to check if address has any data
      const hasAddressData = (address: CustomerAddressCreateRequest) => address.line1.trim() || address.city.trim() || address.country.trim()

      // Create update payload including addresses only if they have data
      const updatePayload = {
        ...formData,
        type: customer.type, // Ensure type remains as original customer type
        billingAddress: hasAddressData(billingAddress) ? billingAddress : null,
        shippingAddress: hasAddressData(shippingAddress) ? shippingAddress : null
      }
      
      // Update customer with addresses
      const updatedCustomer = await customerService.update(customer.id, updatePayload)
      
      showSuccess('Customer updated successfully')
      onCustomerUpdated(updatedCustomer)
      onClose()
    } catch (error) {
      if (error instanceof Error) {
        showError(`Failed to update customer: ${error.message}`)
      } else {
        showError('Failed to update customer: Unknown error')
      }
    } finally {
      setIsSaving(false)
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
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D417C8] to-[#14BDEA] flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Edit Customer</h2>
                    <p className="text-sm text-white/70">Update {customer.effectiveDisplayName}&apos;s information</p>
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
                    <User className="w-5 h-5 text-[#14BDEA]" />
                    <span>Basic Information</span>
                  </h3>
                  

                  
                  {/* Customer Information - Type Specific */}
                  {formData.type === 1 ? (
                    // Individual Customer - Only Individual Fields
                    <div className="space-y-6">
                      <div className="flex items-center space-x-2 text-sm text-white/70 pb-2 border-b border-white/10">
                        <User className="w-4 h-4 text-[#D417C8]" />
                        <span>Individual Customer</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                          label={<span>First Name <span className="text-red-400">*</span></span>}
                          leftIcon={User}
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="John"
                          required
                        />
                        
                        <FormInput
                          label={<span>Last Name <span className="text-red-400">*</span></span>}
                          leftIcon={User}
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Doe"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                          label={<span>Email Address <span className="text-red-400">*</span></span>}
                          type="email"
                          leftIcon={Mail}
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="john@example.com"
                          required
                        />
                        
                        <div>
                          <PhoneInput
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={(phoneNumber: string) => handleInputChange('phoneNumber', phoneNumber)}
                            validateOnBlur={false}
                            label="Phone Number"
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>
                      
                      <FormInput
                        label="Tax Number (Optional)"
                        leftIcon={CreditCard}
                        value={formData.taxNumber}
                        onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                        placeholder="Personal Tax ID"
                      />
                    </div>
                  ) : (
                    // Business Customer - Only Business Fields
                    <div className="space-y-6">
                      <div className="flex items-center space-x-2 text-sm text-white/70 pb-2 border-b border-white/10">
                        <Building2 className="w-4 h-4 text-[#14BDEA]" />
                        <span>Business Customer</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                          label={<span>Company Name <span className="text-red-400">*</span></span>}
                          leftIcon={Building2}
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          placeholder="Acme Corporation"
                          required
                        />
                        
                        <FormInput
                          label="Business Tax ID"
                          leftIcon={CreditCard}
                          value={formData.taxNumber}
                          onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                          placeholder="Business Registration Number"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                          label={<span>Contact Email <span className="text-red-400">*</span></span>}
                          type="email"
                          leftIcon={Mail}
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="contact@company.com"
                          required
                        />
                        
                        <div>
                          <PhoneInput
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={(phoneNumber: string) => handleInputChange('phoneNumber', phoneNumber)}
                            validateOnBlur={false}
                            label="Business Phone"
                            placeholder="Enter business phone"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                          label="Contact Person First Name"
                          leftIcon={User}
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="Contact first name"
                        />
                        
                        <FormInput
                          label="Contact Person Last Name"
                          leftIcon={User}
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Contact last name"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Preferences & Settings */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-[#D417C8]" />
                    <span>Preferences & Settings</span>
                  </h3>
                  
                  {/* Locale, Currency, Timezone Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                  {/* Customer Settings */}
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
                        />
                        <div className="relative w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#14BDEA]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#14BDEA]" />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-[#42E695]" />
                    <span>Addresses</span>
                  </h3>
                  
                  {/* Billing Address */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-white flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-[#42E695]" />
                      <span>Billing Address</span>
                    </h4>
                    
                    <div>
                      <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-4">
                        {/* Address Lines */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <FormInput
                              label="Address Line 1"
                              value={billingAddress.line1}
                              onChange={(e) => handleAddressChange('billing', 'line1', e.target.value)}
                              placeholder="123 Main Street"
                              leftIcon={MapPin}
                            />
                          </div>
                          <div>
                            <FormInput
                              label="Address Line 2"
                              value={billingAddress.line2}
                              onChange={(e) => handleAddressChange('billing', 'line2', e.target.value)}
                              placeholder="Apartment, floor, etc. (optional)"
                              leftIcon={MapPin}
                            />
                          </div>
                        </div>
                        
                        {/* City, State, ZIP, Country - 4-column layout */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <FormInput
                              label="City"
                              value={billingAddress.city}
                              onChange={(e) => handleAddressChange('billing', 'city', e.target.value)}
                              placeholder="San Francisco"
                            />
                          </div>
                          <div>
                            <FormInput
                              label="State / Province"
                              value={billingAddress.state}
                              onChange={(e) => handleAddressChange('billing', 'state', e.target.value)}
                              placeholder="CA"
                            />
                          </div>
                          <div>
                            <FormInput
                              label="ZIP / Postal"
                              value={billingAddress.zipCode}
                              onChange={(e) => handleAddressChange('billing', 'zipCode', e.target.value)}
                              placeholder="94102"
                              leftIcon={Hash}
                            />
                          </div>
                          <div>
                            <div className="space-y-2">
                              <span className="auth-label">Country</span>
                              <ApiDropdown
                                config={countryDropdownConfig}
                                value={billingAddress.country}
                                onSelect={(value) => handleAddressChange('billing', 'country', value)}
                                allowClear
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Shipping Address */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-md font-medium text-white flex items-center space-x-2">
                        <Truck className="w-4 h-4 text-[#7767DA]" />
                        <span>Shipping Address</span>
                      </h4>
                      <button
                        type="button"
                        onClick={handleCopyBillingToShipping}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Copy from Billing</span>
                      </button>
                    </div>
                    
                    <div>
                      <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-4">
                        {/* Address Lines */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <FormInput
                              label="Address Line 1"
                              value={shippingAddress.line1}
                              onChange={(e) => handleAddressChange('shipping', 'line1', e.target.value)}
                              placeholder="123 Main Street"
                              leftIcon={MapPin}
                            />
                          </div>
                          <div>
                            <FormInput
                              label="Address Line 2"
                              value={shippingAddress.line2}
                              onChange={(e) => handleAddressChange('shipping', 'line2', e.target.value)}
                              placeholder="Apartment, floor, etc. (optional)"
                              leftIcon={MapPin}
                            />
                          </div>
                        </div>
                        
                        {/* City, State, ZIP, Country - 4-column layout */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <FormInput
                              label="City"
                              value={shippingAddress.city}
                              onChange={(e) => handleAddressChange('shipping', 'city', e.target.value)}
                              placeholder="San Francisco"
                            />
                          </div>
                          <div>
                            <FormInput
                              label="State / Province"
                              value={shippingAddress.state}
                              onChange={(e) => handleAddressChange('shipping', 'state', e.target.value)}
                              placeholder="CA"
                            />
                          </div>
                          <div>
                            <FormInput
                              label="ZIP / Postal"
                              value={shippingAddress.zipCode}
                              onChange={(e) => handleAddressChange('shipping', 'zipCode', e.target.value)}
                              placeholder="94105"
                              leftIcon={Hash}
                            />
                          </div>
                          <div>
                            <div className="space-y-2">
                              <span className="auth-label">Country</span>
                              <ApiDropdown
                                config={countryDropdownConfig}
                                value={shippingAddress.country}
                                onSelect={(value) => handleAddressChange('shipping', 'country', value)}
                                allowClear
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-[#D417C8]" />
                    <span>Tags</span>
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#14BDEA]/10 text-[#14BDEA] border border-[#14BDEA]/20"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-[#14BDEA]/70 hover:text-[#14BDEA]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      className="flex-1 auth-input"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-[#14BDEA]/10 text-[#14BDEA] rounded-lg hover:bg-[#14BDEA]/20 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </form>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  className="px-6 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="px-6 py-3 bg-gradient-to-r from-[#D417C8] to-[#14BDEA] text-white rounded-lg hover:opacity-90 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
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