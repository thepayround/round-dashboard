import { User, Mail, Building2, MapPin, Globe, Settings, Tag, Save, Hash, Truck, Languages, AlertCircle } from 'lucide-react'
import React from 'react'

import { useAddCustomerModalController } from '../hooks/useAddCustomerModalController'

import { useCountries } from '@/shared/hooks/api/useCountryCurrency'
import { useTimezones, useLanguages } from '@/shared/hooks/api/useUserSettingsOptions'
import { CustomerType } from '@/shared/types/customer.types'
import { AddressFormGroup, type Address } from '@/shared/ui'
import { Combobox } from '@/shared/ui/Combobox'
import type { ComboboxOption } from '@/shared/ui/Combobox/types'
import { CurrencySelect } from '@/shared/ui/CurrencySelect'
import { PhoneInput } from '@/shared/ui/PhoneInput'
import { Badge } from '@/shared/ui/shadcn/badge'
import { Button } from '@/shared/ui/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/shadcn/dialog'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
import { Switch } from '@/shared/ui/shadcn/switch'

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

  // Fetch dropdown data
  const { data: countries } = useCountries()
  const { data: timezones } = useTimezones()
  const { data: languages } = useLanguages()

  // Transform to ComboboxOption format
  const languageOptions: ComboboxOption<string>[] = languages.map(lang => ({
    value: lang.value,
    label: lang.label,
  }))

  const timezoneOptions: ComboboxOption<string>[] = timezones.map(tz => ({
    value: tz.value,
    label: tz.label,
  }))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Add New Customer</span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Create a new customer profile</p>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
          </div>
          
          {/* Customer Type Selection */}
          <div className="space-y-4">
            <Label>Customer Type</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                onClick={() => handleCustomerTypeChange(CustomerType.Individual)}
                variant={formData.type === CustomerType.Individual ? 'default' : 'secondary'}
                size="default"
                className={`w-full justify-start p-4 h-auto ${
                  formData.type === CustomerType.Individual
                    ? 'border-primary bg-primary/10'
                    : ''
                }`}
              >
                <User className="mr-2 w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Individual</div>
                  <div className="text-sm opacity-75">Personal customer</div>
                </div>
              </Button>
              <Button
                type="button"
                onClick={() => handleCustomerTypeChange(CustomerType.Business)}
                variant={formData.type === CustomerType.Business ? 'default' : 'secondary'}
                size="default"
                className={`w-full justify-start p-4 h-auto ${
                  formData.type === CustomerType.Business
                    ? 'border-secondary bg-secondary/10'
                    : ''
                }`}
              >
                <Building2 className="mr-2 w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Business</div>
                  <div className="text-sm opacity-75">Company customer</div>
                </div>
              </Button>
            </div>
          </div>
          
          {/* Name and Email Row - Symmetric 3-column */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="company">
                  Company<span className="text-destructive"> *</span>
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Acme Corporation"
                    className="pl-10"
                    required={formData.type === CustomerType.Business}
                  />
                </div>
              </div>
            )}

            {/* Tax Number field - only for business customers */}
            {formData.type === CustomerType.Business && (
              <div className="space-y-2">
                <Label htmlFor="taxNumber">Tax Number</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="taxNumber"
                    value={formData.taxNumber}
                    onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                    placeholder="Enter tax number"
                    className="pl-10"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="w-5 h-5 text-secondary" />
            <h3 className="text-lg font-semibold text-foreground">Preferences</h3>
          </div>
          
          {/* Symmetric 3-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <CurrencySelect
                id="currency"
                value={formData.currency}
                onChange={(value) => handleInputChange('currency', value ?? '')}
                placeholder="Select currency"
                searchable={true}
                clearable={true}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="flex items-center space-x-2">
                <Languages className="w-4 h-4" />
                <span>Language</span>
              </Label>
              <Combobox
                id="language"
                options={languageOptions}
                value={formData.locale}
                onChange={(value) => handleInputChange('locale', value ?? '')}
                placeholder="Select language"
                searchable={true}
                clearable={true}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Combobox
                id="timezone"
                options={timezoneOptions}
                value={formData.timezone}
                onChange={(value) => handleInputChange('timezone', value ?? '')}
                placeholder="Select timezone"
                searchable={true}
                clearable={true}
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Tag className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">Tags</h3>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {(formData.tags ?? []).map((tag, index) => (
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
              size="default"
              className="bg-accent/20 text-accent border-accent/30 hover:bg-accent/30"
            >
              Add
            </Button>
          </div>
        </div>

        {/* Billing Address */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="w-5 h-5 text-success" />
            <h3 className="text-lg font-semibold text-foreground">Billing Address</h3>
          </div>

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
            countries={countries.map(c => ({ code: c.countryCodeAlpha2, name: c.countryName }))}
          />
        </div>

        {/* Shipping Address Section */}
        <div className="space-y-4">
          {/* Header with Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-secondary" />
              <h3 className="text-lg font-semibold text-foreground">Shipping Address</h3>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="same-as-billing"
                checked={sameAsBilling}
                onCheckedChange={handleSameAsBillingChange}
                aria-label="Use Billing as Shipping Address"
              />
              <Label htmlFor="same-as-billing">Same as billing</Label>
            </div>
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
              countries={countries.map(c => ({ code: c.countryCodeAlpha2, name: c.countryName }))}
            />
          )}
        </div>

        {/* Customer Settings */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Settings className="w-5 h-5 text-[#FFC107]" />
            <h3 className="text-lg font-semibold text-foreground">Customer Settings</h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Portal Access Setting */}
            <div className="flex items-center justify-between p-4 bg-white/5 border border-border rounded-lg hover:bg-white/8 transition-all duration-200">
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h4 className="text-foreground font-medium">Customer Portal Access</h4>
                  <p className="text-muted-foreground text-sm" id="portal-access-description">Allow customer to access their portal dashboard</p>
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
                  <p className="text-muted-foreground text-sm" id="auto-collection-description">Automatically collect payments when invoices are due</p>
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
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border">
          <Button
            type="button"
            onClick={onClose}
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            variant="default"
          >
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Customer
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


