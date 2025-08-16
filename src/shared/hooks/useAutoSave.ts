import { useCallback, useEffect, useRef, useState } from 'react'

// Custom debounce function to avoid lodash dependency
function debounce<T extends (...args: never[]) => void>(
  func: T,
  delay: number
): T & { cancel: () => void } {
  let timeoutId: NodeJS.Timeout | null = null

  const debouncedFunction = ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => func(...args), delay)
  }) as T & { cancel: () => void }

  debouncedFunction.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return debouncedFunction
}

interface UseAutoSaveOptions<T> {
  /**
   * Function to save the data
   */
  onSave: (data: T) => Promise<boolean>
  
  /**
   * Debounce delay in milliseconds
   */
  delay?: number
  
  /**
   * Whether auto-save is enabled
   */
  enabled?: boolean
  
  /**
   * Callback when save succeeds
   */
  onSaveSuccess?: () => void
  
  /**
   * Callback when save fails
   */
  onSaveError?: (error: Error) => void
}

interface UseAutoSaveReturn {
  /**
   * Current save status
   */
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
  
  /**
   * Trigger a manual save
   */
  triggerSave: () => void
  
  /**
   * Reset the save status
   */
  resetStatus: () => void
  
  /**
   * Whether there are unsaved changes
   */
  hasUnsavedChanges: boolean
}

export function useAutoSave<T>(
  data: T,
  options: UseAutoSaveOptions<T>
): UseAutoSaveReturn {
  const {
    onSave,
    delay = 1000,
    enabled = true,
    onSaveSuccess,
    onSaveError
  } = options

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const previousDataRef = useRef<T>(data)
  const saveTimeoutRef = useRef<NodeJS.Timeout>()

  // Debounced save function
  const debouncedSave = useCallback(() => {
    const saveFunction = debounce(async (dataToSave: T) => {
      if (!enabled) return

      setSaveStatus('saving')
      try {
        const success = await onSave(dataToSave)
        if (success) {
          setSaveStatus('saved')
          setHasUnsavedChanges(false)
          onSaveSuccess?.()
          
          // Auto-reset to idle after 2 seconds
          saveTimeoutRef.current = setTimeout(() => {
            setSaveStatus('idle')
          }, 2000)
        } else {
          setSaveStatus('error')
          onSaveError?.(new Error('Save failed'))
        }
      } catch (error) {
        setSaveStatus('error')
        onSaveError?.(error as Error)
      }
    }, delay)
    
    return saveFunction
  }, [onSave, enabled, delay, onSaveSuccess, onSaveError])

  // Trigger save when data changes
  useEffect(() => {
    const hasChanged = JSON.stringify(data) !== JSON.stringify(previousDataRef.current)
    
    if (hasChanged && enabled) {
      setHasUnsavedChanges(true)
      setSaveStatus('idle')
      debouncedSave()(data)
      previousDataRef.current = data
    }
  }, [data, debouncedSave, enabled])

  // Manual save trigger
  const triggerSave = useCallback(() => {
    const saveFunc = debouncedSave()
    saveFunc.cancel()
    saveFunc(data)
  }, [debouncedSave, data])

  // Reset status
  const resetStatus = useCallback(() => {
    setSaveStatus('idle')
    setHasUnsavedChanges(false)
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
  }, [])

  // Cleanup
  useEffect(() => () => {
      const saveFunc = debouncedSave()
      saveFunc.cancel()
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }, [debouncedSave])

  return {
    saveStatus,
    triggerSave,
    resetStatus,
    hasUnsavedChanges
  }
}
