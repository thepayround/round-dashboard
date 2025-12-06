import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { AddressFormGroup } from './AddressFormGroup'
import type { CountryOption } from './AddressFormGroup'
import type { Address } from './types'

// Mock country data for stories
const countries: CountryOption[] = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
]

const meta = {
  title: 'UI/AddressFormGroup',
  component: AddressFormGroup,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AddressFormGroup>

export default meta
type Story = StoryObj<typeof meta>

const defaultAddress: Address = {
  line1: '',
  line2: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
}

const filledAddress: Address = {
  line1: '123 Main Street',
  line2: 'Suite 100',
  city: 'San Francisco',
  state: 'CA',
  zipCode: '94102',
  country: 'US',
}

export const Default: Story = {
  args: {
    value: defaultAddress,
    onChange: () => {},
    countries,
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Billing Address',
    value: defaultAddress,
    onChange: () => {},
    countries,
  },
}

export const Filled: Story = {
  args: {
    label: 'Shipping Address',
    value: filledAddress,
    onChange: () => {},
    countries,
  },
}

export const Required: Story = {
  args: {
    label: 'Billing Address',
    value: defaultAddress,
    onChange: () => {},
    required: true,
    countries,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Billing Address',
    value: filledAddress,
    onChange: () => {},
    disabled: true,
    countries,
  },
}

export const WithErrors: Story = {
  args: {
    label: 'Billing Address',
    value: defaultAddress,
    onChange: () => {},
    required: true,
    errors: {
      line1: 'Address Line 1 is required',
      city: 'City is required',
      zipCode: 'ZIP code is required',
      country: 'Country is required',
    },
    countries,
  },
}

export const Interactive: Story = {
  args: {
    value: defaultAddress,
    onChange: () => {},
    countries,
  },
  render: () => {
    const [address, setAddress] = useState<Address>(defaultAddress)

    return (
      <div className="space-y-6">
        <AddressFormGroup
          label="Billing Address"
          value={address}
          onChange={setAddress}
          required
          countries={countries}
        />
        <div className="p-4 bg-muted rounded-lg border border-border">
          <h4 className="text-sm font-medium text-foreground mb-2">Address Data:</h4>
          <pre className="text-xs text-muted-foreground">
            {JSON.stringify(address, null, 2)}
          </pre>
        </div>
      </div>
    )
  },
}

export const MultipleAddresses: Story = {
  args: {
    value: defaultAddress,
    onChange: () => {},
    countries,
  },
  render: () => {
    const [billingAddress, setBillingAddress] = useState<Address>(filledAddress)
    const [shippingAddress, setShippingAddress] = useState<Address>(defaultAddress)

    return (
      <div className="space-y-8">
        <AddressFormGroup
          label="Billing Address"
          value={billingAddress}
          onChange={setBillingAddress}
          required
          countries={countries}
        />
        <div className="border-t border-border pt-8">
          <AddressFormGroup
            label="Shipping Address"
            value={shippingAddress}
            onChange={setShippingAddress}
            countries={countries}
          />
        </div>
      </div>
    )
  },
}
