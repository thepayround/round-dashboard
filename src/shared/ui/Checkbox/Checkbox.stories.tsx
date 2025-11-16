import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { Checkbox } from './Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Form/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'radio',
      options: [true, false, 'indeterminate'],
      description: 'Checked state',
    },
    label: {
      control: 'text',
      description: 'Label text',
    },
    helperText: {
      control: 'text',
      description: 'Helper text below checkbox',
    },
    error: {
      control: 'text',
      description: 'Error message',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables checkbox',
    },
  },
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Unchecked: Story = {
  args: {
    checked: false,
    label: 'Accept terms and conditions',
  },
}

export const Checked: Story = {
  args: {
    checked: true,
    label: 'I agree to the terms',
  },
}

export const Indeterminate: Story = {
  args: {
    checked: 'indeterminate',
    label: 'Select all items (some selected)',
  },
}

export const WithHelperText: Story = {
  args: {
    checked: false,
    label: 'Subscribe to newsletter',
    helperText: 'We will send you updates once a week',
  },
}

export const WithError: Story = {
  args: {
    checked: false,
    label: 'I agree to terms',
    error: 'You must accept the terms to continue',
  },
}

export const Disabled: Story = {
  args: {
    checked: true,
    label: 'This option is disabled',
    disabled: true,
  },
}

export const WithoutLabel: Story = {
  args: {
    checked: false,
    'aria-label': 'Select item',
  },
}

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)

    return (
      <div className="p-6 bg-[#0a0a0a]">
        <Checkbox
          checked={checked}
          onCheckedChange={(value) => setChecked(!!value)}
          label="Click to toggle"
          helperText={`Current state: ${checked ? 'Checked' : 'Unchecked'}`}
        />
      </div>
    )
  },
}

// Multiple checkboxes
export const MultipleOptions: Story = {
  render: () => {
    const [options, setOptions] = useState({
      email: true,
      push: false,
      sms: false,
    })

    return (
      <div className="space-y-4 p-6 bg-[#0a0a0a]">
        <h3 className="text-sm font-normal text-white mb-4">Notification Preferences</h3>
        <Checkbox
          checked={options.email}
          onCheckedChange={(checked) => setOptions({ ...options, email: !!checked })}
          label="Email notifications"
        />
        <Checkbox
          checked={options.push}
          onCheckedChange={(checked) => setOptions({ ...options, push: !!checked })}
          label="Push notifications"
        />
        <Checkbox
          checked={options.sms}
          onCheckedChange={(checked) => setOptions({ ...options, sms: !!checked })}
          label="SMS notifications"
        />
      </div>
    )
  },
}

// All states showcase
export const AllStates: Story = {
  render: () => (
    <div className="space-y-4 p-6 bg-[#0a0a0a]">
      <Checkbox checked={false} label="Unchecked" />
      <Checkbox checked={true} label="Checked" />
      <Checkbox checked="indeterminate" label="Indeterminate" />
      <Checkbox checked={false} label="With helper text" helperText="Additional information" />
      <Checkbox checked={false} label="With error" error="This field is required" />
      <Checkbox checked={true} label="Disabled" disabled />
    </div>
  ),
}

