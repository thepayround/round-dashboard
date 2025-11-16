import type { Meta, StoryObj } from '@storybook/react'
import { Settings, Info } from 'lucide-react'
import { useState } from 'react'

import { Button } from '../Button'

import { Modal } from './Modal'

const meta: Meta<typeof Modal> = {
  title: 'UI/Feedback/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls modal visibility',
    },
    title: {
      control: 'text',
      description: 'Modal title',
    },
    subtitle: {
      control: 'text',
      description: 'Modal subtitle',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Modal width',
    },
    showHeader: {
      control: 'boolean',
      description: 'Show/hide header',
    },
  },
}

export default meta
type Story = StoryObj<typeof Modal>

// Interactive examples (modals need state management)
export const Basic: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="p-6 bg-[#0a0a0a]">
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Basic Modal">
          <div className="p-6">
            <p className="text-sm text-white/80">
              This is a basic modal with default settings.
            </p>
          </div>
        </Modal>
      </div>
    )
  },
}

export const WithIcon: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="p-6 bg-[#0a0a0a]">
        <Button onClick={() => setIsOpen(true)}>Open Settings Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Settings"
          subtitle="Configure your preferences"
          icon={Settings}
        >
          <div className="p-6">
            <p className="text-sm text-white/80">Settings content goes here</p>
          </div>
        </Modal>
      </div>
    )
  },
}

export const WithForm: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="p-6 bg-[#0a0a0a]">
        <Button onClick={() => setIsOpen(true)}>Open Form Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Add Customer"
          subtitle="Enter customer details"
        >
          <div className="p-6 space-y-4">
            <input
              type="text"
              placeholder="Customer name"
              className="w-full h-11 px-3 bg-[#171719] border border-[#333333] rounded-lg text-white placeholder-[#737373] text-xs"
            />
            <input
              type="email"
              placeholder="Email address"
              className="w-full h-11 px-3 bg-[#171719] border border-[#333333] rounded-lg text-white placeholder-[#737373] text-xs"
            />
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setIsOpen(false)}>
                Add Customer
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    )
  },
}

export const SmallSize: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="p-6 bg-[#0a0a0a]">
        <Button onClick={() => setIsOpen(true)}>Open Small Modal</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirm Action" size="sm">
          <div className="p-6">
            <p className="text-sm text-white/80">Are you sure you want to continue?</p>
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="secondary" size="sm" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={() => setIsOpen(false)}>
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    )
  },
}

export const LargeSize: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="p-6 bg-[#0a0a0a]">
        <Button onClick={() => setIsOpen(true)}>Open Large Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Large Modal"
          subtitle="With more content space"
          size="lg"
        >
          <div className="p-6">
            <p className="text-sm text-white/80 mb-4">
              This is a large modal with plenty of content space.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 bg-[#171719] border border-[#333333] rounded-lg">
                  <p className="text-sm text-white">Content block {i + 1}</p>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      </div>
    )
  },
}

export const WithoutHeader: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="p-6 bg-[#0a0a0a]">
        <Button onClick={() => setIsOpen(true)}>Open Modal Without Header</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} showHeader={false}>
          <div className="p-6">
            <h2 className="text-lg font-medium text-white mb-4">Custom Header</h2>
            <p className="text-sm text-white/80">
              This modal has no default header, allowing for custom content.
            </p>
          </div>
        </Modal>
      </div>
    )
  },
}

// Focus trap demonstration
export const FocusTrap: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="p-6 bg-[#0a0a0a]">
        <Button onClick={() => setIsOpen(true)}>Test Focus Trap</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Focus Trap Test"
          subtitle="Try pressing Tab/Shift+Tab"
          icon={Info}
        >
          <div className="p-6 space-y-4">
            <p className="text-sm text-white/80 mb-4">
              Focus is trapped in this modal. Tab through the elements - focus will cycle within the modal.
            </p>
            <input
              type="text"
              placeholder="First input"
              className="w-full h-11 px-3 bg-[#171719] border border-[#333333] rounded-lg text-white placeholder-[#737373] text-xs"
            />
            <input
              type="text"
              placeholder="Second input"
              className="w-full h-11 px-3 bg-[#171719] border border-[#333333] rounded-lg text-white placeholder-[#737373] text-xs"
            />
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setIsOpen(false)}>
                Submit
              </Button>
            </div>
            <p className="text-xs text-white/60 mt-4">
              💡 Press Escape to close, or Tab to cycle through elements
            </p>
          </div>
        </Modal>
      </div>
    )
  },
}

