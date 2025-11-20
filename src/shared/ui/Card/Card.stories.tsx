import type { Meta, StoryObj } from '@storybook/react'
import { Users, TrendingUp, DollarSign } from 'lucide-react'

import { Card } from './Card'

const meta: Meta<typeof Card> = {
  title: 'UI/Layout/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'navigation', 'compact', 'stats', 'feature', 'nested'],
      description: 'Visual style variant',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Card padding',
    },
    animate: {
      control: 'boolean',
      description: 'Enable entrance animation',
    },
  },
}

export default meta
type Story = StoryObj<typeof Card>

export const Basic: Story = {
  args: {
    children: <div className="text-white">Basic card content</div>,
  },
}

export const Stats: Story = {
  args: {
    variant: 'stats',
    children: <div className="text-white">Stats card variant</div>,
  },
}

export const Feature: Story = {
  args: {
    variant: 'feature',
    children: <div className="text-white">Feature card variant</div>,
  },
}

export const Nested: Story = {
  args: {
    variant: 'nested',
    children: <div className="text-white/80">Nested card variant</div>,
  },
}

// With padding
export const NoPadding: Story = {
  args: {
    padding: 'none',
    children: <div className="text-white">No padding</div>,
  },
}

export const SmallPadding: Story = {
  args: {
    padding: 'sm',
    children: <div className="text-white">Small padding</div>,
  },
}

export const MediumPadding: Story = {
  args: {
    padding: 'md',
    children: <div className="text-white">Medium padding (default)</div>,
  },
}

export const LargePadding: Story = {
  args: {
    padding: 'lg',
    children: <div className="text-white">Large padding</div>,
  },
}

// Real-world examples
export const StatsCard: Story = {
  render: () => (
    <div className="p-6 bg-[#0a0a0a]">
      <Card padding="lg">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-white/60 mb-1">Total Customers</p>
            <p className="text-2xl font-normal text-white">1,284</p>
            <p className="text-xs text-[#38D39F] mt-2">+12% from last month</p>
          </div>
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="w-5 h-5 text-primary" />
          </div>
        </div>
      </Card>
    </div>
  ),
}

export const NestedCards: Story = {
  render: () => (
    <div className="p-6 bg-[#0a0a0a]">
      <Card padding="lg">
        <h3 className="text-sm font-normal text-white mb-4">Parent Card</h3>
        <div className="space-y-3">
          <Card variant="nested" padding="md">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#42E695]" />
              <span className="text-sm text-white/80">Revenue trending up</span>
            </div>
          </Card>
          <Card variant="nested" padding="md">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-secondary" />
              <span className="text-sm text-white/80">$24,500 this month</span>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  ),
}

// All variants
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 p-6 bg-[#0a0a0a]">
      <Card variant="default" padding="md">
        <p className="text-white">Default variant</p>
      </Card>
      <Card variant="stats" padding="md">
        <p className="text-white">Stats variant</p>
      </Card>
      <Card variant="feature" padding="md">
        <p className="text-white">Feature variant</p>
      </Card>
      <Card variant="nested" padding="md">
        <p className="text-white/80">Nested variant</p>
      </Card>
    </div>
  ),
}

