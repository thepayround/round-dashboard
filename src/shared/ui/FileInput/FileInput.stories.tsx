import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { FileInput } from './FileInput'

const meta: Meta<typeof FileInput> = {
  title: 'UI/Form/FileInput',
  component: FileInput,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text',
    },
    helperText: {
      control: 'text',
      description: 'Helper text',
    },
    accept: {
      control: 'text',
      description: 'Accepted file types',
    },
    multiple: {
      control: 'boolean',
      description: 'Allow multiple files',
    },
    showPreview: {
      control: 'boolean',
      description: 'Show file preview',
    },
    showActions: {
      control: 'boolean',
      description: 'Show action buttons',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables input',
    },
  },
}

export default meta
type Story = StoryObj<typeof FileInput>

export const Basic: Story = {
  args: {
    label: 'Upload File',
    accept: '*/*',
  },
}

export const ImageOnly: Story = {
  args: {
    label: 'Upload Image',
    helperText: 'PNG, JPG or GIF (max 5MB)',
    accept: 'image/*',
    showPreview: true,
  },
}

export const WithPreview: Story = {
  args: {
    label: 'Company Logo',
    helperText: 'Recommended: 200x60px, PNG format',
    accept: 'image/*',
    showPreview: true,
    showActions: true,
  },
}

export const Multiple: Story = {
  args: {
    label: 'Upload Documents',
    helperText: 'Select multiple PDF files',
    accept: '.pdf',
    multiple: true,
  },
}

export const Required: Story = {
  args: {
    label: 'Upload Resume',
    helperText: 'PDF or DOCX format',
    accept: '.pdf,.doc,.docx',
    required: true,
  },
}

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [file, setFile] = useState<File | null>(null)

    return (
      <div className="p-6 bg-[#0a0a0a]">
        <FileInput
          label="Upload Logo"
          helperText="PNG or SVG (max 2MB)"
          accept="image/*"
          value={file}
          onChange={(newFile) => setFile(newFile as File)}
          onRemove={() => setFile(null)}
          showPreview
          showActions
          maxSize={2}
        />
        {file && (
          <div className="mt-4 p-4 bg-[#171719] border border-[#333333] rounded-lg">
            <p className="text-xs text-white/60">File selected:</p>
            <p className="text-sm text-white">{file.name}</p>
            <p className="text-xs text-white/40">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}
      </div>
    )
  },
}

// All states showcase
export const AllStates: Story = {
  render: () => (
    <div className="space-y-6 p-6 bg-[#0a0a0a]">
      <FileInput label="Default" accept="image/*" onChange={() => {}} />
      <FileInput
        label="With helper text"
        helperText="Recommended: 200x200px, PNG format"
        accept="image/*"
        onChange={() => {}}
      />
      <FileInput
        label="Required"
        accept="image/*"
        required
        onChange={() => {}}
      />
      <FileInput
        label="Disabled"
        accept="image/*"
        disabled
        onChange={() => {}}
      />
    </div>
  ),
}

