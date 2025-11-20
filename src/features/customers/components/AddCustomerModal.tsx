import { User, Mail, Building2, MapPin, Globe, Settings, Tag, Save, Hash, Truck, Languages, AlertCircle } from 'lucide-react'
import React from 'react'

import { useAddCustomerModalController } from '../hooks/useAddCustomerModalController'

import { CustomerType } from '@/shared/types/customer.types'
import { Input, Toggle, Badge, AddressFormGroup, IconBox, SectionHeader, type Address } from '@/shared/ui'
import { ApiDropdown, countryDropdownConfig, currencyDropdownConfig, timezoneDropdownConfig } from '@/shared/ui/ApiDropdown'
import { languageDropdownConfig } from '@/shared/ui/ApiDropdown/configs'
import { Button } from '@/shared/ui/Button'
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
          <SectionHeader icon={User} title="Basic Information" iconColor="text-primary" />
          
          {/* Customer Type Selection */}
          <div className="space-y-4">
            <span className="block text-sm font-normal text-white/90 mb-2 tracking-tight">Customer Type</span>
            <div className="grid grid-cols-2 gap-4">
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
                    ? 'border-primary bg-primary/10'
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
                    ? 'border-secondary bg-secondary/10'
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
          <SectionHeader icon={Globe} title="Preferences" iconColor="text-secondary" />
          
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
          <SectionHeader icon={Tag} title="Tags" iconColor="text-accent" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            {(formData.tags ?? []).map((tag, index) => (
              <Badge
                key={index}
                variant="primary"
                size="lg"
                removable
                onRemove={() => handleRemoveTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <Input
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
              className="bg-accent/20 text-accent border-accent/30 hover:bg-accent/30"
            >
              Add
            </Button>
          </div>
        </div>

        {/* Billing Address */}
        <div className="space-y-6">
          <SectionHeader icon={MapPin} title="Billing Address" iconColor="text-success" />

          <AddressFormGroup
            value={formData.billingAddress ?? {
              line1: '',
              line2: '',
              city: '',
              state: '',
              zipCode: '',
              country: '',
            }}
            onChange={(address: Address) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              handleInputChange('billingAddress', address as any)
            }}
            countryDropdownConfig={countryDropdownConfig}
          />
        </div>

        {/* Shipping Address Section */}
        <div className="space-y-4">
          {/* Header with Toggle */}
          <div className="flex items-center justify-between">
            <SectionHeader icon={Truck} title="Shipping Address" iconColor="text-secondary" />
            
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
            <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Shipping address will be same as billing address</p>
                  <p className="text-white/60 text-xs">Turn off the toggle above to enter a different shipping address</p>
                </div>
              </div>
            </div>
          ) : (
            <AddressFormGroup
              value={formData.shippingAddress ?? {
                line1: '',
                line2: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',
              }}
              onChange={(address: Address) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                handleInputChange('shippingAddress', address as any)
              }}
              countryDropdownConfig={countryDropdownConfig}
            />
          )}
        </div>

        {/* Customer Settings */}
        <div className="space-y-6">
          <SectionHeader icon={Settings} title="Customer Settings" iconColor="text-[#FFC107]" />
          
          <div className="grid grid-cols-1 gap-4">
            {/* Portal Access Setting */}
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/8 transition-all duration-200">
              <div className="flex items-center space-x-3 flex-1">
                <IconBox icon={User} color="success" />
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
                <IconBox icon={Settings} color="info" />
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
          isLoading={loading}
        >
          {loading ? 'Creating...' : 'Create Customer'}
        </Button>
      </div>
    </Modal>
  )
}


