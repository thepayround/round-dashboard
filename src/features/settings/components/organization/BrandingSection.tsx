import { motion } from 'framer-motion'
import { Palette, Image, Loader2, Save } from 'lucide-react'
import React from 'react'

import { useBrandingController } from '../../hooks/useBrandingController'

import { FileInput } from '@/shared/ui'
import { DetailCard } from '@/shared/ui/DetailCard'
import { Alert, AlertDescription } from '@/shared/ui/shadcn/alert'
import { Button } from '@/shared/ui/shadcn/button'

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
      <DetailCard
        title="Logo & Assets"
        icon={<Image className="h-4 w-4" />}
        actions={
          <Button
            onClick={handleSaveBranding}
            disabled={disableSave || isSaving}
            variant="default"
            size="sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Branding
              </>
            )}
          </Button>
        }
      >
        <p className="text-sm text-muted-foreground mb-6">
          Upload and manage your organization&apos;s visual assets
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </DetailCard>

      {/* Theme Settings - Coming Soon */}
      <DetailCard
        title="Theme Settings"
        icon={<Palette className="h-4 w-4" />}
      >
        <div className="text-center py-8">
          <Palette className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-sm font-medium text-foreground mb-2">
            Theme Customization
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Customize colors, fonts, and other visual elements to match your brand identity.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-3">
            This feature is coming soon...
          </p>
        </div>
      </DetailCard>
    </motion.div>
  )
}
