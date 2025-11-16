import { Save, User, Building2, Mail, MapPin, Plus, Languages, CreditCard, Globe, Settings, Truck, Hash, X } from 'lucide-react'
import React from 'react'

import { useEditCustomerModalController } from '../hooks/useEditCustomerModalController'

import type { CustomerResponse } from '@/shared/services/api/customer.service'
import { CustomerType } from '@/shared/types/customer.types'
import { Input, Toggle } from '@/shared/ui'
import { ApiDropdown, currencyDropdownConfig, timezoneDropdownConfig, countryDropdownConfig } from '@/shared/ui/ApiDropdown'
import { languageDropdownConfig } from '@/shared/ui/ApiDropdown/configs'
import { Button, IconButton } from '@/shared/ui/Button'
import { FormInput } from '@/shared/ui/FormInput'
import { Modal } from '@/shared/ui/Modal'
import { PhoneInput } from '@/shared/ui/PhoneInput'

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
  const {
    formData,
    billingAddress,
    shippingAddress,
    newTag,
    isSaving,
    handleInputChange,
    handleAddTag,
    handleRemoveTag,
    handleTagInputChange,
    handlePhoneChange,
    handlePhoneBlur,
    handleAddressChange,
    handleCopyBillingToShipping,
    handleSubmit,
  } = useEditCustomerModalController({ customer, onCustomerUpdated, onClose })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Customer"
      subtitle={`Update ${customer.effectiveDisplayName}'s information`}
      icon={User}
      size="xl"
    >
      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium tracking-tight text-white flex items-center space-x-2">
                    <User className="w-5 h-5 text-[#14BDEA]" />
                    <span>Basic Information</span>
                  </h3>
                  

                  
                  {/* Customer Information - Type Specific */}
                  {formData.type === CustomerType.Individual ? (
                    // Individual Customer - Only Individual Fields
                    <div className="space-y-6">
                      <div className="flex items-center space-x-2 text-sm text-white/70 pb-2 border-b border-white/10">
                        <User className="w-4 h-4 text-[#D417C8]" />
                        <span>Individual Customer</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                          label={<span>First Name <span className="text-[#D417C8]">*</span></span>}
                          leftIcon={User}
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="John"
                          required
                        />
                        
                        <FormInput
                          label={<span>Last Name <span className="text-[#D417C8]">*</span></span>}
                          leftIcon={User}
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Doe"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                          label={<span>Email Address <span className="text-[#D417C8]">*</span></span>}
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
                            onChange={handlePhoneChange}
                            onBlur={handlePhoneBlur}
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
                          label={<span>Company Name <span className="text-[#D417C8]">*</span></span>}
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
                          label={<span>Contact Email <span className="text-[#D417C8]">*</span></span>}
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
                            onChange={handlePhoneChange}
                            onBlur={handlePhoneBlur}
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
                  <h3 className="text-lg font-medium tracking-tight text-white flex items-center space-x-2">
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
                      <Toggle
                        label=""
                        checked={formData.portalAccess}
                        onChange={(e) => handleInputChange('portalAccess', e.target.checked)}
                        size="lg"
                        color="green"
                        aria-label="Customer Portal Access"
                      />
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
                      <Toggle
                        label=""
                        checked={formData.autoCollection}
                        onChange={(e) => handleInputChange('autoCollection', e.target.checked)}
                        size="lg"
                        color="blue"
                        aria-label="Automatic Payment Collection"
                      />
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium tracking-tight text-white flex items-center space-x-2">
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
                      <Button
                        type="button"
                        onClick={handleCopyBillingToShipping}
                        variant="ghost"
                        size="sm"
                        icon={Plus}
                        iconPosition="left"
                        className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                      >
                        Copy from Billing
                      </Button>
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
                  <h3 className="text-lg font-medium tracking-tight text-white flex items-center space-x-2">
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
                        <IconButton
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          icon={X}
                          variant="ghost"
                          size="sm"
                          aria-label={`Remove ${tag} tag`}
                          className="ml-1 text-[#14BDEA]/70 hover:text-[#14BDEA] w-4 h-4 p-0"
                        />
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={newTag}
                      onChange={(e) => handleTagInputChange(e.target.value)}
                      placeholder="Add tag"
                      className="flex-1"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    />
                    <IconButton
                      type="button"
                      onClick={handleAddTag}
                      icon={Plus}
                      variant="ghost"
                      size="md"
                      aria-label="Add tag"
                      className="bg-[#14BDEA]/10 text-[#14BDEA] hover:bg-[#14BDEA]/20"
                    />
                  </div>
                </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-white/10 mt-8">
                <Button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  variant="ghost"
                  size="md"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  variant="primary"
                  size="md"
                  icon={Save}
                  iconPosition="left"
                  loading={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
    </Modal>
  )
}

