import type { Meta, StoryObj } from '@storybook/react'
import { Mail, User, Lock, Search, DollarSign } from 'lucide-react'
import { useState } from 'react'

import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'UI/Form/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text above input',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'Input type',
    },
    error: {
      control: 'text',
      description: 'Error message',
    },
    helperText: {
      control: 'text',
      description: 'Helper text below input',
    },
    required: {
      control: 'boolean',
      description: 'Shows * indicator',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables input',
    },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Basic: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    type: 'email',
  },
}

export const WithIcon: Story = {
  args: {
    label: 'Email',
    leftIcon: Mail,
    placeholder: 'john@example.com',
    type: 'email',
  },
}

export const Required: Story = {
  args: {
    label: 'Company Name',
    leftIcon: User,
    placeholder: 'Acme Inc.',
    required: true,
  },
}

export const WithError: Story = {
  args: {
    label: 'Email',
    leftIcon: Mail,
    placeholder: 'john@example.com',
    error: 'Please enter a valid email address',
    type: 'email',
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    leftIcon: Lock,
    type: 'password',
    helperText: 'Must be at least 8 characters',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Email',
    leftIcon: Mail,
    value: 'john@example.com',
    disabled: true,
  },
}

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const [error, setError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
      if (e.target.value && !e.target.value.includes('@')) {
        setError('Email must contain @')
      } else {
        setError('')
      }
    }

    return (
      <div className="p-6 bg-[#0a0a0a]">
        <Input
          label="Email"
          leftIcon={Mail}
          type="email"
          value={value}
          onChange={handleChange}
          error={error}
          placeholder="Try typing without @"
          helperText="Type to see validation"
        />
      </div>
    )
  },
}

// All sizes showcase
export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4 p-6 bg-[#0a0a0a]">
      <Input label="Small" size="sm" placeholder="Small size" />
      <Input label="Medium" size="md" placeholder="Medium size (default)" />
      <Input label="Large" size="lg" placeholder="Large size" />
    </div>
  ),
}

// New features
export const WithCharacterCount: Story = {
  render: () => {
    const [value, setValue] = useState('')

    return (
      <div className="p-6 bg-[#0a0a0a]">
        <Input
          label="Bio"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={100}
          showCharacterCount
          placeholder="Tell us about yourself..."
          helperText="Maximum 100 characters"
        />
      </div>
    )
  },
}

export const WithCopyButton: Story = {
  args: {
    label: 'API Key',
    value: 'sk_live_1234567890abcdef',
    readOnly: true,
    showCopyButton: true,
    helperText: 'Click the copy icon to copy to clipboard',
  },
}

export const CopyButtonInteractive: Story = {
  render: () => {
    const [copied, setCopied] = useState(false)

    return (
      <div className="p-6 bg-[#0a0a0a]">
        <Input
          label="API Token"
          value="tok_1234567890abcdef_ghijklmn"
          readOnly
          showCopyButton
          onCopy={() => setCopied(true)}
          helperText={copied ? '✅ Copied to clipboard!' : 'Click copy icon'}
        />
      </div>
    )
  },
}

// Common patterns
export const CommonPatterns: Story = {
  render: () => (
    <div className="space-y-6 p-6 bg-[#0a0a0a]">
      <Input label="Search" leftIcon={Search} placeholder="Search..." />
      <Input label="Email" leftIcon={Mail} type="email" placeholder="john@example.com" />
      <Input label="Password" leftIcon={Lock} type="password" placeholder="••••••••" />
      <Input label="Amount" leftIcon={DollarSign} type="number" placeholder="1000" />
      <Input
        label="Limited text"
        maxLength={50}
        showCharacterCount
        placeholder="Max 50 characters"
      />
      <Input
        label="Read-only with copy"
        value="Copy me!"
        readOnly
        showCopyButton
      />
    </div>
  ),
}

