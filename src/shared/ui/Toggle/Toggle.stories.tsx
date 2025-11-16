import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { Toggle } from './Toggle'

const meta: Meta<typeof Toggle> = {
  title: 'UI/Form/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Toggle state',
    },
    label: {
      control: 'text',
      description: 'Label text',
    },
    description: {
      control: 'text',
      description: 'Description text below label',
    },
    size: {
      control: 'select',
      options: ['sm', 'lg'],
      description: 'Toggle size',
    },
    color: {
      control: 'select',
      options: ['cyan', 'green', 'blue', 'primary'],
      description: 'Color variant',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables toggle',
    },
  },
}

export default meta
type Story = StoryObj<typeof Toggle>

export const Basic: Story = {
  args: {
    label: 'Enable notifications',
    checked: false,
  },
}

export const Checked: Story = {
  args: {
    label: 'Feature enabled',
    checked: true,
  },
}

export const WithDescription: Story = {
  args: {
    label: 'Email notifications',
    description: 'Receive email updates about your account',
    checked: false,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled toggle',
    checked: false,
    disabled: true,
  },
}

// Colors
export const Cyan: Story = {
  args: {
    label: 'Cyan color',
    color: 'cyan',
    checked: true,
  },
}

export const Green: Story = {
  args: {
    label: 'Green color',
    color: 'green',
    checked: true,
  },
}

export const Blue: Story = {
  args: {
    label: 'Blue color',
    color: 'blue',
    checked: true,
  },
}

export const Primary: Story = {
  args: {
    label: 'Primary color',
    color: 'primary',
    checked: true,
  },
}

// Sizes
export const Small: Story = {
  args: {
    label: 'Small toggle',
    size: 'sm',
    checked: true,
  },
}

export const Large: Story = {
  args: {
    label: 'Large toggle',
    size: 'lg',
    checked: true,
  },
}

// Interactive
export const Interactive: Story = {
  render: () => {
    const [enabled, setEnabled] = useState(false)

    return (
      <div className="p-6 bg-[#0a0a0a]">
        <Toggle
          label="Feature toggle"
          description={`Status: ${enabled ? 'Enabled' : 'Disabled'}`}
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
      </div>
    )
  },
}

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6 p-6 bg-[#0a0a0a]">
      <div className="space-y-4">
        <h3 className="text-sm font-normal text-white mb-2">Colors</h3>
        <Toggle label="Cyan" color="cyan" checked />
        <Toggle label="Green" color="green" checked />
        <Toggle label="Blue" color="blue" checked />
        <Toggle label="Primary" color="primary" checked />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-normal text-white mb-2">Sizes</h3>
        <Toggle label="Small" size="sm" checked />
        <Toggle label="Large" size="lg" checked />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-normal text-white mb-2">States</h3>
        <Toggle label="Unchecked" checked={false} />
        <Toggle label="Checked" checked={true} />
        <Toggle label="With description" description="Additional context information" checked />
        <Toggle label="Disabled" disabled checked />
      </div>
    </div>
  ),
}

