import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { countryDropdownConfig } from '../ApiDropdown'

import { AddressFormGroup } from './AddressFormGroup'
import type { Address } from './types'

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
    countryDropdownConfig,
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Billing Address',
    value: defaultAddress,
    onChange: () => {},
    countryDropdownConfig,
  },
}

export const Filled: Story = {
  args: {
    label: 'Shipping Address',
    value: filledAddress,
    onChange: () => {},
    countryDropdownConfig,
  },
}

export const Required: Story = {
  args: {
    label: 'Billing Address',
    value: defaultAddress,
    onChange: () => {},
    required: true,
    countryDropdownConfig,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Billing Address',
    value: filledAddress,
    onChange: () => {},
    disabled: true,
    countryDropdownConfig,
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
    countryDropdownConfig,
  },
}

export const Interactive: Story = {
  args: {
    value: defaultAddress,
    onChange: () => {},
    countryDropdownConfig,
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
          countryDropdownConfig={countryDropdownConfig}
        />
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <h4 className="text-sm font-medium text-white mb-2">Address Data:</h4>
          <pre className="text-xs text-white/70">
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
    countryDropdownConfig,
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
          countryDropdownConfig={countryDropdownConfig}
        />
        <div className="border-t border-white/10 pt-8">
          <AddressFormGroup
            label="Shipping Address"
            value={shippingAddress}
            onChange={setShippingAddress}
            countryDropdownConfig={countryDropdownConfig}
          />
        </div>
      </div>
    )
  },
}
