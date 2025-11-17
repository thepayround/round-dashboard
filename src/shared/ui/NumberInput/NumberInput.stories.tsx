import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { NumberInput } from './NumberInput'

const meta: Meta<typeof NumberInput> = {
  title: 'UI/Form/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: 'Current numeric value',
    },
    min: {
      control: 'number',
      description: 'Minimum allowed value',
    },
    max: {
      control: 'number',
      description: 'Maximum allowed value',
    },
    step: {
      control: 'number',
      description: 'Increment/decrement step',
    },
    showControls: {
      control: 'boolean',
      description: 'Show increment/decrement buttons',
    },
    required: {
      control: 'boolean',
      description: 'Required field indicator',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
}

export default meta
type Story = StoryObj<typeof NumberInput>

export const Basic: Story = {
  args: {
    label: 'Quantity',
    value: 1,
    min: 1,
    max: 100,
  },
}

export const WithButtons: Story = {
  args: {
    label: 'Amount',
    value: 50,
    min: 0,
    max: 100,
    step: 5,
    showControls: true,
  },
}

export const Currency: Story = {
  args: {
    label: 'Price',
    value: 99.99,
    min: 0,
    step: 0.01,
    placeholder: '0.00',
  },
}

export const WithRange: Story = {
  args: {
    label: 'Team Size',
    value: 10,
    min: 1,
    max: 1000,
    step: 1,
    helperText: 'Between 1 and 1000',
  },
}

export const Required: Story = {
  args: {
    label: 'Required Number',
    value: 0,
    required: true,
  },
}

export const WithError: Story = {
  args: {
    label: 'Invalid Value',
    value: -5,
    error: 'Value must be positive',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    value: 42,
    disabled: true,
  },
}

export const WithoutButtons: Story = {
  args: {
    label: 'Manual Entry Only',
    value: 25,
    showControls: false,
    helperText: 'Use keyboard arrows or type the number',
  },
}

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState<number | undefined>(10)

    return (
      <div className="p-6 bg-[#0a0a0a] space-y-4">
        <NumberInput
          label="Quantity"
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          step={5}
          helperText="Use buttons, keyboard arrows, or type directly"
        />
        <div className="p-4 bg-[#171719] border border-[#333333] rounded-lg">
          <p className="text-xs text-white/60">Current value:</p>
          <p className="text-lg text-white font-normal">{value ?? 'undefined'}</p>
        </div>
      </div>
    )
  },
}

// Keyboard demo
export const KeyboardControl: Story = {
  render: () => {
    const [value, setValue] = useState<number | undefined>(5)

    return (
      <div className="p-6 bg-[#0a0a0a]">
        <NumberInput
          label="Use Arrow Keys"
          value={value}
          onChange={setValue}
          min={0}
          max={10}
          helperText="⬆️ Arrow Up to increase, ⬇️ Arrow Down to decrease"
        />
      </div>
    )
  },
}

// All states showcase
export const AllStates: Story = {
  render: () => (
    <div className="space-y-4 p-6 bg-[#0a0a0a]">
      <NumberInput label="Default" value={10} onChange={() => {}} />
      <NumberInput label="With range" value={50} min={0} max={100} onChange={() => {}} />
      <NumberInput label="Currency" value={99.99} step={0.01} onChange={() => {}} />
      <NumberInput label="Required" value={1} required onChange={() => {}} />
      <NumberInput label="With error" value={-1} error="Must be positive" onChange={() => {}} />
      <NumberInput label="With helper" value={5} helperText="Enter a number between 1-10" onChange={() => {}} />
      <NumberInput label="Disabled" value={42} disabled onChange={() => {}} />
      <NumberInput label="Without buttons" value={25} showControls={false} onChange={() => {}} />
    </div>
  ),
}

