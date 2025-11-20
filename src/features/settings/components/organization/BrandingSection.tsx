import { motion } from 'framer-motion'
import { Palette, Image } from 'lucide-react'
import React from 'react'

import { useBrandingController } from '../../hooks/useBrandingController'

import { FileInput } from '@/shared/ui'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'


export const BrandingSection: React.FC = () => {
  const {
    logoPreview,
    faviconPreview,
    isSaving,
    disableSave,
    error,
    handleFileUpload,
    handleRemoveAsset,
    handleSaveBranding,
  } = useBrandingController()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-lg font-medium text-white mb-4">
          Branding <span className="text-primary">& Appearance</span>
        </h1>
        <p className="text-gray-500 dark:text-polar-500 leading-snug mb-3">
          Customize your organization&apos;s visual identity and theme
        </p>
      </div>

      <Card animate={false} padding="lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Image className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-normal tracking-tight text-white">Logo & Assets</h3>
            <p className="text-xs text-gray-400">Upload and manage your organization&apos;s visual assets</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileInput
            id="logo-upload"
            label="Company Logo"
            helperText="Recommended: 200x60px, PNG format"
            accept="image/*"
            value={logoPreview}
            onChange={(file) => handleFileUpload(file, 'logo')}
            onRemove={() => handleRemoveAsset('logo')}
            showPreview
            showActions
          />

          <FileInput
            id="favicon-upload"
            label="Favicon"
            helperText="Recommended: 32x32px, ICO or PNG format"
            accept="image/*"
            value={faviconPreview}
            onChange={(file) => handleFileUpload(file, 'favicon')}
            onRemove={() => handleRemoveAsset('favicon')}
            showPreview
            showActions
            renderPreview={(file) => (
              <img
                src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                alt="Favicon preview"
                className="w-8 h-8 mx-auto"
              />
            )}
            previewClassName="!mb-0"
          />
        </div>

        {error && <p className="text-sm text-red-400 mt-4">{error}</p>}

        <div className="flex justify-end mt-8">
          <Button
            onClick={handleSaveBranding}
            disabled={disableSave}
            isLoading={isSaving}
            icon={Palette}
            iconPosition="left"
            variant="primary"
            size="sm"
          >
            {isSaving ? 'Saving...' : 'Save Branding'}
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
