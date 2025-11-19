import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { LoadingOverlay } from './LoadingOverlay'
import { LoadingSpinner } from './LoadingSpinner'

const meta = {
  title: 'UI/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'white', 'inherit'],
    },
  },
} satisfies Meta<typeof LoadingSpinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    size: 'md',
    color: 'primary',
  },
}

export const WithLabel: Story = {
  args: {
    size: 'md',
    color: 'primary',
    label: 'Loading...',
  },
}

export const ExtraSmall: Story = {
  args: {
    size: 'xs',
    color: 'primary',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    color: 'primary',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    color: 'primary',
  },
}

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    color: 'primary',
  },
}

export const White: Story = {
  args: {
    size: 'md',
    color: 'white',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const Secondary: Story = {
  args: {
    size: 'md',
    color: 'secondary',
  },
}

export const AllSizes: Story = {
  args: {
    size: 'md',
  },
  render: () => (
    <div className="flex items-center gap-6">
      <LoadingSpinner size="xs" />
      <LoadingSpinner size="sm" />
      <LoadingSpinner size="md" />
      <LoadingSpinner size="lg" />
      <LoadingSpinner size="xl" />
    </div>
  ),
}

export const AllColors: Story = {
  args: {
    color: 'primary',
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <LoadingSpinner color="primary" label="Primary" />
      <LoadingSpinner color="secondary" label="Secondary" />
      <div className="bg-gray-800 p-4 rounded">
        <LoadingSpinner color="white" label="White" />
      </div>
    </div>
  ),
}

export const WithVariousLabels: Story = {
  args: {
    size: 'md',
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <LoadingSpinner label="Loading..." />
      <LoadingSpinner label="Fetching data..." />
      <LoadingSpinner label="Processing..." />
      <LoadingSpinner label="Please wait..." />
    </div>
  ),
}

export const OverlayExample: Story = {
  args: {
    size: 'md',
  },
  render: () => (
    <LoadingOverlay loading={true} label="Loading content...">
      <div className="w-96 h-64 bg-gray-800 rounded-lg p-6">
        <h3 className="text-white text-xl mb-4">Content Area</h3>
        <p className="text-white/60">
          This content is behind a loading overlay.
        </p>
      </div>
    </LoadingOverlay>
  ),
}

export const OverlayInteractive: Story = {
  args: {
    size: 'md',
  },
  render: () => {
    const [loading, setLoading] = React.useState(false)

    return (
      <div className="space-y-4">
        <button
          onClick={() => setLoading(!loading)}
          className="px-4 py-2 bg-primary text-white rounded hover:opacity-80"
        >
          {loading ? 'Hide' : 'Show'} Loading Overlay
        </button>
        <LoadingOverlay loading={loading} label="Loading...">
          <div className="w-96 h-64 bg-gray-800 rounded-lg p-6">
            <h3 className="text-white text-xl mb-4">Interactive Example</h3>
            <p className="text-white/60">
              Click the button above to toggle the loading overlay.
            </p>
          </div>
        </LoadingOverlay>
      </div>
    )
  },
}
