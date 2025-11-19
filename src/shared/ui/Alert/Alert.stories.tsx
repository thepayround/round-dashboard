import type { Meta, StoryObj } from '@storybook/react'
import { AlertTriangle } from 'lucide-react'

import { Alert } from './Alert'

const meta = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const InfoAlert: Story = {
  args: {
    variant: 'info',
    title: 'Information',
    description: 'This is an informational message to help guide the user.',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Success',
    description: 'Your changes have been saved successfully.',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Warning',
    description: 'Please review this information carefully before proceeding.',
  },
}

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Error',
    description: 'An error occurred while processing your request.',
  },
}

export const Danger: Story = {
  args: {
    variant: 'danger',
    title: 'Danger',
    description: 'This action cannot be undone. Please proceed with caution.',
  },
}

export const WithoutTitle: Story = {
  args: {
    variant: 'info',
    description: 'This alert has no title, just a description.',
  },
}

export const CustomIcon: Story = {
  args: {
    variant: 'warning',
    title: 'Custom Icon',
    description: 'This alert uses a custom icon instead of the default.',
    icon: AlertTriangle,
  },
}

export const LongDescription: Story = {
  args: {
    variant: 'info',
    title: 'Detailed Information',
    description: 'This is a longer description that demonstrates how the alert component handles multiple lines of text. It should wrap gracefully and maintain proper spacing between the title and description.',
  },
}

export const AllVariants: Story = {
  args: {
    variant: 'info',
    description: 'Placeholder',
  },
  render: () => (
    <div className="space-y-4">
      <Alert
        variant="info"
        title="Information"
        description="This is an informational message."
      />
      <Alert
        variant="success"
        title="Success"
        description="Operation completed successfully."
      />
      <Alert
        variant="warning"
        title="Warning"
        description="Please review before proceeding."
      />
      <Alert
        variant="error"
        title="Error"
        description="An error occurred."
      />
      <Alert
        variant="danger"
        title="Danger"
        description="This action cannot be undone."
      />
    </div>
  ),
}

export const WithoutTitles: Story = {
  args: {
    variant: 'info',
    description: 'Placeholder',
  },
  render: () => (
    <div className="space-y-4">
      <Alert
        variant="info"
        description="Information without a title."
      />
      <Alert
        variant="success"
        description="Success without a title."
      />
      <Alert
        variant="warning"
        description="Warning without a title."
      />
      <Alert
        variant="error"
        description="Error without a title."
      />
      <Alert
        variant="danger"
        description="Danger without a title."
      />
    </div>
  ),
}
