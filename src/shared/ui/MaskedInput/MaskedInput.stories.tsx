import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { MaskedInput } from './MaskedInput'

const meta: Meta<typeof MaskedInput> = {
  title: 'UI/Form/MaskedInput',
  component: MaskedInput,
  tags: ['autodocs'],
  argTypes: {
    mask: {
      control: 'select',
      options: ['phone', 'creditCard', 'ssn', 'zipCode'],
      description: 'Predefined mask type',
    },
    value: {
      control: 'text',
      description: 'Unmasked value (raw digits)',
    },
    required: {
      control: 'boolean',
      description: 'Required field',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
}

export default meta
type Story = StoryObj<typeof MaskedInput>

export const Phone: Story = {
  args: {
    label: 'Phone Number',
    mask: 'phone',
    placeholder: '(555) 123-4567',
  },
}

export const CreditCard: Story = {
  args: {
    label: 'Credit Card',
    mask: 'creditCard',
    placeholder: '1234 5678 9012 3456',
  },
}

export const SSN: Story = {
  args: {
    label: 'Social Security Number',
    mask: 'ssn',
    placeholder: '123-45-6789',
  },
}

export const ZipCode: Story = {
  args: {
    label: 'ZIP Code',
    mask: 'zipCode',
    placeholder: '12345',
  },
}

export const CustomMask: Story = {
  args: {
    label: 'Custom Pattern',
    mask: '##-###-##',
    placeholder: '12-345-67',
    helperText: 'Custom mask: ##-###-##',
  },
}

export const Required: Story = {
  args: {
    label: 'Phone Number',
    mask: 'phone',
    required: true,
  },
}

export const WithError: Story = {
  args: {
    label: 'Phone Number',
    mask: 'phone',
    value: '555',
    error: 'Please enter a complete phone number',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Phone Number',
    mask: 'phone',
    value: '5551234567',
    disabled: true,
  },
}

// Interactive examples
export const PhoneInteractive: Story = {
  render: () => {
    const [phone, setPhone] = useState('')

    return (
      <div className="p-6 bg-[#0a0a0a] space-y-4">
        <MaskedInput
          label="Phone Number"
          mask="phone"
          value={phone}
          onChange={setPhone}
          helperText="Type digits only - formatting is automatic"
        />
        <div className="p-4 bg-[#171719] border border-[#333333] rounded-lg">
          <p className="text-xs text-white/60">Raw value (unmasked):</p>
          <p className="text-sm text-white">{phone || '(empty)'}</p>
          <p className="text-xs text-white/60 mt-1">Digits: {phone.length}</p>
        </div>
      </div>
    )
  },
}

export const CreditCardInteractive: Story = {
  render: () => {
    const [cardNumber, setCardNumber] = useState('')

    return (
      <div className="p-6 bg-[#0a0a0a] space-y-4">
        <MaskedInput
          label="Credit Card Number"
          mask="creditCard"
          value={cardNumber}
          onChange={setCardNumber}
          helperText="Enter 16 digits"
        />
        <div className="p-4 bg-[#171719] border border-[#333333] rounded-lg">
          <p className="text-xs text-white/60">Unmasked value:</p>
          <p className="text-sm text-white font-mono">{cardNumber || '(empty)'}</p>
        </div>
      </div>
    )
  },
}

// All masks showcase
export const AllMasks: Story = {
  render: () => (
    <div className="space-y-4 p-6 bg-[#0a0a0a]">
      <MaskedInput label="Phone" mask="phone" value="5551234567" onChange={() => {}} />
      <MaskedInput label="Credit Card" mask="creditCard" value="1234567890123456" onChange={() => {}} />
      <MaskedInput label="SSN" mask="ssn" value="123456789" onChange={() => {}} />
      <MaskedInput label="ZIP Code" mask="zipCode" value="12345" onChange={() => {}} />
      <MaskedInput label="Custom (##-###)" mask="##-###" value="12345" onChange={() => {}} />
    </div>
  ),
}

