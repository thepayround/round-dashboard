import type { Meta, StoryObj } from '@storybook/react'
import { User, Mail, Settings, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react'

import { IconBox } from './IconBox'

const meta = {
  title: 'UI/IconBox',
  component: IconBox,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof IconBox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: User,
  },
}

export const Small: Story = {
  args: {
    icon: User,
    size: 'sm',
  },
}

export const Medium: Story = {
  args: {
    icon: User,
    size: 'md',
  },
}

export const Large: Story = {
  args: {
    icon: User,
    size: 'lg',
  },
}

export const Primary: Story = {
  args: {
    icon: User,
    color: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    icon: Mail,
    color: 'secondary',
  },
}

export const Success: Story = {
  args: {
    icon: CheckCircle,
    color: 'success',
  },
}

export const Warning: Story = {
  args: {
    icon: AlertTriangle,
    color: 'warning',
  },
}

export const Error: Story = {
  args: {
    icon: XCircle,
    color: 'error',
  },
}

export const InfoColor: Story = {
  args: {
    icon: Info,
    color: 'info',
  },
}

export const Cyan: Story = {
  args: {
    icon: Settings,
    color: 'cyan',
  },
}

export const AllSizes: Story = {
  args: {
    icon: User,
    color: 'primary',
  },
  render: () => (
    <div className="flex items-center gap-4">
      <IconBox icon={User} size="sm" color="primary" />
      <IconBox icon={User} size="md" color="primary" />
      <IconBox icon={User} size="lg" color="primary" />
    </div>
  ),
}

export const AllColors: Story = {
  args: {
    icon: User,
    size: 'md',
  },
  render: () => (
    <div className="flex items-center gap-4 flex-wrap">
      <IconBox icon={User} color="primary" />
      <IconBox icon={Mail} color="secondary" />
      <IconBox icon={CheckCircle} color="success" />
      <IconBox icon={AlertTriangle} color="warning" />
      <IconBox icon={XCircle} color="error" />
      <IconBox icon={Info} color="info" />
      <IconBox icon={Settings} color="cyan" />
    </div>
  ),
}

export const Grid: Story = {
  args: {
    icon: User,
    size: 'md',
  },
  render: () => (
    <div className="grid grid-cols-7 gap-4">
      <div className="text-center">
        <IconBox icon={User} size="sm" color="primary" />
        <p className="text-xs text-white/60 mt-2">sm/primary</p>
      </div>
      <div className="text-center">
        <IconBox icon={Mail} size="sm" color="secondary" />
        <p className="text-xs text-white/60 mt-2">sm/secondary</p>
      </div>
      <div className="text-center">
        <IconBox icon={CheckCircle} size="sm" color="success" />
        <p className="text-xs text-white/60 mt-2">sm/success</p>
      </div>
      <div className="text-center">
        <IconBox icon={AlertTriangle} size="sm" color="warning" />
        <p className="text-xs text-white/60 mt-2">sm/warning</p>
      </div>
      <div className="text-center">
        <IconBox icon={XCircle} size="sm" color="error" />
        <p className="text-xs text-white/60 mt-2">sm/error</p>
      </div>
      <div className="text-center">
        <IconBox icon={Info} size="sm" color="info" />
        <p className="text-xs text-white/60 mt-2">sm/info</p>
      </div>
      <div className="text-center">
        <IconBox icon={Settings} size="sm" color="cyan" />
        <p className="text-xs text-white/60 mt-2">sm/cyan</p>
      </div>

      <div className="text-center">
        <IconBox icon={User} size="md" color="primary" />
        <p className="text-xs text-white/60 mt-2">md/primary</p>
      </div>
      <div className="text-center">
        <IconBox icon={Mail} size="md" color="secondary" />
        <p className="text-xs text-white/60 mt-2">md/secondary</p>
      </div>
      <div className="text-center">
        <IconBox icon={CheckCircle} size="md" color="success" />
        <p className="text-xs text-white/60 mt-2">md/success</p>
      </div>
      <div className="text-center">
        <IconBox icon={AlertTriangle} size="md" color="warning" />
        <p className="text-xs text-white/60 mt-2">md/warning</p>
      </div>
      <div className="text-center">
        <IconBox icon={XCircle} size="md" color="error" />
        <p className="text-xs text-white/60 mt-2">md/error</p>
      </div>
      <div className="text-center">
        <IconBox icon={Info} size="md" color="info" />
        <p className="text-xs text-white/60 mt-2">md/info</p>
      </div>
      <div className="text-center">
        <IconBox icon={Settings} size="md" color="cyan" />
        <p className="text-xs text-white/60 mt-2">md/cyan</p>
      </div>

      <div className="text-center">
        <IconBox icon={User} size="lg" color="primary" />
        <p className="text-xs text-white/60 mt-2">lg/primary</p>
      </div>
      <div className="text-center">
        <IconBox icon={Mail} size="lg" color="secondary" />
        <p className="text-xs text-white/60 mt-2">lg/secondary</p>
      </div>
      <div className="text-center">
        <IconBox icon={CheckCircle} size="lg" color="success" />
        <p className="text-xs text-white/60 mt-2">lg/success</p>
      </div>
      <div className="text-center">
        <IconBox icon={AlertTriangle} size="lg" color="warning" />
        <p className="text-xs text-white/60 mt-2">lg/warning</p>
      </div>
      <div className="text-center">
        <IconBox icon={XCircle} size="lg" color="error" />
        <p className="text-xs text-white/60 mt-2">lg/error</p>
      </div>
      <div className="text-center">
        <IconBox icon={Info} size="lg" color="info" />
        <p className="text-xs text-white/60 mt-2">lg/info</p>
      </div>
      <div className="text-center">
        <IconBox icon={Settings} size="lg" color="cyan" />
        <p className="text-xs text-white/60 mt-2">lg/cyan</p>
      </div>
    </div>
  ),
}
