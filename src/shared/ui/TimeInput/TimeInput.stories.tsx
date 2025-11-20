import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { TimeInput } from './TimeInput'

const meta: Meta<typeof TimeInput> = {
  title: 'UI/Form/TimeInput',
  component: TimeInput,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Time value (HH:MM)',
    },
    min: {
      control: 'text',
      description: 'Minimum time (HH:MM)',
    },
    max: {
      control: 'text',
      description: 'Maximum time (HH:MM)',
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
type Story = StoryObj<typeof TimeInput>

export const Basic: Story = {
  args: {
    label: 'Meeting Time',
  },
}

export const WithValue: Story = {
  args: {
    label: 'Start Time',
    value: '09:00',
  },
}

export const WithRange: Story = {
  args: {
    label: 'Appointment',
    value: '14:30',
    min: '09:00',
    max: '17:00',
    helperText: 'Business hours only (9 AM - 5 PM)',
  },
}

export const Required: Story = {
  args: {
    label: 'Shift Start',
    required: true,
  },
}

export const WithError: Story = {
  args: {
    label: 'Meeting Time',
    value: '23:00',
    error: 'Time must be during business hours',
  },
}

export const Disabled: Story = {
  args: {
    label: 'System Time',
    value: '12:00',
    disabled: true,
  },
}

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [time, setTime] = useState('')

    return (
      <div className="p-6 bg-[#0a0a0a] space-y-4">
        <TimeInput
          label="Select Time"
          value={time}
          onChange={setTime}
          helperText="Click the clock icon to open time picker"
        />
        {time && (
          <div className="p-4 bg-[#171719] border border-[#333333] rounded-lg">
            <p className="text-xs text-white/60">Selected time:</p>
            <p className="text-sm text-white">{time}</p>
            <p className="text-xs text-white/60 mt-1">
              12-hour: {new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </p>
          </div>
        )}
      </div>
    )
  },
}

// Time range example
export const TimeRange: Story = {
  render: () => {
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')

    return (
      <div className="p-6 bg-[#0a0a0a]">
        <div className="grid grid-cols-2 gap-4">
          <TimeInput
            label="Start Time"
            value={startTime}
            onChange={setStartTime}
            max={endTime || undefined}
          />
          <TimeInput
            label="End Time"
            value={endTime}
            onChange={setEndTime}
            min={startTime || undefined}
            disabled={!startTime}
            helperText={!startTime ? 'Select start time first' : undefined}
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
      <TimeInput label="Default" />
      <TimeInput label="With value" value="14:30" />
      <TimeInput label="Business hours" min="09:00" max="17:00" helperText="9 AM to 5 PM only" />
      <TimeInput label="Required" required />
      <TimeInput label="With error" value="23:00" error="Outside business hours" />
      <TimeInput label="Disabled" value="12:00" disabled />
    </div>
  ),
}

