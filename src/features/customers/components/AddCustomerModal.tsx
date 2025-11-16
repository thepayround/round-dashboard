import { X, User, Mail, Building2, MapPin, Globe, Settings, Tag, Save, Hash, Truck, Languages, AlertCircle } from 'lucide-react'
import React from 'react'

import { useAddCustomerModalController } from '../hooks/useAddCustomerModalController'

import { CustomerType } from '@/shared/types/customer.types'
import { Input, Toggle } from '@/shared/ui'
import { ApiDropdown, countryDropdownConfig, currencyDropdownConfig, timezoneDropdownConfig } from '@/shared/ui/ApiDropdown'
import { languageDropdownConfig } from '@/shared/ui/ApiDropdown/configs'
import { IconButton, Button } from '@/shared/ui/Button'
import { FormInput } from '@/shared/ui/FormInput'
import { Modal } from '@/shared/ui/Modal'
import { PhoneInput } from '@/shared/ui/PhoneInput'

interface AddCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  onCustomerAdded: () => void
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose, onCustomerAdded }) => {
  const {
    formData,
    loading,
    currentTag,
    sameAsBilling,
    hasFieldError,
    getFieldError,
    handleCustomerTypeChange,
    handleInputChange,
    handleAddressChange,
    handleAddTag,
    handleRemoveTag,
    handleTagInputChange,
    handlePhoneChange,
    handlePhoneBlur,
    handleSameAsBillingChange,
    handleSubmit,
  } = useAddCustomerModalController({ onClose, onCustomerAdded })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Customer"
      subtitle="Create a new customer profile"
      icon={User}
      size="xl"
    >
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
            <span className="block text-sm font-normal text-white/90 mb-2 tracking-tight">Customer Type</span>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={() => handleCustomerTypeChange(CustomerType.Individual)}
                variant={formData.type === CustomerType.Individual ? 'primary' : 'secondary'}
                size="md"
                icon={User}
                iconPosition="left"
                fullWidth
                className={`justify-start p-4 h-auto ${
                  formData.type === CustomerType.Individual
                    ? 'border-[#D417C8] bg-[#D417C8]/10'
                    : ''
                }`}
              >
                <div className="text-left">
                  <div className="font-medium">Individual</div>
                  <div className="text-sm opacity-75">Personal customer</div>
                </div>
              </Button>
              <Button
                type="button"
                onClick={() => handleCustomerTypeChange(CustomerType.Business)}
                variant={formData.type === CustomerType.Business ? 'primary' : 'secondary'}
                size="md"
                icon={Building2}
                iconPosition="left"
                fullWidth
                className={`justify-start p-4 h-auto ${
                  formData.type === CustomerType.Business
                    ? 'border-[#14BDEA] bg-[#14BDEA]/10'
                    : ''
                }`}
              >
                <div className="text-left">
                  <div className="font-medium">Business</div>
                  <div className="text-sm opacity-75">Company customer</div>
                </div>
              </Button>
            </div>
          </div>
          
          {/* Name and Email Row - Symmetric 3-column */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="John"
                label="First Name"
                leftIcon={User}
                required
              />
            </div>
            
            <div>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Doe"
                label="Last Name"
                leftIcon={User}
                required
              />
            </div>
            
            <div>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john@example.com"
                label="Email Address"
                leftIcon={Mail}
                required
              />
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
              {hasFieldError('phoneNumber') && (
                <div className="mt-2 flex items-center space-x-2 text-auth-error font-medium text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{getFieldError('phoneNumber')}</span>
                </div>
              )}
            </div>
            
            {/* Company field - only for business customers */}
            {formData.type === CustomerType.Business && (
              <div>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Acme Corporation"
                  label="Company"
                  leftIcon={Building2}
                  required={formData.type === CustomerType.Business}
                />
              </div>
            )}
            
            {/* Tax Number field - only for business customers */}
            {formData.type === CustomerType.Business && (
              <div>
                <Input
                  id="taxNumber"
                  type="text"
                  value={formData.taxNumber}
                  onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                  placeholder="Enter tax number"
                  label="Tax Number"
                  leftIcon={Hash}
                />
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
                <span className="block text-sm font-normal text-white/90 mb-2 tracking-tight">Currency</span>
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
                <span className="block text-sm font-normal text-white/90 mb-2 tracking-tight flex items-center space-x-2">
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
                <span className="block text-sm font-normal text-white/90 mb-2 tracking-tight">Timezone</span>
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
                <IconButton
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  icon={X}
                  variant="ghost"
                  size="sm"
                  className="text-[#7767DA]/70 hover:text-[#7767DA] w-4 h-4 p-0"
                  aria-label="Remove tag"
                />
              </span>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <Input
              type="text"
              value={currentTag}
              onChange={(e) => handleTagInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="Add a tag..."
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleAddTag}
              variant="secondary"
              size="md"
              className="bg-[#7767DA]/20 text-[#7767DA] border-[#7767DA]/30 hover:bg-[#7767DA]/30"
            >
              Add
            </Button>
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
                  <span className="block text-sm font-normal text-white/90 mb-2 tracking-tight">Country</span>
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
            
            <Toggle
              label="Same as billing"
              checked={sameAsBilling}
              onChange={(e) => handleSameAsBillingChange(e.target.checked)}
              size="lg"
              color="cyan"
              aria-label="Use Billing as Shipping Address"
            />
          </div>
          
          {/* Address Fields or Same as Billing Message */}
          {sameAsBilling ? (
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
                    <span className="block text-sm font-normal text-white/90 mb-2 tracking-tight">Country</span>
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
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#42E695]/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#42E695]" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Customer Portal Access</h4>
                  <p className="text-white/60 text-sm" id="portal-access-description">Allow customer to access their portal dashboard</p>
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
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#14BDEA]/20 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-[#14BDEA]" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Automatic Payment Collection</h4>
                  <p className="text-white/60 text-sm" id="auto-collection-description">Automatically collect payments when invoices are due</p>
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
      </form>

      {/* Footer */}
      <div className="flex items-center justify-end space-x-3 p-6 border-t border-white/10">
        <Button
          type="button"
          onClick={onClose}
          variant="ghost"
          size="md"
          className="text-white/70 hover:text-white"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="primary"
          size="md"
          icon={Save}
          iconPosition="left"
          loading={loading}
        >
          {loading ? 'Creating...' : 'Create Customer'}
        </Button>
      </div>
    </Modal>
  )
}


