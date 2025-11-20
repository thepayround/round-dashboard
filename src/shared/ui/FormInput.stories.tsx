import type { Meta, StoryObj } from '@storybook/react'
import { Mail, User, Lock, Building, Phone } from 'lucide-react'
import { useState } from 'react'

import { FormInput } from './FormInput'

const meta: Meta<typeof FormInput> = {
  title: 'UI/Form/FormInput',
  component: FormInput,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number'],
      description: 'Input type',
    },
    error: {
      control: 'text',
      description: 'Error message',
    },
    helpText: {
      control: 'text',
      description: 'Help text below input',
    },
    isLoading: {
      control: 'boolean',
      description: 'Loading state',
    },
    required: {
      control: 'boolean',
      description: 'Required field indicator',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    passwordToggle: {
      control: 'boolean',
      description: 'Show/hide password toggle',
    },
  },
}

export default meta
type Story = StoryObj<typeof FormInput>

export const Basic: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'John Doe',
  },
}

export const WithIcon: Story = {
  args: {
    label: 'Email Address',
    leftIcon: Mail,
    type: 'email',
    placeholder: 'john@example.com',
  },
}

export const Required: Story = {
  args: {
    label: 'Company Name',
    leftIcon: Building,
    placeholder: 'Acme Inc.',
    required: true,
  },
}

export const WithError: Story = {
  args: {
    label: 'Email',
    leftIcon: Mail,
    type: 'email',
    placeholder: 'john@example.com',
    error: 'Please enter a valid email address',
  },
}

export const WithHelpText: Story = {
  args: {
    label: 'Phone Number',
    leftIcon: Phone,
    type: 'tel',
    placeholder: '+1 (555) 000-0000',
    helpText: 'Include country code',
  },
}

export const Password: Story = {
  args: {
    label: 'Password',
    leftIcon: Lock,
    type: 'password',
    placeholder: '••••••••',
    passwordToggle: true,
  },
}

export const Loading: Story = {
  args: {
    label: 'Email',
    leftIcon: Mail,
    type: 'email',
    isLoading: true,
    isLoadingText: 'Checking availability...',
  },
}

export const Disabled: Story = {
  args: {
    label: 'User ID',
    leftIcon: User,
    value: 'user_12345',
    disabled: true,
  },
}

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value)
      if (e.target.value && !e.target.value.includes('@')) {
        setError('Email must contain @')
      } else {
        setError('')
      }
    }

    return (
      <div className="p-6 bg-[#0a0a0a]">
        <FormInput
          label="Email Address"
          leftIcon={Mail}
          type="email"
          value={email}
          onChange={handleChange}
          error={error}
          placeholder="Try typing without @"
          helpText="Real-time validation demo"
          required
        />
      </div>
    )
  },
}

// Form example
export const FormExample: Story = {
  render: () => (
    <div className="space-y-4 p-6 bg-[#0a0a0a]">
      <h3 className="text-base font-normal text-white mb-4">Registration Form</h3>
      <div className="grid grid-cols-2 gap-4">
        <FormInput label="First Name" leftIcon={User} placeholder="John" required />
        <FormInput label="Last Name" leftIcon={User} placeholder="Doe" required />
      </div>
      <FormInput label="Email" leftIcon={Mail} type="email" placeholder="john@example.com" required />
      <FormInput
        label="Password"
        leftIcon={Lock}
        type="password"
        placeholder="••••••••"
        passwordToggle
        required
        helpText="Must be at least 8 characters"
      />
      <FormInput label="Company" leftIcon={Building} placeholder="Acme Inc." />
    </div>
  ),
}

