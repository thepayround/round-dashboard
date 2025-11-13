import { motion } from 'framer-motion'
import { Palette, Upload, Eye, Download, Trash2, Image } from 'lucide-react'
import React from 'react'

import { useBrandingController } from '../../hooks/useBrandingController'

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
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Image className="w-5 h-5 text-[#D417C8]" />
          </div>
          <div>
            <h3 className="text-sm font-normal tracking-tight text-white">Logo & Assets</h3>
            <p className="text-xs text-gray-400">Upload and manage your organization&apos;s visual assets</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-normal tracking-tight text-white mb-2">Company Logo</h4>
              <p className="text-xs text-gray-400">Recommended: 200x60px, PNG format</p>
            </div>

            <div className="border border-dashed border-white/20 rounded-lg p-6 text-center">
              {logoPreview ? (
                <div className="space-y-3">
                  <img src={logoPreview} alt="Logo preview" className="max-h-16 mx-auto" />
                  <div className="flex gap-2 justify-center">
                    <Button variant="ghost" icon={Eye} iconPosition="left" size="sm">
                      Preview
                    </Button>
                    <Button variant="ghost" icon={Download} iconPosition="left" size="sm">
                      Download
                    </Button>
                    <Button
                      variant="danger"
                      icon={Trash2}
                      iconPosition="left"
                      size="sm"
                      onClick={() => handleRemoveAsset('logo')}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                  <div>
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <span className="text-xs text-[#D417C8] hover:text-[#BD2CD0]">Click to upload</span>
                      <span className="text-xs text-gray-400"> or drag and drop</span>
                    </label>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleFileUpload(event, 'logo')}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-normal tracking-tight text-white mb-2">Favicon</h4>
              <p className="text-xs text-gray-400">Recommended: 32x32px, ICO or PNG format</p>
            </div>

            <div className="border border-dashed border-white/20 rounded-lg p-6 text-center">
              {faviconPreview ? (
                <div className="space-y-3">
                  <img src={faviconPreview} alt="Favicon preview" className="w-8 h-8 mx-auto" />
                  <div className="flex gap-2 justify-center">
                    <Button variant="ghost" icon={Eye} iconPosition="left" size="sm">
                      Preview
                    </Button>
                    <Button variant="ghost" icon={Download} iconPosition="left" size="sm">
                      Download
                    </Button>
                    <Button
                      variant="danger"
                      icon={Trash2}
                      iconPosition="left"
                      size="sm"
                      onClick={() => handleRemoveAsset('favicon')}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                  <div>
                    <label htmlFor="favicon-upload" className="cursor-pointer">
                      <span className="text-xs text-[#D417C8] hover:text-[#BD2CD0]">Click to upload</span>
                      <span className="text-xs text-gray-400"> or drag and drop</span>
                    </label>
                    <input
                      id="favicon-upload"
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleFileUpload(event, 'favicon')}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-400 mt-4">{error}</p>}

        <div className="flex justify-end mt-8">
          <Button
            onClick={handleSaveBranding}
            disabled={disableSave}
            loading={isSaving}
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
