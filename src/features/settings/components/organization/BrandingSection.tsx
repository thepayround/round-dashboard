import { motion } from 'framer-motion'
import { Palette, Upload, Eye, Download, Trash2, Image } from 'lucide-react'
import React, { useState } from 'react'

import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'


export const BrandingSection: React.FC = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (type === 'logo') {
          setLogoPreview(reader.result as string)
        } else {
          setFaviconPreview(reader.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-lg font-medium text-white mb-4">
          Branding{' '}
          <span className="text-primary">
            & Appearance
          </span>
        </h1>
        <p className="text-gray-500 dark:text-polar-500 leading-snug mb-3">
          Customize your organization&apos;s visual identity and theme
        </p>
      </div>

      {/* Logo & Assets */}
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
          {/* Company Logo */}
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
                    <Button variant="danger" icon={Trash2} iconPosition="left" size="sm">
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
                      onChange={(e) => handleFileUpload(e, 'logo')}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Favicon */}
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
                    <Button variant="danger" icon={Trash2} iconPosition="left" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto" />
                  <div>
                    <label htmlFor="favicon-upload" className="cursor-pointer">
                      <span className="text-xs text-[#D417C8] hover:text-[#BD2CD0]">Click to upload</span>
                      <span className="text-xs text-gray-400"> or drag and drop</span>
                    </label>
                    <input
                      id="favicon-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'favicon')}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Color Scheme */}
      <Card animate={false} padding="lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Palette className="w-5 h-5 text-[#32A1E4]" />
          </div>
          <div>
            <h3 className="text-sm font-normal tracking-tight text-white">Color Scheme</h3>
            <p className="text-xs text-gray-400">Customize your brand colors and theme</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="primary-color" className="text-xs font-normal tracking-tight text-white block mb-2">Primary Brand Color</label>
              <div className="flex items-center gap-3">
                <input
                  id="primary-color"
                  type="color"
                  defaultValue="#D417C8"
                  className="w-12 h-10 rounded-lg border border-white/20 bg-white/10"
                />
                <input
                  type="text"
                  defaultValue="#D417C8"
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#14bdea]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="secondary-color" className="text-xs font-normal tracking-tight text-white block mb-2">Secondary Brand Color</label>
              <div className="flex items-center gap-3">
                <input
                  id="secondary-color"
                  type="color"
                  defaultValue="#14BDEA"
                  className="w-12 h-10 rounded-lg border border-white/20 bg-white/10"
                />
                <input
                  type="text"
                  defaultValue="#14BDEA"
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#14bdea]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="accent-color" className="text-xs font-normal tracking-tight text-white block mb-2">Accent Color</label>
              <div className="flex items-center gap-3">
                <input
                  id="accent-color"
                  type="color"
                  defaultValue="#7767DA"
                  className="w-12 h-10 rounded-lg border border-white/20 bg-white/10"
                />
                <input
                  type="text"
                  defaultValue="#7767DA"
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#14bdea]"
                />
              </div>
            </div>

            <div className="p-4 bg-white/4 rounded-lg border border-white/8">
              <h4 className="text-xs font-normal tracking-tight text-white mb-2">Color Preview</h4>
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-[#D417C8] rounded-lg" />
                <div className="w-8 h-8 bg-[#14BDEA] rounded-lg" />
                <div className="w-8 h-8 bg-[#7767DA] rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 flex gap-3">
          <Button variant="primary" size="lg">
            Save Branding Settings
          </Button>
          <Button variant="secondary" icon={Download} iconPosition="left" size="lg">
            Export Brand Kit
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
