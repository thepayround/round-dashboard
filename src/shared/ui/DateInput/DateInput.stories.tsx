import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { DateInput } from './DateInput'

const meta: Meta<typeof DateInput> = {
  title: 'UI/Form/DateInput',
  component: DateInput,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Date value (YYYY-MM-DD)',
    },
    min: {
      control: 'text',
      description: 'Minimum date (YYYY-MM-DD)',
    },
    max: {
      control: 'text',
      description: 'Maximum date (YYYY-MM-DD)',
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
type Story = StoryObj<typeof DateInput>

export const Basic: Story = {
  args: {
    label: 'Start Date',
  },
}

export const WithValue: Story = {
  args: {
    label: 'Birthday',
    value: '1990-01-01',
  },
}

export const WithRange: Story = {
  args: {
    label: 'Event Date',
    value: '2025-01-15',
    min: '2025-01-01',
    max: '2025-12-31',
    helperText: 'Select a date in 2025',
  },
}

export const Required: Story = {
  args: {
    label: 'Deadline',
    required: true,
    helperText: 'This field is required',
  },
}

export const WithError: Story = {
  args: {
    label: 'Invalid Date',
    value: '2024-01-01',
    error: 'Date must be in the future',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Created Date',
    value: '2024-11-16',
    disabled: true,
  },
}

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>()

    return (
      <div className="p-6 bg-[#0a0a0a] space-y-4">
        <DateInput
          label="Select Date"
          value={date}
          onChange={setDate}
          helperText="Click the calendar icon to open date picker"
        />
        {date && (
          <div className="p-4 bg-[#171719] border border-[#333333] rounded-lg">
            <p className="text-xs text-white/60">Selected date:</p>
            <p className="text-sm text-white">
              {date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        )}
      </div>
    )
  },
}

// Date range example
export const DateRange: Story = {
  render: () => {
    const [startDate, setStartDate] = useState<Date | undefined>()
    const [endDate, setEndDate] = useState<Date | undefined>()

    return (
      <div className="p-6 bg-[#0a0a0a]">
        <div className="grid grid-cols-2 gap-4">
          <DateInput
            label="Start Date"
            value={startDate}
            onChange={(value) => {
              setStartDate(value)
              // Clear end date if it's before new start date
              if (endDate && value && value > endDate) {
                setEndDate(undefined)
              }
            }}
            max={endDate}
          />
          <DateInput
            label="End Date"
            value={endDate}
            onChange={setEndDate}
            min={startDate}
            disabled={!startDate}
            helperText={!startDate ? 'Select start date first' : undefined}
          />
        </div>
      </div>
    )
  },
}

// All states showcase
export const AllStates: Story = {
  render: () => (
    <div className="space-y-4 p-6 bg-[#0a0a0a]">
      <DateInput label="Default" />
      <DateInput label="With value" value="2025-01-15" />
      <DateInput label="With range" min="2025-01-01" max="2025-12-31" helperText="Year 2025 only" />
      <DateInput label="Required" required />
      <DateInput label="With error" value="2024-01-01" error="Date must be in the future" />
      <DateInput label="Disabled" value="2024-11-16" disabled />
    </div>
  ),
}

