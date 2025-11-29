import { Save, User, Building2, Mail, MapPin, Plus, Languages, CreditCard, Globe, Settings, Truck } from 'lucide-react'
import React from 'react'

import { useEditCustomerModalController } from '../hooks/useEditCustomerModalController'

import { useCurrencies, useCountries } from '@/shared/hooks/api/useCountryCurrency'
import { useTimezones, useLanguages } from '@/shared/hooks/api/useUserSettingsOptions'
import type { CustomerResponse } from '@/shared/services/api/customer.service'
import { CustomerType } from '@/shared/types/customer.types'
import { AddressFormGroup, type Address } from '@/shared/ui'
import { PhoneInput } from '@/shared/ui/PhoneInput'
import { Badge } from '@/shared/ui/shadcn/badge'
import { Button } from '@/shared/ui/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/shadcn/dialog'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/shadcn/select'
import { Switch } from '@/shared/ui/shadcn/switch'

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

  // Fetch dropdown data
  const { data: currencies } = useCurrencies()
  const { data: countries } = useCountries()
  const { data: timezones } = useTimezones()
  const { data: languages } = useLanguages()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Edit Customer</span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Update {customer.effectiveDisplayName}&apos;s information</p>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-secondary" />
              <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
            </div>

            {/* Customer Information - Type Specific */}
            {formData.type === CustomerType.Individual ? (
              // Individual Customer - Only Individual Fields
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground pb-2 border-b border-border">
                  <User className="w-4 h-4 text-primary" />
                  <span>Individual Customer</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      First Name<span className="text-destructive"> *</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="John"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      Last Name<span className="text-destructive"> *</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Doe"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email Address<span className="text-destructive"> *</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="john@example.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

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

                <div className="space-y-2">
                  <Label htmlFor="taxNumber">Tax Number (Optional)</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="taxNumber"
                      value={formData.taxNumber}
                      onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                      placeholder="Personal Tax ID"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            ) : (
              // Business Customer - Only Business Fields
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground pb-2 border-b border-border">
                  <Building2 className="w-4 h-4 text-secondary" />
                  <span>Business Customer</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">
                      Company Name<span className="text-destructive"> *</span>
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="Acme Corporation"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessTaxId">Business Tax ID</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="businessTaxId"
                        value={formData.taxNumber}
                        onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                        placeholder="Business Registration Number"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">
                      Contact Email<span className="text-destructive"> *</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="contact@company.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

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
                  <div className="space-y-2">
                    <Label htmlFor="contactFirstName">Contact Person First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="contactFirstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Contact first name"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactLastName">Contact Person Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="contactLastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Contact last name"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preferences & Settings */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Preferences & Settings</h3>
            </div>

            {/* Locale, Currency, Timezone Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language" className="flex items-center space-x-2">
                  <Languages className="w-4 h-4" />
                  <span>Language</span>
                </Label>
                <Select
                  value={formData.locale}
                  onValueChange={(value) => handleInputChange('locale', value)}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.value} value={language.value}>
                        {language.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => handleInputChange('currency', value)}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.currencyCodeAlpha} value={currency.currencyCodeAlpha}>
                        {currency.currencyName} ({currency.currencyCodeAlpha})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) => handleInputChange('timezone', value)}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((timezone) => (
                      <SelectItem key={timezone.value} value={timezone.value}>
                        {timezone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Customer Settings */}
            <div className="grid grid-cols-1 gap-4">
              {/* Portal Access Setting */}
              <div className="flex items-center justify-between p-4 bg-white/5 border border-border rounded-lg hover:bg-white/8 transition-all duration-200">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h4 className="text-foreground font-medium">Customer Portal Access</h4>
                    <p className="text-muted-foreground text-sm">Allow customer to access their portal dashboard</p>
                  </div>
                </div>
                <Switch
                  id="portal-access"
                  checked={formData.portalAccess}
                  onCheckedChange={(checked) => handleInputChange('portalAccess', checked)}
                  aria-label="Customer Portal Access"
                />
              </div>

              {/* Auto Collection Setting */}
              <div className="flex items-center justify-between p-4 bg-white/5 border border-border rounded-lg hover:bg-white/8 transition-all duration-200">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <h4 className="text-foreground font-medium">Automatic Payment Collection</h4>
                    <p className="text-muted-foreground text-sm">Automatically collect payments when invoices are due</p>
                  </div>
                </div>
                <Switch
                  id="auto-collection"
                  checked={formData.autoCollection}
                  onCheckedChange={(checked) => handleInputChange('autoCollection', checked)}
                  aria-label="Automatic Payment Collection"
                />
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-5 h-5 text-success" />
              <h3 className="text-lg font-semibold text-foreground">Addresses</h3>
            </div>

            {/* Billing Address */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-foreground flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-success" />
                <span>Billing Address</span>
              </h4>

              <div className="p-4 bg-white/5 border border-border rounded-lg">
                <AddressFormGroup
                  value={billingAddress}
                  onChange={(address: Address) => {
                    Object.entries(address).forEach(([field, value]) => {
                      handleAddressChange('billing', field as keyof Address, value)
                    })
                  }}
                  countries={countries.map(c => ({ code: c.countryCodeAlpha2, name: c.countryName }))}
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-medium text-foreground flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-accent" />
                  <span>Shipping Address</span>
                </h4>
                <Button
                  type="button"
                  onClick={handleCopyBillingToShipping}
                  variant="ghost"
                  size="sm"
                  className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                >
                  <Plus className="mr-2 w-4 h-4" />
                  Copy from Billing
                </Button>
              </div>

              <div className="p-4 bg-white/5 border border-border rounded-lg">
                <AddressFormGroup
                  value={shippingAddress}
                  onChange={(address: Address) => {
                    Object.entries(address).forEach(([field, value]) => {
                      handleAddressChange('shipping', field as keyof Address, value)
                    })
                  }}
                  countries={countries.map(c => ({ code: c.countryCodeAlpha2, name: c.countryName }))}
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Tags</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag, index) => (
                <Badge
                  key={index}
                  variant="default"
                  className="group relative pr-8"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded-sm opacity-70 hover:opacity-100"
                    aria-label={`Remove ${tag} tag`}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => handleTagInputChange(e.target.value)}
                placeholder="Add tag"
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="ghost"
                size="default"
                aria-label="Add tag"
                className="bg-secondary/10 text-secondary hover:bg-secondary/20"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border mt-8">
            <Button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              variant="ghost"
              size="default"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              variant="default"
              size="default"
            >
              {isSaving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
