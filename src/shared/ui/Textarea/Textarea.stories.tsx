import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { Textarea } from './Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'UI/Form/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text above textarea',
    },
    error: {
      control: 'text',
      description: 'Error message',
    },
    helperText: {
      control: 'text',
      description: 'Helper text below textarea',
    },
    rows: {
      control: 'number',
      description: 'Number of visible text rows',
    },
    required: {
      control: 'boolean',
      description: 'Shows * indicator',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables textarea',
    },
  },
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Basic: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter a description...',
  },
}

export const WithRows: Story = {
  args: {
    label: 'Comments',
    placeholder: 'Enter your comments...',
    rows: 6,
  },
}

export const Required: Story = {
  args: {
    label: 'Feedback',
    placeholder: 'Your feedback is important to us',
    required: true,
  },
}

export const WithError: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter description...',
    error: 'Description must be at least 10 characters',
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    helperText: 'Maximum 500 characters',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled textarea',
    value: 'This content cannot be edited',
    disabled: true,
  },
}

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const maxLength = 200

    return (
      <div className="p-6 bg-[#0a0a0a]">
        <Textarea
          label="Message"
          placeholder="Type your message..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          helperText={`${value.length}/${maxLength} characters`}
          maxLength={maxLength}
          rows={4}
        />
      </div>
    )
  },
}

// All variants
export const AllStates: Story = {
  render: () => (
    <div className="space-y-4 p-6 bg-[#0a0a0a]">
      <Textarea label="Default" placeholder="Enter text..." />
      <Textarea label="With value" value="This is some text content" />
      <Textarea label="Required" placeholder="Required field" required />
      <Textarea label="With error" error="This field is required" />
      <Textarea label="With helper" helperText="Maximum 500 characters" />
      <Textarea label="Disabled" value="Disabled content" disabled />
    </div>
  ),
}

