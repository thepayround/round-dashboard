import type { Meta, StoryObj } from '@storybook/react'
import { Save, Plus, Trash2, Download } from 'lucide-react'

import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'UI/Buttons/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger', 'link'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Button size',
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading spinner and disables button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Makes button full width',
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
      description: 'Position of icon relative to text',
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

// Basic variants
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
}

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger Button',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
}

// With icons
export const WithIconLeft: Story = {
  args: {
    variant: 'primary',
    icon: Save,
    iconPosition: 'left',
    children: 'Save Changes',
  },
}

export const WithIconRight: Story = {
  args: {
    variant: 'secondary',
    icon: Download,
    iconPosition: 'right',
    children: 'Download',
  },
}

// Loading state
export const Loading: Story = {
  args: {
    variant: 'primary',
    loading: true,
    children: 'Loading...',
  },
}

export const LoadingWithIcon: Story = {
  args: {
    variant: 'primary',
    icon: Save,
    loading: true,
    children: 'Saving...',
  },
}

// Disabled state
export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled Button',
  },
}

// Sizes
export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    children: 'Small Button',
  },
}

export const Medium: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Medium Button',
  },
}

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'Large Button',
  },
}

export const ExtraLarge: Story = {
  args: {
    variant: 'primary',
    size: 'xl',
    children: 'Extra Large Button',
  },
}

// Full width
export const FullWidth: Story = {
  args: {
    variant: 'primary',
    fullWidth: true,
    children: 'Full Width Button',
  },
}

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 p-6 bg-[#0a0a0a]">
      <div className="space-y-2">
        <h3 className="text-sm font-normal text-white mb-2">Variants</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-normal text-white mb-2">With Icons</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" icon={Save} iconPosition="left">
            Save
          </Button>
          <Button variant="secondary" icon={Plus} iconPosition="left">
            Add
          </Button>
          <Button variant="danger" icon={Trash2} iconPosition="right">
            Delete
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-normal text-white mb-2">States</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" loading>
            Loading
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-normal text-white mb-2">Sizes</h3>
        <div className="flex flex-wrap gap-2 items-center">
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="md">
            Medium
          </Button>
          <Button variant="primary" size="lg">
            Large
          </Button>
          <Button variant="primary" size="xl">
            Extra Large
          </Button>
        </div>
      </div>
    </div>
  ),
}

