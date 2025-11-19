import type { Meta, StoryObj } from '@storybook/react'
import { Users, MessageSquare, Package, Search, FileText, Inbox } from 'lucide-react'

import { EmptyState } from './EmptyState'

const meta = {
  title: 'UI/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'No data available',
  },
}

export const WithIcon: Story = {
  args: {
    icon: Inbox,
    title: 'No items found',
  },
}

export const WithDescription: Story = {
  args: {
    icon: Users,
    title: 'No customers yet',
    description: 'Get started by adding your first customer to the system.',
  },
}

export const WithAction: Story = {
  args: {
    icon: Users,
    title: 'No customers yet',
    description: 'Get started by adding your first customer to the system.',
    action: {
      label: 'Add Customer',
      onClick: () => alert('Add customer clicked'),
    },
  },
}

export const NoNotes: Story = {
  args: {
    icon: MessageSquare,
    title: 'No notes yet',
    description: 'Start documenting important updates about this customer.',
    action: {
      label: 'Add Note',
      onClick: () => alert('Add note clicked'),
    },
  },
}

export const NoResults: Story = {
  args: {
    icon: Search,
    title: 'No results found',
    description: 'Try adjusting your search or filter to find what you are looking for.',
  },
}

export const NoOrders: Story = {
  args: {
    icon: Package,
    title: 'No orders yet',
    description: 'This customer has not placed any orders.',
  },
}

export const NoDocuments: Story = {
  args: {
    icon: FileText,
    title: 'No documents',
    description: 'Upload documents to keep track of important files.',
    action: {
      label: 'Upload Document',
      onClick: () => alert('Upload clicked'),
      variant: 'secondary',
    },
  },
}

export const AllVariants: Story = {
  args: {
    title: 'Empty State',
  },
  render: () => (
    <div className="space-y-12">
      <EmptyState
        icon={Inbox}
        title="Simple with icon"
      />

      <EmptyState
        icon={Users}
        title="With description"
        description="This includes a helpful description to guide the user."
      />

      <EmptyState
        icon={MessageSquare}
        title="With action button"
        description="Includes a call-to-action to help users get started."
        action={{
          label: 'Take Action',
          onClick: () => {},
        }}
      />
    </div>
  ),
}
