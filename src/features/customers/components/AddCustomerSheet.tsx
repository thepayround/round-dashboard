import { Building2, User } from 'lucide-react'
import React from 'react'

import { useAddCustomerModalController } from '../hooks/useAddCustomerModalController'

import { useCountries } from '@/shared/hooks/api/useCountryCurrency'
import { useTimezones, useLanguages } from '@/shared/hooks/api/useUserSettingsOptions'
import { CustomerType } from '@/shared/types/customer.types'
import { AddressFormGroup, type Address } from '@/shared/ui'
import { Combobox } from '@/shared/ui/Combobox'
import type { ComboboxOption } from '@/shared/ui/Combobox/types'
import { CurrencySelect } from '@/shared/ui/CurrencySelect'
import { FormSheet } from '@/shared/ui/FormSheet'
import { PhoneInput } from '@/shared/ui/PhoneInput'
import { Button } from '@/shared/ui/shadcn/button'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
import { Switch } from '@/shared/ui/shadcn/switch'

interface AddCustomerSheetProps {
  isOpen: boolean
  onClose: () => void
  onCustomerAdded: () => void
}

export const AddCustomerSheet: React.FC<AddCustomerSheetProps> = ({ isOpen, onClose, onCustomerAdded }) => {
  const {
    formData,
    loading,
    sameAsBilling,
    handleCustomerTypeChange,
    handleInputChange,
    handlePhoneChange,
    handlePhoneBlur,
    handleSameAsBillingChange,
    handleSubmit,
  } = useAddCustomerModalController({ onClose, onCustomerAdded, isOpen })

  const { data: countries } = useCountries()
  const { data: timezones } = useTimezones()
  const { data: languages } = useLanguages()

  const languageOptions: ComboboxOption<string>[] = languages.map(lang => ({
    value: lang.value,
    label: lang.label,
  }))

  const timezoneOptions: ComboboxOption<string>[] = timezones.map(tz => ({
    value: tz.value,
    label: tz.label,
  }))

  const isBusinessCustomer = formData.type === CustomerType.Business

  return (
    <FormSheet
      open={isOpen}
      onOpenChange={onClose}
      title="Add Customer"
      description="Create a new customer profile"
      size="lg"
      submitLabel="Create Customer"
      onSubmit={handleSubmit}
      isSubmitting={loading}
    >
      <div className="space-y-6">
        {/* Customer Type Toggle */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            onClick={() => handleCustomerTypeChange(CustomerType.Individual)}
            variant={!isBusinessCustomer ? 'default' : 'outline'}
            className="h-10"
          >
            <User className="mr-2 h-4 w-4" />
            Individual
          </Button>
          <Button
            type="button"
            onClick={() => handleCustomerTypeChange(CustomerType.Business)}
            variant={isBusinessCustomer ? 'default' : 'outline'}
            className="h-10"
          >
            <Building2 className="mr-2 h-4 w-4" />
            Business
          </Button>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Contact Information</h3>

          {isBusinessCustomer && (
            <div className="space-y-1.5">
              <Label htmlFor="company">
                Company <span className="text-destructive">*</span>
              </Label>
              <Input
                id="company"
                value={formData.company}
                onChange={e => handleInputChange('company', e.target.value)}
                placeholder="Company name"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={e => handleInputChange('firstName', e.target.value)}
                placeholder="First name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">
                Last Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={e => handleInputChange('lastName', e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              placeholder="email@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phoneNumber">Phone</Label>
            <PhoneInput
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              validateOnBlur={false}
              placeholder="Phone number"
              defaultCountry="US"
              showValidation={false}
            />
          </div>

          {isBusinessCustomer && (
            <div className="space-y-1.5">
              <Label htmlFor="taxNumber">Tax ID</Label>
              <Input
                id="taxNumber"
                value={formData.taxNumber}
                onChange={e => handleInputChange('taxNumber', e.target.value)}
                placeholder="Tax identification number"
              />
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Preferences</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="currency">Currency</Label>
              <CurrencySelect
                id="currency"
                value={formData.currency}
                onChange={value => handleInputChange('currency', value ?? '')}
                placeholder="Select currency"
                searchable
                clearable
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="language">Language</Label>
              <Combobox
                id="language"
                options={languageOptions}
                value={formData.locale}
                onChange={value => handleInputChange('locale', value ?? '')}
                placeholder="Select language"
                searchable
                clearable
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="timezone">Timezone</Label>
            <Combobox
              id="timezone"
              options={timezoneOptions}
              value={formData.timezone}
              onChange={value => handleInputChange('timezone', value ?? '')}
              placeholder="Select timezone"
              searchable
              clearable
            />
          </div>
        </div>

        {/* Billing Address */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Billing Address</h3>
          <AddressFormGroup
            value={
              formData.billingAddress ?? {
                line1: '',
                line2: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',
              }
            }
            onChange={(address: Address) => {
              handleInputChange('billingAddress', address as never)
            }}
            countries={countries.map(c => ({ code: c.countryCodeAlpha2, name: c.countryName }))}
          />
        </div>

        {/* Shipping Address */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Shipping Address</h3>
            <div className="flex items-center gap-2">
              <Switch
                id="same-as-billing"
                checked={sameAsBilling}
                onCheckedChange={handleSameAsBillingChange}
              />
              <Label htmlFor="same-as-billing" className="text-sm font-normal">
                Same as billing
              </Label>
            </div>
          </div>

          {!sameAsBilling && (
            <AddressFormGroup
              value={
                formData.shippingAddress ?? {
                  line1: '',
                  line2: '',
                  city: '',
                  state: '',
                  zipCode: '',
                  country: '',
                }
              }
              onChange={(address: Address) => {
                handleInputChange('shippingAddress', address as never)
              }}
              countries={countries.map(c => ({ code: c.countryCodeAlpha2, name: c.countryName }))}
            />
          )}
        </div>

        {/* Settings */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Settings</h3>

          <div className="flex items-center justify-between">
            <Label htmlFor="portal-access" className="font-normal">
              Customer Portal Access
            </Label>
            <Switch
              id="portal-access"
              checked={formData.portalAccess}
              onCheckedChange={checked => handleInputChange('portalAccess', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="auto-collection" className="font-normal">
              Automatic Payment Collection
            </Label>
            <Switch
              id="auto-collection"
              checked={formData.autoCollection}
              onCheckedChange={checked => handleInputChange('autoCollection', checked)}
            />
          </div>
        </div>
      </div>
    </FormSheet>
  )
}
