import { useCallback, useMemo, useState } from 'react'

export const useBrandingController = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [error, setError] = useState('')

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      if (type === 'logo') {
        setLogoPreview(reader.result as string)
      } else {
        setFaviconPreview(reader.result as string)
      }
      setHasChanges(true)
    }
    reader.onerror = () => {
      setError('Unable to read file. Please try again.')
    }
    reader.readAsDataURL(file)
  }, [])

  const handleRemoveAsset = useCallback((type: 'logo' | 'favicon') => {
    if (type === 'logo') {
      setLogoPreview(null)
    } else {
      setFaviconPreview(null)
    }
    setHasChanges(true)
  }, [])

  const handleSaveBranding = useCallback(async () => {
    if (!hasChanges) {
      return
    }

    try {
      setIsSaving(true)
      setError('')
      // Placeholder for future API call
      await new Promise(resolve => setTimeout(resolve, 800))
      setHasChanges(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save branding settings')
    } finally {
      setIsSaving(false)
    }
  }, [hasChanges])

  const disableSave = useMemo(() => !hasChanges || isSaving, [hasChanges, isSaving])

  return {
    logoPreview,
    faviconPreview,
    isSaving,
    hasChanges,
    error,
    disableSave,
    handleFileUpload,
    handleRemoveAsset,
    handleSaveBranding,
  }
}
