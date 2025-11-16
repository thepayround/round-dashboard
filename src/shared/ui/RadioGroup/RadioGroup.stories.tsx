import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { RadioGroup } from './RadioGroup'

const meta: Meta<typeof RadioGroup> = {
  title: 'UI/Form/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Group label',
    },
    error: {
      control: 'text',
      description: 'Error message',
    },
  },
}

export default meta
type Story = StoryObj<typeof RadioGroup>

const sizeOptions = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '200+', label: '200+ employees' },
]

const planOptions = [
  { value: 'free', label: 'Free', description: '$0/month - Basic features' },
  { value: 'pro', label: 'Pro', description: '$29/month - Advanced features' },
  { value: 'enterprise', label: 'Enterprise', description: 'Custom pricing - All features' },
]

export const Basic: Story = {
  args: {
    label: 'Company Size',
    options: sizeOptions,
    value: '1-10',
    onValueChange: action('onValueChange'),
  },
}

export const WithDescriptions: Story = {
  args: {
    label: 'Select Plan',
    options: planOptions,
    value: 'pro',
    onValueChange: action('onValueChange'),
  },
}

export const WithError: Story = {
  args: {
    label: 'Account Type',
    options: [
      { value: 'personal', label: 'Personal' },
      { value: 'business', label: 'Business' },
    ],
    error: 'Please select an account type',
    onValueChange: action('onValueChange'),
  },
}

export const ReadOnly: Story = {
  args: {
    label: 'Account Type (Read Only)',
    options: [
      { value: 'personal', label: 'Personal' },
      { value: 'business', label: 'Business' },
    ],
    value: 'personal',
    onValueChange: action('onValueChange'),
  },
}

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [selected, setSelected] = useState('pro')

    return (
      <div className="p-6 bg-[#0a0a0a]">
        <RadioGroup
          label="Choose your plan"
          options={planOptions}
          value={selected}
          onValueChange={setSelected}
        />
        <div className="mt-4 p-4 bg-[#171719] border border-[#333333] rounded-lg">
          <p className="text-xs text-white/60">Selected plan:</p>
          <p className="text-sm text-white">{selected}</p>
        </div>
      </div>
    )
  },
}

// All states
export const AllStates: Story = {
  render: () => (
    <div className="space-y-6 p-6 bg-[#0a0a0a]">
      <RadioGroup
        label="Default"
        options={sizeOptions}
        value="1-10"
        onValueChange={() => {}}
      />
      <RadioGroup
        label="With descriptions"
        options={planOptions}
        value="pro"
        onValueChange={() => {}}
      />
      <RadioGroup
        label="With error"
        options={sizeOptions}
        error="Please select a company size"
        onValueChange={() => {}}
      />
      <RadioGroup
        label="No selection"
        options={sizeOptions}
        onValueChange={() => {}}
      />
    </div>
  ),
}

