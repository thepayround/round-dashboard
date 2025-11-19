import type { Meta, StoryObj } from '@storybook/react'

import { Avatar } from './Avatar'

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    shape: {
      control: 'select',
      options: ['circle', 'rounded', 'square'],
    },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'John Doe',
    size: 'md',
    shape: 'rounded',
  },
}

export const WithImage: Story = {
  args: {
    name: 'John Doe',
    src: 'https://i.pravatar.cc/150?img=1',
    size: 'md',
    shape: 'rounded',
  },
}

export const Initials: Story = {
  args: {
    name: 'Jane Smith',
    size: 'md',
    shape: 'rounded',
  },
}

export const SingleName: Story = {
  args: {
    name: 'Alice',
    size: 'md',
    shape: 'rounded',
  },
}

export const ExtraSmall: Story = {
  args: {
    name: 'John Doe',
    size: 'xs',
    shape: 'rounded',
  },
}

export const Small: Story = {
  args: {
    name: 'John Doe',
    size: 'sm',
    shape: 'rounded',
  },
}

export const Large: Story = {
  args: {
    name: 'John Doe',
    size: 'lg',
    shape: 'rounded',
  },
}

export const ExtraLarge: Story = {
  args: {
    name: 'John Doe',
    size: 'xl',
    shape: 'rounded',
  },
}

export const Circle: Story = {
  args: {
    name: 'John Doe',
    size: 'md',
    shape: 'circle',
  },
}

export const Square: Story = {
  args: {
    name: 'John Doe',
    size: 'md',
    shape: 'square',
  },
}

export const AllSizes: Story = {
  args: {
    name: 'Avatar',
  },
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="John Doe" size="xs" />
      <Avatar name="John Doe" size="sm" />
      <Avatar name="John Doe" size="md" />
      <Avatar name="John Doe" size="lg" />
      <Avatar name="John Doe" size="xl" />
    </div>
  ),
}

export const AllShapes: Story = {
  args: {
    name: 'Avatar',
  },
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="John Doe" shape="circle" />
      <Avatar name="John Doe" shape="rounded" />
      <Avatar name="John Doe" shape="square" />
    </div>
  ),
}

export const TeamMembers: Story = {
  args: {
    name: 'Team',
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Avatar name="John Doe" size="sm" />
        <span className="text-white text-sm">John Doe</span>
      </div>
      <div className="flex items-center gap-2">
        <Avatar name="Jane Smith" size="sm" />
        <span className="text-white text-sm">Jane Smith</span>
      </div>
      <div className="flex items-center gap-2">
        <Avatar name="Bob Wilson" size="sm" />
        <span className="text-white text-sm">Bob Wilson</span>
      </div>
      <div className="flex items-center gap-2">
        <Avatar name="Alice Johnson" size="sm" />
        <span className="text-white text-sm">Alice Johnson</span>
      </div>
    </div>
  ),
}

export const WithImages: Story = {
  args: {
    name: 'Images',
  },
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="User 1" src="https://i.pravatar.cc/150?img=1" />
      <Avatar name="User 2" src="https://i.pravatar.cc/150?img=2" />
      <Avatar name="User 3" src="https://i.pravatar.cc/150?img=3" />
      <Avatar name="User 4" src="https://i.pravatar.cc/150?img=4" />
      <Avatar name="User 5" src="https://i.pravatar.cc/150?img=5" />
    </div>
  ),
}
