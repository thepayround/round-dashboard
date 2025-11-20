import type { Meta, StoryObj } from '@storybook/react'
import { X, Edit as EditIcon, Trash2, MoreHorizontal, Plus, Settings } from 'lucide-react'

import { IconButton } from './IconButton'

const meta: Meta<typeof IconButton> = {
  title: 'UI/Buttons/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: false,
      description: 'Lucide icon component',
    },
    variant: {
      control: 'select',
      options: ['default', 'danger', 'ghost'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    isLoading: {
      control: 'boolean',
      description: 'Shows isLoading spinner',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    'aria-label': {
      control: 'text',
      description: 'Required: Accessible label for screen readers',
    },
  },
}

export default meta
type Story = StoryObj<typeof IconButton>

// Basic variants
export const Default: Story = {
  args: {
    icon: Settings,
    'aria-label': 'Settings',
    variant: 'default',
  },
}

export const Danger: Story = {
  args: {
    icon: Trash2,
    'aria-label': 'Delete',
    variant: 'danger',
  },
}

export const Ghost: Story = {
  args: {
    icon: MoreHorizontal,
    'aria-label': 'More options',
    variant: 'ghost',
  },
}

// Common use cases
export const Close: Story = {
  args: {
    icon: X,
    'aria-label': 'Close',
    variant: 'ghost',
  },
}

export const EditButton: Story = {
  args: {
    icon: EditIcon,
    'aria-label': 'Edit',
    variant: 'default',
  },
}

export const Add: Story = {
  args: {
    icon: Plus,
    'aria-label': 'Add item',
    variant: 'default',
  },
}

// States
export const Loading: Story = {
  args: {
    icon: Settings,
    'aria-label': 'Settings',
    isLoading: true,
  },
}

export const Disabled: Story = {
  args: {
    icon: Settings,
    'aria-label': 'Settings',
    disabled: true,
  },
}

// Sizes
export const Small: Story = {
  args: {
    icon: Settings,
    'aria-label': 'Settings',
    size: 'sm',
  },
}

export const Medium: Story = {
  args: {
    icon: Settings,
    'aria-label': 'Settings',
    size: 'md',
  },
}

export const Large: Story = {
  args: {
    icon: Settings,
    'aria-label': 'Settings',
    size: 'lg',
  },
}

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6 p-6 bg-[#0a0a0a]">
      <div className="space-y-2">
        <h3 className="text-sm font-normal text-white mb-2">Variants</h3>
        <div className="flex gap-2">
          <IconButton icon={Settings} aria-label="Settings" variant="default" />
          <IconButton icon={Trash2} aria-label="Delete" variant="danger" />
          <IconButton icon={MoreHorizontal} aria-label="More" variant="ghost" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-normal text-white mb-2">Common Icons</h3>
        <div className="flex gap-2">
          <IconButton icon={X} aria-label="Close" />
          <IconButton icon={EditIcon} aria-label="Edit" />
          <IconButton icon={Plus} aria-label="Add" />
          <IconButton icon={Trash2} aria-label="Delete" />
          <IconButton icon={MoreHorizontal} aria-label="More" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-normal text-white mb-2">States</h3>
        <div className="flex gap-2">
          <IconButton icon={Settings} aria-label="Settings" />
          <IconButton icon={Settings} aria-label="Loading" isLoading />
          <IconButton icon={Settings} aria-label="Disabled" disabled />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-normal text-white mb-2">Sizes</h3>
        <div className="flex gap-2 items-center">
          <IconButton icon={Settings} aria-label="Small" size="sm" />
          <IconButton icon={Settings} aria-label="Medium" size="md" />
          <IconButton icon={Settings} aria-label="Large" size="lg" />
        </div>
      </div>
    </div>
  ),
}

