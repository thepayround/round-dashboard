import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import { Globe, DollarSign } from 'lucide-react'
import { useState } from 'react'

import { UiDropdown } from './UiDropdown'

const meta: Meta<typeof UiDropdown> = {
  title: 'UI/Form/UiDropdown',
  component: UiDropdown,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Selected value',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables dropdown',
    },
    error: {
      control: 'boolean',
      description: 'Error state',
    },
    isLoading: {
      control: 'boolean',
      description: 'Loading state',
    },
    allowClear: {
      control: 'boolean',
      description: 'Show clear button',
    },
    allowSearch: {
      control: 'boolean',
      description: 'Enable search functionality',
    },
  },
}

export default meta
type Story = StoryObj<typeof UiDropdown>

const countryOptions = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
]

const currencyOptions = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
]

export const Basic: Story = {
  args: {
    options: countryOptions,
    placeholder: 'Select a country...',
    onSelect: action('onSelect'),
  },
}

export const WithIcon: Story = {
  args: {
    options: countryOptions,
    placeholder: 'Select country',
    icon: <Globe className="w-4 h-4" />,
    onSelect: action('onSelect'),
  },
}

export const WithLabel: Story = {
  args: {
    options: currencyOptions,
    label: 'Currency',
    placeholder: 'Select currency',
    icon: <DollarSign className="w-4 h-4" />,
    onSelect: action('onSelect'),
  },
}

export const Searchable: Story = {
  args: {
    options: countryOptions,
    placeholder: 'Search countries...',
    allowSearch: true,
    onSelect: action('onSelect'),
  },
}

export const WithClear: Story = {
  args: {
    options: countryOptions,
    value: 'US',
    placeholder: 'Select country',
    allowClear: true,
    onSelect: action('onSelect'),
    onClear: action('onClear'),
  },
}

export const Loading: Story = {
  args: {
    options: [],
    placeholder: 'Loading...',
    isLoading: true,
    onSelect: action('onSelect'),
  },
}

export const ErrorState: Story = {
  args: {
    options: countryOptions,
    placeholder: 'Select country',
    error: true,
    onSelect: action('onSelect'),
  },
}

export const Disabled: Story = {
  args: {
    options: countryOptions,
    value: 'US',
    disabled: true,
    onSelect: action('onSelect'),
  },
}

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>(null)

    return (
      <div className="p-6 bg-[#0a0a0a]">
        <UiDropdown
          label="Country"
          options={countryOptions}
          value={selected}
          onSelect={(value) => setSelected(value)}
          onClear={() => setSelected(null)}
          placeholder="Select a country..."
          allowClear
          allowSearch
        />
        {selected && (
          <p className="mt-4 text-sm text-white/60">Selected: {selected}</p>
        )}
      </div>
    )
  },
}

// All states showcase
export const AllStates: Story = {
  render: () => (
    <div className="space-y-4 p-6 bg-[#0a0a0a]">
      <UiDropdown
        label="Default"
        options={countryOptions}
        placeholder="Select..."
        onSelect={() => {}}
      />
      <UiDropdown
        label="With value"
        options={countryOptions}
        value="US"
        onSelect={() => {}}
      />
      <UiDropdown
        label="With icon"
        options={countryOptions}
        icon={<Globe className="w-4 h-4" />}
        placeholder="Select..."
        onSelect={() => {}}
      />
      <UiDropdown
        label="Searchable"
        options={countryOptions}
        allowSearch
        placeholder="Search..."
        onSelect={() => {}}
      />
      <UiDropdown
        label="Loading"
        options={[]}
        isLoading
        placeholder="Loading..."
        onSelect={() => {}}
      />
      <UiDropdown
        label="Error state"
        options={countryOptions}
        error
        placeholder="Select..."
        onSelect={() => {}}
      />
      <UiDropdown
        label="Disabled"
        options={countryOptions}
        value="US"
        disabled
        onSelect={() => {}}
      />
    </div>
  ),
}

