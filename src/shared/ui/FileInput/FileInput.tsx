/**
 * FileInput Component
 *
 * A reusable file input component with drag-and-drop support, preview, and validation.
 * Designed to handle various file types with a clean, accessible interface.
 *
 * @example
 * // Basic usage
 * <FileInput
 *   label="Upload Logo"
 *   accept="image/*"
 *   onChange={(file) => setFile(file)}
 * />
 *
 * @example
 * // With preview
 * <FileInput
 *   label="Company Logo"
 *   accept="image/*"
 *   value={logoFile}
 *   onChange={(file) => setLogoFile(file)}
 *   onRemove={() => setLogoFile(null)}
 *   showPreview
 *   helperText="Recommended: 200x200px, PNG or SVG format"
 * />
 *
 * @example
 * // With custom preview renderer
 * <FileInput
 *   label="Favicon"
 *   accept="image/x-icon,image/png"
 *   onChange={(file) => setFavicon(file)}
 *   renderPreview={(file) => (
 *     <img src={URL.createObjectURL(file)} alt="Favicon" className="w-8 h-8" />
 *   )}
 * />
 *
 * @accessibility
 * - Hidden file input with accessible label
 * - Keyboard accessible trigger
 * - ARIA labels for screen readers
 * - Visual focus indicators
 * - Error announcements with aria-live
 */
import { AlertCircle, Upload, X, File, Eye, Download } from 'lucide-react'
import React, { useRef, useState, useCallback } from 'react'

import { Button } from '@/shared/ui/shadcn/button'
import { cn } from '@/shared/utils/cn'

export interface FileInputProps {
  /** Unique ID for the input */
  id?: string
  /** Label text */
  label?: string
  /** Helper text */
  helperText?: string
  /** Error message */
  error?: string
  /** Accepted file types (e.g., "image/*", ".pdf,.doc") */
  accept?: string
  /** Allow multiple file selection */
  multiple?: boolean
  /** Maximum file size in MB */
  maxSize?: number
  /** Current file(s) */
  value?: File | File[] | string | null
  /** Callback when file(s) are selected */
  onChange?: (file: File | File[] | null) => void
  /** Callback when file is removed */
  onRemove?: () => void
  /** Callback for preview button */
  onPreview?: (file: File | string) => void
  /** Callback for download button */
  onDownload?: (file: File | string) => void
  /** Show file preview */
  showPreview?: boolean
  /** Custom preview renderer */
  renderPreview?: (file: File | string) => React.ReactNode
  /** Whether field is required */
  required?: boolean
  /** Whether field is disabled */
  disabled?: boolean
  /** Container class name */
  containerClassName?: string
  /** Preview class name */
  previewClassName?: string
  /** Show action buttons (preview, download, remove) */
  showActions?: boolean
}

export const FileInput: React.FC<FileInputProps> = ({
  id,
  label,
  helperText,
  error,
  accept = '*/*',
  multiple = false,
  maxSize,
  value,
  onChange,
  onRemove,
  onPreview,
  onDownload,
  showPreview = true,
  renderPreview,
  required = false,
  disabled = false,
  containerClassName,
  previewClassName,
  showActions = true,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  
  const inputId = id || `file-input-${Math.random().toString(36).substr(2, 9)}`
  const errorId = `${inputId}-error`
  const helperId = `${inputId}-helper`

  // Generate preview URL for image files
  React.useEffect(() => {
    if (value && typeof value !== 'string' && !Array.isArray(value)) {
      const file = value as File
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file)
        setPreview(url)
        return () => URL.revokeObjectURL(url)
      }
    } else if (typeof value === 'string') {
      setPreview(value)
    }
  }, [value])

  const validateFile = useCallback((file: File): string | null => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }
    return null
  }, [maxSize])

  const handleFileChange = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return

    if (multiple) {
      const fileArray = Array.from(files)
      const errors = fileArray.map(validateFile).filter(Boolean)
      if (errors.length > 0) {
        return
      }
      onChange?.(fileArray)
    } else {
      const file = files[0]
      const validationError = validateFile(file)
      if (validationError) {
        return
      }
      onChange?.(file)
    }
  }, [multiple, onChange, validateFile])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    if (disabled) return
    
    const { files } = e.dataTransfer
    handleFileChange(files)
  }, [disabled, handleFileChange])

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    onChange?.(null)
    onRemove?.()
  }, [onChange, onRemove])

  const handlePreview = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (value) {
      onPreview?.(value as File | string)
    }
  }, [value, onPreview])

  const handleDownload = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (value) {
      onDownload?.(value as File | string)
    }
  }, [value, onDownload])

  const hasValue = Boolean(value)
  const hasError = Boolean(error)

  const getFileName = () => {
    if (!value) return null
    if (typeof value === 'string') {
      return value.split('/').pop() || 'File'
    }
    if (Array.isArray(value)) {
      return `${value.length} file${value.length > 1 ? 's' : ''} selected`
    }
    return (value as File).name
  }

  const getFileSize = () => {
    if (!value || typeof value === 'string' || Array.isArray(value)) return null
    const bytes = (value as File).size
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-normal tracking-tight text-white">
          {label}
          {required && <span className="text-primary ml-1">*</span>}
        </label>
      )}

      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'border border-dashed rounded-lg transition-all duration-200',
          isDragging && !disabled
            ? 'border-primary bg-primary/5'
            : hasError
            ? 'border-red-500/50 bg-red-500/5'
            : 'border-white/20 hover:border-white/40',
          disabled && 'opacity-50 cursor-not-allowed',
          !hasValue && 'p-6'
        )}
      >
        {!hasValue ? (
          <div className="text-center space-y-4">
            <Upload className={cn(
              'w-8 h-8 mx-auto transition-colors',
              isDragging ? 'text-primary' : 'text-gray-400'
            )} />
            <div>
              <label htmlFor={inputId} className="cursor-pointer">
                <span className="text-xs text-primary hover:text-[#BD2CD0] transition-colors">
                  Click to upload
                </span>
                <span className="text-xs text-gray-400"> or drag and drop</span>
              </label>
              <input
                ref={inputRef}
                id={inputId}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={(e) => handleFileChange(e.target.files)}
                disabled={disabled}
                required={required}
                className="hidden"
                aria-describedby={cn(error && errorId, helperText && helperId)}
                aria-invalid={hasError}
              />
            </div>
            {helperText && !error && (
              <p id={helperId} className="text-xs text-gray-400">
                {helperText}
              </p>
            )}
          </div>
        ) : (
          <div className="p-4">
            {showPreview && preview && (
              <div className={cn('mb-4 flex justify-center', previewClassName)}>
                {renderPreview ? (
                  renderPreview(value as File | string)
                ) : (
                  <img
                    src={preview}
                    alt={getFileName() || 'Preview'}
                    className="max-w-full max-h-32 rounded-lg"
                  />
                )}
              </div>
            )}

            {!showPreview && (
              <div className="flex items-center justify-center mb-4">
                <File className="w-8 h-8 text-gray-400" />
              </div>
            )}

            <div className="text-center space-y-2">
              <p className="text-xs font-normal text-white">{getFileName()}</p>
              {getFileSize() && (
                <p className="text-xs text-gray-400">{getFileSize()}</p>
              )}

              {showActions && (
                <div className="flex gap-2 justify-center mt-3">
                  {onPreview && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePreview}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                  )}
                  {onDownload && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDownload}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRemove}
                    disabled={disabled}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p
          id={errorId}
          className="text-sm text-red-500 font-medium flex items-center space-x-2"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}

FileInput.displayName = 'FileInput'

