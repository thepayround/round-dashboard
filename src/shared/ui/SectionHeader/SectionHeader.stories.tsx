import type { Meta, StoryObj } from '@storybook/react'
import { User, Mail, Settings, MapPin, Globe, Tag } from 'lucide-react'

import { SectionHeader } from './SectionHeader'

const meta = {
  title: 'UI/SectionHeader',
  component: SectionHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SectionHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Section Title',
  },
}

export const WithIcon: Story = {
  args: {
    icon: User,
    title: 'Basic Information',
  },
}

export const WithSubtitle: Story = {
  args: {
    icon: User,
    title: 'Basic Information',
    subtitle: 'Update your personal details and preferences',
  },
}

export const CustomIconColor: Story = {
  args: {
    icon: Mail,
    title: 'Contact Information',
    subtitle: 'Manage your email and phone',
    iconColor: 'text-secondary',
  },
}

export const AllVariants: Story = {
  args: {
    title: 'Section Title',
  },
  render: () => (
    <div className="space-y-8">
      <SectionHeader
        icon={User}
        title="Basic Information"
        iconColor="text-primary"
      />
      <SectionHeader
        icon={MapPin}
        title="Billing Address"
        iconColor="text-success"
      />
      <SectionHeader
        icon={Settings}
        title="Customer Settings"
        iconColor="text-[#FFC107]"
      />
      <SectionHeader
        icon={Globe}
        title="Preferences & Settings"
        iconColor="text-accent"
      />
      <SectionHeader
        icon={Mail}
        title="Contact Information"
        iconColor="text-secondary"
      />
      <SectionHeader
        icon={Tag}
        title="Tags"
        iconColor="text-primary"
      />
    </div>
  ),
}

export const WithSubtitles: Story = {
  args: {
    title: 'Section Title',
  },
  render: () => (
    <div className="space-y-8">
      <SectionHeader
        icon={User}
        title="Basic Information"
        subtitle="Personal details and account information"
        iconColor="text-primary"
      />
      <SectionHeader
        icon={MapPin}
        title="Addresses"
        subtitle="Billing and shipping addresses"
        iconColor="text-success"
      />
      <SectionHeader
        icon={Settings}
        title="Preferences"
        subtitle="Customize your experience"
        iconColor="text-accent"
      />
    </div>
  ),
}

export const WithoutIcons: Story = {
  args: {
    title: 'Section Title',
  },
  render: () => (
    <div className="space-y-6">
      <SectionHeader
        title="Basic Information"
      />
      <SectionHeader
        title="Contact Information"
        subtitle="Email and phone details"
      />
      <SectionHeader
        title="Preferences"
      />
    </div>
  ),
}
