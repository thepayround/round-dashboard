import type { Meta, StoryObj } from '@storybook/react'

import { Badge } from './Badge'

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info', 'neutral', 'primary'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    removable: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: 'Primary',
    variant: 'primary',
    size: 'md',
  },
}

export const Success: Story = {
  args: {
    children: 'Active',
    variant: 'success',
    size: 'md',
  },
}

export const Warning: Story = {
  args: {
    children: 'Pending',
    variant: 'warning',
    size: 'md',
  },
}

export const Error: Story = {
  args: {
    children: 'Error',
    variant: 'error',
    size: 'md',
  },
}

export const Info: Story = {
  args: {
    children: 'Information',
    variant: 'info',
    size: 'md',
  },
}

export const Neutral: Story = {
  args: {
    children: 'Neutral',
    variant: 'neutral',
    size: 'md',
  },
}

export const Small: Story = {
  args: {
    children: 'Small Badge',
    variant: 'primary',
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    children: 'Large Badge',
    variant: 'primary',
    size: 'lg',
  },
}

export const Removable: Story = {
  args: {
    children: 'Removable Tag',
    variant: 'primary',
    size: 'md',
    removable: true,
    onRemove: () => alert('Remove clicked'),
  },
}

export const AllVariants: Story = {
  args: {
    children: 'Badge',
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="neutral">Neutral</Badge>
    </div>
  ),
}

export const AllSizes: Story = {
  args: {
    children: 'Badge',
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
}

export const StatusBadges: Story = {
  args: {
    children: 'Badge',
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success">Active</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="error">Cancelled</Badge>
      <Badge variant="info">Processing</Badge>
      <Badge variant="neutral">Inactive</Badge>
    </div>
  ),
}

export const RemovableTags: Story = {
  args: {
    children: 'Badge',
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="primary" removable onRemove={() => {}}>
        JavaScript
      </Badge>
      <Badge variant="primary" removable onRemove={() => {}}>
        TypeScript
      </Badge>
      <Badge variant="primary" removable onRemove={() => {}}>
        React
      </Badge>
    </div>
  ),
}
