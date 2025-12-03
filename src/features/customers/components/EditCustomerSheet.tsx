import { Building2, Copy, User, X } from 'lucide-react'
import React from 'react'

import { useEditCustomerModalController } from '../hooks/useEditCustomerModalController'

import { useCountries } from '@/shared/hooks/api/useCountryCurrency'
import { useTimezones, useLanguages } from '@/shared/hooks/api/useUserSettingsOptions'
import type { CustomerResponse } from '@/shared/services/api/customer.service'
import { CustomerType } from '@/shared/types/customer.types'
import { AddressFormGroup, type Address } from '@/shared/ui'
import { Combobox } from '@/shared/ui/Combobox'
import type { ComboboxOption } from '@/shared/ui/Combobox/types'
import { CurrencySelect } from '@/shared/ui/CurrencySelect'
import { FormSheet } from '@/shared/ui/FormSheet'
import { PhoneInput } from '@/shared/ui/PhoneInput'
import { Badge } from '@/shared/ui/shadcn/badge'
import { Button } from '@/shared/ui/shadcn/button'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
import { Switch } from '@/shared/ui/shadcn/switch'

export type EditCustomerSection =
  | 'contact'
  | 'preferences'
  | 'billing-address'
  | 'shipping-address'
  | 'tags'
  | 'settings'

interface EditCustomerSheetProps {
  isOpen: boolean
  onClose: () => void
  customer: CustomerResponse
  onCustomerUpdated: (updatedCustomer: CustomerResponse) => void
  /** Optional section to show. If provided, only that section is displayed. If not provided, all sections are shown. */
  initialSection?: EditCustomerSection
}

const SECTION_TITLES: Record<EditCustomerSection, string> = {
  contact: 'Contact Information',
  preferences: 'Preferences',
  'billing-address': 'Billing Address',
  'shipping-address': 'Shipping Address',
  tags: 'Tags',
  settings: 'Account Settings',
}

export const EditCustomerSheet: React.FC<EditCustomerSheetProps> = ({
  isOpen,
  onClose,
  customer,
  onCustomerUpdated,
  initialSection,
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

  // Determine title based on section
  const sheetTitle = initialSection ? `Edit ${SECTION_TITLES[initialSection]}` : 'Edit Customer'
  const sheetDescription = initialSection
    ? `Update ${customer.effectiveDisplayName}'s ${SECTION_TITLES[initialSection].toLowerCase()}`
    : `Update ${customer.effectiveDisplayName}'s information`

  // Helper to check if a section should be shown
  const showSection = (section: EditCustomerSection) => !initialSection || initialSection === section

  // Contact Information Section
  const renderContactSection = () => (
    <div className="space-y-4">
      {!initialSection && <h3 className="text-sm font-medium">Contact Information</h3>}

      {/* Customer Type Indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {isBusinessCustomer ? (
          <>
            <Building2 className="h-4 w-4" />
            <span>Business Customer</span>
          </>
        ) : (
          <>
            <User className="h-4 w-4" />
            <span>Individual Customer</span>
          </>
        )}
      </div>

      {isBusinessCustomer ? (
        <>
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

          <div className="space-y-1.5">
            <Label htmlFor="firstName">Contact First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={e => handleInputChange('firstName', e.target.value)}
              placeholder="First name"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lastName">Contact Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={e => handleInputChange('lastName', e.target.value)}
              placeholder="Last name"
            />
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
              placeholder="contact@company.com"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phoneNumber">Phone</Label>
            <PhoneInput
              key={`phone-business-${customer.id}`}
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              validateOnBlur={false}
              placeholder="Phone number"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="taxNumber">Tax ID</Label>
            <Input
              id="taxNumber"
              value={formData.taxNumber}
              onChange={e => handleInputChange('taxNumber', e.target.value)}
              placeholder="Tax ID"
            />
          </div>
        </>
      ) : (
        <>
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
              key={`phone-individual-${customer.id}`}
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              validateOnBlur={false}
              placeholder="Phone number"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="taxNumber">Tax ID</Label>
            <Input
              id="taxNumber"
              value={formData.taxNumber}
              onChange={e => handleInputChange('taxNumber', e.target.value)}
              placeholder="Tax identification number"
            />
          </div>
        </>
      )}
    </div>
  )

  // Preferences Section
  const renderPreferencesSection = () => (
    <div className="space-y-4">
      {!initialSection && <h3 className="text-sm font-medium">Preferences</h3>}

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
  )

  // Billing Address Section
  const renderBillingAddressSection = () => (
    <div className="space-y-4">
      {!initialSection && <h3 className="text-sm font-medium">Billing Address</h3>}
      <AddressFormGroup
        value={billingAddress}
        onChange={(address: Address) => {
          for (const [field, value] of Object.entries(address)) {
            handleAddressChange('billing', field as keyof Address, value)
          }
        }}
        countries={countries.map(c => ({ code: c.countryCodeAlpha2, name: c.countryName }))}
      />
    </div>
  )

  // Shipping Address Section
  const renderShippingAddressSection = () => (
    <div className="space-y-4">
      {!initialSection && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Shipping Address</h3>
          <Button
            type="button"
            onClick={handleCopyBillingToShipping}
            variant="ghost"
            size="sm"
            className="h-auto py-1 px-2 text-xs"
          >
            <Copy className="mr-1 h-3 w-3" />
            Copy from billing
          </Button>
        </div>
      )}
      {initialSection && (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleCopyBillingToShipping}
            variant="ghost"
            size="sm"
            className="h-auto py-1 px-2 text-xs"
          >
            <Copy className="mr-1 h-3 w-3" />
            Copy from billing
          </Button>
        </div>
      )}

      <AddressFormGroup
        value={shippingAddress}
        onChange={(address: Address) => {
          for (const [field, value] of Object.entries(address)) {
            handleAddressChange('shipping', field as keyof Address, value)
          }
        }}
        countries={countries.map(c => ({ code: c.countryCodeAlpha2, name: c.countryName }))}
      />
    </div>
  )

  // Tags Section
  const renderTagsSection = () => (
    <div className="space-y-4">
      {!initialSection && <h3 className="text-sm font-medium">Tags</h3>}

      {formData.tags && formData.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {formData.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="gap-1 pr-1">
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={newTag}
          onChange={e => handleTagInputChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
          placeholder="Add a tag..."
          className="flex-1"
        />
        <Button type="button" onClick={handleAddTag} variant="secondary" size="default">
          Add
        </Button>
      </div>
    </div>
  )

  // Settings Section
  const renderSettingsSection = () => (
    <div className="space-y-4">
      {!initialSection && <h3 className="text-sm font-medium">Settings</h3>}

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
  )

  return (
    <FormSheet
      open={isOpen}
      onOpenChange={onClose}
      title={sheetTitle}
      description={sheetDescription}
      size={initialSection ? 'default' : 'lg'}
      submitLabel="Save Changes"
      onSubmit={handleSubmit}
      isSubmitting={isSaving}
    >
      <div className="space-y-6">
        {showSection('contact') && renderContactSection()}
        {showSection('preferences') && renderPreferencesSection()}
        {showSection('billing-address') && renderBillingAddressSection()}
        {showSection('shipping-address') && renderShippingAddressSection()}
        {showSection('tags') && renderTagsSection()}
        {showSection('settings') && renderSettingsSection()}
      </div>
    </FormSheet>
  )
}
