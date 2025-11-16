import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { Autocomplete } from './Autocomplete'

const meta: Meta<typeof Autocomplete> = {
  title: 'UI/Form/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Current input value',
    },
    showSearchIcon: {
      control: 'boolean',
      description: 'Show search icon',
    },
    maxSuggestions: {
      control: 'number',
      description: 'Maximum suggestions to display',
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
type Story = StoryObj<typeof Autocomplete>

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Australia',
  'Japan',
  'China',
]

const emails = [
  'john@gmail.com',
  'jane@yahoo.com',
  'bob@outlook.com',
  'alice@company.com',
  'charlie@example.com',
]

const cities = [
  { value: 'nyc', label: 'New York City', description: 'New York, United States' },
  { value: 'lon', label: 'London', description: 'England, United Kingdom' },
  { value: 'tok', label: 'Tokyo', description: 'Japan' },
  { value: 'par', label: 'Paris', description: 'France' },
  { value: 'ber', label: 'Berlin', description: 'Germany' },
]

export const Basic: Story = {
  args: {
    label: 'Country',
    suggestions: countries,
    placeholder: 'Start typing...',
  },
}

export const WithDescriptions: Story = {
  args: {
    label: 'City',
    suggestions: cities,
    placeholder: 'Search cities...',
  },
}

export const EmailSuggestions: Story = {
  args: {
    label: 'Email',
    suggestions: emails,
    placeholder: 'Type to see suggestions...',
    showSearchIcon: true,
  },
}

export const WithoutIcon: Story = {
  args: {
    label: 'Search',
    suggestions: countries,
    showSearchIcon: false,
  },
}

export const MaxSuggestions: Story = {
  args: {
    label: 'Country (max 3)',
    suggestions: countries,
    maxSuggestions: 3,
    helperText: 'Showing max 3 suggestions',
  },
}

export const Required: Story = {
  args: {
    label: 'Required Field',
    suggestions: countries,
    required: true,
  },
}

export const WithError: Story = {
  args: {
    label: 'Country',
    suggestions: countries,
    value: 'Inv',
    error: 'Please select a valid country',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Country',
    suggestions: countries,
    value: 'United States',
    disabled: true,
  },
}

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const [selected, setSelected] = useState('')

    return (
      <div className="p-6 bg-[#0a0a0a] space-y-4">
        <Autocomplete
          label="Select Country"
          value={value}
          onChange={setValue}
          onSelect={(val) => {
            setValue(val)
            setSelected(val)
          }}
          suggestions={countries}
          placeholder="Start typing to see suggestions..."
          helperText="Type to filter, use ↑↓ to navigate, Enter to select"
        />
        {selected && (
          <div className="p-4 bg-[#171719] border border-[#333333] rounded-lg">
            <p className="text-xs text-white/60">Selected:</p>
            <p className="text-sm text-white">{selected}</p>
          </div>
        )}
      </div>
    )
  },
}

// Keyboard navigation demo
export const KeyboardNavigation: Story = {
  render: () => {
    const [value, setValue] = useState('')

    return (
      <div className="p-6 bg-[#0a0a0a]">
        <Autocomplete
          label="Try Keyboard Navigation"
          value={value}
          onChange={setValue}
          suggestions={countries}
          placeholder="Type, then use arrow keys..."
          helperText="⬆️ Up | ⬇️ Down | ⏎ Enter to select | Esc to close"
        />
      </div>
    )
  },
}

// With descriptions
export const CitySearch: Story = {
  render: () => {
    const [value, setValue] = useState('')

    return (
      <div className="p-6 bg-[#0a0a0a]">
        <Autocomplete
          label="Search Cities"
          value={value}
          onChange={setValue}
          suggestions={cities}
          placeholder="New York, London, Tokyo..."
          maxSuggestions={10}
        />
      </div>
    )
  },
}

// All states
export const AllStates: Story = {
  render: () => (
    <div className="space-y-4 p-6 bg-[#0a0a0a]">
      <Autocomplete
        label="Default"
        suggestions={countries}
        onChange={() => {}}
      />
      <Autocomplete
        label="With value"
        value="United"
        suggestions={countries}
        onChange={() => {}}
      />
      <Autocomplete
        label="With descriptions"
        suggestions={cities}
        onChange={() => {}}
      />
      <Autocomplete
        label="Required"
        suggestions={countries}
        required
        onChange={() => {}}
      />
      <Autocomplete
        label="With error"
        value="Invalid"
        suggestions={countries}
        error="Please select a valid option"
        onChange={() => {}}
      />
      <Autocomplete
        label="Disabled"
        value="United States"
        suggestions={countries}
        disabled
        onChange={() => {}}
      />
    </div>
  ),
}

